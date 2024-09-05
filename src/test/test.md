# 修改计划

- roles 角色信息表
  + 增加 `configurable` 是否可修改 0 可修改 1 超级管理员可修改 -1 不可修改 默认 0
  + 增加修改和删除的校验

- menus 菜单信息表
  + 增加 `configurable` 是否可修改 0 可修改 1 超级管理员可修改 -1 不可修改 默认 0
  + 增加修改和删除的校验

- permissions 权限信息表
  + 增加 `configurable` 是否可修改 0 可修改 1 超级管理员可修改 -1 不可修改 默认 0
  + 增加修改和删除的校验

- tags 标签信息表
  + 增加 `configurable` 是否可修改 0 可修改 1 超级管理员可修改 -1 不可修改 默认 0
  + 增加修改和删除的校验


- `router/controller/comments/utils.ts` 增加 `is_target_user` 字段判断，判断第一个 `target_type` 不为 `501`