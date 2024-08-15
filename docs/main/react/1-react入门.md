
## react 入门
react 一个js的框架,于ui框架不一样,他只包含js内容,学react 框架主要是为了解决传统HTML 开发难以复用代码的问题,以及优化html渲染,其中使用了一门技术叫`虚拟dom`
通过这个技术可以提升浏览器渲染的能力,因为频繁增加删除dom 会很消耗性能,但是react 内部帮我们做了这些事,所以用react 可以减少我们开发者去关注这些与项目开发无关的事,可以专心项目开发

### 快速体验react

复制一下内容到html文件中
```html
<html>
<head>
  <meta charset="UTF-8">
  <script src="./js/react.js"></script>
  <script src="./js/react-dom.js"></script>
</head>

<body>
  <div id="app"></div>
  <script>
    // 创建一个h1元素, 内容为Hello, world!
    const h1 = React.createElement('h1', null, 'Hello, world!');

    // 创建一个react根节点,绑定到app元素上
    const root = ReactDOM.createRoot(document.getElementById('app'));

    // 渲染h1元素到根节点上
    root.render(h1);
  </script>
</body>
</html>
```

首先我们引入2个react 核心依赖,`react.js` 和`react-dom.js`

> React 分为react和 `react-dom` 两个包是为了更好地分离关注点和优化性能。以下是具体原因：
>
> 1. **分离关注点**：
>    - react包含了 React 的核心库，提供了创建组件、管理状态和生命周期的方法。这部分代码与平台无关，可以在浏览器、服务器（使用 Node.js）或移动设备（使用 React Native）上运行。**React Native  是一个可以用react 写手机app的 依赖包,通过React Native 我们可以用html css js来编写app应用**
>    - `react-dom` 包含了与浏览器 DOM 相关的功能，负责将 React 组件渲染到实际的 DOM 中。它提供了 `ReactDOM.render` 方法和与浏览器特定的 API。
> 2. **优化性能**：
>    - 通过将核心库和平台特定的代码分离，React 可以更轻量、更高效。开发者可以只加载需要的部分，而不是整个库，从而减少了应用的体积和加载时间。
> 3. **跨平台支持**：
>    - 这种分离使得 React 可以更容易地支持其他平台。例如，React Native 使用react库来创建组件和管理状态，但它有自己的渲染库（而不是 `react-dom`），用于将组件渲染到移动设备的原生视图中。
>
> 总结来说，React 分为 `react`和 `react-dom` 是为了实现更好的模块化设计、优化性能和支持多平台开发。

上面这段代码用到3个最为重要的api  `createElement`  `createRoot` `createRoot`

createElement :创建一个react dom,第一个参数表示 我们想要渲染标签,例如 div,h1,ul,li,a 等等,第二个参数表示这个dom绑定事件,例如,点击事件,鼠标悬浮事件等等,第三个参数,表示这个标签内容是什么



createRoot: 表示创建一个react 根节点,react 应用需要有一个根节点,也就是入口,所有的react dom 都是在根节点内进行渲染,在上面的代码中,我们绑定了一个id为`app` 的div,用这个div 来当作react的根节点



root.render()  表示渲染dom,让 我们创建的react dom 渲染到根节点上



我们可以给它绑定一个点击事件,弹出alert()

```javascript
const h1 = React.createElement('h1', {
    onClick:()=>alert("这里是onClick")
}, 'Hello, world!');
```

在这里,`onClick` 与原生HTML的 点击事件名称不一样,react中的事件名都遵守小驼峰命名,原生html 的点击事件叫`onclick` ,而react 中叫 `onClick`  ,其他事件也是如此



## jsx 语法

在上一节,我们已经可以用react 创建节点了,但是每次都要用 createElement  创建,非常繁琐,不利于开发, 因此在react中提供了一种语法叫`jsx` 语法,可以在js 中,书写HTML标签,并被react识别

例如上方的 h1 标签,用jsx 书写就变成了

```jsx
const H1 = <h1 onClick={()=>alert("这里是onClick")}>Hello, world!<h1>
```

可以看到,已经和我们写html 代码非常相似了,几乎没有什么不同

但是在js中,浏览器是无法识别 H1 对象,因为等号后面,根本不是正确的js 代码,既不是字符串,也不是js对象,为此,我们需要使用一个第三方库,来帮我们转换成正确的js 代码,让浏览器正确识别

在 html 文件中新增一个 js依赖

```html
<script src="./js/babel.js"></script>
```

接着修改之前js 代码部分

```html
<script  type="text/babel">
    // 创建一个h1元素, 内容为Hello, world!
    const H1 = <h1 onClick={()=>alert("Hello, world!")}>Hello, world!</h1>;

    // 创建一个react根节点,绑定到app元素上
    const root = ReactDOM.createRoot(document.getElementById('app'));

    // 渲染h1元素到根节点上
    root.render(H1);
</script>
```

返回页面,可以看到,内容已经渲染出来了,并且和之前的内容一样

jsx 与html 标签还有的不同点在于,html 写class 是

```html
<div class="box"></div>
```

而jsx 是

```jsx
<div className="box"></div>
```

> 作业: 尝试给h1 标签 添加一个class 看看效果



## 插值表达式

jsx 还有一个重要点是插值表达式,和vue的{{}} 类型,但是react使用{}

插值表达式语法,运行,我们动态的给dom 元素赋值

例如

```js

  <script  type="text/babel">
      let text = "Hello, world!"
    // 创建一个h1元素, 内容为Hello, world!
    const H1 = <h1 onClick={()=>alert("Hello, world!")}>{text}</h1>;

    // 创建一个react根节点,绑定到app元素上
    const root = ReactDOM.createRoot(document.getElementById('app'));

    // 渲染h1元素到根节点上
    root.render(H1);

  </script>
```

创建一个text 变量,给它初始化值为"Hello, world!",绑定到h1 上

如果我们在onClick 中进行修改h1的值,可以观察下,页面内容是否变化

```html
  <script  type="text/babel">
    // 创建一个h1元素, 内容为Hello, world!
    let text = "Hello, world!";

    const handleClick = () => {
      text = "hxg";
      console.log(text);
    }

    const H1 = <h1 onClick={handleClick}>{text}</h1>;

    // 创建一个react根节点,绑定到app元素上
    const root = ReactDOM.createRoot(document.getElementById('app'));

    // 渲染h1元素到根节点上
    root.render(H1);

  </script>
```

在这里为了方便观察,,把onClick 触发的函数放到外面去,修改完打印text 的值

**打开f12 控制台观察**

![image-20240815135307925](https://fastly.jsdelivr.net/gh/ZtfCoder/img/image-20240815135307925.png)

可以看到控制台打印了hxg,但是页面上并未发生变化,这是因为点击的时候并没有触发react的渲染机制,页面上的内容是通过react渲染出来的,所以我们需要让react 重新渲染,内容才行,react 提供了一个api `useState`  来管理页面上动态渲染的内容,和vue中的`ref` 类似



## 函数式组件和useState

使用useState 必须在组件内部使用,react 引入一种写法叫函数式组件,根他的名字一样,他是一个函数,这个函数的主要功能就是返回一个组件



为此,我们需要修改之前的H1组件

```html
<script  type="text/babel">
    // 创建一个h1元素, 内容为Hello, world!
    const H1 = ()=>{
      return <h1>Hello, world!</h1>;
    }

    // 创建一个react根节点,绑定到app元素上
    const root = ReactDOM.createRoot(document.getElementById('app'));

    // 渲染h1元素到根节点上
    root.render(React.createElement(H1));

</script>
```

在这里,我们做2个操作,首先吧H1 变成一个函数,函数返回一个h1的标签,元素,

第二个,在render函数首先调用 React.createElement(H1) 再传递给render 函数,
React.createElement(H1) 会自动调用这个函数,得到一个react dom,然后渲染到页面上



以上我们就完成了,H1 函数式组件的编写,之前提到 useState  必须在组件内部使用,现在我们就可以在H1 函数内使用这个了

```html
  <script  type="text/babel">
    // 创建一个h1元素, 内容为Hello, world!
    const H1 = ()=>{

    const [text,setText] = React.useState("Hello, world!")

    const handleClick = () => {
          setText("hxg");
          console.log(text);
     }

      return <h1 onClick={handleClick}>{text}</h1>;
    }

    // 创建一个react根节点,绑定到app元素上
    const root = ReactDOM.createRoot(document.getElementById('app'));

    // 渲染h1元素到根节点上
    root.render(React.createElement(H1));

  </script>
```

React.useState 会返回一个数组,`[text,setText]` 第一个表示我们绑定是值,第二个表示,重新赋值的函数,请注意,这里的text,和setText 并不是固定这个名字,这个名字可以是任意的名字,还可以写`[name,setName]` 但是这里有一个开发规范,就是,赋值函数也就是setText 必须要叫setXXX, 统一写法,回到页面,点击`Hello, world!` 就会变成`hxg`.

这里有一个知识点,setText 函数是异步执行,可以刷新页面后打开f12,再次点击页面,可以看到控制台仍然打印的 `Hello, world!` .这个操作是异步执行,一定要记住这个特性

以上就是入门内容,可以用之前的html js 内容来练习 jsx 的语法
