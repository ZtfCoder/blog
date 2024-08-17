---
title: springboot基础入门-剩余
tags:
  - java
  - springboot
  - 异步
  - 定时
  - 邮件发送
categories: springboot
abbrlink: 7a6c4758
---

# 异步任务

类似`ajax` 异步请求 可以额外开启线程来完成另外一个方法

使用的场景有 邮件发送,清理缓存数据,短信验证码,等等
<!-- more -->
首先,我们需要在在spring boot 启动类上,声明开启 异步任务

添加注解

```java
@EnableAsync
```

小提示:还有很多注解以Enable 开头的,都是开启某某功能

之后,我们需要在,异步执行的方法上添加`@Asyn` 注解 即可实现异步任务

# 邮件发送

首先需要导入mail 依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
    <version>2.3.7.RELEASE</version>
</dependency>
```

然后需要去qq 邮箱设置里开启smtp

之后获取密钥

~~~yaml
spring:
  mail:
    password: bkdvktdsncnpdgge
    username: 2936408477@qq.com
    host: smtp.qq.com # qq邮箱
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
            required: true
~~~

测试 

简单的邮件,

~~~java
    @Test
    void contextLoads() {

        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();

        // 发送给谁
        simpleMailMessage.setTo("2936408477@qq.com");
        // 谁发送
        simpleMailMessage.setFrom("2936408477@qq.com");

        // 设置主题
        simpleMailMessage.setSubject("aaaa");

        simpleMailMessage.setText("hello");

        javaMailSender.send(simpleMailMessage);

    }
~~~

复杂的邮件 可以发送html内容

```java
@Test
void contextLoads2() throws MessagingException {

    MimeMessage mimeMessage = javaMailSender.createMimeMessage();

    MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);

    // true 表示解析html 标签
    messageHelper.setText("<h1>aaaa</h1>",true);
    messageHelper.setFrom("2936408477@qq.com");
    messageHelper.setTo("2936408477@qq.com");
    messageHelper.setSubject("1111");

    javaMailSender.send(mimeMessage);

}
```

# 定时任务

和名称一样具有相同的功能,

首先我们需要在spring boot 启动类上开启 定时任务

`@EnableScheduling`

之后,在你想要执行定时任务的 方法上添加注解 `@Scheduled()` 其中 有个cron 的属性,为表达式,表达式包含定时任务开启的时间,和循环时间 

具体,可以参考,cron 代码生成器
