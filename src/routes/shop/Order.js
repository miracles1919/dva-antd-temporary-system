import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button } from 'antd'
import { connect } from 'dva'
import { Link } from 'react-router-dom'

const Order = ({
  shop: {
    orderList,
  },
}) => {
  const columns = [{
    title: '订单id',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '溯源码',
    dataIndex: 'productId',
    key: 'productId',
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  }, {
    title: '数量',
    dataIndex: 'number',
    key: 'number',
  }, {
    title: '总价',
    dataIndex: 'paymoney',
    key: 'paymoney',
  }, {
    title: '操作',
    render: (text, record) => <Button><Link to={`order/${record.id}`}>查看</Link></Button>,
  }]

  return (
    <div>
      <Table
        dataSource={orderList}
        columns={columns}
      />
    </div>
  )
}

Order.propTypes = {
  shop: PropTypes.object,
}


export default connect(({ shop }) => ({ shop }))(Order)
