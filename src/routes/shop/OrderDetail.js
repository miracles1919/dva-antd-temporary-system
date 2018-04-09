import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table } from 'antd'


const Detail = ({ shop: { orderDetail } }) => {
  const columns = [{
    title: '商品名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '照片',
    dataIndex: 'prodImg',
    key: 'prodImg',
    render: (url) => <img src={url} alt="img" width={80} />,
  }, {
    title: '出产时间',
    dataIndex: 'createTime',
    key: 'createTime',
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
    title: '实付款',
    dataIndex: 'paymoney',
    key: 'paymoney',
  }]
  return (
    <div>
      <div>
        {orderDetail.otime && orderDetail.otime.split(' ')[0]}
        订单号：{orderDetail.oid}
      </div>
      {
        orderDetail.key ?
          <Table
            dataSource={[orderDetail]}
            columns={columns}
          /> : null
      }
    </div>
  )
}

Detail.propTypes = {
  shop: PropTypes.object,
}

export default connect(({ shop }) => ({ shop }))(Detail)
