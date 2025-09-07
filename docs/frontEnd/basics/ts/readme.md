# typescript

> 参考资料
> https://ts.xcatliu.com/

```shell
npm install -g typescript
tsc -v
tsc ***.ts  xxx.ts ddd.ts	// 编译ts -> js

```

## 配置文件 tsconfig.json

生成默认配置 `tsc --init`

```json
{
  // files: [], 指定哪些文件被编译
  // "extends": '', 配置项继承自哪个json文件
  // "include": [], 对哪些目录 那些文件进行编译 默认是文件拓展名为.ts, .tsx, and .d.ts; 如果需要编译js/jsx文件需要使用 allowJs: true
  //  **/ matches any directory nested to any level  ? 某一个字符  * matches zero or more characters

  "compilerOptions": {
    /* 访问 https://aka.ms/tsconfig.json 以阅读有关此文件的更多信息 */
    /* tsconfig推荐 https://github.com/tsconfig/bases#centralized-recommendations-for-tsconfig-bases */

    /* 基本选项 */
    "incremental": true /* 启用增量编译 */,
    "target": "ESNEXT" /* 指定 ECMAScript 目标版本：'ES3'、'ES5'（默认）、'ES2015'、'ES2016'、'ES2017'、'ES2018'、'ES2019'、'ES2020' 或 'ESNEXT'。 */,
    "module": "commonjs" /* 设置编译后代码使用的模块化系统; 指定模块代码生成：“none”、“commonjs”、“amd”、“system”、“umd”、“es2015”、“es2020”或“ESNext”。 */,
    "lib": [] /* 指定代码运行时所包含的库（宿主环境）。ES5、ES6/ES2015、ES7/ES2016、ES2017 ...、ESNext、DOM等 如果不包含dom 那就找不到dom相关的类型声明*/,
    "allowJs": true /* 允许编译 javascript 文件。 */,
    "checkJs": true /* 报告 .js 文件中的错误。 */,
    "jsx": "preserve" /* 指定 JSX 代码生成：'preserve'、'react-native' 或 'react'。 */,
    "declaration": true /* 生成相应的“.d.ts”文件。 */,
    "declarationMap": true /* 为每个对应的“.d.ts”文件生成一个源映射。 */,
    "sourceMap": true /* 生成相应的“.map”文件。 */,
    "outFile": "./" /* 连接输出到单个文件。 */,
    "outDir": "./" /* 将输出结构重定向到目录。 */,
    "rootDir": "./" /* 指定输入文件的根目录。用于通过 --outDir 控制输出目录结构。 */,
    "composite": true /* 启用项目编译 */,
    "tsBuildInfoFile": "./" /* 指定文件存放增量编译信息 */,
    "removeComments": true /* 不要向输出发出注释。 */,
    "noEmit": true /* 不发出输出。 */,
    "importHelpers": true /* 从 'tslib' 导入发射助手。 */,
    "downlevelIteration": true /* 以“ES5”或“ES3”为目标时，为“for-of”、展开和解构中的迭代提供全面支持。 */,
    "isolatedModules": true /* 将每个文件转换为一个单独的模块（类似于 'ts.transpileModule'）。 */,

    /* 严格的类型检查选项 */
    "strict": true /* 启用所有严格的类型检查选项。 */,
    "noImplicitAny": true /* 使用隐含的“任何”类型在表达式和声明上引发错误。 */,
    "strictNullChecks": true /* 启用严格的空检查。 */,
    "strictFunctionTypes": true /* 启用函数类型的严格检查。 */,
    "strictBindCallApply": true /* 在函数上启用严格的“绑定”、“调用”和“应用”方法。 */,
    "strictPropertyInitialization": true /* 启用对类中属性初始化的严格检查。 */,
    "noImplicitThis": true /* 使用隐含的“any”类型在“this”表达式上引发错误。 */,
    "alwaysStrict": true /* 以严格模式解析并为每个源文件发出“使用严格”。 */,

    /* 额外检查 */
    "noUnusedLocals": true /* 报告未使用的本地人的错误。 */,
    "noUnusedParameters": true /* 报告未使用参数的错误。 */,
    "noImplicitReturns": true /* 不是函数中的所有代码路径都返回值时报告错误。 */,
    "noFallthroughCasesInSwitch": true /* 在 switch 语句中报告失败情况的错误。 */,

    /* 模块分辨率选项 */
    "moduleResolution": "node" /* 指定模块解析策略：'node' (Node.js) 或 'classic' (TypeScript pre-1.6)。 */,
    "baseUrl": "./" /* 解析非绝对模块名称的基目录。 */,
    "paths": {} /* 一系列将导入重新映射到相对于“baseUrl”的查找位置的条目。 */,
    "rootDirs": [] /* 根文件夹列表，其组合内容代表运行时项目的结构。 */,
    "typeRoots": [] /* 包含类型定义的文件夹列表。替换默认情况下的node_modules/@types 路径取类型定义 */,
    "types": [] /* 类型声明文件要包含在编译中。 默认情况下，所有 可见 的 ”@types” 包都将包含在你的编译过程中。 在 node_modules/@types 中的任何包都被认为是 可见 的。 例如，这意味着包含 ./node_modules/@types/，../node_modules/@types/，../../node_modules/@types/ 中所有的包。。 */,
    "allowSyntheticDefaultImports": true /* 允许从没有默认导出的模块中默认导入。 这不会影响代码发出，只是类型检查。 */,
    "esModuleInterop": true /* 通过为所有导入创建命名空间对象，在 CommonJS 和 ES 模块之间启用发射互操作性。 暗示“allowSyntheticDefaultImports”。 */,
    "preserveSymlinks": true /* 不解析符号链接的真实路径。 */,
    "allowUmdGlobalAccess": true /* 允许从模块访问 UMD 全局变量。 */,

    /* 源映射选项 */
    "sourceRoot": "" /* 指定调试器应该定位 TypeScript 文件而不是源位置的位置。 */,
    "mapRoot": "" /* 指定调试器应该定位映射文件而不是生成位置的位置。 */,
    "inlineSourceMap": true /* 发出带有源映射的单个文件而不是单独的文件。 */,
    "inlineSources": true /* 在单个文件中与源映射一起发出源； 需要设置“--inlineSourceMap”或“--sourceMap”。 */,

    /* 实验选项 */
    "experimentalDecorators": true /* 启用对 ES7 装饰器的实验性支持。 */,
    "emitDecoratorMetadata": true /* 为装饰器的发射类型元数据启用实验性支持。 */,

    /* 高级选项 */
    "skipLibCheck": true /* 跳过声明文件的类型检查。 */,
    "forceConsistentCasingInFileNames": true /* 禁止对同一文件的大小写不一致的引用。 */
  }
}
```

## 基础类型

联合类型: 多种类型用 | 隔开

1.  boolean
2.  number

3.  string

4.  数组 number[] / 泛型 `Array<number>  ReadonlyArray<T>`

5.  元组(Tuple) let x: [string, number];

6.  枚举

    ```ts
    enum Color {
      Red,
      Green,
      Blue
    } // 默认情况下，从0开始为元素编号。
    let c: Color = Color.Green // 1

    enum ColorEnum {
      Red = 1,
      Green,
      Blue
    }
    let colorName: string = ColorEnum[2] // 'Green'
    ```

7.  Any 不指定类型时 编译器默认 any 类型

8.  Void 当一个函数没有返回值时，你通常会见到其返回值类型是 void / 声明一个 void 类型的变量没有什么大用，因为你只能为它赋予 undefined 和 null

9.  undefined

10. null

11. never 类型表示的是那些永不存在的值的类型。比如那些总是会抛出异常或根本就不会有返回值

12. object 表示非原始类型, 不能是 number,string,boolean,symbol,null,undefined,void,never

```ts
let myObject: object
myObject = { name: 'Alice', age: 30 } // 合法
myObject = [1, 2, 3] // 合法
myObject = function () {} // 合法
// myObject = 'string'; // 非法，类型 'string' 不能赋值给类型 'object'
```

13. 字面量类型

```ts
let bl: 'male' | 'demale' = 'male' // bl 只能是这两个字符串
let person: { name: string; age: number }

person = {
  name: '12',
  age: 10
}
```

14. Object
    Object 是最顶层类型,包含所有类型

```ts
let obj1: Object
let obj2: object

obj1 = 42 // 合法
// obj2 = 42; // 非法
```

### 示例

@[code ts](./basisType.ts)

### 类型断言

语法格式: 值 as 类型 或者 <类型>值

```ts
let someValue: any = 'this is a string'
let strLength: number = (someValue as string).length
let strLength2: number = (<string>someValue).length
```

## 高级类型

### 交叉类型

同时满足两种类型

### 联合类型

表示一个值可以是几种类型之一 满足其一即可

- `number | string | boolean`表示一个值可以是`number`，`string`，或`boolean`。

### typeof 类型保护

`typeof`操作符用于获取变量的类型，因此操作符后面接的始终是一个变量。

### keyof

`keyof`操作符后面接一个类型，生成由`string`或者`number`组成的联合字面量类型。

### extends

- 类型继承
- 泛型约束

  ```ts
  interface Lengthwise {
    length: number
  }
  function logLength<T extends Lengthwise>(arg: T): T {
    console.log(arg.length)
    return arg
  }

  logLength({ length: 10, value: 3 }) // 输出：10
  ```

### 条件类型
T extends U？X：Y这个结构中，T是我们正在检查的类型，U是目标类型，如果 **T能赋值给U** ，那么条件为真，类型选择X，否则选择Y
```ts
// 过滤类型
type Filter<T, U> = T extends U ? never : T;
type Result = Filter<string | number | boolean, number>; // Result = string | boolean

// 类型检查 
type CheckType<T> = T extends string ? "string type" : "other type";
type Result1 = CheckType<string>;  // "string type"
type Result2 = CheckType<number>;  // "other type"
```

**新手常常搞混条件类型的应用场景和基本语法，例如认为T extends U中的extends是类型继承(其实是类型约束)**

### infer
推导泛型的真正类型
```ts
// 如果T是函数类型, 从T中提取返回值类型为R, ReturnType类型就是R T不是函数则为any
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

```

### 示例

@[code ts](./advancedType.ts)

## 类 Class

定义类

成员有三种属性修饰符

- public 公开属性; 默认的修饰符,表示属性可以在任何地方访问
- private 私有属性; 只能在类里面访问, 不能在类的实例和子类中访问
- protected 保护属性; 只能在类内部和子类里面访问, 不能在类的实例中访问

@[code ts](./class.ts)

### 抽象类

- 不能被实例化 专门用来被其他类继承的

- 抽象方法 没有方法体

## 函数

可选参数使用? 同接口

```tsx
function add(x: number, y: number): number {
  return x + y
}

let myAdd = function (x: number, y: number = 12): number {
  return x + y
}

// 剩余参数
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + ' ' + restOfName.join(' ')
}
```

## 接口

接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

```ts
interface LabelledValue {
  label: string
  color?: string //可选属性
  readonly x: number //只读属性;只能在声明时或者构造器中赋值!
  sayHi: () => string
  [propName: string]: any // 字符串索引签名
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label)
}
```

注意: 如果一个对象字面量存在任何“目标类型”不包含的属性时，你会得到一个错误。
解决:

- 最简便的方法是使用类型断言
- 最佳的方式是能够添加一个字符串索引签名, [propName: string]: any;

> 接口支持声明多次, 那么结果就是组合之后的内容 type 只能声明一次

### type 和 interface 区别

|          | type                  | interface                   |
| -------- | --------------------- | --------------------------- |
| 功能     | 类型别名,相对接口灵活 | 接口类型,多用于声明对象结构 |
|          | 可以给任意类型起别名  | 只能表示接口类型            |
| 多次定义 | type 不支持           | 会被视为合并所有声明成员    |
| 继承     | 不支持                | 支持                        |

### 示例

@[code ts](./interface.ts)

### 继承接口

```tsx
interface Shape {}
interface PenStroke {}
// 支持多接口继承
interface Square extends Shape, PenStroke {
  sideLength: number
}
```

## 泛型

@[code ts](./t.ts)

## 命名空间 namespace

`解决命名冲突问题` 命名空间定义了标识符的可见范围，一个标识符可在多个名字空间中定义，它在不同名字空间中的含义是互不相干的。

> 拒绝命名空间和模块化一起使用, 没啥意义; 不在推荐使用命名空间 请使用模块化

@[code ts](./namespace.ts)

## 声明文件

没使用 ts 书写的工具库在使用时, ts 不能知道他的类型和方法, 从而引申出了声明文件 .d.ts , 通常我们会把声明语句放到一个单独的文件（jQuery.d.ts）中，这就是声明文件

**declare 定义的类型只会用于编译时的检查，编译结果中会被删除。**

**只要 .ts 或 .d.ts 文件中有 import 或 export 导入导出命令(declare 内部的不算)，那么这个文件中的 declare 就会变成局部变量。**

- declare var 声明全局变量
- declare function 声明全局方法
- declare class 声明全局类
- declare enum 声明全局枚举类型
- declare namespace 声明（含有子属性的）全局对象 // declare namespace 还是比较常用的，它用来表示全局变量是一个对象，包含很多子属性。
- interface 和 type 声明类型/接口
- export 导出变量
- export namespace 导出（含有子属性的）对象
- export default ES6 默认导出
- export = commonjs 导出模块
- export as namespace UMD 库声明全局变量
- declare global 扩展全局变量, 申明全局类型
- declare module 扩展模块 https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
- /// <reference /> 三斜线指令

```tsx
declare var jQuery: (selector: string) => any // declare var 并没有真的定义一个变量，只是定义了全局变量 jQuery 的类型
declare namespace jQuery {
  function ajax(url: string, settings?: any): void
}

// 其他文件引入 <reference path = "xxx.d.ts" />
```

## 根据后端接口文档自动生成 ts 返回值类型

1. swagger-to-ts swaggts 等多个生成 typescript interface 代码的插件
2. Yeoman
3. Pont：阿里开源的一种前后端桥接工具
4. swagger-typescript-api
5. umi/openapi 直接生成 api 请求文件
6. openapi-typescript-codegen 支持只生成类型/请求/核心文件 在已有请求实例的时候 推荐使用这个生成 type 的功能

## vue 相关

首先 务必确保将扩展的模块放在 TypeScript 模块 中, 也就是说，拓展声明的代码文件需要包含至少一个顶级的 import 或 export，即使它只是 export {}。如果扩展被放在模块之外，它将覆盖原始类型，而不是扩展!

- 全局原型链属性: app.config.globalProperties 上赋值 ts 声明的话需要使用 ts 模块拓展功能拓展`ComponentCustomProperties` 接口
- 全局组件: 需要使用 ts 模块拓展功能 拓展模块`@vue/runtime-core`或者`vue` 的 `GlobalComponents`接口 例如:

  ```ts
  declare module 'vue' {
    /**
     * 自定义全局组件获得 Volar 提示（自定义的全局组件需要在这里声明下才能获得 Volar 类型提示哦）
     */
    export interface GlobalComponents {
      IconifyIconOffline: typeof import('../src/components/ReIcon')['IconifyIconOffline']
      IconifyIconOnline: typeof import('../src/components/ReIcon')['IconifyIconOnline']
      FontIcon: typeof import('../src/components/ReIcon')['FontIcon']
      Auth: typeof import('../src/components/ReAuth')['Auth']
    }
  }
  ```

- 拓展 windows

  ```ts
  // 拓展windows接口 这样window.$axios 类型可推断
  declare global {
    interface Window {
      $axios: AxiosInstance
    }
    // 声明全局变量 __APP__ 类型  就可以随处获取 __APP__ 变量
    const __APP__: {
      lastBuildTime: string
    }
  }
  ```

## 运算符

- ?? 严格的 || 运算 (0 ?? 1)返回 0
- ?. 对象属性存在时取值, 否则返回 undefined
- ? 接口声明时某个字段不是必须的
- !. 断言 告诉 ts 对象一定有某个属性 obj!.aa
- ! 非空断言运算符 用于断言操作的对象是非 null 和非 undefined 类型 ; obj.aa! 告诉 ts aa 属性一定不为空 list 声明的是数组类型 想要赋值为空时 list = null!
- !! 运算可以把表达式强行转换为逻辑值。

```ts
function test(params: number | undefined | null, callback: () => number | undefined) {
  const count = params! // 排除undefined 和null，不报错

  const number = callback!() // 除去undefined
}
```

## 技巧

- v-bind 时候绑定的对象类型? -> `Partial<组件Props类型>`
- button size 属性只能是几个字面量类型 -> 你也声明几个字面量类型
- el-date-picker 的 value 类型 ModelValueType
