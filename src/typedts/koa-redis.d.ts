/**
 * @description: 声明 koa-redis
 * @author chen
 * @update 2021-01-29 12:03:43
*/

declare module 'koa-redis' {
  import Redis from 'redis';
  function redis(options: redis.options): redis.client;

  interface redisStore {
    on(key: string, callback?: any): any;
    // key-value
    get(key: string): Promise<any>;
    set(key: string, values: any): Promise<any>;
    del(key: string): Promise<any>;
    expire(key: string, time: string): Promise<any>;
    /**
     * hash
     */
    // client.hmset(hash, obj) obj={key:value,...}
    hmset(hash: string, HashMap: { [propName: string]: any }): Promise<any>;
    // client.hmset(hash, key,value,key,value...)
    hmset(hash: string, ...HashString: any[]): Promise<any>;
    // client.hmset(hash, [string,...])
    hmset(hash: string, HashMap: string[]): Promise<any>;
    hmget(hash: string): Promise<any>;
    hgetall(hash: string): Promise<any>;
    /**
     * list
     */
  }
  namespace redis {
    interface options extends Redis.ClientOpts { }
    interface client {
      client: redisStore
    }
  }
  export = redis;
}