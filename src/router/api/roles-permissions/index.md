
## ---------------- 新增角色-权限关联 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增角色-权限关联
- 只有角色id、权限id存在可新增

#### 请求

- `get | post`
- `role-permission/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| roleId | string | 是 | 角色id |
| permissionId | string | 是 | 权限id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 删除角色-权限关联 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除角色-权限关联

#### 请求

- `get | post`
- `role-permission/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 角色-权限关联id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取指定角色关联的所有权限 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定角色关联的所有权限

#### 请求

- `get | post`
- `role-permission/get/allpermission/byroleid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| roleId | string | 是 | 角色id |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |

- 返回数组或[]
- 按 `sort升序、updateTime更新时间降序` 排序

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 权限id |
| code | string | 权限code |
| label | string | 权限描述 |
| href | string | 关联权限路径 |
| sort | number | 排序，值越小越前 |
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
      "id": "50253b99-c288-4206-b730-350157a1b56a",
      "code": "permission:get:byparentcode",
      "label": "获取某类权限",
      "href": "/permission/get/byparentcode",
      "sort": 1,
      "createTime": "2021-08-12 15:08:06",
      "updateTime": "2021-08-12 15:08:06",
      "terminal": "管理端",
      "remarks": null
    }
  ],
  "total": 4
}
```

## ---------------- 获取指定权限关联的所有角色 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定权限关联的所有角色

#### 请求

- `get | post`
- `role-permission/get/allrole/bypermissionid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| permissionId | string | 是 | 权限id |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |

#### 返回字段说明

- 返回数组或[]
- 按 `sort升序、updateTime更新时间降序` 排序

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 角色id |
| code | string | 角色code |
| label | string | 角色描述 |
| sort | number | 排序，值越小越前 |
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

## ---------------- 获取指定用户关联的所有权限 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定用户关联的所有权限

#### 请求

- `get | post`
- `role-permission/get/allpermission/byuserid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| userId | string | 是 | 用户id |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |

- 返回数组或[]
- 按 `sort升序、updateTime更新时间降序` 排序

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 权限id |
| code | string | 权限code |
| label | string | 权限描述 |
| href | string | 关联权限路径 |
| sort | number | 排序，值越小越前 |
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
      "id": "50253b99-c288-4206-b730-350157a1b56a",
      "code": "permission:get:byparentcode",
      "label": "获取某类权限",
      "href": "/permission/get/byparentcode",
      "sort": 1,
      "createTime": "2021-08-12 15:08:06",
      "updateTime": "2021-08-12 15:08:06",
      "terminal": "管理端",
      "remarks": null
    }
  ],
  "total": 4
}
```

## ---------------- 获取指定权限关联的所有用户 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定权限关联的所有用户

#### 请求

- `get | post`
- `role-permission/get/alluser/bypermissionid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| permissionId | string | 是 | 权限id |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |

#### 返回字段说明

- 返回数组或[]
- 按 `updateTime更新时间降序` 排序

 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|:---:|
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
      "id": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f",
      "phone": "15820291405",
      "username": "陈一支",
      "sex": "201",
      "sexLabel": "男",
      "birthday": "2021-08-10 00:00:00",
      "avatar": {
        "id": "7d1b48cb-2b82-49de-953a-83b174b0f40d",
        "filePath": "http://localhost:3030/files/6116b140-f9eb-11eb-957c-5ba7f06be854.png?vt=ZHaDPHjad0ueABp1ULkmVw==&uid=bdSXpWAwve+kayTb5UHBxdbYvCniR19YvOPanH3zpv7HfE7JCa7mW1xwlvtu0RyX",
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