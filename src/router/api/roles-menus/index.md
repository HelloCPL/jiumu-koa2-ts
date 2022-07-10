
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
| id | string | 是 | 关联id |

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

#### 请求

- `get | post`
- `role-menu/get/allmenu/byroleid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| roleId | string | 是 | 角色id |
| isTree | string | 否 | 返回菜单是否为树结构，默认 0 ，注意：isTree 为 1 时分页参数无效|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |

#### 返回字段说明

- 返回数组或[]
- 非树结构按 `sort升序、updateTime更新时间降序` 排序

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 菜单id |
| parentCode | string | 父级菜单code |
| parentLabel | string | 父级菜单描述 |
| code | string | 菜单code |
| label | string | 菜单描述 |
| sort | number | 排序，值越小越前 |
| configurable | string | 是否可修改 0 可修改 1 超级管理员可修改 |
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
      "id": "d0cf5069-07cc-4d4c-8793-e8853b9a6f56",
      "parentCode": "",
      "parentLabel": null,
      "code": "system",
      "label": "系统管理",
      "sort": 1,
      "configurable": "0",
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

#### 请求

- `get | post`
- `role-menu/get/allrole/bymenuid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| menuId | string | 是 | 菜单id |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |

#### 返回字段说明

- 返回数组或[]
- 按 `sort升序、updateTime更新时间降序` 排序

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 角色id |
| code | string | 角色code |
| label | string | 角色描述 |
| sort | number | 排序，值越小越前 |
| configurable | string | 是否可修改 0 可修改 1 超级管理员可修改 |
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
      "id": "d6bb3323-b581-4b46-b7e4-4da9a899ea6c",
      "code": "super",
      "label": "超级管理员",
      "sort": 1,
      "configurable": "0",
      "createTime": "2021-08-12 16:00:37",
      "updateTime": "2021-08-12 16:00:37",
      "terminal": "管理端",
      "remarks": null
    }
  ],
  "total": 0
}
```

## ---------------- 获取指定用户关联的所有菜单 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定用户关联的所有菜单

#### 请求

- `get | post`
- `role-menu/get/allmenu/byuserid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| userId | string | 是 | 用户id |
| isTree | string | 否 | 返回菜单是否为树结构，默认 false ，注意：isTree 为 true 时分页参数无效|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |

#### 返回字段说明

- 返回数组或[]，有子级，树结构
- 按 `sort升序、updateTime更新时间降序` 排序

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 菜单id |
| parentCode | string | 父级菜单code |
| parentLabel | string | 父级菜单描述 |
| code | string | 菜单code |
| label | string | 菜单描述 |
| sort | number | 排序，值越小越前 |
| configurable | string | 是否可修改 0 可修改 1 超级管理员可修改 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |
| children | array/[] | 子级 isTree 树级结构时有 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "be9dc1de-2046-46c3-8d32-ffe2b3e29558",
      "parentCode": "system",
      "parentLabel": "系统管理",
      "code": "system-user",
      "label": "用户管理",
      "sort": 1,
      "configurable": "0",
      "createTime": "2021-08-15 01:05:17",
      "updateTime": "2021-08-15 01:05:17",
      "terminal": "管理端",
      "remarks": null
    },
  ],
  "total": 3
}
```

## ---------------- 获取指定菜单关联的所有用户 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定菜单关联的所有用户

#### 请求

- `get | post`
- `role-menu/get/alluser/bymenuid`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| menuId | string | 是 | 菜单id |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |

#### 返回字段说明

- 返回数组或[]
- 按 `updateTime更新时间降序` 排序

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
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
        "filePath": "http://localhost:3030/files/6116b140-f9eb-11eb-957c-5ba7f06be854.png?vt=WSsiFDXucsL2LdW25LeBhw==&uid=bdSXpWAwve+kayTb5UHBxdbYvCniR19YvOPanH3zpv7HfE7JCa7mW1xwlvtu0RyX",
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