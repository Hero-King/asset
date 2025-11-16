
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
    "include-command-output-in-response": false,
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
# Webhook 执行脚本 - 包含部署功能

LOG_FILE="/var/log/webhook_actions.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $LOG_FILE
    logger -t "Webhook" "$1"
}

main() {
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
            ;;
            
        # 部署相关操作
        "deploy_pull_restart")
            log "执行: 完整部署 - 拉取镜像并重启"
            /etc/webhook/deploy_nest_mysql.sh pull_and_restart
            ;;
            
        *)
            log "未知动作: $action"
            echo "错误: 未知动作 '$action'"
            ;;
    esac
}

log "Webhook脚本被调用，参数: $*"
main "$@"
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

# 新增fn os docker部署脚本

cat > /etc/webhook/deploy_nest_mysql.sh << 'EOF'
#!/bin/sh
# Docker 部署脚本

LOG_FILE="/var/log/webhook_deploy.log"
REMOTE_USER="HeroKing"
REMOTE_HOST="192.168.1.3"
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $LOG_FILE
    logger -t "Webhook-Deploy" "$1"
}

deploy() {
    local action="$1"
    
    log "开始部署操作: $action"
    echo "开始部署 nest-mysql 应用..."
    
    case "$action" in
        "pull_and_restart")
            echo "拉取最新镜像并重启容器..."
            log "执行: 拉取镜像并重启"
            
            # SSH 命令执行部署
            ssh_command="
                set -e
                cd /vol1/1000/HeroKing/docker/nestjs
                echo \"[\$(date '+%Y-%m-%d %H:%M:%S')] [远程] 开始部署...\" >> deploy_remote.log
                
                # 执行命令并将所有输出追加到远程日志文件
                echo '[远程] 拉取最新镜像...' >> deploy_remote.log
                docker compose pull >> deploy_remote.log 2>&1
                echo '[远程] 重启容器...' >> deploy_remote.log
                docker compose up -d >> deploy_remote.log 2>&1
                echo '[远程] 检查容器状态...' >> deploy_remote.log
                docker compose ps >> deploy_remote.log 2>&1
                echo '[远程] 部署完成' >> deploy_remote.log
            "
            
            if ssh "${REMOTE_USER}@${REMOTE_HOST}" "$ssh_command"; then
                log "部署成功"
                echo "部署完成: 镜像已更新并容器已重启"
            else
                log "部署失败: SSH 命令执行错误"
                echo "错误: 部署失败，请检查日志"
                return 1
            fi
            ;;
            
        *)
            log "未知部署操作: $action"
            echo "错误: 未知操作 '$action'"
            return 1
            ;;
    esac
    
    return 0
}

# 主函数
main() {
    local action="${1:-status}"
    
    log "部署脚本调用，操作: $action"
    
    # 执行部署
    if deploy "$action"; then
        log "部署操作完成: $action"
        echo "操作完成"
    else
        log "部署操作失败: $action"
        echo "操作失败"
        exit 1
    fi
}

main "$@"
EOF

chmod +x /etc/webhook/deploy_nest_mysql.sh
