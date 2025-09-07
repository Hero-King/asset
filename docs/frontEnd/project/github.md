# Github Notes

## Github Actions
自动化、自定义和执行软件开发工作流程,包括完整的CI/CD 功能


```markmap
# GitHub Actions

## 核心概念

### Workflow (工作流程)
- 项目 `.github/workflows` 中的 YAML 文件
- 由一个或多个 Jobs 构成

### Job (任务)
- 一个 Workflow 由一个或多个 Jobs 构成
- 可以串行/并行运行在独立的 Runner 中
- 可以指定依赖关系控制执行顺序

### Step (步骤)
- 每个 Job 由多个 Step 构成
- 一步步完成具体操作

### Action (动作)
- 每个 Step 可以执行一个或多个命令
- 可复用的工作单元

## Workflow 文件结构

### name
- Workflow 名称

### on
- 触发条件
  - push
  - pull_request
  - schedule
  - workflow_dispatch

### jobs
- jobs.<job_id>.name (任务名称)
- jobs.<job_id>.needs (依赖关系)
- jobs.<job_id>.runs-on (运行环境)
  - ubuntu-latest
  - windows-latest
  - macos-latest
- jobs.<job_id>.steps
  - name (步骤名称)
  - env (环境变量)
  - run (运行命令)
  - uses (调用可复用的工作流/Docker镜像)

## 关键特性
- 自动化 CI/CD
- 多平台支持
- 丰富的 Actions 市场
- 安全密钥管理

## 常见用途
- 自动化测试
- 自动部署
- 代码检查
- 定时任务
- 通知提醒

```





## Github Page

市场推荐的 action https://github.com/marketplace/actions/github-pages-action

### 项目 gh-pages 分支

github 提供了`公开`项目的 page 服务 配置路径为 Settings -> Pages

- 指定项目具体分支下某个目录为 page source
- 使用 github actions 将文件提交到 gh-pages 分支

### 部署

vuepress 官方部署教程 https://vuepress.vuejs.org/zh/guide/deploy.html#github-pages

### 绑定自定义域名

需要再项目根目录中添加`CNAME`文件, 内容为`自定义的域名`
