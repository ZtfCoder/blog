---
title: vscode的vue项目问题整理
tags:
  - vue
  - 前端
categories: vue
abbrlink: 7b9f6892
---

最近用了段时间**vscode 和 vue 工程项目** 说了我踩的坑

> 主要是针对 vue 工程项目

## 问题一

之前喜欢用 WebStore 用那个`@` 省略路径的时候,IDE 不识别,无法提示之类的

<!--more-->

**解决方案**

项目根目录下,创建了一个文件`alias.config.js`

```js
// WebStorm 识别webpack  自定义别名 @
const resolve = (dir) => require("path").join(__dirname, dir);
module.exports = {
  resolve: {
    alias: {
      "@": resolve("src"),
      "@api": resolve("src/api"),
    },
  },
};
```

选择这样的配置,将路径配置正确,选择刚才我们创建的文件 这样就能解决这个问题

## 问题二

所以这个`@` 是怎么设置的呢

因为使用的是最新的脚手架工具 @vue/cli ，它不会生成任何 webpack 文件，所以需要手动创建。 根据官方文档 ：需要创建`vue.config.js` 也是在根目录下

```js
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@api", resolve("src/api"));
    // 这里只写了两个个，你可以自己再加，按这种格式.set('', resolve(''))
  },
};
```

问题就可以解决

## 问题三

vscode 设置路径跳转,默认不安装插件是无法跳转的

安装插件`Path Intellisense`

也是在根目录创建一个文件

`jsconfig.json`

```json
// vscode 点击进入 @ 路径
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "allowSyntheticDefaultImports": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@api/*": ["src/api/*"]
    }
  },
  "exclude": ["node_modules"]
}
```

根据自己的配置来设置吧,就可以愉快的跳转其他文件的方法拉

## 插件推荐

汉化:`Chinese (Simplified) Language Pack for Visual Studio Code`

热更新:`Live Server`

路径跳转:`Path Intellisense`

vue 语法高亮:`Vetur`

vue 风格图标显示:`Vue Theme` (超级喜欢)

WebStorm 默认风格(含代码颜色和界面颜色):`WebStorm Darcula Theme ` (超级喜欢, Java 开发狂喜)

vscode 配置

```json
{
  "editor.formatOnType": true,
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.fontLigatures": true,
  "editor.linkedEditing": true,
  "editor.suggest.preview": true,
  "editor.guides.bracketPairs": true,
  "editor.inlineSuggest.enabled": true,
  "editor.bracketPairColorization.enabled": true,
  "editor.suggest.snippetsPreventQuickSuggestions": false,
  "editor.fontFamily": "'Cascadia Code', Consolas, Menlo, Monaco, 'Courier New', 黑体, monospace",
  "debug.console.fontFamily": "'Cascadia Code', Consolas, Menlo, Monaco, 'Courier New', 黑体, monospace",
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.organizeImports": true
  },
  "terminal.integrated.shellIntegration.enabled": true,
  "remote.localPortHost": "allInterfaces",
  "files.autoGuessEncoding": true,
  "files.insertFinalNewline": true,
  "files.trimFinalNewlines": true,
  "files.trimTrailingWhitespace": true,
  "security.workspace.trust.untrustedFiles": "open",
  "scm.inputFontFamily": "editor",
  "git.autofetch": true,
  "git.confirmSync": false,
  "remote.containers.defaultExtensions": [
    "eamodio.gitlens",
    "TeamHub.teamhub",
    "mintlify.document",
    "mhutchie.git-graph",
    "clippy-ai.clippy-ai",
    "joshbolduc.commitlint",
    "cweijan.vscode-office",
    "Gruntfuggly.todo-tree",
    "GitHub.copilot-nightly",
    "redjue.git-commit-plugin",
    "EditorConfig.EditorConfig",
    "mutantdino.resourcemonitor",
    "intellsmi.comment-translate",
    "spmeesseman.vscode-taskexplorer",
    "streetsidesoftware.code-spell-checker",
    "VisualStudioExptTeam.vscodeintellicode",
    "VisualStudioExptTeam.intellicode-api-usage-examples"
  ],
  "remote.SSH.defaultExtensions": [
    "eamodio.gitlens",
    "TeamHub.teamhub",
    "mintlify.document",
    "mhutchie.git-graph",
    "clippy-ai.clippy-ai",
    "joshbolduc.commitlint",
    "cweijan.vscode-office",
    "Gruntfuggly.todo-tree",
    "GitHub.copilot-nightly",
    "redjue.git-commit-plugin",
    "EditorConfig.EditorConfig",
    "mutantdino.resourcemonitor",
    "intellsmi.comment-translate",
    "spmeesseman.vscode-taskexplorer",
    "streetsidesoftware.code-spell-checker",
    "VisualStudioExptTeam.vscodeintellicode",
    "VisualStudioExptTeam.intellicode-api-usage-examples"
  ],
  "remote.SSH.remotePlatform": {
    "192.168.1.4": "linux"
  },
  "gitlens.plusFeatures.enabled": false,
  "docwriter.language": "Chinese",
  "docwriter.progress.trackClasses": true,
  "docwriter.progress.trackTypes": true,
  "http.systemCertificates": false,
  "workbench.colorCustomizations": {},
  "workbench.iconTheme": "vscode-icons",
  "docwriter.hotkey.windows": "Alt + .",
  "GitLive.Issue tracker integration": "Disabled",
  "GitLive.Hide my activity graph": true,
  "vsicons.dontShowNewVersionMessage": true,
  "git.enableSmartCommit": true,
  "window.autoDetectColorScheme": true,
  "redhat.telemetry.enabled": true,
  "git.mergeEditor": true,
  "GitCommitPlugin.ShowEmoji": false,
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "javascript.updateImportsOnFileMove.enabled": "always",
  "github.copilot.enable": {
    "*": true,
    "yaml": false,
    "plaintext": false,
    "markdown": false,
    "typescript": true
  },
  "leetcode.hint.commandShortcut": false,
  "leetcode.hint.configWebviewMarkdown": false,
  "leetcode.defaultLanguage": "typescript",
  "leetcode.hint.commentDescription": false,
  "hediet.vscode-drawio.codeLinkActivated": false
}
```
