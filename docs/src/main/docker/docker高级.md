---
title: docker高级(待更新)
tags:
  - 容器
categories: docker
abbrlink: d80a603a
---

# 数据卷

docker 是可以把应用和环境打包成一个镜像,的软件,同时,数据也会默认存储到镜像中

这样很不好,数据和环境没有隔离开,如果我们把容器删除掉,那么数据也删除掉了

因此,我们需要一种技术,将 docker 容器和我们的电脑联通,让双方可以互相访问到对象的数据,因此,数据卷技术产生了

<!--more-->

类似挂载,可以把 容器内的文件或者目录挂载到我们的电脑上

```shell
docker run  -it -v /home/ceshi:/home centos /bin/bash
				   # 主机目录   :容器目录  容器名称 /bin/bash
```

挂载后使用 在主机输入命令

```shell
docker inspect 容器id
如果看到
"Mounts": [
            {
                "Type": "bind",
                "Source": "/home/ceshi",
                "Destination": "/home",
                "Mode": "",
                "RW": true,
                "Propagation": "rprivate"
            }
# 说明挂载成功
```

## 安装 mysql

```shell
docker run -d -p 3310:3306 -v  /home/mysql/conf:/etc/mysql/conf.d -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=root --name mysql01 mysql:5.7

# 说明
# -d 后台运行
# -p 主机端口和容器内部端口的映射
# -v 外部挂载数据卷 文件映射 可以映射多个,写多个-v就行
# -e 进行配置 MYSQL_ROOT_PASSWORD=root 设置密码为root
# --name 镜像名称


使用了挂载之后,这样,哪怕删除了docker 镜像后,这个数据文件也会存在,
```

## 文件复制

从宿主 将文件移到到容器中

```shell
从宿主机复制到容器：docker cp 宿主机本地路径 容器名字/ID：容器路径
docker cp /root/123.txt mycentos:/home/
从容器复制到宿主机：docker cp 容器名字/ID：容器路径 宿主机本地路径
docker cp mycentos:/home/456.txt /root
宿主机文件夹挂载到容器里：docker run -id -v 宿主机路径:容器路径 镜像ID
docker run -id -v /root/yjf/:/home centos:7
```

## 具名挂载和匿名挂载

(需填坑)

# DockerFile

```shell
定义父镜像：FROM centos:7
定义作者信息：MAINTAINER  yjf
执行安装vim命令： RUN yum install -y vim
定义默认的工作目录：WORKDIR /usr
定义容器启动执行的命令：CMD /bin/bash
通过dockerfile构建镜像：docker build –f dockerfile文件路径 –t 镜像名称:版本 .

# 注意 build 最后一定要有个点
```

# Docker 网络

(需填坑)

# 私有仓库

## 一、搭建私有仓库

```shell
1、拉取私有仓库镜像
docker pull registry
2、启动私有仓库容器
docker run -id --name=registry -p 5000:5000 registry
3、打开浏览器 输入地址:http://私有仓库服务器ip:5000/v2/_catalog，看到{"repositories":[]} 表示私有仓库 搭建成功
例如：
http://192.168.65.133:5000/v2/_catalog
4、修改daemon.json 此步用于让 docker 信任私有仓库地
vim /etc/docker/daemon.json    
{"insecure-registries":["私有仓库服务器ip:5000"]}
我这里的配置是
{
  "registry-mirrors": ["https://你自己阿里云账号生成的id.mirror.aliyuncs.com"],
  "insecure-registries":["192.168.65.133:5000"]
}
5、重启docker 服务
systemctl restart docker
docker start registry
```

## 二、将镜像上传到私有仓库

```
1.给需要上传的镜像重命名（打标签，注意，标签名称要带上私有仓库的ip地址和端口号，因为默认情况下上传到的是中央仓库）
例如
docker tag centos:7 私有仓库服务器IP:5000/centos:7
2.上传重命名后的镜像
docker push 私有仓库服务器IP:5000/centos:7
3.上传之后查看是否成功
http://私服的ip:5000/v2/_catalog
4.查看镜像的tag
http://私服的ip:5000/v2/centos/tags/list
```

## 三、从私有仓库拉取镜像

```
docker pull 私服的ip:5000/centos:7
```
