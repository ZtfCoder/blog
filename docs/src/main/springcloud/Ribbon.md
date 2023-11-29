---
title: springcloud 负载均衡(待更新)
tags: springcloud
categories: springcloud
abbrlink: 74c75ebe
---
## 介绍

起初,我们使用`zookeeper` 和`Dubbo`的时候,利用的是`Dubbo` 的RPC 远程调用技术
<!--more-->
而,springcloud 利用的是`restfule`风格 利用restful 发送请求 

`ribbon` 则是用于 负载均衡 的,类似我们常用的`nginx` 

`ribbon`  与 `Eureka` 联动,则是,`ribbon`  去 `Eureka`  服务中心获取,生产者的地址,然后,通过某种算法 访问某个实例

## 入门

首先创建一个 消费者

导入依赖

```xml

<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    <version>3.0.2</version>
</dependency>

<!--消费者, 如果不导入此依赖,负载均衡的时候,会找不到实例-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-eureka</artifactId>
    <version>1.4.6.RELEASE</version>
</dependency>
```



进行`yml` 配置

~~~yaml
server:
  port: 80
spring:
  application:
    name: springcloud-consumer-dept-80
eureka:
  client:
    # 不需要注册 这个服务
    register-with-eureka: false
    service-url:
      defaultZone: http://localhost:7001/eureka
~~~

> 这里 eureka 的创建 与相关业务代码,已省略

在启动类上,添加一个注解

`@EnableEurekaClient`

接着在controller中写接口代码

~~~java
@RequestMapping("/consumer")
@RestController
public class DeptConsumerController {

    // 注意, 这里的地址,填写 eureka 管理界面的注册的服务名称,或者生产者的 application-name
    // 这样的话,我们访问的,就不是具体的某一个 生产者服务,而是,它会去拉取服务列表,看具体用哪一个服务
    private static final String DEPT_URL_PRF = "http://springcloud-provider-dept";

    @Autowired
    private RestTemplate restTemplate;

    @RequestMapping("/getDeptById/{id}")
    public Dept getDeptById(@PathVariable("id") Integer id){
        return restTemplate.getForObject(DEPT_URL_PRF+"/dept/getDeptById/"+id,Dept.class);
    }

    @RequestMapping("/getAllDept")
    public List<Dept> getAllDept(){
        return restTemplate.getForObject(DEPT_URL_PRF+"/dept/getAllDept", List.class);
    }
    @RequestMapping("/addDept/{name}")
    public Boolean addDept(@PathVariable("name") Integer name){
        return restTemplate.getForObject(DEPT_URL_PRF+"/dept/addDept/"+name,Boolean.class);
    }

}
~~~

要想实现 restTemplate 的负载均衡的访问,还需要在,RestTemplate 的配置类中 添加一个注解

~~~java
@Configuration
public class BeanConf {

    @Bean
    @LoadBalanced
    public RestTemplate getRestTemplate(){
        return new RestTemplate();
    }

}
~~~

`@LoadBalanced` 添加了这个注解,它就会默认轮询的方式访问我们的的服务

> 注意 ,生产者的 eureka 配置 一定含有一下配置,否则无法实现 负载均衡
>
> ```yaml
> eureka:
>    instance:
>      prefer-ip-address: true
> ```



