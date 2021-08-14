<!-- 

废弃

## ---------------- 新增用户-权限关联，用户额外的权限 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增用户-权限关联，用户额外的权限，
- 只有用户id、权限id、状态标签status存在可新增

#### 请求

- `get | post` 
- `user/permission/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| userId | string | 是 | 用户id |
| permissionId | string | 是 | 权限id |
| status | string | 是 | 系统状态标签 1 启用 0 禁用 |
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

## ---------------- 修改用户-权限关联，用户额外的权限 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 修改用户-权限关联，用户额外的权限

#### 请求

- `get | post` 
- `user/permission/update`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 用户-权限关联id |
| userId | string | 否 | 用户id |
| permissionId | string | 否 | 权限id |
| status | string | 否 | 系统状态标签 1 启用 0 禁用 |
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

## ---------------- 删除用户-权限关联，用户额外的权限 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除用户-权限关联，用户额外的权限

#### 请求

- `get | post` 
- `user/permission/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 用户-权限关联id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取指定用户拥有的额外权限 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定用户拥有的额外权限，只返回指定用户所包含的额外权限
- 返回数组或[]

#### 请求

- `get | post` 
- `user/permission/get/allpermission`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| userId | string | 是 | 用户ids |

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
``` -->
