---
title: elasticsearch与spring-boot整合(二)
tags:
  - elasticsearch
categories: elasticsearch
abbrlink: 61be4006
---
# 前话

> 注意,还是要对es 进行连接注入,否则后续会报错
>
> ```java
> @Bean
> public RestHighLevelClient client(){
>     return new RestHighLevelClient(
>             RestClient.builder(
>                     new HttpHost(host, port, scheme)));
> }
> ```

我们之前练习了原生es api 去操作我们的es 进行增删改查
<!--more-->
但是很多都很麻烦,代码量很大

因此,我们使用这个spring boot 的一个项目

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
</dependency>
```

包含了我们常用的api 简化了我们的开发

> 这里我们还是使用 7.6.2 版本的es api 为了避免很多api 不相同

在 `properties` 里面全局声明 版本 这个名称是可以看`spring-boot-starter-parent` 里面得到的

```xml
<properties>
    <java.version>1.8</java.version>
    <elasticsearch.version>7.6.2</elasticsearch.version>
</properties>
```

这里有2种实现方式

一种是JPA 方式还有种是 用spring 提供的 `ElasticsearchRestTemplate`

jpa 方式的话,.就像mybatis 一样提供一个接口 

然后接口去继承`ElasticsearchRepository<User,String>`

第一个泛型是 操作的类,第二个是 主键的类似

然后剩下的就是调用方法,但是这种扩展方法较为麻烦,因此,不使用这种

> 还是选择使用`ElasticsearchRestTemplate`模式

准备实体类

```java
@Data
@Document(indexName = "user1") // 索引名称
public class User {
    @Id
    private String id;
    @Field(analyzer = "ik_max_word",type = FieldType.Text)
    private String name;

    @Field(type = FieldType.Integer)
    private Integer age;

    @Field(type = FieldType.Keyword)
    private String email;

    @Field(type = FieldType.Keyword)
    private String address;

    @Field(type = FieldType.Keyword)
    private String birthday;
}
```

# 基本操作

## 创建索引

```java

@Autowired
private ElasticsearchRestTemplate restTemplate;
/**
* 创建索引
*/
@Test
void creatIndex(){
    List<User> users = new LinkedList<>();

    for (int i = 0; i < 10; i++) {

        User user = new User();
        user.setId("id:"+i)
            .setAddress("address:"+i)
            .setAge(i)
            .setEmail("email:"+i)
            .setBirthday("birthday:"+i);
        users.add(user);
    }
    restTemplate.save(users);
}
```



