import { request, config } from 'utils'

const { APIV1 } = config

export async function query (params) {
  params.key = 'i7sau1babuzwhycn'
  return request({
    url: `${APIV1}/weather/now.json`,
    method: 'get',
    data: params,
  })
}

export async function getArticle (params) {
  return request({
    url: 'https://api-dev.beichoo.com/platform/platform_youdu/article/search?user_id=1746800001&ts=1512618428&nonce=128046&sig=78512c6066d81ffa6a46c964234b56e23adae286&debug=1',
    method: 'get',
    data: params,
  })
}
