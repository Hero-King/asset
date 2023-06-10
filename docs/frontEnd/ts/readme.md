# typescript

```shell
npm install -g typescript
tsc -v
tsc ***.ts  xxx.ts ddd.ts	// 编译ts -> js

```

## 配置文件 tsconfig.json

生成默认配置 `tsc --init`

```
{
  "compilerOptions": {
    /* 访问 https://aka.ms/tsconfig.json 以阅读有关此文件的更多信息 */
    /* tsconfig推荐 https://github.com/tsconfig/bases#centralized-recommendations-for-tsconfig-bases */



    /* 基本选项 */
    "incremental": true,                   /* 启用增量编译 */
    "target": "ESNEXT",                    /* 指定 ECMAScript 目标版本：'ES3'、'ES5'（默认）、'ES2015'、'ES2016'、'ES2017'、'ES2018'、'ES2019'、'ES2020' 或 'ESNEXT'。 */
    "module": "commonjs",                  /* 指定模块代码生成：“none”、“commonjs”、“amd”、“system”、“umd”、“es2015”、“es2020”或“ESNext”。 */
    "lib": [],                             /* 指定要包含在编译中的库文件。 */
    "allowJs": true,                       /* 允许编译 javascript 文件。 */
    "checkJs": true,                       /* 报告 .js 文件中的错误。 */
    "jsx": "preserve",                     /* 指定 JSX 代码生成：'preserve'、'react-native' 或 'react'。 */
    "declaration": true,                   /* 生成相应的“.d.ts”文件。 */
    "declarationMap": true,                /* 为每个对应的“.d.ts”文件生成一个源映射。 */
    "sourceMap": true,                     /* 生成相应的“.map”文件。 */
    "outFile": "./",                       /* 连接输出到单个文件。 */
    "outDir": "./",                        /* 将输出结构重定向到目录。 */
    "rootDir": "./",                       /* 指定输入文件的根目录。用于通过 --outDir 控制输出目录结构。 */
    "composite": true,                     /* 启用项目编译 */
    "tsBuildInfoFile": "./",               /* 指定文件存放增量编译信息 */
    "removeComments": true,                /* 不要向输出发出注释。 */
    "noEmit": true,                        /* 不发出输出。 */
    "importHelpers": true,                 /* 从 'tslib' 导入发射助手。 */
    "downlevelIteration": true,            /* 以“ES5”或“ES3”为目标时，为“for-of”、展开和解构中的迭代提供全面支持。 */
    "isolatedModules": true,               /* 将每个文件转换为一个单独的模块（类似于 'ts.transpileModule'）。 */


    /* 严格的类型检查选项 */
    "strict": true,                        /* 启用所有严格的类型检查选项。 */
    "noImplicitAny": true,                 /* 使用隐含的“任何”类型在表达式和声明上引发错误。 */
    "strictNullChecks": true,              /* 启用严格的空检查。 */
    "strictFunctionTypes": true,           /* 启用函数类型的严格检查。 */
    "strictBindCallApply": true,           /* 在函数上启用严格的“绑定”、“调用”和“应用”方法。 */
    "strictPropertyInitialization": true,  /* 启用对类中属性初始化的严格检查。 */
    "noImplicitThis": true,                /* 使用隐含的“any”类型在“this”表达式上引发错误。 */
    "alwaysStrict": true,                  /* 以严格模式解析并为每个源文件发出“使用严格”。 */


    /* 额外检查 */
    "noUnusedLocals": true,                /* 报告未使用的本地人的错误。 */
    "noUnusedParameters": true,            /* 报告未使用参数的错误。 */
    "noImplicitReturns": true,             /* 不是函数中的所有代码路径都返回值时报告错误。 */
    "noFallthroughCasesInSwitch": true,    /* 在 switch 语句中报告失败情况的错误。 */


    /* 模块分辨率选项 */
    "moduleResolution": "node",            /* 指定模块解析策略：'node' (Node.js) 或 'classic' (TypeScript pre-1.6)。 */
    "baseUrl": "./",                       /* 解析非绝对模块名称的基目录。 */
    "paths": {},                           /* 一系列将导入重新映射到相对于“baseUrl”的查找位置的条目。 */
    "rootDirs": [],                        /* 根文件夹列表，其组合内容代表运行时项目的结构。 */
    "typeRoots": [],                       /* 包含类型定义的文件夹列表。 */
    "types": [],                           /* 类型声明文件要包含在编译中。 */
    "allowSyntheticDefaultImports": true,  /* 允许从没有默认导出的模块中默认导入。 这不会影响代码发出，只是类型检查。 */
    "esModuleInterop": true,               /* 通过为所有导入创建命名空间对象，在 CommonJS 和 ES 模块之间启用发射互操作性。 暗示“allowSyntheticDefaultImports”。 */
    "preserveSymlinks": true,              /* 不解析符号链接的真实路径。 */
    "allowUmdGlobalAccess": true,          /* 允许从模块访问 UMD 全局变量。 */


    /* 源映射选项 */
    "sourceRoot": "",                      /* 指定调试器应该定位 TypeScript 文件而不是源位置的位置。 */
    "mapRoot": "",                         /* 指定调试器应该定位映射文件而不是生成位置的位置。 */
    "inlineSourceMap": true,               /* 发出带有源映射的单个文件而不是单独的文件。 */
    "inlineSources": true,                 /* 在单个文件中与源映射一起发出源； 需要设置“--inlineSourceMap”或“--sourceMap”。 */


    /* 实验选项 */
    "experimentalDecorators": true,        /* 启用对 ES7 装饰器的实验性支持。 */
    "emitDecoratorMetadata": true,         /* 为装饰器的发射类型元数据启用实验性支持。 */


    /* 高级选项 */
    "skipLibCheck": true,                     /* 跳过声明文件的类型检查。 */
    "forceConsistentCasingInFileNames": true  /* 禁止对同一文件的大小写不一致的引用。 */
  }
}

```

## 基础类型 
联合类型: 多种类型用 | 隔开  

1.  boolean 
2.  number

1. string

2. 数组 number[] / 泛型 Array<number>  ReadonlyArray<T>

3. 元组(Tuple) let x: [string, number];

4. 枚举
   ```ts
     enum Color {Red, Green, Blue} // 默认情况下，从0开始为元素编号。
     let c: Color = Color.Green;   // 1
   
     enum Color {Red = 1, Green, Blue}
     let colorName: string = Color[2]; // 'Green'
   
     console.log(colorName);  // 显示'Green'因为上面代码里它的值是2
   ```

5. Any

6. Void  当一个函数没有返回值时，你通常会见到其返回值类型是 void  / 声明一个void类型的变量没有什么大用，因为你只能为它赋予undefined和null

7. undefined

8. null

9. never类型表示的是那些永不存在的值的类型。比如那些总是会抛出异常或根本就不会有返回值

10. object

11. 字面量类型  

```
let bl: 'male' | 'demale' = 'male'  // bl 只能是这两个字符串
let person: {name: string, age: number}

person = {
    name: '12',
    age: 10,
}
```



### 类型断言

语法格式:   值 as 类型  或者   <类型>值

```ts
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
let strLength: number = (<string>someValue).length;
```

## 函数

可选参数使用?  同接口

```tsx
function add(x: number, y: number): number {
    return x + y;
}

let myAdd = function(x: number, y: number = 12 ): number { return x + y; };

// 剩余参数
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}
```



## 接口

接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。
```ts
interface LabelledValue {
  label: string;
  color?: string;  //可选属性
  readonly x: number;  //只读属性
  sayHi: ()=>string   
  [propName: string]: any; // 字符串索引签名

}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}
```

注意: 如果一个对象字面量存在任何“目标类型”不包含的属性时，你会得到一个错误。
解决: 
  - 最简便的方法是使用类型断言
  - 最佳的方式是能够添加一个字符串索引签名,  [propName: string]: any;

### 继承接口

interface Square extends Shape, PenStroke  {
    sideLength: number;
}



## 泛型

