# Redis
## 简介

Redis 是完全开源的，遵守 BSD 协议，是一个高性能的 key-value 数据库。

Redis 与其他 key - value 缓存产品有以下三个特点：

Redis 支持数据的持久化，可以将内存中的数据保存在磁盘中，重启的时候可以再次加载进行使用。
Redis 不仅仅支持简单的 key-value 类型的数据，同时还提供 list，set，zset，hash 等数据结构的存储。
Redis 支持数据的备份，即 master-slave 模式的数据备份。

## 安装

linux apt install redis-server

### 配置

Redis 的配置文件位于 Redis 安装目录下，文件名为 redis.conf(Windows 名为 redis.windows.conf)。

你可以通过 CONFIG 命令查看或设置配置项。

```shell
CONFIG GET configName   // 使用 * 号获取所有配置项
CONFIG SET CONFIG_SETTING_NAME NEW_CONFIG_VALUE  // 你可以通过修改 redis.conf 文件或使用 CONFIG set 命令来修改配置。
```

## 数据类型

Redis 支持五种数据类型：string（字符串），hash（哈希），list（列表），set（集合）及 zset(sorted set：有序集合)。

### String

string 类型是二进制安全的。意思是 redis 的 string 可以包含任何数据。比如 jpg 图片或者序列化的对象。一个键最大能存储 512MB。

```shell
SET runoob "菜鸟教程"
GET runoob       // "菜鸟教程"
```

### Hash（哈希）

Redis hash 是一个键值(key=>value)对集合。

Redis hash 是一个 string 类型的 field 和 value 的映射表，hash 特别适合用于存储对象。

```shell
DEL runoob  // 删除前面测试用过的 key
HMSET runoob field1 "Hello" field2 "World"
HGET runoob field1  // 'Hello'
```

### List（列表）

Redis 列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部（左边）或者尾部（右边）。

```shell
DEL runoob
lpush runoob redis
lpush runoob mongodb
lpush runoob rabbitmq
lrange runoob 0 10
```

### Set(集合)

Redis 的 Set 是 string 类型的无序集合。

集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是 O(1)。

```shell
DEL runoob
sadd runoob redis
sadd runoob mongodb
sadd runoob rabbitmq
sadd runoob rabbitmq    // 0
smembers runoob
```

### zset(sorted set：有序集合)

Redis zset 和 set 一样也是 string 类型元素的集合,且不允许重复的成员。
不同的是每个元素都会关联一个 double 类型的分数。redis 正是通过分数来为集合中的成员进行从小到大的排序。

zset 的成员是唯一的,但分数(score)却可以重复。
zadd key score member
