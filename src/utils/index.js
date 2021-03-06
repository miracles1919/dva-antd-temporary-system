/* global window */
import classnames from 'classnames'
import lodash from 'lodash'
import config from './config'
import { request, requestMock } from './request'
import { color } from './theme'
import { menuTree } from './menu'

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = lodash.cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

/**
 * 树状结构转数组格式
 * @param   {Array}   array
 * @param   {String}  children
 * @return  {Array}
 */
const treeToArray = (array, children = 'children') => {
  let data = lodash.cloneDeep(array)
  let result = []

  data.forEach((item) => {
    let itemClone = lodash.cloneDeep(item)
    delete itemClone[children]
    result.push({ ...itemClone })
    if (item[children]) {
      result = [...result, ...treeToArray(item[children])]
    }
  })

  return result
}

const menuKeyList = treeToArray(menuTree)

module.exports = {
  config,
  request,
  requestMock,
  color,
  classnames,
  queryURL,
  queryArray,
  arrayToTree,
  treeToArray,
  menuTree,
  menuKeyList,
}
