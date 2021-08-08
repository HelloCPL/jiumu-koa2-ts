/**
 * @description: 自定义全局接口
 * @author chen
 * @update 2021-08-06 11:32:13
*/

interface ObjectAny {
  [x: string]: any
}

// 声明命名空间 合并 Global 接口，用于扩展global对象
declare namespace NodeJS {
  export interface Global {
    unlessPath: string[];
    requestCount: number;
    requestStart: any,
    requestEnd: any,
  }
}


