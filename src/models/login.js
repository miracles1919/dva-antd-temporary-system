import { routerRedux } from 'dva/router'
import { adminLogin, shopLogin, userLogin, userRegister, shopRegister } from 'services/login'
import { message } from 'antd'

export default {
  namespace: 'login',

  state: {
    register: 'shop',
    loginType: 'shop',
    confirmDirty: false,
    fileList: [],
  },

  effects: {
    * login ({
      payload,
    }, { put, call, select }) {
      const { loginType } = yield select(_ => _.login)
      let result
      if (loginType === 'admin') {
        result = yield call(adminLogin, payload)
      } else if (loginType === 'shop') {
        result = yield call(shopLogin, payload)
      } else if (loginType === 'user') {
        result = yield call(userLogin, payload)
      }

      if (result.success) {
        switch (loginType) {
          case 'admin':
            yield put(routerRedux.push('/review'))
            break
          case 'shop':
            localStorage.setItem('id', result.data.id)
            yield put(routerRedux.push('/list'))
            break
          case 'user':
            localStorage.setItem('id', result.data.id)
            yield put(routerRedux.push('/list2'))
            break
          default:
            break
        }
        localStorage.setItem('account', payload.account)
        localStorage.setItem('type', loginType)
        localStorage.setItem('username', result.data.username || result.data.name)
        localStorage.setItem('balance', result.data.accountBalance || false)
        yield put({ type: 'app/query' })
      }
    },

    * loop ({ payload }, { put }) {
      yield put({ type: 'updateState', payload })
      yield put(routerRedux.push('/register'))
    },

    * return (_, { put }) {
      yield put(routerRedux.push('/login'))
    },

    * register ({ payload }, { select, call, put }) {
      const { register, fileList } = yield select(_ => _.login)
      if (register === 'user') {
        const { success, data } = yield call(userRegister, payload)
        if (success) {
          localStorage.setItem('account', data.account)
          localStorage.setItem('username', data.username)
          localStorage.setItem('id', data.id)
          localStorage.setItem('type', 'user')
          yield put(routerRedux.push('/list2'))
          yield put({ type: 'app/query' })
        }
      } else if (register === 'shop') {
        if (fileList.length === 3) {
          let params = {
            ...payload,
            imgurlone: fileList[0].url,
            imgurltwo: fileList[1].url,
            imgurlthree: fileList[2].url,
          }
          const { success } = yield call(shopRegister, params)
          if (success) {
            message.success('注册成功，请等待管理员审核')
            yield put({ type: 'updateState', payload: { fileList: [] } })
            yield put(routerRedux.push('/login'))
          }
        } else {
          message.fail('请上传三张图片')
        }
      }
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
