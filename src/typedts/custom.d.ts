/**
 * @description: 自定义全局接口
 * @author chen
 * @update 2021-08-06 11:32:13
*/

// 任意类型
interface ObjectAny {
  [x: string]: any
}

// 返回SQL表数据基本类型
interface BaseOptions extends ObjectAny {
  create_time: string,
  terminal: string,
  update_time?: string
  remarks?: string
}

// SQL参数类型
interface SQLParamsOptions extends ObjectAny{
  sql: string,
  data: any
}

// 声明命名空间 合并 Global 接口，用于扩展global对象
declare namespace NodeJS {
  export interface Global {
    _unlessPath: string[];
    _requestCount: number;
    _requestStart: any,
    _requestEnd: any,
    _results: ObjectAny
  }
}


