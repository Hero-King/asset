/**
 * 创建数据库：
 * stubook-bizhibihui
 * 创建数据表：
 * CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `category` varchar(20) DEFAULT NULL,
  `price` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8

插入数据：
INSERT INTO `product` VALUES (1, '小米9', '手机', 2199);
INSERT INTO `product` VALUES (2, '小米8', '手机', 2000);
INSERT INTO `product` VALUES (3, '华为P30', '手机', 4199);
INSERT INTO `product` VALUES (4, '华为P20', '手机', 2099);
INSERT INTO `product` VALUES (5, '华为P10', '手机', 1099);
INSERT INTO `product` VALUES (6, '荣耀10', '手机', 1099);
INSERT INTO `product` VALUES (7, '荣耀200', '手机', 2199);
INSERT INTO `product` VALUES (8, '苹果8', '手机', 3199);
INSERT INTO `product` VALUES (9, '苹果X', '手机', 5199);

 */
//检索不同的行  搜索结果去重使用关键字distinct   select distinct 列 from 表  注意distinct 控制所有的列

/**
 *limit 关键词使用   limit 5  从数据库中查找5条  limit5，5  查找6-10数据 = limit 5 offset 5  
 * 由此引申出来数据过滤的问题  包括两种 1.SQL过滤（通过SQL语言进行过滤 性能高）  应用过滤（获取出来的数据比需要的数据还要多，在应用层进行筛选过滤说） 
 * 
 * mysql不区分大小写  这个肯定知道
 * 
 * 字符串用''包裹where子句操作符  <> 不等于 相当于!=     <=   >= 还有between 5 and 10     还有 in(5,10)这个代表5 或者 10 并不是区间
 * 
 * mysql 中有个无值   NULL 使用 is null 判断  
 * 
 * and操作符   where name="wangjunjie" and age = 18
 * or操作符   where name ='wang' or name = 'jun'
 * --mysql中 and的优先级高于or    使用（）避免问题   否定使用 not 关键字  not in    not between  not exist 三种使用方法
 * 
 * 通配符   影响性能  不匹配NULL   可以准确匹配就不要通配符  
 *  like  % 代表任意字符出现任意次数  
 *              _ 代表单个字符    
 *  REGEXP   正则表达式   没mysql已经初步支持常用的正则   用法和like类似  where name REGEXP 'wang[a-z]'
 *      《like 是匹配整个列值文本   REGEXP是匹配列值文本内 某一列值内包含符合正则表达式的文本就返回   like匹配整个串  正则匹配子串》
 *       .代表任意一个字符     | （或者）  [abc]几个字符之一   否定几个字符之一[^123]  【】匹配的效果是一个字符   [1-9]1到9之间的一个数字
 *        匹配特殊字符 比如. ?  -   等具有特殊意义的字符  用  \\转义 \\.
 *   匹配多个字符     重复元字符：放在出现内容之后   * 大于等于0个字符   + 大于等于1个字符  ？ 0或者1个字符  {n}n个字符   {n,}大于等于N字符   {n,m}n 到 m个字符
 *      REGEXP '\\([1-9] sticks? \\)'    匹配结果 ： （1 stick） (5 sticks)
 *     定位元字符 ： ^  文本的开始  $ 文本的结尾   '^[1-9\\.]' 匹配以1-9之间数字开头或者.开头的文本
 * 第七节 --字段：使用函数处理字段返回临时使用字段  AS起别名 当然也可以应用到表上面（多表查询时候用的多）  
 * select 通常用于检索数据，但是当省略了from子句时候，就是简单的访问和处理表达式  SELECT 3 * 2;将返回6，SELECT Trim(' abc ');将返回abc，SELECT Now();
 * 使用Now()函数返回当前日期和时间。现在你明白了，可以根据需要使用SELECT语句进行检验
 * 第八节--数据处理函数(处理字段)：SQL也可以用函数来处理数据  处理列名就可以操作列下面所有的数据   select name,upper(name) from test ; select concat(name,age) from test
 *    文本函数： 用于处理字符串的函数
 *    数值函数： 用于处理数值算术运算
 *    时间函数： 用于处理时间
 *    系统函数： 返回数据库正使用的系统信息
 * 第九节-- 数据汇总   需要汇总数据而不用把它们实际检索出来          五个聚合函数  avg  sum count max min
 *    avg 只用于单个列   AVG()函数忽略列值为NULL的行。
            AVG()只能用来确定特定数值列的平均值，而且列名必须作为函数参数给出。为了获得多个列的平均值，必须使用多个AVG()函数。
      count()函数进行计数。可利用COUNT()确定表中行的数目或符合特定条件的行的数目。
            使用COUNT(*)对表中行的数目进行计数，不管表列中包含的是空值（NULL）还是非空值。
            使用COUNT(column)对特定列中具有值的行进行计数，忽略NULL值
      sum ()   SELECT SUM(item_price*quantity) AS total_price

      以上5个聚集函数都可以如下使用：
      对所有行执行计算，指定ALL参数或不指定参数（因为ALL是默认行为）。
      只包含不同的值，指定DISTINCT参数。  SELECT AVG(DISTINCT prod_price) AS avg_price
      聚集函数用来汇总数据。SQL支持5个聚集函数，可以用多种方法使用它们，返回所需的结果。这些函数很高效，它们返回结果一般比你在自己
的客户端应用程序中计算要快得多  


      子查询 使用有四种情况.  select后面  from 后面  where/having 后面  exists 后面
      exist (语句) 判断语句是否有结果 返回boolean类型
      EXISTS用于检查子查询是否至少会返回一行数据，该子查询实际上并不返回任何数据，而是返回值True或False
EXISTS 指定一个子查询，检测 行 的存在。
 */
