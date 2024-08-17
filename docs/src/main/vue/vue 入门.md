# vue

第一步肯定是导入vue.js资源

需要创建一个vue 对象

~~~vue
<div id="app">
    {{message}}
</div>

<script>
    var app = new Vue({
        el:"#app",
        data:{
            message:"蓝桥学院"
        }
    })
</script>
~~~

**el** 指的 挂载点  
 ~~~
可以挂载到 其他上面,比如 class id 等等,写法也是一样的
 ~~~

**data**  是绑定的数据

## el

挂载点,可以绑定需要挂载的dom,可以理解为选择器

## data 

**字符串**

直接写的是字符串类型,绑定后,直接显示

~~~vue
message:"蓝桥学院"
~~~



**对象**

安按照js 语法,需要对象点属性

~~~vue
<div>用户名{{user.name}}</div>
<div>年龄{{user.age}}</div>

user:{
    age:19,
    name:"zs",
}
~~~



**数组**

~~~vue
<div>userList:{{userList[1]}}</div>


userList:[19,29,10]
~~~

## v-text

类似`{{}}` 一样,可以进行数据绑定

~~~vue
<h2 v-text="message"></h2>

~~~

## v-html

~~~vue
<div id="app">
    <p v-text="message"></p>
    <p v-html="message"></p>
</div>
<script>
    var app = new Vue({
        el:"#app",
        data:{
            message:"<a href='#'>蓝桥学院</a>"
        }
    })
</script>
~~~

如果是普通文本则 和v-text 一样, 如果,有html代码,则 **v-html** 会解析成html代码

## v-on

用来绑定事件

~~~vue
<div id="app">
    
    <!--绑定事件的3种方式-->
    <input type="button" value="v-on指令" v-on:click="doIt">
    <input type="button" value="v-on指令简写" @click="doIt">
    <input type="button" value="双击" @dblclick="doIt">

    <div>
        {{message}}
    </div>
    <div>
        <input type="button" value="Java 牛逼" @click="checkMessage">
    </div>
</div>

<script>
    var app = new Vue({
        el:"#app",
        data:{
            message:"vue 牛逼"
        },
        methods:{
            doIt:function (){
                alert("hello v-on")
            },
            checkMessage:function () {
              this.message+="java 牛比"
            }
        }
    })
</script>

~~~

在**methods** 中 进行事件编写



同时,修改数据,vue不使用操作dom,vue 修改完数据,页面自动更新

因此,我们修改页面数据,只需要修改绑定的数据就行了

可以使用  **this**  来获取数据对象

## v-show

可以让绑定的dom进行显示或者隐藏

原理是修改元素的 display 

并且**v-show** 支持 表达式

~~~vue
<div id="app">
    <input  type="button" @click="btn" value="切换">
    <img v-show="flag" src="../img/1.jpg" width="500" height="300">
    <img v-show="age>10" src="../img/1.jpg" width="500" height="300">
</div>

<script>
    var app = new Vue({
        el:"#app",
        data:{
            flag:false,
            age: 19,
        },
        methods:{
            btn:function () {
                this.flag = !this.flag;
            }
        }
    })
</script>

~~~

## v-if

v-if 和v-show 差不多 ,唯一区别是 **v-show** 原理是修改 样式修改,**v-if**  则是直接删除该dom树,比较消耗性能



## v-for

~~~html
<!--todos是在Vue 对象中声明的一个变量,todo 是我们遍历整个数组中的每一个值 -->
<div id="app-4">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>

<!-- 可以多写一个参数,index 就是索引 -->
<li v-for="(item,index) in arr" :title="item">
    {{index}} {{item}}
</li>
~~~

~~~javascript
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: '学习 JavaScript' },
      { text: '学习 Vue' },
      { text: '整个牛项目' }
    ]
  }
})
~~~



## v-bind

为元素绑定属性

~~~vue
1 v-bind:src="imgSrc"   # imgSrc 是一个你声明好的数据


2 :src="imgSrc"
~~~

## @keyup

键盘事件

和**@click** 事件类似 但是,可以增加参数,比如

~~~vue
@keyup.enter  
代表回车事件
还有其他,都是类似的用法
~~~

## v-model

**双向数据绑定**,与表单元素进行绑定

~~~vue
<div id="app">
    <input type="text" v-model="message"><br/>
    <p>{{message}}</p>
<!--双向数据绑定,只要改变一方的数据,另外一边也修改-->
</div>

<script>
    var app = new Vue({
        el:"#app",
        data:{
            message:"aaa"
        },
    })
</script>
~~~

注意 双向数据绑定只能绑定 表单 **input**

# 网络请求

## axios

首先导入,axios 资源

axios 是一个功能强大的网络请求库,发送的还是ajax请求

语法

~~~vue
sendGet:function () {
//get请求和post请求方法一样
    axios.get("url")
    .then(function (result) {
    //请求成功后,返回result
    },function (err) {
    //请求失败,触发函数
    }

)}
~~~

## 钩子函数

mounted(){}在加载完成时,可以进行一些操作,比如发送异步请求等

~~~vue
//可以把里面的值返回出去,相当于定义变量
data(){
	return{
		json{
			//这里的格式必须和返回的返回的格式一样
		}
	}
}
mounted(){
	axios.get("url").then(resutl=>(this.json=result)
	// => 这个和Java的lamber 差不多
}
~~~





# 自定义组件

~~~vue
<div id="app">

    <ol>
        <todo-item></todo-item>
    </ol>
</div>


<script src="../vue.js"></script>
<script>
    //todo-item 是这个组件的名称,template 是模板内的内容,要使用它, 就像html标签一样 <todo-item></todo-item> 
    Vue.component('todo-item', {
        template: '<button @click="domore" >www</button>',
        methods:{
            domore:function () {
                this.todo="domore"
            }
        }
    });
    
    
    var app = new Vue({
        el:"#app",
        data:{
            todo:"aaaa"
        }

    })
</script>

~~~

> 由于vue 实例对象和组件,属于同级关系,所以,我们想要往组件中传递参数的话,必须使用`props`属性声明

## props

~~~vue
<div id="app">

    <ol>
        <todo-item v-bind:val=ite></todo-item>
    </ol>
</div>


<script src="../vue.js"></script>
<script>
    Vue.component('todo-item', {
        props:['val'],//记住,一定要加引号,否则无法声明这个变量
        template: '<button @click="domore" >www</button>7',
        methods:{
            domore:function () {
                this.todo=this.val
            }
        }
    });
    
    
    var app = new Vue({
        el:"#app",
        data:{
            todo:"aaaa"
        }

    })
</script>


~~~

**用法二**

~~~vue
<div id="app">
    <my-comment v-for="obj in item" v-bind:va="obj"></my-comment>
</div>


<script src="../vue.js"></script>
<script>
	//这里的 va 相当于就是这个组件的属性,然后,模板中又用到这个属性,
    Vue.component('my-comment',{
        props:['va'],
        template:'<li>{{va}}</li>'
    });

    var app = new Vue({
        el:'#app',
        data:{
            item:["aa","bb","cc"]
        }

    });
</script>
~~~

> 你可以自己设置`props` 属性的类型

~~~vue
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise // or any other constructor
}
~~~

##  插槽

~~~vue
<div id="app">
    <my-slot>
        <!--slot 声明是插入的是哪个组件-->
        <my-title slot="my-title"></my-title>
        <my-item slot="my-item" v-bind:val="obj" v-for="obj in item"></my-item>
    </my-slot>
</div>
<script>

    Vue.component("my-slot",{
        // <slot></slot> 使用这个标签来声明插槽的位置,使用时,用name属性,来绑定需要插入的组件
        template:'<div>\n' +
            '    <slot name="my-title"></slot>\n' +
            '    <ul>\n' +
            '        <slot name="my-item"></slot>\n' +
            '    </ul>\n' +
            '</div>'
        
    });


    Vue.component('my-title',{
        template:'<div>标题</div>'
    });

    Vue.component('my-item',{
        props:['val'],
        template:'<li>{{val}}</li>'
    });

    var app = new Vue({
        el:'#app',
        data:{
            item:["aa","bb","cc"]
        }

    });
</script>
~~~

## 事件分发

有时候,我们需要再组件中使用vue实例对象中的方法,因为vue实例对象中的方法,可以直接操控数据`data` ,但是,实例和组件,2者时不同的东西,我们想要达到这样的效果,必须使用事件分发

~~~
// 这里的 remove 是自定义事件的名称，需要在 HTML 中使用 v-on:remove 的方式指派 如果需要传递参数直接传递就行了
this.$emit('remove');
~~~

