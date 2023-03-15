
## ---------------- 口令新增 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 口令新增
- 传值的时候建议对 `account cipher` 进行加密处理
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
| classify | string | 否 | 自定义标签 |
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
- 传值的时候建议对 `account cipher` 进行加密处理
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
| classify | string | 否 | 自定义标签 |
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

#### 请求

- `post` 
- `cipher/get/one/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | string | 是 | 口令id |

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