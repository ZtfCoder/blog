---
title: linux计划任务
tags:
  - 定时任务
  - linux
categories: linux
abbrlink: 265b827b
---
corn守护进程，时在后台运行的，每分钟检测一次是否时计划任务要执行

## 基本格式

分 时 日 月 周 命令
<!--more-->
分，代表分钟1~59，当为时，代表每分钟都要执行；为/n表示每n分钟执行一次；为a-b表示从第a分钟 到第b分钟这段时间要执行；为a,b,c,...表示第a,b,c分钟要执行

其他的类似

时，的区间为 0~23

日，的区间为 1~31 

日，的区间为 1~12

周，的区间为 0~6  		0为星期天

## 添加定时任务

输入 crontab -l

再最后一行输入你要添加的任务



 ps aux | grep cron

查看守护进场是否启动

## 删除定时任务

crontab -r

删除所有用户下的定时任务
