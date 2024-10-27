---
title: js 导入和导出
description: js基础知识
---

## 导入和导出

本章节内容使用`js文件`和`html文件`来编写

我们知道,在 Java,以及 python 中,如果要使用一些库函数,需要使用`import` 语法来导入

js 也有这种语法,他们分为 2 个 规范 `commonJS`和 `ESM` 模块

其中`commonJS` 现在已经用的很少了,现在绝大多数人都是使用`ESM` 来编写库函数,

## ESM

### 普通导入和导出

主要是涉及 2 个关键词 `import`, `export`

`import`: 导入

`export`: 导出

我们创建一个叫 utils.js 的文件,这个文件里面有一个函数叫`add`,其作用就是 2 数相加,然后,我们再添加 `export` 关键词,表示导出此函数

```js
export const add = (x, y) => {
  return x + y;
};
```

然后再创建一个 HTML 文件

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body></body>

  <script type="module">
    import { add } from "./utils.js";
    console.log(add(1, 2));
  </script>
</html>
```

这里注意,在 html 文件中使用`ESM` 需要给`script` 标签,添加 `type="module"`
然后我们通过 `import {} from "xxxx.js" ` 的形式,导入我们所需要函数
在这里,我们导入的是 add 这个函数,

export 还可以 一次导出多个函数

```js
export const add = (x, y) => {
  return x + y;
};

const subtract = (x, y) => {
  return x - y;
};

const multiply = (x, y) => {
  return x * y;
};

export { multiply, subtract };
```

这里可以看到,我们先编写 `subtract` `multiply` 这 2 个函数,然后再,使用 `export` 关键词,进行导出,
注意这里,`{ multiply, subtract }` 这里是一个省略的语法,export 导出的是一个对象,key,value,键值对的对象,
由于,我们导出的名字和函数名字相同,则可以不用写 key:value 形式,我们也可以写成`export { multiplyTemp:multiply, subtract }`
这种形式,表示,我们导出的函数的名字叫`multiplyTemp` 但是`multiplyTemp` 只是我们给`multiply`取的一个别名

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body></body>

  <script type="module">
    import { add, multiply } from "./utils.js";
    console.log(add(1, 2));
    console.log(multiply(3, 2));
  </script>
</html>
```

注意这里`import`后面 大括号里面的函数名称,一定是我们在 export 的时候取的那个 key 的名称,如果你的是`export { multiplyTemp:multiply, subtract }`

则需要 `import { add, multiplyTemp } from "./utils.js";`

### 默认导出,和导入

一个 js 文件可以写多个 export 导出,但是只能有一个`默认导出`,

默认导出其实和普通的导出没有什么不同,只是在导入和导出的时候写法不一样

在刚才的 js 文件中,我们写一个函数

```js
const divide = (x, y) => {
  return x / y;
};

export default divide;
```

还可以写成

```js
export default (x, y) => {
  return x / y;
};
```

在导入的时候,我们需要这样写

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body></body>

  <script type="module">
    import { add, multiply } from "./utils.js";
    // 注意这里的 divide 名字可以取任意值
    import divide from "./utils.js";
    console.log(add(1, 2));
    console.log(multiply(3, 2));
    console.log(divide(6, 2));
  </script>
</html>
```

注意,一个文件只能有一个默认导出,但是可以有多个普通导出
