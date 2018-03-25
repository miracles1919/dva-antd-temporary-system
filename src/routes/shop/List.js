import React from 'react'
import { Table } from 'antd'

const columns = [{
  title: '商品名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '照片',
  dataIndex: 'img',
  key: 'img',
}, {
  title: '出产时间',
  dataIndex: 'time',
  key: 'time',
}, {
  title: '地址',
  dataIndex: 'address',
  key: 'address',
}, {
  title: '价格',
  dataIndex: 'price',
  key: 'price',
}, {
  title: '数量',
  dataIndex: 'number',
  key: 'number',
}]

const dataSource = [{ name: 'iphone8', img: 'iphone81', key: '1', price: '8888', number: 12, time: '2018-03-04', address: '杭州' }]

const List = () => {
  return (
    <div>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  )
}

export default List
