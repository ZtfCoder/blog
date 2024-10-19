---
title: react 第5节
description: react props
---

## props

props 是用于在不同组件传递数据的词
写法是

```jsx

  // props通常是用写成一个对象的形式
const UserList = (props)=>{

  // 一般我们在组件内使用解构的形式获取对象中的值(只是习惯,也可以不按照这样)
  // 假如 props 中有 name和age
  const { name,age } = props
  // 省略内容
  return (
    <div>name:{name}</div>
    <div>age:{age}</div>
  )
}

```

其中函数式组件的参数就是我们的 props,其他组件想要传递则需要按照以下格式

```jsx
// 这里是另外一个页面,引入我们写好的组件
const Page = () => {
  return <UserList name={"hxg"} age={18} />;
};
```

这里需要注意,子组件中的 props 变量是不可更改的,不能去修改子组件的 props 值,只能在父组件修改

props 中可以传递任何值,也可以传递一个函数进来

```jsx
const Page = () => {
  const handleClick = () => {
    alert("这是父组件 Page 的方法");
  };
  return <UserList name={"hxg"} age={18} handleClick={handleClick} />;
};
```

注意 props 可以无限传递,可以传递给子组件的子组件 但是比较繁琐,对于这种情况 react 有解决方案,后续会讲

需要注意的是,如果在父组件内使用了 setXXX 的 useState 函数时,父组件重新渲染,子组件也会重新渲染

可以自己练习下,在父组件传递参数到子组件,然后再通过点击事件修改传递到子组件的 props

## 组件嵌套

有时候,我们希望我们封装的组件能够实现嵌套复用,例如,二手交易市场, 移动端 h5 项目,页面都有一些共同的部分

例如,左上角都有返回箭头,点击可以返回上个页面,每个页面 header 头中间都有当前页面的名字,所以我们可以吧这些内容都封装成一个组件,实现方式有 2 种,单独写一个`Header` 组件,然后在每个页面中引入,
例如

页面 1

```jsx
const Page1 =()=>{
  return (
    <Header title="页面1" />
    <User />
  )
}
```

页面 2

```jsx
const Page2 =()=>{
  return (
    <Header title="页面2" />
    <User />
  )
}
```

页面 3

```jsx
const Page2 =()=>{
  return (
    <Header title="页面3" />
    <User />
  )
}
```

这种方式相当于是独立的组件,如果我们这个组件只有这些功能,那可以这么写

但是如果我们的页面需要让除了 header 以外的区域进行滚动;设置页面的背景颜色,如果这种公共的功能每个页面都要写一遍非常繁琐,所以有了另外一种使用场景组件嵌套

这里我们定义一个公共的组件 `Page`,注意这样的通用组件,放在项目的 `components` 文件夹下

```jsx
const Page = (props, ref) => {
  const {
    title, // header 中的页面标题
    right, //右边的内容
    backIcon = "这里是默认的返回icon",
    showNavBar = true, //是否显示头部的
    children,
  } = props;

  const handleBack = () => {
    location.back();
  };
  return (
    <>
      {showNavBar && (
        <div>
          <div onClick={handleBack}>{backIcon}</div>
          <div>{title}</div>
          <div>{right}</div>
        </div>
      )}
      <div>{children}</div>
    </>
  );
};
export default Page;
```

我们定义了这么一个 Page 通用组件,他的 props 有

```js
const {
  title, // header 中的页面标题
  right, //右边的内容
  backIcon = "icon", //返回的icon样式,有一个默认值
  showNavBar = true, //是否显示头部的
  children,
} = props;
```

我们根据`showNavBar` 值来判定是否显示 header 信息
往下有个 div 内容是 `children` 这个就表示 Page 组件下 的全部内容子组件,注意这里一定是叫这个名字

接着我们创建一个新页面

```jsx
const UserPage = ()=>{
  return <>
    <Page title="用户信息页">
      <div>div1</div>
      <div>div2</div>
      <div>div3</div>
      <div>div4</div>
      <div>div5</div>
      <div>div6</div>
    </Page>
  <>
}
```

这里可以看到,我们实现了自定义组件的嵌套,写起来就和 普通的 html 标签一样,这样我们就可以在每个页面使用这个`Page` 组件嵌套,减少我们写重复代码,项目开发中可能会嵌套好几层

前面不是提到`props` 可以是任意值吗,我们不仅可以传递函数,还可以传递一个 react 组件到页面中,可以看到,我们在`Page` 组件中的 props 使用了 `right ` 这个变量,这个主要是放在页面头部的右侧,把头部分成三部分,左中右,这样我们就可以根据场景选择性的传入不同右侧组件,可以实现非常灵活的使用

一下是使用方式

```jsx
const UserPage = ()=>{

  // 定义一个函数式组件,注意,react 虽然允许你在组件内定义组件,但是很少我们这么操作,你可以写在外面,单独的文件,或者写在当前 UserPage 函数外都可以,
  const Right = ()=>{
    return <h2>右侧内容</h2>

  }

  return <>
    <Page title="用户信息页" right={Right()}>
      <div>div1</div>
      <div>div2</div>
      <div>div3</div>
      <div>div4</div>
      <div>div5</div>
      <div>div6</div>
    </Page>
  <>
}

```

这样就可以看到右侧内容已经被渲染出来了,为什么传入 right 就会渲染出来呢,因为我们最开始写 Page 组件的时候把 `right`已经渲染在 div 上了,可以回头看下`Page` 组件

## 挑战

把购物车页面拆分成几个组件,并使用 props 方式进行传递数据
