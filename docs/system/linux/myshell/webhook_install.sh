
#!/bin/sh
# OpenWrt Webhook 安装配置脚本

echo "正在安装webhook..."

# rm -rf /tmp/webhook.tar.gz
# rm -rf /etc/webhook/*

# # 检测架构并下载对应版本
# ARCH=$(uname -m)
# case $ARCH in
#     "x86_64") ARCH="amd64" ;;
#     "i386"|"i686") ARCH="386" ;;
#     "aarch64") ARCH="arm64" ;;
#     "armv7l"|"armv6l") ARCH="arm" ;;
#     "mips") ARCH="mips" ;;
#     "mipsel") ARCH="mipsel" ;;
#     *) ARCH="arm" ;;
# esac

# echo "检测到架构: $ARCH"

# # 下载webhook
# wget "https://github.com/adnanh/webhook/releases/latest/download/webhook-linux-${ARCH}.tar.gz" -O /tmp/webhook.tar.gz

# if [ $? -ne 0 ]; then
#     echo "下载失败，请检查网络连接"
#     exit 1
# fi

# # 解压并安装
# tar -zxvf /tmp/webhook.tar.gz -C /tmp
# mv /tmp/webhook-linux-*/webhook /usr/bin/webhook
# chmod +x /usr/bin/webhook

# # 创建配置目录
# mkdir -p /etc/webhook

# 创建主配置文件
cat > /etc/webhook/webhooks.conf << 'EOF'
[
  {
    "id": "openwrt-actions",
    "execute-command": "/etc/webhook/actions.sh",
    "command-working-directory": "/tmp",
    "include-command-output-in-response": true,
    "pass-arguments-to-command":
    [
      {
        "source": "payload",
        "name": "action"
      },
    ],
    "trigger-rule":
    {
      "and":
      [
        {
          "match":
          {
            "type": "payload-hmac-sha256",
            "secret": "971011HeroKing",
            "parameter":
            {
              "source": "header",
              "name": "X-Hub-Signature-256"
            }
          }
        },
      ]
    }
  }
]
EOF

# 创建执行脚本
cat > /etc/webhook/actions.sh << 'EOF'
#!/bin/sh
# Webhook 执行脚本 - 参数传递版本

LOG_FILE="/var/log/webhook_actions.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $LOG_FILE
    logger -t Webhook "$1"
}

main() {
    # 从第一个参数获取 action
    action="$1"
    
    if [ -z "$action" ]; then
        log "错误: 未收到动作参数"
        echo "错误: 未收到动作参数"
        exit 1
    fi
    
    log "收到动作: $action"
    
    case "$action" in
        "system_info")
            log "执行: 获取系统信息"
            echo "=== 系统信息 ==="
            echo "设备: $(cat /tmp/sysinfo/board_name 2>/dev/null || echo unknown)"
            echo "架构: $(uname -m)"
            echo "内核: $(uname -r)"
            echo "时间: $(date)"
            echo "负载: $(uptime)"
            echo "内存: $(free -m | awk 'NR==2{printf "Used: %.1f/%.1f MB", $3, $2}')"
            echo "存储: $(df -h / | awk 'NR==2{printf "Used: %s/%s (%s)", $3, $2, $5}')"
            ;;
        "test")
            log "执行: 测试连接"
            echo "Webhook 测试成功"
            echo "时间: $(date)"
            echo "参数传递正常"
            ;;
        "list_services")
            log "执行: 列出服务"
            echo "=== 服务状态 ==="
            /etc/init.d/network status
            ;;
        *)
            log "未知动作: $action"
            echo "错误: 未知动作 '$action'"
            ;;
    esac
}

# 记录脚本调用信息
log "Webhook脚本被调用，参数: $*"

# 调用主函数
main "$@"

# 记录脚本完成
exit_code=$?
log "脚本执行完成，退出码: $exit_code"
exit $exit_code
EOF

chmod +x /etc/webhook/actions.sh

# 创建服务管理脚本
cat > /etc/init.d/webhook << 'EOF'
#!/bin/sh /etc/rc.common

USE_PROCD=1
START=95

start_service() {
    procd_open_instance
    procd_set_param command /usr/bin/webhook
    procd_append_param command -verbose
    procd_append_param command -hooks /etc/webhook/webhooks.conf
    procd_append_param command -port 9000
    procd_append_param command -hotreload
    procd_set_param respawn
    procd_set_param stdout 1
    procd_set_param stderr 1
    procd_close_instance
}
EOF

chmod +x /etc/init.d/webhook

echo "安装完成!"
echo "启用服务: /etc/init.d/webhook enable"
echo "启动服务: /etc/init.d/webhook start"
echo "请修改 /etc/webhook/webhooks.conf 中的 secret 密钥"

/etc/init.d/webhook restart


# 创建快速测试脚本
cat > /root/test.sh << 'EOF'
#!/bin/sh
SECRET="971011HeroKing"
URL="http://localhost:9000/hooks/openwrt-actions"
ACTION="${1:-test}"

DATA="{\"action\":\"$ACTION\"}"
SIGNATURE=$(echo -n "$DATA" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print "sha256="$2}')

echo "动作: $ACTION"
echo "数据: $DATA"
echo "签名: $SIGNATURE"

curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: $SIGNATURE" \
  -d "$DATA" \
  "$URL"

echo 'complete'
EOF

chmod +x /root/test.sh
