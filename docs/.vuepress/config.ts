import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import theme from "./theme";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "HeroKing博客",
  description: "学习犹如逆水行舟",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,

  bundler: viteBundler({
    viteOptions: {
      server: {
        allowedHosts: [".heroking.top"],
      },
    },
    vuePluginOptions: {},
  }),
});
