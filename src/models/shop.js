import modelExtend from 'dva-model-extend'
import { imgUpload } from 'services/app'
import { shelves, list, del, update, search } from 'services/shop'
import { message } from 'antd'
import { model } from './common'

export default modelExtend(model, {
  namespace: 'shop',

  state: {
    fileList: [],
    shopList: [],
    cacheList: [],
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
    }, { call, select }) {
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

    * buy ({ payload: { id } }, { select, put }) {
      const { shopList } = yield select(_ => _.shop)
      const { user } = yield select(_ => _.app)
      const target = shopList.filter(item => item.id === id)[0]
      if (target) {
        if (target.number === 0) {
          message.error('商品数量不足')
        } else if (target.price > user.balance) {
          message.error('余额不足')
        } else {
          message.success('购买成功')
          target.number -= 1
          user.balance -= target.price
          yield put({ type: 'app/updateState', payload: { user } })
        }
      }
    },

  },

  reducers: {

  },

})
