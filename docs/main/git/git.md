---
title: git 使用(待更新)
tags:
  - 版本控制
  - git
categories: git
abbrlink: 703b0fcc
---
# git

git,版本控制,

分为工作区,暂存区,仓库

如果文件没有被git进行管理,是不能回退版本的
<!--more-->




# 操作

## 1.初始化git仓库

在当前文件夹下打开git bash here ,输入命令,初始化仓库

~~~
git init 
~~~

## 2.查看当前git仓库状况

~~~
git status
~~~

## 3.添加文件到暂存区

~~~
git add 文件名

添加所有文件到暂存区
git add --all

git add ./  代表当前目录  *是所有文件,
~~~



## 4.查看git信息

~~~
git config --list
~~~

## 5.提交到仓库

<!--如果没有填写用户名和邮箱,是没办法提交到仓库-->

~~~
git commit 文件名
~~~

<!--提交成功后会显示提交的版本号-->

## 6从暂存区撤销文件

~~~
git rm --cached 文件名
~~~

## 7.查看历史操作

~~~
git reflog
~~~

## 8.回退版本

~~~
git reset --hard 版本号
~~~

## 9.推送到远程仓库

~~~
关联远程仓库
git remote add origin https://gitee.com/zhanggob/test.git

推送远程仓库
git push -u origin master

拉取
~~~

## 10.查看分支

~~~
git bransh
~~~

## 11.创建分支

<!--创建分支是复制当前的状态,复制一个当前的版本-->

<!--各分支间互不影响-->

~~~
git checkout -b 分支名
~~~

## 12.切换分支

~~~
git checkout  分支名
~~~

## 13.合并分支

~~~
首先切换到其他分支
git merge 分支名
~~~

## 14.删除分支

~~~
git branch -d 分支名
~~~







# 注意 事项



~~~
git log --oneline --decorate --graph --all
~~~



可以在本地删除远程已经不存在的分支,清理缓存的作用

```shell
git fetch origin --prune
```

合并分支的注意事项

**如果想要在自己分支跟上别人的分支情况,需要切换到别人的分支**

**选择合并到自己的分支**

**如果是把自己的代码合并到别人的分支上,则需要切换到自己的分支,**

**选择合并到别人的分支上面**
