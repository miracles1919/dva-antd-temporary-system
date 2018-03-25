import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Icon } from 'antd'
import { Link } from 'react-router-dom'
import pathToRegexp from 'path-to-regexp'
import { queryArray } from 'utils'
import styles from './Bread.less'

const Bread = ({ menu, location }) => {
  // 匹配当前路由
  let pathArray = []
  let current
  for (let index in menu) {
    if (menu[index].route && pathToRegexp(menu[index].route).exec(location.pathname)) {
      current = menu[index]
      break
    }
  }

  const getPathArray = (item) => {
    pathArray.unshift(item)
    if (item.bpid) {
      getPathArray(queryArray(menu, item.bpid, 'key'))
    }
  }

  let paramMap = {}
  if (!current) {
    pathArray.push({
      key: 404,
      title: 'Not Found',
    })
  } else {
    getPathArray(current)

    let keys = []
    let values = pathToRegexp(current.route, keys).exec(location.pathname.replace('#', ''))
    if (keys.length) {
      keys.forEach((currentValue, index) => {
        if (typeof currentValue.title !== 'string') {
          return
        }
        paramMap[currentValue.title] = values[index + 1]
      })
    }
  }

  // 递归查找父级
  const breads = pathArray.map((item, key) => {
    const content = (
      <span>{item.icon
        ? <Icon type={item.icon} style={{ marginRight: 4 }} />
        : ''}{item.title}</span>
    )
    return (
      <Breadcrumb.Item key={key}>
        {((pathArray.length - 1) !== key)
          ? <Link to={pathToRegexp.compile(item.route || '')(paramMap) || '#'}>
            {content}
          </Link>
          : content}
      </Breadcrumb.Item>
    )
  })

  return (
    <div className={styles.bread}>
      <Breadcrumb>
        {breads}
      </Breadcrumb>
    </div>
  )
}

Bread.propTypes = {
  menu: PropTypes.array,
  location: PropTypes.object,
}

export default Bread
