

最近在做前端监控系统的时候用到很多es6 的特性,特此记录下来

## var,let,const

新增2种变量定义域的关键词,

使用var 会导致许多个问题,会让变量提前声明,默认为全局变量,等等



而使用let 就不会出现.比如在for循环种

例如,

```js
for(let i = 0;i < 10; i++){
   console.log(i);
}
console.log("循环体之外：" + i);//报错：letScope.html:5 Uncaught ReferenceError: i is not defined

```

此时let 就将变量i 封锁在循环中,如果我们使用var ,则会打印10,

`const` 则是类似Java 中的final 关键词类似,无法第二次给变量赋值

## 字符串模板

如果要在一堆字符串 拼接上我们的变量,则需要使用+进行拼接,这样操作下来,会导致字符串可读性大大降低,

针对这种情况,可以使用字符串模板

```js
let name = "zs";
let string = `我的名字是${name}`
// 最后string 的值为  我的名字是zs


```

如果变量特别多,那么更应该使用这种字符串模板形式

## 解构

有这样一个需要,我们我们需要获取对象中的某一个值

通常会这样做

```js
let a = obj.name;
```

而解构可以这样

```js
let {name} =obj;
```

## 箭头函数

箭头函数 是简化function 的缩写

```js
// 原始写法
const f=  function dom(){
    .....
}

//简化
const f= ()=>{
    .....
}
```

还有一种,在对象中使用

```js
let obj = {
    f:function (){
    	.....
	}
}

// 简化
let obj = {
    f(){
    	.....
	},
    a(){
        
    }
}

```





## Promise 

异步任务,可以这样理解

其使用方法为

```js
function dom(){
    return new Promise((resolve, reject)=>{
        // 在这里写业务代码
        
        //如果业务代码执行成功,则调用resolve()
        resolve(res)// 调用这个函数表示该异步任务结束,并返回res 变量
        
        // 如果业务代码执行失败,则调用reject()
        reject(res)// 调用这个函数表示该异步任务结束,并返回res 变量
    })
}

// then() 表示,如果执行成功后,则执行then 里面的内容,catch表示失败
dom().then(res=>{
    
}).catch(res=>{
    // 异步任务失败
})
```





## async  await

我们都知道js 是单线程操作,如果,我们在执行一个操作dom的操作的函数时,会阻塞主线程,

导致,修改了dom 了,但是界面还是没有变化,此时,我们需要 让这个方放是异步方放

```js
async function dom(){
    .....
}

```

这样写了之后,便不会阻塞主线程,

还有种常用的方法,我们在使用 Promise的时候,会产生大量的then() 回调,阅读起来,十分不舒服,

因此,我们可以使用 async  await 来简化 then

```js
function dom(){
    return new Promise((resolve, reject)=>{
        // 在这里写业务代码
        
        //如果业务代码执行成功,则调用resolve()
        resolve(res)// 调用这个函数表示该异步任务结束,并返回res 变量
        
        // 如果业务代码执行失败,则调用reject()
        reject(res)// 调用这个函数表示该异步任务结束,并返回res 变量
    })
}

async function dom(){
    // 这样使用,会等待dom()返回结果,简化 then 方法回调
  const res =  await dom();
}
```

但是await 必须在async 方法内使用,原因其实很简单,

我们想要等待 异步任务,首先当前这个方法也必须是异步才行