# Claude Code / Codex 安装服务设计文档

**日期**：2026-08-05
**作者**：HeroKing
**状态**：Draft (待用户审阅)

## 目标

为闲鱼上的"Claude Code / Codex 远程装机"服务提供：

1. **3 个自包含安装脚本**（按 shell 区分），托管在用户家中的 OpenWrt nginx（带 Basic Auth）
2. **4 篇 markdown 笔记**（作为 VuePress 博客文章），覆盖装机前调研、交付流程、脚本使用、问题排查

服务场景：客户下单 → 用户远程控制客户机器 → 在客户终端跑对应 shell 的脚本 → 装完交付。

## 决策摘要

| 决策点 | 选择 | 原因 |
|---|---|---|
| 执行模式 | 混合（用户默认跑，客户可自助） | 闲鱼客户能力参差不齐 |
| 入口架构 | 3 个自包含脚本 (sh/ps1/cmd) | 客户只需一个 URL，按 shell 选 |
| 代理地址 | 写死在脚本顶部 | 用户家中 openclash 地址固定 |
| 代理账号密码 | 运行时交互输入 | 安全 + 不持久化 |
| 代理持久化 | 不持久化（env var 随进程消失） | 用户明确要求 |
| Codex 安装 | 优先官方脚本，备选 `npm i -g @openai/codex@latest` | 鲁棒性 |
| 装完验证 | 仅运行 `<tool> --version` | 客户后续操作（登录/API Key）由用户口头指导 |
| 重跑语义 | 重跑 = 升级（官方脚本本身会覆盖） | 客户机器可能被多次装机 |
| 笔记位置 | `docs/software/claude-installer/` | 与现有 VuePress 博客集成 |
| 脚本位置 | `docs/.vuepress/public/claude-installer/` | 通过 public 目录，rsync 到 nginx |
| nginx 配置 | 不在 spec 范围（用户已有） | 用户已配置 OpenWrt nginx |

## 目录结构

```
asset/ (VuePress 博客仓库)
├── docs/
│   ├── software/
│   │   └── claude-installer/                 # 笔记 (blog 文章)
│   │       ├── README.md                     # 闲鱼服务说明 / 索引
│   │       ├── 01-precheck.md                # 装机前调研清单
│   │       ├── 02-workflow.md                # 交付流程与话术
│   │       ├── 03-script-usage.md            # 脚本使用手册
│   │       └── 04-troubleshooting.md         # 问题排查与售后
│   └── .vuepress/
│       ├── config.ts                         # 修改: 侧边栏加入 claude-installer
│       ├── sidebar.ts                        # 修改
│       └── public/
│           └── claude-installer/             # 脚本 (rsync 到 nginx)
│               ├── install.sh                # Mac/Linux/WSL 入口
│               ├── install.ps1               # Windows PowerShell 入口
│               ├── install.cmd               # Windows CMD 入口
│               └── VERSION                   # 脚本自身版本号
└── deploy/
    └── sync-to-nginx.sh                      # 一键 rsync 到 OpenWrt
```

## 3 个安装脚本的统一流程

每个脚本自包含，按以下顺序执行：

1. **打印版本**：`cat VERSION` 显示当前脚本版本
2. **OS 检测**：
   - `install.sh`：`uname -s` (Darwin/Linux) + `/proc/version` 含 `microsoft` (WSL)
   - `install.ps1`：`$IsMacOS` / `$IsLinux` / `$IsWindows`；WSL 通过 `wsl.exe --status` 或 `/proc/version` 存在性
   - `install.cmd`：`ver` + `wmic os get caption`；WSL 通过 `wsl.exe --status`
3. **代理提示**（脚本顶部 `PROXY_ADDR` 已写死）：
   - 提示输入用户名（明文）
   - 提示输入密码（隐藏输入）
4. **注入 env var**（本进程 + 子进程）：
   - 大写：`HTTP_PROXY`, `HTTPS_PROXY`, `ALL_PROXY`
   - 小写：`http_proxy`, `https_proxy`, `all_proxy`
5. **代理可达验证**：`curl -sI -m 8 https://claude.ai`
   - 返回 200/401/407 = 代理通
   - 超时/连接拒绝 = 立即退出并提示
6. **菜单交互**：
   - `[1] Claude Code`
   - `[2] Codex`
   - `[3] 两个都装`
   - `[0] 退出`
7. **执行安装**（详见下文）
8. **版本验证**：`<tool> --version`，成功显示版本号
9. **回到菜单**（或退出）
10. **退出** → 所有 env var 随进程消失

## Claude Code 安装

各 OS 调用官方脚本（与官网一致）：

| OS | 安装命令 |
|---|---|
| Mac / Linux / WSL | `curl -fsSL https://claude.ai/install.sh \| bash` |
| Windows PowerShell | `irm https://claude.ai/install.ps1 \| iex` |
| Windows CMD | `curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd` |

无 npm 备选（Claude Code 官方未提供 npm 路径）。如果官方脚本失败，让用户去查 04-troubleshooting.md。

## Codex 安装（双路径）

**主路径**（优先尝试官方脚本，URL 占位待用户确认）：

| OS | 安装命令 |
|---|---|
| Mac / Linux / WSL | `curl -fsSL <CODEX_INSTALL_URL_SH> \| bash` |
| Windows PowerShell | `irm <CODEX_INSTALL_URL_PS1> \| iex` |
| Windows CMD | `curl -fsSL <CODEX_INSTALL_URL_CMD> -o install.cmd && install.cmd && del install.cmd` |

**TODO**: 用户确认 Codex 官方 install 脚本的真实 URL。占位可写 `https://openai.com/codex/install.sh` 之类。

**备选路径**（主路径失败时）：

```bash
# Mac / Linux / WSL / Windows (跨平台 bash 风格)
if command -v npm >/dev/null 2>&1; then
  npm i -g @openai/codex@latest
else
  echo "❌ 未检测到 npm。请先安装 Node.js: https://nodejs.org/"
  exit 1
fi
```

PowerShell 版：
```powershell
if (Get-Command npm -ErrorAction SilentlyContinue) {
  npm i -g @openai/codex@latest
} else {
  Write-Host "❌ 未检测到 npm。请先安装 Node.js: https://nodejs.org/"
  exit 1
}
```

**备选路径前提**：用户的机器已装 Node.js。脚本不替用户装 Node（避免范围爆炸）。

## 关键实现细节

### 4.1 代理配置（脚本顶部写死）

每个脚本顶部有：
```bash
# TODO: 用户填入实际值
PROXY_ADDR="http://<你的公网IP或域名>:<openclash端口>"
```

`install.sh`:
```bash
read -p "代理用户名: " PROXY_USER
read -s -p "代理密码: " PROXY_PASS; echo
# 拼出带账号密码的代理 URL（去掉 PROXY_ADDR 里的协议前缀以拼接）
PROXY_HOST_PORT="${PROXY_ADDR#http://}"
PROXY_URL="http://${PROXY_USER}:${PROXY_PASS}@${PROXY_HOST_PORT}"
export HTTP_PROXY="$PROXY_URL" HTTPS_PROXY="$PROXY_URL" ALL_PROXY="$PROXY_URL"
export http_proxy="$PROXY_URL" https_proxy="$PROXY_URL" all_proxy="$PROXY_URL"
```

`install.ps1`:
```powershell
$PROXY_USER = Read-Host "代理用户名"
$PROXY_PASS_S = Read-Host "代理密码" -AsSecureString
$PROXY_PASS = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($PROXY_PASS_S))
$env:HTTP_PROXY = "http://${PROXY_USER}:${PROXY_PASS}@${PROXY_ADDR}"
# ... 同理 HTTPS_PROXY, ALL_PROXY
```

`install.cmd`:
```cmd
set /p PROXY_USER=代理用户名:
set /p PROXY_PASS=代理密码:
set HTTP_PROXY=http://%PROXY_USER%:%PROXY_PASS%@%PROXY_ADDR%
REM ... 同理 HTTPS_PROXY, ALL_PROXY 等
```

> **明文密码**: CMD 原生不支持隐藏输入。如果需要隐藏，调 PowerShell 子进程（`for /f ... in ('powershell -Command "Read-Host -AsSecureString ..."')`）但复杂度高。当前 spec 默认明文（用户决定）。

### 4.2 代理可达验证

所有 3 个脚本在注入 env 后立即测试：

```bash
curl -sI -m 8 https://claude.ai 2>&1 | head -1
# 期望: HTTP/2 200 (成功) 或 401/407 (代理通, 目标需要登录)
# 失败: 连接超时、连接拒绝、DNS 失败
```

如果失败，提示：
```
❌ 代理不可达
请检查:
1. PROXY_ADDR 是否正确（当前: $PROXY_ADDR）
2. 用户名密码是否正确
3. 你的 openclash 是否在运行
4. 公网 IP 是否变更（家庭宽带可能动态 IP）
```

### 4.3 OS 检测细节

**`install.sh`**:
```bash
OS=""
case "$(uname -s)" in
  Darwin) OS="mac" ;;
  Linux)
    if grep -qi microsoft /proc/version 2>/dev/null; then
      OS="wsl"
    else
      OS="linux"
    fi
    ;;
  *) OS="unknown" ;;
esac
```

**`install.ps1`**:
```powershell
$OS = "unknown"
if ($IsMacOS) { $OS = "mac" }
elseif ($IsLinux) {
  if (Test-Path /proc/version) {
    $content = Get-Content /proc/version -Raw
    if ($content -match "microsoft") { $OS = "wsl" } else { $OS = "linux" }
  } else { $OS = "linux" }
}
elseif ($IsWindows) {
  $wslStatus = wsl.exe --status 2>&1
  if ($LASTEXITCODE -eq 0) { $OS = "wsl" } else { $OS = "windows" }
}
```

**`install.cmd`**:
```cmd
ver | findstr /i "Windows" >nul && set OS=windows
wsl.exe --status >nul 2>&1 && set OS=wsl
REM macOS 不可能跑 CMD，所以不用考虑
```

### 4.4 字符编码

- `install.sh`: 默认 UTF-8，无需处理
- `install.ps1`: 脚本顶部加 `chcp 65001` 或 `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8`
- `install.cmd`: 脚本顶部加 `chcp 65001 > nul`

### 4.5 重跑（升级）语义

- 脚本无状态：不写注册表 / 不写 dotfiles / 不写 systemd unit
- 官方 install 脚本本身就是"装或升级"语义
- 客户机器跑第二次 = 自动升到最新版
- 跑完即用：`claude --version` / `codex --version` 立即可用

## 笔记大纲

### `README.md` (闲鱼服务说明)
- 服务介绍
- 报价
- 交付流程概述
- 4 篇文章的链接
- 联系方式

### `01-precheck.md` (装机前调研清单)
- 客户需要确认的 8 项：
  1. 操作系统 + 版本
  2. 是否为公司电脑（IT 限制？）
  3. 是否允许远程控制
  4. 是否有 Node.js（仅装 Codex 时需要）
  5. 是否有 Git
  6. 装哪个工具（Claude Code / Codex / 两者）
  7. 用途（编程 / 写作 / 其他）
  8. 时区（用于预约装机时间）
- 每项的确认方法（让客户怎么自查）

### `02-workflow.md` (交付流程与话术)
- 下单 → 接单 → 沟通需求 → 报价 → 付款 → 远程方式 → 装机 → 验收 → 售后
- 各阶段常用话术模板

### `03-script-usage.md` (脚本使用手册)
- 3 个脚本对应 3 种 shell
- 各平台的运行命令
- 截图示例
- 常见参数说明
- 注意事项

### `04-troubleshooting.md` (问题排查与售后)
- 代理失败的 5 种原因
- Node.js 缺失
- 官方脚本更新导致问题
- 装到一半报错
- 版本号对不上
- 客户后续登录问题
- 退款/重装政策

## 部署脚本

`deploy/sync-to-nginx.sh`:
```bash
#!/usr/bin/env bash
set -e
OPENWRT_HOST="${OPENWRT_HOST:-root@<TODO: 填入你的OpenWrt地址>}"
NGINX_PATH="${NGINX_PATH:-/www/claude-installer/}"

rsync -avz --delete \
  docs/.vuepress/public/claude-installer/ \
  "$OPENWRT_HOST:$NGINX_PATH"

echo "✅ 已同步到 $OPENWRT_HOST"
```

部署流程：
1. 编辑脚本（修改 PROXY_ADDR 写死的值）
2. 修改 VERSION（每次改动后 +1）
3. `bash deploy/sync-to-nginx.sh` 推送
4. 验证：浏览器访问 `https://<域名>/claude-installer/`，输入 nginx 密码，看到 3 个文件 + VERSION

## 客户实际使用命令

| 平台 | 命令 |
|---|---|
| macOS / Linux / WSL | `curl -fsSL https://<域名>/claude-installer/install.sh \| bash` |
| Windows PowerShell | `irm https://<域名>/claude-installer/install.ps1 \| iex` |
| Windows CMD | `curl -fsSL https://<域名>/claude-installer/install.cmd -o install.cmd && install.cmd && del install.cmd` |

## 范围外（明确不做）

- ❌ nginx 配置文件（用户已有）
- ❌ 自动替客户装 Node.js（让客户自装，避免范围爆炸）
- ❌ API Key 申请（用户口头指导）
- ❌ 客户登录流程（用户口头指导）
- ❌ 闲鱼订单管理（用户自己处理）
- ❌ 多语言支持（仅中文）
- ❌ Windows GUI 安装包
- ❌ 静默 / 无人值守安装（要求交互）

## 占位待填项 (TODO)

1. **PROXY_ADDR**: 用户的公网 IP:port（openclash HTTP 端口）
2. **Codex 官方 install URL**: 用户确认 OpenAI 是否提供 install.sh/.ps1/.cmd；URL 是什么
3. **OPENWRT_HOST**: 部署脚本中 OpenWrt 的 SSH 地址

## 验收标准

- [ ] 3 个脚本都能在干净环境（无 Claude Code / Codex）跑通
- [ ] 3 个脚本都能在已装环境跑通（= 升级）
- [ ] 代理失败时脚本立即退出，不浪费时间
- [ ] 退出后 `env \| grep -i proxy` 为空（确认不持久化）
- [ ] 5 篇笔记 (含 README) 全部写完
- [ ] 部署脚本 rsync 后能正常访问
- [ ] 每个脚本顶部显示 VERSION
- [ ] 中文字符不乱码（特别是 install.cmd）
