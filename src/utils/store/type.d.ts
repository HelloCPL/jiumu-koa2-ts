interface StoreOption {
  sync?: boolean // 是否同步 仅写入操作有效
}

interface StoreAddOption extends StoreOption {
  unique?: boolean // 是否保证数组中的值唯一
  validator?: (item: any) => boolean // 自定义匹配规则
}

interface StoreDeleteOption extends StoreOption {
  repeat?: boolean
}