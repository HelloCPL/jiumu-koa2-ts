
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
| id | string | 否 | 用户-特殊标签关联id |
| userId/tagCode | string | 否 | 用户id和标签code 与上面关联id两者传其一即可 |

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

#### 请求

- `get | post`
- `user-tag/get/alltag/byuserid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| userId | string | 是 | 用户id |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |

#### 返回字段说明

- 返回数组或[]

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| relevanceId | string | 关联id |
| id | string | 特殊标签id |
| parentCode | string | 父级特殊标签code |
| parentLabel | string | 父级特殊标签描述 |
| code | string | 特殊标签code |
| label | string | 特殊标签描述 |
| sort | number | 排序，值越小越前 |
| configurable | string | 是否可修改 0 可修改 1 超级管理员可修改 -1 不可修改 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "relevanceId": "006643d6-2a69-492a-8330-b327ab789f85",
      "id": "2906d294-a11d-4f82-a601-988013e6dd01",
      "parentCode": "8888",
      "parentLabel": "特殊标签",
      "code": "8001",
      "label": "大咖",
      "sort": 1,
      "configurable": '0',
      "createTime": "2021-08-13 15:51:34",
      "updateTime": "2021-08-13 15:51:34",
      "terminal": "管理端",
      "remarks": null
    }
  ],
  "total": 3
}
```

## ---------------- 获取指定特殊标签关联的所有用户 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定特殊标签关联的所有用户
- 注意：只有特殊标签才可获取

#### 请求

- `get | post`
- `user-tag/get/alluser/bytagcode`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| tagCode | string | 是 | 特殊标签code |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| simple | string | 否 | '1' 返回数据列表简洁模式 '0' 正常模式，默认简洁模式 |

#### 返回字段说明

- 返回数组或[]
- 按 `updateTime更新时间降序` 排序

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| relevanceId | string | 关联id |
| id | string | 用户id |
| phone | string | 用户账号（即手机号） |
| username | string | 用户名称 |
| sex | string | 性别标签code |
| sexLabel | string | 性别标签说明 |
| birthday | string | 生日 |
| avatar | object/null | 头像文件对象 |
| professional | string | 职位 |
| address | string | 地址 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "relevanceId": "006643d6-2a69-492a-8330-b327ab789f85",
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
  "total": 2
}
```