import { defineConfig } from 'vuepress/config'
import nav from './nav.js'

// 搭建网站参考链接: https://github.com/shanyuhai123/documents/blob/master/docs/.vuepress/config/navConf.ts
export default defineConfig({
  description: '学习犹如逆水行舟,不进则退',
  title: 'HeroKing的个人笔记',
  // base: '/', //Vue原型上有 $withBase 取值当前base 部署在非跟目录: /asset/
  dest: './dist', // 设置输出目录

  plugins: [
    [
      // https://shanyuhai123.github.io/vuepress-plugin-auto-sidebar/zh/#%E4%BB%8B%E7%BB%8D
      'vuepress-plugin-auto-sidebar',
      {
        title: {
          // 更多选项:
          // `default`、`lowercase`、`uppercase`、`capitalize`、`camelcase`、`kebabcase`、`titlecase`
          mode: 'titlecase'
        },
        git: {
          trackStatus: 'add'
        }
      }
    ]
  ],

  configureWebpack: {
    resolve: {
      alias: {
        // '@alias': 'path/to/some/dir'
      }
    }
  },

  themeConfig: {
    nav: nav
    // 为以下路由添加侧边栏
    // sidebarDepth: 1,
    // displayAllHeaders: true // 默认值：false 显示所有页面的标题链接
  }
})
