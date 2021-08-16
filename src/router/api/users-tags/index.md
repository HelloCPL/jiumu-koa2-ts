
## ---------------- 新增用户-特殊标签关联 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增用户-特殊标签关联
- 只有用户id存在、标签为特殊标签类型可新增

#### 请求

- `get | post` 
- `user-tag/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| userId | string | 是 | 用户id |
| tagCode | string | 是 | 特殊标签code |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```


## ---------------- 删除用户-特殊标签关联 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除用户-特殊标签关联

#### 请求

- `get | post` 
- `user-tag/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 用户-特殊标签关联id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取指定用户关联的所有特殊标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定用户关联的所有特殊标签，只返回指定用户所包含的特殊标签
- 返回数组或[]

#### 请求

- `get | post` 
- `user-tag/get/alltag/byuserid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| userId | string | 是 | 用户id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "6be39cf2-1e7a-48f9-bd3d-8a0bd8f67ae4",
      "parentCode": "8888",
      "code": "8003",
      "label": "名人",
      "sort": 1,
      "createTime": "2021-08-13 15:51:19",
      "updateTime": "2021-08-13 15:51:19",
      "terminal": "管理端",
      "remarks": null
    }
  ],
  "total": 0
}
```

## ---------------- 获取指定特殊标签关联的所有用户 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定特殊标签关联的所有用户
- 注意：只有特殊标签才可获取
- 返回数组或[]

#### 请求

- `get | post` 
- `user-tag/get/alluser/bytagcode`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| tagCode | string | 是 | 特殊标签code |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f",
      "phone": "15820291405",
      "username": "陈一支",
      "sex": "201",
      "birthday": "2021-08-10 00:00:00",
      "avatar": {
        "id": "7d1b48cb-2b82-49de-953a-83b174b0f40d",
        "filePath": "http://localhost:3030/files/6116b140-f9eb-11eb-957c-5ba7f06be854.png?vt=xYWx9Gh58FGM/tF6LPAJiw==&uid=bdSXpWAwve+kayTb5UHBxdbYvCniR19YvOPanH3zpv7HfE7JCa7mW1xwlvtu0RyX",
        "fileName": "avatar.png",
        "fileSize": 6210,
        "suffix": "png",
        "staticPlace": "files",
        "createUser": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f",
        "isSecret": "1",
        "checkValidTime": 3,
        "createTime": "2021-08-10 22:58:10",
        "terminal": "pc",
        "remarks": null
      },
      "professional": "刺客",
      "address": "广州",
      "createTime": "2021-08-09 15:19:54",
      "updateTime": "2021-08-16 10:53:05",
      "terminal": "pc",
      "remarks": "负责改项目的设计、实现、测试、发布"
    }
  ],
  "total": 0
}
```