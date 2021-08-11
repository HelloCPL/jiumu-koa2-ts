
#### users 用户信息表

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

#### files_info 文件信息表

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

#### tags 标签信息表

- 说明

| 字段名称 | 类型 | 是否必填 | 说明 |
|:---:|:---:|:---:|:---:|
| id | v64 | 是 | 标签id |
| parent_code | v64 | 是 | 父级code，相同标签类型同一个父级，默认 0  |
| code | v64 | 是 | 标签code，唯一标识 |
| label | v64 | 是 | 标签描述 |
| sort | mediumint | 否 | 排序 |
| create_time | v64 | 是 | 创建时间 |
| update_time | v64 | 是 | 更新时间 |
| terminal | v64 | 是 | 操作终端 |
| remarks | v255 | 否 | 备注 |


