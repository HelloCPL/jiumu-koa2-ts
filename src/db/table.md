
#### 1 users 用户信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 用户id |
| phone | v64 | 是 | 手机号，用户账号，唯一索引  |
| password | v64 | 是 | 用户密码 |
| username | v64 | 是 | 用户名称 |
| sex | v4 | 否 | 性别，使用系统标签id |
| birthday | v64 | 否 | 用户生日（时间格式的字符串） |
| avatar | v64 | 否 | 头像，使用文件信息表id |
| professional | v255 | 否 | 职业 |
| address | v255 | 否 | 用户地址 |
| create_time | v64 | 是 | 创建时间 |
| update_time | v64 | 是 | 更新修改时间 |
| terminal | v64 | 是 | 操作终端 |
| remarks | v255 | 否 | 备注 |

#### 2 files_info 文件信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | id |
| file_path | v64 | 是 | 文件路径，仅指文件名称  |
| file_name | v64 | 否 | 原始文件名 |
| file_size | int | 否 | 文件大小，单位B |
| suffix | v64 | 否 | 文件后缀名 |
| static_place | v64 | 否 | 文件存放位置，默认files |
| create_user | v64 | 是 | 创建人id |
| is_secret | v64 | 否 | 是否为私密文件，默认0 |
| check_valid_time | mediumint | 是 | 为私密文件时链接有效时间，单位天，默认3天 |
| create_time | v64 | 是 | 创建时间 |
| terminal | v64 | 是 | 操作终端 |
| remarks | v255 | 否 | 备注 |

#### 3 tags 标签信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 标签id |
| parent_code | v64 | 是 | 父级code，相同标签类型同一个父级，默认 0  |
| code | v64 | 是 | 标签code，唯一标识 |
| label | v64 | 是 | 标签描述 |
| sort | mediumint | 否 | 排序，越小越前 |
| create_time | v64 | 是 | 创建时间 |
| update_time | v64 | 是 | 更新时间 |
| terminal | v64 | 是 | 操作终端 |
| remarks | v255 | 否 | 备注 |

#### 4 permissions 权限信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 权限id |
| parent_code | v64 | 是 | 父级code，相同权限类型同一个父级，默认 0  |
| code | v64 | 是 | 权限code，唯一标识 |
| label | v64 | 是 | 权限描述 |
| href | v64 | 否 | 关联接口,*表示后面任意类型，默认# |
| sort | mediumint | 否 | 排序，越小越前 |
| create_time | v64 | 是 | 创建时间 |
| update_time | v64 | 是 | 更新时间 |
| terminal | v64 | 是 | 操作终端 |
| remarks | v255 | 否 | 备注 |

#### 5 roles 角色信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 角色id |
| code | v64 | 是 | 角色code，唯一标识 |
| label | v64 | 是 | 权限描述 |
| sort | mediumint | 否 | 排序，越小越前 |
| create_time | v64 | 是 | 创建时间 |
| update_time | v64 | 是 | 更新时间 |
| terminal | v64 | 是 | 操作终端 |
| remarks | v255 | 否 | 备注 |

#### 6 roles-permissions 角色-权限关联信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 角色-权限关联id |
| role_id | v64 | 是 | 角色id |
| permission_id | v64 | 是 | 权限id |
| create_time | v64 | 是 | 创建时间 |
| terminal | v64 | 是 | 操作终端 |

<!-- #### 7 users-permissions 用户-权限关联额外标签信息表

- 说明 废弃

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 角色-权限关联id |
| user_id | v64 | 是 | 用户id |
| permission_id | v64 | 是 | 权限id |
| status | v64 | 是 | 额外权限状态，使用系统状态标签 1 启用 0 禁用 |
| create_time | v64 | 是 | 创建时间 |
| update_time | v64 | 是 | 更新时间 |
| terminal | v64 | 是 | 操作终端 |
| remarks | v255 | 否 | 备注 | -->

#### 8 users-roles 用户-角色关联信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 角色-权限关联id |
| user_id | v64 | 是 | 用户id |
| role_id | v64 | 是 | 角色id |
| create_time | v64 | 是 | 创建时间 |
| terminal | v64 | 是 | 操作终端 |

#### 9 users-tags 用户-特殊标签关联信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 角色-特殊标签关联id |
| user_id | v64 | 是 | 用户id |
| tag_code | v64 | 是 | 特殊标签code |
| create_time | v64 | 是 | 创建时间 |
| terminal | v64 | 是 | 操作终端 |

#### 10 menus 菜单信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 菜单id |
| parent_code | v64 | 否 | 父级code |
| code | v64 | 是 | 菜单code，唯一索引 |
| label | v64 | 是 | 菜单描述 |
| create_time | v64 | 是 | 创建时间 |
| updatetime | v64 | 是 | 创建时间 |
| terminal | v64 | 是 | 操作终端 |
| remarks | v255 | 否 | 备注 |

#### 11 roles-menus 角色-菜单关联信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 角色-菜单关联id |
| role_id | v64 | 是 | 角色id |
| menu_id | v64 | 是 | 菜单id |
| create_time | v64 | 是 | 创建时间 |
| terminal | v64 | 是 | 操作终端 |

#### 12 likes 点赞信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 点赞id |
| target_id | v64 | 是 | 点赞的目标id |
| create_user | v64 | 是 | 创建人id |
| type | v64 | 是 | 点赞来源类型，使用系统标签资源来源标签500范围 |
| create_time | v64 | 是 | 创建时间 |
| terminal | v64 | 是 | 操作终端 |

#### 13 collections 收藏信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 收藏id |
| target_id | v64 | 是 | 收藏的目标id |
| create_user | v64 | 是 | 创建人id |
| type | v64 | 是 | 收藏来源类型，使用系统标签资源来源标签500范围 |
| create_time | v64 | 是 | 创建时间 |
| terminal | v64 | 是 | 操作终端 |

#### 14 comments_first 一级评论信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 一级评论id |
| target_id | v64 | 是 | 评论的目标id |
| content | v255 | 是 | 评论内容 |
| create_user | v64 | 是 | 创建人id |
| type | v64 | 是 | 评论来源类型，使用系统标签资源来源标签500范围，用于后面评论统计 |
| create_time | v64 | 是 | 创建时间 |
| terminal | v64 | 是 | 操作终端 |

#### 15 comments_second 二级评论信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 二级评论id |
| comment_first_target_id | v64 | 是 | 一级评论的目标id，用于统计评论目标的总数 |
| comment_first_id | v64 | 是 | 一级评论id，用于统计第一级别评论的评论总数 |
| reply_comment_id | v64 | 是 | 回复的评论id，即回复哪条评论就是哪条的评论id |
| reply_content | v255 | 是 | 回复的评论内容 |
| create_user | v64 | 是 | 创建人id，即回复评论人 |
| reply_user | v64 | 是 | 被回复的目标人id |
| create_time | v64 | 是 | 创建时间 |
| terminal | v64 | 是 | 操作终端 |
