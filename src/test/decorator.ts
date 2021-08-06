/**
 * @description: 装饰器练习
 * @author chen
 * @update 2021-08-06 17:10:47
*/

// 类装饰器
// 属性装饰器
// 方法装饰器
// 参数装饰器

/**
 * 类装饰器
 * 装饰参数： 类本身
*/
const setMoney = (money: number): ClassDecorator => (target: any) => {
  target.prototype.money = money
}

/**
 * 属性装饰器
 * 装饰参数： 原型对象 属性名称
*/
const setBlood = (blood: number): ParameterDecorator => (target: any, key: string | symbol) => {
  target[key] = blood
}

/**
 * 方法装饰器
 * 装饰参数： 原型对象 方法名称 属性描述符
*/
const locked = (): MethodDecorator => (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
  console.log(`禁止用户更改该方法`);
  descriptor.writable = false
}

/**
 * 参数装饰器
 * 装饰参数： 原型对象 方法名称 参数所在位置
*/
const param = (): ParameterDecorator => (target: any, key: string | symbol, index: number) => {
  // console.log('滴滴滴');
}

@setMoney(100)
class Player {
  // @ts-ignore 
  @setBlood(1000)
  // @ts-ignore 
  blood: number

  @locked()
  move(@param() index: number) {
    console.log(`走了${index}步`);
  }
}

const player = new Player()

// @ts-ignore 
console.log(`金币：${player.money}`);
console.log(`血条：${player.blood}`);
player.move(10)
// player.move = () => {  // 错误 方法不可修改
//   console.log('hahah');
// }














