
## ---------------- 新增笔记 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增笔记，笔记不仅可用于连载笔记，目前支持 `'502', '503', '504', '505', '507'`

#### 请求

- `get | post`
- `novel-note/add`

#### 参数

- body 传参

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| target | array | 是 | 所属目标对象集合 `[{id, type}]`，其中type暂时支持['502', '503', '504', '505', '507'] |
| content | string | 是 | 笔记内容 |
| title | string | 否 | 笔记内容 |
| classify | string | 否 | 自定义标签分类的id，如人物、武器等，最多三个，若为连载/连载章节分类类型建议用novelClassify，其他看情况而定 |
| sort | number | 否 | 序号，从小到大，默认1 |
| isSecret | string | 否 | 是否为私密笔记，1 是 0 否，默认1 |
| remarks | string | 否 | 备注 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": "32767960-a653-47c4-839f-cc1983f6723c",
  "total": 0
}
```


## ---------------- 笔记修改 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 笔记修改，其中若修改target时，target不能置空

#### 请求

- `get | post`
- `novel-note/update`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 笔记id |
| target | array | 否 | 所属目标对象集合 `[{id, type}]`，其中type暂时支持['502', '503', '504', '505', '507'] |
| content | string | 否 | 笔记内容 |
| title | string | 否 | 笔记内容 |
| classify | string | 否 | 自定义标签分类的id，如人物、武器等，最多三个，若为连载/连载章节分类类型建议用novelClassify，其他看情况而定 |
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
- 获取指定的笔记，如果为私密笔记只有本人可获取，原则上笔记只有本人可获取
- 但考虑后面需求公开的笔记非本人也可获取，因此isSecret默认为1
- 同时笔记没有点赞、收藏或评论

#### 请求

- `get | post`
- `novel-note/get/one`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 笔记id |
| showUserInfo | string | 否 | 是否增加创建者姓名与头像 '1' 是 其他否 默认 '1' |

#### 返回字段说明

- 返回对象或null

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 笔记id |
| target | array/[] | 所属目标集合 `[{id, title, type, typeLabel}]` |
| title | string | 标题 |
| content | string | 内容 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| sort | number | 排序 |
| isSecret | string | 是否为私密笔记，1 是 0 否 |
| createUser | string | 创建者id |
| createUserName | string | 创建者名字 |
| createUserAvatar | object/null | 创建者头像 |
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
    "id": "32767960-a653-47c4-839f-cc1983f6723c",
    "target": [
      {
        "id": "9e232a68-d0db-45bd-8ba7-e29cc1b70921",
        "type": "504",
        "title": "连续载体1",
        "typeLabel": "连载来源"
      }
    ],
    "title": "标题2",
    "content": "这是一段笔记文本",
    "classify": [
      {
        "id": "d2ce20ca-98e5-4833-afa6-8c636d3f1973",
        "label": "美术",
        "sort": 1,
        "type": null,
        "createTime": "2021-08-18 03:12:22",
        "updateTime": "2021-08-18 03:12:22",
        "terminal": "管理端",
        "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
        "createUserName": "超级管理员"
      }
    ],
    "sort": 2,
    "isSecret": "1",
    "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
    "createUserName": "超级管理员",
    "createUserAvatar": {
      "id": "628aa32f-f270-43e8-921b-15fc9736f486",
      "filePath": "http://localhost:3030/images/e30b56b0-7aaf-11ed-bce7-1fcf06575d20.jpg",
      "fileName": "R-C (2).jpg",
      "fileSize": 20764,
      "suffix": "jpg",
      "staticPlace": "images",
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createUserName": "管理员",
      "isSecret": "0",
      "createTime": "2022-12-13 14:32:16",
      "updateTime": "2022-12-13 14:32:16",
      "terminal": "移动端",
      "remarks": null
    },
    "createTime": "2022-06-23 15:16:51",
    "updateTime": "2022-06-23 15:16:51",
    "terminal": "管理端",
    "remarks": null,
    "isSelf": "1"
  },
  "total": 0
}
```


## ---------------- 获取指定目标所有的笔记列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的笔记，如果为私密笔记只有本人可获取，原则上笔记只有本人可获取
- 但考虑后面需求公开的笔记非本人也可获取，因此isSecret默认为1
- 同时笔记没有点赞、收藏或评论

#### 请求

- `get | post`
- `novel-note/get/list`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| targetId | number | 是 | 指定目标id |
| keyword | string | 否 | 关键字 |
| highlight | string | 否 | 是否高亮显示搜索关键字 '0' 否 '1' 高亮（需要用v-html渲染） 默认不高亮 |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| isSecret | string | 否 | 是否为私密小说，1 是 0 否 |
| classify | string | 否 | 自定义文章类型，单选，若为连载/连载章节分类类型建议用novelClassify，其他看情况而定 |
| showUserInfo | string | 否 | 是否增加创建者姓名与头像 '1' 是 其他否 默认 '0' |

#### 返回字段说明

- 返回数组或[]
- 排序规则
   `搜索相似度(标题 内容)降序`
   `sort升序`
   `updateTime`

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 笔记id |
| target | array/[] | 所属目标集合 `[{id, title, type, typeLabel, isTarget(是否为当前指定目标 '1' 是 '0' 否) }]` |
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
      "id": "5d36d9d0-7a93-43c3-947e-dfd1011b2011",
      "target": [
        {
          "id": "9e232a68-d0db-45bd-8ba7-e29cc1b70921",
          "type": "504",
          "title": "连续载体1",
          "typeLabel": "连载来源",
          "isTarget": "1"
        }
      ],
      "title": "标题3",
      "content": "这是一段笔记文本",
      "classify": [
        {
          "id": "c7677e7a-7172-4eab-8312-556ed5fb425c",
          "label": "mysql",
          "sort": 2,
          "type": "classify",
          "createTime": "2022-06-22 20:58:21",
          "updateTime": "2022-06-22 20:58:21",
          "terminal": "移动端",
          "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
          "createUserName": "超级管理员"
        }
      ],
      "sort": 1,
      "isSecret": "1",
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "createUserName": "超级管理员",
      "createTime": "2022-06-23 15:15:06",
      "updateTime": "2022-06-23 15:15:06",
      "terminal": "管理端",
      "remarks": null,
      "isSelf": "1"
    }
  ],
  "total": 3
}
```
