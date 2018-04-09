import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button } from 'antd'
import { connect } from 'dva'

const cart = ({
  shop: {
    cartList,
  },
  dispatch,
}) => {
  const del = ({ id }) => {
    dispatch({ type: 'shop/cartDel', payload: { shoppingcarId: id } })
  }

  const pay = ({ id, productId, price, number }) => {
    dispatch({
      type: 'shop/pay',
      payload: { shoppingcarId: id, productId, number, payMoney: price * number },
    })
  }

  const columns = [{
    title: '商品名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
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
    title: '操作',
    render: (text, record) => {
      return (
        <div>
          <Button
            type="primary"
            style={{ marginRight: '10px' }}
            onClick={pay.bind(this, record)}
          >
          支付
          </Button>
          <Button onClick={del.bind(this, record)}>删除</Button>
        </div>
      )
    },
  }]

  return (
    <div>
      <Table
        dataSource={cartList}
        columns={columns}
      />
    </div>
  )
}

const HOC = WrappedComponent => {
  return class extends React.Component {
    static propTypes = {
      dispatch: PropTypes.func,
    }

    componentDidMount () {
      this.props.dispatch({ type: 'shop/cartList' })
    }

    render () {
      return (
        <WrappedComponent {...this.props} />
      )
    }
  }
}

cart.propTypes = {
  shop: PropTypes.object,
  dispatch: PropTypes.func,
}

const Cart = HOC(cart)

export default connect(({ shop }) => ({ shop }))(Cart)
