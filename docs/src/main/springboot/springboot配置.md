---
title: springboot基础入门-配置
---

# 一.springboot 配置

```java
@PropertySource()
//用来 声明配置文件的路径的

@Configuration
声明此类的一个配置类
```

```Java
@Configuration
public class JdbcConf {

	@Bean
    @ConfigurationProperties(prefix = "jdbc") //jdbc 可以省略前缀的编写,
    public DataSource dataSource(){
        DruidDataSource source = new DruidDataSource();
        return source;
    }

}

```

`properties`和`yml`

2 种配置文件可以同时生效,同时使用,如果有相同配置,则使用`properties`配置文件中的

### **1.1 yml 配置**

```yaml
jdbc:
  driverClassName: com.mysql.jdbc.Driver
  url: jdbc:mysql://127.0.0.1:3306/erp
  username: root
  password: root
```

名称后跟上一个`:` 在写一个`空格` ,之后写上键对应的值

并且,yml 可以配置多个

其他配置文件名称规范

`application-xxx.yml` 配置完成后需要到`application.yml` 中进行激活

例如 `application-abc.yml` `application-def.yml` `application-asda.yml`

```yaml
spring:
  profiles:
    active: abc,def,asda
```

### **1.2 自动配置**

spring boot 自动配置相关在

`org.springframework.boot:spring-boot-autoconfigure ` 在这个包下,

spring boot 为我们整合了各种框架或者组件,我们如果需要修改组件的参数,则需要去这个包下,找`xxProperties.java` 这个类,`xx`是我们需要修改参数的组件,这个组件类包含了前缀信息

```java
自动配置原理
@SpringBootApplication 这个是一个复合型
里面有 @EnableAutoConfiguration 开启自动配置
里面有个 @Import(AutoConfigurationImportSelector.class)
关键就在 AutoConfigurationImportSelector 这个类中
```

```java
protected AutoConfigurationEntry getAutoConfigurationEntry(AnnotationMetadata annotationMetadata) {
    if (!isEnabled(annotationMetadata)) {
        return EMPTY_ENTRY;
    }
    AnnotationAttributes attributes = getAttributes(annotationMetadata);
    List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes);
    configurations = removeDuplicates(configurations);
    Set<String> exclusions = getExclusions(annotationMetadata, attributes);
    checkExcludedClasses(configurations, exclusions);
    configurations.removeAll(exclusions);
    configurations = getConfigurationClassFilter().filter(configurations);
    fireAutoConfigurationImportEvents(configurations, exclusions);
    return new AutoConfigurationEntry(configurations, exclusions);
}

```

```

<!-- List<String> configurations  内装有全部的自动配置信息  -->

```

```
总结

Spring Boot启动的时候会通过@EnableAutoConfiguration注解找到META-INF/spring.factories配置文件中的所有自动配置类，并对其进行加载，而这些自动配置类都是以AutoConfiguration结尾来命名的，它实际上就是一个JavaConfig形式的Spring容器配置类，它能通过以Properties结尾命名的类中取得在全局配置文件中配置的属性.

如：server.port，而XxxxProperties类是通过@ConfigurationProperties注解与全局配置文件中对应的属性进行绑定的。
```

**端口号的修改**

```yaml
server:
  port: 80
```

### 1.3 扩展 webmvc 配置

如果我们需要扩展 mvc 的一些配置.我们需要实现`WebMvcConfigurer` 这个接口

然后,给这个类加上`@Configuration` 注解 ,注意不要加 `@EnableWebMvc`

```java
@Configuration//声明此类是一个配置类
public class MvcConfig implements WebMvcConfigurer {


}
```

### **1.4 整合拦截器**

- 首先,自定义类实现`HandlerInterceptor` 接口 ,重写它的方法

- 接着写一个配置类,使用`@Configuration` 表明是一个配置类

  ```java
  @Slf4j
  public class MyInterceptor implements HandlerInterceptor {

      @Override
      public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
          System.out.println("preHandle........");
          log.info("preHandle...");
          return true;
      }

      @Override
      public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
          log.info("postHandle...");
      }

      @Override
      public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
          log.info("afterCompletion...");
      }
  }
  ```

- 注册拦截器

- 将拦截器加入到拦截器链中

  ```java
  @Configuration//声明此类是一个配置类
  public class MvcConfig implements WebMvcConfigurer {

      //注册拦截器
      @Bean
      public MyInterceptor myInterceptor(){
          return new MyInterceptor();
      }

      //加入到拦截器链
      @Override
      public void addInterceptors(InterceptorRegistry registry) {
          System.out.println("aaaaa");
          registry.addInterceptor(myInterceptor()).addPathPatterns("/**");
      }

  }


  ```

  ### 1.5 整合事务和连接池

需要在 pom 中导入

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
```

和 mysql 连接驱动

spring boot 默认使用 `hikar` 连接池 在效率上比`druid`高

我们只需要在配置文件中配置好相关信息就可以了

```yaml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/erp?useUnicode=true&characterEncoding=utf-8&useSSL=false
    username: root
    password: root
    driver-class-name: com.mysql.jdbc.Driver
```

整合`druid`和配置`druid`数据源监控

```java
@Configuration
public class DruidConfig {

    @Bean
    public ServletRegistrationBean<StatViewServlet> registrationBean(){
        ServletRegistrationBean<StatViewServlet> registrationBean = new ServletRegistrationBean<>(new StatViewServlet(),"/druid/*");

        // 设置参数
        HashMap<String, String> map = new HashMap<>();
        //设置登录账号
        // map.put("loginUserName","root");
        // map.put("loginUserPassword","root");

        //允许访问的用户 不写,默认都可以访问
        // map.put("allow","");

        registrationBean.setInitParameters(map);

        return registrationBean;
    }

}
```

### 1.6 整合 mybatis

springboot 官方没有给出相应的启动器,但是 mybatis 官方有提供

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>x.x.x</version>
</dependency>
```

绑定动态代理接口,在 spring boot 入口类上,加上 `@MapperScan("com.ztf.dao")` 注解

yml 配置

```yaml
mybatis:
  # mapper文件扫描
  # mapper-locations: classpath:mapping/*.xml
  configuration:
    # mybatis日志配置
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

### 1.7 跨域

在我们的 mvc 配置类中进行对 `addCorsMappings()` 进行实现

```java
@Configuration
public class CorsConfiguration implements WebMvcConfigurer{

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowCredentials(false)
                .allowedMethods("POST", "GET", "PUT", "OPTIONS", "DELETE")
                .allowedOrigins("*");
    }


}
```

## 二.thymeleaf

类似 jsp 的模板语法

使用前需要在 pom 文件中引入对应的启动器坐标

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

> 在`templates` 目录下的资源不能直接访问,只能通过请求转发过去

thymeleaf 的模板必须配置在`templates` 文件夹下面,因为 spring boot 自动配置就是默认在`templates` 文件夹下,并且默认后缀是`.html`

<!-- <img src="C:\Users\zhangtengfei\AppData\Roaming\Typora\typora-user-images\image-20210102204154550.png" alt="image-20210102204154550"  /> -->

最重要的是要在 html 头信息上,添加约束

<html lang="en"  xmlns:th="http://www.thymeleaf.org"></html>

### 2.1 基础语法

#### 2.1.1 th:each

```html
<div th:each="num:${list}" th:text="${num}"></div>
// 第一个 num 是代表 遍历出来的每一个元素,${list} 表示取出域中的值,后面紧跟着
th:text="${num}" 这里的num,就是前面定义好的num
<div th:each="num,iter:${list}" th:text="${num}"></div>
```

`th:text=''` 表示输出字面值

`iter` 这个是一个循环中的默认对象,包含以下属性

```
{index = 0, count = 1, size = 5, current = 1}
index:索引
count:计数
size:当前集合的长度
current:当前第几个
```

#### 2.1.2 th:text

直接输出里面的文本值

```html
<div th:text="hello"></div>
```

也可以使用`${}` 从域中取值,

<!---字符串拼接-->

> 第一种 ,使用 `| |` 添加这个符合,在中间就可以进行字符串拼接

```html
<span th:text="|Welcome to our application, ${user.name}|"></span>
```

> 第二种 使用`''` 单引号拼接,比较麻烦,

```html
<span th:text=" 'Welcome to our application' + ${user.name} + '!' "></span>
```

<!--建议使用第一种-->

#### 2.1.3 th:href

```html
<a th:href="@{/hello(id=${id})}"></a>
```

相当于是对 html 所有标签的一个增强

`()` 相当于增加`get`方式的的参数

#### 2.1.4 th:object

```
功能类似声明一个对象,之后可以对该对象进行一个引用
```

#### 2.1.5 th:if 和 th:unless

> if 是只有为 true 才会显示,unless 是为 true 不显示

```html
<a th:text="${iter.current}" th:unless="${iter.current%2==0}"></a>
```

```html
<a th:text="${iter.current}" th:if="${iter.current%2==0}"></a>
```

#### 2.1.6 th:value

属性赋值

#### 2.1.7 \*{}

> 可以理解为内层对象,对外层对象的一个引用

```html
<div th:object="${session.user}">
  <p>Name: <span th:text="*{firstName}">Sebastian</span>.</p>
  <p>Surname: <span th:text="*{lastName}">Pepper</span>.</p>
  <p>Nationality: <span th:text="*{nationality}">Saturn</span>.</p>
</div>
```

#### 2.1.8 th:replace

可以抽取共同的区域出来,

```
被引用的片段
需要加上标签 th:fragment="名称"  表示被引用的片段 注意,这里的名称,还可以接受参数

在需要的地方进行引用
在随便一个标签 比如div标签 上加上 th:replace="路径 :: 名称"  这里的路径表示的是 默认 templates 文件夹下你被引用片段所在的html,可以省略html后缀,它会自动帮我们解析 如果替换成功则刚才的div 会变成,被引用的片段


```

```
被引用的片段
<div th:fragment="footer"></div>

在需要的地方进行引用
<div th:replace="commons/commons::footer"></div>
```

#### 2.19 th:classappend

可以对 class 进行追加

2.20 th:utext

```
可以输出为html代码,
```

### 三内置对象

#### 3.1 calendars

```html
<div th:text="${#calendars}"></div>
```

用于日期类的工具类对象

#### 3.2 session

#### 3.3 request

等等,jsp 中的常见对象都有
