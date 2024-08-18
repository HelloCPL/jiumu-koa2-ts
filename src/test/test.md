<!-- 接口优化 -->

http://localhost:8002/jiumu-koa2-ts-test/pc/tag/custom/get/list/self?type=articleClassify&pageSize=100
212ms

http://localhost:8002/jiumu-koa2-ts-test/pc/article/get/list/self
244ms

http://localhost:8002/jiumu-koa2-ts-test/pc/article/get/list
315ms


http://localhost:8002/jiumu-koa2-ts-test/pc/source/get/list/self
207ms


http://localhost:8002/jiumu-koa2-ts-test/pc/source/get/list
478ms


http://localhost:8002/jiumu-koa2-ts-test/pc/question/get/list/self
447ms

http://localhost:8002/jiumu-koa2-ts-test/pc/question/get/list
136ms

http://localhost:8002/jiumu-koa2-ts-test/pc/tag/custom/get/list/self?type=articleClassify&pageSize=100
132ms

http://localhost:8002/jiumu-koa2-ts-test/pc/novel/get/list/self
426ms


http://localhost:8002/jiumu-koa2-ts-test/pc/novel/get/list
426ms

http://localhost:8002/jiumu-koa2-ts-test/pc/collection/get/list/self?pageNo=1&pageSize=10&type=&highlight=1
398ms


```
SELECT t1.id,

REPLACE(t1.name,
'连续',
\"<span data-search-key='search' style='color: #F56C6C'>连续</span>\") AS name,

REPLACE(t1.author,
'连续',
\"<span data-search-key='search' style='color: #F56C6C'>连续</span>\") AS author,

REPLACE(t3.username,
'连续',
\"<span data-search-key='search' style='color: #F56C6C'>连续</span>\") AS createUserName,

REPLACE(t1.introduce,
'连续',
\"<span data-search-key='search' style='color: #F56C6C'>连续</span>\") AS introduce,
t1.classify,
t1.type,
t2.label AS type_label,
t1.is_top,
t1.sort,
t1.is_secret,
t1.is_draft,
t1.create_user,
t1.create_time,
t1.update_time,
t1.terminal,
t1.remarks,
t4.id AS is_like,
(SELECT COUNT(t5.id) FROM likes t5 WHERE t5.target_id = t1.id) AS like_count,
t6.id AS is_collection,
(SELECT COUNT(t5_1.id) FROM likes t5_1 WHERE t5_1.target_id IN (SELECT t5_2.id FROM novels_chapter t5_2 WHERE t5_2.novel_id = t1.id)) AS chapter_like_count,
(SELECT COUNT(t7.id) FROM collections t7 WHERE t7.target_id = t1.id) AS collection_count,
(SELECT COUNT(t7_1.id) FROM collections t7_1 WHERE t7_1.target_id IN (SELECT t7_2.id FROM novels_chapter t7_2 WHERE t7_2.novel_id = t1.id)) AS chapter_collection_count,
(SELECT COUNT(t8.id) FROM comments_first t8 WHERE t8.target_id = t1.id) AS comment_count1,
(SELECT COUNT(t8_1.id) FROM comments_first t8_1 WHERE t8_1.target_id IN (SELECT t8_2.id FROM novels_chapter t8_2 WHERE t8_2.novel_id = t1.id)) AS chapter_comment_count1,
(SELECT COUNT(t9.id) FROM comments_second t9 WHERE t9.comment_first_target_id = t1.id) AS comment_count2,
(SELECT COUNT(t9_1.id) FROM comments_second t9_1 WHERE t9_1.comment_first_target_id IN (SELECT t9_2.id FROM novels_chapter t9_2 WHERE t9_2.novel_id = t1.id)) AS chapter_comment_count2,
(SELECT COUNT(t10.id) FROM novels_chapter t10 WHERE t10.novel_id = t1.id AND (t10.create_user = '25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b' OR (t10.is_draft = 0 AND t10.is_secret = 0))) AS chapter_count FROM novels t1 LEFT JOIN tags t2 ON t1.type = t2.code LEFT JOIN users t3 ON t1.create_user = t3.id LEFT JOIN likes t4 ON (t1.id = t4.target_id AND t4.create_user = '25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b') LEFT JOIN collections t6 ON (t1.id = t6.target_id AND t6.create_user = '25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b') WHERE (t1.is_secret = 0 OR (t1.is_secret = 1 AND t1.create_user = '25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b')) AND ( t1.name LIKE '%连续%' OR t1.author = '连续' OR t3.username = '连续' OR t1.introduce LIKE '%连续%' ) AND ( t1.create_user = '25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b' AND t1.is_draft = '0' ) ORDER BY (select LENGTH(t1.name) - LENGTH('连续')) DESC ,
(select LENGTH(t1.author) - LENGTH('连续')) DESC ,
(select LENGTH(t3.username) - LENGTH('连续')) DESC ,
(select LENGTH(t1.introduce) - LENGTH('连续')) DESC t1.sort,
t1.update_time DESC LIMIT 0,
10
```