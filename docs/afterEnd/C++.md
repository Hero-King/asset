# C++

## 初识

安装 `Visual Studio` 社区版本 选择`C++桌面程序`组件包 新建C++项目即可

在源文件目录下右键新增文件 选择文件类型

### Hello World

```c++
#include <iostream>
using namespace std;
/*
入口函数
有且仅有一个
*/

int main() {

	cout << "Hello World\n";
	cout << "Hello World" << endl;

	int age = 10;
	// sizeOf 统计数据类型占用的空间
	cout << sizeof(age) << endl;

	// 字符类型只能使用单引号;长度只能是1
	char ch = 'a';
	cout << ch << endl;

	// 常量
	const int count = 500;

	// C++区分大小写 语句分隔符;

	// float类型需要添加f表示是float类型 默认是double类型
	float f1 = 3.14f;

	// 科学计数法表示
	double d1 = 2e3; // 2*10^3

	// 浮点数默认输出长度是6位
	double d2 = 3.1415926;
	cout << "d2 value: " << d2 << endl;

	string str = "小灰灰";
	cout << str << endl;

	//无限循环
	/*for (; ; )
	{
		printf("This loop will run forever.\n");
	}*/


	// 指针p指向age变量的内存地址 &变量 代表取变量的物理地址
	int* ip = &age;

	// 输出在指针变量中存储的地址
	cout << "Address stored in ip variable: ";
	cout << ip << endl;

	// 访问指针中地址的值
	cout << "Value of *ip variable: ";
	cout << *ip << endl;



	system("pause");
	return 0;
}
```



## 数据类型

| 类型               | 位            | 范围                                                         |
| :----------------- | :------------ | :----------------------------------------------------------- |
| char               | 1 个字节      | -128 到 127 或者 0 到 255                                    |
| unsigned char      | 1 个字节      | 0 到 255                                                     |
| signed char        | 1 个字节      | -128 到 127                                                  |
| int                | 4 个字节      | -2147483648 到 2147483647                                    |
| unsigned int       | 4 个字节      | 0 到 4294967295                                              |
| signed int         | 4 个字节      | -2147483648 到 2147483647                                    |
| short int          | 2 个字节      | -32768 到 32767                                              |
| unsigned short int | 2 个字节      | 0 到 65,535                                                  |
| signed short int   | 2 个字节      | -32768 到 32767                                              |
| long int           | 8 个字节      | -9,223,372,036,854,775,808 到 9,223,372,036,854,775,807      |
| signed long int    | 8 个字节      | -9,223,372,036,854,775,808 到 9,223,372,036,854,775,807      |
| unsigned long int  | 8 个字节      | 0 到 18,446,744,073,709,551,615                              |
| float              | 4 个字节      | 精度型占4个字节（32位）内存空间，+/- 3.4e +/- 38 (~7 个数字) |
| double             | 8 个字节      | 双精度型占8 个字节（64位）内存空间，+/- 1.7e +/- 308 (~15 个数字) |
| long double        | 16 个字节     | 长双精度型 16 个字节（128位）内存空间，可提供18-19位有效数字。 |
| wchar_t            | 2 或 4 个字节 | 1 个宽字符                                                   |

### sizeOf

统计数据类型占用的空间

### **typedef** 

**typedef** 为一个已有的类型取一个新的名字。

```c++
typedef int feet;	// 告诉编译器，feet 是 int 的另一个名称
feet distance;  	// 声明是完全合法的，它创建了一个整型变量 distance
```

### 枚举类型

```c++
enum 枚举名{ 
     标识符[=整型常数], 
     标识符[=整型常数], 
... 
    标识符[=整型常数]
} 枚举变量;
    
enum color { red, green, blue } c;
c = blue;
```

### 定义常量

```c++
#define identifier value // 定义宏常量 在文件上方定义
// 或者
const type variable = value;
```

## 循环

while for   do..while

### 无限循环

您可以按 Ctrl + C 键终止一个无限循环。

```c++
 for( ; ; )
   {
      printf("This loop will run forever.\n");
   }
```

