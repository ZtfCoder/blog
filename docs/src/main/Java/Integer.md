---
title: Interger 缓存区
tags:
  - java
categories: java基础
abbrlink: 703b0fcc
---
Javabean 中,对于数字使用的类型,建议推荐使用Integer 类型,

这样可以避免在数据库中存入**0** 这样的特殊值
<!--more-->




Interger 内部含有一个缓存区(在方法区中,(方法去中也有常量池)),如果使用字面值创建Integer 则会自动调用valueOf 方法,则会判断该字面值是否处于缓存区的值

~~~java
//源码
public static Integer valueOf(int i) {
        if (i >= IntegerCache.low && i <= IntegerCache.high)
            return IntegerCache.cache[i + (-IntegerCache.low)];
        return new Integer(i);
    }
~~~

