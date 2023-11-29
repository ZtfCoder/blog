## pinia

pinia 是替代vuex的状态组件库,

区别

```
Pinia 和 Vuex
Vuex： State、Gettes、Mutations(同步)、Actions(异步)

Pinia： State、Gettes、Actions(同步异步都支持)
```



所谓维持状态,就是可以存储一些全局的值,方便在每个组件都可以用到,并且是响应式的,

还可以触发某些函数进行操作



### 为什么需要`pinia`  

解决了vuex 的很多问题,并且提供开箱即用的ts 类型支持

Pinia 没有 `Mutations`

`Actions` 支持同步和异步

没有模块的嵌套结构

无需手动添加 store，它的模块默认情况下创建就自动注册的

通常我们在项目中需要存储一些常用的数据,例如登录的token 等信息,我们可以使用pinia 来存储这些值,

但是由于刷新页面会导致值丢失,我们也可以对pinia 进行持久化操作,



### 安装

这里使用yarn 命令安装, 如果不知道yarn 命令的可以去看看之前的文章

```
yarn add pinia
```



在main.ts 中

```typescript
import { createPinia } from 'pinia'

app.use(createPinia())
```



### 配置

通常在src 下创建store 文件夹 ,接着再创建一个index.ts

```typescript
import {defineStore} from "pinia";

// defineStore() 定义一个函数 其中第一个参数是id ,唯一值
export const userStore = defineStore("userStore", {
    //state 则是存储的变量
    state: () => {
        return {
            name: "zs11111111",
            age:123,
            list:[132,4,5]
        }
    },
    getters: {},
    // actions 则是相当于vue2 中的 methods,
    actions: {}
})

```

其中 `state` 用来存储全局状态，它必须是箭头函数，为了在服务端渲染的时候避免交叉请求导致的数据状态污染所以只能是函数，而必须用箭头函数则为了更好的 TS 类型推导

`getters` 就是用来封装计算属性，它有缓存的功能

`actions` 就是用来封装业务逻辑，修改 state



### 

在组件中需要导入 `userStore` 这个 变量

```vue
<template>
  <div class="content">
      <!-- 可以直接使用这个这个 name-->
    {{ user.name }}
    <div>
      <button @click="change">change</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { userStore } from '../../store'
// 初始化 userStore() 函数,会得到pina 的对象,这样就可以操作userStore 里定义好的内容了
const user = userStore()
</script>
```



### 修改

#### 方法一

```vue
<!-- 通过userStore() 的返回值,直接修改-->
<script setup lang="ts">
import { userStore } from '../../store'
const user = userStore()
const change = ()=>{
  user.name="123456"
}
</script>
```

#### 方法二

```vue
<!-- 通过 $state 修改-->
<script setup lang="ts">
import { userStore } from '../../store'
const user = userStore()
const change = ()=>{
	user.$state.name="dsadsadsad"
}
</script>
```

#### 方法三

```vue
<!-- 通过 $patch 修改-->
<script setup lang="ts">
import { userStore } from '../../store'
const user = userStore()
const change = ()=>{
	user.$patch({
  		age:1,
        name:'zs'
	})
}
</script>
```

#### 方法四

```vue
<!-- 通过 $patch 回调函数 修改-->
<script setup lang="ts">
import { userStore } from '../../store'
const user = userStore()
const change = ()=>{
	user.$patch((store)=>{
  		store.age=1
	})
}
</script>
```

#### 方法五

```vue
<!-- 通过 定义 actions 函数进行修改-->

<!--在userStore() 函数中的actions 属性中定义修改的方法-->
<script setup lang="ts">
export const userStore = defineStore("userStore", {
    state: () => {
        return {
            name: "zs11111111",
            age:123,
            list:[132,4,5]
        }
    },
    getters: {},
    actions: {
        setAge(updateAge:number){
            this.age=updateAge
        }
    }
})
</script>

<!------------------------------------->
<script setup lang="ts">
import { userStore } from '../../store'
const user = userStore()
const change = ()=>{
	user.setAge(100)
}
</script>
```

