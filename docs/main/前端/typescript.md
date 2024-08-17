# typescript 类型工具

## Omit (去除类型)

可以剔除指定的类型,生成一个新类型

例如

```typescript
interface  User{
    pic:string;
    id:number;
}
Omit<User,"id">  会去除id 这个属性,从而变成
interface User{
    pic:string;
}
也可以写多个
Omit<User,"id","pic">
```

> 原理解读
>
> ```typescript
> type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
> ```

注意:无法适用于联合类型

## Pick(筛选类型)

从指定的类型中筛选出想要的属性类型,从而生成一个新的类型

```typescript
interface  User{
    pic:string;
    id:number;
    age:number;
}

Pick<User,"age","pic"> 此时就会生成一个新类型
interface  User{
    pic:string;
    age:number;
}

```

> 原理解读
>
> ```typescript
> type Pick<T, K extends keyof T> = {
>     [P in K]: T[P];
> };
> ```

## Partial(变成可选)

把一个对象类型的属性,全部变成可选

```typescript
interface  User{
    pic:string;
    id:number;
    age:number;
}


Partial<User> 此时就会生成一个新类型
interface  User{
    pic?:string;
    id?:number;
    age?:number;
}


```

> 原理解读
>
> ```typescript
> type Partial<T> = {
>     [P in keyof T]?: T[P];
> };
> ```

## Required(必选) 

```typescript
interface  User{
    pic?:string;
    id?:number;
    age?:number;
}

Required<User>  变成以下类型 ;
interface User{
    pic:string;
    id:number;
    age:number;
}   

```

> 原理解读
>
> ```typescript
> type Required<T> = {
>     [P in keyof T]-?: T[P];
> };
> // -?  的意思是移除可选属性
> ```

## Readonly (转化为只读属性)

```typescript
interface  User{
    pic?:string;
    id?:number;
    age?:number;
}
Readonly<User> ;// 等同于
interface  User{
   readonly  pic?:string;
   readonly  id?:number;
   readonly  age?:number;
}
// 被标记为只读属性的对象,在初始化后,不能再次赋值给只读属性
```

> ```typescript
> type Readonly<T> = {
>     readonly [P in keyof T]: T[P];
> };
> ```

## Extract(提取)

适用于联合类型

```typescript
type Test1 = '1' | '2' | '3'

const obj: Extract<Test1, '1' | '2'> = '1'; // 1,2 OK 赋值3就会error
```

## Exclude(删除)

和`Extract` 相反,从联合类型中删除指定类型

```typescript
// 处理联合类型
type Test1 = '1' | '2' | '3'

const obj: Exclude<Test1, '1' | '2'> = '3'; // 3 OK 赋值1,2就会error
```
