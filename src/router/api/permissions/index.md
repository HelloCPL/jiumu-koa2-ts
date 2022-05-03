
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
- 注意：当权限有子级权限、角色-权限关联时是不能删除的，只有将关联解除后才可删除

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

#### 请求

- `get | post` 
- `permission/get/one`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 权限 id 或 code |

#### 返回字段说明

- 返回对象或null

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 权限id |
| code | string | 权限code |
| label | string | 权限描述 |
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
  "data": {
    "id": "3c47e7be-3327-4ecc-bd6e-0a9618e87227",
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

## ---------------- 获取我的所有权限列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取我的所有权限列表

#### 请求

- `get | post` 
- `permission/get/all/self`

#### 参数
无

#### 返回字段说明

- 返回数组或[]

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 权限id |
| code | string | 权限code |
| label | string | 权限描述 |
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
      "id": "a909792d-9edb-4edc-a33a-ba491842d65f",
      "code": "test11",
      "label": "测试",
      "href": "#",
      "sort": 1,
      "createTime": "2021-12-04 00:34:51",
      "updateTime": "2021-12-04 00:36:00",
      "terminal": "管理端",
      "remarks": null,
      "checked": false
    }
  ],
  "total": 6
}
```

## ---------------- 获取权限列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取权限列表
- 若传了`roleId`，增加`checkedRoleId` 字段，表示是否与该角色关联
- 若传了`userId`，增加`checkedUserId` 字段，表示是否与该用户关联，但不可直接关联

#### 请求

- `get | post` 
- `permission/get/list`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| roleId | string | 否 | 角色id，会增加`checked` 字段，表示是否与该角色关联 |
| userId | string | 否 | 用户id，会增加`checked` 字段，表示是否与该用户关联，但不可直接关联 |

#### 返回字段说明

- 返回数组或[]
- 排序规则
  `搜索相似度(label)降序`
  `sort升序、updateTime更新时间降序`

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 权限id |
| code | string | 权限code |
| label | string | 权限描述 |
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
      "id": "a909792d-9edb-4edc-a33a-ba491842d65f",
      "code": "test11",
      "label": "测试",
      "href": "#",
      "sort": 1,
      "createTime": "2021-12-04 00:34:51",
      "updateTime": "2021-12-04 00:36:00",
      "terminal": "管理端",
      "remarks": null,
      "checked": false
    }
  ],
  "total": 6
}
```
