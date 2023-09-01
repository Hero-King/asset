# 前端工程

## 代码规范

### ESlint

- vscode 安装 eslint 插件 实时检查
- npx eslint [options] [file|dir|glob]\*

  ```shell \
  # https://eslint.org/docs/latest/use/command-line-interface
  # Run on two files
  npx eslint file1.js file2.js
  # Run on multiple files
  npx eslint lib/\*\*

  npx eslint --ext .jsx,.js lib/

  ```

### husky

git hooks 是本地的，不会被同步到 git 仓库里。为了保证每个人的本地仓库都能执行预设的 git hooks，于是就有了 husky。
跳过git hook : git commit -m "XXX" --no-verify

它可以在项目中植入你设定的 git hooks，在 git 提交代码的前后，你预设的 git hooks 可以得到执行，以对代码、文件等进行预设的检查，一旦检查不通过，就可以阻止当前的代码提交，避免了不规范的代码和 git 提交出现在项目中。

https://typicode.github.io/husky/getting-started.html

安装完成就可以使用 git 提供的 hooks 功能

> 创建一个 hook : husky add <file> [cmd] 例如 `npx husky add .husky/pre-commit "npm test"`
>
> > file: 指定保存命令的文件，通常是在 .husky 目录下
> > cmd: 指定 git hooks 的名字，最常使用的是 pre-commit

### lint-staged

随着项目体量的增大，全量跑一次 lint 的时间越来越长。而我们都知道，如果每一个人提交的代码都是通过了 lint 工具的格式化，那么在一次提交的时候，可能没有规范化的文件，就仅仅是当前 developer 即将提交的这些。如果在一次提交的时候，只对这一部分代码做规范化，那将大大缩短 developer 提交代码的速度，于是就诞生了一个工具：lint-staged。

`就是只对git stage 缓存区中的文件`

安装 : npm i lint-staged -D
配置方式：   
- package.json 中的 lint-staged 配置项
- JSON 风格或 YML 风格的 .lintstagedrc
  - .lintstagedrc.json
  - .lintstagedrc.yaml
  - .lintstagedrc.yml
- .lintstagedrc.mjs 或 .lintstagedrc.config.mjs
- .lintstagedrc.cjs 或 .lintstagedrc.config.cjs
- lint-staged.js 或 lint-staged.config.js

因此要在 .husky/pre-commit 文件中增加执行 lint-staged 的命令
```
# 如果使用的是 npm/yarn 且 npm 版本为 v8 及以下，就加下面的命令
npx lint-staged

# 如果使用的是 npm/yarn 且 npm 版本为 v9 及以上，就加下面的命令
npm exec lint-staged

# 如果使用的是 pnpm，就加下面的命令
pnpm exec lint-staged

```