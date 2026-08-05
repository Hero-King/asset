# Claude Code / Codex 一键安装脚本 (Windows PowerShell)
# 配套: 同目录 VERSION 文件

$ErrorActionPreference = "Stop"

# === 0. 版本 ===
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$VersionFile = Join-Path $ScriptDir "VERSION"
$Version = if (Test-Path $VersionFile) { (Get-Content $VersionFile -Raw).Trim() } else { "unknown" }
Write-Host "=== Claude Code / Codex Installer v$Version ==="

# === 1. 代理地址 (写死) ===
$PROXY_ADDR = if ($env:PROXY_ADDR) { $env:PROXY_ADDR } else { "http://op.heroking.top:5002" }

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
  if ($code -ne 200 -and $code -ne 401 -and $code -ne 407 -and $code -ne 403) {
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