---
title: redis 基础
tags:
  - redis
  - 缓存技术
categories: redis
abbrlink: c69083c7
---



# Redis

~~~
Redis（Remote Dictionary Server )，即远程字典服务，是一个开源的使用ANSI [C语言]编写、支持网络、可基于内存亦可持久化的日志型、Key-Value[数据库]，并提供多种语言的API
~~~



redis-cli.exe

客户端

redis-server.exe

服务端
<!-- more -->
redis 的数据结构

redis 存储的是 key value 格式的数据,其中key 都是字符串

​	value 的数据结构:

​		1.字符串 String

​		2.哈希类型 hash  map格式

​		3.列表形式 lsit  linkedlist格式

​		4,集合类型 set

​		5.有序集合 sortedset

### 字符串类型:String

~~~
1.存储:set key value
2.获取:get key
3.删除:del key
~~~

### 哈希类型 hash

~~~
1.存储:hset key field value
2.获取:
		获取指定field的值:hget key field
		获取所有field 的value值 :hgetall key 
3.删除:hdel key field

存储类似于于创建了一个map集合,key是map的名字,field和value是键和值
~~~

### 列表 lsit

可以添加一个元素到列表的左边或者右边

类似于队列,不过与队列不同的是,可以分别从2端添加进元素

~~~~
1.添加:
	lpush key value :将元素加入列表的左边
	rpush key value :将元素加入列表的右边
2.获取
	lrange key start end :范围获取 [ , )
3.删除
	lpop key :删除列表最左边的元素,并将元素返回
	rpop key :删除列表最右边的元素,并将元素返回
~~~~

~~~
lsit中删除指定元素

lrem key count value

count > 0:从表头开始向表尾搜索，移除与 value 相等的元素，数量为 count
count < 0 : 从表尾开始向表头搜索，移除与 value 相等的元素，数量为 count 的绝对值。。
count = 0 : 移除表中所有与 value 相等的值。


lindex key 索引
通过索引获取列表中的元素
 1 表示列表第一个元素
-1 表示列表的最后一个元素
如果指定索引值不在列表的区间范围内，返回 nil 
~~~

~~~
获取列表长度
llen key
~~~







### 集合 set 

不允许重复元素

~~~
1.存储: sadd key value
2.获取: smembers key 
		获取set 集合中所有的元素
3.删除:srem key value: 删除set集合中的某个元素
~~~

## 通用命令

~~~
key * :查看所有的key
type key :获取键对应的value的类型
del key  :删除指定的key value

~~~

## 持久化

redis 是一个内存数据库,但redis服务器重启后,内存中的数据,会丢失

我们可以

将redis 内存中的数据持久化保存到硬盘的文件中

### RDB

默认的持久化方式,不需要配置,默认就是使用这种机制

​	在一定的间隔时间中检测,key的变化情况,然后持久化的数据

~~~
编辑redis.windows.conf 配置文件

save 900 1
	#在900s内修改过至少1条key 则保存数据
save 300 10
	#在300s内修改过至少10条key 则保存数据
save 60 10000
	#在60s内修改过至少10000条key 则保存数据
~~~

配置完成后重新启动redis服务器,并指定配置文件名称

使用cmd 命令窗口指定配置文件

~~~
redis-server.exe redis.windows.conf
~~~

持久化保存的数据,会在redis目录下生成一个rdb的文件

### AOF

日志记录的方式,可以记录每一条命令的操作,可以每一次命令后持久化数据

~~~
编辑redis.windows.conf文件

appendonly no
	no:代表关闭AOF,
	yes:开启AOF

# appendfsync always
	每次命令偶读持久化数据
appendfsync everysec
	每间隔1s持久化数据
# appendfsync no
	不进行持久化
~~~

配置完成后,重启redis服务器,

使用cmd启动

~~~
redis-server.exe redis.windows.conf
~~~

## 存储指定过期时间

~~~
jedis.setex("键的名称",时间/s,"值")
~~~

经过指定时间后过期