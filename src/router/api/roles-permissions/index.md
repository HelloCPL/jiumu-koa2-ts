
## ---------------- 新增角色-权限关联 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增角色-权限关联
  只有角色id、权限id存在可新增

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
