import { defineConfig } from "vitepress";

export default defineConfig({
  // ...
  title: "ztf",
  // 是否显示上次更新时间
  lastUpdated: true,
  // 主题配置
  themeConfig: {
    // 导航配置
    nav: [
      {
        text: "导航",
        items: [
          { text: "导航1", link: "/导航1" },
          { text: "导航1", link: "/导航2" },
        ],
      },
    ],
    // 侧边栏配置
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Introduction", link: "/introduction" },
          { text: "Getting Started", link: "/getting-started" },
        ],
      },
    ],
  },
});
