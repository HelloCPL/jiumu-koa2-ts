
## ---------------- 新增角色-菜单关联 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增角色-菜单关联
- 角色id、菜单id存在和如果该菜单有父级必须父级关联后可新增

#### 请求

- `get | post` 
- `role-menu/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| roleId | string | 是 | 角色id |
| menuId | string | 是 | 菜单id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```


## ---------------- 删除角色-菜单关联 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除角色-菜单关联
- 如果菜单单有子级，必须解除自己后才可删除

#### 请求

- `get | post` 
- `role-menu/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| roleId | string | 是 | 角色id |
| menuId | string | 是 | 菜单id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取指定角色关联的所有菜单 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定角色关联的所有菜单
- 返回数组或[]

#### 请求

- `get | post` 
- `role-menu/get/allmenu/byroleid`

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
      "id": "d0cf5069-07cc-4d4c-8793-e8853b9a6f56",
      "parentCode": "",
      "code": "system",
      "label": "系统管理",
      "sort": 1,
      "createTime": "2021-08-15 01:04:40",
      "updateTime": "2021-08-15 01:04:40",
      "terminal": "管理端",
      "remarks": null
    },
  ],
  "total": 0
}
```

## ---------------- 获取指定菜单关联的所有角色 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定菜单关联的所有角色
- 返回数组或[]

#### 请求

- `get | post` 
- `role-menu/get/allrole/bymenuid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| menuId | string | 是 | 菜单id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "d6bb3323-b581-4b46-b7e4-4da9a899ea6c",
      "code": "super",
      "label": "超级管理员",
      "sort": 1,
      "createTime": "2021-08-12 16:00:37",
      "updateTime": "2021-08-12 16:00:37",
      "terminal": "管理端",
      "remarks": null
    }
  ],
  "total": 0
}
```
