import { routerRedux } from 'dva/router'
import { handleLogin, userRegister, shopRegister } from 'services/login'
import { message } from 'antd'

export default {
  namespace: 'login',

  state: {
    register: 'shop',
    loginType: 'shop',
    confirmDirty: false,
    modifyDirty: false,
    fileList: [],
  },

  effects: {
    * login ({
      payload,
    }, { put, call, select }) {
      const { loginType } = yield select(_ => _.login)
      let result
      console.log(loginType)
      if (loginType === 'admin') {
        result = yield call(handleLogin, payload)
      }
    },

    * loop ({ payload }, { put }) {
      yield put({ type: 'updateState', payload })
      yield put(routerRedux.push('/register'))
    },

    * register ({ payload }, { select, call, put }) {
      const { register, fileList } = yield select(_ => _.login)
      if (register === 'user') {
        const { success } = yield call(userRegister, payload)
        yield put(routerRedux.push('/list2'))
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
          }
        } else {
          message.fail('请上传三张图片')
        }
      }
    },

    // * modify ({ payload }, {}) {
    //   console.log(payload)
    // },

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
