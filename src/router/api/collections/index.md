
## ---------------- 新增收藏 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增收藏

#### 请求

- `get | post` 
- `collection/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| targetId | string | 是 | 收藏的目标id |
| type | string | 是 | 收藏来源类型，暂时支持['502','503','504','505','507'] |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```


## ---------------- 删除收藏 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除收藏

#### 请求

- `get | post` 
- `collection/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| targetId | string | 是 | 收藏的目标id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取本用户的收藏列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取本用户的收藏列表

#### 请求

- `get | post` 
- `collection/get/list/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| type | string | 否 | 收藏来源类型，不传则获取所有类型，暂时支持['502','503','504','505','507'] |

#### 返回字段说明

- 返回数组或[]
- 按 `createTime创建时间降序` 排序

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 收藏id |
| targetId | string | 收藏目标id |
| createUser | string | 收藏者id |
| createUserName | string | 收藏者名字 |
| type | string | 收藏来源类型标签code |
| typeLabel | string | 收藏来源类型标签说明 |
| createTime | string | 创建时间 |
| terminal | string | 操作终端 |
| title | string | 收藏目标标题 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "723530d6-16f1-4101-a45f-1add01479f46",
      "targetId": "18",
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createUserName": "超级管理员",
      "type": "502",
      "typeLabel": "问答",
      "createTime": "2021-08-17 10:58:05",
      "terminal": "管理端",
      "title": "测试33"
    }
  ],
  "total": 4
}
```

## ---------------- 根据 userId 获取收藏列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 根据 userId 获取收藏列表

#### 请求

- `get | post` 
- `collection/get/list`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| userId | string | 是 | 用户id |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| type | string | 否 | 收藏来源类型，不传则获取所有类型，暂时支持['502','503','504','505','507'] |

#### 返回字段说明

- 返回数组或[]
- 按 `createTime创建时间降序` 排序

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 收藏id |
| targetId | string | 收藏目标id |
| createUser | string | 收藏者id |
| createUserName | string | 收藏者名字 |
| type | string | 收藏来源类型标签code |
| typeLabel | string | 收藏来源类型标签说明 |
| createTime | string | 创建时间 |
| terminal | string | 操作终端 |
| title | string | 收藏目标标题 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "723530d6-16f1-4101-a45f-1add01479f46",
      "targetId": "18",
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createUserName": "超级管理员",
      "type": "502",
      "typeLabel": "问答",
      "createTime": "2021-08-17 10:58:05",
      "terminal": "管理端",
      "title": "测试33"
    }
  ],
  "total": 4
}
```
