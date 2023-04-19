## hello world

```cpp
#include <iostream>
using namespace std;

int main() {
	cout << "hello world" << endl;
	return 0;
}

```

其中文件开头需要导入 `iostream` 基础库,c++ 中可以省略.h 后缀,所以可以不用写.h

#include 表示引入某个库的代码

而 `using namespace std` 表示 使用 `std` 这个命名空间 因为,我们接下来的使用的`cout` 输出函数,是在 `std` 这个命名空间中,`namespace` 主要是用来区分 不同头文件的中的相同函数名,也就说,接下来使用的 cout 函数是在 std 中

如果我们不声明 std 命名空间的话,需要手动表示这个函数是属于哪个命名空间中,因为他在外面的空间中找不到,因此需要下面这样写

```cpp
#include <iostream>
int main() {
	std::cout << "hello world" << std::endl;
	return 0;
}
```

所以,我们导入的`std` 命名空间后,可以省略 cout 前面的 `std::` 这种前缀

`endl` 表示 换行输出

## 输入输出

```cpp
#include <iostream>
using namespace std;
int main() {
	int num;
	cin >> num;
	cout << "你输入的数字是:" << num << endl;
	return 0;
}

```

`cin` 表示从控制台进行输入参数 `cout` 表示在控制台打印

## 函数值传递,指针传递,引用传递

```cpp
#include <iostream>
using namespace std;

/*
	引用
	相当于 b 也是指向的a 变量, 类似于指针这种 a, b 变量都指向 10这个值
*/

// 值传递
void swap1(int x, int y) {
	int temp = x;
	x = y;
	y = temp;
	cout << "值传递:x=" << x << ",y=" << y << endl;
}

// 指针传递
void swap2(int* x, int* y) {
	int temp = *x;
	*x = *y;
	*y = temp;
	cout << "指针传递:x=" << *x << ",y=" << *y << endl;
}


// 引用传递
void swap3(int &x,int &y) {
	int temp = x;
	x = y;
	y = temp;
	cout << "引用传递:x=" << x << ",y=" << y << endl;
}

int main() {
   int a = 10;
   int &b = a;
   //cout << b << endl;
   b = 20;
   //cout << a << endl;

   int x = 120;
   int y = 200;

   swap1(x, y);
   cout << "值传递后:x=" << x << ",y=" << y << endl;

   swap2(&x, &y);
   cout << "指针传递后:x=" << x << ",y=" << y << endl;

   swap3(x, y);
   cout << "引用传递后:x=" << x << ",y=" << y << endl;


   return 0;
}
```

引用传递实际上底层是 指针常量 ,无法再次修改,相当于是 指针的一个语法糖的使用,简化指针在函数传递的书写

## 内存管理

在函数体内声明的局部变量,会被分配在栈当中,函数运行完毕,则释放空间,因为,不要在函数体内返回引用变量,因为会被系统回收,

我们可以`new` 变量,使用`new` 关键词后,变量会被创建在 堆中,语法如下

```cpp
void f() {
	int * p = new int(10);
}
```

返回的是指针类型的变量

如果使用了 new 关键词,变量不会被系统回收,只能手动释放变量

```cpp
delete p;
```

这样就能释放 p 变量

## 函数默认参数

```cpp
int func(int a, int b = 10, int c = 10) {
	return a + b + c;
}

//1. 如果某个位置参数有默认值，那么从这个位置往后，从左向右，必须都要有默认值
//2. 如果函数声明有默认值，函数实现的时候就不能有默认参数
int func2(int a = 10, int b = 10);
int func2(int a, int b) {
	return a + b;
}

int main() {

	cout << "ret = " << func(20, 20) << endl;
	cout << "ret = " << func(100) << endl;

	system("pause");

	return 0;
}
```

## struct 和 class 区别

在 C++中 struct 和 class 唯一的**区别**就在于 **默认的访问权限不同**

区别：

- struct 默认权限为公共
- class 默认权限为私有

```cpp
class C1
{
	int  m_A; //默认是私有权限
};

struct C2
{
	int m_A;  //默认是公共权限
};

int main() {

	C1 c1;
	c1.m_A = 10; //错误，访问权限是私有

	C2 c2;
	c2.m_A = 10; //正确，访问权限是公共

	system("pause");

	return 0;
}
```
