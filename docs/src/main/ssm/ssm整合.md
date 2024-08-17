---
title: spring ssm整合
tags:
  - java
  - spring
categories: ssm
abbrlink: 1e8f5006
---

# SSM整合

## mybatis 与spring springmvc整合

~~~
讲mybatis-config.xml中配置数据源,配置在spring文件中
~~~
<!-- more -->
~~~xml
<!--配置数据源对象 -->
    <!--读取连接信息配置文件 -->
    <context:property-placeholder location="classpath:dp.properties"  />
	<!--读取配置文件 spring 整合mybatis -->
    <bean id="druid" class="com.alibaba.druid.pool.DruidDataSource" >
        <property name="driverClassName" value="${jdbc.driver}"/>
        <property name="url" value="${jdbc.url}"/>
        <property name="username" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>
    </bean>
    <!--sessionFactory 工厂-->
    <bean id="sessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="druid"/>
        <!--添加mybatis 配置文件-->
        <property name="configLocation" value="classpath:mybatis-config-spring.xml"/>
        <!--添加mapping文件导入-->
        <property name="mapperLocations" value="classpath:mybatis-mapping/AccountMapping.xml"/>
    </bean>

    <!--mybatis 包扫描-->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="top.wupeiyao.dao"/>
        <!-- 这里扫描的包指的动态代理的接口-->
    </bean>
~~~

## 事务

~~~xml
    <!--事务管理器-->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="druid"/>
    </bean>

    <!--配置事务增强-->
    <tx:advice id="interceptor">
        <tx:attributes>
            <tx:method name="*"/>
        </tx:attributes>
    </tx:advice>


    <aop:config>
        <aop:advisor advice-ref="interceptor" pointcut="execution(* top.wupeiyao.service.imp.*.*(..))"/>
    </aop:config>
~~~

