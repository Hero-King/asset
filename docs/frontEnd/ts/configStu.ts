import _ from 'underscore'
import * as dayjs from 'dayjs'
import type { ThrottleSettings } from 'underscore'
console.log(_.VERSION)
let aa: ThrottleSettings

//  拓展全局变量
declare global {
  interface Window {
    say: () => void
  }
  interface String {}

  type Html = HTMLElement | string
}

//  interface.ts中也定义了IPerson 接口 优先引用当前模块的
interface IPerson {
  gg: string
}

let bb: IPerson = {
  gg: 'Tom'
}

window.say()
