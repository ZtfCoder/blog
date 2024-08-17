### 简介

npm ,yarn与pnpm

这几个都是js的包管理工具,功能类似于 Java的 maven 工具,用于下载第三方依赖,也可以自己上传到npm 网站上去

### 安装nodejs

使用npm 命令,首先需要安装node js [Node.js 中文网 (nodejs.cn)](http://nodejs.cn/)

 可以选择稳点版本,这样不至于有些库不兼容问题,安装步骤,没什么讲究的,一直下一步,下一步即可

安装完成后,可以打开cmd 命令行 输入 

```shell
node 
```

就可以进入node 的命令行模式了

安装完nodejs 就可以使用npm 下载 第三方包了,例如常用的

`dayjs`  `vue`  `axios` 等库

一般常用的命令有

```shell
#全局安装
npm install xxx库名称 -g
#全局安装后,可以在所有地方使用 该库的命令

#普通安装
npm install xxx库名称
#只会在当前项目目录下安装该库

# 安装当前项目下的全部依赖
npm install

# 卸载库
npm uninstall xxx库名称
```

使用npm 下载可能会很慢,但是最好不要用淘宝镜像,会出现很多奇怪的现象,如果可能请科学上网

### yarn

yarn 又是什么呢

yarn 也是一款包管理工具,功能和npm 一样,但是比npm 更加强大

,除开缓存功能外,我个人觉得使用yarn 安装依赖比用npm 更快

#### 安装yarn

```shell
npm install -g yarn
```

安装包

```shell
# 安装package.json里所有包，并将包及它的所有依赖项保存进yarn.lock
yarn install 

# 添加依赖
yarn add xxx库名称

# 安装到devDependencies 也就是开发环境,打包的时候不会打入文件中
yarn add -D xxx库名称

# 移除包
yarn remove xxx库名称
```

yarn 解决了很多 npm 的问题,例如,版本问题,使用yarn 会生成yarn.lock 的文件,这个文件记录了安装的依赖版本号,

如果是npm 的话,则每次安装依赖都会是最新版本,如果,没有锁定版本功能,那么以后,使用的到的库更新了,那么可能会出现兼容性问题,因此,yarn 很好的解决了这个问题

还有缓存,yarn 会去帮我们缓存已经下载过的库,

```shell
# 查询缓存列表
yarn cache list

# 清除缓存
yarn cache clean
```

除此 npm 是按照队列依次安装每个 package，当前一个 package 安装完成之后，才能继续后面的安装。而 Yarn 是同步执行所有任务。

### pnpm

全称 Performance NPM，即高性能的 npm。相比较于 yarn，pnpm 在性能上又有了极大的提升。

pnpm 的出现解决了 npm、yarn 重复文件过多、复用率低等问题。我们知道，不管是 npm 还是 yarn，它们的安装方法都是将项目依赖包的原封不动的从服务器上下载到本地，写入到 node_modules 文件夹，而每个 package 又都有自己的 node_modules，所以当一个 package 在不同的依赖项中需要时，它会被多次复制粘贴并生成多份文件，形成一个很深的依赖树。

另外，如果同一个 package 在我们本地的多个项目中使用，每次安装的时候它都会被重新下载一次。比如我们本地有 100 个项目，都依赖 lodash，那么使用 npm 或 yarn 进行安装， lodash 很可能就被下载、安装了 100 次，也就是说我们的磁盘中有 100 个地方写入了 lodash 的代码，这种方式是极其低效的。

但目前为止,pnpm 我使用的比较少,目前为止还是觉得yarn 更加使用,pnpm 相较于npm yarn 都太暴力了,所以还是推荐使用yarn 更加合适