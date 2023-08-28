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
 * Pick
 * 从 T 中取出 一系列 K 的属性
 * type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
 */


// https://zhuanlan.zhihu.com/p/296277982#:~:text=ts%E5%86%85%E7%BD%AE%E7%B1%BB%E5%9E%8B%201%20Partial%20%E5%B0%86%E5%85%B6%E5%8F%98%E4%B8%BA%E5%8F%AF%E9%80%89%20type%20Partial%3CT%3E%20%3D%20%7B,key%20value%E7%B1%BB%E5%9E%8B%20...%208%20ReturnType%20%E5%8F%8D%E8%A7%A3%20...%20%E6%9B%B4%E5%A4%9A%E9%A1%B9%E7%9B%AE
