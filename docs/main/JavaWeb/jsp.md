# JSP

Java Server Pages :java 服务器端页面

## 原理

```
本质上是Servlet
jsp会先转换成Java代码,之后编译成class文件
```

<!-- more -->

## 脚本

**<% 代码%>**

```
定义在service方法中的代码,service可以写什么,脚本就可以些什么
```

**< %! 代码 %>**

```
成员变量的位置
```

**<%= 代码 %>**

```
输出,写什么就输出什么

```

## 指令

<%@ 指令名称 属性名称 1=属性值 1 属性名称 2=属性值 %>

分类

### 1.page 配置 jsp 页面的

```
contentType:等同于response.setContentType()
			1.设置响应体的mine类型以及字符集
			2.设置当前jsp页面的编码方式(idea自动设置),其他工具				一般需要设置pageEncoding属性设置当前页面的字符集
import:导包
errorPage:当前页面发生异常后,自动跳转到指定的错误页面
isErrorPage:标识当前页面是否是错误页面
			true:可以使用内置对象exception
			false:不可以使用
include:页面包含的,导入页面的资源文件
taglib:导入资源

```

### 2.内置对象

jsp 页面不需要创建的对象

| 变量名         | 真实类型            | 作用                                         |
| :------------- | :------------------ | :------------------------------------------- |
| pageContentext | PageContext         | 当前页面共享数据,还可以获取其它 8 个内置对象 |
| request        | HttpServletRequest  | 一次请求访问的多个资源(转发)                 |
| session        | HttpSession         | 一次会话的多个请求间                         |
| application    | ServletContext      | 所有用户间共享数据                           |
| response       | HttpServletResponse | 响应对象                                     |
| page           | Object              | 当前页面                                     |
| out            | JspWriter           | 输出对象,                                    |
| config         | ServletConfig       | Servlet 配置对象                             |
| exception      | Throwable           | 异常对象                                     |

# EL 表达式

```
${代码}
```

EL 表达式只能从域对象中获取值

## 域名称

```
1.pageScope		   ->pageContext
2.requestScope	   ->request
3.sessionScope	   ->session
4.applicationScope ->application(ServletContext)
```

```
用法${域名称.键名} 从指定域中获取指定键的值
比如在request域中获取存储了name=张三
${requestScope.name}
会直接把值获取到打印到网页上
可以简写为 ${name}
会先从最小的域中寻找,找到了即停止

```

## 获取对象

使用:`${域名称.键名.属性名称}`

**List 集合**

`${域名称.键名[索引]}`

**Map 集合**

`${域名称.键名.key 名称}`

`${域名称.键名[key 名称]}`

## 隐式对象

pageContext

使用方法

动态获取虚拟目录
`${pageContext.request.contextPath}`

# JSTL 标签

可以简化 Java 代码替换 jsp 代码

需要导入 jar 包

声明指令

```
<%@ taglib="" uri=""%>
taglib 是声明一个前缀字符串,可以是任意值,通常使用"c"
```

## if

**java 代码中 if 分支**

```
<c:if test="true">
    hello if
</c:if>
```

if 标签需要添加一个 test 属性 ,属性为布尔表达式,一般在这里配合 EL 表达式使用,if 标签没有 else,如果不符合,则声明都不显示

## choose

**Java 代码中的 switch 语句**

when 标签代表 Java 代码中的 case

otherwise 代表 Java 代码中的 default

```
<c:choose>
    <c:when test="${day==1}">
        <h1>周一</h1>
    </c:when>
    <c:when test="${day==2}">
        <h1>周二</h1>
    </c:when>
    <c:when test="${day==3}">
        <h1>周三</h1>
    </c:when>
    <c:when test="${day==4}">
        <h1>周四</h1>
    </c:when>
    <c:when test="${day==5}">
        <h1>周五</h1>
    </c:when>
    <c:when test="${day==6}">
        <h1>周六</h1>
    </c:when>
    <c:when test="${day==7}">
        <h1>周日</h1>
    </c:when>
    <c:otherwise>
        没有这一天
    </c:otherwise>
</c:choose>
```

## forEach

**Java 代码中的 for 循环**

普通的循环

```
<c:forEach begin="0" end="10" step="1" var="i">
    ${i}
</c:forEach>
```

begin 代表初始值

end 代表结束值

范围:[begin,end]

step 代表递增的数字

var 代表临时变量

增强循环

```
<%
    List list = new ArrayList();
    request.setAttribute("list",list);
    list.add("1");
    list.add("2");
    list.add("3");
%>
<c:forEach items="${list}" var="i" varStatus="s">
    ${s.count} ${s.index} ${i} </br>
</c:forEach>
```

items 表示你要引用的集合对象
