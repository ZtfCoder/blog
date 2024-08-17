---
title: webService
tags:
  - webService
categories: webService
abbrlink: c069e98a
---
## 介绍

Web Service是一个`平台独立的`，`低耦合的`，`自包含的`、基于可编程的web的应用程序，可使用开放的XML（标准通用标记语言下的一个子集）标准来描述、发布、发现、协调和配置这些应用程序，用于开发分布式的交互操作的应用程序。
<!-- more -->
Web Service技术， 能使得运行在不同机器上的不同应用无须借助附加的、专门的第三方软件或硬件， 就可相互交换数据或集成。依据Web Service规范实施的应用之间， 无论它们所使用的语言、 平台或内部协议是什么， 都可以相互交换数据。Web Service是自描述、 自包含的可用网络模块， 可以执行具体的业务功能。Web Service也很容易部署， 因为它们基于一些常规的产业标准以及已有的一些技术，诸如标准通用标记语言下的子集XML、HTTP。Web Service减少了应用接口的花费。Web Service为整个企业甚至多个组织之间的业务流程的集成提供了一个通用机制。



### 组成

主要由 **XML,SOAP和WSDL** 这三种技术组成

~~~
XML :用于网页展示,存储数据等功能
~~~

~~~
SOAP : 
~~~

~~~
WSDL :基于XML的语言，用于描述Web Service及其函数、参数和返回值。

WSDL 文件保存在Web服务器上，通过一个url地址就可以访问到它。客户端要调用一个WebService服务之前，要知道该服务的WSDL文件的地址。 WebService服务提供商可以通过两种方式来暴露它的WSDL文件地址：
1.注册到UDDI服务器，以便被人查找；
2.直接告诉给客户端调用者。
~~~





### 总结

~~~
是一种跨语言,跨平台的远程调用技术
~~~

 **跨编程语言和跨操作平台☞就是说服务端程序采用java编写，客户端程序则可以采用其他编程语言编写，反之亦然！跨操平台则是指服务端程序和客户端程序可以在不同的操作系统上运行。**





## **webService 的优势**

~~~
*　平台无关。不管你使用什么平台，都可以使用Web service。

*　编程语言无关。只要遵守相关协议，就可以使用任意编程语言，向其他网站要求Web service。这大大增加了web service的适用性，降低了对程序员的要求。

*　对于Web service提供者来说，部署、升级和维护Web service都非常单纯，不需要考虑客户端兼容问题，而且一次性就能完成。

~~~

## 规范

**Java 中共有三种WebService 规范，分别是**

**JAXM&SAAJ、**  

**JAX-WS（JAX-RPC）、** 需要单独下载依赖

**JAX-RS。** 针对 `REST风格` 制定的一套web 服务规范,因为推出较晚,所以,没有随jdk1.6发行



## 服务端开发

举一个例子 我们要开发一个天气系统

首先创建一个接口

~~~java
public interface WeatherService {
    /**
     * 
     * @param city 城市
     * @return 该城市今天的天气
     */
    String todayWeather(String city);
    
}
~~~

创建这个接口的实现

~~~java
import javax.jws.WebParam;
import javax.jws.WebService;

@WebService
public class WeatherServiceImp implements WeatherService{
    @Override
    public String todayWeather(@WebParam(name = "city") String city) {
        return "晴";
    }
}
~~~

这里用到2个注解`@WebService`  `@WebParam`

其中`@WebService` 声明这个是一个web服务,

它会将该类中的非静态,公开,非final 的方法暴露出去

`@WebParam` 则是说明参数名称,不要也可以,它有默认名称

写一个启动类

~~~java
import javax.xml.ws.Endpoint;

public class ReleaseService {
    public static void main(String[] args) {
        Endpoint.publish("http://127.0.0.1:8080/WethereService",new WeatherServiceImp());
        System.out.println("服务端已开启");
    }
}
~~~

启动main 方法,看到 `服务端已开启`说明 我们的服务已经开启,接下来,我们访问下wsdl 文档

http://127.0.0.1:8080/WethereService?wsdl



<img src="https://images.wupeiyao.top/notes/20210408191248.png" alt="image-20210408191213437" style="zoom:80%;" />



## 客户端开发

wsimport是jdk自带的webservice客户端工具,可以根据wsdl文档生成客户端调用代码(java代码).

当然,无论服务器端的WebService是用什么语言写的,都可以生成调用webservice的客户端代码。 

~~~shell
wsimport -s . http://127.0.0.1:8080/WethereService?wsdl
~~~

在cmd 运行这个命令 就可以生成 一些客户端代码



我们首先把class 文件删除,因为用不到,

写一个测试调用下我们的服务端的服务

~~~java
public class TestWeatherService {
    public static void main(String[] args) {
        // 创建一个服务
        WeatherServiceImpService service = new WeatherServiceImpService();
        // 获取服务对象
        WeatherServiceImp serviceImp = service.getWeatherServiceImpPort();
        // 调用暴露的接口方法
        String s = serviceImp.todayWeather("成都");
        System.out.println(s);
    }
}
~~~



## wsdl

Service：相关端口的集合，包括其关联的接口、操作、消息等。

Binding：特定端口类型的具体协议和数据格式规范

portType: 服务端点，描述 web service可被执行的操作方法，以及相关的消息，通过binding指向portType

message: 定义一个操作（方法）的数据参数

types: 定义 web service 使用的全部数据类型

<!--阅读方式应该从下往上看-->

~~~
1.先看service标签，看相应port的binding属性，然后通过值查找上面的binding标签。

2.通过binding标签可以获得具体协议等信息，然后查看binding的type属性

3.通过binding的type属性，查找对应的portType，可以获得可操作的方法和参数、返回值等。

4.通过portType下的operation标签的message属性，可以向上查找message获取具体的数据参数信息。
~~~







**参考文章:**

https://blog.csdn.net/c99463904/article/details/76018436

https://www.cnblogs.com/xdp-gacl/p/4048937.html
