import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Cascader, Popconfirm } from 'antd'
import { connect } from 'dva'
import city from 'utils/city'

const UserList = ({
  shop: {
    shopList,
  },
}) => {
  const columns = [{
    title: '商品名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
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
  }, {
    title: '操作',
    render: (text, record) =>
      <Popconfirm title="确定要购买？"><Button>购买</Button></Popconfirm>,
  }]

  return (
    <div>
      <div style={{ backgroundColor: '#f8f8f8' }}>
        <Cascader
          options={city}
          size="large"
          placeholder="请选择地区"
          changeOnSelect
        />
      </div>
      <Table
        dataSource={shopList}
        columns={columns}
      />
    </div>
  )
}

UserList.propTypes = {
  shop: PropTypes.object,
}

export default connect(({ shop }) => ({ shop }))(UserList)
