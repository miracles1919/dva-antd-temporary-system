/* global window */
/* global document */
/* global location */
import { routerRedux } from 'dva/router'
import config from 'config'
import { getInfomation } from 'services/login'
import queryString from 'query-string'
import { menu } from 'utils'

const { prefix } = config
const menuList = menu

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

    * query ({
      payload,
    }, { call, put, select }) {
      let permission = menuList.map(item => item.key)
      let menuFilter = menuList
      yield put({
        type: 'updateState',
        payload: {
          authority: permission,
          menu: menuFilter,
        },
      })

      // const { success, data } = yield call(getInfomation, payload)
      // const { locationPathname, user } = yield select(_ => _.app)
      // if (success && data.info) {
      //   const { authority, name } = data.info
      //   user.name = name
      //   let menuFilter = menuList
      //   let permission
      //   if (authority[0] === 'admin') {
      //     permission = menuList.map(item => item.key)
      //   } else {
      //     permission = authority
      //     let parentNode = []
      //     authority.forEach((item) => {
      //       let arr = item.split('-')
      //       if (arr.length === 2) {
      //         parentNode.push(arr[0])
      //       } else if (arr.length === 3) {
      //         parentNode.push(`${arr[0]}-${arr[1]}`)
      //       }
      //     })
      //
      //     permission = permission.concat(Array.from(new Set(parentNode)))
      //
      //     menuFilter = menuList.filter((item) => {
      //       const cases = [
      //         permission.includes(item.key),
      //         item.mpid ? permission.includes(item.mpid) || item.mpid === '-1' : true,
      //         item.bpid ? permission.includes(item.bpid) : true,
      //       ]
      //       return cases.every(_ => _)
      //     })
      //   }
      //   yield put({
      //     type: 'updateState',
      //     payload: {
      //       user,
      //       authority: permission,
      //       menu: menuFilter,
      //     },
      //   })
      //   if (location.hash.indexOf('#/login') !== -1) {
      //     // 跳转
      //     let pathname
      //     for (let i = 0; i < menuFilter.length; i++) {
      //       if (menuFilter[i].route) {
      //         pathname = menuFilter[i].route
      //         break
      //       }
      //     }
      //     yield put(routerRedux.push({
      //       pathname,
      //     }))
      //   }
      // } else {
      //   yield put(routerRedux.push({
      //     pathname: '/login',
      //   }))
      // }
    },

    * logout (action, { put }) {
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
  },
}
