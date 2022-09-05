---
title: springboot基础入门-shiro
tags:
  - java
  - springboot
  - 安全框架
categories: springboot
abbrlink: e79b7cfd
---

# shiro

Apache Shiro 是一个强大且易用的 Java 安全框架,执行身份验证、授权、密码和会话管理。使用 Shiro 的易于理解的 API,可以快速、轻松地获得任何应用程序,从最小的移动应用程序到最大的网络和企业应用程序。

它有三个核心组件 **Subject, SecurityManager 和 Realms.**

<!-- more -->

```
Subject：即“当前操作用户”。但是，在Shiro中，Subject这一概念并不仅仅指人，也可以是第三方进程、后台帐户（Daemon Account）或其他类似事物。它仅仅意味着“当前跟软件交互的东西”。
Subject代表了当前用户的安全操作，SecurityManager则管理所有用户的安全操作。

SecurityManager：它是Shiro框架的核心，典型的Facade模式，Shiro通过SecurityManager来管理内部组件实例，并通过它来提供安全管理的各种服务。

Realm： Realm充当了Shiro与应用安全数据间的“桥梁”或者“连接器”。也就是说，当对用户执行认证（登录）和授权（访问控制）验证时，Shiro会从应用配置的Realm中查找用户及其权限信息。
从这个意义上讲，Realm实质上是一个安全相关的DAO：它封装了数据源的连接细节，并在需要时将相关数据提供给Shiro。当配置Shiro时，你必须至少指定一个Realm，用于认证和（或）授权。配置多个Realm是可以的，但是至少需要一个。

Shiro内置了可以连接大量安全数据源（又名目录）的Realm，如LDAP、关系数据库（JDBC）、类似INI的文本配置资源以及属性文件等。如果系统默认的Realm不能满足需求，你还可以插入代表自定义数据源的自己的Realm实现。
```

## 与 springboot 整合

导入 xml

```xml
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-spring</artifactId>
    <version>1.7.0</version>
</dependency>
```

## 配置三大对象

```java
@Configuration
public class ShiroConf {

    //ShiroFilterFactoryBean
    @Bean
    public ShiroFilterFactoryBean getShiroFilterFactoryBean(@Qualifier("securityManager") DefaultWebSecurityManager securityManager){
        ShiroFilterFactoryBean bean = new ShiroFilterFactoryBean();
        //设置安全管理器
        bean.setSecurityManager(securityManager);


        return bean;
    }

    //DefaultWebSecurityManager
    @Bean(name = "securityManager")
    public DefaultWebSecurityManager getDefaultWebSecurityManager(@Qualifier("userRealm") UserRealm userRealm){
        //@Qualifier 默认使用的 @Bean 对象的方法名称,也可以在@Bean 中添加name 属性,自定义名称 ,这样,就可以从容器中获取 UserRealm 这个对象
        DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
        // 关联  UserRealm
        securityManager.setRealm(userRealm);

        return securityManager;
    }

    // 创建realm 对象, 需要自定义
    @Bean
    public UserRealm userRealm(){
        return new UserRealm();
    }

}
```

realm 对象是需要我们自己是定义的

写一个`UserRealm` 类继承 `AuthorizingRealm`

```java
public class UserRealm extends AuthorizingRealm {

    // 授权
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        return null;
    }

    //认证
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        return null;
    }
}
```

## 添加过滤器

shiro 内置含有过滤器

在安全管理器中进行配置,就可以了

```java
// 添加内置过滤器

//anon:无须认证就可以访问
//authc:认证后才才能访问
//user:必须拥有 记住我 功能,才能访问
//role:拥有某个角色才能访问
//perms:必须拥有某个资源的权限才能访问  使用方法是perms[字符串]
Map<String,String> map = new HashMap<>();
map.put("/add","authc");
map.put("/update","authc");
// 这样设置了,只有用户进行了认证后才能进行访问 /add /update

//最后把过滤器添加进管理器就行了
bean.setFilterChainDefinitionMap(map);

```

## 定制登录

也是在安全管理器中进行配置

```java
//设置登录页
bean.setLoginUrl("/toLogin");
```

在 Controller 层进行逻辑调用 ,底层已经把登录的逻辑写好了,我们只需要在 认证的方法中进行方法的调用就好了,他会自己抛出响应的逻辑异常

```java

// 获取当前用户
Subject subject = SecurityUtils.getSubject();
// 封装用户名和密码
UsernamePasswordToken token = new UsernamePasswordToken(account, password);

try {
    // 登录 ,调用了登录方法,就会调用 UserRealm对象中的认证的方法
    subject.login(token);  //如果没有异常 则登录成功
}catch (UnknownAccountException e){
    // 用户不存在
    e.printStackTrace();
    model.addAttribute("msg","用户名错误");
    return "login";
}catch (IncorrectCredentialsException e){
    // 密码错误
    model.addAttribute("msg","密码错误");
    return "login";
}
return "index";
```

```java
	//认证
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        // 转换成可操作的token 对象
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;

        String account = "root";
        String pwd = "root";

        if (!token.getUsername().equals(account)){
            return null; //UnknownAccountException  返回null 的话,抛出 用户名不存在异常
        }

        // 密码认证
        return new SimpleAuthenticationInfo("",pwd,"");
    }
```

## 设置无权限访问界面

也是在安全管理器中进行设置,开启就可以了

```java
// 设置无权限访问的界面
bean.setUnauthorizedUrl("noAlow");
```
