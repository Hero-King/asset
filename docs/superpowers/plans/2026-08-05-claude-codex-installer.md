# Claude Code / Codex Installer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 3 self-contained install scripts (bash / PowerShell / CMD) for Claude Code and Codex, plus 5 blog notes documenting the install service workflow, then ship them to the user's home OpenWrt nginx.

**Architecture:** Each install script is self-contained — detects OS, prompts for proxy credentials, injects env vars for the current process, verifies proxy reachability, then runs official install commands. Blog notes live in VuePress; scripts live in `docs/.vuepress/public/` so they get rsynced to nginx. Manual smoke tests after writing each script.

**Tech Stack:** Bash 3.2+, PowerShell 5.1+, Windows CMD, VuePress 2 (theme-hope), shellcheck, rsync.

**Spec:** `docs/superpowers/specs/2026-08-05-claude-codex-installer-design.md`

---

## File Structure

| File | Action | Purpose |
|---|---|---|
| `docs/software/claude-installer/README.md` | create | Blog index / Xianyu service page |
| `docs/software/claude-installer/01-precheck.md` | create | Pre-install survey checklist |
| `docs/software/claude-installer/02-workflow.md` | create | Delivery workflow & talking points |
| `docs/software/claude-installer/03-script-usage.md` | create | Script usage manual |
| `docs/software/claude-installer/04-troubleshooting.md` | create | Troubleshooting & after-sales |
| `docs/.vuepress/public/claude-installer/VERSION` | create | Version stamp shown by all 3 scripts |
| `docs/.vuepress/public/claude-installer/install.sh` | create | macOS / Linux / WSL self-contained installer |
| `docs/.vuepress/public/claude-installer/install.ps1` | create | Windows PowerShell self-contained installer |
| `docs/.vuepress/public/claude-installer/install.cmd` | create | Windows CMD self-contained installer |
| `deploy/sync-to-nginx.sh` | create | One-command rsync to OpenWrt |

The VuePress sidebar at `docs/.vuepress/sidebar.ts` is `'/software/': 'structure'`, so any new files in `docs/software/claude-installer/` are picked up automatically. **No sidebar config change needed.**

**Conventions for all 3 scripts:**
- Line 1 is shebang / `@echo off` (depending on shell)
- Hardcoded `PROXY_ADDR` at top with `# TODO:` marker
- Cat `VERSION` first
- Prompt for `PROXY_USER` and `PROXY_PASS` only
- Inject both upper- and lower-case `*_proxy` env vars for current process
- `curl -sI -m 8 https://claude.ai` to verify proxy, exit 1 on failure
- 4-option menu loop (1=Claude, 2=Codex, 3=both, 0=quit)
- Each tool install ends with `<tool> --version`; failure prints troubleshooting hint, does not abort loop

---

## Task 1: Scaffold directories + VERSION

**Files:**
- Create: `docs/.vuepress/public/claude-installer/VERSION`
- Create: `docs/.vuepress/public/claude-installer/` (the dir itself)
- Create: `docs/software/claude-installer/` (the dir itself)
- Create: `deploy/` (the dir itself)

- [ ] **Step 1: Create all three directories**

Run:
```bash
mkdir -p docs/.vuepress/public/claude-installer \
         docs/software/claude-installer \
         deploy
```

- [ ] **Step 2: Write initial VERSION file**

Create file `docs/.vuepress/public/claude-installer/VERSION` with content:
```
1.0.0
```

- [ ] **Step 3: Verify**

Run:
```bash
ls -la docs/.vuepress/public/claude-installer docs/software/claude-installer deploy
cat docs/.vuepress/public/claude-installer/VERSION
```

Expected: all three dirs exist, VERSION contains `1.0.0`.

- [ ] **Step 4: Commit**

```bash
git add docs/.vuepress/public/claude-installer/VERSION \
        docs/.vuepress/public/claude-installer \
        docs/software/claude-installer \
        deploy
git commit -m "chore: scaffold claude-installer directories and VERSION"
```

---

## Task 2: Write install.sh (macOS / Linux / WSL)

**Files:**
- Create: `docs/.vuepress/public/claude-installer/install.sh`

- [ ] **Step 1: Write install.sh**

Create `docs/.vuepress/public/claude-installer/install.sh` with this exact content:

```bash
#!/usr/bin/env bash
# Claude Code / Codex 一键安装脚本 (macOS / Linux / WSL)
# 配套: 同目录 VERSION 文件

set -euo pipefail

# === 0. 版本 ===
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERSION="$(cat "$SCRIPT_DIR/VERSION" 2>/dev/null | tr -d '[:space:]' || echo "unknown")"
echo "=== Claude Code / Codex Installer v$VERSION ==="

# === 1. 代理地址 (写死) ===
# TODO: 替换为你的实际代理地址 (openclash HTTP 端口, 通常 7890)
PROXY_ADDR="${PROXY_ADDR:-http://<TODO: 公网IP>:<openclash端口>}"

# === 2. OS 检测 ===
OS="unknown"
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
echo "检测到操作系统: $OS"

# === 3. 代理账号密码 ===
echo ""
echo "代理服务器: $PROXY_ADDR"
read -r -p "代理用户名: " PROXY_USER
read -r -s -p "代理密码: " PROXY_PASS
echo ""

# === 4. 注入 env var (本进程 + 子进程) ===
PROXY_HOST_PORT="${PROXY_ADDR#http://}"
PROXY_HOST_PORT="${PROXY_HOST_PORT#https://}"
PROXY_URL="http://${PROXY_USER}:${PROXY_PASS}@${PROXY_HOST_PORT}"
export HTTP_PROXY="$PROXY_URL"
export HTTPS_PROXY="$PROXY_URL"
export ALL_PROXY="$PROXY_URL"
export http_proxy="$PROXY_URL"
export https_proxy="$PROXY_URL"
export all_proxy="$PROXY_URL"

# === 5. 代理可达验证 ===
echo ""
echo "正在验证代理可达性..."
HTTP_CODE="$(curl -sI -m 8 -o /dev/null -w '%{http_code}' https://claude.ai || echo "000")"
if [[ ! "$HTTP_CODE" =~ ^(200|401|407)$ ]]; then
  echo "❌ 代理不可达 (HTTP $HTTP_CODE)"
  echo "请检查:"
  echo "  1. PROXY_ADDR 是否正确 (当前: $PROXY_ADDR)"
  echo "  2. 用户名密码是否正确"
  echo "  3. openclash 是否在运行"
  echo "  4. 公网 IP 是否变更"
  exit 1
fi
echo "✅ 代理可达 (HTTP $HTTP_CODE)"

# === 6. 安装函数 ===
install_claudecode() {
  echo ""
  echo "--- 安装 Claude Code ---"
  curl -fsSL https://claude.ai/install.sh | bash
  echo "--- 验证 Claude Code ---"
  if command -v claude >/dev/null 2>&1; then
    claude --version
    echo "✅ Claude Code 安装成功"
  else
    echo "❌ Claude Code 不可用，请查看 04-troubleshooting.md"
    return 1
  fi
}

install_codex() {
  echo ""
  echo "--- 安装 Codex ---"
  # TODO: 替换为 Codex 官方 URL (如不存在则走 npm fallback)
  CODEX_URL="${CODEX_URL:-https://openai.com/codex/install.sh}"
  if ! curl -fsSL "$CODEX_URL" | bash 2>/dev/null; then
    echo "官方脚本失败, 尝试 npm..."
    if command -v npm >/dev/null 2>&1; then
      npm i -g @openai/codex@latest
    else
      echo "❌ 未检测到 npm。请先安装 Node.js: https://nodejs.org/"
      return 1
    fi
  fi
  echo "--- 验证 Codex ---"
  if command -v codex >/dev/null 2>&1; then
    codex --version
    echo "✅ Codex 安装成功"
  else
    echo "❌ Codex 不可用，请查看 04-troubleshooting.md"
    return 1
  fi
}

# === 7. 主菜单循环 ===
while true; do
  echo ""
  echo "请选择要安装的工具:"
  echo "  [1] Claude Code"
  echo "  [2] Codex"
  echo "  [3] 两个都装"
  echo "  [0] 退出"
  read -r -p "输入选项 [0-3]: " choice
  case "$choice" in
    1) install_claudecode ;;
    2) install_codex ;;
    3) install_claudecode && install_codex ;;
    0) break ;;
    *) echo "无效选项" ;;
  esac
done

echo ""
echo "=== 安装完成 ==="
echo "注: 关闭终端后, 代理环境变量会自动消失 (未持久化)"
```

- [ ] **Step 2: Make executable**

Run:
```bash
chmod +x docs/.vuepress/public/claude-installer/install.sh
```

- [ ] **Step 3: Bash syntax check**

Run:
```bash
bash -n docs/.vuepress/public/claude-installer/install.sh
echo "syntax OK"
```

Expected: no error output, "syntax OK" printed.

- [ ] **Step 4: Run shellcheck (skip if not installed)**

Run (if shellcheck is available):
```bash
which shellcheck && shellcheck docs/.vuepress/public/claude-installer/install.sh || echo "shellcheck not installed, skipping"
```

Expected: either all-clear or warnings only (no errors). If errors, fix them.

- [ ] **Step 5: Smoke test the prompt flow (no real install)**

Run with a non-existent proxy to test the proxy-fail exit:
```bash
PROXY_ADDR="http://127.0.0.1:1" bash docs/.vuepress/public/claude-installer/install.sh <<< "test
test
3
" 2>&1 | head -20
```

Expected: prints "代理不可达", exits with code 1, does not reach the install functions.

- [ ] **Step 6: Commit**

```bash
git add docs/.vuepress/public/claude-installer/install.sh
git commit -m "feat(installer): add install.sh for mac/linux/wsl"
```

---

## Task 3: Write install.ps1 (Windows PowerShell)

**Files:**
- Create: `docs/.vuepress/public/claude-installer/install.ps1`

- [ ] **Step 1: Write install.ps1**

Create `docs/.vuepress/public/claude-installer/install.ps1` with this exact content:

```powershell
# Claude Code / Codex 一键安装脚本 (Windows PowerShell)
# 配套: 同目录 VERSION 文件

$ErrorActionPreference = "Stop"

# === 0. 版本 ===
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$VersionFile = Join-Path $ScriptDir "VERSION"
$Version = if (Test-Path $VersionFile) { (Get-Content $VersionFile -Raw).Trim() } else { "unknown" }
Write-Host "=== Claude Code / Codex Installer v$Version ==="

# === 1. 代理地址 (写死) ===
# TODO: 替换为你的实际代理地址 (openclash HTTP 端口, 通常 7890)
$PROXY_ADDR = if ($env:PROXY_ADDR) { $env:PROXY_ADDR } else { "http://<TODO: 公网IP>:<openclash端口>" }

# === 2. OS 检测 ===
$OS = "unknown"
if ($IsMacOS) {
  $OS = "mac"
} elseif ($IsLinux) {
  if (Test-Path /proc/version) {
    $content = Get-Content /proc/version -Raw
    if ($content -match "microsoft") { $OS = "wsl" } else { $OS = "linux" }
  } else { $OS = "linux" }
} elseif ($IsWindows) {
  $wslStatus = wsl.exe --status 2>&1
  if ($LASTEXITCODE -eq 0) { $OS = "wsl" } else { $OS = "windows" }
}
Write-Host "检测到操作系统: $OS"

# === 3. 代理账号密码 ===
Write-Host ""
Write-Host "代理服务器: $PROXY_ADDR"
$PROXY_USER = Read-Host "代理用户名"
$PROXY_PASS_S = Read-Host "代理密码" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($PROXY_PASS_S)
$PROXY_PASS = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)

# === 4. 注入 env var (本进程 + 子进程) ===
$PROXY_HOST_PORT = $PROXY_ADDR -replace "^https?://", ""
$PROXY_URL = "http://${PROXY_USER}:${PROXY_PASS}@${PROXY_HOST_PORT}"
$env:HTTP_PROXY = $PROXY_URL
$env:HTTPS_PROXY = $PROXY_URL
$env:ALL_PROXY = $PROXY_URL
$env:http_proxy = $PROXY_URL
$env:https_proxy = $PROXY_URL
$env:all_proxy = $PROXY_URL

# === 5. 代理可达验证 ===
Write-Host ""
Write-Host "正在验证代理可达性..."
try {
  $resp = Invoke-WebRequest -Uri "https://claude.ai" -Method Head -UseBasicParsing -TimeoutSec 8
  $code = [int]$resp.StatusCode
  if ($code -ne 200 -and $code -ne 401 -and $code -ne 407) {
    throw "Unexpected status code: $code"
  }
  Write-Host "✅ 代理可达 (HTTP $code)"
} catch {
  Write-Host "❌ 代理不可达"
  Write-Host "请检查:"
  Write-Host "  1. PROXY_ADDR 是否正确 (当前: $PROXY_ADDR)"
  Write-Host "  2. 用户名密码是否正确"
  Write-Host "  3. openclash 是否在运行"
  Write-Host "  4. 公网 IP 是否变更"
  exit 1
}

# === 6. 安装函数 ===
function Install-ClaudeCode {
  Write-Host ""
  Write-Host "--- 安装 Claude Code ---"
  Invoke-Expression (Invoke-WebRequest -Uri "https://claude.ai/install.ps1" -UseBasicParsing).Content
  Write-Host "--- 验证 Claude Code ---"
  if (Get-Command claude -ErrorAction SilentlyContinue) {
    claude --version
    Write-Host "✅ Claude Code 安装成功"
  } else {
    Write-Host "❌ Claude Code 不可用，请查看 04-troubleshooting.md"
    return 1
  }
}

function Install-Codex {
  Write-Host ""
  Write-Host "--- 安装 Codex ---"
  # TODO: 替换为 Codex 官方 URL (如不存在则走 npm fallback)
  $CODEX_URL = if ($env:CODEX_URL) { $env:CODEX_URL } else { "https://openai.com/codex/install.ps1" }
  try {
    Invoke-Expression (Invoke-WebRequest -Uri $CODEX_URL -UseBasicParsing).Content
  } catch {
    Write-Host "官方脚本失败, 尝试 npm..."
    if (Get-Command npm -ErrorAction SilentlyContinue) {
      npm i -g @openai/codex@latest
    } else {
      Write-Host "❌ 未检测到 npm。请先安装 Node.js: https://nodejs.org/"
      return 1
    }
  }
  Write-Host "--- 验证 Codex ---"
  if (Get-Command codex -ErrorAction SilentlyContinue) {
    codex --version
    Write-Host "✅ Codex 安装成功"
  } else {
    Write-Host "❌ Codex 不可用，请查看 04-troubleshooting.md"
    return 1
  }
}

# === 7. 主菜单循环 ===
while ($true) {
  Write-Host ""
  Write-Host "请选择要安装的工具:"
  Write-Host "  [1] Claude Code"
  Write-Host "  [2] Codex"
  Write-Host "  [3] 两个都装"
  Write-Host "  [0] 退出"
  $choice = Read-Host "输入选项 [0-3]"
  switch ($choice) {
    "1" { Install-ClaudeCode }
    "2" { Install-Codex }
    "3" { Install-ClaudeCode; Install-Codex }
    "0" { break }
    default { Write-Host "无效选项" }
  }
}

Write-Host ""
Write-Host "=== 安装完成 ==="
Write-Host "注: 关闭 PowerShell 后, 代理环境变量会自动消失 (未持久化)"
```

- [ ] **Step 2: PowerShell syntax check (macOS, if pwsh installed)**

Run (if `pwsh` is available):
```bash
which pwsh && pwsh -NoProfile -Command "
\$tokens = \$errors = \$null
[System.Management.Automation.Language.Parser]::ParseFile(
  'docs/.vuepress/public/claude-installer/install.ps1',
  [ref]\$tokens, [ref]\$errors) | Out-Null
if (\$errors) { \$errors | Write-Host; exit 1 } else { Write-Host 'syntax OK' }
" || echo "pwsh not installed, skipping (verify on Windows)"
```

Expected: "syntax OK" or skip message. If errors, fix them.

- [ ] **Step 3: Commit (do not smoke test on macOS — Windows-only)**

```bash
git add docs/.vuepress/public/claude-installer/install.ps1
git commit -m "feat(installer): add install.ps1 for Windows PowerShell"
```

> **Note:** Full smoke test of install.ps1 must run on Windows. The plan's final task includes a Windows-side manual check.

---

## Task 4: Write install.cmd (Windows CMD)

**Files:**
- Create: `docs/.vuepress/public/claude-installer/install.cmd`

- [ ] **Step 1: Write install.cmd**

Create `docs/.vuepress/public/claude-installer/install.cmd` with this exact content:

```cmd
@echo off
REM Claude Code / Codex 一键安装脚本 (Windows CMD)
REM 配套: 同目录 VERSION 文件

REM 字符编码 UTF-8
chcp 65001 > nul

REM === 0. 版本 ===
set "VERSION=unknown"
if exist "%~dp0VERSION" (
  for /f "usebackq delims=" %%v in ("%~dp0VERSION") do set "VERSION=%%v"
)
echo === Claude Code / Codex Installer v%VERSION% ===

REM === 1. 代理地址 (写死) ===
REM TODO: 替换为你的实际代理地址 (openclash HTTP 端口, 通常 7890)
if "%PROXY_ADDR%"=="" set "PROXY_ADDR=http://<TODO: 公网IP>:<openclash端口>"

REM === 2. OS 检测 ===
set "OS=windows"
wsl.exe --status >nul 2>&1
if %ERRORLEVEL%==0 set "OS=wsl"
ver | findstr /i "Windows" >nul
if %ERRORLEVEL% NEQ 0 set "OS=unknown"
echo 检测到操作系统: %OS%

REM === 3. 代理账号密码 (明文, CMD 无隐藏输入) ===
echo.
echo 代理服务器: %PROXY_ADDR%
set /p PROXY_USER=代理用户名:
set /p PROXY_PASS=代理密码:

REM === 4. 注入 env var (本进程 + 子进程) ===
REM PROXY_ADDR 形如 http://host:port; 去掉协议头
for /f "tokens=2 delims=/" %%a in ("%PROXY_ADDR%") do set "PROXY_HOST_PORT=%%a"
set "PROXY_URL=http://%PROXY_USER%:%PROXY_PASS%@%PROXY_HOST_PORT%"
set "HTTP_PROXY=%PROXY_URL%"
set "HTTPS_PROXY=%PROXY_URL%"
set "ALL_PROXY=%PROXY_URL%"
set "http_proxy=%PROXY_URL%"
set "https_proxy=%PROXY_URL%"
set "all_proxy=%PROXY_URL%"

REM === 5. 代理可达验证 ===
echo.
echo 正在验证代理可达性...
curl -sI -m 8 https://claude.ai >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo X 代理不可达
  echo 请检查:
  echo   1. PROXY_ADDR 是否正确 (当前: %PROXY_ADDR%)
  echo   2. 用户名密码是否正确
  echo   3. openclash 是否在运行
  echo   4. 公网 IP 是否变更
  pause
  exit /b 1
)
echo OK 代理可达

REM === 6. 主菜单循环 ===
:MENU
echo.
echo 请选择要安装的工具:
echo   [1] Claude Code
echo   [2] Codex
echo   [3] 两个都装
echo   [0] 退出
set /p CHOICE=输入选项 [0-3]: 
if "%CHOICE%"=="1" goto :INSTALL_CC
if "%CHOICE%"=="2" goto :INSTALL_CODEX
if "%CHOICE%"=="3" goto :INSTALL_BOTH
if "%CHOICE%"=="0" goto :END
echo 无效选项
goto :MENU

:INSTALL_CC
echo.
echo --- 安装 Claude Code ---
curl -fsSL https://claude.ai/install.cmd -o install.cmd
if %ERRORLEVEL%==0 call install.cmd
del install.cmd 2>nul
echo --- 验证 Claude Code ---
where claude >nul 2>&1
if %ERRORLEVEL%==0 (
  claude --version
  echo OK Claude Code 安装成功
) else (
  echo X Claude Code 不可用，请查看 04-troubleshooting.md
)
goto :MENU

:INSTALL_CODEX
echo.
echo --- 安装 Codex ---
REM TODO: 替换为 Codex 官方 URL
set "CODEX_URL=https://openai.com/codex/install.cmd"
curl -fsSL "%CODEX_URL%" -o install.cmd
if %ERRORLEVEL%==0 (
  call install.cmd
  del install.cmd 2>nul
) else (
  del install.cmd 2>nul
  echo 官方脚本失败, 尝试 npm...
  where npm >nul 2>&1
  if %ERRORLEVEL%==0 (
    npm i -g @openai/codex@latest
  ) else (
    echo X 未检测到 npm。请先安装 Node.js: https://nodejs.org/
  )
)
echo --- 验证 Codex ---
where codex >nul 2>&1
if %ERRORLEVEL%==0 (
  codex --version
  echo OK Codex 安装成功
) else (
  echo X Codex 不可用，请查看 04-troubleshooting.md
)
goto :MENU

:INSTALL_BOTH
call :INSTALL_CC
call :INSTALL_CODEX
goto :MENU

:END
echo.
echo === 安装完成 ===
echo 注: 关闭 CMD 后, 代理环境变量会自动消失 (未持久化)
exit /b 0
```

- [ ] **Step 2: Commit (cannot smoke test on macOS)**

```bash
git add docs/.vuepress/public/claude-installer/install.cmd
git commit -m "feat(installer): add install.cmd for Windows CMD"
```

> **Note:** `install.cmd` is Windows-only. The X/OK glyphs in echo lines are intentional UTF-8 (with `chcp 65001` at top) so the script reads cleanly on modern Windows terminals.

---

## Task 5: Write blog README.md (Xianyu service index)

**Files:**
- Create: `docs/software/claude-installer/README.md`

- [ ] **Step 1: Write README.md**

Create `docs/software/claude-installer/README.md` with this exact content:

```markdown
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
```

- [ ] **Step 2: Verify file structure**

Run:
```bash
ls -la docs/software/claude-installer/
```

Expected: README.md present, plus three other .md files from later tasks.

- [ ] **Step 3: Commit**

```bash
git add docs/software/claude-installer/README.md
git commit -m "docs(blog): add claude-installer README as Xianyu service page"
```

---

## Task 6: Write 01-precheck.md (pre-install survey)

**Files:**
- Create: `docs/software/claude-installer/01-precheck.md`

- [ ] **Step 1: Write 01-precheck.md**

Create `docs/software/claude-installer/01-precheck.md` with this exact content:

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add docs/software/claude-installer/01-precheck.md
git commit -m "docs(blog): add pre-install survey checklist"
```

---

## Task 7: Write 02-workflow.md (delivery workflow & talking points)

**Files:**
- Create: `docs/software/claude-installer/02-workflow.md`

- [ ] **Step 1: Write 02-workflow.md**

Create `docs/software/claude-installer/02-workflow.md` with this exact content:

```markdown
---
title: 02 交付流程与话术
---

# 交付流程与话术

> 装机手内部 SOP 第 2 步。覆盖从下单到售后的全流程话术。

## 全流程一览

```
[闲鱼下单]
    ↓
[自动发货 + 加微信]
    ↓
[预检 8 项]  ← 详见 01-precheck.md
    ↓
[约定装机时间]
    ↓
[客户准备远程]
    ↓
[装机手跑脚本, 5-10 分钟]
    ↓
[装完 --version 验证]
    ↓
[交付讲解, 10-15 分钟]
    ↓
[售后 7 天]
```

## 各阶段话术

### 接单后立即

> 您好，闲鱼这边已发货～麻烦加我微信 xxx，然后我会问您几个装机前的简单问题，整个过程 30 分钟内搞定。

### 预检阶段

按 [01-precheck.md](./01-precheck.md) 的 8 项问。**逐项问，不要一次发一长串**。

语气示例：
> 先问下您电脑系统，方便吗？比如 Mac 的话是哪个版本，Windows 11 还是 10？

### 约定时间后

> 好的，那我们约 [时间]。到时您电脑保持开机，开着远程工具就行。装机时不要动电脑，装好后我会教您怎么用。

### 装机开始时

> 我开始连了～会先看您电脑的 shell（终端），然后跑个脚本，会问您代理账号密码。密码我现场问您，您直接告诉我。

### 装机中如果客户问在做什么

> 我在帮您配置代理环境变量（用我家的代理，避开网络限制），然后调官方脚本装 Claude Code。装的过程您不用动。

### 装完交付

```
[5 步交付讲解]

1. claude --version     # 确认能用
2. claude login         # 跳浏览器登录 Anthropic 账号
3. claude               # 进入交互式, 让他试着问 "hi"
4. 怎么改默认模型: ~/.claude.json (可选)
5. 怎么升级: 重跑脚本就行
```

### 售后 7 天

> 这 7 天内有任何问题随时找我。常见问题在 [04-troubleshooting.md](./04-troubleshooting.md)，可以先自查。

## 容易踩的坑

- 客户没有 Node.js → 装 Codex 时报错 → 推迟装机
- 客户公司电脑 IT 拦截 → 提前沟通，看客户能否申请权限
- 客户公网 IP 变更 → 你家代理的 IP 变了 → 客户跑不通 → 改 PROXY_ADDR 重跑
- 客户不熟悉终端 → 你用向日葵/ToDesk 的"文件传输"功能把脚本传到桌面，让他双击运行 .ps1 / .cmd；bash 的让他打开终端粘贴命令
- 装机时间超时 → 客户赶时间 → 拆成 2 次：先装 Claude Code，下次再装 Codex

## 退款政策

- 装机前：随时退
- 装机后：脚本跑通 `--version` 看到版本号 → 不退
- 装机后：脚本跑失败 → 全退
- 装机后：客户用不了（API Key 问题、登录问题）→ 协助解决，不退

## 时间记录

- 装机耗时：约 [5-10] 分钟
- 交付讲解：约 [10-15] 分钟
- 一天最多接：[N] 单（取决于你的精力）
```

- [ ] **Step 2: Commit**

```bash
git add docs/software/claude-installer/02-workflow.md
git commit -m "docs(blog): add delivery workflow and talking points"
```

---

## Task 8: Write 03-script-usage.md (script usage manual)

**Files:**
- Create: `docs/software/claude-installer/03-script-usage.md`

- [ ] **Step 1: Write 03-script-usage.md**

Create `docs/software/claude-installer/03-script-usage.md` with this exact content:

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add docs/software/claude-installer/03-script-usage.md
git commit -m "docs(blog): add script usage manual"
```

---

## Task 9: Write 04-troubleshooting.md (troubleshooting & after-sales)

**Files:**
- Create: `docs/software/claude-installer/04-troubleshooting.md`

- [ ] **Step 1: Write 04-troubleshooting.md**

Create `docs/software/claude-installer/04-troubleshooting.md` with this exact content:

```markdown
---
title: 04 问题排查与售后
---

# 问题排查与售后

> 装机手内部 + 客户自助都参考。装机出问题先查这里。

## 装机阶段失败

### 症状：脚本提示 "代理不可达"

**5 个原因 + 检查方法**：

1. **`PROXY_ADDR` 错了**
   - 检查脚本顶部的 `PROXY_ADDR` 是否填对
   - 跑 `curl -v https://claude.ai` 看是连到哪里

2. **用户名密码错了**
   - 重新跑脚本，仔细输密码
   - bash/PowerShell 的密码是隐藏的，容易输错

3. **openclash 没在跑**
   - 远程登录 OpenWrt 看 openclash 状态
   - 跑 `curl -x http://user:pass@ip:port https://claude.ai` 测试

4. **公网 IP 变了**（家庭宽带常发生）
   - 看 OpenWrt 的 WAN IP
   - 改 `PROXY_ADDR` 里的 IP
   - 重跑脚本

5. **域名 DNS 解析失败**
   - `nslookup claude.ai` 看是否能解析
   - 如果用域名访问 nginx，确认 DNS 没问题

### 症状：装 Claude Code 报 "command not found" after install

**原因**：PATH 没更新

**解决**：

- bash：`source ~/.bashrc` 或 `source ~/.zshrc` 然后重试
- PowerShell：新开一个 PowerShell 窗口
- CMD：新开一个 CMD 窗口
- 如果还不行：手动加 PATH
  - macOS/Linux：`echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc`
  - Windows：设置 > 系统 > 关于 > 高级系统设置 > 环境变量

### 症状：装 Codex 报 "未检测到 npm"

**原因**：客户机器没装 Node.js

**解决**：

1. 让客户去 https://nodejs.org/ 装 LTS 版
2. 装完开新终端，验证 `node -v` 和 `npm -v`
3. 重跑脚本

### 症状：官方 install 脚本更新导致脚本失败

**原因**：Anthropic / OpenAI 改了官方 install 脚本的接口

**解决**：

1. 看脚本报错信息
2. 去 https://claude.ai/download 或 https://openai.com/codex 看最新文档
3. 改本仓库的 install.sh / .ps1 / .cmd 适配
4. 改 VERSION（+0.0.1）
5. 推送到 nginx

## 装完用不了

### 症状：claude / codex 命令能跑，但提示登录

**这是正常的**。装完只是工具，**还要登录**：

- Claude Code：跑 `claude` 进入交互，第一次会跳浏览器登录 Anthropic 账号
- Codex：跑 `codex` 进入交互，第一次会跳浏览器登录 OpenAI 账号

如果跳不出浏览器：

- macOS：检查默认浏览器设置
- Windows：检查默认浏览器
- 手动复制 URL 到浏览器登录

### 症状：登录了但跑命令报 "API Key not found"

**原因**：账号没绑 API Key，或者订阅没激活

**解决**：

- Claude Code：
  - 订阅 Pro/Max：在 https://claude.ai/settings 确认订阅状态
  - 用 API Key：在 `~/.claude.json` 里配 `apiKey`
- Codex：
  - 订阅 ChatGPT：在 https://chatgpt.com/ 确认订阅
  - 用 API Key：在环境变量 `OPENAI_API_KEY` 里设

### 症状：跑命令报网络错误 "connection refused" / "timeout"

**原因**：当前 shell 没有代理环境变量（脚本退出后 env var 消失了）

**解决**：

- 跑 `claude` / `codex` 命令**之前**，手动 export：
  ```bash
  export HTTP_PROXY=http://user:pass@ip:port
  export HTTPS_PROXY=http://user:pass@ip:port
  ```
- 或者让客户用**自己公司/家里的代理**（如果允许访问 api.anthropic.com / api.openai.com）
- 或者用 Claude Code / Codex 内部的代理设置（每个工具的 `~/.claude.json` / `~/.codex/config.toml` 有 proxy 配置）

### 症状：版本号对不上（脚本里 VERSION 和实际跑的不一样）

**原因**：nginx 上的脚本版本落后于本仓库

**解决**：

1. 在仓库里 `git pull`
2. `bash deploy/sync-to-nginx.sh` 推上去
3. 在 nginx 上确认 VERSION 文件更新

## 售后政策

- 7 天内任何装机问题 → 免费远程重装
- 7 天内任何 API Key / 登录问题 → 免费答疑
- 7 天后 → 收费 ¥XX / 次
- 永久 bug 反馈（脚本本身的问题）→ 免费修，VERSION + 0.0.1
```

- [ ] **Step 2: Commit**

```bash
git add docs/software/claude-installer/04-troubleshooting.md
git commit -m "docs(blog): add troubleshooting and after-sales doc"
```

---

## Task 10: Write deploy/sync-to-nginx.sh (rsync script)

**Files:**
- Create: `deploy/sync-to-nginx.sh`

- [ ] **Step 1: Write sync-to-nginx.sh**

Create `deploy/sync-to-nginx.sh` with this exact content:

```bash
#!/usr/bin/env bash
# 推送 docs/.vuepress/public/claude-installer/ 到 OpenWrt nginx
# 用法: bash deploy/sync-to-nginx.sh
#       OPENWRT_HOST=root@1.2.3.4 NGINX_PATH=/www/ci/ bash deploy/sync-to-nginx.sh

set -euo pipefail

# === 配置 (可被环境变量覆盖) ===
OPENWRT_HOST="${OPENWRT_HOST:-root@<TODO: 你的OpenWrt-SSH地址>}"
NGINX_PATH="${NGINX_PATH:-/www/claude-installer/}"
SOURCE_DIR="docs/.vuepress/public/claude-installer/"

# === 校验 ===
if [[ "$OPENWRT_HOST" == *"<TODO"* ]]; then
  echo "❌ 请先设置 OPENWRT_HOST 环境变量或编辑 deploy/sync-to-nginx.sh"
  echo "   例: OPENWRT_HOST=root@1.2.3.4 bash deploy/sync-to-nginx.sh"
  exit 1
fi

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "❌ 源目录不存在: $SOURCE_DIR"
  echo "   请先跑 Task 2/3/4 创建 install.sh/ps1/cmd"
  exit 1
fi

# === 同步 ===
echo "📦 同步 $SOURCE_DIR → $OPENWRT_HOST:$NGINX_PATH"
rsync -avz --delete \
  "$SOURCE_DIR" \
  "$OPENWRT_HOST:$NGINX_PATH"

echo ""
echo "✅ 同步完成"
echo "   验证: ssh $OPENWRT_HOST 'ls -la $NGINX_PATH'"
```

- [ ] **Step 2: Make executable + syntax check**

Run:
```bash
chmod +x deploy/sync-to-nginx.sh
bash -n deploy/sync-to-nginx.sh && echo "syntax OK"
```

Expected: "syntax OK".

- [ ] **Step 3: Verify placeholder guard works**

Run (should error out because no OPENWRT_HOST):
```bash
bash deploy/sync-to-nginx.sh 2>&1 | head -5
```

Expected: prints the "❌ 请先设置 OPENWRT_HOST" error and exits 1.

- [ ] **Step 4: Commit**

```bash
git add deploy/sync-to-nginx.sh
git commit -m "feat(deploy): add sync-to-nginx.sh for OpenWrt"
```

---

## Task 11: Verify VuePress picks up new subdirectory

**Files:**
- Read: `docs/.vuepress/sidebar.ts` (no change expected)

- [ ] **Step 1: Build the blog locally**

Run:
```bash
pnpm docs:dev
```

Expected: dev server starts without errors. Visit `http://localhost:8080/software/claude-installer/` in browser. Verify:

- README.md is the index page
- 01-precheck.md through 04-troubleshooting.md are listed
- Sidebar shows them in numerical order

- [ ] **Step 2: Stop the dev server**

Run (in the same shell where `pnpm docs:dev` is running, or in another shell):
```bash
# Find the process and kill it
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
```

Or use Ctrl+C in the dev server shell.

- [ ] **Step 3: No commit needed (no code change)**

This task is a verification step only. If sidebar doesn't show the new files, edit `docs/.vuepress/sidebar.ts` and add explicit entries — but per spec, the `structure` mode should handle it automatically.

---

## Task 12: End-to-end verification

**Files:** none (read-only verification)

- [ ] **Step 1: All scripts pass syntax checks**

Run:
```bash
echo "--- bash ---"
bash -n docs/.vuepress/public/claude-installer/install.sh && echo "OK"
echo "--- deploy ---"
bash -n deploy/sync-to-nginx.sh && echo "OK"
echo "--- ps1 ---"
if which pwsh >/dev/null 2>&1; then
  pwsh -NoProfile -Command "
\$t=\$e=\$null
[System.Management.Automation.Language.Parser]::ParseFile(
  'docs/.vuepress/public/claude-installer/install.ps1',[ref]\$t,[ref]\$e)|Out-Null
if(\$e){\$e|Write-Host;exit 1}else{Write-Host 'OK'}
"
else
  echo "SKIP (pwsh not installed)"
fi
```

Expected: "OK" for bash, "OK" or "SKIP" for ps1.

- [ ] **Step 2: All files exist with non-trivial size**

Run:
```bash
ls -la docs/.vuepress/public/claude-installer/ \
       docs/software/claude-installer/ \
       deploy/
wc -l docs/.vuepress/public/claude-installer/install.* \
      deploy/sync-to-nginx.sh \
      docs/software/claude-installer/*.md
```

Expected: all files present, no zero-byte files, install scripts > 80 lines each.

- [ ] **Step 3: Git log shows 10+ commits**

Run:
```bash
git log --oneline -15
```

Expected: this plan's tasks each produced one commit. (Spec commits from earlier session are also visible.)

- [ ] **Step 4: Final manual smoke test on macOS / Linux**

Run with a fake proxy (will fail at proxy check, proving the script runs up to that point):
```bash
PROXY_ADDR="http://127.0.0.1:1" bash docs/.vuepress/public/claude-installer/install.sh <<< $'baduser\nbadpass\n3\n'
echo "exit code: $?"
```

Expected: prints the proxy-fail error, exits with code 1. Confirms the script starts, reads input, sets env, runs the proxy check, and exits cleanly on failure.

- [ ] **Step 5: Plan complete**

Report to user:
- All 10 file tasks done
- 3 install scripts pass syntax checks
- 5 blog notes are in place
- 1 deploy script is in place
- VuePress auto-picks up the new subdirectory
- Ready to: edit `PROXY_ADDR` in 3 scripts + edit `OPENWRT_HOST` in deploy, then `bash deploy/sync-to-nginx.sh` to ship

---

## What's NOT in this plan

Per the spec, these are **out of scope** and intentionally omitted:

- nginx server config (user has it)
- Auto-installing Node.js for the customer
- API key / login flow walkthrough
- Xianyu order management
- Multi-language
- Windows GUI installer
- Silent / unattended install (interactivity is required)

## Open placeholders the user must fill before deploy

These are marked `# TODO:` in the source files. They will not break syntax checks, but the scripts will not work until replaced:

1. `PROXY_ADDR` in `install.sh`, `install.ps1`, `install.cmd` — your public IP:port
2. `CODEX_URL` in all 3 scripts — confirm OpenAI's official install URL
3. `OPENWRT_HOST` in `deploy/sync-to-nginx.sh` — your OpenWrt SSH address
