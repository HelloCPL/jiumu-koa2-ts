
## ---------------- 新增博客文章 ---------------------

#### 简要描述

- `pc | web | app | wechat` 端
- 新增博客文章

#### 请求

- `get | post` 
- `article/add`

#### 参数

| 参数名 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| title | string | 是 | 博客文章标题 |
| content | string | 是 | 内容 |
| contentType | string | 是 | 内容类型，取系统标签400范围 |
| type | string | 是 | 文章类型，取系统标签300范围 |
| isDraft | string | 是 | 是否草稿，1 是 0 否，默认0 |
| coverImg | string | 否 | 封面图，图片id，只传一个 |
| attachment | string | 否 | 附件，文件id，多个逗号隔开，最多3个 |
| classify | string | 否 | 自定义分类，用户自定义标签id集合，最多3个 |
| isSecret | string | 否 | 是否为私密文章，1 是 0 否，默认0 |
| isTop | string | 否 | 是否置顶，1 是 0 否，默认0 |
| sort | mediumint | 否 | 排序，值越小越前，默认1 |
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