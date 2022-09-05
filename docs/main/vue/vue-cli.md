---
title: vue 入门-cli
tags:
  - vue
  - 前端
categories: vue
abbrlink: 7ee75e14
---

终于要看到`npm`这个玩意了

## node.js

首先安装 `node.js`

http://nodejs.cn/download/ 

很简单,无脑下一步就好了
<!-- more -->
安装成功后,用cmd 测试下命令 `npm`  `npm-v`

完成后,需要安装,一些组件,包,淘宝镜像

~~~cmd
npm install cnpm -g
~~~

之后,我们使用`cnpm`  命令来安装一些组件 

## 安装 vue-cli

在`cmd` 窗口输入

 ~~~cmd
cnpm install vue-cli -g
 ~~~



初始化了后,会出现很多文件,其中,`package.json` 这个就相当于是`maven`  等下,我们需要去加载它的依赖



进入到我们初始化后的文件中,打开`cmd` 输入

~~~cmd
npm install
~~~

它会去加载所需要的依赖,和环境

如果安装最后出现

![image-20210112170455100](https://images.wupeiyao.top/notes/20210509192224.png)

出现错误,我们根据npm的提示,输入 它提示的信息,进行修复就可以了

## 安装webpack 

webpack 是前端的项目构建工具,类似maven打包工具

我们需要安装webpack

~~~cmd
npm install webpack -g

npm install webpack-cli -g
~~~



### 补充知识ES6

**hello.js**

```js
//暴露 这个方法 
exports.sayHi = function (){
    document.write("hello")
}
//exports 暴露某个方法或者变量,以便其他地方能够导入
```



**main.js**

```js
//接收导入的东西,相当于是引入了一个类的对象,我们可以通过这个对象,调用内部暴露的方法
var re = require("./hello");
re.sayHi()

```

最后我们写一个配置的js`webpack.config.js` 

```js
module.exports = {
    entry:'./modules/main.js',
    output:{
        filename:"./js/bundle.js",//打包的路径
    }
}
```

之后,打开`cmd` 输入

~~~cmd
webpack
~~~



最后,我们只需要在index.html,导入我们打包好的文件就行了



关于`import` 这个和python导包很相似,相同理解就好了,只是,导入进来的是一个对象,并且这个对象的名称由自己决定

比如

~~~js
import VueRouter from "vue-router"
~~~





## vue-router

### 安装 vue-router

~~~cmd
npm install vue-router --save-dev
~~~

### 导入路由



一般单独建立一个js文件来进行路由的配置

首先要导入路由,接着导入vue,因为,我们需要又vue来安装路由

~~~js
//导入路由
import VueRouter from "vue-router"
//导入vue
import Vue from "vue"
~~~

### 安装路由

~~~js
//安装路由
Vue.use(VueRouter);
~~~

### 配置路由

`index.js`

~~~js
//配置 导出路由
export default new VueRouter({
  routes:[
    {
      path:"/component1",//路由地址
      name:"component1", //给路由配置个名字
      component:component1 //组件
    },
    {
      path:"/component2",//路由地址
      name:"component2", //给路由配置个名字
      component:component2 //组件
    }
  ]
});
~~~

> 我们肯定是要导出该路由组件的,因此需要导出它的配置
>
> path 就和requestMapping 差不多,相当于前端能够自由的跳转

配置好`index.js` 后 我们去`main.js` 让它去扫描我们的`index.js`

~~~js
import router from './router'  //自动扫描里面的子路由配置
//只需要导入,index.js所在的文件夹就行了,它会自动帮我们去扫描的
最后在main.js的vue对象中启动路由
~~~

### 启动路由

~~~js
import Vue from 'vue'
import App from './App'

import router from './router'  //自动扫描里面的子路由配置

new Vue({
  el: '#app',
  //配置路由,启动路由
  router,
  components: { App },
  template: '<App/>'
})
~~~

使用的话,使用 `to="component1"` 相当于是href  属性

~~~js
<router-link to="component1">组件1</router-link>
<router-link to="component2">组件2</router-link>
<router-view></router-view>
~~~



在方法中跳转路由

~~~js
 this.$router.push("/main"); //这样就可以跳转到/mian 这个页面

// 有时候需要传递参数
this.$router.push({ name: 'user', params: { userId: 123 }}) 

~~~

#### 创建一个小工程

~~~cmd
#首先安装vue 标准项目
vue init webpack 项目名称

# 进入生成出来的项目文件夹
cd 项目名称

# 安装vue-router
npm install vue-router --save-dev

# 安装element-ui
npm i element-ui -S

# 安装依赖
npm install

# 安装SASS加载器
cnpm install sass-loader node-sass --save-dev
# 有可能之后会报错,原因有时候是sass版本太高,修改sass 版本 "^7.3.1"

# 运行vue项目
npm run dev

说明
--save 的意思是将该模块安装到项目目录下,并在package 文件中的dependencies 节点写入依赖 
-S 是--save 命令的缩写

--save-dev 的意思是将该模块安装到项目目录下,并在package 文件中的devDependencies 节点写入依赖
-D 是--save-dev 命令的缩写
~~~





### 关于vue-router

查看文档 https://router.vuejs.org/zh



## $refs

使用

~~~vue
<el-form ref="dynamicValidateForm1" >
</el-form>

# 用法一
this.$refs[组件中 ref 声明的名称] 

这样就可以获取ref 声明的对象

# 用法二
this.$refs.ref 声明的名称


~~~

