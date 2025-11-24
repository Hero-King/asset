# Vite

优势:

- 一个开发服务器，它基于 原生 ES 模块 提供了 丰富的内建功能
- 使用 Rollup 打包你的代码
- Vite 天然支持引入 .ts 文件。

## 项目模板

vue /react vue-ts/react-ts

## CLI

- vite(同 vite dev/ vite serve) 启动开发服务器
- vite build 打包

## ts

### vite/client

Vite 默认的类型定义是写给它的 Node.js API ,要将其补充到一个 Vite 应用的客户端代码环境中 需要手动让 ts 编译器 获取到 vite/client

## plugin

- @vitejs/plugin-vue vite 为 Vue 提供第一优先级支持
- @vitejs/plugin-vue-jsx 提供对 JSX / TSX 支持

## css

- 导入 .css 文件将会把内容插入到 `<style>` 标签中
- 能够自动读取项目目录下 css 预处理器配置文件 比如 `postcss.config.js`
- 任何以 .module.css 为后缀名的 CSS 文件都被认为是一个 CSS modules 文件, 导入这样的文件会返回一个相应的模块对象

  ```ts
  // vite/client 中申明了所有样式类型文件模块 到处对象是 string类型
  // .module.css 等模块话样式文件 导出对象是 CSSModuleClasses(type CSSModuleClasses = { readonly [key: string]: string })
  //
  ```

- Vite 的核心是使用现代浏览器的 ESModule 功能, 对样式预处理器不支持, 项目中需要安装对应的预处理器依赖
- 禁用 CSS 注入页面 自动注入 CSS 内容的行为可以通过 ?inline 参数来关闭。在关闭时，被处理过的 CSS 字符串将会作为该模块的默认导出，但样式并没有被注入到页面中。

## Glob 导入

vite 支持使用特殊的 import.meta.glob 函数从文件系统导入多个模块

```ts
const modules = import.meta.glob('./dir/*.js') // 匹配 ./dir 下的所有 .js 文件
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'), // value默认懒加载的，通过动态导入实现 并会在构建时分离为独立的 chunk。如果想同步 那么传入 { eager: true } 作为glob的第二个参数
  './dir/bar.js': () => import('./dir/bar.js')
}
```
