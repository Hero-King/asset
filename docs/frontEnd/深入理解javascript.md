## 深入理解 javascript

参考链接： 汤姆大叔 https://www.cnblogs.com/TomXu/archive/2011/12/28/2286877.html
W3C https://www.w3cschool.cn/deep_learn_javascript/deep_learn_javascript-1sry284r.html

### 编写高质量 JavaScript 代码的基本要点

- 避免使用全局变量
- 合理使用 hasOwnProperty

```
// 1.
// for-in 循环
for (var i in man) {
   if (man.hasOwnProperty(i)) { // 过滤
      console.log(i, ":", man[i]);
   }
}
/* 控制台显示结果
hands : 2
legs : 2
heads : 1
*/
// 2.
// 反面例子:
// for-in loop without checking hasOwnProperty()
for (var i in man) {
   console.log(i, ":", man[i]);
}
/*
控制台显示结果
hands : 2
legs : 2
heads : 1
clone: function()
*/
```

- parseInt()下的数值转换总是指定基数参数。

```
var month = "06",
    year = "09";
month = parseInt(month, 10);
year = parseInt(year, 10);
```

- 使用一个下划线前缀来表示一个私有属性或方法

### 揭秘命名函数表达式

var f = function foo(){
return typeof foo; // foo 是在内部作用域内有效
};
// foo 在外部用于是不可见的
typeof foo; // "undefined"
f(); // "function"

- JScript 的内存管理

```
  var f = (function(){
    if (true) {
      return function g(){};
    }
    return function g(){};
  })();
  我们知道，这个匿名函数调用返回的函数（带有标识符g的函数），然后赋值给了外部的f。我们也知道，命名函数表达式会导致产生多余的函数对象，而该对象与返回的函数对象不是一回事。所以这个多余的g函数就死在了返回函数的闭包中了，因此内存问题就出现了。这是因为if语句内部的函数与g是在同一个作用域中被声明的。这种情况下 ，除非我们显式断开对g函数的引用，否则它一直占着内存不放。
    var f = (function(){
        var f, g;
        if (true) {
          f = function g(){};
        }
        else {
          f = function g(){};
        }
        // 设置g为null以后它就不会再占内存了
        g = null;
        return f;
  })();

  其实，如果我们不想要这个描述性名字的话，我们就可以用最简单的形式来做，也就是在函数内部声明一个函数（而不是函数表达式），然后返回该函数
```

- 自执行函数

```
// 下面2个括弧()都会立即执行

(function () { /* code */ } ()); // 推荐使用这个
(function () { /* code */ })(); // 但是这个也是可以用的
```

### 原型链

原型对象也是普通的对象，并且也有可能有自己的原型，如果一个原型对象的原型不为 null 的话，我们就称之为原型链（prototype chain）。

### 执行上下文栈

在 ECMASscript 中的代码有三种类型：global, function 和 eval。

每一种代码的执行都需要依赖自身的上下文。当然 global 的上下文可能涵盖了很多的 function 和 eval 的实例。函数的每一次调用，都会进入函数执行中的上下文,并且来计算函数中变量等的值。eval 函数的每一次执行，也会进入 eval 执行中的上下文，判断应该从何处获取变量的值。

注意，一个 function 可能产生无限的上下文环境，因为一个函数的调用（甚至递归）都产生了一个新的上下文环境。

一个执行上下文可以激活另一个上下文，就好比一个函数调用了另一个函数(或者全局的上下文调用了一个全局函数)，然后一层一层调用下去。逻辑上来说，这种实现方式是栈，我们可以称之为**上下文堆栈**。

### 执行上下文(Execution Context)

一个执行的上下文可以抽象的理解为 object。每一个执行的上下文都有一系列的属性（我们称为上下文状态），他们用来追踪关联代码的执行进度。主要有这三个属性 (变量对象(variable object)，this 指针(this value)，作用域链(scope chain) ),除了这 3 个所需要的属性,执行上下文根据具体实现还可以具有任意额外属性。

- 变量对象 变量对象(variable object) 是与执行上下文相关的 数据作用域(scope of data) 。
  它是与上下文关联的特殊对象，用于存储被定义在上下文中的 变量(variables) 和 函数声明(function declarations) 。函数表达式[function expression]是不包含在 VO[variable object]里面的
- 作用域链 是一个对象列表(list of objects) ，用以检索上下文代码中出现的 标识符(identifiers)标示符[Identifiers]可以理解为变量名称、函数声明和普通参数。 。作用域链的原理和原型链很类似，如果这个变量在自己的作用域中没有，那么它会寻找父级的，直到最顶层。

### 闭包

是一系列代码块（在 ECMAScript 中是函数），并且静态保存所有父级的作用域。通过这些保存的作用域来搜寻到函数中的自由变量。

## 设计模式

代码参见 browserwork.html -工厂模式

- 建造者模式  
   工厂模式主要是为了创建对象实例或者类族,建造者创建对象时更为复杂,关心创建的过程
