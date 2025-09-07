# 前端工程

## 代码规范

### 识别几个常用工具

- [Husky](https://typicode.github.io/husky/zh/) 在git commit之前执行自定义命令, 可以对代码、文件等进行预设的检查，一旦检查不通过，就可以阻止当前的代码提交
- [Eslint](https://zh-hans.eslint.org/docs/latest/use/getting-started) 根据方案识别并报告 ECMAScript/JavaScript 代码问题的工具
- [Prettier](https://www.prettier.cn/docs/install.html) 代码格式化工具
- [Lint-staged](https://github.com/lint-staged/lint-staged?tab=readme-ov-file#configuration) 对暂存区代码执行自定义命令;  随着项目体量的增大，全量跑一次 lint 的时间越来越长。同时如果每一个人提交的代码都是通过了 lint 工具的格式化，仓库中的代码将都是规范的, 只需要对本次提交的代码做规范检查

**常规代码风格检查只需要在 .husky/pre-commit 文件中增加npx lint-staged 的脚本, 在package.json中配置lint-staged任务(根据不同的文件类型执行some linters, like ESLint or Prettier)即可**

### Prettier规则



