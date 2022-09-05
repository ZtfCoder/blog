import { defineConfig } from "vitepress";
import getSidebar from "./getSidebar";
export default defineConfig({
  // ...
  title: "VitePress-Fun",
  // 是否显示上次更新时间
  lastUpdated: true,
  // 主题配置
  themeConfig: {
    // 导航配置
    nav: [
      {
        text: "关于我",
        link: "/about",
      },
    ],
    // 侧边栏配置
    sidebar: getSidebar(),
  },
});
