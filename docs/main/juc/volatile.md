

首先看一段代码

```java
public class JucTest {
    static boolean flag = true;
    public static void main(String[] args) throws InterruptedException {
        new Thread(()->{
            System.out.println(Thread.currentThread().getName()+" is running");
            while (flag);
            System.out.println(Thread.currentThread().getName()+" is end");
        }).start();
        Thread.sleep(1000);
        flag = false;
        Thread.sleep(5000);
        System.out.println(flag);
        System.out.println(Thread.currentThread().getName()+" is end");
    }
}
```

上述代码 创建了一个线程,在线程里进行死循环如果`flag ==true`

在主线程中,进行休眠1s后,将flag =false,再休眠5s

按照客观逻辑,理论上,子线程判断到flag 变为了false 后会停止,随即打印 结束语句

实践上运行结果为

```shell
Thread-0 is running
false
main is end
```

