---
title: 01 装机前调研清单
---

# 装机前调研清单

> 装机手内部 SOP 第 1 步。下单后**先问完这 8 项再开工**，避免装机时翻车。

## 8 项必问

### 1. 操作系统 + 版本？

- **macOS**：`Apple 菜单 > 关于本机`，例如 macOS 14.5
- **Windows**：`设置 > 系统 > 系统信息`，例如 Windows 11 23H2
- **Linux**：发行版 + 内核版本，例如 Ubuntu 24.04 / 6.5.0
- **WSL**：`wsl.exe -l -v`，确认装了哪个发行版

为什么问：脚本会自动检测，但要确认客户没报错说"我也不知道"。

### 2. 公司电脑还是个人电脑？

- 公司电脑可能有 IT 限制（不让装软件、不让跑 curl 脚本）
- 装机前必须明确

为什么问：公司电脑可能装到一半被 IT 拦截。

### 3. 远程工具是否就绪？

- macOS：自带屏幕共享，或装 [ToDesk](https://www.todesk.com/) / [向日葵](https://sunlogin.oray.com/)
- Windows：自带远程桌面，或装 ToDesk / 向日葵
- Linux：要 ToDesk 或 ssh（推荐 ssh）

为什么问：装机全程需要远程控制客户的电脑。

### 4. 是否已有 Node.js（仅装 Codex 时需要）？

让客户跑：

```bash
node -v
npm -v
```

如果报错 `command not found` → 客户去 https://nodejs.org/ 装 LTS 版（推荐 20+），装机推迟到装好后。

为什么问：Codex 备选安装路径是 `npm i -g @openai/codex`，不替你装 Node。

### 5. 是否已有 Git？

让客户跑：

```bash
git --version
```

为什么问：Claude Code 和 Codex 在某些场景会调 git（例如初始化 repo），不强制但装了体验更好。

### 6. 装哪个工具？

- Claude Code（Anthropic）
- Codex（OpenAI）
- 两个都装

为什么问：避免重复劳动，菜单也对应。

### 7. 客户用途？

- 写代码（什么语言？）
- 写文档
- 学习
- 其他

为什么问：装机后交付讲解可以重点讲对应场景。

### 8. 装机时间窗？

- 装机通常 5-10 分钟，但加上交付讲解 10-15 分钟
- 客户有空的时间

为什么问：约定好时间避免客户被打扰。

## 装机前的最后确认

- [ ] 客户有 Node.js（如果装 Codex）
- [ ] 客户能远程控制
- [ ] 客户预留 15-30 分钟不被打扰
- [ ] 客户知道你用他家代理

确认后进 [02-workflow.md](./02-workflow.md)。
