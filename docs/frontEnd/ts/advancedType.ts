let lolo = {
  name: 'zhanhsan',
  age: 18,
  child: {
    name: 'zhangsansan',
    like: true,
    age: 12
  }
}

type Lolo = typeof lolo
// {
//   name: string;
//   age: number;
//   child: {
//       name: string;
//       like: boolean;
//       age: number;
//   };
// }

type Lolochild = typeof lolo.child
// {
//   name: string;
//   like: boolean;
//   age: number;
// }

type keyOfTest = keyof Lolo // "name" | "age" | "child"

const key1: keyOfTest = 'age'
const key2: keyOfTest = 'child'
// const key3: keyOfTest = "error"    // error 不可以

enum HttpMethod {
  Get,
  Post
}

type Methods = typeof HttpMethod
const meth: Methods = {
  Get: 0,
  Post: 10
}

type Meth = keyof typeof HttpMethod //  "Get" | "Post"

type A = keyof any //  string | number | symbol

/**
 * in
 * in的右侧一般会跟一个联合类型，使用in操作符可以对该联合类型进行迭代。 其作用类似JS中的for...in或者for...of
 */
type inTest = {
  [key in keyOfTest]: string
}
// {name: string; age: string; child: string; }

/**
 * Partial 
 * 将某个类型里的属性全部变为可选项
 * 有局限性的，只能处理一层
 * T[P] 接口T中p属性的类型
 * type Partial<T> = {
    [P in keyof T]?: T[P]
}
 */

/**
 * Required
 * 和Partial的作用相反，是为了将某个类型里的属性全部变为必选的
 * type Required<T> = {
    [P in keyof T]-?: T[P];
};
 */

/**
 * readonly
 * 让传入类型中的所有属性变成都是只读的（不能修改属性）
 */

/**
 * Pick
 * 从 T 中取出 一系列 K 的属性
 * type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
 */
type PickTest = Pick<Lolo, 'name'> // {name: string}

/**
 * Record
 * 构建一个类型，这个类型用来描述一个对象，这个对象的属性都具有相同的类型
 * type Record<K extends keyof any, T> = {
    [P in K]: T;
};
 */
const student1: Record<string, any> = {
  name: '张三',
  age: 20
}

/**
 * Exclude<T, U> -- 从T中剔除可以赋值给U的类型。
 * 排除相同的，留下不同的
 * type Exclude<T, U> = T extends U ? never : T;
 */
type exc = Exclude<1 | 2, 1 | 3> // => 2

/**
 * Extract<T, U> -- 提取T中可以赋值给U的类型。
 * 与Exclude相反，针对联合类型，排除不同的的，取出相同的
 * type Extract<T, U> = T extends U ? T : never;
 */
type T01 = Extract<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'> // "a" | "c"

/**
 * Omit
 * 未包含
 * type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
 */
type Foo = Omit<{ name: string; age: number }, 'name'> // -> { age: number }

/**
 * NonNullable<T> -- 从T中剔除null和undefined
 */
type T04 = NonNullable<string | number | undefined> // string | number

/**
 * Uppercase（大写）
 * Lowercase（小写）
 * Capitalize（首字母大写）
 * Uncapitalize（首字母小写）
 */
let upcase: Uppercase<T01> = "A"
let lowercase: Lowercase<T01> = "a"

/**
 * ReturnType
 * 获取传入函数的返回类型
 */

/**
 * Parameters
 * 获取传入函数的参数组成的类型
 */

const fun = (a, b): number => {
  return 0
}
let returnTest: ReturnType<typeof fun> // number
