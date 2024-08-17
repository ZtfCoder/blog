---
title: mysql DQL
tags: mysql
categories: mysql
abbrlink: b26d9df4
---

# DQL 数据库查询语言

## 数据查询语言 DQL

数据查询语言 DQL 基本结构是由 select 子句，from 子句，where
子句组成的查询块：
select<字段名表>
from <表或视图名>
where<查询条件>

## 查询语句

mysql>select\*from 表名;

 <!--查询该表所有得列-->

mysql> select 字段 1,字段 2,...... from 表名;

<!--查询部分列-->

mysql>select distinct 字段 1,字段 2,....from 表名;

<!--查询不重复内容-->

mysql>select 字段 1,字段 2,.....from 表名 where 限制条件;

<!--注意，限制条件类似于编程语言，逻辑判断可用and、or，特别注意，判断相等用一个等号-->

**where 是用于分组前筛选**

### 区间查询

关键词

​ is null

​ is not null

比较操作符

​ <=> 当<=>左右两边的字段的值相等或者都是 null 时，<=>的结果是 true，则返回满足条件的数据

### 模糊查询

通配符：

​ %,代表不限个数个字符

​ \_,代表一个字符

语法

```sql
select*from 表名 where 字段 like '%k';
```

解释： 查询字段中数据是以 k 为末尾的数据

查询不存在,

```sql
select * from emp where ename not like '%s%';
```

<!--如果没有使用通配符，like子句和等号=的效果是一样的；-->

### 离散查询

in，not in 关键词

in(数据 1,数据 2,..)

语法

```sql
mysql>select*from 表名 where 字段 in(数据1,数据2....);
```

<!--查询字段中只含有指定数据的内容或者不包含指定数据的内容-->

### 排序查询

语法（ order by 字段名 asc/desc;）

```sql
mysql>select*from 表名 where order by 字段 asc(或者 desc);
```

默认是升序，asc 升序 desc 降序

### 分组查询(有坑)

（根据结果来进行分组）

使用关键词 group by，

**限制语句是用 having，是在分组后进行筛选**

比如 查询每个部门的平均工资

```sql
select d.department_id,avg(e.salary) as '平均'
from employees e
join departments d
on e.department_id=d.department_id
GROUP BY d.department_name
```

根据部门名称或者部门 id 来进行分租，然后求出每个组的平均工资，最后整理得每个部门的平均工资

<!---->

### 子查询

可以把前一次查询的结果作为第二次查询时的表、条件等使用

比如 查询工资高于公司平均工资的员工姓名和工资

1.先查平均工资

2.再查高于平均工资的

```sql
select first_name,salary
from employees
where salary>(select avg(salary)
			from employees)
```

再比如 用子查询查询所有不在美国工作的员工的姓名

1.查询出所有在美国的部门 id 2.用部门 id 过滤员工信息

```sql
select first_name
from employees
where department_id not in (select d.department_id
                            from locations l
                            join departments d
                            on l.location_id=d.location_id
                            where l.country_id='US')
```

```sql
工资高于10000的员工的平均工资
select avg(salary)
from (select first_name,last_name,salary
	from employees
	where salary>10000) e
```

### 分页查询

在指定的条件下只显示一部分数据

索引从 0 开始计算

关键词 limit 参数 1(开始索引),参数 2(数量)

### 联合查询

把多次查询的结果竖着放一起显示，多次查询的列的数量和类型要一致
查询 1

union

查询 2

union 去重

union all 不会会去重

## 常见函数

### 单行函数

select length(参数);

<!--返回参数的长度-->

select concat(字段 1,“链接符”,字段 2,) from 表名;

### 聚合函数

count(字段);

​ select count(字段)from 表名;

<!--统计一列的个数-->

max();

​ selcet max(字段)from 表名;

<!--统计一列中的最大值-->

min();

​ select min(字段)from 表名;

<!--统计一列中最小值-->

sum();

​ select sum(字段)from 表名;

<!--求和-->

avg();

​ select avg(字段)from 表名;

<!--求平均数-->

<!--注意：聚合函数在对列进行计算时，null值不参与-->

## 数学函数

round();

<!--将结果四舍五入-->

ceil();

<!--向上取整-->

floor();

<!--向下取整-->

## 多表查询

<!--多表查询的关键就是关联字段，也就是说，其中一张表的某个字段与另一张表的某个字段相同，也就是有关联，所以这2张表能够借助这个关联字段进行链接，从而实现多表查询-->

### 内连接(inner) join

》select 查询字段

》from 表名

》inner join 另一个表名

》on 表名.关联字段= 另一个表名.关联字段;

<!--只会显示关联字段相同的数据-->

### 左连接

》select 查询字段

》from 表名

》left join 另一个表名

》on 表名.关联字段= 另一个表名.关联字段;

<!--上面一张表为左，下面一张表为右，左连接优先显示左边那张表的全部内容，哪怕某些关联字段数据不相同，也会显示左边那张表的内容，如果没有值，则用null值代替-->

等于左外连接

### 右链接

》select 查询字段

》from 表名

》right join 另一个表名

》on 表名.关联字段= 另一个表名.关联字段;

<!--上面一张表为左，下面一张表为右，右连接优先显示右边那张表的全部内容，哪怕某些关联字段数据不相同，也会显示右边那张表的内容，如果没有值，则用null值代替-->

## if 函数

类似 Java 三元表达式

if(参数 1,参数 2,参数 3)

## 去重

distinct

```sql
select distinct sal+ifnull(comm,0)*12 总工资 from emp;
```

### <ALL 表示小于最小

所有数据。

```

```

>

### any 任何

任何一个数据

```
>ANY 表示大于最小值
```
