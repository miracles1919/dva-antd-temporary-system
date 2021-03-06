/* global window */
import axios from 'axios'
import qs from 'qs'
import lodash from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { YQL, CORS } from './config'

const fetch = (options) => {
  let {
    method = 'get',
    data,
    url,
  } = options

  const cloneData = lodash.cloneDeep(data)

  try {
    let domin = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domin = url.match(/[a-zA-z]+:\/\/[^/]*/)[0]
      url = url.slice(domin.length)
    }
    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domin + url
  } catch (e) {
    // message.error(e.message)
  }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
      })
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
      })
    case 'post':
      return axios.post(url, qs.stringify(cloneData))
    case 'put':
      return axios.put(url, cloneData)
    case 'patch':
      return axios.patch(url, cloneData)
    default:
      return axios(options)
  }
}

const fetchUpload = (options) => {
  let {
    data,
    url,
  } = options

  return axios.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

const request = (options) => {
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`
    // 判断是否跨域
    if (window.location.origin !== origin) {
      if (CORS && CORS.indexOf(origin) > -1) {
        options.fetchType = 'CORS'
      } else if (YQL && YQL.indexOf(origin) > -1) {
        options.fetchType = 'YQL'
      } else {
        options.fetchType = 'JSONP'
      }
    }
  }

  return fetch(options).then((response) => {
    const { status } = response
    const { success, result, message } = response.data
    if (success) {
      return Promise.resolve({
        success,
        statusCode: status,
        data: result,
      })
    }

    return Promise.reject({
      success: false,
      statusCode: status,
      message,
    })
  }).catch((error) => {
    const { response } = error
    let msg
    let statusCode
    if (response && response instanceof Object) {
      const { data, statusText } = response
      statusCode = response.status
      msg = data.message || statusText
    } else {
      statusCode = error.statusCode || 600
      msg = error.message || 'Network Error'
    }
    return Promise.reject({ success: false, statusCode, message: msg })
  })
}

const requestMock = (options) => {
  return fetch(options).then((response) => {
    const { statusText, status } = response
    const { code, data, error_msg } = response.data
    if (code === 0) {
      return Promise.resolve({
        success: true,
        message: statusText,
        statusCode: status,
        ...data,
      })
    } else if (code === -3) {
      window.location.href = '/login'
      // console.log(cHistory)
    }

    return Promise.reject({
      success: false,
      statusCode: status,
      message: error_msg,
    })
  }).catch((error) => {
    const { response } = error
    let msg
    let statusCode
    if (response && response instanceof Object) {
      const { data, statusText } = response
      statusCode = response.status
      msg = data.message || statusText
    } else {
      statusCode = 600
      msg = error.message || 'Network Error'
    }
    return Promise.reject({ success: false, statusCode, message: msg })
  })
}

module.exports = {
  request,
  requestMock,
  fetchUpload,
}
