import { request, config } from 'utils'

const { api } = config
const { adminlogin, sellerLogin, login, register, sellRegister } = api

export function adminLogin (data) {
  return request({
    url: adminlogin,
    method: 'post',
    data,
  })
}

export function userLogin (data) {
  return request({
    url: login,
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
