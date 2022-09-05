---
title: springcloud 注册中心(待更新)
tags: springcloud
categories: springcloud
abbrlink: f46ad36e
---

# Eureaka (服务注册与发现)

和 `zookpeer` 一样,可以做服务注册和发现,

<!--more-->

我们可以把我们写好的服务注册到`Eureaka` 中, `Eureaka` 还可以帮我们监控各个服务的健康状态

有时候我们会看到以下警告信息，这个 Eureka web 页面输出的警告。默认情况下 Eureka Server 在 90s 内没有收到某个微服务实例的心跳，Euraka Server 将会注销该实例。但是当网络出现短暂分区故障，微服务与网络之间无法正常通信，Eureka Server 可能会注销无法正常通信的服务，导致服务不可用。

> THE SELF PRESERVATION MODE IS TURNED OFF.THIS MAY NOT PROTECT INSTANCE EXPIRY IN CASE OF NETWORK/OTHER PROBLEMS

Euraka 通过“自我保护机制”来解决这个问题，当 Eureka Server 在短时间内丢失过多客户端时候，有可能是发生了网络分区故障，那么 Eureka Server 就会进入自我保护模式。一旦进入该模式 Eureka Server 就会保护服务注册表中的信息，不在删除。当网络故障恢复时，Eureka Server 会自动退出自我保护模式。默认开启自我保护，可以通过设置`eureka.server.enable-self-preservation=false`禁用自我保护模式

配置

```yaml
server:
  port: 7001
spring:
  application:
    name: springcloud-eureka-7001

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

还需要在启动类上添加注解`@EnableEurekaServer`

我们的生产者 需要注册服务到 `eureaka` 那么需要 先导入我们的依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-eureka</artifactId>
    <version>1.4.6.RELEASE</version>
</dependency>
```

**除此之外,我们还需要 在启动类上开启 开启`eureaka` 客户端 `@EnableEurekaClient`**

在 `yml` 进行 客户端配置

```yaml
# eureka 注册当前服务
eureka:
  client:
    service-url:
      defaultZone: http://localhost:7001/eureka
```

启动成功后,我们可以访问 `http://localhost:7001`

**与 zookpeer 区别**

RDBMS==>（MySql,Oracle,SqlServer 等关系型数据库）遵循的原则是：ACID 原则（A：原子性。C：一致性。I：独立性。D：持久性。）。

NoSql==> （redis,Mogodb 等非关系型数据库）遵循的原则是：CAP 原则（C：强一致性。A:可用性。P：分区容错性）

> 在分布式领域有一个很著名的 CAP 定理：C：数据一致性。A：服务可用性。P：分区容错性（服务对网络分区故障的容错性）。
>
> 在这个特性中任何分布式系统只能保证两个。

> Eureka 和 Zookeeper 就是 CAP 定理中的实现，Eureka（保证 AP），Zookeeper（保证 CP）。
