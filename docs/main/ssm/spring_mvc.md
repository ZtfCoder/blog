---
title: spring mvc
---

## Sping mvc

### 配置 ContextLoaderListener 监听器

配置一个 监听器

```xml
  <!--  监听器-->
  <listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
  </listener>
```

### 配置 读取 spring 配置文件

<!-- more -->

```xml
  <context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>classpath:ApplicationContext.xml</param-value>
  </context-param>
```

可以帮我们监听 tomcat 的创建,

内部实现了 ServletContextListener 接口

在 contextInitialized 方法中

```java
@Override
public void contextInitialized(ServletContextEvent event) {
    initWebApplicationContext(event.getServletContext());
}
```

会去读取 spring 的配置文件,并且创建 **WebApplicationContext** 对象

将 **WebApplicationContext** 对象存储到**servletContext** 全局域中,存储的名称 是

```java
String ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE = WebApplicationContext.class.getName() + ".ROOT";
```

**WebApplicationContext** 是 **ApplicationContext** 的子类

### 获取**ApplicationContext** 对象

```java
ServletContext context = request.getServletContext();//context全局域对象
ApplicationContext app = WebApplicationContextUtils.getWebApplicationContext(context);
```

### 前端控制器**DispatcherServlet**

在 xml 中配置**DispatcherServlet**

```xml
<servlet>
    <servlet-name>DispatcherServlet</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <!-- 会在servlet创建的时候,读取 配置文件,spring mvc -->
    <init-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:Context-web.xml</param-value>
    </init-param>
</servlet>

<servlet-mapping>
    <servlet-name>DispatcherServlet</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>
```

当配置了**DispatcherServlet**后 因为设置了 url-pattern 路径为 **/** 所以进行任何请求都会访问到 前端控制器

因此,所有的静态资源无法访问,目前为止

### @RequestMapping

可以在方法和类上添加 **@RequestMapping** 注解 相当于是一个**servlet** 只不过,是可以在一个类中,可以添加无数个**servlet**

并且,如果类上添加有**@RequestMapping** 的话,则访问路径会添加上类上的注解 value 值

比如

```java
@Controller
@RequestMapping("/user")
public class ControllerDemo {
	@RequestMapping(value = "/add")
    public void save(){

    }
}
```

则访问路径为 `http://localhost:80/user/add`

<!--特别注意,注解 如果有一个属性可以有一个值,且为value 的话,则可以省略不写 value ="..." ,但是有多个,则必须写value="..."  -->

@RequestMapping 还可以指定,请求方式

```Java
@RequestMapping(value = "/add2",method = RequestMethod.GET)  //get 方式,或则其他方式
```

#### 请求参数

当请求到**@RequestMapping** 的时候,可以携带参数传递

#### 普通参数

```java
@RequestMapping(value = "/add9")
public void add9(String username,int age){
    //spring mvc 可以帮我们进行类型转换
    System.out.println(username);
    System.out.println(age);
}
```

获取到的参数,正常都是**String** 类型 ,但是,可以设置了 int 类型,spring mvc 会帮我们进行自动类型转换

因此,我们访问时,携带的参数格式时

```
http://localhost:80/user/add9?username=zs&age=18
```

和传统的方式,一样,一一对应,如果,参数,不对应,则报**400**

#### 对象参数

可以传一个对象进来,spring mvc 会自动帮我们封装对象

```Java
@RequestMapping(value = "/add10",method = RequestMethod.GET)
public void add10(User user) throws IOException {
    //spring mvc 可以帮我们进行类型转换
    System.out.println(user);
}

```

当然,参数名称必须和实体类的属性一致,否则,属性无法封装到对象中,对象中的属性,则为默认值

#### 数组

```java
@RequestMapping(value = "/add10")
public void add10(int[] age) {
    //spring mvc 可以帮我们进行类型转换
    System.out.println(age);
}
```

和 servlet 一样,多选框类型,

#### 集合

<!--第一种方式-->

```Java
@RequestMapping(value = "/add10")
public void add10(@RequestBody List<User> userList) {
    //spring mvc 可以帮我们进行类型转换
    System.out.println(userList);
}
```

<!--第二种方式-->

```Java
@RequestMapping(value = "/add10")
public void add10(Vo vo) {
    //spring mvc 可以帮我们进行类型转换
    System.out.println(vo);
}
//将userList 封装成Vo对象的一个属性,
```

#### 绑定参数@RequestParam

当请求参数和名称和方法指定的参数名称,不一致,则可以使用,

```Java
@RequestMapping(value = "/add12")
public void add12(@RequestParam(value = "name",required = false,defaultValue = "lanqiao") String username) throws IOException {
    //@RequestParam 注解可以绑定参数,参数名称为name,而不是 username,
    // 并且,可以设置 required=false 则表示 不是必须参数,
    // 还可以设置默认值 defaultValue  如果没有参数,则使用默认设置的参数
    System.out.println(username);
}
```

#### @RequestBody

以对象的形式接受参数

前端封装较为复杂的数据类型到后端时,可以将复杂数据转换成 json

然后 设置 ajax 的 `contentType: "application/json; charset=utf-8"`

mvc 参数那里,使用@RequestBody 然后可以封装成一个对象

### **视图**

```java
@RequestMapping(value = "/add",method = RequestMethod.GET)
public  String add(){
	return "index.jsp" //相当于是请求了http://localhost:80/index.jsp,只不过,前面省略了一些
}
```

返回参数 完整

```java
return	"forward:/index.jsp";//请求转发
return	"redirect:/index.jsp";//重定向
//需要注意的是,这里的的 路径和使用servlet的路径一样 加了/ 代表是虚拟路径,不加,则默认使用当前虚拟路径
```

#### ModelAndView

返回参数可以是 **ModelAndView** 对象 ,模型和视图对象

```java
//第一种写法
@RequestMapping(value = "/add2")
public ModelAndView add2(){
    ModelAndView modelAndView = new ModelAndView();
    modelAndView.setViewName("success.jsp");//设置视图名称

    modelAndView.addObject("userName","zs");//往域中存入数据
    return modelAndView;
}
//第二种写法
@RequestMapping(value = "/add3")
public ModelAndView add3(ModelAndView modelAndView){
    modelAndView.setViewName("success.jsp");//设置视图名称
    modelAndView.addObject("userName","zs");//往域中存入数据
    return modelAndView;

}
```

可以设置返回的视图的名称,和向域中存储数据

#### Model

**Model** 对象只能存储数据到域中,不能进行视图跳转的设置

```Java
@RequestMapping(value = "/add4")
public String add4(Model model){//模型
    model.addAttribute("user","zs");
    return "index.jsp";//视图

}
```

#### 其他参数

除了以上几种,spring mvc 还支持其他参数的注入

比如,**HttpServletResponse** **HttpServletRequest** 等等都是可以的,spring mvc 会自动注入

#### 内部视图解析器

在 spring mvc 配置文件中 ,配置

```xml
<!--内部视图解析器 -->
<bean id="viewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/"/>
    <property name="suffix" value=".jsp"/>
</bean>
```

这就可以,在请求视图跳转的时候,进行一个解析,**prefix** 前缀 ,.**suffix** 后缀

当我们返回视图名称为 **index** 的时候,会自动帮我们拼接 **/index.jsp** 之后返回的则是 **/index.jsp**

简化了书写

### @ResponseBody

当我们在参数上添加**@ResponseBody** 注解的时候,告诉 spring mvc ,**不进行视图跳转**

代表,我们要返回数据

```Java
@RequestMapping(value = "/add7")
@ResponseBody //声明是要相应数据,而不是,视图跳转
public String add7(){
    return "aaa"; //返回aaa 字符串,
}
```

#### 集成**jackson**

**spring mvc** 集成 了 **jackson**

在使用前需要导包和进行相应的配置

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.9.8</version>
</dependency>
```

在 xml 中配置

```xml
<!--配置适配器 -->
<bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter">
    <property name="messageConverters" >
        <list>
            <bean class="org.springframework.http.converter.json.MappingJackson2HttpMessageConverter"/>
        </list>
    </property>
</bean>
```

这样我们可以直接返回一个对象,spring mvc 自动帮我们把对象转换成 json 字符串

还有种简写方式

```xml
<mvc:annotation-driven/><!-- 注解驱动 ,可以自动帮我们集成 jackson 的适配器,不需要再配置上方的适配器了-->
```

### 开放资源权限

因为我们配置了**DispatcherServlet** 会过滤所有的请求

因此对,普通的静态资源也进行了过滤,

我们可以在 xml 种配置 开放这些资源权限

```xml
<!--第一种-->
<mvc:resources mapping="/js/**" location="/js/" />
<!--mapping 指的时请求访问路径,location是指的真实路径-->
```

```xml
<!--第二种-->
<mvc:default-servlet-handler/>
<!--当请求没有找到对应的 @RequestMapping 时,会去找tomcat 容器中寻找-->
```

### 乱码过滤器

在 xml 中配置 全局过滤器,则可以调整所有的字符编码集

```xml
<!--配置全局过滤的过滤器-->
<filter>
    <filter-name>CharacterEncodingFilter</filter-name>
    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
    <init-param>
        <param-name>encoding</param-name>
        <param-value>UTF-8</param-value>
    </init-param>
</filter>
<filter-mapping>
    <filter-name>CharacterEncodingFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

### Restful 风格

是一种架构风格,设计风格,不是标准,提供了一组设计原则,和约束条件

Restful 风格的请求时使用 **url+请求方式** 表示一次请求目的

```Java
Get :用于获取资源
Post:用于新建资源
Put:用于更新资源
Delete:用于删除资源
```

```
/user/1 GET 得到id=1 的user
/user/1  Delete 删除id=1的user
/user/1 PUT  更新id=1 的user
/user/ POST 新增 user

```

```java
@RequestMapping(value = "/add13/{name}")
@ResponseBody
public void add13(@PathVariable(value = "name") String username){
    System.out.println(username);
}
//http://localhost/user/add13/zs
```

使用 **{}** 占位符 在绑定 参数

### 自定义类型转换器

首先创建自定义类型转换器类

实现 **Converter<S,T>** 接口 重写方法, S 代表 ,你要要转换的值得类型

T 代表转换后得值

然后再 xml 中配置类型转换器

```xml
<!--配置自定义类型转换器-->
<bean id="conversionService" class="org.springframework.context.support.ConversionServiceFactoryBean">
    <property name="converters">
        <list>
            <bean class="top.wupeiyao.op.Conversion.DateConversion" />
        </list>
    </property>
</bean>
```

然后在 注解驱动中进行参数添加

```xml
<mvc:annotation-driven conversion-service="conversionService"/>
```

### 请求头@RequestHeader

在参数上绑定 注解 @RequestHeader 绑定需要查看得请求头

```java
@RequestMapping(value = "/add15")
@ResponseBody
public void add15(@RequestHeader("user-agent") String user_agent) {
    System.out.println(user_agent);
}
```

### @CookieValue

```java
@RequestMapping(value = "/add16")
@ResponseBody
public void add16(@CookieValue("JSESSIONID") String JSESSIONID) {
    System.out.println(JSESSIONID);
}
```

## 文件上传

spring mvc 集成了上传插件

fileupload

导入依赖

```xml
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.3</version>
</dependency>
<dependency>
    <groupId>commons-fileupload</groupId>
    <artifactId>commons-fileupload</artifactId>
    <version>1.3.3</version>
</dependency>
```

配置 spring mvc 配置文件

<!--注意 这里的id 一定是 multipartResolver,必须使用post请求-->

```xml
<!--配置文件上传-->

<bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">

    <!-- 上传文件的总大小 单位时字节-->
    <property name="maxUploadSize" value="140293400"/>

    <!-- 上传单个文件的总大小-->
    <property name="maxUploadSizePerFile" value="140293400"/>
</bean>
```

```java
@RequestMapping(value = "/add17",method = RequestMethod.POST)
@ResponseBody
public void add17(MultipartFile file) throws IOException {
    System.out.println(file);
    //String originalFilename = file.getOriginalFilename();
    //String contentType = file.getContentType();
    //byte[] bytes = file.getBytes();
    //System.out.println("originalFilename:"+originalFilename);
    //System.out.println("contentType:"+contentType);
    //System.out.println("bytes:"+bytes);
}
```

<!--注意一定要用post请求-->

## 拦截器

类似过滤器,但是,比过滤器,做更多的事,只能拦截 spring mvc 中的

首先,创建拦截器类, 实现 **HandlerInterceptor** 接口

重写 3 个方法

```Java
//目标方法执行前执行  返回值为boolean 为true的话,代表放行,false 不放行
@Override
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    return false;
}

//目标方法执行后,视图返回前执行,可以修改跳转的视图,以及域中的值
@Override
public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

}

//最终执行
@Override
public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

}
```

然后在 spring mvc 配置文件中配置 拦截器

```xml
<!--拦截器配置 -->
<mvc:interceptors>
    <mvc:interceptor>
        <mvc:mapping path="/**"/><!--拦截所有请求-->
        <bean class="top.wupeiyao.op.interceptor.MyInterceptor"/>
    </mvc:interceptor>
</mvc:interceptors>
```

## 异常处理

spring mvc 有异常处理机制,不管哪个层出现了异常,都往外抛,抛给 spring mvc 异常处理器,处理

需要在 spring mvc xml 配置文件中进行配置

```xml
<bean class="org.springframework.web.servlet.handler.SimpleMappingExceptionResolver">
    <property name="defaultErrorView" value="err"></property><!--默认的异常处理-->
    <property name="exceptionMappings">
        <map>
            <entry key="java.lang.ArithmeticException" value="err2"/>
        </map>
    </property>
</bean>

```

**defaultErrorView** 是默认的异常,

**exceptionMappings** 是我们需要映射的异常 ,**key** 是异常的全类名 **value** 是映射异常的 视图名称,

<!--如果spring mvc 异常处理器没有找到对应得异常处理,则使用默认的异常,跳转默认的异常视图-->

**也可以使用自定义异常**

首先自定义异常,需要继承**Exception** 然后,在 spring mvc 配置文件中进行和普通异常一样的配置就行了

```

```

**自定义异常处理器**

实现 **HandlerExceptionResolver** 这个接口

```java
public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler,Exception ex) {


	return null;
}
```

其中 **ex** 为需要处理的异常,可以使用 **instanceof ** 进行判断

返回值 是一个 **ModelAndView** 因此,我们需要创建一个 **ModelAndView** 对象 ,进行视图跳转设置

最后,需要在 spring mvc 中进行 配置

只需要配置一个 bean 就行了

```xml
<bean class="全类名"   />
```

## mvc 执行流程
