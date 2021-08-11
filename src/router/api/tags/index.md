
## ---------------- 新增标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增标签

#### 请求

- `get | post` 
- `tag/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| code | string | 是 | 标签code，不能重复 |
| parent_code | string | 否 | 父级标签code，默认 0 |
| label | string | 是 | 标签说明 |
| sort | mediumint | 否 | 排序，值越小越前，默认1 |
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

## ---------------- 修改标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 修改标签

#### 请求

- `get | post` 
- `tag/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 标签id |
| code | string | 是 | 标签code，不能重复 |
| parent_code | string | 否 | 父级标签code，默认 0 |
| label | string | 是 | 标签说明 |
| sort | mediumint | 否 | 排序，值越小越前，默认1 |
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

## ---------------- 删除标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除标签
  注意：当标签有子级标签时是不能删除的，只有将其子级删除后才可以删除

#### 请求

- `get | post` 
- `tag/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 标签id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```