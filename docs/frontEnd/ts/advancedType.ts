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

const key1: keyof Lolo = 'age'
const key2: keyof Lolo = 'child'
// const key3: keyof Lolo = "error"    // error 不可以

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
