# 学习 python 入门

有多种方式可以运行 Python：
1、交互式解释器： 你可以通过命令行窗口进入 Python，并在交互式解释器中开始编写 Python 代码。
2、命令行脚本: 在你的应用程序中通过引入解释器可以在命令行中执行 Python 脚本 python script.py
3、脚本添加可执行权限 chmod +x test.py # 脚本文件添加可执行权限 ./test.py 执行

### 编译和解释

编译型语言是需要编译器把源代码生成计算机可识别的二进制文件,计算机直接执行 [速度快,跨平台性低] C C++
解释型语言是解释器读取一行源代码,生成可执行指令,CPU 执行 循环往复 [速度慢,跨平台] python java

> java 先通过编译成 class 文件,jvm 解释+编译两种方式合并使用运行程序

### 设计目标

简单,开源
适用于短期开发的日常任务
开发哲学: 最好只有一种方法实现一个功能

### 为什么用 python

代码量少 通常比 java 少 4/5 ----> 人生苦短 我用 python

### 特点

完全面向对象
强大的标准库
社区提供大量的第三方块,科学计算/人工智能/机器学习等

## 基础语法

- 中文编码
  Python 中默认的编码格式是 ASCII 格式，在没修改编码格式时无法正确打印汉字，所以在读取中文时会报错。
  只要在文件开头加入 # -_- coding: UTF-8 -_- 或者 # coding=utf-8 就行了
  注意：Python3.X 源码文件默认使用 utf-8 编码，所以可以正常解析中文，无需指定 UTF-8 编码。

- Python 标识符
  在 Python 里，标识符由字母、数字、下划线组成。
  在 Python 中，所有标识符可以包括英文、数字以及下划线(\_)，但不能以数字开头。
  Python 中的标识符是区分大小写的。
  _以下划线开头的标识符是有特殊意义的。_
  以单下划线开头`_foo`的代表不能直接访问的类属性，需通过类提供的接口进行访问，不能用 from xxx import \* 而导入。
  以双下划线开头的`__foo`代表类的私有成员，
  以双下划线开头和结尾的`__foo__`代表 Python 里特殊方法专用的标识，如`__init__()`代表类的构造函数。
  Python 可以同一行显示多条语句，方法是用分号 ; 分开

- 行和缩进
  学习 Python 与其他语言最大的区别就是，Python 的代码块不使用大括号 {} 来控制类，函数以及其他逻辑判断。python 最具特色的就是用缩进来写模块。
  缩进的空白数量是可变的，但是所有代码块语句必须包含相同的缩进空白数量，这个必须严格执行。

  ```python
  if True:
    print ("True")
  else:
    print ("False")
  ```

- 多行语句(同 linux 的 shell)
  Python 语句中一般以新行作为语句的结束符。
  但是我们可以使用斜杠（ \）将一行的语句分为多行显示，如下所示：

  ```python
  total = item_one + \
   item_two + \
   item_three

  # 在 [], {}, 或 () 中的多行语句，不需要使用反斜杠 \
  ```

- Python 引号
  Python 可以使用引号( ' )、双引号( " )、三引号( ''' 或 """ ) 来表示字符串，引号的开始与结束必须是相同类型的。
  其中三引号可以由多行组成，编写多行文本的快捷语法，常用于文档字符串，在文件的特定地点，被当做注释。
  字符串可以用 + 运算符连接在一起，用 \* 运算符重复
  word = 'word'
  sentence = "这是一个句子。"
  paragraph = """这是一个段落。
  包含了多个语句"""

- Python 空行
  函数之间或类的方法之间用空行分隔，表示一段新的代码的开始。类和函数入口之间也用一行空行分隔，以突出函数入口的开始。
  空行与代码缩进不同，空行并不是 Python 语法的一部分。书写时不插入空行，Python 解释器运行也不会出错。但是空行的作用在于分隔两段不同功能或含义的代码，便于日后代码的维护或重构。
  记住：空行也是程序代码的一部分。

- 等待用户输入
  下面的程序执行后就会等待用户输入，按回车键后就会退出：

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

raw_input("按下 enter 键退出，其他任意键显示...\n")
```

以上代码中 ，\n 实现换行。一旦用户按下 enter(回车) 键退出，其它键显示。

- print 默认输出是换行的，如果要实现不换行需要在变量末尾加上逗号 ,

- 多个语句构成代码组
  缩进相同的一组语句构成一个代码块，我们称之代码组。
  像 if、while、def 和 class 这样的复合语句，首行以关键字开始，以冒号( : )结束，该行之后的一行或多行代码构成代码组。
  我们将首行及后面的代码组称为一个子句(clause)。
  如下实例：
  ```python
  if expression :
  suite
  elif expression :
  suite
  else :
  suite
  ```

## Python 变量类型

Python 有的数据类型：
Numbers（数字）
bool（布尔类型）
String（字符串）
List（列表）
Tuple（元组）
Dictionary（字典）

- 字符串:
  python 的字串列表有 2 种取值顺序:
  从左到右索引默认 0 开始的，最大范围是字符串长度少 1
  从右到左索引默认-1 开始的，最大范围是字符串开头
  R U N O O B
  0 1 2 3 4 5
  -6 -5 -4 -3 -2 -1
  从字符串中获取一段子字符串的话，可以使用 [头下标:尾下标] (包含头下标的字符，但不包含尾下标的字符) 来截取相应的字符串
  加号（+）是字符串连接运算符，星号（\*）是重复操作。
  截取可以接收第三个参数，参数作用是截取的步长，以下实例在索引 1 到索引 4 的位置并设置为步长为 2（间隔一个位置）来截取字符串

- List
  支持截取, 加号 + 是列表连接运算符，星号 \* 是重复操作 ["aa","bb"]

- set
  无序、可变的数据类型，用于存储唯一的元素
  set1 = {"11","22"}  
   集合运算:

  ```python
    a = set('abracadabra')
    b = set('alacazam')
    print(a)
    print(a - b) # a 和 b 的差集
    print(a | b) # a 和 b 的并集
    print(a & b) # a 和 b 的交集
    print(a ^ b) # a 和 b 中不同时存在的元素
  ```

- 元组 tuple
  元组是另一个数据类型，类似于 List（列表）。
  元组用 () 标识。内部元素用逗号隔开。但是元组不能二次赋值，相当于只读列表。

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

tuple = ( 'runoob', 786 , 2.23, 'john', 70.2 )
tinytuple = (123, 'john')

print tuple               # 输出完整元组
print tuple[0]            # 输出元组的第一个元素
print tuple[1:3]          # 输出第二个至第四个（不包含）的元素
print tuple[2:]           # 输出从第三个开始至列表末尾的所有元素
print tinytuple * 2       # 输出元组两次
print tuple + tinytuple   # 打印组合的元组
"""
('runoob', 786, 2.23, 'john', 70.2)
runoob
(786, 2.23)
(2.23, 'john', 70.2)
(123, 'john', 123, 'john')
('runoob', 786, 2.23, 'john', 70.2, 123, 'john')
"""
```

- Python 字典
  dict = {} dict["once"] = 1
  dict2 = {"name" :"wang "}
  字典(dictionary)是除列表以外 python 之中最灵活的内置数据结构类型。列表是有序的对象集合，字典是无序的对象集合。
  两者之间的区别在于：字典当中的元素是通过键来存取的，而不是通过偏移存取。
  字典用"{ }"标识。字典由索引(key)和它对应的值 value 组成。

  ```python
  #!/usr/bin/python
  # -*- coding: UTF-8 -*-

  dict = {}
  dict['one'] = "This is one"
  dict[2] = "This is two"

  tinydict = {'name': 'runoob','code':6734, 'dept': 'sales'}


  print dict['one']          # 输出键为'one' 的值
  print dict[2]              # 输出键为 2 的值
  print tinydict             # 输出完整的字典
  print tinydict.keys()      # 输出所有键
  print tinydict.values()    # 输出所有值
  """
  This is one
  This is two
  {'dept': 'sales', 'code': 6734, 'name': 'runoob'}
  ['dept', 'code', 'name']
  ['sales', 6734, 'runoob']
  """
  ```

- Python 数据类型转换
  有时候，我们需要对数据内置的类型进行转换，数据类型的转换，你只需要将数据类型作为函数名即可。

以下几个内置的函数可以执行数据类型之间的转换。这些函数返回一个新的对象，表示转换的值。
float(x) 将 x 转换到一个浮点数

## 运算符/关键字

- type(var)
- isinstance(var, type)

逻辑运算符
and x and y 布尔"与" - 如果 x 为 False，x and y 返回 False，否则它返回 y 的计算值。 (a and b) 返回 20。
or x or y 布尔"或" - 如果 x 是非 0，它返回 x 的值，否则它返回 y 的计算值。 (a or b) 返回 10。
not not x 布尔"非" - 如果 x 为 True，返回 False 。如果 x 为 False，它返回 True。 not(a and b) 返回 False
成员运算符
测试实例中包含了一系列的成员，包括字符串，列表或元组。
in 如果在指定的序列中找到值返回 True，否则返回 False。 x 在 y 序列中 , 如果 x 在 y 序列中返回 True。
not in 如果在指定的序列中没有找到值返回 True，否则返回 False。 x 不在 y 序列中 , 如果 x 不在 y 序列中返回 True。
身份运算符
身份运算符用于比较两个对象的存储单元
is is 是判断两个标识符是不是引用自一个对象 x is y, 类似 id(x) == id(y) , 如果引用的是同一个对象则返回 True，否则返回 False
is not is not 是判断两个标识符是不是引用自不同对象 x is not y ， 类似 id(a) != id(b)。如果引用的不是同一个对象则返回结果 True，否则返回 False。
is 与 == 区别：

**is 用于判断两个变量引用对象是否为同一个(同一块内存空间)， == 用于判断引用变量的值是否相等。**

## 函数

定义一个函数
你可以定义一个由自己想要功能的函数，以下是简单的规则：
函数代码块以 def 关键词开头，后接函数标识符名称和圆括号()。
任何传入参数和自变量必须放在圆括号中间。圆括号之间可以用于定义参数。
函数的第一行语句可以选择性地使用文档字符串—用于存放函数说明。
函数内容以冒号起始，并且缩进。
return [表达式] 结束函数，选择性地返回一个值给调用方。不带表达式的 return 相当于返回 None。

```python
def functionname( parameters ):
   "函数_文档字符串"
   function_suite
   return [expression]

# 定义函数
def printme( str ):
   "打印任何传入的字符串"
   print str
   return

# 调用函数
printme("我要调用用户自定义函数!")
printme("再次调用同一函数")
```
