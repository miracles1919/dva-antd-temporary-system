import modelExtend from 'dva-model-extend'
import { mod, list, check, modSeller } from 'services/setting'
import { message } from 'antd'
import { model } from './common'

export default modelExtend(model, {
  namespace: 'setting',

  state: {
    modifyDirty: false,
    reviewList: [],
  },

  effects: {
    * mod ({ payload }, { call }) {
      let id = localStorage.getItem('id')
      let account = localStorage.getItem('account')
      let type = localStorage.getItem('type')
      if (type === 'user') {
        const { success } = yield call(mod, { ...payload, id, account })
        if (success) {
          message.success('修改成功')
        }
      } else if (type === 'shop') {
        const { success } = yield call(modSeller, { ...payload, id, account })
        if (success) {
          message.success('修改成功')
        }
      }
    },

    * list (_, { call, put }) {
      const { success, data } = yield call(list)
      if (success) {
        data.forEach(item => { item.key = item.id })
        yield put({ type: 'updateState', payload: { reviewList: data } })
      }
    },

    * check ({ payload }, { call, put, select }) {
      if (payload.type) {
        const { success } = yield call(check, payload)
        if (success) {
          message.success('审核通过')
        }
      } else {
        message.success('审核不通过')
      }
      let { reviewList } = yield select(_ => _.setting)
      reviewList = reviewList.filter(item => item.id !== payload.id)
      yield put({ type: 'updateState', payload: { reviewList } })
    },
  },
})
