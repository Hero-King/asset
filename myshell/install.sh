#! /bin/bash
# IP 设置


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
echo "关闭防火墙和SELinux "
systemctl stop firewalld && systemctl disable firewalld && sed -i '/SELINUX/s/enforcing/disabled/' /etc/selinux/config && setenforce 0  

#安装常用软件
echo "安装常用软件"
yum install -y net-tools vim git axel wget sshpass tree  zip mlocate

# JDK 1.8
# 如果有安装过  先卸载
rpm -qa | grep java | xargs rpm -e --nodeps

# cd /usr/local/src/ && wget https://download.oracle.com/otn/java/jdk/8u251-b08/3d5a2bb8f8d4428bbe94aed7ec7ae784/jdk-8u251-linux-x64.tar.gz?AuthParam=1588001481_6a3ff5df2910c47578877cd1dc5ab337 && \
# tar zxf jdk-8u251-linux-x64.tar.gz && mv jdk1.8.0_251 /usr/local/jdk8 && cd && \
# echo "export JAVA_HOME=/usr/local/jdk8" >> /etc/profile && source /etc/profile && \
# echo "export CLASSPATH=.:${JAVA_HOME}/jre/lib/rt.jar:${JAVA_HOME}/lib/dt.jar:${JAVA_HOME}/lib/tools.jar" >> /etc/profile && source /etc/profile && \
# echo "export PATH=$PATH:${JAVA_HOME}/bin " >> /etc/profile && source /etc/profile

# 或者使用yum 
echo "开始安装JDK8"
yum install java-1.8.0-openjdk* -y 
#  默认jre jdk 安装路径是/usr/lib/jvm 下面
# vim /etc/profile
#  #set java environment  
# export JAVA_HOME=/usr/lib/jvm/java
# export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar:$JAVA_HOME/jre/lib/rt.jar
# export PATH=$PATH:$JAVA_HOME/bin
echo "export JAVA_HOME=/usr/lib/jvm/java" >> /etc/profile && source /etc/profile && \
echo "export CLASSPATH=.:${JAVA_HOME}/jre/lib/rt.jar:${JAVA_HOME}/lib/dt.jar:${JAVA_HOME}/lib/tools.jar" >> /etc/profile && source /etc/profile && \
echo "export PATH=$PATH:${JAVA_HOME}/bin " >> /etc/profile && source /etc/profile

# 安装nodejs
node_url="https://mirrors.huaweicloud.com/nodejs/v12.22.3/node-v12.22.3-linux-x64.tar.xz"
cd /usr/local/ && wget ${node_url}  && xz -d node-v12.22.3-linux-x64.tar.xz && \
tar xvf node-v12.19.1-linux-x64.tar  && \
echo "export NODE_HOME=/usr/local/node-v12.22.3" >> /etc/profile && source /etc/profile && echo "export PATH=$PATH:$NODE_HOME/bin " >> /etc/profile && source /etc/profile

npm config set registry http://registry.npm.taobao.org/

#maven 
cd /usr/local/src/ && wget https://mirror.bit.edu.cn/apache/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz && \
tar zxf apache-maven-3.6.3-bin.tar.gz && mv apache-maven-3.6.3 /usr/local/maven3 && cd && \

echo "export M2_HOME=/usr/local/maven3" >> /etc/profile && source /etc/profile && echo "export PATH=$PATH:$M2_HOME/bin " >> /etc/profile && source /etc/profile

# git 设置
# gitUrl="https://mirrors.edge.kernel.org/pub/software/scm/git/git-2.28.0.tar.gz"
# cd /usr/local/src/ && wget gitUrl
# packageTar=${gitUrl##http*/}



#git config --global user.email '838774057@qq.com'
#git config --global user.name 'Hero-King'
#ssh-keygen -t rsa -C "838774057@qq.com"

# docker安装
yum install -y yum-utils   device-mapper-persistent-data   lvm2  && \
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo && yum install docker-ce docker-ce-cli containerd.io -y  && \

systemctl start docker && systemctl enable docker && echo "{\"registry-mirrors\":[\"http://hub-mirror.c.163.com\"]}" > /etc/docker/daemon.json && systemctl daemon-reload && systemctl restart docker 

# jenkins 
# 慢死了 wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat/jenkins.repo && rpm --import https://pkg.jenkins.io/redhat/jenkins.io.key  && yum install -y jenkins
# cd && axel -n 10 https://mirrors.huaweicloud.com/jenkins/redhat-stable/jenkins-2.222.3-1.1.noarch.rpm  && rpm -ivh jenkins-2.222.3-1.1.noarch.rpm
# 安装时候不要装插件  /var/lib/jenkins/updates/default.json  里面的两个网址  https://www.cnblogs.com/ningy1009/p/12749911.html
# enkins->系统管理->管理插件->高级，
# 把下面的 http://updates.jenkins.io/update-center.json
# 改成国内镜像地址： http://mirror.xmission.com/jenkins/updates/current/update-center.json


# 安装mysql 5.7版本   https://www.cnblogs.com/zsh-blogs/p/11497720.html   https://www.jianshu.com/p/531cc35b15e7
# wget 'https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm'
# rpm -Uvh mysql57-community-release-el7-11.noarch.rpm
# yum install -y mysql-community-server
# systemctl start mysqld
# 查找密码： grep 'temporary password' /var/log/mysqld.log    登录成功后修改密码  SET PASSWORD = PASSWORD('Admin123!');

# 安装宝塔 yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh

# 安装K8s  参照 https://www.kubernetes.org.cn/7189.html
swapoff -a  # 关闭虚拟内存
cat > /etc/sysctl.d/k8s.conf <<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system
# 安装常用包
yum install vim bash-completion net-tools gcc --skip-broken  -y

#添加阿里kubernetes源
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
# 手动修改host文件 ===================== node 和master都需要修改

# master节点拉取镜像  国外镜像拉不下来  但是可以拉取国内人上传到镜像站点的镜像重新tag
# docker pull codedingan/coredns:1.6.7 
# docker pull codedingan/etcd:3.4.3-0
# docker pull codedingan/pause:3.2
# docker pull codedingan/kube-proxy:v1.18.0 
# docker pull codedingan/kube-scheduler:v1.18.0
# docker pull codedingan/kube-controller-manager:v1.18.0
# docker pull codedingan/kube-apiserver:v1.18.0

# docker tag codedingan/coredns:1.6.7   k8s.gcr.io/coredns:1.6.7 
# docker tag codedingan/etcd:3.4.3-0  k8s.gcr.io/etcd:3.4.3-0
# docker tag codedingan/pause:3.2  k8s.gcr.io/pause:3.2
# docker tag codedingan/kube-proxy:v1.18.0   k8s.gcr.io/kube-proxy:v1.18.0 
# docker tag codedingan/kube-scheduler:v1.18.0  k8s.gcr.io/kube-scheduler:v1.18.0
# docker tag codedingan/kube-controller-manager:v1.18.0  k8s.gcr.io/kube-controller-manager:v1.18.0
# docker tag codedingan/kube-apiserver:v1.18.0  k8s.gcr.io/kube-apiserver:v1.18.0

#master节点
# kubeadm init --kubernetes-version v1.18.0 --apiserver-advertise-address=192.168.1.100 --service-cidr=10.10.0.0/16 --pod-network-cidr=10.122.0.0/16

# Your Kubernetes control-plane has initialized successfully!

# To start using your cluster, you need to run the following as a regular user:

#   mkdir -p $HOME/.kube
#   sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
#   sudo chown $(id -u):$(id -g) $HOME/.kube/config

# You should now deploy a pod network to the cluster.
# Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
#   https://kubernetes.io/docs/concepts/cluster-administration/addons/
 
# kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml

# Then you can join any number of worker nodes by running the following on each as root:

# kubeadm join 192.168.1.100 ...

# 执行下面命令，使kubectl可以自动补充
# source <(kubectl completion bash)

# 镜像备份
yum install -y sshpass
image_name = (
    coredns:1.6.7
    etcd:3.4.3-0
    pause:3.2
    kube-proxy:v1.18.0
    kube-scheduler:v1.18.0
    kube-controller-manager:v1.18.0
    kube-apiserver:v1.18.0 
)
for image in ${image_name[@]};do
#  　　docker pull $aliyun_registry$image
#  　　docker tag $aliyun_registry$image $k8s_registry$image
    echo "开始保存镜像： ${image}"
    # shell变量在赋值的的时候, 等号前后一定不要有空格
    filename=${image%%:*} 
    docker save -o ${filename}.tar k8s.gcr.io/${image}
    echo "开始传输到192.168.1.2机器"
    sshpass -p 841_sjzc scp ${filename}.tar root@192.168.1.2:/vmfs/volumes/datastore1/wangdada/
done


# node 节点也需要docker镜像 比如 kube-proxy pause
# 拉取回来
# yum install -y sshpass  # 使用之前必须之前存储过对方机器公钥
# image_name=(
#     coredns:1.6.7
#     etcd:3.4.3-0
#     pause:3.2
#     kube-proxy:v1.18.0
#     kube-scheduler:v1.18.0
#     kube-controller-manager:v1.18.0
#     kube-apiserver:v1.18.0
# )
# for image in ${image_name[@]};do
# #  　　docker pull $aliyun_registry$image
# #  　　docker tag $aliyun_registry$image $k8s_registry$image
#     echo "开始保存镜像： ${image}"
#     # shell变量在赋值的的时候, 等号前后一定不要有空格
#     filename=${image%%:*}
#     sshpass -p 841_sjzc scp root@192.168.1.2:/vmfs/volumes/datastore1/wangdada/${filename}.tar ./
#     docker load -i ${filename}.tar
# done


