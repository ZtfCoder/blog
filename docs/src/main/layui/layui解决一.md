---
title: layui后台界面选项卡边框变长
tags:
  - layui
  - 前端
categories: layui
abbrlink: 9d48b192
---





## 起因

最初是在[layuiadmin](https://www.layui.com/layuiadmin/std/dist/views/) 看到这样的选项卡有着边框变长的样式,~~本着一颗前端的心~~ 去学习

> 当前版本：v2.6.7

### iframe 选项卡

首先,是选项卡,layui给出了,原始的后台布局界面,非常好用,但是,如果要做成`iframe` 界面,还是有点差距的

最开始,我也是去参考[layuiadmin](https://www.layui.com/layuiadmin/std/dist/views/) 的实现,用浏览器检查,大概看出来如何实现的

<!-- more -->

**首先**

需要引入`element` 模块,也就是[选项卡](https://www.layui.com/doc/element/tab.html)

去官网抄一个`element`样式过来,放在`<div class="layui-body"></div>` 下

~~~html
<div class="layui-body">
    <!-- 内容主体区域 -->
    <div style="padding-left: 15px;" class="layui-tab" lay-allowClose="true" lay-filter="tab-filter">
        <ul class="layui-tab-title">
            <li class="layui-this" style="">网站设置</li>
            <li>用户基本管理</li>
            <li>权限分配</li>
            <li>全部历史商品管理文字长一点试试</li>
            <li>订单管理</li>
        </ul>
        <div class="layui-tab-content">
            <div class="layui-tab-item layui-show">1</div>
            <div class="layui-tab-item">2</div>
            <div class="layui-tab-item">3</div>
            <div class="layui-tab-item">4</div>
            <div class="layui-tab-item">5</div>
            <div class="layui-tab-item">6</div>
        </div>
    </div>
</div>
~~~

然后打开页面,可以发现,上面多了几个选项卡,并且可以点击

<img src="https://images.wupeiyao.top/notes/20210530112205.png" alt="image-20210530112142060" style="zoom:80%;" />

![image-20210530112159037](https://images.wupeiyao.top/notes/20210530112207.png)

可以发现,点击选项卡切换的内容就是`layui-tab-content` 下面的每一个`div`

如果要用`iframe ` 实现,那么我们把每个`div` 换成一个`iframe ` 不就完美实现了吗?

ok,那么接下来,是给每一个侧边栏加一个**点击事件**

这里我们使用`element`  模块自带的点击事件

~~~js
 element.on('nav(my-nav)', function(data){
            console.log(data);
 });
~~~

`my-nav` 是需要绑定的`lay-filter` 的值,`nav` 则是垂直导航的固定值,无需修改,更多[参考文档](https://www.layui.com/doc/modules/element.html)

<img src="https://images.wupeiyao.top/notes/20210530112949.png" alt="image-20210530112942767" style="zoom:67%;" />



我们的`iframe ` src 属性也就我们需要打开的页面,肯定是要提前写在页面中或者渲染到页面中,那么我们可以给每一个导航

标签也就是最后的`a` 添加一个自定义属性,用于储存需要打开的页面,由于选项卡点击切换还需要一个唯一标识符id,我们也在这个`a`

标签上添加,最后.就变成了

<img src="https://images.wupeiyao.top/notes/20210530115230.png" alt="image-20210530115222803" style="zoom: 67%;" />

```js
element.on('nav(my-nav)', function (data) {
    let my_layui_id = data.attr('my-layui-id');
    let href = data.attr('my-layui-href');

    // 需要去循环遍历查看我们点击的选项卡是否已经生成出来了
    let list = $(".layui-tab-title li");
    let flag = false;//false 表示为生成,true,表示已经存在
    for (let i = 0; i < list.length; i++) {
        if ($(list[i]).attr('lay-id')===my_layui_id){
            // 说明已经存在点击的选项卡,无需再次添加
            flag = true;
            break;
        }
    }
    if (!flag){
        // 如果不存在点击的选项卡,那么就添加一个选项卡
        element.tabAdd('tab-filter', {
            title: '选项卡的标题',
            content: `<iframe width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" src="${href}"></iframe>`, //支持传入html,
            id: my_layui_id
        })
    }
    // 最后再切换到,点击的选项卡
    element.tabChange('tab-filter', my_layui_id);
});
```

最后是全部的代码啦,配合上注释放出来`element.tabAdd()` 是layui 的添加一个选项卡,其中`tab-filter` 

是我给选项卡整体添加的一个`lay-filter="tab-filter"` 可以看上面的选项卡的`html`代码

还是那句话,多参考下文档,这种类型的文档还是比较容易学的,多看文档,提升自己.

### 样式

通过上面的设置,就可以打开页面了,通过垂直导航

但是此时样式还不是特别好看

```css
<style>
    .layui-this{
        background-color: #f6f6f6;
    }
    .layui-tab-title li{
        position: relative;
    }
    /*初始化伪元素的样式*/
    .layui-tab-title li:after{
        content: '';
        width: 0px;
        height: 3px;
        background-color: black;
        position: absolute;
        top: 0;
        left: 0;
        transition: all 600ms;
    }
    /*鼠标悬浮到选项卡上*/
    .layui-tab-title li:hover:after{
        content: '';
        width: 100%;
        height: 3px;
        background-color: black;
    }

    /*当前选中的伪元素*/
    .layui-tab-title .layui-this:after{
        content: '';
        width: 100%;
        height: 3px;
        background-color: black;
        /*去除原始边框样式*/
        border: none;
    }
</style>
```

css嘛,自己随便调的`->_>`