# !/bin/bash
# @date 2021年11月12日09:54:26
# @description 变量学习

# 第一行一般是这样： #!”是一个约定的标记，它告诉系统这个脚本需要什么解释器来执行 /env 是系统的PATH目录中查找
#!/usr/bin/php
#!/usr/bin/env python3
#!/usr/bin/env bash

# 双引号的优点：
# 双引号里可以有变量
# 双引号里可以出现转义字符

name="wangjunjie"
readonly age=22
echo $name ${age} age变量长度:${#age} 提取name变量后三位${name:1:4}
mypath="mypath: ${PATH}"
echo $mypath

arr=(1 2 3 4)
echo ${arr[3]}  # 打印 4
# 使用 @ 符号可以获取数组中的所有元素
echo ${arr[@]}  # 打印 1 2 3 4

# 取得数组元素的个数
length=${#arr[@]}
# 或者
length=${#arr[*]}
# 取得数组单个元素的长度
lengthn=${#arr[n]}

# 原生bash不支持简单的数学运算，但是可以通过其他命令来实现，例如 awk 和 expr，expr 最常用。 expr 是一款表达式计算工具，使用它能完成表达式的求值操作。
# 表达式和运算符之间要有空格，例如 2+2 是不对的，必须写成 2 + 2，这与我们熟悉的大多数编程语言不一样。
val=`expr 2 + 2`
echo "两数之和为 : $val"

a=10
b=20

# 注意两边 的 空格
if [ $a -eq $b ]
then
   echo "$a -eq $b : a 等于 b"
else
   echo "$a -eq $b: a 不等于 b"
fi

unset name
# unset age  # 报错 readonly变量不能删除
echo ${name}    # 打印空

# for var in item1 item2 ... itemN
# do
#     command1
#     command2
#     ...
#     commandN
# done
for loop in 1 2 3 4 5
do
    echo "The value is: $loop"
done

# case 值 in
# 模式1)
#     command1
#     command2
#     ...
#     commandN
#     ;;
# 模式2)
#     command1
#     command2
#     ...
#     commandN
#     ;;
# esac
# 如果无一匹配模式，使用星号 * 捕获该值，再执行后面的命令。

# function : 
# [ function ] funname [()]

# {

#     action;

#     [return int;]
      # 参数返回，可以显示加：return 返回，如果不加，将以最后一条命令运行结果，作为返回值。 return后跟数值n(0-255
# }
# 函数返回值在调用该函数后通过 $? 来获得。

# 引入其他shell脚本  使用. 或者source
. ./date.sh