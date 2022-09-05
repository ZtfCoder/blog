## vue3  语法

### template 变动

现在 template 标签下 可以写多个根标签,不在是只能写一个根标签

```vue
<template>
  <div>dsad</div>
  <div>dsad</div>
</template>
```



### setup 语法

setup 是vue3 新增语法糖,简化 js

```vue
<script setup lang="ts">

</script>
```

使用了setup 后,当前组件页面内,使用外部组件无需使用  **export default components** 属性声明,在setup 内的变量会全部自动导出

**vue2 写法**

```vue
<template>
  <hello-world msg="dsads"></hello-world>
</template>
<script lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
export default {
  components:{
    HelloWorld
  }
}
</script>
```

**vue3 写法**

```vue
<template>
  <hello-world msg="dsads"></hello-world>
</template>

<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
</script>
```

### ref

ref  是vue3 声明响应式数据的方式 由于vue3 不推荐使用 

export default 方式,改为以下方式

```vue
<template>
  <hello-world :msg="num"></hello-world>
  <button @click="change">change</button>
</template>

<script setup lang="ts">

import HelloWorld from "./components/HelloWorld.vue";
import {ref} from "vue";
// 使用 ref 绑定数据
let num = ref<string>("111")
const change =()=>{
  num.value= "dsadsa"
}

</script>
```

ref 适用了简单数据类型,并且如果要更改ref 绑定的数据,需要 `num.value= "dsadsa"`方式,才能动态更改

> ref 也可以用于复杂类型,源码中进行了判断,如果是复杂数据类型会转换成 reactive 类型



### reactive 

也是声明响应式数据的方式

```vue
<template>
  <button @click="change">change</button>
  <div>{{list}}</div>
</template>

<script setup lang="ts">
import {ref,reactive} from "vue";

let list =  reactive<number[]>([1,2,34,5]);
const change =()=>{
  list = [2]
  console.log(list)
}
console.log(list)

</script>
```

修改响应式数据为数组时,可以直接修改,不需要再调用`value` 属性

但是当修改值为数组时,会破坏响应数据,从而变成普通数据

**解决方法1**

```vue
<template>
  <button @click="change">change</button>
  <div>{{list}}</div>
</template>

<script setup lang="ts">
import {ref,reactive} from "vue";

type o ={
  list:number[]
}

let list =  reactive<o>({
  list:[1,2,34,5]
});
const change =()=>{
  list.list = [2]
  console.log(list)
}
console.log(list)

</script>
```

通过定义一个临时类型对象来赋值

**解决方法2**

```vue
<template>
  <button @click="change">change</button>
  <div>{{list}}</div>
</template>

<script setup lang="ts">
import {ref,reactive} from "vue";


let list =  reactive<number[]>([1,2,34,5]);
const change =()=>{
  let a = [2]
  list.push(...a)
  console.log(list)
}
console.log(list)

</script>
```





### computed

计算属性,当函数内部使用到的外部变量发生变动时,就会除非计算属性方法

```js
totalPrice = computed(() => {
  let $total = 0
  shopList.forEach(e => {
    $total += (e.price * e.total)
  })
  return $total;
})
```



### watch

监听变量

```vue
<template>
  <input type="text" v-model="obj">
</template>

<script setup lang="ts">
import {ref, reactive, watch} from "vue";

let obj=  ref(111)

watch(obj,(newVal,oldVal)=>{
  console.log("新值:===",newVal);
  console.log("旧值:===",oldVal);
})

</script>
```

这样当我们修改`obj` 时,就会出发监听函数,



但是当我们监听复杂类型时,`ref` 绑定的数据,是不会监听深层次的值的,

例如

```vue
let obj=  ref({
	name:'zs'
})
```

vue 并不会帮我们监听name的值,

需要开启深层次监听 `deep:true`

```vue
<template>
  <input type="text" v-model="obj.name">
</template>

<script setup lang="ts">
import {ref, reactive, watch} from "vue";

let obj=  ref({
  name:"zs"
})

watch(obj,(newVal,oldVal)=>{
  console.log("新值:===",newVal);
  console.log("旧值:===",oldVal);
},{deep:true})

</script>
```

如果使用`reactive` 来绑定,则不需要开启`deep:true`

> 注意,如果监听对象的话,会导致旧值与新值相同,这不是bug,这是因为vue 绑定的是数据的引用地址原因



监听对象中的某个值

```vue
<template>
  <input type="text" v-model="obj.name">
</template>

<script setup lang="ts">
import {ref, reactive, watch} from "vue";

let obj=  ref({
  name:"zs"
})

// 使用监听函数,返回需要监听的值
watch(()=>obj.value.name,(newVal,oldVal)=>{
  console.log("新值:===",newVal);
  console.log("旧值:===",oldVal);
})

</script>
```

### 生命周期函数

```vue
<script setup lang="ts">
import {onMounted} from "vue";


// 类比vue2 中的 mounted() 函数
onMounted(()=>{
  
})

</script>
```

### defineProps

props 属性,父组件向子组件传值使用了 `defineProps`

```vue
<!--父组件-->
<template>
  <div class="layout">
    <Menu :name="name"></Menu>
    <div class="layout-right">
      <Header></Header>
      <Content></Content>
    </div>
  </div>
</template>

<script setup lang="ts">
import Content from './Content/index.vue'
import Header from './Header/index.vue'
import Menu from './Menu/index.vue'

import {reactive, ref} from 'vue'

let name =  ref<string>("zs")

</script>
```

```vue
<!--子组件-->
<template>
  <div class="menu">
    Menu
    <div>
      {{name}}
    </div>
  </div>
</template>

<script setup lang="ts">

type Props={
  name:string
  
}
// 使用 defineProps 泛型来声明props 的类型
defineProps<Props>()

</script>
```

```vue
<!--子组件-->
<template>
  <div class="menu">
    Menu
    <div>
      {{name}}
    </div>
  </div>
</template>

<script setup lang="ts">

type Props={
  name:string
 data?:number[] // 加问号,表示可以不传递data props值,但是此时没有默认值  
}
// 使用 withDefaults来规定默认值,如果类型是对象,则使用函数返回值形式
withDefaults(defineProps<Props>(),{
    data:()=>[1233,54,768]
})


</script>
```







### defineEmits

事件派发,可以有子组件触发事件,传递给父组件,也可以从子组件传值给父组件

```vue
<template>
  <div class="menu">
    Menu
    <div>
      {{name}}
    </div>
    <div>
      <button @click="onClick">派发</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive} from "vue";
    
// defineEmits  是一个函数,接收一个数组,数组中就是传递的事件名称,返回值是 派发对象
const emits =  defineEmits(['on-click'])
let list = reactive([1,23,5])
const onClick = ()=>{
  // 触发子组件事件时,给父组件传递一个事件名称,并且传值给父组件
  emits('on-click',list)
}
</script>
```

```vue
<template>
  <div class="layout">
     <!-- 父组件需要使用 @事件名称 来绑定事件 -->
    <Menu :name="name" @on-click="getData"></Menu>
    <div class="layout-right">
      <Header></Header>
      <Content></Content>
    </div>
  </div>
</template>

<script setup lang="ts">
import Content from './Content/index.vue'
import Header from './Header/index.vue'
import Menu from './Menu/index.vue'

import {reactive, ref} from 'vue'

let name =  ref<string>("zs")

// 子组件派发的事件,参数为子组件传递的参数
const getData = (list:number[])=>{
  console.log(list)
}
</script>
```

### 样式穿透

在使用ui库时,可能需要修改原本组件的样式,则,可以使用 

```css
:deep(.ui-sdsa){
    color:red
}
```

