---
title: zookeeper(待更新)
tags: springcloud
categories: springcloud
abbrlink: 432b22d2
---
## zookeeper介绍

注册服务中心,我们注册服务需要在 zookeeper 中
<!--more-->
zookeeper功能非常强大，可以实现诸如`分布式应用配置管理`、`统一命名服务`、`状态同步服务`、`集群管理`等功能，我们这里拿比较简单的分布式应用配置管理为例来说明。

假设我们的程序是分布式部署在多台机器上，如果我们要改变程序的配置文件，需要逐台机器去修改，非常麻烦，现在把这些配置全部放到zookeeper上去，保存在 zookeeper 的某个目录节点中，然后所有相关应用程序对这个目录节点进行监听，一旦配置信息发生变化，每个应用程序就会收到 zookeeper 的通知，然后从 zookeeper 获取新的配置信息应用到系统中。

## 应用场景

### 1.维护配置信息

通通常我们的配置文件是放在项目的配置文件中,如果我们需要修改,则是修修改配置文件的配置,但是,这个只是单体应用,如果,项目是分布式服务的话,可能多个服务需要使用到同一配置信息,如果,我们需要修改配置信息,则是需要修改所有服务的配置文件,极其不方便,因此,我们可以让不同的分布式服务,都去我们的`zookeeper` 中获取所需要的配置信息,如果,配置信息有所改变,我们也只需要改变,`zookeeper`中的配置即可,方便了我们修改配置信息

### 2.分布式锁



### 3.集群管理



### 4.生产分布式唯一id



### 5.负载均衡

<img src="https://images.wupeiyao.top/notes/20210324172536.png" style="zoom:67%;" />

以前，我们是通过nginx 做我们应用的负载均衡，这样做没有问题，但是，如果，我们需要增加一台服务器，上图中的`新增tomcat` 则还需要在nginx 中进行配置，设置服务器的地址，不利于后续扩展开发，因此，我们需要，使用zookpeer 来做负载均衡，

<img src="https://images.wupeiyao.top/notes/20210324172457.png" style="zoom:67%;" />

zookpeer 会创建一个service 的节点，然后为每个服务进行监听，如果，有新增的服务的，则自动配置到zokkpeer中

## 节点管理

1.创建 永久节点 

```shell
create /ztf "aaa"
```

> 创建了一个节点，名字叫/ztf 值是 aaa

2.获取节点对象中的值

```shell
get /ztf
```

3.创建有序节点

```shell
create -s /ztf "aa"
```

4.创建临时节点

~~~shell
create -e /ztf "aaa"
~~~

5.创建临时有序节点

~~~shell
create -s -e  /ztf "aaa"
~~~



1.修改节点值

~~~shell
set /ztf "aaaa"
~~~



## 安装

在官网下载稳定版本

https://mirrors.bfsu.edu.cn/apache/zookeeper/stable/

注意,一定要下载 文件后缀是`-bin.tar.gz`的文件, 这个是编译好的项目,而另外一个是未编译的

## 配置和启动

**windows 启动**

下载完成后

进入bin 目录下 启动`zkServer.cmd` 可能出现闪退,去`conf`目录下,复制一份`zoo_sample.cfg`,然后,重命名为`zoo.cfg` ,接着启动 `zkServer.cmd` 等待一会,服务端启动成功

接着,我们可以去运行`zkCli.cmd` 成功启动后,我们可以在服务端,看到已经有连接连接进来了



**linux 启动 zookpeer** 

~~~shell
./zkServer start
~~~

停止

~~~shell
./zkServer stop
~~~





## 下载可视化

为了我们能够快速看到,服务注册成功后的消息,我们需要去下载一个开源项目

https://gitee.com/zhanggob/dubbo-admin

这个项目有简单的服务可视化功能,方便我们之后观察效果,用idea 导入后,只需要运行

`dubbo-admin`这个模块就行了,默认配置的端口是`7001`更多详细配置可以查看配置文件

当然,想要启动 这个服务,当然也需要启动,`zookeeper`服务,不然,会一直报错

## 快速体验

首先创建一个spring boot的标准项目,用来当生产者,顾名思义,是用来生产的,

导入`pom`

~~~xml
<!--dubbo 整合 spring boot -->
<dependency>
    <groupId>org.apache.dubbo</groupId>
    <artifactId>dubbo-spring-boot-starter</artifactId>
    <version>2.7.3</version>
</dependency>


<!-- zookeeper 连接驱动-->
<dependency>
    <groupId>org.apache.dubbo</groupId>
    <artifactId>dubbo-dependencies-zookeeper</artifactId>
    <version>2.7.3</version>
    <type>pom</type>
    <exclusions>
        <exclusion>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
        </exclusion>
    </exclusions>
</dependency>
~~~



创建一个接口

~~~java
package top.ztf.service;

public interface TickService {

    String getTicket();

}
~~~

接着,它的实现类

~~~java
package top.ztf.service;

import org.apache.dubbo.config.annotation.Service;
import org.springframework.stereotype.Component;

@Service // 可以被扫描到,在项目启动后就会被注册到注册中心
@Component // 使用dubbo 后尽量不使用spring 的@Service 注解
public class TickServiceImp implements TickService{
    @Override
    public String getTicket() {

        return "java 面试宝典";
    }
}
~~~

此处需要注意 `@Service` 这个注解所在的包,是dubbo包下

在`application.yml`进行配置

~~~yaml
server:
  port: 8082
dubbo:
  application:
    # 服务应用名称
    name: provider-service
  registry:
    # 注册中心地址
    address: zookeeper://127.0.0.1:2181

  scan:
    # 服务注册地址
    base-packages: top.ztf.service
~~~

配置以上信息,之后,再创建一个模块项目,为消费者,用来消费(调用)刚才我们的生产的东西,也就是调用我们刚才写好的方法

包结构一定要和生产者一样

接着,把我们刚才在生产者模块中写好的接口负责过来,(自己的代码不要客气),

然后,pom 坐标,增加上面的坐标就行了,这里就不列出来,yml配置文件中配置

~~~yaml
server:
  port: 8081
dubbo:
  application:
    # 消费者名称
    name: consumer-service
  registry:
    # 注册中心地址
    address: zookeeper://127.0.0.1:2181
~~~

接下来,创建一个`UserService`

~~~java
package top.ztf.service;

import org.apache.dubbo.config.annotation.Reference;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Reference
    TickService tickService;

    public void buyTick(){
        System.out.println("在注册中心获取一张票=>"+tickService.getTicket());
    }

}
~~~

在测试方法中进行调用UserService 中的方法

记得,一定要开启`zookeeper服务端` ,`生产者模块`,之后,我们可以从控制台看到

~~~java
在注册中心获取一张票=>java 面试宝典
~~~

我们可以这样理解,zookeeper,就是商城老板,而生产者就是原料厂家,而消费者,就是我们自己

原料厂家 生产了一件物品,它肯定要告诉商城老板,它那有新的商品,而,我们就可以去商城去买东西,买的就是商城老板的东西,但是商城老板那的东西是从,原料厂家那获取的,所有,我们是从原料厂家那获取的物品,实际上是从原料厂获取的



# 分布式事务

## 数据库实现

当2个并发线程都去争夺一个资源的时候,只能运行一个线程执行成功,另一个执行失败,

采取数据库锁的方式,

当一个请求到达业务方法前时,先去数据查看是否有这个`锁名称` 这个锁名称,是单独的一张表,包含 `id`,`锁名称`

如果,以及存在这个锁名称,则执行循环等待,间隔访问数据库是否存在这个锁名称

如果不存在这个锁名称,.则执行真正的业务代码

最后,再去删除数据库那张`锁名称`那条记录,从而实现,分布式事务控制



## redis实现

redis 实现和数据库实现方式类似

也是在执行事务前,往redis 中插入一条数据,使用`setnx`  这个 语句, 这个语句 如果插入的值不存在,则插入成功,否则插入失败



## zookpeer实现

每一个执行的线程创建一个有序的临时节点,为了确保有序性,在创建完节点,会再次获取全部节点,再重新进行一次排序,在排序过程中,每个线程要判断自己的临时节点的序号是否是最小的

如果是最小的,将会获取到锁,执行相关操作,释放锁

如果不是最小的,会监听它的前一个节点,当它的前一个节点被删除的时候,它就会获得锁,一次类推

