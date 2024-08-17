---
title: uniapp 介绍
tags:
  - uniapp
  - 小程序
categories: uniapp
abbrlink: '7318549'
---
# uviewui

uView是uni-app生态专用的UI框架，uni-app 是一个使用 Vue.js 开发所有前端应用的框架，开发者编写一套代码， 可发布到iOS、Android、H5、以及各种小程序(微信/支付宝/百度/头条/QQ/钉钉)等多个平台(引言自uni-app网)。

[文档](https://www.uviewui.com/components/intro.html)

首先使用 hubilde 创建一个uniapp 新项目,使用默认模板
<!-- more -->
![image-20210518101428788](https://images.wupeiyao.top/notes/20210518101450.png)

创建成功后,安装 `uviewui `组件,

[插件商城](https://ext.dcloud.net.cn/plugin?id=1593),点击使用 `hubilde  x` 导入 导入

之后会下载一个`uviewui ` 的文件

我们将`uview-ui` 这个文件夹移动到我们的项目根目录下

![image-20210518101735080](https://images.wupeiyao.top/notes/20210518101829.png)

![image-20210518101815749](https://images.wupeiyao.top/notes/20210518101831.png)

之后,进行组件配置 **采用的是下载安装的方式**

首先需要依赖[SASS](https://www.sass.hk/)  

这里如果我们没有安装sass 的需要使用HX菜单的 工具->插件安装中找到"scss/sass编译"插件进行安装

### 1 引入uView主JS库

在项目根目录中的`main.js`中，引入并使用uView的JS库，注意这两行要放在`import Vue`之后。

```js
import uView from "uview-ui";
Vue.use(uView);
```

#### 2.引入uView的全局SASS主题文件

在项目根目录的`uni.scss`中引入此文件。

```css
@import 'uview-ui/theme.scss';
```

> 注意！
>
> 在`App.vue`中**首行**的位置引入，注意给style标签加入lang="scss"属性

```css
<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
</style>
```