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
// declare type TestGlobal = string  // 只要 .ts 或 .d.ts 文件中有 import 或 export，那么这个文件中的 declare 就会变成局部变量。

// 全局的
declare global {
  type TestGlobal = string
}