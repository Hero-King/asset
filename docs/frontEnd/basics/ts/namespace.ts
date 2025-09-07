/// <reference path="namespaceTest.ts" />

namespace SomeNameSpaceName {
  export interface ISomeInterfaceName {}
  export class SomeClassName {}

  //   嵌套命名空间
  export namespace namespace_name2 {
    export class class_name {}
  }
}

// 如果我们需要在外部可以调用 SomeNameSpaceName 中的类和接口，则需要在类和接口添加 export 关键字。

// 另外一个命名空间调用语法 SomeNameSpaceName.SomeClassName;

// 如果一个命名空间在一个单独的 TypeScript 文件中，则应使用三斜杠 /// 引用它，语法格式如下： /// <reference path = "SomeFileName.ts" />

class Cat implements Part1.Animal {
  name: string
  eat() {
    console.log('eat')
  }
}

var invoice = new Runoob.invoiceApp.Invoice(); 
