# 前端

## 使用 Html 书写的 Demo 使用 import 语法

参考链接: https://juejin.cn/post/7226448512627359781

使用 script 标签的 `type="importmap"`

```
<script type="importmap">
{
  "imports": {
    "dayjs": "https://cdn.skypack.dev/dayjs@1.10.7",
    "react": "https://unpkg.com/react@17.0.2/umd/react.development.js",
    "react-dom": "https://cdn.skypack.dev/react-dom",
    "square": "./modules/square.js",
    "lodash": "/node_modules/lodash-es/lodash.js"
  }
}
</script>
<script type="module">
  import dayjs from 'dayjs';

  console.log(dayjs('2019-01-25').format('YYYY-MM-DDTHH:mm:ssZ[Z]'));
</script>
```

## 好用的全局 npm 包

- serve 静态文件服务器
- live-server vscode 差用插件

## fc

```txt
[
    {
        "value": "http://10.36.20.42:1000/smp/smp-manage-web"
    },
    {
        "value": "http://10.36.20.42:1000/trace/project"
    },
    {
        "value": "http://10.36.20.42:1000/smp/front-assets"
    },
    {
        "value": "http://10.36.20.42:1000/smp/smp-micro-web"
    },
    {
        "value": "http://10.36.20.42:1000/smp/svolt-smp"
    },
    {
        "value": "http://10.36.20.42:1000/smp/uwb-dingding"
    },
    {
        "value": "http://10.36.20.42:1000/smp/party-affairs-app"
    },
    {
        "value": "http://10.36.20.42:1000/mds/report-manage-web"
    },
    {
        "value": "http://10.36.20.42:1000/smp/smp-dw-app"
    },
    {
        "value": "http://10.36.20.42:1000/sds/svolt-ds-web"
    },
    {
        "value": "http://10.36.20.42:1000/wangjunjie/fcny_books"
    },
    {
        "value": "http://10.36.20.42:1000/sds/senior-reserve-app"
    }
]
```

### PC

- ds-web
- /trace/project
- front-asset

- smp-manage-app
  1. 目录 basePriceCalc
  2. 优秀组件 jsRender customField
- front(EMS 项目)
  1. 目录 dev-ops/work-order、knowledge-base、device-manage
  2. components/DictSelect exportButton forgetPasswordDaialog 优秀组件 tables
- onex-ui (vue3+ts)
  1. 目录 energy-mgt oc/sm
     > 新增/编辑弹框 form rest 问题 使用 resetFields 思路: 打开弹框时执行 reset,使得 form 内容为空, 然后在给 form 赋值

### H5

- jyr-app (精益人员定位)

### app

- gsy-app(储能工商业)
- gsy-app-cli uniapp(cli 打包方式)

## Threejs

参见有道云笔记
