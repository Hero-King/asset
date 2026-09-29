
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
# 部署 payload（GitHub Actions release.yml/promote.yml）:
#   {"action":"deploy","role":"pre|prod","version":"X.Y.Z","commit_sha":"...","timestamp":"..."}
# action/role/version/commit_sha 按序作为位置参数传给 actions.sh
cat > /etc/webhook/webhooks.conf << 'EOF'
[
  {
    "id": "openwrt-actions",
    "execute-command": "/etc/webhook/actions.sh",
    "command-working-directory": "/tmp",
    "include-command-output-in-response": false,
    "include-command-output-in-response-on-error": true,
    "pass-arguments-to-command":
    [
      {
        "source": "payload",
        "name": "action"
      },
      {
        "source": "payload",
        "name": "role"
      },
      {
        "source": "payload",
        "name": "version"
      },
      {
        "source": "payload",
        "name": "commit_sha"
      }
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
        }
      ]
    }
  }
]
EOF

# 创建执行脚本
cat > /etc/webhook/actions.sh << 'EOF'
#!/bin/sh
# Webhook 执行脚本
#
# 部署 payload（GitHub Actions release.yml / promote.yml，经 HMAC-SHA256 验签）：
#   {"action":"deploy","role":"pre|prod","version":"X.Y.Z","commit_sha":"...","timestamp":"..."}
# test / system_info 为本机运维动作（见 /root/test.sh），无部署语义。

LOG_FILE="/var/log/webhook_actions.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $LOG_FILE
    logger -t "Webhook" "$1"
}

main() {
    action="$1"
    role="$2"
    version="$3"
    commit_sha="$4"

    if [ -z "$action" ]; then
        log "错误: 未收到动作参数"
        echo "错误: 未收到动作参数"
        exit 1
    fi

    log "收到动作: $action role=${role:-<空>} version=${version:-<空>} commit_sha=${commit_sha:-<空>}"

    case "$action" in
        "deploy")
            # 参数将进入远端 shell，必须严格白名单校验，杜绝任意字符注入
            case "$role" in
                pre|prod) ;;
                *)
                    log "错误: 非法 role='$role'（仅支持 pre/prod）"
                    echo "错误: 非法 role（仅支持 pre/prod）"
                    exit 1
                    ;;
            esac
            if ! echo "$version" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$'; then
                log "错误: 非法 version='$version'（需 X.Y.Z）"
                echo "错误: 非法 version（需 X.Y.Z）"
                exit 1
            fi
            if ! echo "$commit_sha" | grep -Eq '^[0-9a-f]{40}$'; then
                log "错误: 非法 commit_sha='$commit_sha'（需 40 位十六进制）"
                echo "错误: 非法 commit_sha（需 40 位十六进制）"
                exit 1
            fi
            log "执行: 部署 role=$role version=v$version commit_sha=${commit_sha:0:8}"
            /etc/webhook/deploy_nest_mysql.sh deploy "$role" "$version" "$commit_sha"
            ;;
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
        *)
            log "未知动作: $action"
            echo "错误: 未知动作 '$action'（仅支持 deploy/system_info/test）"
            exit 1
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
echo "部署联调: /root/test.sh deploy pre 1.0.4"

/etc/init.d/webhook restart


# 创建快速测试脚本
# 用法:
#   /root/test.sh test                                      # 连通性测试
#   /root/test.sh system_info                               # 系统信息
#   /root/test.sh deploy pre 1.0.4 [commit_sha]             # 模拟 GitHub Actions 部署 payload
#                                                             commit_sha 省略时用全 0（仅验证链路连通，
#                                                             部署脚本对全 0 的 commitSha 校验会失败，属预期）
cat > /root/test.sh << 'EOF'
#!/bin/sh
SECRET="971011HeroKing"
URL="http://localhost:9000/hooks/openwrt-actions"
ACTION="${1:-test}"
ROLE="$2"
VERSION="$3"
SHA="$4"
TIMESTAMP=$(date +%s)

case "$ACTION" in
    deploy)
        if [ -z "$ROLE" ] || [ -z "$VERSION" ]; then
            echo "用法: $0 deploy <pre|prod> <X.Y.Z> [commit_sha]"
            exit 1
        fi
        # commit_sha 必须 40 位十六进制（actions.sh 侧白名单校验），省略时用全 0 占位
        [ -n "$SHA" ] || SHA="0000000000000000000000000000000000000000"
        DATA="{\"repository\":\"hero-king/licai-shaobing\",\"commit_sha\":\"$SHA\",\"action\":\"deploy\",\"role\":\"$ROLE\",\"version\":\"$VERSION\",\"timestamp\":\"$TIMESTAMP\"}"
        ;;
    *)
        DATA="{\"action\":\"$ACTION\"}"
        ;;
esac

# 兼容 openssl 输出格式：OpenSSL 为 "HMAC-SHA256(stdin)= <hex>"，LibreSSL/部分版本仅裸 hex
SIGNATURE="sha256=$(printf '%s' "$DATA" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^[^=]*=[[:space:]]*//')"

echo "动作: $ACTION ${ROLE:+role=$ROLE} ${VERSION:+version=$VERSION}"
echo "数据: $DATA"
echo "签名: $SIGNATURE"

curl -sS -X POST \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: $SIGNATURE" \
  -H "X-Timestamp: $TIMESTAMP" \
  -d "$DATA" \
  -w '\nHTTP %{http_code}\n' \
  "$URL"

echo 'complete'
EOF

chmod +x /root/test.sh

# 新增fn os docker部署脚本

cat > /etc/webhook/deploy_nest_mysql.sh << 'EOF'
#!/bin/sh
# Fnos 双栈镜像部署脚本（由 actions.sh 调用，经 SSH 在 192.168.1.3 执行）
#
# 用法: deploy_nest_mysql.sh deploy <pre|prod> <X.Y.Z> <commit_sha>
# 镜像: registry.cn-hangzhou.aliyuncs.com/hero-king/licai-shaobing:v<X.Y.Z>（主源 ACR）
# 回退: ACR 拉取失败时，用 sed 生成指向 ghcr.io 的临时副本 compose 重试（GHCR backup）
# 校验: 部署后轮询本机 /nest/api/health，比对 /health 回读的 commitSha（镜像构建时内嵌
#       APP_COMMIT_SHA），不匹配则判失败——防「pull 成功但 tag 过期、容器不重建」的假部署
# Fnos 宿主机目录约定（各目录需自备 compose 文件与本机 .env）：
#   prod -> /vol1/1000/HeroKing/docker/finance-sentry       docker-compose.yml      容器 NestjsApp     端口 9996
#   pre  -> /vol1/1000/HeroKing/docker/finance-sentry-pre   docker-compose.pre.yml  容器 NestjsAppPre  端口 9997

LOG_FILE="/var/log/webhook_deploy.log"
REMOTE_USER="HeroKing"
REMOTE_HOST="192.168.1.3"

PROD_DIR="/vol1/1000/HeroKing/docker/finance-sentry"
PRE_DIR="/vol1/1000/HeroKing/docker/finance-sentry-pre"
PROD_COMPOSE="docker-compose.yml"
PRE_COMPOSE="docker-compose.pre.yml"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $LOG_FILE
    logger -t "Webhook-Deploy" "$1"
}

deploy_stack() {
    local role="$1"
    local version="$2"
    local commit_sha="$3"

    case "$role" in
        prod)
            remote_dir="$PROD_DIR"
            compose_file="$PROD_COMPOSE"
            health_port=9996
            ;;
        pre)
            remote_dir="$PRE_DIR"
            compose_file="$PRE_COMPOSE"
            health_port=9997
            ;;
        *)
            log "错误: 非法 role='$role'"
            echo "错误: 非法 role（仅支持 pre/prod）"
            return 1
            ;;
    esac

    # 二次严格校验（本脚本也可能被直接调用），version/commit_sha 会进入远端 shell
    if ! echo "$version" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$'; then
        log "错误: 非法 version='$version'（需 X.Y.Z）"
        echo "错误: 非法 version（需 X.Y.Z）"
        return 1
    fi
    if ! echo "$commit_sha" | grep -Eq '^[0-9a-f]{40}$'; then
        log "错误: 非法 commit_sha='$commit_sha'（需 40 位十六进制）"
        echo "错误: 非法 commit_sha（需 40 位十六进制）"
        return 1
    fi

    image_tag="v$version"
    log "开始部署 role=$role version=$image_tag commit_sha=${commit_sha:0:8} dir=$remote_dir compose=$compose_file"
    echo "部署 $role 栈: $image_tag commit_sha=${commit_sha:0:8}（$remote_dir）"

    # 远端脚本：$remote_dir/$compose_file/$image_tag 在本机(OpenWrt)侧展开，
    # 均为白名单/正则校验过的固定值；$(date) 转义留给远端求值。
    # 全部输出回传 SSH 标准输出（失败时由 webhook 写进 HTTP 响应体），OpenWrt 侧另落盘。
    ssh_command="
        set -e
        cd '$remote_dir'
        if [ ! -f '$compose_file' ]; then
            echo \"[远程] 缺少 compose 文件: $remote_dir/$compose_file\"
            exit 2
        fi
        if [ ! -f .env ]; then
            echo \"[远程] 缺少 .env: $remote_dir/.env（DB_USERNAME/DB_PASSWORD/JWT_SECRET/SENTRY_DSN）\"
            exit 2
        fi
        export IMAGE_TAG='$image_tag'
        echo \"[远程] \$(date '+%Y-%m-%d %H:%M:%S') role=$role image=$image_tag 开始部署（主源 ACR）\"
        # 主源 ACR 拉取失败时，生成指向 GHCR 的临时副本 compose 并重试（backup）
        if ! docker compose -f '$compose_file' pull app; then
            echo \"[远程] ACR 拉取失败，尝试回退 GHCR backup\"
            tmp_compose=\"/tmp/_\$(basename '$compose_file').ghcr\"
            sed \"s#registry.cn-hangzhou.aliyuncs.com/hero-king/licai-shaobing#ghcr.io/hero-king/licai-shaobing#g\" '$compose_file' > \"\$tmp_compose\"
            if ! docker compose -f \"\$tmp_compose\" pull app; then
                echo \"[远程] GHCR backup 拉取也失败\"
                rm -f \"\$tmp_compose\"
                exit 3
            fi
            docker compose -f \"\$tmp_compose\" up -d app
            rm -f \"\$tmp_compose\"
        else
            docker compose -f '$compose_file' up -d app
        fi
        docker compose -f '$compose_file' ps
        # 部署后校验：轮询本机 health，比对镜像内嵌 APP_COMMIT_SHA（/health 回读），
        # 不匹配说明容器没换到目标镜像（如 ACR tag 过期导致 compose 不重建），判部署失败
        echo \"[远程] 开始 commitSha 校验（预期 ${commit_sha:0:8}，端口 $health_port）\"
        ok=''
        i=0
        while [ \$i -lt 24 ]; do
            body=\$(curl -fsS --max-time 5 \"http://localhost:$health_port/nest/api/health\" 2>/dev/null || true)
            echo \"[远程] 健康校验 attempt \$i: \$body\"
            if printf '%s' \"\$body\" | grep -q '\"commitSha\":\"$commit_sha\"'; then
                ok=1
                break
            fi
            i=\$((i+1))
            sleep 5
        done
        if [ -z \"\$ok\" ]; then
            echo \"[远程] commitSha 校验失败（预期 $commit_sha）：容器未重建或镜像非目标版本\"
            exit 4
        fi
        echo \"[远程] commitSha 校验通过: ${commit_sha:0:8}\"
    "

    # 注意：不能用无 else 的 if 包裹 ssh 再取 $?——if 条件失败且无分支执行时 $? 恒为 0
    tmp_out=$(mktemp)
    ssh -o ConnectTimeout=10 "${REMOTE_USER}@${REMOTE_HOST}" "$ssh_command" > "$tmp_out" 2>&1
    rc=$?
    cat "$tmp_out"
    cat "$tmp_out" >> "$LOG_FILE"
    rm -f "$tmp_out"
    if [ "$rc" -eq 0 ]; then
        log "部署成功 role=$role version=$image_tag"
        echo "部署完成: $role 栈已更新为 $image_tag"
    else
        log "部署失败 role=$role version=$image_tag 退出码=$rc"
        echo "错误: $role 栈部署失败（退出码 $rc），远端输出见上"
    fi
    return "$rc"
}

# 主函数
main() {
    local action="${1:-}"

    case "$action" in
        deploy)
            if [ $# -ne 4 ]; then
                echo "用法: $0 deploy <pre|prod> <X.Y.Z> <commit_sha>"
                exit 1
            fi
            log "部署脚本调用，操作: $1 role=$2 version=v$3 commit_sha=${4:0:8}"
            deploy_stack "$2" "$3" "$4"
            ;;
        *)
            log "未知部署动作: $action"
            echo "错误: 未知部署动作 '$action'（仅支持 deploy）"
            exit 1
            ;;
    esac
}

main "$@"
EOF

chmod +x /etc/webhook/deploy_nest_mysql.sh
