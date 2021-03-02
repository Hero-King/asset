### GitHub 提供的主要功能
- Git 仓库
- Issue 
```
Issue 功能，是将一个任务或问题分配给一个 Issue 进行追踪和管理
的功能。可以像 BUG 管理系统或 TiDD（Ticket-driven Development）的
Ticket 一样使用。
每一个功能更改或修正都对应一个 Issue，讨论或修正都以这个
Issue 为中心进行。只要查看 Issue，就能知道和这个更改相关的一切信
息，并以此进行管理。
在 Git 的提交信息中写上 Issue 的 ID（例如“#7”），GitHub 就会自
动生成从 Issue 到对应提交的链接。另外，只要按照特定的格式描述提
交信息，还可以关闭 Issue。
```
- Wiki
```
通过 Wiki 功能，任何人都能随时对一篇文章进行更改并保存，因
此可以多人共同完成一篇文章。该功能常用在开发文档或手册的编写
中。同时支持git管理
```
- Pull Request
```
开发者向 GitHub 的仓库推送更改或功能添加后，可以通过 Pull
Request 功能向别人的仓库提出申请，请求对方合并。

```

### 实际操作学习git
git diff 查看工作树和暂存区的差别
git diff HEAD 查看工作树和最新提交的差别
git branch 显示分支一览表
git log --graph——以图表形式查看分支
git reflog命令恢复到原先的状态
git commit --amend——修改提交信息

在日常开发中,往往会创建数个特性分支,同时在
此之外再保留一个随时可以发布软件的稳定分支。稳定分支的角色通常
由 master 分支担当

### Issue
开发者们为了跟踪 BUG 及进行软件相关讨论,进而方便管理,创建了 Issue。
- 发现软件的 BUG 并报告
- 有事想向作者询问、探讨
- 事先列出今后准备实施的任务

Issue 可以通过添加标签(Label)来进行整理。
#### 通过提交信息操作 Issue
- 在相关 Issue 中显示提交
在 Issue 一览表中我们可以看到,每一个 Issue 标题的下面都分配了
诸如“#24”的编号。只要在提交信息的描述中加入“#24”,就可以如
图 5.18 所示,在 Issue 中显示该提交的相关信息,使关联的提交一目了
然。这里只需轻轻点击一下便可以显示相应提交的具体内容,在代码审
查时省去了从大量提交日志中搜索相应提交的麻烦,非常方便。
- Close Issue
只要在该提交中以下列任意一种格式描述提交信息,对应的 Issue 就会被 Close。 fix #24  fixes #24   fixed #24  close #24 closed #24  resolve #24  resolved #24等等

Tasklist 语法
#本月要做的任务
- [ ] 完成图片
- [x] 完成部署工具的设置           --> 复选列表的样式
- [ ] 实现抽签功能
###  Pull Request
Pull Request 是自己修改源代码后,请求对方仓库采纳该修改时采取的一种行为。
<img src="img/pull request概念图.png"/>