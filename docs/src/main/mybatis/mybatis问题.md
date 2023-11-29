---
title: mybatis
tags:
  - mybatis
  - mysql
categories: mybatis
abbrlink: 15832afd
---





# mybatis 使用的小问题

### 动态模糊搜索

**第一种 利用mysql 函数拼接** 

```xml
<if test="title !=null and title!='' ">
    s.title_ like CONCAT('%',CONCAT(#{title},'%'))
</if>
```

**第二种 通过mybatis 的bind 标签进行绑定**

```xml
<if test="title !=null and title!='' ">
    <bind name="title" value="'%' + title + '%'"/>
    s.title_ like #{title}
</if>
```

<!-- more -->

### 动态sql 条件查询

```xml
select s.* from student
<where>
    <if test="title !=null and title!='' ">
        s.title_ like CONCAT('%',CONCAT(#{title},'%'))
    </if>
    <if test="cid3!= null">
        and cid3_ =#{cid3}
    </if>
    <if test="brandId!=null">
        and brand_id_=#{brandId}
    </if>
</where>
```

我们需要动态根据`titl ` `cid3`  `brandId` 这三个值去搜索,需要使用`mybatis` 的 `where` 标签 它可以动态帮我们判断是否需要添加`and` 语句如果不需要,则,会把前面的`and` 关键字删除 