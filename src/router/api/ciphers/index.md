
## ---------------- 口令新增 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 口令新增
- 传值的时候需要对 `account cipher` 进行加密处理
- 等级类型 `type=802` 时需先校验个人秘钥code是否存在，只有个人秘钥code存在才能新增该等级的口令

#### 请求

- `post` 
- `cipher/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| title | string | 是 | 标题 |
| account | string | 是 | 账号 |
| cipher | string | 是 | 密码 |
| type | string | 是 | 等级类型，取系统标签800范围 |
| classify | string | 否 | 自定义标签，分类类型建议用cipherClassify |
| sort | mediumint | 否 | 排序，值越小越前，默认1 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": "be9dc1de-2046-46c3-8d32-ffe2b3e29558",
  "total": 0
}
```


## ---------------- 口令修改 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 口令修改，仅可修改本人的口令
- 传值的时候需要对 `account cipher` 进行加密处理
- 等级类型 `type=802` 时需先校验个人秘钥code是否存在，只有个人秘钥code存在才能修改为该等级的口令

#### 请求

- `post` 
- `cipher/update`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 口令id |
| title | string | 否 | 标题 |
| account | string | 否 | 账号 |
| cipher | string | 否 | 密码 |
| type | string | 否 | 等级类型，取系统标签800范围 |
| classify | string | 否 | 自定义标签，分类类型建议用cipherClassify |
| sort | mediumint | 否 | 排序，值越小越前 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 口令删除 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 口令删除，仅可删除本人的口令

#### 请求

- `post` 
- `cipher/delete`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 口令id |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 获取本人的某个口令 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取本人的某个口令，仅可获取本人的口令
- `type=801` 时 `account cipher` 普通密码仅需要二次解密
- `type=802` 时 `account cipher` 加权密码需要二次解密+口令解密

#### 请求

- `post` 
- `cipher/get/one/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 口令id |

#### 返回字段说明

- 返回对象或null
- `classify` 字段为用户自定义标签列表数组或[]
| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | id |
| title | string | 标题 |
| account | string | 账号 |
| cipher | string | 密码 |
| type | string | 等级类型 |
| typeLabel | string | 等级类型标签说明 |
| classify | array/[] | 用户自定义标签，文件数组/[] |
| sort | number | 排序，值越小越前 |
| keyStr | string | type=802时 解密key |
| ivStr | string | type=802时 解密iv |
| createUser | string | 创建者id |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |
| terminal | string | 操作终端 |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "edb80737-2443-42bb-a49c-b173b4cde135",
    "title": "测试6",
    "account": "123456",
    "cipher": "123456",
    "type": "802",
    "typeLabel": "加权",
    "classify": [
      {
        "id": "3b526adf-a90d-405e-9758-6bff1bf01489",
        "label": "java",
        "sort": 1,
        "type": "classify",
        "createTime": "2021-08-18 03:11:31",
        "updateTime": "2021-08-18 03:11:31",
        "terminal": "管理端",
        "createUser": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f"
      }
    ],
    "sort": 1,
    "createUser": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f",
    "createTime": "2023-03-14 11:36:18",
    "updateTime": "2023-03-14 11:36:18",
    "terminal": "桌面端"
  },
  "total": 0
}
```

## ---------------- 获取本人的口令列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 获取本人的口令列表，仅可获取本人的口令
- `type=801` 时 `account cipher` 普通密码仅需要二次解密
- `type=802` 时 `account cipher` 加权密码需要二次解密+口令解密

#### 请求

- `post` 
- `cipher/get/list/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |
| keyword | string | 否 | 关键字 |
| highlight | string | 否 | 是否高亮显示搜索关键字 '0' 否 '1' 高亮（需要用v-html渲染） 默认不高亮 |
| type | string | 否 | 等级类型，取系统标签800范围 |
| classify | string | 否 | 自定义文章类型，分类类型建议用cipherClassify，单选 |

#### 返回字段说明

- 返回数组或[]
- 排序规则
    `搜索相似度(title)降序`
    `sort升序`
    `updateTime更新时间降序`
- `classify` 字段为用户自定义标签列表数组或[]
- 具体字段说明看上面

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "edb80737-2443-42bb-a49c-b173b4cde135",
      "title": "测试6",
      "account": "123456",
      "cipher": "123456",
      "type": "802",
      "typeLabel": "加权",
      "classify": [
        {
          "id": "3b526adf-a90d-405e-9758-6bff1bf01489",
          "label": "java",
          "sort": 1,
          "type": "classify",
          "createTime": "2021-08-18 03:11:31",
          "updateTime": "2021-08-18 03:11:31",
          "terminal": "管理端",
          "createUser": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f"
        }
      ],
      "sort": 1,
      "createUser": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f",
      "createTime": "2023-03-14 11:36:18",
      "updateTime": "2023-03-14 11:36:18",
      "terminal": "桌面端"
    }
  ],
  "total": 10
}
```