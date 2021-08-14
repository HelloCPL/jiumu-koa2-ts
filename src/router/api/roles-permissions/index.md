
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
- 返回数组或[]

#### 请求

- `get | post` 
- `role-permission/get/allpermission/byroleid`

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
      "id": "3c47e7be-3327-4ecc-bd6e-0a9618e87227",
      "parentCode": "0",
      "code": "permission:update",
      "label": "权限修改",
      "href": "/permission/update",
      "sort": 1,
      "createTime": "2021-08-12 14:56:32",
      "updateTime": "2021-08-12 14:56:32",
      "terminal": "管理端",
      "remarks": null
    }
  ],
  "total": 0
}
```

## ---------------- 获取指定权限关联的所有角色 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定权限关联的所有角色
- 返回数组或[]

#### 请求

- `get | post` 
- `role-permission/get/allrole/bypermissionid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| permissionId | string | 是 | 权限id |

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
