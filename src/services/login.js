import { request, config } from 'utils'
import { fetchUpload } from 'utils/request'

const { api } = config
const { login, sellerLogin, register, upload, sellRegister } = api

export function adminLogin (data) {
  return request({
    url: login,
    method: 'post',
    data,
  })
}

export function userLogin (data) {
  return request({
    url: sellerLogin,
    method: 'post',
    data,
  })
}

export function shopLogin (data) {
  return request({
    url: sellerLogin,
    method: 'post',
    data,
  })
}

export function userRegister (data) {
  return request({
    url: register,
    method: 'post',
    data,
  })
}

export function shopRegister (data) {
  return request({
    url: sellRegister,
    method: 'post',
    data,
  })
}

export function imgUpload (formData) {
  return fetchUpload({
    url: upload,
    data: formData,
  })
}
