

## 引入pom

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>io.minio</groupId>
        <artifactId>minio</artifactId>
        <version>8.4.3</version>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-configuration-processor</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

其中`spring-boot-configuration-processor` 是为了在`yml` 中配置minio客户端信息时进行提示,可以不引入

## 配置

读取yml配置类

```java
@Data
@Component
@ConfigurationProperties(prefix = "minio")
public class MinioPropertiesConfig {

    /**
     * 端点
     */
    private String endpoint;
    /**
     * 用户名
     */
    private String accessKey;
    /**
     * 密码
     */
    private String secretKey;

    /**
     * 桶名称
     */
    private String bucketName;
}
```

### yml配置

```yaml
minio:
  accessKey: root
  secretKey: 12345678
  bucket-name: test
  endpoint: http://192.168.134.130:9000
spring:
  # 配置文件上传大小限制
  servlet:
    multipart:
      max-file-size: 100MB
      max-request-size: 100MB

```

### minio 客户端配置

```java
@Configuration
public class MinioConfig {
    @Autowired
    private MinioPropertiesConfig minioPropertiesConfig;
    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(minioPropertiesConfig.getEndpoint())
                .credentials(minioPropertiesConfig.getAccessKey(), minioPropertiesConfig.getSecretKey())
                .build();
    }
}
```

## 使用

### 上传

```java
@Autowired
MinioClient client;

@PostMapping("/upload")
public String upload(MultipartFile file){
        // 上传文件
     ObjectWriteResponse test = client.putObject(PutObjectArgs.builder()
              // 上传的桶名称
             .bucket("test")
              // 文件名称
             .object(System.currentTimeMillis() + "." + file.getOriginalFilename().split("[.]")[1])
              // 文件的类型
             .contentType(file.getContentType())
              // 文件的流
             .stream(file.getInputStream(), file.getSize(), -1)
             .build());
}
```

### 分享链接



### 永久链接



### 下载



### 分片上传

