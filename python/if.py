age = int(input("请输入年龄"))

# 2. 判断是否满 18 岁
# if 语句以及缩进部分的代码是一个完整的代码块
if age >= 18:
    print("可以进网吧嗨皮……")
    print("我进去啦")
elif age >= 10:
    print("age >=10")
else:
    print("不允许进入哦")
# 3. 思考！- 无论条件是否满足都会执行
print("这句代码什么时候执行?")