# Claude Code / Codex installer script (Windows PowerShell)
$ErrorActionPreference = "Stop"

Write-Host "=== Claude Code / Codex Installer ==="

# === 1. Proxy address (hardcoded default) ===
$PROXY_ADDR = if ($env:PROXY_ADDR) { $env:PROXY_ADDR } else { "http://op.heroking.top:5002" }

# === 2. OS detection ===
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
Write-Host "Detected OS: $OS"

# === 3. Proxy credentials ===
Write-Host ""
Write-Host "Proxy server: $PROXY_ADDR"
$PROXY_USER = Read-Host "Proxy username"
$PROXY_PASS_S = Read-Host "Proxy password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($PROXY_PASS_S)
$PROXY_PASS = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)

# === 4. Inject proxy env vars (current process + child processes) ===
$PROXY_HOST_PORT = $PROXY_ADDR -replace "^https?://", ""
$PROXY_URL = "http://${PROXY_USER}:${PROXY_PASS}@${PROXY_HOST_PORT}"
$env:HTTP_PROXY = $PROXY_URL
$env:HTTPS_PROXY = $PROXY_URL
$env:ALL_PROXY = $PROXY_URL
$env:http_proxy = $PROXY_URL
$env:https_proxy = $PROXY_URL
$env:all_proxy = $PROXY_URL

# === 5. Proxy reachability check ===
Write-Host ""
Write-Host "Verifying proxy connectivity..."
try {
  $resp = Invoke-WebRequest -Uri "https://claude.ai" -Method Head -UseBasicParsing -TimeoutSec 8
  $code = [int]$resp.StatusCode
  if ($code -ne 200 -and $code -ne 401 -and $code -ne 407 -and $code -ne 403) {
    throw "Unexpected status code: $code"
  }
  Write-Host "Proxy reachable (HTTP $code)"
} catch {
  Write-Host "Proxy unreachable"
  Write-Host "Please check:"
  Write-Host "  1. PROXY_ADDR is correct (current: $PROXY_ADDR)"
  Write-Host "  2. Username and password are correct"
  Write-Host "  3. openclash is running"
  Write-Host "  4. Public IP has not changed"
  return
}

# === 6. Install functions ===
function Install-ClaudeCode {
  Write-Host ""
  Write-Host "--- Installing Claude Code ---"
  Invoke-Expression (Invoke-WebRequest -Uri "https://claude.ai/install.ps1" -UseBasicParsing).Content
  Write-Host "--- Verifying Claude Code ---"
  if (Get-Command claude -ErrorAction SilentlyContinue) {
    claude --version
    Write-Host "Claude Code installed successfully"
  } else {
    Write-Host "Claude Code not available, see 04-troubleshooting.md"
    return 1
  }
}

function Install-Codex {
  Write-Host ""
  Write-Host "--- Installing Codex ---"
  $CODEX_URL = if ($env:CODEX_URL) { $env:CODEX_URL } else { "https://openai.com/codex/install.ps1" }
  try {
    Invoke-Expression (Invoke-WebRequest -Uri $CODEX_URL -UseBasicParsing).Content
  } catch {
    Write-Host "Official script failed, trying npm..."
    if (Get-Command npm -ErrorAction SilentlyContinue) {
      npm i -g @openai/codex@latest
    } else {
      Write-Host "npm not found. Please install Node.js: https://nodejs.org/"
      return 1
    }
  }
  Write-Host "--- Verifying Codex ---"
  if (Get-Command codex -ErrorAction SilentlyContinue) {
    codex --version
    Write-Host "Codex installed successfully"
  } else {
    Write-Host "Codex not available, see 04-troubleshooting.md"
    return 1
  }
}

# === 7. Main menu loop ===
while ($true) {
  Write-Host ""
  Write-Host "Select tool to install:"
  Write-Host "  [1] Claude Code"
  Write-Host "  [2] Codex"
  Write-Host "  [3] Install both"
  Write-Host "  [0] Exit"
  $choice = Read-Host "Enter option [0-3]"
  switch ($choice) {
    "1" { Install-ClaudeCode }
    "2" { Install-Codex }
    "3" { Install-ClaudeCode; Install-Codex }
    "0" { break }
    default { Write-Host "Invalid option" }
  }
}

Write-Host ""
Write-Host "=== Installation complete ==="
Write-Host "Note: Proxy environment variables will be lost when PowerShell is closed (not persistent)"