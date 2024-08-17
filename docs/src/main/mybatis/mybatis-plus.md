---
title: mybatis-plus
tags:
  - mybatis
  - mysql
categories: mybatis
abbrlink: e528bb3e
---
# 记录,mybatis-plus的坑

## 分页查询

### 内置sql语句



~~~

~~~



### 自定义sql

在执行sql前,执行,拦截器,启动分页查询
<!-- more -->
向动态接口方法传入Page对象,

获取到的集合,set进之前的Page对象

~~~java
public void findAllEmp(Page<Emp> empPage) {
    PageHelper.startPage(empPage.getCurrent(),empPage.getSize());
    List<Emp> empList = baseMapper.findAllEmp(empPage);
    Page<Emp> page = empPage.setRecords(empList);
}
~~~

<!---此坑,很深-->

