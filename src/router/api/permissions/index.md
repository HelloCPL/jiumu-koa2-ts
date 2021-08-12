
## ---------------- 新增权限 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增权限

#### 请求

- `get | post` 
- `permission/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| code | string | 是 | 权限code，不能重复 |
| label | string | 是 | 权限说明 |
| href | string | 否 | 关联接口,*表示后面任意类型，默认# |
| parent_code | string | 否 | 父级权限code，默认 0 |
| sort | mediumint | 否 | 排序，值越小越前，默认1 |
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

## ---------------- 修改权限 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 修改权限

#### 请求

- `get | post` 
- `permission/update`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 权限id |
| code | string | 否 | 权限code，不能重复 |
| label | string | 否 | 权限说明 |
| href | string | 否 | 关联接口,*表示后面任意类型，默认# |
| parent_code | string | 否 | 父级权限code，默认 0 |
| sort | mediumint | 否 | 排序，值越小越前，默认1 |
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

## ---------------- 删除权限 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除权限
  注意：当权限有子级权限时是不能删除的，只有将其子级删除后才可以删除

#### 请求

- `get | post` 
- `tag/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 权限id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取指定的某个权限 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的某个权限
  返回对象或null

#### 请求

- `get | post` 
- `permission/get/one`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 权限 id 或 code |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
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
  "total": 0
}
```

## ---------------- 获取某类权限 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的获取某类权限
  若传了`roleId`，增加`checked`、`disabled`两个字段，其中`disabled`根据`user-permissions`关联判断是否可选
  若传了`userId`，优先级比`roleId`高（即用户可能包含多个角色），增加`checked`、`disabled`、`special`三个字段，其中`disabled`恒为 `true`
  返回数组或[]

#### 请求

- `get | post` 
- `tag/get/byparentcode`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| parentCode | string | 否 | 父级权限code，不传或传 0 获取全部权限 |
| roleId | string | 否 | 角色id，会增加 checked 是否包含 disabled 是否可选 两个字段 |
| userId | string | 否 | 用户id，会增加 checked 是否包含 disabled 是否可选 special 是否为用户额外权限 三个字段 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "50253b99-c288-4206-b730-350157a1b56a",
      "parentCode": "permission:get",
      "code": "permission:get:byparentcode",
      "label": "获取某类权限",
      "href": "/permission/get/byparentcode",
      "sort": 1,
      "createTime": "2021-08-12 15:08:06",
      "updateTime": "2021-08-12 15:08:06",
      "terminal": "管理端",
      "remarks": null
    },
    {
      "id": "6eb4f2e2-0ead-4717-ba3d-b2df2ffe0180",
      "parentCode": "permission:get",
      "code": "permission:get:bycode",
      "label": "获取某个权限",
      "href": "/permission/get/bycode",
      "sort": 1,
      "createTime": "2021-08-12 15:07:40",
      "updateTime": "2021-08-12 15:07:40",
      "terminal": "管理端",
      "remarks": null
    }
  ],
  "total": 0
}
```
