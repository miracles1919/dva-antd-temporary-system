import { routerRedux } from 'dva/router'
import { login } from 'services/login'
import { message } from 'antd'

export default {
  namespace: 'login',

  state: {
    register: 'shop',
    confirmDirty: false,
  },

  effects: {
    * login ({
      payload,
    }, { put, call }) {
      const data = yield call(login, payload)
      if (data.success) {
        yield put({ type: 'app/query' })

        // const { locationQuery } = yield select(_ => _.app)
        // const { from } = locationQuery
        // if (from && from !== '/login') {
        //   yield put(routerRedux.push(from))
        // } else {
        //   yield put(routerRedux.push('/authority'))
        // }
      } else {
        throw data
      }
    },

    * loop ({ payload }, { put }) {
      yield put({ type: 'updateState', payload })
      yield put(routerRedux.push('/register'))
    },

    * register ({ payload }, { select }) {
      const { register } = yield select(_ => _.login)
      console.log(payload)
      // yield put(routerRedux.push('/register'))
    },

  },

  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },

}
