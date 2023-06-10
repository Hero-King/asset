let isDone: boolean = true
const msg: string = 'i am message'
const age: number = 10
const numArr: number[] = [1, 2, 3, 5]
const numArr2: Array<number> = [1, 2, 3, 5]

const tuple: [string, number] = ['12', 23]

// 字面量类型
let bl: 'male' | 'demale' = 'male'

enum Color {
  Red,
  Green
}

const color: Color = Color.Red
console.log(color, 'enum color')

function justLog(param: string): void {
  console.log(param)
}

const justLog2 = (param: string | number | object): void => {
  console.log(param)
}

const add = (x: number, y: number, ...rest: number[]): number => {
  return rest.reduce((p, c) => p + c, x + y)
}


let person: {name: string, age: number}

person = {
    name: '12',
    age: 10,
}
