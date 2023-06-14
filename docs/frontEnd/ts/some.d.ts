export type StrAndNum = string | number | boolean

declare type StrAndNum2 = string | number | boolean

// 其他文件中使用d.ts  :   /// <reference path = "xxx.d.ts" />  var obj = new Runoob.Calc();
declare namespace Runoob {
  export class Calc {
    doSum(limit: number): number
  }
}
