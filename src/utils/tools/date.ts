/**
 * 时间相关
 */
import dayjs, { ManipulateType } from 'dayjs'

interface TargetDateParams {
  date: any
  value?: any
  unit?: ManipulateType
}

interface CurrentTargetDateParams extends TargetDateParams {
  format?: string
}

/**
 * 格式化日期
 * @param date 任意格式的时间
 * @param format? 格式
 * @returns 返回格式化后的时间
 */
export function formatDate(date: any, format = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!date || !dayjs(date).isValid()) return ''
  return dayjs(date).format(format)
}

/**
 * 获取当前时间
 * @param format 格式
 * @returns 返回格式化后的当前时间
 */
export function getCurrentTime(format = 'YYYY-MM-DD HH:mm:ss') {
  const current = dayjs()
  return formatDate(current, format)
}

/**
 * 获取时间戳
 * @param date 任意格式的时间
 * @returns 返回时间戳
 */
export const getDateValueOf = (date: any) => {
  if (!date || !dayjs(date).isValid()) return 0
  return dayjs(date).valueOf()
}

/**
 * 当前时间是否在所给时间之前
 * @param options.date 任意格式的时间
 * @param options.value? 给指定的时间增加的时长
 * @param options.unit? 增加时长的单位
 * @returns 返回 boolean
 */
export const isBeforeTargetDate = (options: TargetDateParams): boolean => {
  const { date, value, unit = 'day' } = options
  if (date && dayjs(date).isValid()) {
    let d = dayjs(date)
    if (Number(value)) d = d.add(Number(value), unit)
    if (dayjs().isBefore(d)) return true
  }
  return false
}

/**
 * 判断 date1 date2 两个时间大小
 * @param date1 时间1
 * @param date2 时间2
 * @param format? 转成指定格式再比较
 * @returns 返回 -1 date1或date2 不合法; 0 date1<date2 ; 1  data1 = date2 ; 2  date1 > date2
 */
export const judegDate = (date1: any, date2: string, format = 'YYYY-MM-DD HH:mm:ss'): -1 | 0 | 1 | 2 => {
  const _d1 = formatDate(date1, format)
  const _d2 = formatDate(date2, format)
  if (!_d1 || !_d1) return -1
  if (_d1 === _d2) return 1
  if (_d1 > _d2) return 2
  return 0
}

/**
 * 获取所给目标时间
 * @param options.date 任意格式的时间
 * @param options.value? 给指定的时间增加的时长
 * @param options.unit? 增加时长的单位
 * @param options.format? 格式
 */
export const getTargetDate = (options: CurrentTargetDateParams): string => {
  if (options.date && dayjs(options.date).isValid()) {
    const format = options.format || 'YYYY-MM-DD HH:mm:ss'
    let d = dayjs(options.date)
    const v = Number(options.value)
    if (v) {
      const unit = options.unit || 'day'
      d = d.add(v, unit)
    }
    return formatDate(d, format)
  }
  return ''
}
