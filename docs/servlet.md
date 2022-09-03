---
lastUpdated: true
---

servlet映射

要想实现tomcat访问Java代码,需要在web_xml里写映射
```xml
<servlet>
    <!--需要给servlet取个名字,可以是任意的-->
    <servlet-name>dom1</servlet-name>
    <!--填写Java类的全类名-->
    <servlet-class>com.ztf.tomCat.ServletDemo1</servlet-class>
</servlet>
<servlet-mapping>
    <servlet-name>dom1</servlet-name>
    <!--设置访问资源名称-->
    <url-pattern>/demo1</url-pattern>
</servlet-mapping>
```

## servlet执行原理

1.当服务器接收到客户端浏览器的请求后,会解析请求URL路径,获取访问的servlet的资源路径

2.查找web.xml文件,是否有对应的`<p>223232</p>`标签内容

3.如果有,则找到对应的`<servlet-class>` 全类名

4,tomcat会将字节码文件加载进内存,并且创建其对象

5.调用其方法



## servlet生命周期

1.被创建:执行init 方法,只会执行一次

2.提供服务:执行service方法 ,可以执行多次

3.被销毁:执行destory方法,只会执行一次

<!--实际上是5个阶段,上述少了2个开始的加载和结尾的卸载,这2步是由servlet容器自动完成 -->

~~~
首先请求到达tomcat
~~~

~~~java
 * 请求到达同web容器时,首先解析请求路径,在web.xml中找url-partent
 * 找到有后,找到对应servlet类后,调用无参构造方法,创建servlet对象,执行init()方法
 * 然后将创建ServletRequest , ServletResponse对象,将请求封装到ServletRequest中
 * 执行 service() 方法
 * web容器销毁时,执行destroy()方法
~~~





## @WebServlet注解

使用@WebServlet注解来代替web.xml配置文件的映射

```java
@WebServlet("资源路径")
```

1个@WebServlet可以设置多个资源路径名称比如

~~~Java
@WebServlet({"/xxx","/zzz"})
~~~



### 资源路径的设置方式

1.@WebServlet("/xxx")

2.@WebServlet("/xxx/xxx")

3.@WebServlet("*.do")

<!--do是任意,自己设定的,-->

### 路径注意细节

~~~
xml 和WebServlet里的路径中的开始的 /  代表 http://localhost:8888/项目名称/

jsp 路径中的开始的 / 代表 http://localhost:8888/   :缺少虚拟路径,如果开始不写/ 则默认为当前项目虚拟路径
~~~







## HttpServlet(常用)/GenericServlet

**HttpServlet** 与 **GenericServlet** 都是抽象类

继承HttpServlet无需再重写service方法,而是重写**doGet()**和**doPost()**方法,HttpServlet类里已经把请求分类处理了,

GenericServlet自由度高,GenericServlet类的方法全部都没有实现,需要自己实现,必须重写service方法,因为在GenericServlet类里service方法是抽象方法

## HTTP协议

全名:Hyper Text Transfer Protocol 超文本传输协议

​	协议定义了客户端与服务器通信时,发送的数据格式

​	特点:

​		1.基于**TCP/IP** 的高级协议

​		2.默认端口号:80

​		3.基于请求/响应模型的:一次请求对应一次响应

​		4.无状态的:每次请求之间相互独立,不能交互数据

历史版本:

​	1.0:每一次请求响应都会建立新的连接

​	1.1:**复用连接**

### 请求数据格式

1.请求行

请求方式 请求url 请求协议/版本

~~~
POST /Java_servlet03/demo2 HTTP/1.1
~~~

请求方式有7种常用2种

​	**get**:

​		1请求参数在url中

​		2.请求长度长度有限

​		3,不太安全

​	**post**:

​		1.请求参数在请求体中

​		2.请求长度没有限制

​		3.相对安全

2.请求头

~~~
Host: localhost:8080
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36 Edg/84.0.522.44
Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signedexchange;v=b3;q=0.9
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Referer: http://localhost:8080/Java_servlet03/a.html
Upgrade-Insecure-Requests: 1
~~~

~~~
Host:请求的主机
User-Agent:浏览器告诉服务器的浏览版本信息
			可以在服务器段获取该头的信息,解决浏览器兼容性问题
Accept:可以解析的格式
Accept-Language:可以支持的语言
Accept-Encoding:支持的压缩格式
Connection:连接状态
Referer:告诉服务器,请求来自哪里
		1:可以防止盗链
		2:可以进行统计
Upgrade-Insecure-Requests:升级信息
~~~



3.请求空行

~~~
就是一个空行
~~~

4,请求体

~~~
你要发送的请求,比如表单,发送文本框的内容则
文本框名称=发送内容
~~~



## Request(请求)

当调用servlet启动时,tomcat会创建2个对象,ServletRequest,和 ServletResponse,

### **继承体系**

ServletResponse 接口

​		继承

HttpServletRequest 接口

​		实现

org.apache.catalina.connector.RequestFacade 类 (tomcat实现类)

### request功能

### 	1.请求消息数据

#### 		1.获取请求行数据

​			**POST /Java_servlet03/demo2?username=aaaa HTTP/1.1**

​			方法:

​				获取请求方式: **GET**

~~~java
	String getMethod()
~~~

​				**(重点)**获取虚拟目录: **/Java_servlet03**

~~~Java
	String getContextPath()
~~~

​				获取Servlet路径:**/demo2**

~~~Java
	String getServletPath()
~~~

​				获取get方式请求参数:**username=aaaa**

~~~Java
	String getQueryString()
~~~

​					**(重点)**获取请求URI:**/Java_servlet03/demo2**

~~~Java
	String getRequestURI()
     //Java_servlet03/demo2
     //URI:统一资源定位符
    StringBuffer getRequestURL() 				  		                         //http://localhost:8080/Java_servlet03/demo2
    //URL:统一资源标识符
~~~

​				获取协议及版本:**HTTP/1.1**

~~~Java
	String getProtocol()
~~~

​				获取客户机的IP地址

~~~java
	String getRemoteAddr()
~~~

#### 2.获取请求头数据

~~~Java
//(重点,常用)
String getHeader(String name)
Enumeration<String> getHeaderNames()//类似迭代器
~~~

~~~Java
String getHeader(String name)
//参数是请求头名称 ,返回请求值数据
~~~

```java
Enumeration<String> headerNames = request.getHeaderNames();
while (headerNames.hasMoreElements()){
    String nextElement = headerNames.nextElement(); //请求头名称
    String value = request.getHeader(nextElement);  //根据请求头返回请求值
    System.out.println(nextElement+"-"+value);
}
```

####   3.获取请求体

**只有POST 请求才有请求体**

需要开启一个输入流才能读取到内容

~~~Java
BufferedReader reader = request.getReader();
String line = null;
while ((line=reader.readLine())!=null){
    System.out.println(line);
}
~~~

### 2.其他功能

#### 1.获取请求参数的通用方法:

请求参数与值:**username=aaaa**

无论是get还是post都可以使用以下方法获取参数值

~~~Java
//根据参数名称获取参数值
String getParameter(String name)
//根据参数名称获取参数值的数组 适用于多个参数值,复选框等
String[] getParameterValues(String name)
// 获取所有请求的参数名称
Enumeration<String> getParameterNames()
//获取所有参数的map集合
Map<String,String[]> getParameterMap()
~~~

~~~java
BeanUtils 可以帮助获取参数并封装成JavaBean对象,可以简化setter过程
BeanUtils.populate(Object obj,Map map)
map就是使用的通用方法里的 getParameterMap()所有的参数名称与值,键是参数名称,值是属性,obj就是你要封装的JavaBean对象
~~~





#参数中文乱码问题,get方式,tomcat解决了,post方式需要自己解决

~~~Java
request.setCharacterEncoding("utf-8");
~~~

#### 2.请求转发:

一种在服务器内部资源的跳转方式

​	1.步骤

​		1.通过request对象获取请求转发器:

~~~java
RequestDispatcher request.getRequestDispatcher("资源访问路径")
~~~

​		2.使用RequestDispatcher对象的forward方法来进行转发

~~~
void forward(ServletRequest var1, ServletResponse var2)
~~~

​	2.特点

​		1.浏览器地址栏路径不发生变化

​		 2.只能转发到当前服务器内部资源中

​		 3.转发是一次请求

#### 3.共享数据

域对象:一个有作用范围的对象,可以在范围内共享数据

request域:代表一次请求的范围,一般用于请求转发的多个资源中共享数据

#方法

~~~Java
void setAttribute(String name, Object obj) //存储数据 name:存储数据的名字 obj:存储对象
Object getAttribute(String name) //根据存储数据的名字来获取存储数据
void removeAttribute(String name) //通过名字来移除存储数据
~~~

#### 4.获取ServletContext

~~~java
ServletContext getServletContext()
~~~



## Response(响应)

### 响应消息:

服务器端发送给客户端的数据

​	1.响应行

~~~
HTTP/1.1 200
~~~

~~~
组成:协议/版本 响应状态码 状态码描述
响应状态码:服务器告诉客户端浏览器本次请求的和响应的一个状态
	状态码都是3位数
	分类
		1:1xx 服务器接收到客户端消息,但是还没有接受成功,等待一段时间后,发送1xx状态码
		2:2xx 成功.代表:200
		3:3xx 重定向 代表:302(重定向) ,304(访问缓存)
		4:4xx 客户端错误
			404:请求路径没有对应的资源
			405:请求方式没有对应的doXxx方法
		5:5xx 服务器端错误.代表:500 服务器内部出现异常
~~~



​	2.响应头

~~~
Accept-Ranges: bytes
ETag: W/"375-1596279726676"
Last-Modified: Sat, 01 Aug 2020 11:02:06 GMT
Content-Type: text/html
Content-Length: 375
Date: Sun, 02 Aug 2020 03:06:22 GMT


~~~

​												**常见的响应头**

~~~

	1.content-Type:服务器告诉客户端本次响应体数据格式以及编码格式
	2.content-disposition:服务器告诉客户端以什么格式打开响应体数据
		1.in-line:默认值,在当前页面打开
		2.attachment;filename=xxx:以附件形式打开响应体.文件下载
~~~



​	3.响应空行

~~~

~~~

​	4.响应体

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>登录</title>
</head>
<body>
    <form action="/Java_servlet03/ServletLogin" method="post">
        用户名:<input type="text" name="username"></br>
        密码:<input type="password" name="password"></br>
        <input type="submit" value="登录">
    </form>
</body>
</html>
~~~

### 重定向

**实现资源跳转方式**

~~~java
//1.设置状态码302
response.setStatus(302);
//设置响应头location
response.setHeader("location",资源的绝对路径);
本机可以省略http只需要 虚拟目录+资源路径
~~~



~~~Java
简写方式
response.sendRedirect(资源的绝对路径);
~~~



**与请求转发的区别**

| 序号 |                问题                |  重定向  | 请求转发 |
| :--: | :--------------------------------: | :------: | :------: |
|  1   |        第二次请求谁请求的？        |  浏览器  |  服务器  |
|  2   |       浏览器发送了几次请求？       | 2次以上  |   1次    |
|  3   |     servlet可以共享request吗？     |  不可以  |   可以   |
|  4   |        地址栏是否发生改变？        |    是    |   不是   |
|  5   | 浏览器地址栏显示的哪一次访问地址？ | 最后一次 |  第一次  |
|  6   |        可以跳转到什么资源？        | 任意资源 | 项目内部 |
|  7   |        第二次的请求路径是？        | 绝对路径 | 内部路径 |

### 服务器输出字符数据

1.获取字符输出流

```
PrintWriter writer = response.getWriter();
```

2.输出数据

```
writer.write("你好 response");
```

~~~
注意乱码问题
response.getWriter() 获取到的流是iso-8856-1
需要统一设置浏览器的解码方式
response.setContentType("text/html;charset=utf-8");
~~~

### ServletContext

1.概念:代表整个web应用,可以和程序(服务器)来通信

2.获取:

​	**1.通过request对象获取**

~~~Java
request.getServletContext();
~~~

​	**2.通过HttpServlet获取**

~~~Java
this.getServletContext();
~~~

3.功能

​	**1.获取MINE类型**

​		MINE类型是在互联网通信过程中定义的一种文件数据类型

​			格式:大类型/小类型  text/html  imge/jpeg

~~~java
String getMimeType(文件名称)
~~~



​	**2.域对象:共享数据**

~~~java
可以获取所有的用户的所有请求
~~~



​	**3.获取文件的真实(服务器)路径**

~~~
获取文件的服务器路径
this.getServletContext().getRealPath()

1.web目录下的资源
/b.txt

2.WEN-INF目录下的资源
/WEN-INF/c.txt

3.src目录下的资源
/WEN-INF/classas/a.txt


~~~
