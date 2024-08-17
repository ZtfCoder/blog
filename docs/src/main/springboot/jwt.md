---
title: jwt认证
tags:
  - java
  - springboot
  - 认证
  - jwt
categories: springboot
abbrlink: 722ed7e7
---



# jwt

## jwt 是什么?

原名叫 `JSON Web Token` 是目前最流行的跨域认证解决方案

用于认证请求的

<!--下面这个比较重要,必须记住-->

jwt 本质上是一个加密字符串

由3个部分组成,`头部`,`载荷`,`签名`

<!-- more -->

**头部**

用于描述关于该JWT的最基本的信息，例如其类型以及签名所用的算法等。这也可以被表示成一个JSON对象。    然后将其进行base64编码，得到第一部分

~~~json
{ "typ": "JWT", "alg": "HS256" }
~~~

**载荷**

一般添加用户的相关信息或其他业务需要的必要信息。但不建议添加敏感信息，因为该部分在客户端可解密    （base64是对称解密的，意味着该部分信息可以归类为明文信息）    然后将其进行base64编码，得到第二部分

~~~json
{ 
  "iss": "JWT Builder", 
  "iat": 1416797419, 
  "exp": 1448333419, 
 }
~~~

**签名**

需要base64加密后的header和base64加密后的payload使用"."连接组成的字符串，    然后通过header中声明的加密方式进行加密secret组合加密（在加密的时候，我们还需要提供一个密钥（secret），加密secret组合加密）    然后就构成了jwt的第三部分。

## 为什么要使用jwt?

以前我们认证是使用 [session和cookie](https://myblog.wupeiyao.top/archives/2f22fa59.html)  

用户在前端输入账号和密码 发送到后台,controller 接受请求后,调用service 方法,去数据库匹配账号和密码,如果,匹配成功

创建一个session 将用户信息保存到session 里,然后返回一个cookie 给前端(当然返回cookie这一步是自动执行的,无须编写额外代码)

以后,我们的用户访问的时候,我们只需要从服务内存中获取`JsessionId` 对应的session 就好了

这样会存在一些问题

> 1.保存在服务内存中,要是用户数量一旦多起来,会很占用内存
>
> 2.session 共享,我们可能需要搭建集群或者将项目拆分为微服务,这样不同机器上的session 是不共享的
>
> 3.跨域问题

其中第二个,我们可以通用引入redis 来解决这个问题,用redis 来存储session

如果我们使用jwt 的话,就可以解决以上所有的问题,

## 入门

首先导入依赖

```xml
<!--jwt-->
<dependency>
    <groupId>com.auth0</groupId>
    <artifactId>java-jwt</artifactId>
    <version>3.8.3</version>
</dependency>
```

接着编写配置

```java

@Slf4j
public class JwtUtils {


    // 密钥
    private static final String SECRET = "TOP$@&!!!";

    /**
     签发对象：这个用户的id
     签发时间：现在
     有效时间：30分钟
     载荷内容：暂时设计为：这个人的名字，这个人的昵称
     加密密钥：这个人的密码加上一串字符串
     */
    public static String createToken(String userId) {

        Calendar nowTime = Calendar.getInstance();
        nowTime.add(Calendar.MINUTE,30);
        Date expiresDate = nowTime.getTime();

        return JWT.create().withAudience(userId)   //签发对象
                .withIssuedAt(new Date())    //发行时间
                .withExpiresAt(expiresDate)  //有效时间
                .withClaim("userId",userId)//载荷，随便写几个都可以
                .sign(Algorithm.HMAC256(SECRET));   //加密密钥
    }

    /**
     * 检验合法性
     * @param token
     * @throws AuthException
     */
    public static void verifyToken(String token) throws Exception {
        DecodedJWT jwt = null;
        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(SECRET)).build();
            jwt = verifier.verify(token);
            Date expiresAt = jwt.getExpiresAt();
            Date issuedAt = jwt.getIssuedAt();
        } catch (Exception e) {
            //效验失败
            log.info("token验证失败");
            throw new Exception("登录失效,请重新登录");
        }
    }

    /**
     * 获取签发对象
     */
    public static String getAudience(String token) throws Exception {
        String audience = null;
        try {
            audience = JWT.decode(token).getAudience().get(0);
        } catch (JWTDecodeException j) {
            //这里是token解析失败
            log.info("token解析失败");
            throw new Exception("token解析失败");
        }
        return audience;
    }


    /**
     * 通过载荷名字获取载荷的值
     */
    public static Claim getClaimByName(String token, String name){
        return JWT.decode(token).getClaim(name);
    }
}
```

上面的代码,都有注释,看一下应该还是懂的,感兴趣可以点击源码查看,其中,对于 `SECRET` 密钥我们要保管好,这个是用来解密jwt 唯一密钥

我们编写一个登录请求来模拟登录

```java
@RequestMapping("/login")
    @ResponseBody
    public String login(String userId,String password,@RequestHeader(value = "AuthToken",required = false) String authToken){
        if (authToken!=null){
            try {
                JwtUtils.verifyToken(authToken);
                return "请不要重复登录";
            }catch (Exception e){
                log.info("重新创建token");
            }
        }
        String login = userDao.login(userId, password);
        String token = JwtUtils.createToken(userId);
        return token;
    }
```

这段代码中有个`@RequestHeader(value = "AuthToken",required = false) String authToken`

这个是用户获取请求头的信息,当我们给用户颁发`jwt` 后,会让浏览器存储在本地存储里面也是就`localStorage`(这个存储在哪都行,只能浏览器能获取到),当用户发起请求后,我们会把这个`token` 取出来,放在请求头里面,

这样后端就能获取到我们的token,这里,我们先判断用户是否已经登录,调用`JwtUtils.verifyToken(authToken);` 方法判断是否验证通过,通过则已经登录,如果没有这个请求头,则,我们进行登录判断,登录成功后,我们调用`JwtUtils.createToken(userId);` 给这个用户颁发一个token 然后返回这个token

前端接受到token 后调用`localStorage.setItem("token",value);`方法就行了