#!/usr/bin/python
# coding=utf-8

print("Hello, World! ")
print("python3使用 /usr/bin/python3");

if True:
    print ("Answer")
    print ("True")
else:
    print ("Answer")

# 学习引号
dan = '我是单引号字符串'
shuang = "我是双引号字符串"
san = """我是
            三引号"""
print(dan)
print(shuang)
print(san)

"""
我是注释
"""

flag = False
name = 'luren'
if name == 'python':         # 判断变量是否为 python 
    flag = True              # 条件成立时设置标志为真
    print 'welcome boss'     # 并输出欢迎信息
else:
    print name               # 条件不成立时输出变量名称

print("python 并不支持 switch 语句，所以多个条件判断，只能用 elif 来实现，如果判断需要多个条件需同时判断时，可以使用 or （或），表示两个条件有一个成立时判断条件成功；使用 and （与）时，表示只有两个条件同时成立的情况下，判断条件才成功。")
num = 9
if num >= 0 and num <= 10:    # 判断值是否在0~10之间
    print 'hello'
# 输出结果: hello
 
num = 10
if num < 0 or num > 10:    # 判断值是否在小于0或大于10
    print 'hello'
else:
    print 'undefine'
# 输出结果: undefine
 
num = 8
# 判断值是否在0~5或者10~15之间
if (num >= 0 and num <= 5) or (num >= 10 and num <= 15):    
    print 'hello'
else:
    print 'undefine'
# 输出结果: undefine

# whille循环
count = 0
while (count < 9):
   print 'The count is:', count
   count = count + 1
 
print "Good bye!",count

count = 0
while count < 5:
   print count, " is  less than 5"
   count = count + 1
else:
   print count, " is not less than 5"

import time  # 引入time模块
ticks = time.time()
print "当前时间戳为:", ticks