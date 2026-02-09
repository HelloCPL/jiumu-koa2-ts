
## ---------------- 新增标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增标签

#### 请求

- `get | post`
- `tag/add`

#### 参数

|   参数名   |   类型    | 是否必填 |          说明           |
| :--------: | :-------: | :------: | :---------------------: |
|    code    |  string   |    是    |   标签code，不能重复    |
|   label    |  string   |    是    |        标签说明         |
| parentCode |  string   |    否    |      父级标签code       |
|    sort    | mediumint |    否    | 排序，值越小越前，默认1 |
|  remarks   |  string   |    否    |          备注           |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": "2906d294-a11d-4f82-a601-988013e6dd01",
  "total": 0
}
```

## ---------------- 修改标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 修改标签

#### 请求

- `get | post`
- `tag/update`

#### 参数

|   参数名   |   类型    | 是否必填 |        说明        |
| :--------: | :-------: | :------: | :----------------: |
|     id     |  string   |    是    |       标签id       |
|    code    |  string   |    否    | 标签code，不能重复 |
|   label    |  string   |    否    |      标签说明      |
| parentCode |  string   |    否    |    父级标签code    |
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

## ---------------- 删除标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除标签

#### 请求

- `get | post`
- `tag/delete`

#### 参数

| 参数名 |  类型  | 是否必填 |  说明  |
| :----: | :----: | :------: | :----: |
|   id   | string |    是    | 标签id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取指定的某个标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的某个标签

#### 请求

- `get | post`
- `tag/get/bycode`

#### 参数

| 参数名 |  类型  | 是否必填 |      说明       |
| :----: | :----: | :------: | :-------------: |
|  code  | string |    是    | 标签 code 或 id |

#### 返回字段说明

- 返回对象或null

|    参数名    |  类型  |                        说明                        |
| :----------: | :----: | :------------------------------------------------: |
|      id      | string |                       标签id                       |
|  parentCode  | string |                    父级标签code                    |
| parentLabel  | string |                    父级标签描述                    |
|     code     | string |                      标签code                      |
|    label     | string |                      标签描述                      |
|     sort     | number |                  排序，值越小越前                  |
| configurable | string | 是否可修改 0 可修改 1 超级管理员可修改 -1 不可修改 |
|  createTime  | string |                      创建时间                      |
|  updateTime  | string |                      更新时间                      |
|   terminal   | string |                      操作终端                      |
|   remarks    | string |                        备注                        |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "1fae1396-6d86-4c11-b009-8ee8d8fe2e93",
    "parentCode": "100",
    "parentLabel": "状态",
    "code": "1",
    "label": "启用",
    "sort": 1,
    "configurable": "1",
    "createTime": "2021-08-12 21:54:24",
    "updateTime": "2021-08-12 21:54:24",
    "terminal": "管理端",
    "remarks": "用于系统状态，不要修改"
  },
  "total": 0
}
```

## ---------------- 获取某类标签 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的获取某类标签，不包含父级标签

#### 请求

- `get | post`
- `tag/get/byparentcode`

#### 参数

|   参数名   |  类型  | 是否必填 |              说明              |
| :--------: | :----: | :------: | :----------------------------: |
| parentCode | string |    否    | 父级标签code，不传获取全部标签 |

#### 返回字段说明

- 返回数组或[]，数组有子级

|    参数名    |   类型   |                        说明                        |
| :----------: | :------: | :------------------------------------------------: |
|      id      |  string  |                       标签id                       |
|  parentCode  |  string  |                    父级标签code                    |
| parentLabel  |  string  |                    父级标签描述                    |
|     code     |  string  |                      标签code                      |
|    label     |  string  |                      标签描述                      |
|     sort     |  number  |                  排序，值越小越前                  |
| configurable |  string  | 是否可修改 0 可修改 1 超级管理员可修改 -1 不可修改 |
|  createTime  |  string  |                      创建时间                      |
|  updateTime  |  string  |                      更新时间                      |
|   terminal   |  string  |                      操作终端                      |
|   remarks    |  string  |                        备注                        |
|   children   | array/[] |                        子级                        |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "368bf7d4-ea43-42e1-98ff-847b932655d3",
      "parentCode": "200",
      "parentLabel": "性别",
      "code": "201",
      "label": "男",
      "sort": 1,
      "configurable": "0",
      "createTime": "2021-08-11 16:30:46",
      "updateTime": "2021-08-11 16:40:12",
      "terminal": "管理端",
      "remarks": null,
      "children": []
    },
    {
      "id": "413558d0-306c-4106-8d6f-6de32ccf45a9",
      "parentCode": "200",
      "parentLabel": "性别",
      "code": "202",
      "label": "女",
      "sort": 2,
      "configurable": "0",
      "createTime": "2021-08-11 16:30:54",
      "updateTime": "2021-08-11 16:41:07",
      "terminal": "管理端",
      "remarks": null,
      "children": []
    }
  ],
  "total": 0
}
```

## ---------------- 导出标签数据 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 导出标签数据

#### 请求

- `get | post`
- `tag/export`

#### 参数

| 参数名 |  类型  | 是否必填 |  说明   |
| :----: | :----: | :------: | :-----: |
|  ids   | string |    是    | 标签ids |

#### 返回示例

- 返回文件格式的数据，前端根据数据转为二进制格式数据再进行下载
- 文件名从 `response.headers['content-disposition']` 中获取

## ---------------- 导入标签数据 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 导入标签数据
- 上传一个json文件（从导出的文件进行导入，如不同环境的数据插入），只对code为真且不存在的code进行插入

#### 请求

- `post`
- `tag/import`

#### 参数

- 字段名称 file

#### 返回示例

```
{
  "code": 200,
  "message": "成功导入1条标签数据",
  "data": 1,
  "total": 0
}
```