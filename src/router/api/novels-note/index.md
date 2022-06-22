
## ---------------- 新增笔记 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增笔记

#### 请求

- `get | post`
- `novel-note/add`

#### 参数

- body 传参

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| target | array | 是 | 目标对象集合 `[{id, type}]`，其中type暂时支持['502', '503', '504', '505', '507'] |
<!-- | targetIds | string | 是 | 目标id集合，多个目标用逗号隔开且必须为同一来源类型 | -->
<!-- | type | string | 是 | 笔记分类，暂时支持['502', '503', '504', '505', '507'] | -->
| content | string | 是 | 笔记内容 |
| title | string | 否 | 笔记内容 |
| classify | string | 否 | 自定义标签分类的id，如人物、武器等，最多三个，分类类型建议用novelClassify |
| sort | number | 否 | 序号，从小到大，默认1 |
| isSecret | string | 否 | 是否为私密笔记，1 是 0 否，默认0 |
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


## ---------------- 笔记修改 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 笔记修改

#### 请求

- `get | post`
- `novel-note/update`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 笔记id |
| targetIds | string | 否 | 目标id集合，多个目标用逗号隔开且必须为同一来源类型 |
| type | string | 否 | 笔记分类，暂时支持['502', '503', '504', '505', '507'] |
| content | string | 否 | 笔记内容 |
| title | string | 否 | 笔记内容 |
| classify | string | 否 | 自定义标签分类的id，如人物、武器等，最多三个 |
| sort | number | 否 | 序号，从小到大，默认1 |
| isSecret | string | 否 | 是否为私密笔记，1 是 0 否，默认1 |
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

## ---------------- 删除笔记 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除笔记，仅本人可删除

#### 请求

- `get | post`
- `novel-note/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 笔记id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取指定的笔记 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的笔记，如果为私密笔记只有本人可获取，原则上笔记只有本人可获取，但考虑后面需求公开的笔记非本人也可获取，因此isSecret默认为1

#### 请求

- `get | post`
- `novel-note/get/one`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 笔记id |

#### 返回字段说明

- 返回对象或null

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 笔记id |
| targetIds | array/[] | 所属目标集合/[] |
| type | string | 笔记类型标签code |
| typeLabel | string | 笔记类型标签说明 |
| title | string | 标题 |
| content | string | 内容 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| sort | number | 排序 |
| isSecret | string | 是否为私密笔记，1 是 0 否 |
| createUser | string | 创建者id |
| createUserName | string | 创建者名字 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |
| isSelf | string | 是否本人的笔记，1 是 0 否 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "5469bbaf-ad90-4c7e-9a4c-67085048c0b0",
    "targetIds": [
      {
        "id": "00055bfe-e51b-433a-ace3-e7c103c1c369",
        "title": "章节2"
      }
    ],
    "type": "507",
    "typeLabel": "小说章节来源",
    "title": "标题6",
    "content": "笔记内容6",
    "classify": [
      {
        "id": "b2888c02-ffec-4039-8ec3-91ec4a8716d4",
        "label": "前端",
        "sort": 1,
        "type": "classify",
        "createTime": "2021-08-18 03:10:58",
        "updateTime": "2021-08-18 03:10:58",
        "terminal": "管理端",
        "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
        "createUserName": "超级管理员"
      }
    ],
    "sort": 5,
    "isSecret": "0",
    "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
    "createUserName": "超级管理员",
    "createTime": "2022-03-20 15:55:53",
    "updateTime": "2022-03-20 15:55:53",
    "terminal": "管理端",
    "remarks": "备注",
    "isSelf": "1"
  },
  "total": 0
}
```


## ---------------- 获取指定目标所有的笔记列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定目标所有的笔记列表，如果为私密笔记只有本人可获取，原则上笔记只有本人可获取，但考虑后面需求公开的笔记非本人也可获取，因此isSecret默认为1

#### 请求

- `get | post`
- `novel-note/get/list`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| targetId | number | 是 | 指定目标id |
| keyword | string | 否 | 关键字 |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| isSecret | string | 否 | 是否为私密小说，1 是 0 否 |

#### 返回字段说明

- 返回数组或[]
- 排序规则
   `搜索相似度(标题 内容)降序`
   `sort升序`
   `updateTime`

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 笔记id |
| targetIds | array/[] | 所属目标集合/[] |
| type | string | 笔记类型标签code |
| typeLabel | string | 笔记类型标签说明 |
| title | string | 标题 |
| content | string | 内容 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| sort | number | 排序 |
| isSecret | string | 是否为私密笔记，1 是 0 否 |
| createUser | string | 创建者id |
| createUserName | string | 创建者名字 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |
| remarks | string | 备注 |
| isSelf | string | 是否本人的笔记，1 是 0 否 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "9ec77290-f936-45c7-a34b-28a8024e58f8",
      "targetIds": [
        {
          "id": "00055bfe-e51b-433a-ace3-e7c103c1c369",
          "title": "章节2.。。"
        }
      ],
      "type": "507",
      "typeLabel": "小说章节来源",
      "title": "标题5",
      "content": "笔记内容5",
      "classify": [
        {
          "id": "b2888c02-ffec-4039-8ec3-91ec4a8716d4",
          "label": "前端",
          "sort": 1,
          "type": "classify",
          "createTime": "2021-08-18 03:10:58",
          "updateTime": "2021-08-18 03:10:58",
          "terminal": "管理端",
          "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
          "createUserName": "超级管理员"
        }
      ],
      "sort": 3,
      "isSecret": "1",
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createUserName": "超级管理员",
      "createTime": "2022-03-20 15:55:30",
      "updateTime": "2022-03-20 15:55:30",
      "terminal": "管理端",
      "remarks": "备注",
      "isSelf": "1"
    }
  ],
  "total": 3
}
```
