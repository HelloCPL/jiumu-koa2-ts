/**
 * 对标签列表查询结果作缓存
 */
let tagListCacheData: any = null

export const useTagCache = () => {
  const getTagListCacheData = () => tagListCacheData
  const setTagListCacheData = (data: any) => (tagListCacheData = data)

  return {
    getTagListCacheData,
    setTagListCacheData
  }
}
