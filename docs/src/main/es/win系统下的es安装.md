# 踩坑目录

当前使用的版本的是`elasticsearch-8.3.2` `kibana-8.3.2` ` win11`

## elasticsearch

### jvm 调整

在 `config/jvm.options` 中

```
-Xms256m
-Xmx256m
-Dfile.encoding=GBK
```

### 调整安全策略

由于 8.0 之后,需要验证登录之类的,在本地开发非常繁琐,因此在 Enable security features 下面

将配置全部改成 false

### 跨域

在文件最后添加上,跨域配置

```
http.cors.enabled: true
http.cors.allow-origin: "*"

ingest.geoip.downloader.enabled: false
```

## kibana

在 `config/kibana.yml` 中修改 service 名称

```
# The Kibana server's name. This is used for display purposes.
server.name: "ztf"
```

名称随便取一个

### 中文开启

```
i18n.locale: "zh-CN"
```
