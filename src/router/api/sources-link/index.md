
## ---------------- 新增资源的外部资源信息 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增资源的外部资源信息

#### 请求

- `get | post`
- `source-link/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| title | string | 是 | 标题 |
| link | string | 是 | 外部资源链接地址 |
| cover_img1 | string | 否 | 封面图id，内部资源，只传一个 |
| cover_img2 | string | 否 | 封面图链接，直接采用外部地址 |
| sort | mediumint | 否 | 排序，值越小越前，默认1 |
| remarks | string | 否 | 备注 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": "4293e89c-be57-49fe-9a32-fdc7f82a7021",
  "total": 0
}
```

## ---------------- 修改资源的外部资源信息 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 修改资源的外部资源信息，仅可修改自己发布的资源的外部资源信息

#### 请求

- `get | post`
- `source-link/update`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | id |
| title | string | 否 | 标题 |
| link | string | 否 | 外部资源链接地址 |
| cover_img1 | string | 否 | 封面图id，内部资源，只传一个 |
| cover_img2 | string | 否 | 封面图链接，直接采用外部地址 |
| sort | mediumint | 否 | 排序，值越小越前 |
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

## ---------------- 删除资源的外部资源信息 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除资源的外部资源信息，仅可删除自己发布的资源的外部资源信息

#### 请求

- `get | post`
- `source-link/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```