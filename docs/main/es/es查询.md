



## 聚合桶分页

```elm
GET /interface_indicator/_search
{
  "aggs": {
   "url":{
     "cardinality": {
       "field": "url"
     }
   },
   "count": {
     "terms": {
       "field": "url",
       "size": 10
     },
     "aggs": {
       "userCount": {
         "cardinality": { # cardinality 表示统计不同值数据
           "field": "userID"
         }
       },
       "pageCount":{
         "cardinality": {
           "field": "pageUrl"
         }
       },
       "avg":{
         "avg": {
           "field": "duration"
         }
       },
       "va":{
         "bucket_sort": {
           "from": 0,
           "size": 100
         }
       }
     }
     
   }
 }, 
  "size": 0 # 表示只查询聚合数据
}
```



## sql

```elm
GET _sql?format=txt
{
  "query": """
  SELECT pageUrl ,count(pageUrl)as pageUrlCount ,
  avg(value) ,(select count(userID) FROM "basic_indicator" ) AS S
  FROM "basic_indicator" 
  where appId='b2FdF9cb-1EE7-Dc6e-de9C-1cAcf37dcdd5' and mainType=2 and subType=2002
  group by pageUrl,userID  order by pageUrlCount desc 
  
  """
}
```

