import { defineConfig } from "vitepress";
import getSidebar from "./getSidebar";
import markdownImagePreview from "./plugins/imagePreview";
export default defineConfig({
  // ...
  head: [
    [
      "meta",
      {
        name: "google-site-verification",
        content: "eLQHfdBDlTdTLXtNSNAeDoT6xDNxKy3ZndFojW5LDJg",
      },
    ],
    ["link", { rel: "icon", href: "/favicon.ico" }],
  ],
  description: "Baka-Blog",
  title: "Baka-Blog",
  // 是否显示上次更新时间
  lastUpdated: true,
  markdown: {
    lineNumbers: true,
    config: (md) => {
      md.use(markdownImagePreview);
    },
  },
  sitemap: {
    hostname: "https://ztfcoder.github.io",
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
        text: "hxg专属",
        link: "/hxg/",
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
            link: "/后端/",
          },
          {
            text: "杂烩",
            link: "/杂烩/",
          },
        ],
      },
      {
        text: "关于我",
        link: "/about",
      },
      {
        text: "realme",
        items: [
          {
            text: "我的日志",
            link: "/realme/mylog/",
          },
          {
            text: "我的故事",
            link: "/realme/mystory/",
          },
        ],
      },
    ],
    lastUpdated: {
      text: "上次更新时间",
    },
    search: {
      provider: "algolia",
      options: {
        appId: "JM5U0C0N8U",
        apiKey: "270868394ba076fb646fbd2b8863ffad",
        indexName: "ztfcoderio",
      },
    },
    // 侧边栏配置
    sidebar: getSidebar(
      "/main/",
      "/myUtils/",
      "/杂烩/",
      "/realme/mystory/",
      "/realme/mylog/",
      "/hxg/"
    ),
    // lastUpdatedText: "上次更新时间",
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
  },
  ignoreDeadLinks: true,
  metaChunk: true,
});
