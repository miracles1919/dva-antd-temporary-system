import { requestMock, config } from 'utils'

const { api } = config
const { dashboard } = api

export async function query (params) {
  return requestMock({
    url: dashboard,
    method: 'get',
    data: params,
  })
}
