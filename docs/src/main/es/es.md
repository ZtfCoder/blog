

es 是一款非常优秀的搜素引擎,有着分词,和聚合 的功能

简单的说就是,把你想要搜索的东西,拆开来;进行匹配,非常只能,通过某种算法

现今数据库的瓶颈就是无法支持分词功能,以及,索引失效等效率问题

es 都完美的解决了这些问题,如今要做搜索功能,肯定少不了es 的使用



## 安装es 

es 有几个概念 比较重要

对应数据库中,数据库有很多库这样的说法,对应es 我们称之索引库

而数据库中表所对应的东西,称之为类型 type

而 每一行的数据 es 称为文档



### docker es安装

```shell
# 下载es镜像
docker pull elasticsearch:5.6.8

# 启动
docker run -di -e ES_JAVA_OPTS="-Xms256m -Xmx256m" --name=legou_es -p 9200:9200 -p 9300:9300 elasticsearch:5.6.8

# 进入容器中
docker exec -it legou_es /bin/bash
```

这里需要在容器内修改配置文件,我们需要安装下`vim`

首先更换镜像源

```shell
mv /etc/apt/sources.list /etc/apt/sources.list.bak


echo "deb http://mirrors.aliyun.com/debian/ buster main non-free contrib">>/etc/apt/sources.list
echo "deb-src http://mirrors.aliyun.com/debian/ buster main non-free contrib">>/etc/apt/sources.list
echo "deb http://mirrors.aliyun.com/debian-security buster/updates main">>/etc/apt/sources.list
echo "deb-src http://mirrors.aliyun.com/debian-security buster/updates main">>/etc/apt/sources.list
echo "deb http://mirrors.aliyun.com/debian/ buster-updates main non-free contrib">>/etc/apt/sources.list
echo "deb-src http://mirrors.aliyun.com/debian/ buster-updates main non-free contrib">>/etc/apt/sources.list
echo "deb http://mirrors.aliyun.com/debian/ buster-backports main non-free contrib">>/etc/apt/sources.list
echo "deb-src http://mirrors.aliyun.com/debian/ buster-backports main non-free contrib">>/etc/apt/sources.list


#更新安装源
apt-get update 

# 下载安装
apt-get install vim
```



修改配置文件

```shell
cd /usr/share/elasticsearch/config
vim elasticsearch.yml 
```

去掉这的注释

````shell
#同时在下面加上集群的配置
cluster.name: my-elasticsearch
#添加跨域的配置
http.cors.enabled: true
http.cors.allow-origin: "*"
network.host: 192.168.134.128
# (这里是宿主机ip地址)
````



```shell
# 修改limits.conf文件
vi /etc/security/limits.conf
# 添加上 下面内容
* soft nofile 65536
* hard nofile 65536
vm.max_map_count=655360

```

退出容器 后执行

```shell
sysctl -p
```





## 安装kb

类似操控mysql 的客户端工具,可以方便我们进行操作

也是采用docker 安装

```shell
docker run -it -d -e ELASTICSEARCH_URL=http://192.168.134.128:9200 --name kibana -p 5601:5601 kibana:5.6.8
```





```json
#  创建索引库
PUT user

# 查询索引库
GET user

# 创建映射 就是说明字段
PUT /user/_mapping
{
  "properties":{
    "name":{
      "type":"text"
    },
    "age":{
      "type":"integer"
    },
    "hobby":{
      "type":"text"
    }
  }
}

# 删除索引库
delete user
```





```json
_# _doc :注意_doc 是现在7默认的一个表
# 添加文档 我们不指定id 它会自动生产
POST /user/_doc
{
  "name":"ls",
  "age":123,
  "hobby":"打球"
}

# 添加文档 指定id
POST /user/_doc/1111
{
  "name":"ls",
  "age":123,
  "hobby":"打球"
}
# 查看文档
GET /user/_search

# 删除一条文档
DELETE /user/_doc/1111
```





## 分词器

分词器,可以使我们需要搜索的关键词进行拆分,以达到更多搜索可能性

这里使用的ik 分词器 去github 下载

[分词器GitHub地址](https://github.com/medcl/elasticsearch-analysis-ik/releases)

> 注意es 版本要和ik版本对应

然后解压成文件夹,重命名为ik,上传到服务器上

```shell
# 执行拷贝操作
docker cp ./ik legou_es:/usr/share/elasticsearch/plugins
```

```json
# 默认分词器
GET _analyze
{
  "text": ["中国华为"]
}

# 自定义分词器 第一种模式
GET _analyze
{
  "analyzer":"ik_smart",
  "text": ["中国华为"]
}

# 第二种模式
GET _analyze
{
  "analyzer":"ik_max_word",
  "text": ["中国华为"]
}


# 给映射添加分词器  这里的1 指的是生产id为1的数据
POST user/_mapping
{
  "properties":{
    "name":{
      "type":"text",
        "analyzer":"ik_max_word"
    },
    "age":{
      "type":"integer"
    },
    "hobby":{
      "type":"text"
    }
  }
}
# text 支持分词 不支持聚合,keyword 不支持分词,支持聚合
```







```json
# 查询指定索引库
GET /user/_search

# 结果
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "user",
        "_type" : "_doc",
        "_id" : "h03CyXoBo4E9mEyze1Xb",
        "_score" : 1.0,
        "_source" : {
          "name" : "zs",
          "age" : "18",
          "hobby" : "打球"
        }
      },
      {
        "_index" : "user",
        "_type" : "_doc",
        "_id" : "iE3EyXoBo4E9mEyzvVVZ",
        "_score" : 1.0,
        "_source" : {
          "name" : "ls",
          "age" : 123,
          "hobby" : "打球"
        }
      }
    ]
  }
}




# 这个不会查询全部数据
GET sku/_search

GET sku/_search
{
  "query": {
    "match_all": {
      
    }
  },
  "from": 0,
  "size": 120
}
```

> **hits** 表示 命中的数据  下面的数组表示每一条数据
>
> 其中,
>
> _index 表示当前的索引库
>
> _type 表示 文档
>
> _id 表示id
>
> _score 表示分数
>
> _score 表示资源,也就是每一行的数据类似

```json
GET _cat/indices
# 可以查看索引库的状态
```

## match 查询

这个查询可以进行分词, 

```json
GET sku1/_search
{
  "query": {
    "match": {
      "title": "华为手机"
    }
  },
  "from": 0,
  "size": 120
}
```

> 注意.如果不添加上分页条件的话.是不会进行分页的 
>
> from  开始的页数
>
> size 条数

## term 查询

term  查询不会进行分词

```json
GET sku1/_search
{
  "query": {
    "term": {
      "title": {
        "value": "华为"
      }
    }
  }
}
```

## 模糊查询

### **wildcard**   

```json
GET sku1/_search
{
  "query": {
    "wildcard": {
      "title": {
        "value": "华?"
      }
    }
  }
}
```

和`mysql` 一样使用通配符  `?` 代表一个字符  `*` 任意个字符

> **wildcard**   会对查询的条件进行分词
>
> 注意: 查询条件最左边使用通配符效率很会低 慎用

### prefix

前缀查询  最好用在`keyword` 上

```json
GET sku1/_search
{
  "query": {
    "prefix": {
      "title": {
        "value": "华为"
      }
    }
  }
}
```

## 范围查询

```json
GET sku1/_search
{
  "query": {
    "range": {
      "price": {
        "gte": 10,
        "lte": 200000
      }
    }
  }
}
```

> gt 大于  lt 小于

## 排序查询

```json
GET sku1/_search
{
  "query": {
    "range": {
      "price": {
        "gte": 10,
        "lte": 200000
      }
    }
  },
  "sort": [
    {
      "price": {
        "order": "asc"
      }
    }
  ]
}
```

## queryString

> 特征
>
> 可以对查询的条件进行分词,然后将分词后的查询条件和词条进行等值匹配，默认取并集（or）
>
> 以指定多个查询字段
>
> 

### query_string

可以识别查询条件中的 `OR` 和`AND`

### simple_query_string

相反,不会识别 `OR` 和`AND`

```json
# query_string 案例
GET sku1/_search
{
  "query": {
    "query_string": {
      "fields": ["title","ownSpec.机身颜色.keyword"],
      "query": "华为 OR 白色"
    }
  }
}
```

> 注意 ,不会识别小写的or 和and

## 布尔查询

boolQuery：对多个查询条件连接。连接方式：

must（and）：条件必须成立

must_not（not）：条件必须不成立

should（or）：条件可以成立

filter：条件必须成立，性能比must高。不会计算得分

```json
GET sku1/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "title": "华为"
          }
        },
        {
          "match": {
            "ownSpec.机身颜色": "白色"
          }
        }
      ]
    }
  }
}
```

## 聚合查询

```json
GET sku1/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "title": "华为"
          }
        },
        {
          "match": {
            "ownSpec.机身颜色": "白色"
          }
        }
      ]
    }
  },
  "aggs": {
      # min_price 这个是别名
    "min_price":{
      # 最小值 函数
      "min": {
        "field": "price"
      }
    }
  }
}
```

> 分组查询没懂

> 注意查询出来的结果是放在最后
>

```json
{
  "took" : 6,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 5,
      "relation" : "eq"
    },
    "max_score" : 4.1393194,
    "hits" : [
      {
        "_index" : "sku1",
        "_type" : "_doc",
        "_id" : "16292499472",
        "_score" : 4.1393194,
        "_source" : {
          "createTime" : 1524297677000,
          "enable" : 1,
          "id" : 16292499472,
          "images" : "http://image.legou.com/images/4/2/1524297676804.jpg",
          "indexes" : "1_0_0",
          "lastUpdateTime" : 1524297677000,
          "ownSpec" : {
            "机身颜色" : "白色",
            "内存" : "2GB",
            "机身存储" : "16GB"
          },
          "price" : 59900,
          "spuId" : 178,
          "stock" : 99999,
          "title" : "华为（HUAWEI） 荣耀 畅玩6 手机 白色 全网通(2G RAM+16G ROM)标配"
        }
      },
      {
        "_index" : "sku1",
        "_type" : "_doc",
        "_id" : "5305784",
        "_score" : 4.0822973,
        "_source" : {
          "createTime" : 1524297325000,
          "enable" : 1,
          "id" : 5305784,
          "images" : "http://image.legou.com/images/14/7/1524297324600.jpg",
          "indexes" : "1_0_0",
          "lastUpdateTime" : 1524297325000,
          "ownSpec" : {
            "机身颜色" : "白色",
            "内存" : "3GB",
            "机身存储" : "16GB"
          },
          "price" : 69900,
          "spuId" : 8,
          "stock" : 99999,
          "title" : "华为 畅享6 白色 移动4G+版 移动联通电信4G手机 双卡双待"
        }
      },
      {
        "_index" : "sku1",
        "_type" : "_doc",
        "_id" : "16291111802",
        "_score" : 4.0646815,
        "_source" : {
          "createTime" : 1524297511000,
          "enable" : 1,
          "id" : 16291111802,
          "images" : "http://image.legou.com/images/10/5/1524297510771.jpg",
          "indexes" : "1_0_0",
          "lastUpdateTime" : 1524297511000,
          "ownSpec" : {
            "机身颜色" : "白色",
            "内存" : "2GB",
            "机身存储" : "16GB"
          },
          "price" : 59900,
          "spuId" : 98,
          "stock" : 99999,
          "title" : "华为（HUAWEI） 荣耀 畅玩 6 全网通4G手机 双卡双待 白色 （2GB+16GB）标准"
        }
      },
      {
        "_index" : "sku1",
        "_type" : "_doc",
        "_id" : "26009533455",
        "_score" : 4.0313168,
        "_source" : {
          "createTime" : 1524297668000,
          "enable" : 1,
          "id" : 26009533455,
          "images" : "http://image.legou.com/images/0/12/1524297667989.jpg",
          "indexes" : "1_0_0",
          "lastUpdateTime" : 1524297668000,
          "ownSpec" : {
            "机身颜色" : "白色",
            "内存" : "2GB",
            "机身存储" : "16GB"
          },
          "price" : 53500,
          "spuId" : 173,
          "stock" : 99999,
          "title" : "华为（HUAWEI） 荣耀 畅玩6 全网通4G智能手机 双卡双待 2G+16G 白色"
        }
      },
      {
        "_index" : "sku1",
        "_type" : "_doc",
        "_id" : "16336922708",
        "_score" : 3.931058,
        "_source" : {
          "createTime" : 1524297449000,
          "enable" : 1,
          "id" : 16336922708,
          "images" : "http://image.legou.com/images/6/3/1524297449101.jpg",
          "indexes" : "1_0_0",
          "lastUpdateTime" : 1524297449000,
          "ownSpec" : {
            "机身颜色" : "白色",
            "内存" : "2GB",
            "机身存储" : "16GB"
          },
          "price" : 59900,
          "spuId" : 74,
          "stock" : 99999,
          "title" : "华为（HUAWEI） 荣耀 畅玩6 全网通 移动联通电信4G 智能老人手机 双卡双待 白色 (2GB RAM+16GB ROM)"
        }
      }
    ]
  },
    # 
  "aggregations" : {
    "min_price" : {
      "value" : 53500.0
    }
  }
}
```

## 高亮查询

我们在网上百度搜索东西的时候.搜索关键词的时候,搜索页面出来的结果,会对我们搜素的关键字添加样式

达到高亮效果  也就是在关键词上添加css样式

```json
GET sku1/_search
{
  "query": {
    "match": {
      "title": "华为"
    }
  },
  "highlight": {
    "fields": {
      "title": {
        "pre_tags": "<a color='red'>",
        "post_tags": "</a>"
      }
    }
  }
}
```

> pre_tags 前缀标签
>
> post_tags 后缀标签

最后查询出来的结果是

```json
{
    "_index" : "sku1",
    "_type" : "_doc",
    "_id" : "26881279032",
    "_score" : 1.454582,
    "_source" : {
        "createTime" : 1524297436000,
        "enable" : 1,
        "id" : 26881279032,
        "images" : "http://image.legou.com/images/14/7/1524297436217.jpg",
        "indexes" : "2_0_0",
        "lastUpdateTime" : 1524297436000,
        "ownSpec" : {
            "机身颜色" : "极光色",
            "内存" : "6GB",
            "机身存储" : "128GB"
        },
        "price" : 618800,
        "spuId" : 69,
        "stock" : 99999,
        "title" : "华为（HUAWEI） 华为P20pro 手机 极光色 6G+128G"
    },
    "highlight" : {
        "title" : [
            "<a color='red'>华为</a>（HUAWEI） <a color='red'>华为</a>P20pro 手机 极光色 6G+128G"
        ]
    }
},
```

