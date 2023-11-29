---
title: mysql DDL
tags: mysql
categories: mysql
abbrlink: 85d87be0
---

# DDL 语言

数据库操作语言

## 新建表

关键词 create table;

varchar(20) 字符串 小括号内限制长度

char：字符类型 存放 0-255 个字节 不足用空格替代

datetime：时间类型

<!-- more -->

```SQL
create table if not exists stuifo(
	stuId int,
    stuName varchar(20),
    gander char,
    bornDate datetime

);
```

尽量不要使用关键字作为了表字段,否则,可能会在后期,插入时,出错

## 约束

### 1.非空约束

not null

```SQL
create table if  not exists stuinfo(
	stuId INT not null,
    stuName VARCHAR(20),
    gender CHAR,
    bornDate DATETIME
);
```

<!--设置了非空关键词，该字段录入数据时不能为空-->

#### 单独删除

```SQL
alter table 表名 modify 字段
```

#### 单独添加

```SQL
alter table 表名 modify 字段 not null
```

### 2.默认值(default)

```SQL
CREATE TABLE IF NOT EXISTS stuinfo(
    stuId INT not null ,
    stuName VARCHAR(20),
    gender CHAR,
    bornDate DATETIME,  
    school varchar(50) not null default '泸职院'
);

```

<!--在用户输入前就已经设置了一个初始值，默认值配合not null使用-->

### 3.列描述(comment)

```SQL
CREATE TABLE IF NOT EXISTS stuinfo(
    stuId INT not null comment '学号',
    stuName VARCHAR(20) comment '姓名',
    gender CHAR comment '性别',
    bornDate DATETIME comment '出生日期',  
    school varchar(50) not null default '泸职院' comment '学校'
);

```

<!--列描述类似于注释，但和注释不同，列描述也要参与执行-->

### 4.自动填充(zerofill)

a:如果某一数值列规定了 zeroﬁll,则自动把此列变为无符号整形

b:规定了 zeroﬁll 的数据列，如果数据列的长 度没达到规定长度，则在数据前面自动填充 0

```SQL
CREATE TABLE IF NOT EXISTS stuinfo(
    stuId INT primary key,
    stuName VARCHAR(20) comment '姓名',
    gender CHAR comment '性别',
    age INT(5) ZEROFILL,
    bornDate DATETIME comment '出生日期',  
    school varchar(50) not null default '泸职院' comment '学校'
);
```

<!--一般用于货币-->

### 5.主键约束(primary key)

用来保证记录的唯一性，使用主键约束的字段，不能为空（无需写 not null），不能重复，主键所在的列为整数类型，一张 表有且只 能有一个主键

```SQL
CREATE TABLE IF NOT EXISTS stuinfo(
    stuId INT primary key,
    stuName VARCHAR(20) comment '姓名',
    gender CHAR comment '性别',
    age INT(5) ZEROFILL,
    bornDate DATETIME comment '出生日期',  
    school varchar(50) not null default '泸职院' comment '学校'
);
```

<!--一般将学号，工号等字段设为主键-->

#### (2)复合主键(联合主键)

```SQL
create table t8(  
    name varchar(20) comment '学生姓名',  
    sushe varchar(20) comment '描述学生宿舍',  
    age int comment '学生年龄',    
    primary key(name,sushe) comment 'id和宿舍作为复合主键'
);
# 追加复合主键
alter table 表名 add constraint  联合主键名 primary key(列1,列2);
```

<!--复合主键和单主键不同，它是每一组的数据不同，在同一行的数据为一组，-->

#### (3)追加主键

```SQL
alter table 表名 add primary key(字段1,....);
```

<!--追加后主键必须确保主键内容不能为空，不能重复-->

#### (4)删除主键

```SQL
alter table 表名 drop primary key;
```

### 6 外键

#### (1)外键的建立

外键是用于多表查询使用的关键字段

#父表的字段和子表的字段类型必须相同，且限制条件也相同

语法：

```SQL
alter table 子表 add constraint  FK_ID(外键名称可随意) foreign key （外键字段名） references 父表(主要字段名)
```

建立外键后，子表关键字段只能录入父表外键字段已有的值

```
添加外键的字段必须含有主键或者唯一键约束，可在建表的同时建立外键，但是必须先建立父表
在子表的最后加入
constraint  FK_ID(外键名称可随意) foreign key （外键字段名） references 父表(主要字段名)
```

#### (2)外键的删除

```SQL
alter table 子表 drop 外键名 foreign key 外键名
```

#### 级联

<!--级联是添加外键后的另一个附加操作-->

##### 级联的作用

​ 级联是在外键的基础下添加的一个约束，是用于在更新父表的关联字段的同时也会更新字表的关联字段这样方便了了修改大量数据的时

##### 级联的添加

```SQL
alter table 表名 add constraint 外键名 foreign key (需要添加外键约束的列名) references (父表对应的列名) on update cascade on delete cascade
```

<!--级联操作时包含创建外键的附加操作-->

##### 级联的删除

```SQL
on delete cascade
```

### 7.自增长(auto_increment)

一张表有且只能有一个自增长 ，主键和 自增长搭配使用

<!--一般将id值等字段设为自增，你可以在下一行不输入id也行，它会自动填写-->

### 8.唯一键(unique)

唯一键允许为空，但是不能重复，一张表中可以有多个字段设置唯一 唯一键解决表中多个字段需要唯一性约 束的问题 null 不做比较，可以允许多个 null

#### 单独添加

```SQL
alter table 表名 modify 字段 unique
```

#### 单独删除

```SQL
alter table 表名 drop index
```

### 9.unsigned(非负数)

设置了 unsigned 后只能在该在该字段添加正数
