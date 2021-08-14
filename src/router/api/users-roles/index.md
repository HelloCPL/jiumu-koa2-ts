
## ---------------- 新增用户-角色关联 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增用户-角色关联
- 只有角色id、用户id存在可新增

#### 请求

- `get | post` 
- `user-role/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| roleId | string | 是 | 角色id |
| userId | string | 是 | 用户id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```


## ---------------- 删除用户-角色关联 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除用户-角色关联

#### 请求

- `get | post` 
- `user-role/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 用户-角色关联id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取指定用户关联的所有角色 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定用户关联的所有角色
- 返回数组或[]

#### 请求

- `get | post` 
- `user-role/get/allrole/byuserid`

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
      "id": "17e64a2d-7813-4700-be4e-dfaa454a5c47",
      "code": "workers",
      "label": "工作人员",
      "sort": 1,
      "createTime": "2021-08-12 16:05:48",
      "updateTime": "2021-08-12 16:05:48",
      "terminal": "管理端",
      "remarks": null
    }
  ],
  "total": 0
}
```

## ---------------- 获取指定角色关联的所有用户 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定角色关联的所有用户
- 返回数组或[]

#### 请求

- `get | post` 
- `user-role/get/alluser/byroleid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| roleId | string | 是 | 角色id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "phone": "root",
      "username": "超级管理员",
      "sex": "1",
      "birthday": "2000-12-15 00:00:00",
      "avatar": null,
      "professional": "打工人",
      "address": "广东",
      "createTime": "2021-08-10 09:54:37",
      "updateTime": "2021-08-10 09:54:37",
      "terminal": "pc",
      "remarks": "超级管理员需配置所有权限和标签"
    }
  ],
  "total": 0
}
```