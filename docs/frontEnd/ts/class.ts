class Person {
  // 属性修饰符 属性名 : 类型
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }

  static readonly staticProp: string = 'this is staticProp'
  static sayHello(): void {
    console.log('hello')
  }

  say(): void {
    console.log(this.name + this.age)
  }
}

console.log(Person.staticProp)
Person.sayHello()

const p = new Person('wjj', 20)
console.log(p instanceof Person, 'person instanceof Person')
