# Uniapp

多端应用开发框架, vue2/3

## uniapp 到底如何做用户登录

App.vue 中 `onLaunch` 生命周期中如果有异步执行, 不能够阻塞页面级 onLoad 方法, 解决方案如下

1. https://blog.csdn.net/ltc_Yan/article/details/130851715 巧妙利用 Promise Vue3 版本https://juejin.cn/post/7117586078013341732
2. 预制首页为空白页, 在空白页中处理逻辑

   ```vue
   <template>
     <div></div>
   </template>
   <script setup lang="ts">
   import { BACK_URL } from '@/enums/cacheEnums'
   import { useUserStore } from '@/stores/user'
   import cache from '@/utils/cache'
   import { onLoad, onShow } from '@dcloudio/uni-app'
   const userStore = useUserStore()
   onShow(() => {
     // #ifdef MP-WEIXIN
     if (wx.hideHomeButton) {
       wx.hideHomeButton()
     }
   })
   onLoad(async () => {
     console.log('login onLoad')

     uni.showLoading({
       title: '请稍后...'
     })
     if (!cache.get('tenantId')) {
       userStore.logout()
       uni.hideLoading()
       uni.reLaunch({
         url: '/pages/tenant/tenant'
       })
     } else if (!userStore.isLogin) {
       uni.showLoading({
         title: '登录状态已过期,自动登录中...'
       })
       const data = await userStore.codeLogin()
       if (data) {
         setTimeout(() => {
           goPrePage()
         }, 1000)
       } else {
         uni.$u.toast('登录失败, 请退出重试')
       }
     } else {
       await userStore.getUser()
       goPrePage()
     }
   })
   const goPrePage = () => {
     uni.hideLoading()
     const pages = getCurrentPages()
     if (pages.length > 1) {
       const prevPage = pages[pages.length - 2]
       uni.navigateBack({
         success: () => {
           // @ts-ignore
           const { onLoad, options } = prevPage
           // 刷新上一个页面
           onLoad && onLoad(options)
         }
       })
     } else if (cache.get(BACK_URL)) {
       uni.redirectTo({
         url: cache.get(BACK_URL),
         fail() {
           uni.switchTab({
             url: cache.get(BACK_URL)
           })
         }
       })
     } else {
       uni.reLaunch({
         url: '/pages/index/index'
       })
     }
     cache.remove(BACK_URL)
   }
   </script>
   ```

## 拦截器

uni.addInterceptor() , 通过 Interceptor 实现，https://github.com/dcloudio/uni-app/blob/alpha/src/core/helpers/interceptor.js我们可以看到。
invoke 可以接收一个 promise。那么我们就可以在 invoke 中返回一个 Promise 来处理异步方法

```js
uni.addInterceptor('navigateTo', {
  invoke(args) {
    return new Promise((resolve) => {
      resolve(args)
    })
  }
})
```

> 路由拦截只能拦截 uni 对象上路由跳转的方法, 对于 H5 首次进入页面时候拦截不到, 可以使用 app = getApp()身上的$router (uni-app 的 H5 端，自带了 vue.js、vue-router 及部分 es6 polyfill 库，这部分的体积 gzip 后只有 92k，和 web 开发使用 vue 基本一致。)的拦截器, 例如在 setupRouter 中

    ```js
    // #ifdef H5
    const app = getApp()
    // 非根路径进入应用跳转到登录页
    let firstEnter = true
    app.$router.beforeEach((to, from, next) => {
      if (firstEnter && to.path !== '/') {
        cache.set(BACK_URL, to.fullPath)
        next('/pages/login/login')  // 跳转到登录页
      } else {
        next()
      }
      firstEnter = false
    })
    // #endif
    ```

## Hbuilder

开发工具, 新建项目 选择模板即可

- uni-starter 集成商用项目常见功能的、云端一体应用快速开发项目模版。
- uni-admin 后台管理系统模板

## 开发注意事项

- 使用 uni-cli 创建的项目在选定 uniapp 版本后， 建议 package.json 中锁定 uni 框架包版本
- 跨端方面 https://uniapp.dcloud.net.cn/matter.html
- 工程目录方面 在 page 目录下`新建一个页面目录，然后创建一个目录同名的.vue文件`, 自定义组件：放到 component 目录(会被 easycom 解析)
- h5 开发注意事项：https://uniapp.dcloud.net.cn/matter.html#h5-%E5%BC%80%E5%8F%91%E6%B3%A8%E6%84%8F 引用第三方 js 的方式, h5 导航栏问题
- 小程序开发注意： https://uniapp.dcloud.net.cn/matter.html#mp

## 部署

- 部署教程 https://uniapp.dcloud.net.cn/quickstart-hx.html#%E5%8F%91%E5%B8%83uni-app

## uni-id 用户体系

uni-id-pages，是 uni-id 体系的一部分。

## 云函数/云对象

在 unicloud/cloudfunctions 目录中,使用 commonjs 规范, 目录中 右击 `新建云函数`

### 云函数

生成一个目录,目录下自动生成 index.js 不可改名。代码运行在云端 nodejs 中

#### 说明

- 可以在云函数中执行任意 nodejs 支持的操作, 可以安装依赖库, 可以在这个 js 中 require 该云函数目录下的其他 js、json 文件。
- unicloud 的云函数环境`内置了uniCloud对象` 对象内置了网络,数据库等各种 API <a href="https://uniapp.dcloud.net.cn/uniCloud/cf-functions.html#unicloud-api%E5%88%97%E8%A1%A8">API 详细</a>
- 每个云函数是一个 js 包，在云函数被调用时，由 serverless 调度系统分配硬件资源启动一个 node 环境来运行这个云函数。
- 云函数启动后实例会保留一段时间（如 15 分钟），超过保留期后若该云函数一直没有被再调用，那这个实例会被释放。所以云函数有冷启动的概念。不过由于 js 实例的启动要比 php 和 java 更快，所以 js 更适合 serverless 方式。
- 使用 `uniCloud.callfunction("")` 调用
- 云函数 URL 化: 可以让云函数/云对象生成一个 HTTP URL。这样非 uni-app 应用，可以通过 ajax 请求和云函数/云对象通信

### 云对象

生成一个目录, 目录下自动生成 index.obj.js 不可改名。

- 前端代码调用云对象:
  ```js
  const helloco = uniCloud.importObject('helloco') // 导入云对象
  try {
    const res = await helloco.sum(1, 2) //导入云对象后就可以直接调用该对象的sum方法了，注意使用异步await
    console.log(res) // 结果是3
  } catch (e) {
    console.log(e)
  }
  ```

### 公共模块

uniCloud/cloudfunctions/common 目录

用于不同的云函数/云对象，抽取和共享相同代码

## 云数据库

使用 clientDb 客户端可以直接操作云数据库: 通过`<uniCloud-db>`组件或 uniCloud.database() API 来访问 uniCloud 数据库。也支持搭配 action 云函数追加服务器逻辑

## 条件编译

```js
// #ifdef H5

/// #endif
```

## 打包部署

### 跨端应用 ajax 前缀路径设置

一种是代码托管需要我们自己放在 web 容器中, 然后在平台上或者告诉用户我们应用的地址, ajax 前缀直接设置成'/' 即可

另一种是微信小程序那样代码托管在平台中, 需要将 ajax 前缀设置成我们的网关等正确的地址

uniapp 默认只有两个环境, 一个是运行(开发)环境, 一个是发行(正式)环境, 对于一套系统会有测试、正式环境, uni-app 提供了小程序/h5 端解决方案

> https://uniapp.dcloud.net.cn/collocation/package.html

> https://blog.csdn.net/wangjun5159/article/details/124110108
