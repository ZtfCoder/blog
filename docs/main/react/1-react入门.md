---
title: react 第一节
description: react入门
---

## react 入门

react 一个 js 的框架,于 ui 框架不一样,他只包含 js 内容,学 react 框架主要是为了解决传统 HTML 开发难以复用代码的问题,以及优化 html 渲染,其中使用了一门技术叫`虚拟dom`
通过这个技术可以提升浏览器渲染的能力,因为频繁增加删除 dom 会很消耗性能,但是 react 内部帮我们做了这些事,所以用 react 可以减少我们开发者去关注这些与项目开发无关的事,可以专心项目开发

### 快速体验 react

复制一下内容到 html 文件中

```html
<html>
  <head>
    <meta charset="UTF-8" />
    <script src="./js/react.js"></script>
    <script src="./js/react-dom.js"></script>
  </head>

  <body>
    <div id="app"></div>
    <script>
      // 创建一个h1元素, 内容为Hello, world!
      const h1 = React.createElement("h1", null, "Hello, world!");

      // 创建一个react根节点,绑定到app元素上
      const root = ReactDOM.createRoot(document.getElementById("app"));

      // 渲染h1元素到根节点上
      root.render(h1);
    </script>
  </body>
</html>
```

首先我们引入 2 个 react 核心依赖,`react.js` 和`react-dom.js`

> React 分为 react 和 `react-dom` 两个包是为了更好地分离关注点和优化性能。以下是具体原因：
>
> 1. **分离关注点**：
>    - react 包含了 React 的核心库，提供了创建组件、管理状态和生命周期的方法。这部分代码与平台无关，可以在浏览器、服务器（使用 Node.js）或移动设备（使用 React Native）上运行。**React Native 是一个可以用 react 写手机 app 的 依赖包,通过 React Native 我们可以用 html css js 来编写 app 应用**
>    - `react-dom` 包含了与浏览器 DOM 相关的功能，负责将 React 组件渲染到实际的 DOM 中。它提供了 `ReactDOM.render` 方法和与浏览器特定的 API。
> 2. **优化性能**：
>    - 通过将核心库和平台特定的代码分离，React 可以更轻量、更高效。开发者可以只加载需要的部分，而不是整个库，从而减少了应用的体积和加载时间。
> 3. **跨平台支持**：
>    - 这种分离使得 React 可以更容易地支持其他平台。例如，React Native 使用 react 库来创建组件和管理状态，但它有自己的渲染库（而不是 `react-dom`），用于将组件渲染到移动设备的原生视图中。
>
> 总结来说，React 分为 `react`和 `react-dom` 是为了实现更好的模块化设计、优化性能和支持多平台开发。

上面这段代码用到 3 个最为重要的 api `createElement` `createRoot` `createRoot`

createElement :创建一个 react dom,第一个参数表示 我们想要渲染标签,例如 div,h1,ul,li,a 等等,第二个参数表示这个 dom 绑定事件,例如,点击事件,鼠标悬浮事件等等,第三个参数,表示这个标签内容是什么

createRoot: 表示创建一个 react 根节点,react 应用需要有一个根节点,也就是入口,所有的 react dom 都是在根节点内进行渲染,在上面的代码中,我们绑定了一个 id 为`app` 的 div,用这个 div 来当作 react 的根节点

root.render() 表示渲染 dom,让 我们创建的 react dom 渲染到根节点上

我们可以给它绑定一个点击事件,弹出 alert()

```javascript
const h1 = React.createElement(
  "h1",
  {
    onClick: () => alert("这里是onClick"),
  },
  "Hello, world!"
);
```

在这里,`onClick` 与原生 HTML 的 点击事件名称不一样,react 中的事件名都遵守小驼峰命名,原生 html 的点击事件叫`onclick` ,而 react 中叫 `onClick` ,其他事件也是如此

## jsx 语法

在上一节,我们已经可以用 react 创建节点了,但是每次都要用 createElement 创建,非常繁琐,不利于开发, 因此在 react 中提供了一种语法叫`jsx` 语法,可以在 js 中,书写 HTML 标签,并被 react 识别

例如上方的 h1 标签,用 jsx 书写就变成了

```jsx
const H1 = <h1 onClick={()=>alert("这里是onClick")}>Hello, world!<h1>
```

可以看到,已经和我们写 html 代码非常相似了,几乎没有什么不同

但是在 js 中,浏览器是无法识别 H1 对象,因为等号后面,根本不是正确的 js 代码,既不是字符串,也不是 js 对象,为此,我们需要使用一个第三方库,来帮我们转换成正确的 js 代码,让浏览器正确识别

在 html 文件中新增一个 js 依赖

```html
<script src="./js/babel.js"></script>
```

接着修改之前 js 代码部分

```html
<script type="text/babel">
  // 创建一个h1元素, 内容为Hello, world!
  const H1 = <h1 onClick={() => alert("Hello, world!")}>Hello, world!</h1>;

  // 创建一个react根节点,绑定到app元素上
  const root = ReactDOM.createRoot(document.getElementById("app"));

  // 渲染h1元素到根节点上
  root.render(H1);
</script>
```

返回页面,可以看到,内容已经渲染出来了,并且和之前的内容一样

jsx 与 html 标签还有的不同点在于,html 写 class 是

```html
<div class="box"></div>
```

而 jsx 是

```jsx
<div className="box"></div>
```

> 作业: 尝试给 h1 标签 添加一个 class 看看效果

## 插值表达式

jsx 还有一个重要点是插值表达式,和 vue 的{{}} 类型,但是 react 使用{}

插值表达式语法,运行,我们动态的给 dom 元素赋值

例如

```html
<script type="text/babel">
  let text = "Hello, world!";
  // 创建一个h1元素, 内容为Hello, world!
  const H1 = <h1 onClick={() => alert("Hello, world!")}>{text}</h1>;

  // 创建一个react根节点,绑定到app元素上
  const root = ReactDOM.createRoot(document.getElementById("app"));

  // 渲染h1元素到根节点上
  root.render(H1);
</script>
```

创建一个 text 变量,给它初始化值为"Hello, world!",绑定到 h1 上

如果我们在 onClick 中进行修改 h1 的值,可以观察下,页面内容是否变化

```html
<script type="text/babel">
  // 创建一个h1元素, 内容为Hello, world!
  let text = "Hello, world!";

  const handleClick = () => {
    text = "hxg";
    console.log(text);
  };

  const H1 = <h1 onClick={handleClick}>{text}</h1>;

  // 创建一个react根节点,绑定到app元素上
  const root = ReactDOM.createRoot(document.getElementById("app"));

  // 渲染h1元素到根节点上
  root.render(H1);
</script>
```

在这里为了方便观察,,把 onClick 触发的函数放到外面去,修改完打印 text 的值

**打开 f12 控制台观察**

![image-20240815135307925](https://fastly.jsdelivr.net/gh/ZtfCoder/img/image-20240815135307925.png)

可以看到控制台打印了 hxg,但是页面上并未发生变化,这是因为点击的时候并没有触发 react 的渲染机制,页面上的内容是通过 react 渲染出来的,所以我们需要让 react 重新渲染,内容才行,react 提供了一个 api `useState` 来管理页面上动态渲染的内容,和 vue 中的`ref` 类似

## 函数式组件和 useState

使用 useState 必须在组件内部使用,react 引入一种写法叫函数式组件,根他的名字一样,他是一个函数,这个函数的主要功能就是返回一个组件

为此,我们需要修改之前的 H1 组件

```html
<script type="text/babel">
  // 创建一个h1元素, 内容为Hello, world!
  const H1 = () => {
    return <h1>Hello, world!</h1>;
  };

  // 创建一个react根节点,绑定到app元素上
  const root = ReactDOM.createRoot(document.getElementById("app"));

  // 渲染h1元素到根节点上
  root.render(React.createElement(H1));
</script>
```

在这里,我们做 2 个操作,首先吧 H1 变成一个函数,函数返回一个 h1 的标签,元素,

第二个,在 render 函数首先调用 React.createElement(H1) 再传递给 render 函数,
React.createElement(H1) 会自动调用这个函数,得到一个 react dom,然后渲染到页面上

以上我们就完成了,H1 函数式组件的编写,之前提到 useState 必须在组件内部使用,现在我们就可以在 H1 函数内使用这个了

```html
<script type="text/babel">
  // 创建一个h1元素, 内容为Hello, world!
  const H1 = () => {
    const [text, setText] = React.useState("Hello, world!");

    const handleClick = () => {
      setText("hxg");
      console.log(text);
    };

    return <h1 onClick={handleClick}>{text}</h1>;
  };

  // 创建一个react根节点,绑定到app元素上
  const root = ReactDOM.createRoot(document.getElementById("app"));

  // 渲染h1元素到根节点上
  root.render(React.createElement(H1));
</script>
```

React.useState 会返回一个数组,`[text,setText]` 第一个表示我们绑定是值,第二个表示,重新赋值的函数,请注意,这里的 text,和 setText 并不是固定这个名字,这个名字可以是任意的名字,还可以写`[name,setName]` 但是这里有一个开发规范,就是,赋值函数也就是 setText 必须要叫 setXXX, 统一写法,回到页面,点击`Hello, world!` 就会变成`hxg`.

这里有一个知识点,setText 函数是异步执行,可以刷新页面后打开 f12,再次点击页面,可以看到控制台仍然打印的 `Hello, world!` .这个操作是异步执行,一定要记住这个特性

## useEffect

为什么要学这个函数

在项目实际开发中,我们通常会在页面加载的时候,去调用接口初始化我们的页面,此时,我们需要一个页面加载完成的函数,在 react 中,就可以使用 useEffect (实际这里并不是页面加载完成,暂时可以理解为 是页面加载完成)

和 useState 一样, useEffect 也需要写在组件内部,不能在外面单独写

```html
<script type="text/babel">
  // 创建一个h1元素, 内容为Hello, world!
  const H1 = () => {
    const [text, setText] = React.useState("Hello, world!");

    const handleClick = () => {
      setText("hxg");
      console.log(text);
    };

    React.useEffect(() => {
      console.log("useEffect执行");
    }, []);

    return <h1 onClick={handleClick}>{text}</h1>;
  };

  // 创建一个react根节点,绑定到app元素上
  const root = ReactDOM.createRoot(document.getElementById("app"));

  // 渲染h1元素到根节点上
  root.render(React.createElement(H1));
</script>
```

可以看到 useEffect 有 2 个参数,第一个是一个函数,函数内容就是我们要执行的内容,第二个参数,在这里写了一个空数组代表 页面第一次加载才执行,第二个参数意义在于可以监听我们的变量的变更例如

```js
React.useEffect(() => {
  console.log("useEffect执行");
}, [text]);
```

这样写之后,表示,每次当 text 变化的时候,才会执行 useEffect,相当于 此时 useEffect 有了另外一个名字,依赖收集,当依赖发生变化的时候,就好执行我们的函数,

useEffect 还有一个用法,为组件销毁时,执行某个函数

在实际开发中,我们可能会在页面加载时,去监听某个事件,但是如果,当我们切换页面或者切换组件的时候,没有把这个事件销毁掉,它便会一直存在于内存中,导致无法释放,如果绑定多了,就会导致`内存泄漏`,所以我们需要在页面销毁的时候,移除监听事件

```js
React.useEffect(() => {
  document.addEventListener("scroll", () => {
    console.log("scroll");
  });
  return () => {
    document.removeEventListener("scroll", () => {
      console.log("scroll");
    });
  };
}, []);
```

在这里,我们在页面加载完成时,去监听页面的滚动,随后 return 一个函数,函数内容表示我们在组件卸载的时候,去执行的代码,在这里,我们去` removeEventListener` 这个事件,这样就不会引发`内容泄漏` 问题

以上就是入门内容,可以用之前的 html js 内容来练习 jsx 的语法
