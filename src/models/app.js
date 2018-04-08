/* global window */
/* global document */
/* global location */
import { routerRedux } from 'dva/router'
import config from 'config'
import queryString from 'query-string'
import { menuKeyList } from 'utils'

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    authority: [], // 权限
    menu: [],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
  },
  subscriptions: {

    setupHistory ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        })
      })
    },

    setup ({ dispatch, history }) {
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }

      let { location } = history
      if (location.pathname.indexOf('login') === -1 && location.pathname.indexOf('register') === -1) {
        dispatch({ type: 'query' })
      }
    },

  },
  effects: {

    * query (_, { put }) {
      // 登录类型
      let type = localStorage.getItem('type')
      let name = localStorage.getItem('username')
      let balance = localStorage.getItem('balance')

      let authority = []
      if (type === 'admin') {
        authority = ['2']
      } else if (type === 'shop') {
        authority = ['1', '1-1', '3', '3-1', '3-2']
      } else if (type === 'user') {
        authority = ['1', '1-1', '3', '3-3', '3-4', '3-5']
      }

      const menu = menuKeyList.filter((item) => {
        const cases = [
          authority.includes(item.key),
          item.mpid ? authority.includes(item.mpid) || item.mpid === '-1' : true,
          item.bpid ? authority.includes(item.bpid) : true,
        ]
        return cases.every(_ => _)
      })

      yield put({
        type: 'updateState',
        payload: {
          authority,
          menu,
          user: { name, balance },
        },
      })
    },

    * logout (action, { put }) {
      localStorage.removeItem('account')
      localStorage.removeItem('type')
      localStorage.removeItem('username')
      localStorage.removeItem('balance')
      yield put(routerRedux.push({
        pathname: '/login',
      }))
    },

    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
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

    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },

    updateBalance (state, { payload }) {
      return {
        ...state,
        user: { ...state.user, ...payload },
      }
    },
  },
}
