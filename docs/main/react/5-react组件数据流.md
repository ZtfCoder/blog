---
title: react 第5节
description: react props
---

## 父子组件

在实际开发中,一个页面的代码非常多,随着项目继续开发,页面的代码会越来越多,导致维护困难,在这个时候,我们通常会把一个页面的代码拆分到不同的`jsx`文件中, 这些`jsx` 文件,我们统称为组件

![alt text](ts/image4.png)

可以看到,我们把页面拆分成了 4 个组件,每个组件都是独立的`jsx` 文件

这样方便我们不同的人在一个页面进行独立开发,开发完后,再统一合并到一个`jsx` 文件中,最终组成了我们的页面

其中 最终合并的 jsx 文件 我们叫`父组件`, 例如上图中,组件 1,组件 2,组件 3,组件 4 我们统称为 这个父组件的 子组件,拥有父子关系

以下是父子组件的用例

```jsx
// 这是我们的页面组件
import { useState } from "react";
import Header from "./components/Header";
import UserList from "./components/UserList";
import Footer from "./components/Footer";
const Page = () => {
  const [title, setTitle] = useState("这是标题");
  const [userList, setUserList] = useState(["zs", "ls", "ww"]);
  return (
    <div>
      <Header></Header>
      <UserList></UserList>
      <Footer></Footer>
    </div>
  );
};
export default Page;
```

在 Page 组件中,我们引入了 3 个组件 `Header`,`UserList`,`Footer`,这 3 个组件,就是 Page 的子组件,而 Page 就是`Header`,`UserList`,`Footer`这 3 个组件的父组件

在 Page 组件的 jsx 文件目录下创建`components` 目录,用于存放 Page 组件的子组件
然后创建`Header`,`UserList`,`Footer`这 3 个组件

```jsx
const Header = () => {
  return <div>这里是 Header</div>;
};
export default Header;
```

```jsx
const UserList = () => {
  return <div>这里是 UserList</div>;
};
export default UserList;
```

```jsx
const Footer = () => {
  return <div>这里是 Footer</div>;
};
export default Footer;
```

## props

一个页面,是有不同的数据渲染出来的,上面我们拆分了 Page 页面成三个独立的组件,我们如何才能把`Page` 页面的数据传递给我们的子组件呢,此时就需要使用 `react` 提供的 `props` 功能,所谓 props 就是用于把父组件的数据,传递给子组件,在上面的案例,我们需要把 `title` 传递给 `Header` 组件,把`userList` 传递给 `UserList` 组件

首先我们需要在我们的子组件中声明我们这个组件是需要接受外部传递数据的,写在`Header`函数的参数上,通常是写成 `props` 这个名字,

```jsx
const Header = (props) => {
  // 一般我们在组件内使用解构的形式获取对象中的值(只是习惯,也可以不按照这样)
  const { title } = props; // 从props 中 获取由父组件传递过来的数据,名字叫title
  // 省略内容
  return <div>title:{title}</div>; // 把title 渲染到页面上面
};
```

其中函数式组件的参数就是我们的 props,其他组件想要传递则需要按照以下格式

```jsx
// 这是我们的页面组件
import { useState } from "react";
import Header from "./component/Header";
import UserList from "./component/UserList";
import Footer from "./component/Footer";
const Page = () => {
  const [title, setTitle] = useState("这是标题");
  const [userList, setUserList] = useState(["zs", "ls", "ww"]);
  return (
    <div>
      <Header title={title}></Header> {/* 在这里用,我们把title 传递给子组件 */}
      <UserList></UserList>
      <Footer></Footer>
    </div>
  );
};
export default Page;
```

回到页面就可以看到父组件中的值,在子组件中给渲染出来了

这里需要注意,子组件中的 props 变量是不能在组件进行更改的,不能去修改子组件的 props 值,我们只能通过父组件的函数进行修改

props 中可以传递任何值,也可以传递一个函数进来

```jsx
import { useState } from "react";
import Header from "./component/Header";
import UserList from "./component/UserList";
import Footer from "./component/Footer";
const Page = () => {
  const [title, setTitle] = useState("这是标题");
  const [userList, setUserList] = useState(["zs", "ls", "ww"]);

  const handleChangeTitle = (title) => {
    setTitle(title);
  };

  return (
    <div>
      <Header title={title} updateTitle={handleChangeTitle}></Header> {/* 在这里用,我们把handleChangeTitle 传递给子组件 */}
      <UserList></UserList>
      <Footer></Footer>
    </div>
  );
};
export default Page;
```

然后修改子组件的参数,

```jsx
const Header = (props) => {
  // 一般我们在组件内使用解构的形式获取对象中的值(只是习惯,也可以不按照这样)
  const { title, updateTitle } = props; // 从props 中 获取由父组件传递过来的数据,名字叫title,这里的updateTitle 就是父组件传递过来的handleChangeTitle

  // 省略内容
  return (
    <div>
      title:{title}
      <button onClick={() => updateTitle("hxg")}>请点击更改</button>
    </div>
  ); // 把title 渲染到页面上面
};
```

这里可以看到我们虽然在父组件里写的是 `updateTitle={handleChangeTitle}`
但是在子组件我们这个函数的名字是`updateTitle` 所以,props 的名称,不一定要和变量名称一致

此时我们点击按钮,就会触发 `updateTitle` 而`updateTitle` 实际上是父组件的`handleChangeTitle` 这个函数,所以触发`updateTitle`的本质上是触发了`handleChangeTitle` 这个函数

注意 props 可以无限传递,可以传递给子组件的子组件 但是比较繁琐,对于这种情况 react 有解决方案,后续会讲

练习下,把 把父组件的`userList` 变量传递给 `UserList` 组件,进行渲染

::: warning 提示
我们知道当组件内调用 setXXX 的时候会使页面重新渲染,也就是让函数组件重新执行一次,
如果在父组件内使用了 setXXX 的 useState 函数时,父组件重新渲染的同时,子组件也会重新渲染,
但是如果子组件进行 setXX 的时候,并不会触发父组件的渲染
:::

## props 案例

在项目里我们会封装一些常见的组件,比如,封装一个通用的`loading` 组件,能够在任何地方引入进行一个转圈显示,又例如,我们会封装项目使用的通用按钮
能够在任何地方引入,这样的好处是整个项目的按钮风格是统一的,不然,每个人写的按钮样式不一样,会导致风格差异过大

我们在项目的根目录下的`components` 文件夹下创建`Loading` 组件,创建 jsx 文件前,记得先创建一个`Loading`的文件夹

```jsx
import styles from "./index.module.css";
const Loading = () => {
  return (
    <i className={styles.loading}>
      <img
        src="https://fastly.jsdelivr.net/gh/ZtfCoder/img/loading.png"
        className={styles.img}
      />
    </i>
  );
};

export default Loading;
```

`index.module.css` 文件内容

```css
.loading {
  display: inline-block;
  animation: spin 1s infinite linear;
}
//创建一个动画帧，从 0% 到 100% 旋转 360 度
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.img {
  width: 25px;
  height: 25px;
  object-fit: cover;
}
```

此时我们就创建一个`loading`的组件,当我们引入这个组件到其他的页面的时候,他就会显示出来,并进行转圈起到一个加载的作用

我们再在`pages` 目录下创建一个页面`LoadingPage` 用来展示这个案例

```jsx
// 这里引入的路径根据自己的来写
import Loading from "../../components/Loading";

const LoadingPage = () => {
  return (
    <div>
      <Loading />
    </div>
  );
};
export default LoadingPage;
```

在`APP` 里引入`LoadingPage` 就可以看到这个加载组件了

但是,我们可以发现,此时我们无法控制这个组件什么时候停止转圈,也就是我们无法控制什么时候显示这个加载,什么时候不显示这个加载,所以,我们引入了`props` 来告诉这个组件,什么时候显示,什么时候不显示

我们通过在页面给`loading` 组件传递一个值,用这个值来告诉,是否进行显示,通常,我们会先给`Loading` 组件编写`props`的代码,然后再回到页面,去给组件传值,这样的好处是就是相当于,先声明变量,然后再使用变量,这种意思

```jsx
import styles from "./index.module.css";
// 这里 的props 可以叫任意值,不一定叫props,我们通常叫props,因为这是一个约定俗成的名字
// props 表示的是父组件传递给子组件的数据
const Loading = (props) => {
  // 这里的loading 是从父组件传递过来的,这里的loading 是一个布尔值,如果为true,则显示加载中,如果为false,则不显示加载中
  const { loading } = props;
  // 如果loading 为false,则返回null,不显示加载中
  if (!loading) {
    return null; // react中,如果返回null,则表示不显示任何内容
  }
  // 如果loading 为true,则显示加载中
  return (
    <i className={styles.loading}>
      <img
        src="https://fastly.jsdelivr.net/gh/ZtfCoder/img/loading.png"
        className={styles.img}
      />
    </i>
  );
};

export default Loading;
```

回到`LoadingPage.jsx`

```jsx
// 这里引入的路径根据自己的来写
import { useState } from "react";
import Loading from "../../components/Loading";

const LoadingPage = () => {
  // 这里的loading 是一个布尔值,如果为true,则显示加载中,如果为false,则不显示加载中
  const [loading, setLoading] = useState(false);

  return (
    <div>
      {/* 把 loading 值传递给 Loading 组件   */}
      <Loading loading={loading} />
      <div>
        <button onClick={() => setLoading(!loading)}>点击我</button>
      </div>
    </div>
  );
};
export default LoadingPage;
```

## 组件嵌套

有时候,我们希望我们封装的组件能够实现嵌套复用,例如,二手交易市场, 移动端 h5 项目,页面都有一些共同的部分

例如,左上角都有返回箭头,点击可以返回上个页面,每个页面 header 头中间都有当前页面的名字,所以我们可以吧这些内容都封装成一个组件,实现方式有 2 种,单独写一个`Header` 组件,然后在每个页面中引入,
例如

页面 1

```jsx
const Page1 = () => {
  return (
    <>
      <Header title="页面1" />
      <User />
    </>
  );
};
```

页面 2

```jsx
const Page2 = () => {
  return (
    <>
      <Header title="页面2" />
      <User />
    </>
  );
};
```

页面 3

```jsx
const Page2 = () => {
  return (
    <>
      <Header title="页面3" />
      <User />
    </>
  );
};
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
const UserPage = () => {
  return (
    <>
      <Page title="用户信息页">
        <div>div1</div>
        <div>div2</div>
        <div>div3</div>
        <div>div4</div>
        <div>div5</div>
        <div>div6</div>
      </Page>
    </>
  );
};
```

这里可以看到,我们实现了自定义组件的嵌套,写起来就和 普通的 html 标签一样,这样我们就可以在每个页面使用这个`Page` 组件嵌套,减少我们写重复代码,项目开发中可能会嵌套好几层

前面不是提到`props` 可以是任意值吗,我们不仅可以传递函数,还可以传递一个 react 组件到页面中,可以看到,我们在`Page` 组件中的 props 使用了 `right ` 这个变量,这个主要是放在页面头部的右侧,把头部分成三部分,左中右,这样我们就可以根据场景选择性的传入不同右侧组件,可以实现非常灵活的使用

一下是使用方式

```jsx
const UserPage = () => {
  // 定义一个函数式组件,注意,react 虽然允许你在组件内定义组件,但是很少我们这么操作,你可以写在外面,单独的文件,或者写在当前 UserPage 函数外都可以,
  const Right = () => {
    return <h2>右侧内容</h2>;
  };

  return (
    <>
      <Page title="用户信息页" right={Right()}>
        <div>div1</div>
        <div>div2</div>
        <div>div3</div>
        <div>div4</div>
        <div>div5</div>
        <div>div6</div>
      </Page>
    </>
  );
};
```

这样就可以看到右侧内容已经被渲染出来了,为什么传入 right 就会渲染出来呢,因为我们最开始写 Page 组件的时候把 `right`已经渲染在 div 上了,可以回头看下`Page` 组件

## props 和组件嵌套的案例

在购物车案例中,我们写过一段代码

```jsx
{
  carList.length > 0 && (
    <>
      <div className={styles.checkAllBox}>
        全选：
        <input
          type="checkbox"
          className={styles.goodsCheckAll}
          onChange={checkALL}
          checked={isCheckALL}
        />
      </div>
      <div>当前总价：{currentTotal}元</div>
    </>
  );
}
```

这段代码,表示当购物车里有数据的时候,即 carList 数组的长度大于 0 的时候,才会显示全选,以及总价信息,

我们要根据某个条件为 true 的时候,才会显示后面的代码,这里,只是根据`carList.length > 0`这个条件,如果以后,我们的条件变的特别的复杂的时候,这样写就不方便了,于是,我们需要开发一个通用的组件,组件的作用就是根据某个条件,来判断是否需要显示后续内容

在项目的根目录下的`components`文件夹下,创建`Visible` 组件,记得要先创建文件夹,再创建 jsx 文件

自定义一个叫`Visible`的组件,作用就是根据`props`里面的一个值,暂且命名为`visible`,来判断是否显示组件的内的内容,当`visible`的值为 false 的时候,我们就不显示这个组件内的内容,如果为`true`,则显示组件内的内容

```jsx
const Visible = (props) => {
  // visible 表示是否显示当前组件的内容  children 表示 Visible 组件下的内容,不好理解可以先跳过这个值
  const { visible, children } = props;
  if (!visible) return null; // 如果react组件内返回null,则表示不渲染当前这个组件
  return children; // return children; 则表示渲染当前 Visible 下面的全部内容
};

export default Visible;
```

然后在`pages` 目录下 创建`VisiblePage` 页面,引入我们的 `Visible`组件

```jsx
import { useState } from "react";
import Visible from "../../components/Visible"; //这里根据自己的目录来引入
const VisiblePage = () => {
  const [visible, setVisible] = useState(true);
  return (
    <div>
      <button onClick={() => setVisible(true)}>点击显示组件</button>
      <button onClick={() => setVisible(false)}>点击隐藏组件</button>
      <Visible visible={visible}>这里是children</Visible>
    </div>
  );
};
export default VisiblePage;
```

解释下这段代码,意思是,点击 2 个按钮的时候可以改变`visible`的值,让 visible 为 true 的时候,则会让`Visible` 组件下面的内容显示,如果为`false`则不展示

解释下`Visible`组件内的 `children`,

当我们在某个组件内部进行嵌套写内容的时候,此时这个组件会在 props 里存在一个值叫`children`(一定是这个名字,固定的)

此时`children` 表示这个组件嵌套的内容,例如,上方的`Visible`组件,它的嵌套内容则 `这里是children` 这样一段文字,这段文字可以写改成任何代码,你可以在里面写 div 标签,还可以在里面写一个你封装的另外一个组件

可以看到 如果 `!visible` 则会返回`null` ,jsx 对于返回为`null`的结果是不会进行显示的

对此我们可以替换购物车的那段代码

```jsx
<Visible visible={carList.length > 0}>
  <div className={styles.checkAllBox}>
    全选：
    <input
      type="checkbox"
      className={styles.goodsCheckAll}
      onChange={checkALL}
      checked={isCheckALL}
    />
  </div>
  <div>当前总价：{currentTotal}元</div>
</Visible>
```

通过这种方式,可以让我们的代码阅读起来更加方便,当`carList.length > 0` 时,才会显示总价内容,否则不显示,而且通过这种形式嵌套的形式开发,可以让 react 以组件形式开发,每一个段都是一个组件,我们只需要去维护单独的组件即可

## 购物车拆分

对于拆分,我们通常会把具有很多 HTML 解构的代码抽离出去,并且这部分代码是相对独立的

例如,购物车的列表渲染,基本上是独立的,只是依赖一个数组,和按钮的交互事件,所以我们可以把列表进行拆分

在 index.jsx 目录下创建 `components` 目录,用于存放,购物车页面里的组件
然后创建一个 `CartList` 组件

我们把列表渲染的 html 部分拷贝到新的组件中,再创建一个 css 文件把 css 拷贝进去

```jsx
import styles from "./index.module.css";

const CartList = () => {
  return (
    <ul className={styles.CartList}>
      {/* 将cartList的数据渲染出来 */}
      {carList.map((item, index) => {
        return (
          <li className={styles.CartListItem} key={item.id}>
            <input
              type="checkbox"
              className={styles.goodsCheckBox}
              checked={checkGoodsList.find((id) => {
                return id === item.id;
              })}
              onChange={() => checkGoods(item.id)}
            />
            <div>{index + 1}.</div>
            <div>名称:{item.goodsName}</div>
            <div>单价:{item.goodsPrice}元</div>
            <div className={styles.CartListItemCount}>
              <button
                className={styles.CartListItemAddCount}
                onClick={() => {
                  addGoodsCount(item.id);
                }}
              >
                +
              </button>
              <div className={styles.CartListItemCountNum}>
                {item.goodsCount}
              </div>
              <button
                // disabled={item.goodsCount<=1}
                className={styles.CartListItemDelCount}
                onClick={() => {
                  delGoodsCount(item.id);
                }}
              >
                -
              </button>
            </div>
            {/* 删除商品 */}
            <button
              className={styles.delGoods}
              onClick={() => {
                delGoods(item.id);
              }}
            >
              删除
            </button>
          </li>
        );
      })}
      {carList.length > 0 && (
        <>
          <div className={styles.checkAllBox}>
            全选：
            <input
              type="checkbox"
              className={styles.goodsCheckAll}
              onChange={checkALL}
              checked={isCheckALL}
            />
          </div>
          <div>当前总价：{currentTotal}元</div>
        </>
      )}
    </ul>
  );
};

export default CartList;
```

我们可以看到目前`CartList` 有一些方法是没有的,还有一些 useMemo 计算的值

例如:`carList` 列表的数据没有,`checkGoodsList` 这个方法是没有的,`checkGoods` 单选框的事件,这些值我们将通过 props 把它们从父组件,传递到子组件当中

```jsx
import styles from "./index.module.css";

const CartList = (props) => {
  // 通过解构语法的形式,从props 中取出
  const {
    carList, // 列表数据
    checkGoodsList, // 已勾选的id集合
    checkGoods, //复选框点击事件
    addGoodsCount, //增加商品数量
    delGoodsCount, // 减少商品数量
    delGoods, // 删除商品
    currentTotal, // 计算总价
    checkALL, // 全选复选框点击事件
    isCheckALL, // 是否全选
  } = props;

  return (
    <ul className={styles.CartList}>
      {/* 将cartList的数据渲染出来 */}
      {carList.map((item, index) => {
        return (
          <li className={styles.CartListItem} key={item.id}>
            <input
              type="checkbox"
              className={styles.goodsCheckBox}
              checked={checkGoodsList.find((id) => {
                return id === item.id;
              })}
              onChange={() => checkGoods(item.id)}
            />
            <div>{index + 1}.</div>
            <div>名称:{item.goodsName}</div>
            <div>单价:{item.goodsPrice}元</div>
            <div className={styles.CartListItemCount}>
              <button
                className={styles.CartListItemAddCount}
                onClick={() => {
                  addGoodsCount(item.id);
                }}
              >
                +
              </button>
              <div className={styles.CartListItemCountNum}>
                {item.goodsCount}
              </div>
              <button
                // disabled={item.goodsCount<=1}
                className={styles.CartListItemDelCount}
                onClick={() => {
                  delGoodsCount(item.id);
                }}
              >
                -
              </button>
            </div>
            {/* 删除商品 */}
            <button
              className={styles.delGoods}
              onClick={() => {
                delGoods(item.id);
              }}
            >
              删除
            </button>
          </li>
        );
      })}
      {carList.length > 0 && (
        <>
          <div className={styles.checkAllBox}>
            全选：
            <input
              type="checkbox"
              className={styles.goodsCheckAll}
              onChange={checkALL}
              checked={isCheckALL}
            />
          </div>
          <div>当前总价：{currentTotal}元</div>
        </>
      )}
    </ul>
  );
};

export default CartList;
```

接着,回到购物车页面,我们删除列表渲染的 html 代码部分,然后把`CartList` 引入
写在刚才我们删除的代码部分,最后把`CartList` 所需要的参数传入即可,这样 列表组件就可以拿到父组件的值

```jsx
<CartList
  carList={carList}
  checkGoodsList={checkGoodsList}
  checkGoods={checkGoods}
  addGoodsCount={addGoodsCount}
  delGoodsCount={delGoodsCount}
  delGoods={delGoods}
  isCheckALL={isCheckALL}
  checkALL={checkALL}
  currentTotal={currentTotal}
/>
```

header 部分也可以拆分下,

同理,在`components` 文件夹下创建`Header` 组件,然后把 header 的 html 代码部分拷贝过来

```jsx
import styles from "./index.module.css";
const Header = (props) => {
  // 因为header 组件需要,设置单价,设置商品名称,设置数据量等方法,所以我们通过props,在父组件中传入
  const { setGoodsName, setGoodsPrice, setGoodsCount, addCart } = props;

  return (
    <div className={styles.header}>
      <div className={styles.headerTitle}>添加库存请输入:</div>
      <div className={styles.headerContent}>
        <div>
          商品名称：
          <input
            type="text"
            onChange={(event) => {
              setGoodsName(event.target.value);
            }}
          />
        </div>
        <div>
          单价：
          <input
            min={0}
            type="number"
            onChange={(event) => {
              setGoodsPrice(Number(event.target.value));
            }}
          />
        </div>
        <div>
          数量：
          <input
            min={0}
            type="number"
            onChange={(event) => {
              setGoodsCount(Number(event.target.value));
            }}
          />
        </div>
        <div>
          <button className={styles.addButton} onClick={addCart}>
            添加
          </button>
        </div>
      </div>
    </div>
  );
};
export default Header;
```

修改购物车页面的代码,删除刚才选择的头部代码,替换成下面代码,

```jsx
<Header
  setGoodsName={setGoodsName}
  setGoodsPrice={setGoodsPrice}
  setGoodsCount={setGoodsCount}
  addCart={addCart}
/>
```

这样就完成了拆分购物车,我们把列表渲染和头部分进行拆分,拆分成独立组件

一下是完整代码

```jsx
import { useMemo, useRef, useState } from "react";
import styles from "./index.module.css";
import CartList from "./components/CartList";
import Header from "./components/Header";

const CartListDemo = () => {
  //购物车列表
  const [carList, setCartList] = useState([]);

  //用户输入的商品信息
  const [goodsName, setGoodsName] = useState("");
  const [goodsPrice, setGoodsPrice] = useState(0);
  const [goodsCount, setGoodsCount] = useState(0);

  //用户选择的商品（多选），存放商品
  const [checkGoodsList, setCheckGoodsList] = useState([]);

  //用户新添加一个商品
  const addCart = () => {
    //判定用户输入的商品信息是否完整
    if (!goodsName || !goodsPrice || !goodsCount) {
      alert("请添加完整的信息！！");
      return;
    }

    //添加一个新的商品
    const newCart = {
      //id这里使用的是时间戳
      id: new Date().getTime(), //获取当前时间
      goodsName,
      goodsPrice,
      goodsCount,
    };
    // console.log(newCart);
    //添加到商品列表CartList
    setCartList([...carList, newCart]);
  };

  //商品数量的加
  const addGoodsCount = (id) => {
    const newCartList = carList.map((item) => {
      if (id === item.id) {
        item.goodsCount++;
      }
      return item;
    });
    setCartList(newCartList);
  };
  //商品数量的减
  const delGoodsCount = (id) => {
    const newCartList = carList.map((item) => {
      if (id === item.id && item.goodsCount > 1) {
        item.goodsCount--;
      }
      return item;
    });
    setCartList(newCartList);
  };

  //删除商品
  const delGoods = (id) => {
    const newCartList = carList.filter((item) => {
      return id !== item.id;
    });
    setCartList(newCartList);
  };

  //多选商品
  const checkGoods = (id) => {
    //判断这个商品是否是选中状态
    const isCheckedGoos = checkGoodsList.find((idTemp) => {
      return idTemp === id;
    });
    //如果这个商品已经被选中，那么取消选中，就是从checkGoodsList中删除这个商品
    if (isCheckedGoos) {
      const newCheckGoodsList = checkGoodsList.filter((idTemp) => {
        return idTemp !== id;
      });
      setCheckGoodsList(newCheckGoodsList);
    } else {
      setCheckGoodsList([...checkGoodsList, id]);
    }
  };
  // console.log(checkGoodsList);

  //全选框状态
  const isCheckALL = useMemo(() => {
    // console.log(checkGoodsList.length )
    // console.log(carList.length)
    return checkGoodsList.length === carList.length;
  }, [checkGoodsList, carList]);

  //点击全选框
  const checkALL = () => {
    if (isCheckALL) {
      setCheckGoodsList([]);
    } else {
      setCheckGoodsList(
        carList.map((item) => {
          return item.id;
        })
      );
    }
  };
  // console.log(checkGoodsList);

  //计算当前总价
  const currentTotal = useMemo(() => {
    //filter 本身就会返回新数组
    return carList
      .filter((item) => checkGoodsList.includes(item.id))
      .reduce((t, item) => {
        return t + item.goodsCount * item.goodsPrice;
      }, 0);
  }, [checkGoodsList, carList]);

  //计算总价
  const total = useMemo(() => {
    return carList.reduce((temp, item) => {
      return temp + item.goodsCount * item.goodsPrice;
    }, 0);
  }, [carList]);

  return (
    <div>
      <div>=========================================</div>
      {/* 头部 添加商品 */}
      <Header
        setGoodsName={setGoodsName}
        setGoodsPrice={setGoodsPrice}
        setGoodsCount={setGoodsCount}
        addCart={addCart}
      />
      {/* 购物车列表 */}
      <CartList
        carList={carList}
        checkGoodsList={checkGoodsList}
        checkGoods={checkGoods}
        addGoodsCount={addGoodsCount}
        delGoodsCount={delGoodsCount}
        delGoods={delGoods}
        isCheckALL={isCheckALL}
        checkALL={checkALL}
        currentTotal={currentTotal}
      />
      {/* 总价 */}
      <div>总价：{total}元</div>
    </div>
  );
};

export default CartListDemo;
```

在项目开发中,一个页面会分成好几个组件,分给不同的人做,负责子组件的开发人员,只需要约束好 props 的参数,即可,无需关心别人如何传入,可以大大增加开发效率
