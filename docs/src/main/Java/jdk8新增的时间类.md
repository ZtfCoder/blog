jdk 自带的时间类 Date 并不好用,无法支持对时间的操作,增加天数,月数,等等操作

jdk 8 新增了 几个操作时间和日期的类的

### LocalDate

LocalDate类实例是一个不可变对象(每次调用修改的方法后会返回新的对象,原对象信息不变)，只包含日期，不含有时间信息，也不带时区信息

**快速使用**

```java
// 获取今天的日期
LocalDate now = LocalDate.now();

//添加一天
LocalDate date = now.plus(1, ChronoUnit.DAYS);

// 添加一个月
 LocalDate date = now.plus(1, ChronoUnit.MONTHS);


// 构建一个日期  2022-11-11
LocalDate of = LocalDate.of(2022, 11, 11);

// 判断当前时间是否在 of 时间之后
boolean nowAfter = now.isAfter(of);
// 判断当前时间是否在 of 时间之前
boolean nowBefore = now.isBefore(of);
```

**ChronoUnit  是一个时间的枚举类,里面包含 秒,分,小时,天,月,年,等单位**

**使用plus 方法需要加上你需要添加的日期的单位**





### LocalTime

LocalTime只包含时间信息(`00:02:10`)，不包含日期信息

```java
//获取当前的时间
LocalTime localTime = LocalTime.now();

//根据一个字符串转换成 LocalTime 对象
LocalTime parse = LocalTime.parse("12:23:20");

// 当前时间加上 10秒
LocalTime time = localTime.plus(10, ChronoUnit.SECONDS);
```

LocalTime 对象 也包含  LocalDate 常见的时间操作方法, plus,isAfter 等等

### LocalDateTime

LocalDate和LocalTime的结合体，既有时间信息，又有日期信息

```java
//获取当前的时间
LocalDateTime now = LocalDateTime.now();
// 当前日期加上1年
LocalDateTime time = now.plus(1, ChronoUnit.YEARS);
```





如果要将上面的时间和日期类转成我们常见的字符串 格式 需要使用格式化操作

```java
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
String format = now.format(formatter);
System.out.println(format);
```

这样就能得到 我们常见的 `yyyy-MM-dd HH:mm:ss` 这种格式

这几个类 拥有的对时间和日期操作的方法基本上相同,用法也是一致的

最后这些时间类的相互转换

```java
//Date转LocalDateTime
Date date = new Date();
LocalDateTime time1 = LocalDateTime.ofInstant(date.toInstant(), ZoneOffset.of("+8"));

//Date转LocalDate
LocalDate date1 = LocalDateTime.ofInstant(date.toInstant(),ZoneOffset.of("+8")).toLocalDate();

//LocalDateTime转Date
LocalDateTime localDateTime3 = LocalDateTime.now();
Instant instant3 = localDateTime3.atZone(ZoneId.systemDefault()).toInstant();
Date date3 = Date.from(instant3);

```







