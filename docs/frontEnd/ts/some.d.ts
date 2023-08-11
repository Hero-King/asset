import * as moment from 'dayjs'

export type StrAndNum = string | number | boolean

declare type StrAndNum2 = string | number | boolean

// 其他文件中使用d.ts  :   /// <reference path = "xxx.d.ts" />  var obj = new Runoob.Calc();
declare namespace Runoob {
  export class Calc {
    doSum(limit: number): number
  }
}

// 拓展 dayjs 模块 添加foo接口
declare module 'dayjs' {
  export interface foo {}
}

// type TestGlobal = string   // 非全局
// declare type TestGlobal = string  // 非全局 不确定啊  有的项目中d.ts这样声明是全局的

// 全局的
declare global {
  type TestGlobal = string
}