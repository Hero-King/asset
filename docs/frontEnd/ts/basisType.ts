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
type obj2 = { age: string }
type withObj = obj1 & obj2
let t: withObj = { name: 'name', age: '1212' }

let aa: typeof t // 获取变量t的ts类型
type tKeys = keyof withObj // keyof 后面接类型 获得类型的所有的key 的联合字面量类型
let tt1: tKeys = 'age'

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
