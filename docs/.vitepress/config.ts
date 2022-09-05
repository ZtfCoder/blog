import { defineConfig } from "vitepress";
import getSidebar from "./getSidebar";
export default defineConfig({
  // ...
  title: "Baka-Blog",
  // 是否显示上次更新时间
  lastUpdated: true,
  markdown: {
    lineNumbers: true,
  },
  // 主题配置
  themeConfig: {
    socialLinks: [{ icon: "github", link: "https://github.com/ZtfCoder/blog" }],
    logo: "/head.jpg",
    // 导航配置
    nav: [
      {
        text: "笔记",
        link: "/main/",
      },

      {
        text: "常用工具",
        items: [
          {
            text: "前端常用工具",
            link: "/myUtils/工具集/",
          },
          {
            text: "后端常用工具",
            link: "/myUtils/工具集/",
          },
        ],
      },
      {
        text: "关于我",
        link: "/about",
      },
    ],
    // 侧边栏配置
    sidebar: getSidebar("/main/", "/myUtils/"),
    lastUpdatedText: "上次更新时间",
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
  },
});
