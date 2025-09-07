# VueCli

Vue 项目脚手架

## 组成

- CLI 提供 vue 命令
- CLI 服务(@vue/cli-service) 提供 vue-cli-service 命令
- CLI 插件 是向你的 Vue 项目提供可选功能的 npm 包; 名字以 @vue/cli-plugin- (内建插件) 或 vue-cli-plugin- (社区插件) 开头

## 安装

npm install -g @vue/cli

## 使用

- 创建一个项目 `vue create projectName`
- 使用图形界面 `vue ui`
- 启动开发 server `vue-cli-service serve`
- 项目打包 `vue-cli-service build`
- 查看帮助 `vue-cli-service help `
- 查看 webpack 配置 `vue-cli-service inspect`

### vue-cli-service serve

```shell
用法：vue-cli-service serve [options] [entry]

选项：

  --open    在服务器启动时打开浏览器
  --copy    在服务器启动时将 URL 复制到剪切版
  --mode    指定环境模式 (默认值：development)
  --host    指定 host (默认值：0.0.0.0)
  --port    指定 port (默认值：8080)
  --https   使用 https (默认值：false)
```

### vue-cli-service build

```
用法：vue-cli-service build [options] [entry|pattern]

选项：

  --mode        指定环境模式 (默认值：production)
  --dest        指定输出目录 (默认值：dist)
  --modern      面向现代浏览器带自动回退地构建应用
  --target      app | lib | wc | wc-async (默认值：app)
  --name        库或 Web Components 模式下的名字 (默认值：package.json 中的 "name" 字段或入口文件名)
  --no-clean    在构建项目之前不清除目标目录的内容
  --report      生成 report.html 以帮助分析包内容
  --report-json 生成 report.json 以帮助分析包内容
  --watch       监听文件变化
```

## 开发

### Html
public/index.html 文件是一个会被 html-webpack-plugin 处理的模板。
#### 插值
<%= VALUE %> 用来做不转义插值；
<%- VALUE %> 用来做 HTML 转义插值；
<% expression %> 用来描述 JavaScript 流程控制。

<p>除了<a href="https://github.com/jantimon/html-webpack-plugin#writing-your-own-templates" target="_blank" rel="noopener noreferrer">被 <code>html-webpack-plugin</code> 暴露的默认值</a>之外，所有<a href="./mode-and-env.html#using-env-variables-in-client-side-code">客户端环境变量</a>也可以直接使用。例如，<code>BASE_URL</code> 的用法：</p>