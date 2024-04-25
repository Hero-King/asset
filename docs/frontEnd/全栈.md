# 全栈

如何成为一个全栈工程师? 前端开发何去何从

## JS 框架概览

### 前端

- nuxt.js 用于 Vue 服务端渲染, 静态站点的框架
- next.js 用于 React 服务端渲染,静态站点,客户端渲染的框架

### 后端

- express
- nest 基于 express,类似于 spring 框架, Nest.js 是一个基于 TypeScript 的 Node.js 后端框架，它结合了 OOP（面向对象编程）、FP（函数式编程）和 FRP（函数式响应式编程）等概念，提供了一个优雅且强大的开发平台。

#### nodejs orm 框架

- TypeORM 是一个面向 TypeScript 和 JavaScript 的 ORM 框架，它支持多种数据库，包括 MySQL、PostgreSQL、SQLite 和 Microsoft SQL Server。它提供了实体映射、关联关系、事务支持等功能。
- Sequelize: Sequelize 是一个基于 Promise 的 ORM 框架，支持多种数据库，包括 MySQL、PostgreSQL、SQLite 和 MSSQL。它提供了丰富的功能，包括模型定义、关联关系、事务支持、数据验证等

## 技术选型

- nestjs + typeorm + mysql 进阶后端开发 `npm install --save @nestjs/typeorm typeorm mysql2`

### Nestjs

查看帮助 `nest --help`

项目创建

- nest create 项目名称
- pnpm run start:dev 启动开发
- nest g res `<name>` 生成 res 资源

### 重要概念

- 控制器@Controller: 路由
- 提供器@providers: 由 Nestjs 容器管理的 js 类, 框架负责实例化, 管理其生命周期, 作为依赖注入的类
- module@Module: nest 组织应用的方式, 应用至少需要有一个根模块
  - providers: 将由 Nest 注入器实例化并且至少可以在该模块中共享的提供程序
  - controllers: 此模块中定义的必须实例化的控制器集
  - imports: 导出此模块所需的提供程序的导入模块列表
  - exports: 这个模块提供的 providers 的子集应该在导入这个模块的其他模块中可用。你可以使用提供器本身或仅使用其令牌（provide 值）

### 模块

下述中的 `js类` 其实是为框架读取使用, 真正导出导入的是容器中帮我们创建好的实例

- 共享模块: 使用 @Module.exports 导出 `js类`, 其他需要使用的模块中 @Module.import
- 全局模块: 在模块上使用@Global()注解, 其他模块直接注入`js类`即可, 不需要在@Module.import
- 动态模块: 编写模块类, 实现forRoot静态方法, 返回模块配置对象即可
