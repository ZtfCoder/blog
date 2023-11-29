安装地址

[Releases · docker/compose (github.com)](https://github.com/docker/compose/releases)



下载后,移动到 `/user/loacl/bin`

修改名称为 `docker-compose`

目录下,并且给与 权限 

`chmod 777  文件名`



如何使用

es 实战

创建一个文件为 `docker-compose.yml`

```yaml
version: '3'
services:
  elasticsearch:
    image: elasticsearch:7.7.0  #镜像
    container_name: elk_elasticsearch  #定义容器名称
    restart: always  #开机启动，失败也会一直重启
    environment:
      - "cluster.name=elasticsearch" #设置集群名称为elasticsearch
      - "discovery.type=single-node" #以单一节点模式启动
      - "ES_JAVA_OPTS=-Xms256m -Xmx256m" #设置使用jvm内存大小
      
    volumes:
      - ./plugins:/usr/share/elasticsearch/plugins #插件文件挂载
      - ./data:/usr/share/elasticsearch/data #数据文件挂载
    ports:
      - 9200:9200
      - 9300:9300
```

之后,给所用到的文件赋予权限 ,否则无法访问这些文件

在当前目录下执行 容器 `docker-compose up -d`  既可以启动容器



相关命令

```
# 1. 基于docker-compose.yml启动管理的容器
docker-compose up -d

# 2. 关闭并删除容器
docker-compose down

# 3. 开启|关闭|重启已经存在的由docker-compose维护的容器
docker-compose start|stop|restart

# 4. 查看由docker-compose管理的容器
docker-compose ps

# 5. 查看日志
docker-compose logs -f
```

```yaml
version: '3'
services:
  redis:
    image: redis
    container_name: redis_container  
    restart: always 
    ports:
      - 6379:6379


```

```
docker run \
  --rm influxdb:2.1.1 \
  influxd print-config > config.yml
```



 