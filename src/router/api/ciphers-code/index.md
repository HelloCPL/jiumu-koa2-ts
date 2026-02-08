
## ---------------- 秘钥code新增 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 秘钥code新增，每个用户仅可新增一个，新增后不可删除，可修改
- 传值的时候需要对 `code` 进行加密处理

#### 请求

- `post` 
- `cipher-code/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| code | string | 是 | 秘钥code |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 秘钥code修改 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 秘钥code修改，新修改的秘钥不能和老的秘钥相同
- 传值的时候需要对 `code` `oldCode` 进行加密处理

#### 请求

- `post` 
- `cipher-code/update`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| code | string | 是 | 新的秘钥code |
| oldCode | string | 是 | 老的秘钥code |

#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": null,
  "total": 0
}
```

## ---------------- 查看个人秘钥code是否存在 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 查看个人秘钥code是否存在

#### 请求

- `post` 
- `cipher-code/exist/self`

#### 返回示例

- true 存在 false 不存在

```
{
  "code": 200,
  "message": "操作成功",
  "data": true,
  "total": 0
}
```

## ---------------- 校验个人秘钥code是否正确 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 校验个人秘钥code是否正确
- 传值的时候需要对 `code` 进行加密处理

#### 请求

- `post` 
- `cipher-code/check/self`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| code | string | 是 | 秘钥code |

#### 返回示例

- true 正确 false 正确

```
{
  "code": 200,
  "message": "操作成功",
  "data": true,
  "total": 0
}
```
