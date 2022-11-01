/**
 * @description 处理压缩
 * @author chen
 * @update 2021-08-10 21:30:07
 */

import Koa from 'koa'
import Compress from 'koa-compress'

/**
 * 启用 gzip 压缩
 */
export const initCompress = (app: Koa) => {
  app.use(
    Compress({
      filter: function (content_type) {
        // 请求头content-type有gzip类型压缩
        return /text/i.test(content_type)
      },
      threshold: 2048, // 超过 2KB 压缩
      gzip: {
        flush: require('zlib').constants.Z_SYNC_FLUSH, // zlib是node的压缩模块
      },
      deflate: {
        flush: require('zlib').constants.Z_SYNC_FLUSH,
      },
      br: false,
    })
  )
}
