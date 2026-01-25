
## ---------------- 新增笔记关联 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增笔记关联
- 笔记自身不可关联（即目标仅可关联其他相同根节点的笔记）
- 仅笔记创建者可进行关联新增

#### 请求

- `get | post`
- `note-link/add`

#### 参数

|  参数名  |  类型  | 是否必填 |     说明     |
| :------: | :----: | :------: | :----------: |
|  noteId  | string |    是    | 关联的笔记id |
| targetId | string |    是    | 关联的目标id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```


## ---------------- 删除笔记关联 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 删除笔记关联
- 仅创建者可进行关联删除

#### 请求

- `get | post`
- `note-link/delete`

#### 参数

|  参数名  |  类型  | 是否必填 |     说明     |
| :------: | :----: | :------: | :----------: |
|  noteId  | string |    是    | 关联的笔记id |
| targetId | string |    是    | 关联的目标id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ------------- 获取的相同根节点的其他目标节点的可关联笔记列表 --------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取的相同根节点的其他目标节点的可关联笔记列表
- （即不会获取目标本身的笔记，而是其他相同根节点且关联性为全关联的笔记列表）

#### 请求

- `get | post`
- `note-link/get/list/byrootid`

#### 参数

|    参数名    |  类型  | 是否必填 |                                     说明                                      |
| :----------: | :----: | :------: | :---------------------------------------------------------------------------: |
|    rootId    | string |    是    |                                    根节点                                     |
|   targetId   | string |    是    |                           当前目标节点（用于排除）                            |
|   keyword    | string |    否    |                                    关键字                                     |
|  highlight   | string |    否    |      是否高亮显示搜索关键字 '0' 否 '1' 高亮（需要用v-html渲染） 默认 '0'      |
|    pageNo    | number |    否    |                                 页码，默认 1                                  |
|   pageSize   | number |    否    |                               每页页数，默认 10                               |
|   isSecret   | string |    否    |                         是否为私密笔记，'1' 是 '0' 否                         |
|   classify   | string |    否    | 自定义文章类型，单选，若为连载/连载章节分类类型建议用根节点id，其他看情况而定 |
| showUserInfo | string |    否    |                是否增加创建者姓名与头像 '1' 是 其他否 默认 '0'                |

#### 返回字段说明

- 返回数组或[]
- 按笔记的排序
  `搜索相似度(标题 内容)降序`
  `sort升序`
  `updateTime`


|       参数名       |    类型     |                  说明                   |
| :----------------: | :---------: | :-------------------------------------: |
|         id         |   string    |                 笔记id                  |
|       rootId       |   string    |                根节点id                 |
|      targetId      |   string    |               目标节点id                |
|       title        |   string    |                  标题                   |
|  titleUnhighlight  |   string    |   标题（仅高亮搜索时展示的原始字段）    |
|      content       |   string    |                  内容                   |
| contentUnhighlight |   string    |   内容（仅高亮搜索时展示的原始字段）    |
|      classify      |  array/[]   |         用户自定义标签，数组/[]         |
|        sort        |   number    |                  排序                   |
|      isSecret      |   string    |      是否为私密笔记，'1' 是 '0' 否      |
|     linkStatus     |   string    |   可关联性 '1' 全关联 '0' 仅目标关联    |
|     createUser     |   string    |                创建者id                 |
|   createUserName   |   string    |               创建者名字                |
|  createUserAvatar  | object/null |               创建者头像                |
|     createTime     |   string    |                创建时间                 |
|     updateTime     |   string    |                更新时间                 |
|      terminal      |   string    |                操作终端                 |
|      remarks       |   string    |                  备注                   |
|       isSelf       |   string    |      是否本人的笔记，'1' 是 '0' 否      |
| isTargetRelevance  |   string    | 是否与当前目标节点已关联，'1' 是 '0' 否 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "24995d74-ecd5-4e65-a783-6843845a77eb",
      "rootId": "9e232a68-d0db-45bd-8ba7-e29cc1b70921",
      "targetId": "32f8a7c3-61bc-4d68-9d41-4872071a5720",
      "classify": [
        {
          "id": "244d1d73-1de4-4cd1-b0ed-8de260c639a7",
          "label": "都是",
          "sort": 1,
          "type": "novelClassify",
          "createTime": "2023-01-21 17:10:58",
          "updateTime": "2023-01-21 17:10:58",
          "terminal": "管理端",
          "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b"
        }
      ],
      "sort": 1,
      "isSecret": "1",
      "linkStatus": "1",
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "title": "测试笔记 2",
      "content": "笔记内容",
      "createTime": "2024-09-01 00:21:54",
      "updateTime": "2024-09-01 00:21:54",
      "terminal": "管理端",
      "remarks": null,
      "isTargetRelevance": "1",
      "isSelf": "1"
    }
  ],
  "total": 2
}
```
