import { defineClientConfig } from 'vuepress/client'
import { setupSentry } from './sentry'

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    if (!__VUEPRESS_SSR__) {
      setupSentry(app, router)
    }
  },
  setup() {},
  rootComponents: []
})
