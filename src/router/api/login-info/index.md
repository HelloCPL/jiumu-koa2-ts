
## ---------------- 根据 useId 获取登录记录列表 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 根据 useId 获取登录记录列表
- 返回数组或[]

#### 请求

- `get | post` 
- `login/info/get/list`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| userId | string | 是 | 用户id |
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页页数，默认 10 |


#### 返回字段说明

- 返回数组或[]
- 按 `createTime创建时间降序` 排序

| 参数名 | 类型 | 说明 |
|:---:|:---:|:---:|
| id | string | 登录id |
| userId | string | 登录用户id |
| username | string | 登录用户姓名 |
| userAgent | string | 登录设备 |
| ip | string | 登录ip |
| createTime | string | 创建时间 |
| terminal | string | 操作终端 |


#### 返回示例

```
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "ce537bf3-b9cb-46b5-b761-c83767d27fd5",
      "userId": "2adfe358-ff18-4bee-a4f1-4c00f5c65a8f",
      "username": "陈一支",
      "userAgent": "PostmanRuntime/7.26.8",
      "ip": "::1",
      "createTime": "2021-08-16 20:16:46",
      "terminal": "管理端"
    }
  ],
  "total": 1
}
```