---
title: springcloud 复习
tags: springcloud
categories: springcloud
abbrlink: edec6d14
---

> 经过蓝桥杯战斗后,springcloud 已经忘得差不多,正好,之前得笔记写得十分粗糙,因此,这里重新,复习 springcloud

<!--more-->

## sql 准备

```sql
create database springcloud-1;
create table if not exists `springcloud-1`.user
(
   id int auto_increment
      primary key,
   userName varchar(20) null
);
create database springcloud-2;
create table if not exists `springcloud-2`.user
(
   id int auto_increment
      primary key,
   userName varchar(20) null
);
```

这里创建 2 个数据库,用于后面的**负载均衡**

第一步,创建一个父工程

选择 spring boot 快速创建,springboot 版本选择`2.3.11.RELEASE`

删除,多余的内容,只剩下`idea配置文件`,和`pom`

在`pom` 文件中导入以下内容

```xml
<packaging>pom</packaging>

<properties>
    <java.version>1.8</java.version>
    <spring-cloud.version>Hoxton.SR11</spring-cloud.version>
</properties>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

**注意,springcloud 版本和 springboot 版本有版本对应区间,如果你使用的是其他 springboot 版本,建议去官网查看对应的版本**

## 00-api

新建一个子工程

设置子工程里父工程为刚才创建的工程

用于存放实体类等

由于是后面补上的,所以,先不管其他模块

## 01-注册中心

新建一个子工程

设置子工程里父工程为刚才创建的工程

导入 注册中心的坐标

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

配置注册中心的一些信息

```yaml
server:
  port: 8000
spring:
  application:
    name: eureka-8000

# eureka 配置
eureka:
  instance:
    # eureka 服务端实例的名称
    hostname: localhost
  client:
    # 是否向 eureka 注册 选择false 是因为本身这个服务就是服务端
    register-with-eureka: false
    # 为 false 则是声明是服务端
    fetch-registry: false
    # 监控页面
    service-url:
      defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka
```

配置完后,启动我们的项目

启动成功后,访问 `http://localhost:8000/`,出现页面后,表示启动成功,如果启动失败,看下包是否导入错误,包名是否正确

## 02-消费者

和之前一样,再创建一个子工程,继承最开始创建的项目

导入`pom`

```xml
<!--注册中心-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<!--web-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

配置`yml`

```yaml
server:
  port: 9000
spring:
  application:
    name: 02-consumer-9000
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8000/eureka
```

配置好了,就可以测试下,我们的消费者是否注册到注册中心了

启动注册中心,然后,启动,消费者

访问 `http://localhost:8000/`

可以看到我们的消费者成功注册到注册中心了

## 03-生产者

和上一步开头同样操作

导入依赖

```xml
<dependency>
    <!--包含实体等一些通用的-->
    <groupId>top.ztf</groupId>
    <artifactId>00-interface</artifactId>
    <version>0.0.1-SNAPSHOT</version>
</dependency>

<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.49</version>
</dependency>
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.4</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

因为生产者,需要去访问数据库,因此,这里导一下 mysql 驱动 和 mybatis

```yaml
server:
  port: 9991
spring:
  application:
  	# 服务名称
    name: 03-producer
  datasource:
    url: jdbc:mysql://localhost:3306/springcloud-1?useUnicode=true&characterEncoding=utf-8&useSSL=false
    driver-class-name: com.mysql.jdbc.Driver
    username: root
    password: root


eureka:
  instance:
    hostname: localhost
  client:
    service-url:
      defaultZone: http://localhost:8000/eureka
```

**创建一个 controller 控制层**

```java
@RestController
public class UserController {

    @Autowired
    UserService userService;

    @RequestMapping("/getAllUser")
    public List<User> getAllUser(){
        return userService.getAllUser();
    }

}
```

**service 接口**

```java
public interface UserService {
    List<User> getAllUser();
}
```

**service 实现**

```java
@Service
public class UserServiceImp implements UserService {

    @Autowired
    private UserDao userDao;
    @Override
    public List<User> getAllUser() {
        return userDao.getAllUser();
    }
}
```

**dao**

```java
@Mapper
public interface UserDao {

    @Select("select * from user")
    List<User> getAllUser();

}
```

启动生产者服务

启动成功,后,访问下 这个接口 `http://localhost:9991/getAllUser`

成功返回数据后,暂时成功一部分

## 负载均衡

**给消费者工程,生产者和接口工程 添加依赖**

```xml
<!--负载均衡-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

这里使用`feign`

在接口工程中,也就是配置 feign 的接口访问

创建一个`User` 类

```java
@Data
public class User {
    private Integer id;
    private String userName;
}
```

再创建一个`UserClient`

```java
@FeignClient("03-producer")
public interface UserClient {
    @RequestMapping("/getUserList")
    List<User> getUserList();
}
```

这里的`@FeignClient` 注解的值,为,生产者的服务名称

> 解释下,这里的接口,代表的意义,
>
> 这里的接口,代表着我们生产者的 Controller 控制层,底层通过动态代理,实现这个接口,然后替我们访问,对应的生产者服务接口,注意,
>
> 这里的坑比较多
> 比如,如果,你要给这个 UserClient 添加的一个外层的@RequestMapping()的话,你之后运行,可能会给出一个路径重复的异常,导致,无法启动,这个原因是因为之后生成动态代理会附带这个@RequestMapping(),而,原本的 controller 本来也有,所以导致重复,
>
> 解决方法是@FeignClient() 注解里面有个值叫 path ,用 path 来代替这个@RequestMapping() 即可

接着在`消费者`工程启动类上添加注解 `@EnableFeignClients`

```java
@EnableFeignClients(basePackages = {"top.ztf.api.client"})
```

这里要注意,这里的包扫描是扫描`UserClient ` 所在的包

我们在这里注入 UserClient

搭建完后,访问 `http://localhost:9000/getUserList` 既可以访问到数据

因为此时,还没出现负载均衡的效果,因此,我们再创建一个生产者工程

和之前创建的生产者保持相同的代码和配置,但是注意,此时,我们可以设置数据库为另外一个相同的数据库

这样可以给数据库分担压力

从而实现负载均衡

然后在 2 个生产者的 controller 中都添加一句打印,用于区分,不同端口的生产者`controller`

启动项目,访问 `http://localhost:9000/getUserList` 可以看到运行 2 次分别去访问不同的生产者服务

> 至此,负载均衡的效果实现,
>
> 默认的负载均衡是顺序均衡

## 04-网关

网关则是使用的`gateway`
