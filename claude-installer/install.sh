#!/usr/bin/env bash
# Claude Code / Codex installer script (macOS / Linux / WSL)
set -euo pipefail

echo "=== Claude Code / Codex Installer ==="

# === 1. Proxy address (hardcoded default) ===
PROXY_ADDR="${PROXY_ADDR:-http://op.heroking.top:5002}"

# === 2. OS detection ===
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
echo "Detected OS: $OS"

# === 3. Proxy credentials ===
echo ""
echo "Proxy server: $PROXY_ADDR"
read -r -p "Proxy username: " PROXY_USER < /dev/tty
read -r -s -p "Proxy password: " PROXY_PASS < /dev/tty
echo ""

# === 4. Inject proxy env vars (current process + child processes) ===
# curl honors these natively, no extra wiring needed (unlike PowerShell)
PROXY_HOST_PORT="${PROXY_ADDR#http://}"
PROXY_HOST_PORT="${PROXY_HOST_PORT#https://}"
PROXY_URL="http://${PROXY_USER}:${PROXY_PASS}@${PROXY_HOST_PORT}"
export HTTP_PROXY="$PROXY_URL"
export HTTPS_PROXY="$PROXY_URL"
export ALL_PROXY="$PROXY_URL"
export http_proxy="$PROXY_URL"
export https_proxy="$PROXY_URL"
export all_proxy="$PROXY_URL"

# === 5. Proxy reachability check ===
echo ""
echo "Verifying proxy connectivity..."
HTTP_CODE="$(curl -sI -m 8 -o /dev/null -w '%{http_code}' https://claude.ai 2>/dev/null)" || HTTP_CODE="000"
if [[ ! "$HTTP_CODE" =~ ^(200|401|403|407)$ ]]; then
  echo "Proxy unreachable (HTTP $HTTP_CODE)"
  echo "Please check:"
  echo "  1. PROXY_ADDR is correct (current: $PROXY_ADDR)"
  echo "  2. Username and password are correct"
  echo "  3. openclash is running"
  echo "  4. Public IP has not changed"
  exit 1
fi
echo "Proxy reachable (HTTP $HTTP_CODE)"

# === 6. Helpers ===
# Persist ~/.local/bin into the appropriate shell rc file
persist_local_bin_path() {
  local LOCAL_BIN="$HOME/.local/bin"
  local RC_FILE=""

  # Pick rc file based on user's login shell ($SHELL)
  case "${SHELL:-}" in
    */zsh)  RC_FILE="$HOME/.zshrc" ;;
    */bash) RC_FILE="$HOME/.bashrc" ;;
    */fish) RC_FILE="$HOME/.config/fish/config.fish" ;;
    *)      RC_FILE="$HOME/.profile" ;;
  esac

  local EXPORT_LINE="export PATH=\"$LOCAL_BIN:\$PATH\""

  # Add to current session
  if [[ ":$PATH:" != *":$LOCAL_BIN:"* ]]; then
    export PATH="$LOCAL_BIN:$PATH"
    echo "Added to session PATH: $LOCAL_BIN"
  fi

  # Persist to rc file (idempotent)
  if [[ -n "$RC_FILE" ]]; then
    mkdir -p "$(dirname "$RC_FILE")"
    if [[ ! -f "$RC_FILE" ]] || ! grep -qF "$LOCAL_BIN" "$RC_FILE"; then
      printf '\n# Added by Claude Code installer\n%s\n' "$EXPORT_LINE" >> "$RC_FILE"
      echo "Persisted to $RC_FILE"
    fi
  fi
}

# === 7. Install functions ===
install_claudecode() {
  echo ""
  echo "--- Installing Claude Code ---"
  curl -fsSL https://claude.ai/install.sh | bash

  # Add ~/.local/bin to PATH (current shell + persistent rc file)
  if [[ -d "$HOME/.local/bin" ]]; then
    persist_local_bin_path
  else
    echo "Note: $HOME/.local/bin not found yet (may be created lazily on first use)"
  fi

  echo "--- Verifying Claude Code ---"
  if command -v claude >/dev/null 2>&1; then
    local CLAUDE_PATH
    CLAUDE_PATH="$(command -v claude)"
    "$CLAUDE_PATH" --version
    echo "Claude Code installed successfully ($CLAUDE_PATH)"
  else
    echo "Claude Code not available, see 04-troubleshooting.md"
    return 1
  fi
}

install_codex() {
  echo ""
  echo "--- Installing Codex ---"
  CODEX_URL="${CODEX_URL:-https://openai.com/codex/install.sh}"
  if ! curl -fsSL "$CODEX_URL" | bash 2>/dev/null; then
    echo "Official script failed, trying npm..."
    if command -v npm >/dev/null 2>&1; then
      npm i -g @openai/codex@latest
    else
      echo "npm not found. Please install Node.js: https://nodejs.org/"
      return 1
    fi
  fi
  echo "--- Verifying Codex ---"
  if command -v codex >/dev/null 2>&1; then
    codex --version
    echo "Codex installed successfully"
  else
    echo "Codex not available, see 04-troubleshooting.md"
    return 1
  fi
}

# === 8. Main menu loop ===
while true; do
  echo ""
  echo "Select tool to install:"
  echo "  [1] Claude Code"
  echo "  [2] Codex"
  echo "  [3] Install both"
  echo "  [0] Exit"
  read -r -p "Enter option [0-3]: " choice < /dev/tty
  case "$choice" in
    1) install_claudecode ;;
    2) install_codex ;;
    3) install_claudecode && install_codex ;;
    0) break ;;
    *) echo "Invalid option" ;;
  esac
done

echo ""
echo "=== Installation complete ==="
echo "Note: Proxy environment variables will be lost when the terminal is closed (not persistent)"
echo "Note: PATH changes have been written to your shell rc file; restart the terminal or 'source' it to take effect."
