---
title: mybatis多表
tags:
  - mybatis
  - mysql
categories: mybatis
abbrlink: af8d7142
---



# mybatis

## 一对多

当出现一个班级对应多个学生的时候,此时我们需要查询班级的时候,同时查询该班下的所有同学,则出现了一对多情况

~~~
也就是一个班级对象中,包含了该班级的所有学生对象
~~~
<!-- more -->
~~~java
@Data
public class Clzz {

    private Integer id;

    private Integer clzzNo;

    private List<Student> students;

}
~~~

~~~java
@Data
public class Student {
    private Integer id;
    private String name;
    private Integer clzz;
}
~~~



### 第一种方法

~~~xml
<resultMap id="resultClzz" type="com.ztf.mybatis.demo04.Clzz">
    <id column="cid" property="id"/>
    <result column="clzzNo" property="clzzNo"/>
    <collection property="students" ofType="com.ztf.mybatis.demo04.Student">
        <id column="sid" property="id"/>
        <result column="name" property="name"/>
        <result column="clzz" property="clzz"/>
    </collection>
</resultMap>


<select id="selectClzz" resultMap="resultClzz">
    select c.id 'cid',clzzNo,s.id 'sid',name,clzz from
    clzz c
    join student s
    on c.id = s.clzz
    where id = #{id}
</select>
~~~

这样的话,就能查出某个班级对象的同时,查出 该班级下的所有学生对象

> 如果需要查询所有班级的对象,则去掉where 条件即可

一个班级,对应多个学生对象,就叫,1对多查询



### 第二种方法

~~~xml
<resultMap id="resultClzz2" type="com.ztf.mybatis.demo04.Clzz">
    <id column="id" property="id"/>
    <result column="clzzNo" property="clzzNo"/>
    <collection property="students" select="selectClzz3" column="id"/>

</resultMap>

<select id="selectClzz3" resultType="com.ztf.mybatis.demo04.Student">
    select * from student where clzz = #{id}
</select>

<select id="selectClzz2" resultMap="resultClzz2">
    select * from clzz where id = #{id}
</select>
~~~

第二种,方式,我们可以通过添加日志框架,打印执行的sql语句,可以知道,这样我们的sql执行2次,其中,执行`id`为`selectClzz2`的语句的时候,向`id`为`selectClzz3` 传送了列 id 值过去,.作为参数



## 多对一

查询学生的时候,同时把班级信息查询出来

### 第一种

~~~java
@Data
public class Clzz {
    private Integer id;
    private Integer clzzNo;
}
~~~

~~~java
@Data
public class Student {
    private Integer id;
    private String name;
    private Clzz clzz;
}
~~~

~~~xml
<resultMap id="studentMap" type="com.ztf.mybatis.demo05.Student">
    <id column="sid" property="id"/>
    <result column="name" property="name"/>
    <association property="clzz" javaType="com.ztf.mybatis.demo05.Clzz">
        <id property="id" column="cid" />
        <result column="clzzNo" property="clzzNo"/>
    </association>
</resultMap>

<select id="selectStudent" resultMap="studentMap">
    select s.id 'sid',name,clzz,c.id 'cid' ,clzzNo
    from student s
    join clzz c
    on s.clzz = c.clzzNo
    where s.clzz = #{id}
</select>
~~~

> 简单的说,就是讲查询出多余的列,来封装成一个对象,而这个对象正好是,所查询对象里的一个成员属性



### 第二种

~~~xml
<resultMap id="studentMap2" type="com.ztf.mybatis.demo05.Student">
    <id column="id" property="id"/>
    <result column="name" property="name"/>
    <association property="clzz" select="selectClzz" column="clzz"/>
</resultMap>

<select id="selectClzz" resultType="com.ztf.mybatis.demo05.Clzz">
    select * from clzz where clzzNo = #{clzz}
</select>

<select id="selectStudent2" resultMap="studentMap2">
    select * from student where id = #{id}
</select>
~~~

用法和一对多查询差不多

## 自关联查询

一个基本的权限菜单表

~~~java
@Data
public class Permission {

    private String id;
    private String name;
    private String pid;
    private List<Permission> child;
}
~~~

~~~xml
<resultMap id="permissionMap" type="com.ztf.mybatis.demo06.Permission">
    <id column="id" property="id"/>
    <result column="name" property="name"/>
    <result column="pid" property="pid"/>
    <collection property="child" select="selectChild" column="id"/>
</resultMap>

<select id="selectChild" resultMap="permissionMap">
    select * from tbl_permission where pid = #{pid}
</select>

<select id="select" resultMap="permissionMap">
    select * from tbl_permission where id = #{id}
</select>
~~~

这样可以把最顶级节点下面的所有子孙节点全部查询出来

这个就是sql 递归



Java优化,不用递归生成

~~~java
InputStream inputStream = Resources.getResourceAsStream("config3.xml");

SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(inputStream);
SqlSession sqlSession = factory.openSession();
PermissionDao mapper = sqlSession.getMapper(PermissionDao.class);
List<Permission> select = mapper.selectAll();

Map<String,Permission> map = new HashMap<>();
select.forEach(e->map.put(e.getId(),e));

Set<String> ids = map.keySet();

for (String id1 : ids) {

    for (String id2 : ids) {
        Permission prent = map.get(id1);
        Permission child = map.get(id2);
        if (prent.getId().equals(child.getPid())){
            if (prent.getChild()==null){
                prent.setChild(new ArrayList<>());
            }
            prent.getChild().add(child);
        }
    }
}
~~~

原理是,利用引用变量,进而封装其他的

