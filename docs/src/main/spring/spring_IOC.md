---
title: spring ioc
tags:
  - java
  - spring
categories: ssm
abbrlink: 360ad78f
---

### spring基础

将对象存储到spring容器中,我们不需要new对象,,每次要使用,只需要从容器中获取就行了

~~~
spring 容器,可以存储很多东西,
~~~



**对象创建的时机**
<!-- more -->
~~~
1.当spring容器加载的加载的时候,创建对象
2.当,调用对象的时候,进行创建
~~~

在spring容器创建对象,需要在xml种进行以下配置

~~~xml
<bean id="testStu"  class="top.wupeiyao.ioc.sp1.Teacher"/>
~~~

**id**  在spring容器,中,只可存在唯一id的对象,不可重复  **class**  为配置的对象的全类名

**默认调用对象无参构造方法,**

**scope**  表示对象,创建的实际

spring,提供了2种创建时机,

~~~xml
<bean id="testStu" scope="singleton"  class="top.wupeiyao.ioc.sp1.Teacher"/>
<!-- 默认方式  singleton    当spring容器加载的时候进行创建 -->


<bean id="testStu" scope="prototype"  class="top.wupeiyao.ioc.sp1.Teacher"/>
<!-- 默认方式  prototype    当我们从spring容器种获取时,才会创建 -->

~~~

#### bean



### ApplicationContext

spring上下文对象,时spring核心对象

是一个接口,其常用子类有

~~~Java
org.springframework.web.context.support.XmlWebApplicationContext
org.springframework.web.context.support.AnnotationConfigWebApplicationContext    
~~~

~~~
XmlWebApplicationContext  可以在创建该对象时,传入spring配置文件的路径,进行读取,启动spring容器
~~~

~~~
AnnotationConfigWebApplicationContext  是用于注解开发启动spring容器的
~~~

### component-scan

包扫描,可以用于扫描指定包路径下的有注解了类似 **@Component**  的,类,并将对象,纳入spring容器



### 依赖注入的方式

有三种方法

~~~
1:
 接口
2:
 构造方法
3:
 setter

~~~



bean 

~~~xml
<bean id="" class="" autowire="byType|byName|constructor|default" />
~~~

