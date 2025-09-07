// 泛型

import { StrAndNum } from './some'

// 定义
// 我们给identity添加了类型变量T。 T帮助我们捕获用户传入的类型（比如：number），之后我们就可以使用这个类型。 之后我们再次使用了 T当做返回值类型。
function identity<T>(arg: T): T {
  return arg
}

// 使用
let output = identity<string>('myString') // type of output will be 'string'

// 函数中声明多个泛型
function test<T, K>(a: T, b: K): K {
  return b
}
test<number, string>(10, 'hello')

interface IItem {
  length: number
}

// 约束泛型
function getItem<T extends IItem>(a: T): number {
  return a.length
}



class SomeClass<T> {
  name: T
  constructor(name: T) {
    this.name = name
  }
}
const sc = new SomeClass<string>('12')
console.log(sc.name) // string 类型

function myLog(params: StrAndNum) {
  console.log(params)
}

myLog(false)
