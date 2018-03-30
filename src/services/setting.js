import { request, config } from 'utils'

const { api } = config
const { changepsw, unCheckList, checkSeller, sellerUpdate } = api

export function mod (data) {
  return request({
    url: changepsw,
    method: 'post',
    data,
  })
}

export function modSeller (data) {
  return request({
    url: sellerUpdate,
    method: 'post',
    data,
  })
}

export function list (data) {
  return request({
    url: unCheckList,
    data,
  })
}

export function check (data) {
  return request({
    url: checkSeller,
    method: 'post',
    data,
  })
}

