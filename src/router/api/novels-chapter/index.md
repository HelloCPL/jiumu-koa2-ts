
## ---------------- 新增小说章节 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增小说

#### 请求

- `get | post`
- `novel-chapter/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| novelId | string | 是 | 小说id |
| title | string | 是 | 章节标题 |
| content | string | 是 | 章节内容 |
| sort | mediumint | 是 | 章节排序，不可重复，从小到大 |
| isDraft | string | 是 | 是否为草稿，1 是 0 否 |
| isSecret | string | 否 | 是否为私密，1 是 0 否，默认0 |
| remarks | string | 否 | 备注 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```


## ---------------- 新增小说章节 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增小说

#### 请求

- `get | post`
- `novel-chapter/update`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 章节id |
| title | string | 是 | 章节标题 |
| content | string | 是 | 章节内容 |
| sort | mediumint | 是 | 章节排序，不可重复，从小到大 |
| isDraft | string | 是 | 是否为草稿，1 是 0 否 |
| isSecret | string | 否 | 是否为私密，1 是 0 否，默认0 |
| remarks | string | 否 | 备注 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```
