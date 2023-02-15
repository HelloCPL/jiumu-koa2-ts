
## ---------------- 新增笔记关联 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增笔记关联
- 只有角色id、用户id存在可新增

#### 请求

- `get | post`
- `novel-note-link/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| noteId | string | 是 | 关联的笔记id |
| targetId | string | 是 | 关联的目标id |
| targetType | string | 是 | 关联目标的类型，暂时只支持 ['502','503','504','505','507'] |
| share | string | 否 | 共享字段，用于可共同关联的列表 |

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

#### 请求

- `get | post`
- `novel-note-link/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 否 | 笔记关联id |
| noteId/targetId | string | 否 | 笔记id和目标id 与上面关联id两者传其一即可 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取本用户的可共享关联的笔记列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取本用户的可共享关联的笔记列表

#### 请求

- `get | post`
- `novel-note-link/get/list/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| share | string | 是 | 笔记的共享字段 |
| keyword | string | 否 | 关键字 |
| highlight | string | 否 | 是否高亮显示搜索关键字 '0' 否 '1' 高亮（需要用v-html渲染） 默认 '1' |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |

#### 返回字段说明

- 返回数组或[]
- 按笔记的
  `搜索相似度(noteTitle)降序`
  `sort升序、updateTime更新时间降序`
排序

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | id |
| noteId | string | 笔记id |
| noteTitle | string | 笔记标题 |
| targetId | string | 目标id |
| targetType | string | 目标类型 |
| targetTypeLabel | string | 目标类型说明 |
| targetTitle | string | 目标标题 |
| createTime | string | 创建时间 |
| terminal | string | 操作终端 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "eee0e567-4da1-4cf9-a79b-0adb1b8a531c",
      "createTime": "2023-02-07 14:52:48",
      "terminal": "桌面端",
      "noteId": "b9845211-30e2-423f-8841-70d14761e990",
      "noteTitle": "标题8",
      "targetId": "9e232a68-d0db-45bd-8ba7-e29cc1b70921",
      "targetType": "504",
      "targetTypeLabel": "连载来源",
      "targetTitle": "连续载体1"
    }
  ],
  "total": 3
}
```
