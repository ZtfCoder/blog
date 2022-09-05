---
title: springboot基础入门-security
tags:
  - java
  - springboot
  - 安全框架
categories: springboot
abbrlink: 5399d171
---

# security

SpringSecurity 是 Spring 下的一个安全框架，与 shiro 类似，一般用于用户认证和用户授权两个部分，常与与 SpringBoot 相整合。

<!-- more -->

```xml
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

导入 security 后,所有的请求,都会被 security 拦截,进行认证

security 是高可定制的框架,我们可以轻易修改其中的配置

首先写一个 security 的配置类

```java

@EnableWebSecurity //开启配置
public class SecurityConfig extends WebSecurityConfigurerAdapter {

}
```

当我们继承了`WebSecurityConfigurerAdapter` 这个适配器后,我们就可以重写它里面的方法

## 授权

一般重写,

```java
// 授权,用于http请求
protected void configure(HttpSecurity http) throws Exception {}
```

```java
//授权
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/").permitAll()//开放给所有人
                .antMatchers("/level1/**").hasRole("vip1") //访问 /leve1/** 下的所有内容,必须拥有角色vip1
                .antMatchers("/level2/**").hasRole("vip2")
                .antMatchers("/level3/**").hasRole("vip3");

    }
```

采用链式编程方法`http.authorizeRequests()` 开启授权,之后,就可以选择授权的角色,以及该角色所能访问的权限

你若是没有这些角色权限,则无法访问这些资源,,此时会给出一个 403 错误,没有权限访问,

### 登录页

这时,我们需要进拦截成功后进入登录界面

开启登录,只需要在上面的方法中,添加一句话,则可以进入到登录界面,

```java
// 开启登录验证 默认是访问 /login,可以从源码,中得知默认配置
http.formLogin();
//登录成功后,会自动将你session存入你的角色权限
```

**小提示:如果没有设置用户的情况下,默认用户名叫`user` 密码是控制台随机生成的**

> 也可以进行定制登录页

```java
http.formLogin().loginPage("/loginUser");
```

此时,登录的表单提交路径 应该也是 `/loginUser` ,,并且`应该使用post`方式,默认提交方式是`post`,还有表单提交的名称都是含有默认值,我们可以进行更换,具体的默认配置可以查看源码知道,源码注释特别详细,建议多看下官方文档注释

### 设置用户

重写

```java
// 认证
@Override
protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    // 可以基于内存,也可以基于数据等方式
}
```

#### 基于内存(了解)

```java

@Override
protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.inMemoryAuthentication().passwordEncoder(new BCryptPasswordEncoder()) //设置密码的加密方式
            .withUser("root").password(new BCryptPasswordEncoder().encode("root")).roles("vip1","vip2","vip3")
            .and()
            .withUser("vip1").password(new BCryptPasswordEncoder().encode("root")).roles("vip1")
            .and()
            .withUser("vip2").password(new BCryptPasswordEncoder().encode("root")).roles("vip2","vip3");
}
```

这段代码较为长,我简单解释下 `inMemoryAuthentication()` 这个方法说的是我们分配角色使用的方式,是从内存读取,当然还有其他其中模式最重要的是读取数据,这点,之后再讲,紧跟着是`passwordEncoder(new BCryptPasswordEncoder())` 这个是密码的加密方式, 由于新版的 spring5 要求需要使用加密手段,因此,必须使用这个

之后,就是不断的链式编程 分配角色,以及密码的加密方式,和密码,最后` roles("vip1","vip2","vip3")` 给这个用户分配那些角色

这种方式了解下就行了,**重点不是这个**

#### 基于数据(掌握)

### csrf

这个地方有个坑,有关 [csrf](https://baike.baidu.com/item/%E8%B7%A8%E7%AB%99%E8%AF%B7%E6%B1%82%E4%BC%AA%E9%80%A0/13777878?fromtitle=CSRF&fromid=2735433&fr=aladdin)

如果这样提交到后台,会出现 403 错误

![20210527215021.png](https://images.wupeiyao.top/notes/20210527215021.png)

这个错误,和代码没有关系

```
跨站请求伪造（英语：Cross-site request forgery），也被称为 one-click attack 或者 session riding，通常缩写为 CSRF 或者 XSRF， 是一种挟制用户在当前已登录的Web应用程序上执行非本意的操作的攻击方法。跟跨网站脚本（XSS）相比，XSS 利用的是用户对指定网站的信任，CSRF 利用的是网站对用户网页浏览器的信任。
```

举个栗子

```java
假如一家银行用以运行转账操作的URL地址如下：http://www.examplebank.com/withdraw?account=AccoutName&amount=1000&for=PayeeName
那么，一个恶意攻击者可以在另一个网站上放置如下代码： <img src="http://www.examplebank.com/withdraw?account=Alice&amount=1000&for=Badman">
如果有账户名为Alice的用户访问了恶意站点，而她之前刚访问过银行不久，登录信息尚未过期，那么她就会损失1000资金。

//来自百度百科
```

和`csrf`类似 还有个叫`xss`

其实,在我们未切换成自定义登录页时,可以查看它原本的登录表单,可以发现一个隐藏域,**token**,这个是较为安全的防止`csrf` 攻击的手段,还有一种是**检查 Referer 字段** 但是很容易被伪造,因此,不太推荐

我们可以在**授权方法**中暂时关闭`csrf`

```java
http.csrf().disable();
```

这样就能正常登录了

### 记住我

要开启`记住我`这个功能很简单,我们只需要在**授权配置** 方法中开启记住我这个功能就行了

```java
http.rememberMe();
```

这样的话,会在默认的登录页有一个单选框,选中登录,则会保存我们的登录信息,

实际上,就是往我们的`cookie`中存放了一个值,

我们也可以对默认的**记住我** 进行自定义配置

```java
//自定义 复选框的name名称,
http.rememberMe().rememberMeParameter("remember");
```

还有更多的配置,具体,查看源码,和官方文档

### 登出\注销

这个也是非常的简单

开启我们的配置

```java
http.logout().logoutUrl("/logout").logoutSuccessUrl("/");
```

默认是断开当前会话,和清除 cookie
