
## ---------------- 新增菜单 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增菜单

#### 请求

- `get | post` 
- `menu/add`

#### 参数

|   参数名   |   类型    | 是否必填 |          说明           |
| :--------: | :-------: | :------: | :---------------------: |
|    code    |  string   |    是    |   菜单code，不能重复    |
|   label    |  string   |    是    |        菜单说明         |
| parentCode |  string   |    否    |      父级菜单code       |
|    sort    | mediumint |    否    | 排序，值越小越前，默认1 |
|  remarks   |  string   |    否    |          备注           |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": "be9dc1de-2046-46c3-8d32-ffe2b3e29558",
  "total": 0
}
```

## ---------------- 修改菜单 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 修改菜单

#### 请求

- `get | post` 
- `menu/update`

#### 参数

|   参数名   |   类型    | 是否必填 |        说明        |
| :--------: | :-------: | :------: | :----------------: |
|     id     |  string   |    是    |       菜单id       |
|    code    |  string   |    否    | 菜单code，不能重复 |
|   label    |  string   |    否    |      菜单说明      |
| parentCode |  string   |    否    |    父级菜单code    |
|    sort    | mediumint |    否    |  排序，值越小越前  |
|  remarks   |  string   |    否    |        备注        |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 删除菜单 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除菜单
- 注意：当菜单有子级菜单、角色-菜单关联时是不能删除的，只有将关联解除后才可删除

#### 请求

- `get | post` 
- `menu/delete`

#### 参数

| 参数名 |  类型  | 是否必填 |  说明  |
| :----: | :----: | :------: | :----: |
|   id   | string |    是    | 菜单id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取指定的某个菜单 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的某个菜单
- 返回对象或null

#### 请求

- `get | post` 
- `menu/get/one`

#### 参数

| 参数名 |  类型  | 是否必填 |      说明       |
| :----: | :----: | :------: | :-------------: |
|   id   | string |    是    | 菜单 id 或 code |

#### 返回字段说明

- 返回对象或null

|    参数名    |  类型  |                  说明                  |
| :----------: | :----: | :------------------------------------: |
|      id      | string |                 菜单id                 |
|  parentCode  | string |              父级菜单code              |
| parentLabel  | string |              父级菜单描述              |
|     code     | string |                菜单code                |
|    label     | string |                菜单描述                |
|     sort     | number |            排序，值越小越前            |
| configurable | string | 是否可修改 0 可修改 1 超级管理员可修改 |
|  createTime  | string |                创建时间                |
|  updateTime  | string |                更新时间                |
|   terminal   | string |                操作终端                |
|   remarks    | string |                  备注                  |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "be9dc1de-2046-46c3-8d32-ffe2b3e29558",
    "parentCode": "system",
    "parentLabel": "系统标签",
    "code": "system-user",
    "label": "用户管理",
    "sort": 1,
    "configurable": "0",
    "createTime": "2021-08-15 01:05:17",
    "updateTime": "2021-08-15 01:05:17",
    "terminal": "管理端",
    "remarks": null
  },
  "total": 0
}
```

## ---------------- 获取我的所有菜单 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取我的所有菜单

#### 请求

- `get | post` 
- `menu/get/all/self`

#### 参数
| 参数名 | 类型 | 是否必填 | 说明 |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| isTree | string | 否 | 返回菜单是否为树结构，默认 '0' ，注意：isTree 为 '1' 时分页参数无效|

#### 返回字段说明

- 返回数组或[]，数组有子级

|    参数名    |   类型   |                  说明                  |
| :----------: | :------: | :------------------------------------: |
|      id      |  string  |                 菜单id                 |
|  parentCode  |  string  |              父级菜单code              |
| parentLabel  |  string  |              父级菜单描述              |
|     code     |  string  |                菜单code                |
|    label     |  string  |                菜单描述                |
|     sort     |  number  |            排序，值越小越前            |
| configurable |  string  | 是否可修改 0 可修改 1 超级管理员可修改 |
|  createTime  |  string  |                创建时间                |
|  updateTime  |  string  |                更新时间                |
|   terminal   |  string  |                操作终端                |
|   remarks    |  string  |                  备注                  |
|   children   | array/[] |                  子级                  |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "11db4b95-a51a-493e-918a-ecc517417dda",
      "parentCode": "system",
      "parentLabel", "用户管理",
      "code": "system-tag",
      "label": "标签管理",
      "sort": 1,
      "configurable": "0",
      "createTime": "2021-08-15 01:06:15",
      "updateTime": "2021-08-15 01:06:15",
      "terminal": "管理端",
      "remarks": null,
      "children": []
    }
  ],
  "total": 0
}
```

## ---------------- 获取某类菜单 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的获取某类菜单，返回树级结构
- 若传了`roleId`，增加`checkedRoleId` 字段，表示是否与该角色关联（只增加关联关系，并不会过滤）
- 若传了`userId`，增加`checkedUserId` 字段，表示是否与该用户关联，但不可直接关联（只增加关联关系，并不会过滤）

#### 请求

- `get | post` 
- `menu/get/byparentcode`

#### 参数

|   参数名   |  类型  | 是否必填 |                                   说明                                   |
| :--------: | :----: | :------: | :----------------------------------------------------------------------: |
| parentCode | string |    否    |                      父级菜单code，不传获取全部菜单                      |
|   roleId   | string |    否    |         角色id，会增加`checkedRoleId` 字段，表示是否与该角色关联         |
|   userId   | string |    否    | 用户id，会增加`checkedUserId` 字段，表示是否与该用户关联，但不可直接关联 |

#### 返回字段说明

- 返回数组或[]，数组有子级

|    参数名    |   类型   |                  说明                  |
| :----------: | :------: | :------------------------------------: |
|      id      |  string  |                 菜单id                 |
|  parentCode  |  string  |              父级菜单code              |
| parentLabel  |  string  |              父级菜单描述              |
|     code     |  string  |                菜单code                |
|    label     |  string  |                菜单描述                |
|     sort     |  number  |            排序，值越小越前            |
| configurable |  string  | 是否可修改 0 可修改 1 超级管理员可修改 |
|  createTime  |  string  |                创建时间                |
|  updateTime  |  string  |                更新时间                |
|   terminal   |  string  |                操作终端                |
|   remarks    |  string  |                  备注                  |
|   children   | array/[] |                  子级                  |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "11db4b95-a51a-493e-918a-ecc517417dda",
      "parentCode": "system",
      "parentLabel", "用户管理",
      "code": "system-tag",
      "label": "标签管理",
      "sort": 1,
      "configurable": "0",
      "createTime": "2021-08-15 01:06:15",
      "updateTime": "2021-08-15 01:06:15",
      "terminal": "管理端",
      "remarks": null,
      "children": []
    }
  ],
  "total": 0
}
```
