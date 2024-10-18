---
title: react 第四节
description: react hooks
---

## hooks 概念

react 中有一个概念叫`hooks ` 所谓`hooks` 就是可以复用的通用代码,具有很强的复用性

## useState

useState 是最为核心的一个内置 hooks,它的作用主要是存储页面渲染的数据

使用方法是

```javascript
// 千万不要忘记引入 useState函数
import { useState } from "react";
const [data, setData] = useState("hxg");
```

useState 函数会返回一个数组,数组有 2 个值,第一个是我们渲染在页面的数据对象,第二个是用来重新设置这个`data`值的函数

如果要在页面上渲染出来就用`data` 变量就行

```jsx
import { useState } from "react";
const Page = ()=>{

  const [data, setData] = useState("hxg");

  return <>
    <button>{data}</button>
  <>
}
```

通过`{}` 大括号语法 就可以获取到值

如果我们后续要修改 data 的值,则需要调用 setData 方法,方法的参数就是你需要修改的值
例如

```jsx
import { useState } from "react";
const Page = ()=>{

  const [data, setData] = useState("hxg");

  return <>
    <button onClick={()=>setData("ztf")}>{data}</button>
  <>
}
```

当我们点击按钮的时候,按钮的值就会发生变化,但是如果我们直接写`data="ztf"`
这样是不会发生任何变化,可以试试

原因是因为,react 每次渲染后,再次修改值是不会发生任何变化,因为页面已经被渲染出来了,如果我们想要页面数据变化,则需要让 react 重新渲染,而 useState 的 setData 方法是可以重新渲染页面的,每次调用 setData 方法,Page 这个函数里面的代码都会重新执行一次

在这里简单修改了下内容

```jsx
import { useState } from "react";
const Page = ()=>{

  const [data, setData] = useState(1);
  console.log(data)
  return <>
    <button onClick={()=>setData(data+1)}>{data}</button>
  <>
}
```

当我们每次点击按钮的时候 `console.log(data)` 这句话可以在控制台看到,都会执行一次
这就表示了当我们调用`setData` 函数的时候页面就会重新渲染

这里强调一下 调用 setData 方法后,我们并不能马上获取到最新的`data` 值
例如

```js
setData("123");
console.log(data);
```

可能并不会马上打印`123`,因为 setData 是一个异步的,所以我们不能马上获取到 data

## useEffect

useEffect 翻译过来,就是 依赖收集,就是可以根据某些数据发生变化后立刻执行,

useEffect 的场景主要是

1. 监听某些值的变化
2. 用做组件的生命周期(组件生命周期:在 react 中一个组件它有组件创建成功,组件销毁)

第一个场景,可能不是那么好理解,这里展示第二个场景

我们通常会在组件创建成功的时候 进行 ajax 请求,拉取数据

```jsx
import { useState,useEffect } from "react";
const Page = ()=>{

  const [data, setData] = useState(1);
  useEffect(()=>{
    // 这里是伪代码,请换成真实的url
    axios.get("/getList").then(res=>{
      setData(data)
    })
  },[]) // 这里给空数组,表示我们不进行任何值监听
  return <>
    <div>{data}</div>
  <>
}
```

当页面加载完后,就会执行 useEffect 的代码,执行网络请求,最后调用 setData 函数 重新渲染页面
调用 setData 函数导致页面重新渲染并不会导致这里的 useEffect 重新执行,也就是说,useEffect 可以避免重新渲染的时候再次执行(题外话,如果我们使用 useEffect 监听 data 值变化,此时我们使用 setData 的时候,就会让 useEffect 重新执行)
例如

```jsx
import { useState,useEffect } from "react";
const Page = ()=>{

  const [data, setData] = useState(1);
  useEffect(()=>{
    // 这里是伪代码,请换成真实的url
     console.log("data====>",data)
  },[data]) // 这里给填data 变量表示,我们监听data 变量的变化来执行useEffect 里面的函数
  return <>
    <button onClick={()=>setData(data+1)}>{data}</button>
  <>
}
```

可以发现每次点击按钮的时候都会打印 `data` 的最新值

之前说组件生命周期,还有一个 `卸载销毁` 时期

```jsx
import { useState,useEffect } from "react";
const Page = ()=>{

  const [data, setData] = useState(1);
  useEffect(()=>{
    // 这里是伪代码,请换成真实的url
     console.log("data====>",data)
     return ()=>{
       console.log("这里表示组件销毁")
     }
  },[data]) // 这里给填data 变量表示,我们监听data 变量的变化来执行useEffect 里面的函数
  return <>
    <button onClick={()=>setData(data+1)}>{data}</button>
  <>
}
```

什么时候销毁,例如触发到 setData 的时候,切换组件的时候,跳转页面的时候
组件销毁的时候我们需要干嘛:我们需要清除页面的定时器,不然页面可能会重新创建定时器;需要清除页面的监听事件

## useRef

useRef 可以在页面重新渲染的时候避免 变量重新创建,例如
最开始 有一个变量 let age = 19
当我们把 age 变为 18 注意,这里 age 变量不需要渲染到页面上,只是在 js 中做计算

当我们调用 setData 的时候,导致页面渲染,age 变量就会被重新创建
重新变成 19,此时我们再次计算的时候肯定就不对了,这个时候,我们就需要让 age 不参与页面渲染,避免重新创建

```jsx
import { useState,useEffect } from "react";
const Page = ()=>{
  let age = 19
  const [data, setData] = useState(1);
  const handleClick =()=>{
    age = 18
    setData("132323")
  }
  console.log(age)
  return <>
    <button onClick={handleClick}>点击</button>
  <>
}
```

当我们点击后
首选 打印 19,然后再次打印 19

可以发现 age 又变成之前的值了,这是因为组件重新渲染了,导致 age 变量重新创建,为此,我们就需要用使用 useRef

```jsx
import { useState,useEffect ,useRef} from "react";
const Page = ()=>{
  let age = useRef(19)
  const [data, setData] = useState(1);
  const handleClick =()=>{
    age.current = 18
    setData("132323")
  }
  console.log(age.current)
  return <>
    <button onClick={handleClick}>点击</button>
  <>
}
```

当我们再次点击的时候,就会发现,控制打印的是 18 而不是 19 了,
说明 age 没有被重新创建

## useMemo

useMemo 是一个根据依赖变化后,自动执行函数并返回一个值的函数

例如

```jsx
import React, { useMemo, useState } from "react";
const Index = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const z = useMemo(() => {
    return x + y;
  }, [x, y]);

  return (
    <>
      <div>
        x:
        <input
          type="number"
          onChange={(event) => setX(Number(event.target.value))}
        />
      </div>
      <div>
        y:
        <input
          type="number"
          onChange={(event) => setX(Number(event.target.value))}
        />
      </div>
      <div>相加等于{z}</div>
    </>
  );
};
export default Index;
```

复制代码到组件内,打开页面,可以看到 x,y 输入框已经出现,在输入框输入值就可以发现
最后一行已经计算出来了,

解释下上述部分代码意思
onChange:如果我们要监听 `input` 发生变化需要使用 `onChange` 事件,几乎所有的 input 都是使用 `onChange`来
Number: Number 是一个 js 自带转换类型的函数,可以把字符串类型转成数字类型,js 没有专门用于表示浮点数的类型,整数和浮点数都是使用 Number 来转换,还有其他方法可以转换成数字,比如 `parseInt` ,`parseFloat`,所以这里使用 `Number` 来转换比较通用,我们不需要去处理到底是用 parseInt,还是 parseFloat
event: 在 js 中每一个监听事件在回调的时候都有一个`event` 形参,event 内容有些不一样,在这里,如果我们要获取输入框发生变化的值,则是使用 `event.target.value`,此时获取出来是字符串类型,所以需要使用 `Number` 来转换

你可以想说,那我也可以不用 `useMemo`也可以实现啊 只需要在最后改成 `相加等于{x+y}`,对没错,这样也可以,但是如果计算的逻辑非常多,就不方便写在页面中了,
所以,理论是用`useMemo` 的地方都可以用其他方式实现,`useMemo` 不是唯一实现的方式

还有一些其他场景可以用于自动计算,例如 购物车的总价计算,多选框是否全选等等,这里写一个多选框全选的案例

```jsx
import React, { useMemo, useState } from "react";
const CheckboxDemo = () => {
  const [ids, setIds] = useState([]);
  const checked = (id) => {
    const find = ids.find((idTemp) => idTemp === id);
    if (find) {
      // 如果找到了，就删除
      setIds(ids.filter((idTemp) => idTemp !== id));
    } else {
      // 如果没找到，就添加
      setIds([...ids, id]);
    }
  };

  const isCheckAll = useMemo(() => {
    return ids.length === 3;
  }, [ids]);

  const checkAll = () => {
    if (isCheckAll) {
      setIds([]);
    } else {
      setIds([1, 2, 3]);
    }
  };

  return (
    <>
      <div>
        1
        <input
          type="checkbox"
          name="checkbox"
          id=""
          checked={ids.find((id) => id === 1)}
          onChange={() => checked(1)}
        />
      </div>
      <div>
        2
        <input
          type="checkbox"
          name="checkbox"
          id=""
          checked={ids.find((id) => id === 2)}
          onChange={() => checked(2)}
        />
      </div>
      <div>
        3
        <input
          type="checkbox"
          name="checkbox"
          id=""
          checked={ids.find((id) => id === 3)}
          onChange={() => checked(3)}
        />
      </div>
      <div>
        全选
        <input
          type="checkbox"
          name="all"
          id=""
          checked={isCheckAll}
          onChange={checkAll}
        />
      </div>
    </>
  );
};
export default CheckboxDemo;
```

## 购物车练习

```jsx
import React, { useState } from "react";
import styles from "./index.module.css";
const CartList = () => {
  // 购物车列表
  const [cartList, setCartList] = useState([]);

  // 保存用户输入的内容
  const [name, setName] = useState();
  const [count, setCount] = useState();
  const [price, setPrice] = useState();

  // 往购物车添加一条记录
  const addCart = () => {
    if (!name || !count || !price) {
      alert("请输入完整信息");
      return;
    }
    // 创建一个商品对象
    const newCart = {
      id: new Date().getTime(), // 为了方便，这里直接使用时间戳作为id
      name,
      price,
      count,
    };
    // 设置购物车列表的值
    setCartList([...cartList, newCart]);
  };

  // 加号按钮点击事件
  const add = (id) => {
    // 用map 去查询我们点击的商品对象,根据id查询
    const newCartList = cartList.map((item) => {
      if (item.id === id) {
        // 找到了就数量+1
        item.count += 1;
      }
      return item;
    });
    // 注意,用map生成的 数组是一个新数组,不是以前那个数组对象,所以我们需要重新set
    setCartList(newCartList);
  };

  // 减号按钮点击事件
  const del = (id) => {
    const newCartList = cartList.map((item) => {
      if (item.id === id && item.count > 0) {
        item.count -= 1;
      }
      return item;
    });
    setCartList(newCartList);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>添加库存请输入: </div>
        <div>
          商品名称：
          <input
            type="text"
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          单价：
          <input
            type="number"
            onChange={(event) => setPrice(Number(event.target.value))}
          />
        </div>
        <div>
          数量：
          <input
            type="number"
            onChange={(event) => setCount(Number(event.target.value))}
          />
        </div>
        <div>
          <button className={styles.addBtn} type="button" onClick={addCart}>
            添加
          </button>
        </div>
      </div>
      <div className={styles.cartList}>
        {cartList.map((item) => {
          return (
            <div key={item.id} className={styles.cartItem}>
              <div>id:{item.id}</div>
              <div>名称:{item.name}</div>
              <div>单价:{item.price}</div>
              <div>
                数量:
                <button type="button" onClick={() => add(item.id)}>
                  +
                </button>
                <input type="text" value={item.count} disabled />
                <button type="button" onClick={() => del(item.id)}>
                  -
                </button>
              </div>
            </div>
          );
        })}
      </div>
      当前总价:
    </div>
  );
};

export default CartList;
```

`index.module.css`

```css
.header {
  display: flex;
  gap: 10px;
  align-items: center;
}
.cartItem {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

input {
  width: 100px;
}
input:focus {
  outline: none;
}

.addBtn {
  background-color: #4caf50;
  color: white;
  padding: 10px 24px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}
button:focus {
  outline: none !important;
}
```

## 挑战

1. 实现计算购物车总价显示
   提示,使用 useMemo() 来实现,商品总价等于:每个商品的单价\*数量的总和

2. 在每个商品最后添加一个删除的按钮,用于删除当前商品,

3. 在 id 前面增加一个多选框,用于选中当前商品,只有选中的商品才会进行总价计算

4. 增加全选,功能,点击全选,所有商品的多选框都会全选,再次点击,会取消全部商品的多选框
