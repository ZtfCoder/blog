---
title: docker入门
tags:
  - 容器
categories: docker
abbrlink: 91b3bcfd
---

# docker

首先卸载旧版本

```shell
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

<!--more-->

## 安装基本环境

```shell
yum install -y yum-utils
```

```shell
 # 默认使用 国外仓库,速度特别慢
 yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

 # 换成阿里云镜像
yum-config-manager \
    --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

```shell
# 更新yum索引
yum makecache fast
# 安装docker 引擎
sudo yum install docker-ce docker-ce-cli containerd.io
# 安装完成后,启动,docker 服务,不然,无法使用
systemctl start docker
```

> 使用 docker version 可以查看 docker 的一个版本信息,检测是否安装成功

启动 docker

```shell
docker run hello-world
```

<img src="https://images.wupeiyao.top/notes/20210324223138.png" alt="image-20210107163510045" style="zoom:67%;" />

如果启动成功 hello word 会出现上面的信息

查看 docker 镜像包

```shell
[root@localhost ~]# docker images
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
hello-world   latest    bf756fb1ae65   12 months ago   13.3kB
```

## 卸载 docker

> 卸载 Docker 引擎、CLI 和 Containerd 包 依赖环境

```shell
yum remove docker-ce docker-ce-cli containerd.io
```

> 删除 资源

```shell
rm -rf /var/lib/docker
```

## docker 运行流程

```
graph LR

A[方形] -->B(圆角)

    B --> C{条件a}

    C -->|a=1| D[结果1]

    C -->|a=2| E[结果2]

    F[横向流程图]
```

```
st=>start: 下载镜像
on=>operation: content
cn=>condition: sure?
a=>end: end

st->on->a->cn
```

## docker 命令

### **帮助命令**

```shell
# 可以查看docker 的所有命令
docker --help

# 查看docker 镜像的详细信息
docker images

# 中间加上具体查看的东西,可以查看某个命令的参数
docker images --help

[root@localhost ~]# docker images -a
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
hello-world   latest    bf756fb1ae65   12 months ago   13.3kB

# REPOSITORY 仓库
# MAGE ID 镜像id
# CREATED 创建时间
# SIZE 镜像的大小

```

### **更换镜像源**

参考 https://cr.console.aliyun.com/cn-zhangjiakou/instances/mirrors

阿里云

<img src="https://images.wupeiyao.top/notes/20210324223250.png" alt="image-20210108084007837" style="zoom: 50%;" />

配置 镜像加速器,这样下载镜像才会更快

### **下载命令镜像**

```shell
# mysql后面可以添加版本号,如果不加,默认下载最新版本
[root@localhost ~]# docker pull mysql
Using default tag: latest  # 默认使用最后一个分支,即最新版本
latest: Pulling from library/mysql
6ec7b7d162b2: Downloading  1.392MB/27.1MB
fedd960d3481: Download complete
7ab947313861: Download complete
64f92f19e638: Download complete
3e80b17bff96: Download complete
014e976799f9: Download complete
59ae84fee1b3: Download complete
ffe10de703ea: Download complete
657af6d90c83: Downloading  27.42MB/112.8MB
98bfb480322c: Download complete
6aa3859c4789: Download complete
1ed875d851ef: Download complete



```

### **删除镜像**

```shell
# 删除镜像!
docker rmi

# 删除指定id的镜像
docker rmi 指定id
```

安装一个`centos`镜像

```shell
docker pull centos
```

### **新建容器并启动**

```shell
docker run[可变参数] image

# 参数说明
--name="Name"  容器的名字,用来区分不同的容器
-d 				以后台方式运行
-it				使用交互模式运行,进入容器查看内容
-p				指定容器的端口 -p 8080:8080
	-p ip:主机端口:容器端口
	-p 主机端口:容器端口 (常用)
	-p 容器端口
-p 				随机指定端口

```

> 运行 centos 容器,相当于,拥有的 centos 环境

![image-20210108141209978](https://images.wupeiyao.top/notes/20210324223303.png)

<!--但是,系统里的命令不是很全,不完整-->

### 运行已存在容器

```shell
docker start 镜像id
```

### **退出容器**

```shell
exit  # 直接退出容器,并停止
ctrl+p+q  # 退出容器,不停止容器
```

### 查看正在运行的容器

```shell
docker ps
```

### 查看全部容器

```shell
docker ps -a
```

### 删除容器

```shell
docker rm 容器id   # 删除指定的容器

docker rm -f      # 删除所有的容器
```

### 启动和停止容器的操作

```shell
docker start 容器id    # 启动容器
docker restart 容器id  # 重启容器
docker stop 容器id	 # 停止当前正在运行的容器
docker kill 容器id	 # 强制停止容器
```

> 启动时的一些坑:docker 容器,后台启动后,必须要有一个前台进程,docker 发现没有应用则会,杀掉容器

### 查看日志

```shell
docker logs -f -t --tail
```

### 查看容器中的进程信息

```shell
dokcer top 容器id
```

查看 容器的元数据

```shell
docker inspect
[root@localhost ~]# docker inspect 300e315adb2f
[
    {
        "Id": "sha256:300e315adb2f96afe5f0b2780b87f28ae95231fe3bdd1e16b9ba606307728f55",
        "RepoTags": [
            "centos:latest"
        ],
        "RepoDigests": [
            "centos@sha256:5528e8b1b1719d34604c87e11dcd1c0a20bedf46e83b5632cdeac91b8c04efc1"
        ],
        "Parent": "",
        "Comment": "",
        "Created": "2020-12-08T00:22:53.076477777Z",
        "Container": "395e0bfa7301f73bc994efe15099ea56b8836c608dd32614ac5ae279976d33e4",
        "ContainerConfig": {
            "Hostname": "395e0bfa7301",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
            ],
            "Cmd": [
                "/bin/sh",
                "-c",
                "#(nop) ",
                "CMD [\"/bin/bash\"]"
            ],
            "Image": "sha256:6de05bdfbf9a9d403458d10de9e088b6d93d971dd5d48d18b4b6758f4554f451",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": null,
            "OnBuild": null,
            "Labels": {
                "org.label-schema.build-date": "20201204",
                "org.label-schema.license": "GPLv2",
                "org.label-schema.name": "CentOS Base Image",
                "org.label-schema.schema-version": "1.0",
                "org.label-schema.vendor": "CentOS"
            }
        },
        "DockerVersion": "19.03.12",
        "Author": "",
        "Config": {
            "Hostname": "",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
            ],
            "Cmd": [
                "/bin/bash"
            ],
            "Image": "sha256:6de05bdfbf9a9d403458d10de9e088b6d93d971dd5d48d18b4b6758f4554f451",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": null,
            "OnBuild": null,
            "Labels": {
                "org.label-schema.build-date": "20201204",
                "org.label-schema.license": "GPLv2",
                "org.label-schema.name": "CentOS Base Image",
                "org.label-schema.schema-version": "1.0",
                "org.label-schema.vendor": "CentOS"
            }
        },
        "Architecture": "amd64",
        "Os": "linux",
        "Size": 209348104,
        "VirtualSize": 209348104,
        "GraphDriver": {
            "Data": {
                "MergedDir": "/var/lib/docker/overlay2/d95ff18581906b92928ee2a9972f3f0eae576847a5e                                                            cc223af24227627f04b9e/merged",
                "UpperDir": "/var/lib/docker/overlay2/d95ff18581906b92928ee2a9972f3f0eae576847a5ec                                                            c223af24227627f04b9e/diff",
                "WorkDir": "/var/lib/docker/overlay2/d95ff18581906b92928ee2a9972f3f0eae576847a5ecc                                                            223af24227627f04b9e/work"
            },
            "Name": "overlay2"
        },
        "RootFS": {
            "Type": "layers",
            "Layers": [
                "sha256:2653d992f4ef2bfd27f94db643815aa567240c37732cae1405ad1c1309ee9859"
            ]
        },
        "Metadata": {
            "LastTagTime": "0001-01-01T00:00:00Z"
        }
    }
]


```

### 进入已经运行的容器

```shell
# 第一种方式
docker exec -it 容器id /bin/bash   # /bin/bash 这个是终端

# 第二种
docker attach 容器id

# 第一种方式,进入容器后,再开启一个新的终端,可以在里面操作(常用)
# 第二种,是进入正在执行的终端,不会启动新的程序

```

### 复制容器里文件到主机

```shell
docker cp 容器id:容器路径 主机目录

[root@localhost ~]# docker cp 7421f5c1e569:home/test.java /home

```

## 实例练习

### nginx

1.首先下载 nginx 镜像,

```shell
# docker pull nginx   # 默认下载最新版本

# 启动镜像
# docker
docker run -d --name nginx01 -p 3344:80 nginx
# 新建了一个容器 名字叫 nginx01 以后台运行的方式运行,使用容器的80端口,主机使用3344端口
# 我们可以通过访问3344 这个端口访问到这个nginx

docker run -it -p 8080:8080 nginx
以前台方式运行 ,主机端口8080,nginx 端口8080

```

### tomcat

> 官方默认的镜像 tomcat 的 webapp 下是没有东西的,东西全部都在 webapps.dist 下

### redis

```shell
docker pull redis
docker run -itd --name redis -p 6379:6379 redis
```

进入客户端连接

```shell
docker exec -it redis名字 redis-cli
```

### mysql

拉取 mysql

```shell
docker pull mysql:5.7
```

用来存放一些文件信息和 mysql 数据

```shell
mkdir -p /home/dockerdata/mysql/conf
mkdir -p /home/dockerdata/mysql/logs
mkdir -p /home/dockerdata/mysql/mysql
```

创建配置文件

```shell
cd /home/dockerdata/mysql/conf/
vi my.cnf
```

```shell
[mysqld]
pid-file	= /var/run/mysqld/mysqld.pid
socket		= /var/run/mysqld/mysqld.sock
datadir		= /var/lib/mysql
symbolic-links=0
character-set-server=utf8
init_connect='SET NAMES utf8'
max_connections = 2000
max_user_connections = 1900
max_connect_errors = 100000
max_allowed_packet = 50M
lower_case_table_names=1
[mysqld]
skip-name-resolve
sql_mode=STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION

```

> character-set-server=utf8
> init_connect='SET NAMES utf8'
>
> 这 2 句是设置 linux 的 mysql 5.7 中文编码问题

启动 mysql

```shell
docker run  -p 3306:3306 --name mysql5.7 -v /home/dockerdata/mysql/conf/my.cnf:/etc/mysql/my.cnf -v /home/dockerdata/mysql/logs:/logs -v /home/dockerdata/mysql/mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=root -d mysql:5.7
```

映射端口 3306 ,默认 root 密码为 root

**注意 相关路径需要自己设置**

### rabbit mq

```shell
docker pull rabbitmq # (镜像未配有控制台)
docker pull rabbitmq:management # (镜像配有控制台)

docker run --name rabbitmq -d -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin  -p 15672:15672 -p 5672:5672 rabbitmq:management
```

fastdfs

```sh
docker run -ti -d --name  trakcer -p 8888:8888 -v ~/fastdfs/tracker_data:/fastdfs/tracker/data --net=host season/fastdfs tracker


docker run -tid --name storage -p 8888:8888 -v ~/fastdfs/storage_data:/fastdfs/storage/data -v ~/fastdfs/store_path:/fastdfs/store_path --net=host -e TRACKER_SERVER:192.168.134.128:22122 -e GROUP_NAME=group1 season/fastdfs storage
```

## 可视化（忘了做啥的了）

```shell
docker run -d -p 8088:9090 \ --restart=always -v /var/run/docker.sock:/var/run/docker.sock --privileged=true portainer/portainer
```

## docker 镜像

### 镜像是什么

镜像是一种轻量级.可执行的独立软件包,用来打包软件的运行

和基于运行环境开发的软件,它包含运行某个软件所需要的所有环境,包括代码,运行时.库.环境变量和配置文件

**如何得到镜像**

- 从远程仓库下载
- 朋友拷贝给你
- 自己制作一个镜像 DockerFile

### docker 镜像加载原理(需要填坑)

> UnionFS (联合文件系统)

我们下载的时候,看到的一层一层的就是这个 联合文件系统

> Docker 镜像加载原理

## 提交镜像

**commit**

```shell
docker commit 提交容器成为一个新的副本

docker commit -m="提交的描述信息" -a="作者" 容器id  目标镜像名

docker commit -m="mytomcat" -a="ztf" 容器id 目标镜像名称:版本
```
