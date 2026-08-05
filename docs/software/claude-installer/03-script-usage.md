---
title: 03 脚本使用手册
---

# 脚本使用手册

> 装机手内部 + 客户自助都参考。3 个脚本对应 3 种 shell。

## 快速命令

| 平台 | 命令 |
|---|---|
| macOS / Linux / WSL | `curl -fsSL https://<你的域名>/claude-installer/install.sh \| bash` |
| Windows PowerShell | `irm https://<你的域名>/claude-installer/install.ps1 \| iex` |
| Windows CMD | `curl -fsSL https://<你的域名>/claude-installer/install.cmd -o install.cmd && install.cmd && del install.cmd` |

> 客户自助时：把上面的 `<你的域名>` 替换成你 nginx 域名。装机时直接告诉他选哪个。

## 菜单交互

跑脚本后弹出菜单：

```
请选择要安装的工具:
  [1] Claude Code
  [2] Codex
  [3] 两个都装
  [0] 退出
```

输入 1-3 选要装的工具；装完一个会回到菜单。输入 0 退出。

## 代理账号密码

脚本顶部 `PROXY_ADDR` 已写死你的 openclash 地址。运行时**只问账号密码**，不暴露地址。

**注意**：

- bash 和 PowerShell 的密码**隐藏输入**（看不到星号）
- CMD 的密码**明文输入**（CMD 原生不支持隐藏）
- 密码只在本进程有效，关掉终端就消失（**不持久化**）

## 装前自动验证

脚本会在装之前先 `curl` 一下 `https://claude.ai` 验证代理通不通：

- 通：继续装
- 不通：立即退出，提示检查：
  1. `PROXY_ADDR` 是否正确
  2. 用户名密码是否正确
  3. openclash 是否在运行
  4. 公网 IP 是否变更

## 装完验证

每个工具装完会跑 `<tool> --version`。看到版本号 = 成功。

如果报错（找不到命令），去看 [04-troubleshooting.md](./04-troubleshooting.md)。

## 重跑 = 升级

脚本不区分"全新装"和"已装"。重跑 = 调官方升级脚本，会自动升到最新版。

- 客户机器跑了第二次 = 自动升级
- 删了脚本本地副本再重跑 = 重新拉最新

所以脚本**完全无状态**。

## 自助安装注意事项

如果客户**自助**（不是装机手跑），要：

1. 把 nginx 域名和密码发给客户（用闲鱼 IM 或微信）
2. 让客户用上面的命令跑
3. 让客户准备好代理账号密码（你提供或客户自己提供）
4. 装完截图给你确认
5. 交付讲解走远程（微信语音 / 向日葵 / ToDesk）

## 客户常见疑问

### "为什么不能用公司代理？"

> 我家代理是专门给 AI 工具调优过的，公司代理一般会拦截或限速。装机时用我家的，**装完后你切回公司代理也能用**（只要 Claude Code / Codex 的 API 不被公司代理拦截）。如果被拦截，需要让公司 IT 加白名单。

### "代理账号密码安全吗？"

> 只在本次装机过程用，**不会保存到任何配置文件**。关掉终端就消失。如果担心，装完你也可以改密码。

### "会不会装到一半把我电脑搞坏？"

> 不会。脚本只装 Claude Code / Codex 两个工具，不改系统设置，不写注册表（Windows 装在用户目录）。如果要卸载，删掉 `~/.claude` / `~/.codex` 目录和 PATH 里的可执行文件即可。

### "升级怎么办？"

> 重跑脚本就行。会覆盖为最新版。

## 截图示例

> 截图位置：`docs/.vuepress/public/claude-installer/screenshots/`
>
> 建议在 3 个平台各截 3 张图：菜单、装 Claude Code、装 Codex。如果有就先放着，没时间可以晚点补。
