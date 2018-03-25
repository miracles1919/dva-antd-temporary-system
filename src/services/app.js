import { request, config, requestMock } from 'utils'

const { api } = config
const { user, userLogin } = api

export async function login (params) {
  return request({
    url: userLogin,
    method: 'post',
    data: params,
  })
}

export async function query (params) {
  return requestMock({
    url: user.replace('/:id', ''),
    method: 'get',
    data: params,
  })
}
