/**
 * 5分钟上手TypeScript   https://www.tslang.cn/docs/home.html中文网
 *
 * 安装  npm i typescript -g
 * 使用就是约束参数类型  person: Person 参数person是Person接口类型
 *
 *
 */
//构建你的第一个TypeScript文件
function greeter(person) {
  //定义一个方法
  return 'Hello, ' + person
}
let user: string = 'Jane User'
let object = {
  name: 'wang',
  age: 22
}
console.log(greeter(user))

// 编译代码         在命令行上，运行TypeScript编译器：tsc typescript.ts
//接下来让我们看看TypeScript工具带来的高级功能。 给 person函数的参数添加: string类型注解，如下：       类型注解是一种轻量级的为函数或变量添加约束的方式  传入的参数必须是字符串   不是的话爆出错误 但是要注意的是尽管有错误，greeter.js文件还是被创建了。 就算你的代码里有错误，你仍然可以使用TypeScript。但在这种情况下，TypeScript会警告你代码可能不会按预期执行。

function greeter1(person: string) {
  return 'Hello, ' + person
}

let user1 = 'Jane User'

console.log(greeter1(user))

class Person1 {}
interface Person {
  firstName: string
  lastName: string
}
function greeter2(person: Person) {
  return 'Hello, ' + person.firstName + ' ' + person.lastName
}

let user2 = { firstName: 'Jane', lastName: 'User' }

console.log(greeter2(user2))

//5分钟入门教程完结
