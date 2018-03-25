import React from 'react'
import { Table, Button } from 'antd'

const columns = [{
  title: '账号',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '照片',
  dataIndex: 'img',
  key: 'img',
}, {
  title: '操作',
  render: () => (
    <div>
      <Button type="primary">通过</Button>
      <Button style={{ marginLeft: '10px' }}>不通过</Button>
    </div>
  ),
}]

const dataSource = [{ account: '11', img: '1', key: '1' }]

const Review = () => {
  return (
    <div>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  )
}

export default Review
