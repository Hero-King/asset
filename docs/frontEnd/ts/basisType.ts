let isDone: boolean = true
const msg: string = 'i am message'
const age: number = 10
const numArr: number[] = [1, 2, 3, 5]
const numArr2: Array<number> = [1, 2, 3, 5]
// 声明变量如果不指定类型，则TS解析器会自动判断变量的类型为any （隐式的any）
let d

// never 表示永远不会返回结果
function fn2(): never {
  throw new Error('报错了！')
}

// 字面量类型
let bl: 'male' | 'demale' = 'male'
let tmpnum: 1 | 2 | 3 | 4 | 5
let b: { name: string; age?: number }
let arr1: [] = []
let arr2: [1, 2] = [1, 2]

// type : 类型别名  接口创建了一个新的名字，可以在其它任何地方使用。 类型别名并不创建新名字—比如，错误信息就不会使用别名。 在下面的示例代码里，在编译器中将鼠标悬停在 interface上，显示它返回的是 Interface，但悬停在 aliased上时，显示的却是对象字面量类型。
// 另一个重要区别是类型别名不能被 extends和 implements（自己也不能 extends和 implements其它类型）。
type Alias = { num: number }
interface NumInterface {
  num: number
}

// 函数类型
let fun: (a: number, b: number) => number

// 交叉类型 &
// 联合类型 |
type buttonType = 'small' | 'mini' | 'default' | (() => string)
type defaultButton = 'default'
let btnType: defaultButton = 'default' // 只能是字符串 'default'
export type buttonTypeMix = buttonType & defaultButton // 'default'
let defaultBtn: buttonTypeMix = 'default' // 只能是字符串 'default'
// 常用于与对象  表示多个对象中字段必须有 ***
type obj1 = { name: string }
type obj2 = { age: number; age1: number }
type withObj = obj1 & obj2
let t: withObj = { name: 'name', age: 12, age1: 1212 } // {name, age, age1} 缺一不可
let tt: obj2 | obj1 = { name: 'name' } // obj2 和 obj1类型其一即可
let tt12: obj2 | obj1 = { age: 1, age1: 2 }

let aa: typeof t // 获取变量t的ts类型
type tKeys = keyof withObj // keyof 后面接类型 获得类型的所有的key 的联合字面量类型
let tt1: tKeys = 'age'

interface Student {
  name: string
  age: number
}

interface Teacher {
  name: string
  tClass: string
}
let p1: Teacher & Student = { name: '小', age: 20, tClass: '数学' } // 必须同时满足两个类型
let p2: Teacher | Student = { name: '小', age: 18 }
let p3: Teacher | Student = { name: '小', tClass: '英语' }

const tuple: [string, number] = ['12', 23]

// 枚举
enum Color {
  Red,
  Green
}

const color: Color = Color.Red
console.log(color, 'enum color')

enum SomeType {
  'Success' = 'Suc',
  'Fail' = 'F'
}

let someType: SomeType = SomeType.Success
console.log(someType)

// 函数
function justLog(param: string): void {
  console.log(param)
}

const justLog2 = (param: string | number | object): void => {
  console.log(param)
}

const add = (x: number, y: number, ...rest: number[]): number => {
  return rest.reduce((p, c) => p + c, x + y)
}

let person: { name: string; age: number }
person = {
  name: '12',
  age: 10
}

// 必须有name属性, 其他属性类型为any
let j: { name: string; [propname: string]: any }

let dom: HTMLElement = document.getElementById('id') as HTMLElement

//  有的时候重写属性
interface overwrite extends Omit<Teacher, 'name'> {
  name: Teacher['name'] | number
}

let oo: overwrite = {
  name: 12,
  tClass: ''
}

// 获取接口某个属性的类型
type T1 = Teacher['name']
let str: T1 = '12'

// 变量后 + !  表示非undefined
let a: string[] = null!

interface IDemo {
  x?: number // 由于x是可选的，因此parma.x的类型为number | undefined，无法传递给number类型的y，因此需要用x!
}
let y: number
const demo = (parma: IDemo) => {
  y = parma.x!
  return y
}

interface LikeObj {
  [key: string]: string
}
