## class 声明

声明一个 class 类型

```cpp
class Studnet {
public:
	string name;
	int age;

	int getAge() {
		return age;
	}

};
```

public: 表示他们的访问权限

使用

```cpp
class Studnet {
public:
	string name;
	int age;

	int getAge() {
		return age;
	}
private :
	string sex;
};
int main() {

	Studnet s1;
	s1.age = 100;
	cout << s1.getAge() << endl;

	return 0;
}

```

class 对象可以直接声明后,直接使用,相当于是临时变量,函数执行完,就会自动释放

还可以使用 new 关键词进行创建对象

```cpp
Studnet * s2 = new Studnet();
int age = s2->age;
delete s2;
```

## 构造函数和析构函数

构造函数 和 Java 一样,在创建对象的时候,进行调用,语法也是一样, `类名(){}`

析构函数 是对象在被回收前进行执行的方法, 语法 `~类名(){}`,析构函数只能有一个

如果,不写构造函数和析构函数,编译器会有一个默认的空实现

```cpp
#include <iostream>
using namespace std;

class MyClass
{
public:
	MyClass()
	{
		cout << "构造函数" << endl;
	}
	~MyClass() {
		cout << "析构函数" << endl;
	}
};

void test() {
	MyClass p;
}
int main(){
	test();
	return 0;
}
```

## 构造函数分类

两种分类方式：

​ 按参数分为： 有参构造和无参构造

​ 按类型分为： 普通构造和拷贝构造

三种调用方式：

​ 括号法

​ 显示法

​ 隐式转换法

**示例：**

```cpp
//1、构造函数分类
// 按照参数分类分为 有参和无参构造   无参又称为默认构造函数
// 按照类型分类分为 普通构造和拷贝构造

class Person {
public:
	//无参（默认）构造函数
	Person() {
		cout << "无参构造函数!" << endl;
	}
	//有参构造函数
	Person(int a) {
		age = a;
		cout << "有参构造函数!" << endl;
	}
	//拷贝构造函数
	Person(const Person& p) {
		age = p.age;
		cout << "拷贝构造函数!" << endl;
	}
	//析构函数
	~Person() {
		cout << "析构函数!" << endl;
	}
public:
	int age;
};

//2、构造函数的调用
//调用无参构造函数
void test01() {
	Person p; //调用无参构造函数
}

//调用有参的构造函数
void test02() {

	//2.1  括号法，常用
	Person p1(10);
	//注意1：调用无参构造函数不能加括号，如果加了编译器认为这是一个函数声明
	//Person p2();

	//2.2 显式法
	Person p2 = Person(10);
	Person p3 = Person(p2);
	//Person(10)单独写就是匿名对象  当前行结束之后，马上析构

	//2.3 隐式转换法
	Person p4 = 10; // Person p4 = Person(10);
	Person p5 = p4; // Person p5 = Person(p4);

	//注意2：不能利用 拷贝构造函数 初始化匿名对象 编译器认为是对象声明
	//Person p5(p4);
}

int main() {

	test01();
	//test02();

	system("pause");

	return 0;
}
```

## 拷贝函数

C++中拷贝构造函数调用时机通常有三种情况

- 使用一个已经创建完毕的对象来初始化一个新对象
- 值传递的方式给函数参数传值
- 以值方式返回局部对象

```cpp
class Person {
public:
	Person() {
		cout << "无参构造函数!" << endl;
		mAge = 0;
	}
	Person(int age) {
		cout << "有参构造函数!" << endl;
		mAge = age;
	}
	Person(const Person& p) {
		cout << "拷贝构造函数!" << endl;
		mAge = p.mAge;
	}
	//析构函数在释放内存之前调用
	~Person() {
		cout << "析构函数!" << endl;
	}
public:
	int mAge;
};

//1. 使用一个已经创建完毕的对象来初始化一个新对象
void test01() {

	Person man(100); //p对象已经创建完毕
	Person newman(man); //调用拷贝构造函数
	Person newman2 = man; //拷贝构造

	//Person newman3;
	//newman3 = man; //不是调用拷贝构造函数，赋值操作
}

//2. 值传递的方式给函数参数传值
//相当于Person p1 = p;
void doWork(Person p1) {}
void test02() {
	Person p; //无参构造函数
	doWork(p);
}

//3. 以值方式返回局部对象
Person doWork2()
{
	Person p1;
	cout << (int *)&p1 << endl;
	return p1;
}

void test03()
{
	Person p = doWork2();
	cout << (int *)&p << endl;
}


int main() {

	//test01();
	//test02();
	test03();

	system("pause");

	return 0;
}
```

## 浅拷贝,和深拷贝

## 静态变量

和 Java 类型,类中可以写 静态变量

```cpp
class MyClass
{
public:
	MyClass()
	{
		cout << "构造函数" << endl;
	}
	~MyClass() {
		cout << "析构函数" << endl;
	}
	static int age;
};
// 使用前必须赋值 初始化操作
int MyClass::age = 10;
int main(){
	int a = MyClass::age;
	cout << a << endl;
	return 0;
}
```

还可以在类中进行初始化,但是必须使用`const` 修饰

```cpp
static const  int age=10;
```

## this

this 代表当前调用的对象的指针类型

```cpp
#include <iostream>
using namespace std;


class Student {

public:
	int age;
	void f1() {
		cout << "f1()" << endl;
	}

	void f2() {
		cout << "age=" << this->age << endl;
	}
};

int main() {
	Student* s = NULL;
	s->f1();
	//s->f2();
	return 0;
}
```

c++ 中如果空指针是可以访问对象中的方法的,但是,如果方法中含有`this` (属性前面会默认使用 this.) 则会程序出错

也就是说 `f1()` 函数不会出错,但是`f2() ` 函数会运行错误
