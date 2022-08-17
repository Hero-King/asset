#! /bin/bash

mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup &&  \
curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo  &&   \


# 清除系统所有的yum缓存
#yum clean all   &&  

# 生成yum缓存
#yum makecache   &&   
yum install -y epel-release  &&  \
curl -o /etc/yum.repos.d/epel-7.repo  http://mirrors.aliyun.com/repo/epel-7.repo  &&  \
yum clean all   &&   \
yum makecache   &&   \
# 关闭yum update 更新内核行为
# echo "exclude=kernel* " >> /etc/yum.conf &&  \

# 关闭防火墙和SELinux  
echo "关闭防火墙和SELinux ==============================="
systemctl stop firewalld && systemctl disable firewalld && sed -i '/SELINUX/s/enforcing/disabled/' /etc/selinux/config && setenforce 0  

# 关闭swap，注释swap分区
echo "关闭swap，注释swap分区==============================="
swapoff -a
sed -i.bak '/swap/s/^/#/' /etc/fstab

cat > /etc/sysctl.d/k8s.conf <<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system
# 手动修改host文件

echo "安装docker======================================"
yum install vim bash-completion net-tools gcc  sshpass tree -y
yum install -y yum-utils   device-mapper-persistent-data   lvm2  && \
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo && yum install docker-ce docker-ce-cli containerd.io -y  && \

systemctl start docker && systemctl enable docker && echo "{\"registry-mirrors\":[\"http://hub-mirror.c.163.com\"]}" > /etc/docker/daemon.json && systemctl daemon-reload && systemctl restart docker 
echo "docker 安装完成======================="


cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF

yum install kubectl kubelet kubeadm -y
systemctl enable kubelet
echo "k8s安装完成"








