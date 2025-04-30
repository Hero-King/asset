#!/bin/bash
# 文件目录: /root/ping/ping.sh chmod +x crontab: */10 * * * * /bin/bash /root/ping/ping.sh >/dev/null 2>&1
LOG_DIR="/root/ping" # 日志文件所在的目录  替换为实际的目录路径

LOG_FILE="${LOG_DIR}/ping_log.txt" # 当前日志文件名称

LOG_RETENTION_DAYS=60 # 日志保留的天数

TARGET_IP="192.168.2.254" # 需要ping的IP地址

WAIT_SECONDS=30 # Ping失败后等待的秒数

# 添加分界线到日志文件
add_separator() {
    echo "===================================================================" >>"$LOG_FILE"
}

# 初始化日志文件目录（确保目录存在）
initialize_log_directory() {
    mkdir -p "$LOG_DIR"
    if [ $? -ne 0 ]; then
        echo "无法创建日志目录: $LOG_DIR"
        exit 1
    fi
}

# 初始化日志文件（确保日志文件存在）
initialize_log_file() {
    touch "$LOG_FILE"
    if [ $? -ne 0 ]; then
        echo "无法创建日志文件: $LOG_FILE"
        exit 1
    fi
}

# 写入日志时间，并在每条日志后添加换行符
write_log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >>"$LOG_FILE"
    echo "" >>"$LOG_FILE" # 添加换行符
}

# 执行ping命令并返回结果
ping_ip() {
    local ip_address=$1
    ping -c 4 "$ip_address" >/dev/null 2>&1
    return $?
}

# 检查IP地址是否可以ping通
check_ping() {
    local ip_address=$1
    local attempt_count=1
    local max_attempts=6

    # 在检查之前添加分界线
    add_separator

    while [ $attempt_count -le $max_attempts ]; do
        write_log "尝试ping $ip_address（第$attempt_count次）"
        ping_ip "$ip_address"
        if [ $? -eq 0 ]; then
            write_log "一切正常"
            return 0
        else
            if [ $attempt_count -lt $max_attempts ]; then
                write_log "第$attempt_count次ping失败，可能路由器重启。待$WAIT_SECONDS秒后再试"
                sleep $WAIT_SECONDS
            fi
        fi
        attempt_count=$((attempt_count + 1))
    done

    write_log "连续$max_attempts次ping失败，可能断电了！"
    /sbin/poweroff # 关机命令，如果要测试可注释掉
}

# 删除超过保留天数的日志文件
cleanup_old_logs() {
    find "$LOG_DIR" -type f -name "*.txt" -mtime +$LOG_RETENTION_DAYS -delete
    if [ $? -ne 0 ]; then
        echo "删除旧日志文件时出错"
    fi
}

# 主程序开始

# 初始化日志文件目录和文件
initialize_log_directory
initialize_log_file

# 清理旧日志文件（在日志初始化之后执行，以避免删除正在使用的日志文件）
cleanup_old_logs

# 调用检查ping的函数
check_ping "$TARGET_IP"

# 脚本执行完毕
exit 0
