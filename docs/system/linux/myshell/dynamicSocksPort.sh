#!/bin/sh

# 生成随机端口号, 通过调用登录->修改端口转发列表->登出接口
# use: 设置定时任务: 0 5 */2 * * /web/shell/dynamicSocksPort.sh XXX >> /var/log/dynamicSocksPort.log 2>&1

touch /var/log/dynamicSocksPort.log
# 检查是否传入密码
if [ -z "$1" ]; then
    echo "Usage: $0 <password>"
    exit 1
fi

PASSWORD="$1"

# 生成随机数
function rand(){ 
 min=$1 
 max=$(($2-$min+1)) 
 num=$(($RANDOM+1000000000)) #增加一个10位的数再求余 
 echo $(($num%$max+$min)) 
} 
PORT=$(rand 38000 40000) 

# 函数：检查接口调用是否成功
check_response() {
    RESPONSE=$1
    ERROR_CODE=$(echo $RESPONSE | jq '.error_code')

    if [ "$ERROR_CODE" -ne 0 ]; then
        echo "Error: API call failed with error_code $ERROR_CODE"
        exit 1
    fi
}

# 登录并获取Token或Session ID
LOGIN_RESPONSE=$(curl --location --request POST 'http://192.168.2.10/login.cgi' \
--header 'User-Agent: Apifox/1.0.0 (https://apifox.com)' \
--header 'Accept: */*' \
--header 'Host: 192.168.2.10' \
--header 'Connection: keep-alive' \
--data-urlencode 'username=admin' \
--data-urlencode "Pwd=$PASSWORD" \
--data-urlencode '_pageStyle=pc')
check_response "$LOGIN_RESPONSE"

# 获取列表数据
LIST_RESPONSE=$(curl --location --request POST 'http://192.168.2.10/portforward.cgi' \
--header 'X-Requested-With: XMLHttpRequest' \
--header 'User-Agent: Apifox/1.0.0 (https://apifox.com)' \
--header 'Accept: */*' \
--header 'Host: 192.168.2.10' \
--header 'Connection: keep-alive' \
--data-urlencode 'action=get' \
--data-urlencode '_pageStyle=pc')

# 筛选并修改数据
#UPDATED_DATA=$(echo "$LIST_RESPONSE" | jq --arg port "$PORT" 'map(if .Sv_Beginport == "1080" then .Cl_Beginport = $port | .Cl_Endport = $port else . end)')

# 提取需要更新的条目
#ITEM_TO_UPDATE=$(echo $UPDATED_DATA | jq 'map(select(.Sv_Beginport == "1080"))[0]')

# 筛选出 Sv_Beginport 为 1080 的数据并获取对应的 Num
NUM=$(echo "$LIST_RESPONSE" | jq -r '.[] | select(.Sv_Beginport == "1080") | .Num')

# 更新接口
UPDATE_RESPONSE=$(curl --location --request POST 'http://192.168.2.10/portforward.cgi' \
--header 'User-Agent: Apifox/1.0.0 (https://apifox.com)' \
--header 'Accept: */*' \
--header 'Host: 192.168.2.10' \
--header 'Connection: keep-alive' \
--data-urlencode 'action=set' \
--data-urlencode 'name=socks' \
--data-urlencode 'ip=192.168.2.1' \
--data-urlencode "cl_beginport=${PORT}" \
--data-urlencode "cl_endport=${PORT}" \
--data-urlencode 'sv_beginport=1080' \
--data-urlencode "num=${NUM}" \
--data-urlencode 'sv_endport=1080' \
--data-urlencode 'agreement=3' \
--data-urlencode '_pageStyle=pc' )
check_response "$UPDATE_RESPONSE"

echo "Update Response: $UPDATE_RESPONSE"

echo "start update pac file"
# 配置部分
PAC_FILE="/web/auth/gfwlist.pac" # PAC 文件的路径

# 使用 sed 命令替换 PAC 文件中第一行的端口
sed -i "1s/\(SOCKS5 [^:]*:\)[0-9]*/\1$PORT/" "$PAC_FILE"

# 检查修改后的 PAC 文件内容
echo "Modified PAC file content:"
head -n 1 "$PAC_FILE"

#登出
UPDATE_RESPONSE=$(curl --location --request POST 'http://192.168.2.10/logout.cgi' \
--header 'User-Agent: Apifox/1.0.0 (https://apifox.com)' \
--header 'Accept: */*' \
--header 'Host: 192.168.2.10' \
--header 'Connection: keep-alive' \
--data-urlencode 'action_mode=Logout' \
--data-urlencode '_pageStyle=pc' )
check_response "$UPDATE_RESPONSE"
echo "logout success; shell end success"
exit 0