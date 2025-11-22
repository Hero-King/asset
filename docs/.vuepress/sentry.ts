import * as Sentry from '@sentry/vue'
import type { App } from 'vue'
import packageInfo from '../../package.json'
export const setupSentry = (app: App, router: any) => {
  // 初始化 Sentry
  app.config.globalProperties.Sentry = Sentry.init({
    app,
    enabled: process.env.NODE_ENV === 'production',
    // 1. 标识和认证您的 Sentry 项目
    dsn: 'https://fa8f1872d0b65fe5e1aaec2a205f8751@o4507548567207936.ingest.us.sentry.io/4510406498189312',

    // 3. 环境区分（开发/生产）：仅生产环境上报错误（避免开发时冗余日志）
    environment: process.env.NODE_ENV,

    // 4. 版本号（建议与 package.json 版本一致，便于定位问题版本）
    release: `vuepress-blog@${packageInfo.version}`,

    // 5. 性能监控 采样率（生产环境建议 0.1~1，避免过多事件消耗免费额度）
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 0,
    // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
    tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],

    // 错误采样率
    sampleRate: 1,

    // 6. 集成追踪功能（监控路由切换、接口请求等）
    integrations: [
      // 浏览器性能监控 & 请求追踪
      // Sentry.browserTracingIntegration({ router })
      // Sentry.replayIntegration(),

      // 错误反馈功能
      Sentry.feedbackIntegration({
        // Additional SDK configuration goes in here, for example:
        colorScheme: "system",
      }),
    ],

    // 7. 可选：忽略不需要上报的错误（如第三方 SDK 报错、良性错误）
    ignoreErrors: [
      'Script error.', // 跨域脚本错误（若已配置 CORS 可删除）
      'ResizeObserver loop limit exceeded',
      'ThirdPartySDKError' // 示例：忽略特定第三方错误
    ],

    // 8. 可选：自定义用户信息（便于定位特定用户的错误，需谨慎处理隐私）
    beforeSend(event) {
      // 示例：添加用户 ID（若项目有用户系统）
      if (localStorage.getItem('userId')) {
        event.user = { id: localStorage.getItem('userId') }
      }
      return event
    },

    // 9. 可选：发送默认 PII 信息（如 IP 地址, 请求头）
    sendDefaultPii: true,

    debug: process.env.NODE_ENV === 'development',
    // Enable logs to be sent to Sentry
    enableLogs: true
  })
}
