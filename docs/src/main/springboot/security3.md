---
title: springboot基础入门-security 基于注解控制权限
tags:
  - java
  - springboot
  - 安全框架
categories: springboot
abbrlink: f1edfd7f
---



# 注解控制



在前一篇笔记中,我们通过ajax登录,和进行读取数据库进行权限判断,但是,我们的判断请求拥有哪些角色可以访问时,

我们写在配置请求中,这样,不方便我们操作

springboot 提倡使用直接开发

所以,肯定也有注解模式
<!-- more -->
## 开启注解模式

在`SecurityConfig` 我们的配置类上加上下面这样的注解

> @EnableGlobalMethodSecurity(prePostEnabled = true,securedEnabled=true,jsr250Enabled=true)



**这样会开启3种注解模式,**

### jsr250Enabled

```java
@DenyAll // 拒绝访问
@PermitAll //同意访问
@RolesAllowed // 拥有某一个角色就可以访问
```

比如  访问下方的请求,只有拥有`admin` **或者**`root` 角色权限时,才能访问

```java
@RolesAllowed({"admin","root"})
@RequestMapping("/getAllUser")
public String index(){
    return "getAllUser";
}
```



### securedEnabled

```java
@Secured({ "ROLE_user", "ROLE_admin" })
```

只有拥有上面显示的**全部**角色时,才能访问,否则无法访问

并且这里的角色名需要添加`ROLE_` 前缀,而`jsr250Enabled` 模式,不需要添加前缀



### prePostEnabled

这种模式,比较强大,支持springEL 表达式,还可以进行一些逻辑判断

```java
@PreAuthorize("#userId == authentication.principal.userId or hasAuthority(‘ADMIN’)")
```

*这里表示在changePassword方法执行之前，判断方法参数userId的值是否等于principal中保存的当前用户的userId，*

*或者当前用户是否具有ROLE_ADMIN权限，两种符合其一，就可以访问该 方法。*