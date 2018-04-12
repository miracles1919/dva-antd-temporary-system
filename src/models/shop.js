import modelExtend from 'dva-model-extend'
import { imgUpload } from 'services/app'
import {
  shelves, list, del, update, search, cartAdd,
  cartList, cartDel, cartPay, orders, detail,
  searchId, buy, sellOrders,
} from 'services/shop'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import { model } from './common'

export default modelExtend(model, {
  namespace: 'shop',

  state: {
    fileList: [],
    shopList: [],
    cacheList: [],
    cartList: [],
    orderList: [],
    orderDetail: {},
    searchProd: {},
    shopType: '',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        const { pathname } = location

        if (pathname === '/order') {
          dispatch({ type: 'orderList' })
        } else if (pathname === '/search') {
          dispatch({ type: 'updateState', payload: { searchProd: {} } })
        } else {
          const match = pathToRegexp('/order/:id').exec(pathname)
          if (match) {
            dispatch({ type: 'orderDetail', payload: { orderId: match[1] } })
          }
        }
      })
    },
  },

  effects: {
    * upload ({ payload: { file } }, { call, put }) {
      let formData = new FormData()
      formData.append('multipartFile', file)
      const { status, data } = yield call(imgUpload, formData)
      if (status === 200) {
        let fileList = []
        file.status = 'done'
        file.url = `http://${data}`
        fileList.push(file)
        yield put({
          type: 'updateState',
          payload: { fileList },
        })
      }
    },

    * shelves ({
      payload: { name, location, number, price, createTime },
    }, { call, select, put }) {
      const { fileList } = yield select(_ => _.shop)
      const id = localStorage.getItem('id')
      const params = {
        name,
        number,
        price,
        address: location.join('/'),
        prodImg: fileList[0].url,
        userId: id,
        createTime: createTime.format('YYYY-MM-DD'),
      }
      const { success } = yield call(shelves, params)
      if (success) {
        message.success('上架成功')
        yield put({ type: 'updateState', payload: { fileList: [] } })
      }
    },

    * list (_, { call, put }) {
      let type = localStorage.getItem('type')
      let params = {}
      if (type === 'shop') {
        let id = localStorage.getItem('id')
        params.userId = id
      }
      const { success, data } = yield call(list, params)
      if (success) {
        data.forEach(item => { item.key = item.id })
        yield put({
          type: 'updateState',
          payload: {
            shopList: data,
            cacheList: data.map(item => ({ ...item })),
          },
        })
      }
    },

    * del ({ payload }, { call, put }) {
      let id = localStorage.getItem('id')
      payload.userId = id
      const { success } = yield call(del, payload)
      if (success) {
        message.success('删除成功')
        yield put({ type: 'list' })
      }
    },

    * update ({ payload: { key } }, { call, select }) {
      const { shopList } = yield select(_ => _.shop)
      const target = shopList.filter(item => key === item.key)[0]
      if (target) {
        let id = localStorage.getItem('id')
        let params = { ...target, userId: id, produId: target.id }
        const { success } = yield call(update, params)
        if (success) {
          target.editable = false
          message.success('修改成功')
        }
      }
    },

    * search ({ payload }, { call, put }) {
      const { success, data } = yield call(search, payload)
      if (success) {
        data.forEach(item => { item.key = item.id })
        yield put({
          type: 'updateState',
          payload: {
            shopList: data,
            cacheList: data.map(item => ({ ...item })),
          },
        })
      }
    },

    * buy ({ payload }, { select, put, call }) {
      let id = localStorage.getItem('id')
      payload.userId = id
      const { success } = yield call(buy, payload)
      if (success) {
        message.success('购买成功')
        const { shopList, cacheList } = yield select(_ => _.shop)
        const { user } = yield select(_ => _.app)
        const target = shopList.filter(item => item.id === payload.productId)[0]
        const targetCache = cacheList.filter(item => item.id === payload.productId)[0]
        target.editable = false
        target.number = targetCache.number - payload.number
        user.balance -= target.price * target.number
        yield put({ type: 'app/updateState', payload: { user } })
      }
    },

    * cartAdd ({ payload }, { call, select }) {
      let id = localStorage.getItem('id')
      payload.userId = id
      const { success } = yield call(cartAdd, payload)
      if (success) {
        message.success('加入购物车成功')
        const { shopList, cacheList } = yield select(_ => _.shop)
        const target = shopList.filter(item => item.id === payload.productId)[0]
        const targetCache = cacheList.filter(item => item.id === payload.productId)[0]
        target.number = targetCache.number
        target.editable = false
      }
    },

    * cartList (_, { call, put }) {
      let id = localStorage.getItem('id')
      const { success, data } = yield call(cartList, { userId: id })
      if (success) {
        data.forEach((item, index) => {
          item.key = item.id
          let { address, name, createTime, prodImg, price } = item.product
          data[index] = { ...item, address, name, createTime, prodImg, price }
        })
        yield put({ type: 'updateState', payload: { cartList: data } })
      }
    },

    * cartDel ({ payload }, { call, select }) {
      let id = localStorage.getItem('id')
      payload.userId = id
      const { success } = yield call(cartDel, payload)
      if (success) {
        message.success('删除成功')
        const { cartList } = yield select(_ => _.shop)
        cartList.filter(item => item.id !== payload.shoppingcarId)
      }
    },

    * pay ({ payload }, { call, put }) {
      let id = localStorage.getItem('id')
      payload.userId = id
      const { success, data } = yield call(cartPay, payload)
      if (success) {
        message.success('支付成功')
        console.log(data)
        let { payMoney } = payload
        let balance = localStorage.getItem('balance') - payMoney
        yield put({ type: 'app/updateBalance', payload: { balance } })
        localStorage.setItem('balance', balance)
      }
    },

    * orderList (_, { call, put }) {
      let id = localStorage.getItem('id')
      let type = localStorage.getItem('type')
      let params = {}
      let fun
      if (type === 'user') {
        params.userId = id
        fun = orders
      } else if (type === 'shop') {
        params.sellId = id
        fun = sellOrders
      }
      const { success, data } = yield call(fun, params)
      if (success) {
        data.forEach(item => { item.key = item.id })
        yield put({ type: 'updateState', payload: { orderList: data } })
      }
    },

    * orderDetail ({ payload }, { call, put }) {
      const { success, data } = yield call(detail, payload)
      if (success) {
        const { id, createTime, paymoney, number } = data.order
        const orderDetail = {
          ...data.product, otime: createTime, oid: id, paymoney, number, key: id,
        }
        yield put({ type: 'updateState', payload: { orderDetail } })
      }
    },

    * searchId ({ payload }, { call, put }) {
      const { success, data } = yield call(searchId, payload)
      if (success && data.seller) {
        const searchProd = {
          ...data.product, seller: data.seller.account, key: 1,
        }
        yield put({ type: 'updateState', payload: { searchProd } })
      }
    },

  },

  reducers: {

  },

})
