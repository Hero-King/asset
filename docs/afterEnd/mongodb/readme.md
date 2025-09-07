# mongodb

| SQL 术语/概念 | MongoDB 术语/概念 | 解释/说明                              |
| ------------- | ----------------- | -------------------------------------- |
| database      | database          | 数据库                                 |
| table         | collection        | 数据库表/集合                          |
| row           | document          | 数据记录行/文档                        |
| column        | field             | 数据字段/域                            |
| index         | index             | 索引                                   |
| table joins   |                   | 表连接,MongoDB 不支持                  |
| primary key   | primary key       | 主键,MongoDB 自动将\_id 字段设置为主键 |

## 创建用户

MongoDB 的是按照库创建用户

创建库管理员

```shell
db.auth("admin","123456")   # 使用管理员账号登陆
use mydb
db.createUser({user: "mydb",pwd: "123456",roles: [ { role: "dbOwner", db: "mydb" } ]})  # 在mydb库中创建用户
show users  # 查看当前库的用户

```
