#!/usr/bin/env bash
# Claude Code / Codex 一键安装脚本 (macOS / Linux / WSL)
# 配套: 同目录 VERSION 文件

set -euo pipefail

# === 0. 版本 ===
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERSION="$(cat "$SCRIPT_DIR/VERSION" 2>/dev/null | tr -d '[:space:]' || echo "unknown")"
echo "=== Claude Code / Codex Installer v$VERSION ==="

# === 1. 代理地址 (写死) ===
PROXY_ADDR="${PROXY_ADDR:-http://op.heroking.top:5002}"

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
read -r -p "代理用户名: " PROXY_USER < /dev/tty
read -r -s -p "代理密码: " PROXY_PASS < /dev/tty
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
HTTP_CODE="$(curl -sI -m 8 -o /dev/null -w '%{http_code}' https://claude.ai 2>/dev/null)" || HTTP_CODE="000"
if [[ ! "$HTTP_CODE" =~ ^(200|401|403|407)$ ]]; then
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
  read -r -p "输入选项 [0-3]: " choice < /dev/tty
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
