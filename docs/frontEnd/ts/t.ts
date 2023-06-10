// 泛型


// 定义
// 我们给identity添加了类型变量T。 T帮助我们捕获用户传入的类型（比如：number），之后我们就可以使用这个类型。 之后我们再次使用了 T当做返回值类型。
function identity<T>(arg: T): T {
    return arg;
}

// 使用
let output = identity<string>("myString");  // type of output will be 'string'


// 函数中声明多个泛型
function test<T, K>(a: T, b: K): K{
    return b;
  }
  
  test<number, string>(10, "hello");
