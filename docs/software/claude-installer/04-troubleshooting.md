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
