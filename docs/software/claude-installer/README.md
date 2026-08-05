---
title: Claude Code / Codex 远程装机服务
---

# Claude Code / Codex 远程装机服务

> 闲鱼店铺面向客户的说明页。装机手自己用的内部 SOP 见同目录其他文章。

## 服务内容

远程帮你装好以下任一（或全部）：

| 工具 | 用途 | 装好后需要 |
|---|---|---|
| Claude Code | Anthropic 官方 CLI，可在终端直接与 Claude 编程 | 自备 API Key 或订阅 Pro/Max |
| Codex | OpenAI 官方 CLI，可在终端直接与 GPT 编程 | 自备 API Key 或 ChatGPT 订阅 |

## 适用对象

- 想用 AI 写代码但被网络环境卡住的人
- 不想自己折腾 Node.js、代理、官方安装脚本的人
- 公司电脑（IT 不让装软件）装不了的，先沟通

## 流程一览

1. **闲鱼下单**（拍下，自动发货）
2. **加微信 / 远程会话**（你提供远程工具账号，我远程控制）
3. **预检**（[01-precheck.md](./01-precheck.md)）
4. **装机**（我用对应 shell 的脚本，5-10 分钟）
5. **交付**（教你怎么登录、用 API Key、跑第一个命令）
6. **售后 7 天**（任何问题免费重装或答疑）

## 价格

- 单装一个工具：**XX 元**
- 两个都装：**XX 元**
- 7×24 答疑：**XX 元**（可选）

> 价格随时间调整，以闲鱼商品页为准。

## 装机需要什么

详见 [01-precheck.md](./01-precheck.md)。简单说：

- 一台能远程控制的电脑（macOS / Linux / WSL / Windows 都行）
- 你的公网 + 我家代理（我不会让你用自己的代理）
- 装机期间不要动电脑
- 装完后给我 5 分钟做交付讲解

## 装机用的脚本说明

我用的脚本是**开源放在家里的 nginx**（带密码）。你可以在 [03-script-usage.md](./03-script-usage.md) 看到具体怎么跑。

也可以**自助**（适合动手能力强的客户）：直接 [03-script-usage.md](./03-script-usage.md) 复制命令自己跑，但**需要我提供代理账号密码**。

## 故障与售后

详见 [04-troubleshooting.md](./04-troubleshooting.md)。

常见情况：
- 装到一半报错 → 我远程重装一次
- 装完用不了 → 大概率是 API Key 没配 / 网络环境问题
- 登录失败 → 看 04 troubleshooting
- 想退款 → 装机前随时退；装机后没成功跑通命令可退

## 联系

- 闲鱼：[店名](https://www.goofish.com/...)
- 微信：xxx（拍下后自动发送）

---

> 装机手内部 SOP：02-workflow.md / 03-script-usage.md / 04-troubleshooting.md
