
## ---------------- 新增角色-权限关联 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增角色-权限关联
- 只有角色id、权限id存在可新增

#### 请求

- `get | post` 
- `role/permission/add`

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
- `role/permission/delete`

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

## ---------------- 获取指定角色拥有的所有权限 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定角色拥有的所有权限，只返回指定角色所包含的权限
- 返回数组或[]

#### 请求

- `get | post` 
- `role/permission/get/allpermission`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| roleIds | string | 是 | 角色ids 多个用逗号隔开 |

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
    },
    {
      "id": "4ffd9481-acc4-4bc4-9081-98c2c557791c",
      "parentCode": "0",
      "code": "permission:delete",
      "label": "权限删除",
      "href": "/permission/delete",
      "sort": 1,
      "createTime": "2021-08-12 15:02:17",
      "updateTime": "2021-08-12 15:02:17",
      "terminal": "管理端",
      "remarks": null
    }
  ],
  "total": 0
}
```
