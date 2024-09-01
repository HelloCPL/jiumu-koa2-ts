
## ---------------- 新增笔记 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增笔记
- 笔记更新为独立模块，不受根节点或目标节点的影响，因此也不作这两者的来源

#### 请求

- `get | post`
- `note/add`

#### 参数

- body 传参

|   参数名   |  类型  | 是否必填 |                                                    说明                                                    |
| :--------: | :----: | :------: | :--------------------------------------------------------------------------------------------------------: |
|  content   | string |    是    |                                                  笔记内容                                                  |
|   rootId   | string |    是    |                                                  根节点id                                                  |
|  targetId  | string |    是    |                                                 目标节点id                                                 |
|   title    | string |    否    |                                                  笔记内容                                                  |
|  classify  | string |    否    | 自定义标签分类的id，如人物、武器等，最多三个，若为连载/连载章节分类类型建议用novelClassify，其他看情况而定 |
|    sort    | number |    否    |                                           序号，从小到大，默认1                                            |
|  isSecret  | string |    否    |                                  是否为私密笔记，'1' 是 '0' 否，默认 '1'                                   |
| linkStatus | string |    否    |              可关联性 1 全关联（即根节点和目标节点可关联）0 仅目标关联（即仅目标节点可关联）               |
|  remarks   | string |    否    |                                                    备注                                                    |

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
- 笔记修改

#### 请求

- `get | post`
- `note/update`

#### 参数

|   参数名   |  类型  | 是否必填 |                                                    说明                                                    |
| :--------: | :----: | :------: | :--------------------------------------------------------------------------------------------------------: |
|     id     | string |    是    |                                                   笔记id                                                   |
|  content   | string |    否    |                                                  笔记内容                                                  |
|   rootId   | string |    否    |                                                  根节点id                                                  |
|  targetId  | string |    否    |                                                 目标节点id                                                 |
|   title    | string |    否    |                                                  笔记内容                                                  |
|  classify  | string |    否    | 自定义标签分类的id，如人物、武器等，最多三个，若为连载/连载章节分类类型建议用novelClassify，其他看情况而定 |
|    sort    | number |    否    |                                           序号，从小到大，默认1                                            |
|  isSecret  | string |    否    |                                  是否为私密笔记，'1' 是 '0' 否，默认 '1'                                   |
| linkStatus | string |    否    |              可关联性 1 全关联（即根节点和目标节点可关联）0 仅目标关联（即仅目标节点可关联）               |
|  remarks   | string |    否    |                                                    备注                                                    |

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
- 同时会删除关联的笔记记录

#### 请求

- `get | post`
- `note/delete`

#### 参数

| 参数名 |  类型  | 是否必填 |  说明  |
| :----: | :----: | :------: | :----: |
|   id   | string |    是    | 笔记id |

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
- 获取指定的笔记，如果为私密笔记只有本人可获取
- 笔记没有点赞、收藏或评论

#### 请求

- `get | post`
- `note/get/one`

#### 参数

|    参数名    |  类型  | 是否必填 |                      说明                       |
| :----------: | :----: | :------: | :---------------------------------------------: |
|      id      | string |    是    |                     笔记id                      |
| showUserInfo | string |    否    | 是否增加创建者姓名与头像 '1' 是 其他否 默认 '1' |

#### 返回字段说明

- 返回对象或null

|      参数名      |    类型     |                说明                |
| :--------------: | :---------: | :--------------------------------: |
|        id        |   string    |               笔记id               |
|      rootId      |   string    |              根节点id              |
|     targetId     |   string    |             目标节点id             |
|      title       |   string    |                标题                |
|     content      |   string    |                内容                |
|     classify     |  array/[]   |      用户自定义标签，数组/[]       |
|       sort       |   number    |                排序                |
|     isSecret     |   string    |   是否为私密笔记，'1' 是 '0' 否    |
|    linkStatus    |   string    | 可关联性 '1' 全关联 '0' 仅目标关联 |
|    createUser    |   string    |              创建者id              |
|  createUserName  |   string    |             创建者名字             |
| createUserAvatar | object/null |             创建者头像             |
|    createTime    |   string    |              创建时间              |
|    updateTime    |   string    |              更新时间              |
|     terminal     |   string    |              操作终端              |
|     remarks      |   string    |                备注                |
|      isSelf      |   string    |   是否本人的笔记，'1' 是 '0' 否    |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "02fcf366-f441-4935-a62c-bf339e9295b0",
    "rootId": "9e232a68-d0db-45bd-8ba7-e29cc1b70921",
    "targetId": "00055bfe-e51b-433a-ace3-e7c103c1c369",
    "title": "测试笔记 1",
    "content": "笔记内容",
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
    "createUserName": "管理员",
    "createUserAvatar": {
      "id": "6e71569c-6c7b-4b6f-bea5-a472b62b7b08",
      "filePath": "http://localhost:3030/images/dedc80e0-c85d-11ed-8831-51643826618f.jpg",
      "fileName": "R-C (2).jpg",
      "fileSize": 20764,
      "suffix": "jpg",
      "staticPlace": "images",
      "createUser": "25dbdfb5-cd04-4fbe-8e85-da8c989b2f0b",
      "isSecret": "0",
      "createTime": "2023-03-22 11:01:41",
      "updateTime": "2023-03-22 11:01:41",
      "terminal": "管理端",
      "remarks": null
    },
    "createTime": "2024-09-01 00:21:42",
    "updateTime": "2024-09-01 00:21:42",
    "terminal": "管理端",
    "remarks": null,
    "isSelf": "1"
  },
  "total": 0
}
```


## ---------------- 获取指定节点所有的笔记列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取指定的笔记，如果为私密笔记只有本人可获取
- 笔记没有点赞、收藏或评论

#### 请求

- `get | post`
- `note/get/list`

#### 参数

|    参数名    |  类型  | 是否必填 |                                               说明                                               |
| :----------: | :----: | :------: | :----------------------------------------------------------------------------------------------: |
|    rootId    | string |    否    |                    根节点id（rootId targetId 两者传其一，targetId 权重更高）                     |
|   targetId   | string |    否    |                   目标节点id（rootId targetId 两者传其一，targetId 权重更高）                    |
|  relevance   | string |    否    | 除了获取所属目标节点的笔记外，是否还获取与之关联的其他笔记，仅传了 targetId 时有效 '1' 是 '0' 否 |
|   keyword    | string |    否    |                                              关键字                                              |
|  highlight   | string |    否    |               是否高亮显示搜索关键字 '0' 否 '1' 高亮（需要用v-html渲染） 默认 '0'                |
|    pageNo    | number |    否    |                                           页码，默认 1                                           |
|   pageSize   | number |    否    |                                        每页页数，默认 10                                         |
|   isSecret   | string |    否    |                                  是否为私密笔记，'1' 是 '0' 否                                   |
|   classify   | string |    否    |        自定义文章类型，单选，若为连载/连载章节分类类型建议用novelClassify，其他看情况而定        |
| showUserInfo | string |    否    |                         是否增加创建者姓名与头像 '1' 是 其他否 默认 '0'                          |

#### 返回字段说明

- 返回数组或[]
- 排序规则
   `搜索相似度(标题 内容)降序`
   `sort升序`
   `updateTime`

|      参数名      |    类型     |                说明                |
| :--------------: | :---------: | :--------------------------------: |
|        id        |   string    |               笔记id               |
|      rootId      |   string    |              根节点id              |
|     targetId     |   string    |             目标节点id             |
|      title       |   string    |                标题                |
|     content      |   string    |                内容                |
|     classify     |  array/[]   |      用户自定义标签，数组/[]       |
|       sort       |   number    |                排序                |
|     isSecret     |   string    |   是否为私密笔记，'1' 是 '0' 否    |
|    linkStatus    |   string    | 可关联性 '1' 全关联 '0' 仅目标关联 |
|    createUser    |   string    |              创建者id              |
|  createUserName  |   string    |             创建者名字             |
| createUserAvatar | object/null |             创建者头像             |
|    createTime    |   string    |              创建时间              |
|    updateTime    |   string    |              更新时间              |
|     terminal     |   string    |              操作终端              |
|     remarks      |   string    |                备注                |
|      isSelf      |   string    |   是否本人的笔记，'1' 是 '0' 否    |

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
          "typeLabel": "连载来源"
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
