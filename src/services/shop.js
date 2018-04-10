import { request, config } from 'utils'

const { api } = config
const {
  prodShelves, prodList, deleteProd, updateProd,
  prodSearch, addCart, carList, delCart, payCart,
  orderList, orderDetail, searchById, payDirector,
} = api

export function shelves (data) {
  return request({
    url: prodShelves,
    method: 'post',
    data,
  })
}

export function list (data) {
  return request({
    url: prodList,
    method: 'get',
    data,
  })
}

export function del (data) {
  return request({
    url: deleteProd,
    method: 'post',
    data,
  })
}

export function update (data) {
  return request({
    url: updateProd,
    method: 'post',
    data,
  })
}

export function search (data) {
  return request({
    url: prodSearch,
    data,
  })
}

export function cartAdd (data) {
  return request({
    url: addCart,
    method: 'post',
    data,
  })
}

export function cartDel (data) {
  return request({
    url: delCart,
    method: 'post',
    data,
  })
}

export function cartList (data) {
  return request({
    url: carList,
    data,
  })
}

export function cartPay (data) {
  return request({
    url: payCart,
    method: 'post',
    data,
  })
}

export function orders (data) {
  return request({
    url: orderList,
    data,
  })
}

export function detail (data) {
  return request({
    url: orderDetail,
    data,
  })
}

export function searchId (data) {
  return request({
    url: searchById,
    data,
  })
}

export function buy (data) {
  return request({
    url: payDirector,
    method: 'post',
    data,
  })
}
