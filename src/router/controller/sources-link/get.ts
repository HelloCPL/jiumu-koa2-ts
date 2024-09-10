import { query } from '@/db'
import { SourceLinkByIdParams, SourceLinkByIdsParams, SourceLinkOptions } from './interface'
import { handleSourceLink } from './utils'

/**
 * 获取某个资源链接
 * @param params.id  资源 id
 * @param params.userId?  用户 id
 * @param options.ignoreUserId? 是否强制忽略用户权限校验
 * @param options.showUserInfo? 是否获取创建者名称
 */
export const getSourceLinkById = async (params: SourceLinkByIdParams): Promise<SourceLinkOptions | null> => {
  if (!params.id) return null
  // 处理创建者信息字段
  const userInfoField =
    params.showUserInfo === '1' ? ' t2.username AS create_user_name, t2.avatar AS create_user_avatar, ' : ''
  let secretSql = ''
  const secretData = []
  if (params.ignoreUserId !== '1') {
    secretSql = ' AND t1.create_user = ? '
    secretData.push(params.userId)
  }
  const sql = `
    SELECT
      t1.id, t1.title, t1.link, t1.cover_img1, t1.cover_img2, t1.sort,
      ${userInfoField}
      t1.create_user, t1.create_time, t1.update_time, t1.terminal, t1.remarks
    FROM sources_link t1
    WHERE 
      t1.id = ?
      ${secretSql}`
  const data = [params.id, ...secretData]
  let res: any = await query(sql, data)
  res = res[0] || null
  if (res) await handleSourceLink(res, params.showUserInfo)
  return res
}

/**
 * 获取某个资源链接
 * @param params.ids  资源 id 集合，用逗号分隔
 * @param params.userId?  用户 id
 * @param options.ignoreUserId? 是否强制忽略用户权限校验
 * @param options.showUserInfo? 是否获取创建者名称
 */
export const getSourceLinkByIds = async (params: SourceLinkByIdsParams): Promise<SourceLinkOptions[]> => {
  if (!params.ids) return []
  // 处理创建者信息字段
  const userInfoField =
    params.showUserInfo === '1' ? ' t2.username AS create_user_name, t2.avatar AS create_user_avatar, ' : ''
  let secretSql = ''
  const secretData = []
  if (params.ignoreUserId !== '1') {
    secretSql = ' AND t1.create_user = ? '
    secretData.push(params.userId)
  }
  const sql = `
    SELECT
      t1.id, t1.title, t1.link, t1.cover_img1, t1.cover_img2, t1.sort,
      ${userInfoField}
      t1.create_user, t1.create_time, t1.update_time, t1.terminal, t1.remarks
    FROM sources_link t1
    WHERE 
      FIND_IN_SET(t1.id, ?)
      ${secretSql}
    ORDER BY t1.sort, t1.update_time DESC`
  const data = [params.ids, ...secretData]
  const res: SourceLinkOptions[] = await query(sql, data)
  if (res && res.length) await handleSourceLink(res, params.showUserInfo)
  return res
}
