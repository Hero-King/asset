/**
 * 接口用来定义一个类结构，用来定义一个类中应该包含哪些属性和方法
 * 同时接口也可以当成类型声明来使用
 * 接口中所有方法都是抽象方法
 * 接口只定义对象的结构，而不考虑实际值
 */

interface IPerson {
  firstName: string
  lastName: string
  sayHi: () => string
}

const customer: IPerson = {
  firstName: 'Tom',
  lastName: 'Hanks',
  sayHi: (): string => {
    return 'Hi there'
  }
}

const customer2 = <IPerson>{
  firstName: 'Tom',
  lastName: 'Hanks',
  sayHi: (): string => {
    return 'Hi there'
  }
}

let aaaa:Html
let bb : TestGlobal