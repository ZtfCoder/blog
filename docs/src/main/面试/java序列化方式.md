---
title: Java 序列化 方式
tags:
  - 面试
categories: 面试
abbrlink: e463212f
---
Java 序列化 方式


## Serializable 

实现 `Serializable` 接口 

再添加 常量 
<!-- more -->
```java
private  static  final  long  serialVersionUID = 1L;
```

## Externalizable

实现接口 `Externalizable` 接口 

```java
public interface Externalizable extends java.io.Serializable {
    // 序列化属性
    void writeExternal(ObjectOutput out) throws IOException;
    // 反序列化,必须按照上方序列化属性的顺序
    void readExternal(ObjectInput in) throws IOException, ClassNotFoundException;
}
```

