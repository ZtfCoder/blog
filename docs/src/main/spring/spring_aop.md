---
title: spring aop
tags:
  - java
  - spring
categories: ssm
abbrlink: bca7c7e9
---

# spring aop 

aop 是面向切面编程,是对oop(面向对象)的一种补充,注意不是一种技术,而是一种思想

## aop功能

aop常用在 日志打印,权限控制,异常处理,性能检测等等
<!-- more -->
## aop原理

aop实现方式 有`jdk动态代理`,`cjlib` 2种方式,其中 `jdk动态代理` 是必须代理类实现接口,而,`cjlib` 继承一个类

spring aop 会动态检测,你的代理类是实现了接口还是继承了类,从而选择 使用jdk自带的动态代理,还是,cjlib动态代理
