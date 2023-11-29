---
title: springboot基础入门-security 从数据库读取用户
tags:
  - java
  - springboot
  - 安全框架
categories: springboot
abbrlink: 37e577a8
---



## 目标



- 实现从数据库读取用户信息 进行权限判断
- 使用 ajax 登录,进行权限判断

 事前 sql
<!-- more -->
```sql
create table if not exists tbl_role
(
	id int auto_increment
		primary key,
	name varchar(255) null
);

create table if not exists tbl_user
(
	id int auto_increment
		primary key,
	username varchar(255) null,
	password varchar(255) null
);

create table if not exists tbl_user_role
(
	user_id int null,
	role_id int null
);
insert into tbl_user values (1,'root','root');
insert into tbl_user values (2,'admin','admin');
insert into tbl_role values (1,'人事管理');
insert into tbl_role values (2,'系统管理员');
insert into tbl_user_role values (1,1);
insert into tbl_user_role values (1,2);
insert into tbl_user_role values (2,1);
```



## UserDetailsService

**UserDetailsService** 是`security` 框架下的一个用于实现访问数据库加载用户的一个接口

里面只有一个方法,

```java
UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
```

我们自己去写一个类去实现这个类

```java
@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RoleMapper roleMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //查数据库
        MyUser user = userMapper.selectUserByName(username);
        if (user==null){
            throw new UsernameNotFoundException("该用户不存在");
        }
		// 查询这个用户所有的角色
        List<Role> roles = roleMapper.selectByUserId(user.getId());
        //GrantedAuthority 表示授予Authentication对象的权限
        List<GrantedAuthority> authorities = new ArrayList<>();
        if (roles!=null&&roles.size()>0){
            for (Role role : roles) {
                String roleName = "ROLE_" +role.getName();
                authorities.add(new SimpleGrantedAuthority(roleName));
            }
        }
        // 注意这里的User 我先使用默认的security自带的User
        //org.springframework.security.core.userdetails.User;
        return new User(username,user.getPassword(),authorities);
    }
} 
```

方法的名称还是取的比较规范的可以一眼看出是干嘛

## MyUserDetails

我们可以看下这个`org.springframework.security.core.userdetails.User;` 这个User这个类

可以看到他 实现了`UserDetails` 这个接口,因此,我们可以写一个自己的`User` 

```java
public class MyUserDetails implements UserDetails {

    private Integer id;
    private String username;
    private String password;


    // 用户是否过期
    private boolean isExpired;
    // 用户账号是否锁住
    private boolean isLocked;
    // 凭证是否过期
    private boolean isCredentials;
    // 是否可用
    private boolean isEnabled;
    // 授权角色的名称列表
    private List<GrantedAuthority> authorities;

    public MyUserDetails(Integer id, String username, String password,
                         boolean isExpired, boolean isLocked,
                         boolean isCredentials, boolean isEnabled,
                         List<GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.isExpired = isExpired;
        this.isLocked = isLocked;
        this.isCredentials = isCredentials;
        this.isEnabled = isEnabled;
        this.authorities = authorities;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return isExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return isLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return isCredentials;
    }

    @Override
    public boolean isEnabled() {
        return isEnabled;
    }
}
```

有些东西是必须要写的,我添加了注释的这个几个注释是必须要写的东西

注释上也写了它是干嘛的,因此还是比较好理解的

之前,我们不是 调用`loadUserByUsername` 方法的的时候,最后不是返回了一个security 的User 嘛,

这下,我们可以返回自己的对象,还可以添加自己业务对应的字段

由于认证需要密码加密,所以,我们简单先自己实现一个密码加密器

## 密码加密

```java
@Component
public class MyPasswordEncoder implements PasswordEncoder {
    /**
     * 
     * @param rawPassword 未加密的密码
     * @return 加密后的密码
     */
    @Override
    public String encode(CharSequence rawPassword) {
        return rawPassword.toString();
    }

    /**
     * 
     * @param rawPassword 输入进来的密码
     * @param encodedPassword  加密后的密码
     * @return 是否匹配成功
     */
    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return rawPassword.equals(encodedPassword);
    }
}
```



## 核心配置

```java
@EnableWebSecurity
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {



    @Autowired
    private MyUserDetailsService userDetailsService;

    @Autowired
    private MyPasswordEncoder passwordEncoder;

    // 授权
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/").authenticated()
                .antMatchers("/getAllRole").hasAnyRole("系统管理员")
                .antMatchers("/getAllUser").authenticated();// 只要登录了,都可以访问
        // 关闭csrf
        http.formLogin();
        http.csrf().disable();
    }


    // 认证
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // 可以基于内存,也可以基于数据等方式
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
    }
}
```

控制层这里就随便写了2个接口`getAllRole` `getAllUser` 自己测试的时候,就随便写几个就行了

之后,就可以启动项目测试了

> 我们先用root 账号登录,访问getAllRole 是可以正常访问的,而 getAllUser 也可以
>
> admin 账号登录的时候,就只能访问getAllUser了,访问另外一个会出现403错误.

现在还是用的别人的页面,我们修改下配置类,改成自己的页面

## ajax登录

准备一个简单的html 页面

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <form>
        账号<input type="text" id="username"><br>
        密码 <input type="password" id="password">
        <input type="button" id="login" value="提交">
    </form>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
<script>

    $("#login").click(()=>{
        let username = $("#username").val();
        let password = $("#password").val();
        $.post('/login',{'username':username,'password':password},response=>{
            console.log(response);
        })
    })

</script>
</body>
</html>
```

<img src="https://images.wupeiyao.top/notes/20210528143636.png" alt="image-20210528143548232" style="zoom: 80%;" />

这里的的`{'username':username,'password':password}`为啥叫username 是因为默认是这个名称,,我们可以从`http.formLogin()`

这个方法的源码注释看出来,还有其他更多的设置,比如,默认验证登录的请求路径是`/login`

这里,我们让`Security` 去帮我判断是否登录成功,就不自己再次判断,因此,我们肯定要返回一些数据来告诉前端是否登录成功

这里需要写2个处理器,一个是请求成功的处理器,和请求失败的处理器

我们去是实现下,这样才能自定义返回我们所期待的数据比如json等

```java
@Component
public class LoginSuccessHandel implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        ///登录成功处理器
        response.setContentType("text/json;charset=utf-8");
        ObjectMapper objectMapper = new ObjectMapper();
        HashMap<String, String> map = new HashMap<>();
        map.put("msg","登录成功");
        map.put("code","200");
        map.put("data",null);
        // 转换成json 输出到流中,即相应请求
        objectMapper.writeValue(response.getOutputStream(),map);
    }
}
```

```java
@Component
public class LoginFailHandel implements AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        //登录失败处理器
        response.setContentType("text/json;charset=utf-8");
        ObjectMapper objectMapper = new ObjectMapper();
        HashMap<String, String> map = new HashMap<>();
        map.put("msg","登录失败");
        map.put("code","500");
        map.put("data",null);
        // 转换成json 输出到流中,即相应请求
        objectMapper.writeValue(response.getOutputStream(),map);
    }
}
```

这样就定义我们自己的返回处理器了

最后,需要在`Security`  配置类中进行配置 使用我们的处理器

~~~java
@EnableWebSecurity
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private MyUserDetailsService userDetailsService;

    @Autowired
    private MyPasswordEncoder passwordEncoder;

    @Autowired
    LoginSuccessHandel loginSuccessHandel;

    @Autowired
    LoginFailHandel loginFailHandel;

    // 授权
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/").authenticated()
                .antMatchers("/getAllRole").hasAnyRole("系统管理员")
                .antMatchers("/getAllUser").authenticated();// 只要登录了,都可以访问
        // 关闭csrf
        http.formLogin()
                // 自定登录义页面
                .loginPage("/myLogin.html")
                // 设置Security 的登录接口
                .loginProcessingUrl("/login")
                // 自定义 登录成功后重定向地址
                .successHandler(loginSuccessHandel)
                // 定义登录失败的页面
                .failureHandler(loginFailHandel);
        http.csrf().disable();
    }


    // 认证
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // 可以基于内存,也可以基于数据等方式
        //auth.jdbcAuthentication().dataSource(dataSource).passwordEncoder()
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);

    }
}
~~~

这里需要注意,如果我们使用了自己的登录页面,那么需要重写定义请求接口即`loginProcessingUrl("/login")`

接下来就是测试,大家可以自己试试