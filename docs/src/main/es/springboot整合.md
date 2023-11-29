---
title: elasticsearch与spring-boot整合(一)
tags:
  - elasticsearch
categories: elasticsearch
abbrlink: ce8fdb64
---

## 首先导入依赖
学了es 当然要用Java来进行操作,这里用原始api方式介绍es的增删改查,方便查阅
<!--more-->
```xml
<!--处理json-->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.75</version>
</dependency>

<!--引入es的坐标-->
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-high-level-client</artifactId>
    <version>7.6.2</version>
</dependency>
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-client</artifactId>
    <version>7.6.2</version>
</dependency>
<dependency>
    <groupId>org.elasticsearch</groupId>
    <artifactId>elasticsearch</artifactId>
    <version>7.6.2</version>
</dependency>
```

### 连接

```java
RestHighLevelClient client = new RestHighLevelClient(
                RestClient.builder(
                        new HttpHost("192.168.134.99", 9200, "http")));
```

> 后续都会使用这个 `client` 对象 我就不再重复写这个连接代码了
>
> 

### 创建索引

```java
// 索引对象
IndicesClient indices = client.indices();

// 创建
CreateIndexRequest createIndexRequest = new CreateIndexRequest("user2");//索引名称
CreateIndexResponse indexResponse = indices.create(createIndexRequest, RequestOptions.DEFAULT);
System.out.println(indexResponse);
```

### 查询索引

```java
// 索引对象
IndicesClient indices = client.indices();
GetIndexRequest user2 = new GetIndexRequest("user2");
// 查询
GetIndexResponse response = indices.get(user2, RequestOptions.DEFAULT);
Map<String, MappingMetaData> mappings = response.getMappings();
Set<String> strings = mappings.keySet();
for (String string : strings) {
    System.out.println(string);
}
```

### 删除索引

```java
// 索引对象
IndicesClient indices = client.indices();

DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest("user2");
AcknowledgedResponse response = indices.delete(deleteIndexRequest, RequestOptions.DEFAULT);

System.out.println(response);
```

### 添加数据

**第一种**

```java
// 索引对象   index() 表示单个的   indices()表示多个的
HashMap<String, Object> map = new HashMap<>();
map.put("name","zs");
map.put("age",18);
map.put("hobby","打游戏");


IndexRequest indexRequest = new IndexRequest("user2");
indexRequest.id("1").source(map); // 不指定id 会自动生成一个
//添加索引
IndexResponse response = client.index(indexRequest,RequestOptions.DEFAULT);

System.out.println(response.getIndex());
```

**第二种**

```java
User ls = new User(2, "ls");
String string = JSON.toJSONString(ls);

IndexRequest indexRequest = new IndexRequest("user2");
indexRequest.id(ls.getId().toString()).source(string, XContentType.JSON);
//添加索引
IndexResponse response = client.index(indexRequest,RequestOptions.DEFAULT);

System.out.println(response);
```

### 查询数据

```java
GetRequest getRequest = new GetRequest("user2","1");  // 第一个参数是索引.第二个是 id
GetResponse response = client.get(getRequest, RequestOptions.DEFAULT);
System.out.println(response);
```

### 删除数据

```java
// 索引对象   index() 表示单个的   indices()表示多个的
DeleteRequest deleteRequest = new DeleteRequest("user2","1");
DeleteResponse response = client.delete(deleteRequest, RequestOptions.DEFAULT);
System.out.println(response);
```

### 批量操作

```java
// 创建一个批量操作的对象
BulkRequest bulkRequest = new BulkRequest();

// 添加
HashMap<String, Object> map = new HashMap<>();
map.put("age",19);
map.put("name","张腾飞");
IndexRequest indexRequest = new IndexRequest("user3");
indexRequest.id("2000").source(map);
// 将批量操作添加进bulk 中

bulkRequest.add(indexRequest);

// 删除
DeleteRequest deleteRequest = new DeleteRequest("user3", "aIA_ynoBezhp7d7BHC6a"); // 第一个参数是索引,第二个是要删除的id
// 将批量操作添加进bulk 中
bulkRequest.add(deleteRequest);

BulkResponse response = client.bulk(bulkRequest, RequestOptions.DEFAULT);
System.out.println(response);
```

> 一般导入数据用

### matchAll

```java
SearchRequest searchRequest = new SearchRequest("sku");

// 条件构造器
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();

QueryBuilder queryBuilder = QueryBuilders.matchAllQuery();
searchSourceBuilder.query(queryBuilder);

// 添加查询前的条件构造器
searchRequest.source(searchSourceBuilder);

SearchResponse searchResponse = client.search(searchRequest,RequestOptions.DEFAULT);

// 命中的对象
SearchHits hits = searchResponse.getHits();
System.out.println(hits.getTotalHits());

ArrayList<SkuEs> list = new ArrayList<>();
SearchHit[] searchHits = hits.getHits();
for (SearchHit searchHit : searchHits) {
    String asString = searchHit.getSourceAsString();

    SkuEs skuEs = JSON.parseObject(asString, SkuEs.class);
    list.add(skuEs);
}

System.out.println(list.size());
```

### trem 查询

其实和上面`matchAll` 查询差不多

只是修改一个对象

```java
// 不会分词, 用于查询keyword 字段更合适
SearchRequest searchRequest = new SearchRequest("sku");

// 条件构造器
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();

QueryBuilder queryBuilder = QueryBuilders.termQuery("title","华为");
searchSourceBuilder.query(queryBuilder);

// 添加查询前的条件构造器
searchRequest.source(searchSourceBuilder);

SearchResponse searchResponse = client.search(searchRequest,RequestOptions.DEFAULT);

// 命中的对象
SearchHits hits = searchResponse.getHits();
System.out.println(hits.getTotalHits());

ArrayList<SkuEs> list = new ArrayList<>();
SearchHit[] searchHits = hits.getHits();
for (SearchHit searchHit : searchHits) {
    String asString = searchHit.getSourceAsString();

    SkuEs skuEs = JSON.parseObject(asString, SkuEs.class);
    list.add(skuEs);
}

System.out.println(list.size());
```

### queryString 查询

```java
SearchRequest searchRequest = new SearchRequest();

// 条件构造器
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();

QueryBuilder queryBuilder = QueryBuilders.queryStringQuery("华为 AND 白色").field("title").field("ownSpec.机身颜色.keyword");
searchSourceBuilder.query(queryBuilder);

searchRequest.source(searchSourceBuilder);

SearchResponse searchResponse = client.search(searchRequest,RequestOptions.DEFAULT);


SearchHits hits = searchResponse.getHits();
SearchHit[] searchHits = hits.getHits();
System.out.println(searchHits.length);
```

### bool 查询

```java
SearchRequest searchRequest = new SearchRequest();

SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();

BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery();

// 拼接条件
TermQueryBuilder termQueryBuilder1 = QueryBuilders.termQuery("ownSpec.机身颜色.keyword", "白色");
MatchQueryBuilder queryBuilder1 = QueryBuilders.matchQuery("title", "华为");
queryBuilder.must(termQueryBuilder1).must(queryBuilder1);


searchSourceBuilder.query(queryBuilder);

searchRequest.source(searchSourceBuilder);

SearchResponse searchResponse = client.search(searchRequest,RequestOptions.DEFAULT);
SearchHit[] hits = searchResponse.getHits().getHits();
System.out.println(hits.length);
```

基本这几种查询都是差不多这种结构,只有中间不同

### 聚合查询

```json
SearchRequest searchRequest = new SearchRequest();


SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();

BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery();


TermQueryBuilder termQueryBuilder1 = QueryBuilders.termQuery("ownSpec.机身颜色.keyword", "白色");
MatchQueryBuilder queryBuilder1 = QueryBuilders.matchQuery("title", "华为");

queryBuilder.must(termQueryBuilder1).must(queryBuilder1);


// 聚合查询 关键代码
MinAggregationBuilder min_price = AggregationBuilders.min("min_price").field("price");
searchSourceBuilder.aggregation(min_price);



searchSourceBuilder.query(queryBuilder);

searchRequest.source(searchSourceBuilder);

SearchResponse searchResponse = client.search(searchRequest,RequestOptions.DEFAULT);
SearchHit[] hits = searchResponse.getHits().getHits();
System.out.println(hits.length);
// 最后打印下  最后这个取值不是很懂
Aggregations aggregations = searchResponse.getAggregations();
Map<String, Aggregation> asMap = aggregations.asMap();
Min min = (Min) asMap.get("min_price");
System.out.println(min.getValue());
```

