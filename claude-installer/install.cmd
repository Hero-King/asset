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
if "%PROXY_ADDR%"=="" set "PROXY_ADDR=http://op.heroking.top:5002"

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
REM PROXY_ADDR 形如 http://host:port; 用 CMD 字符串替换去掉 http:// 前缀
set "PROXY_HOST_PORT=%PROXY_ADDR:http://=%"
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