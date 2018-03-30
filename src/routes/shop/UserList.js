import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Cascader, Popconfirm } from 'antd'
import { connect } from 'dva'
import city from 'utils/city'

const userList = ({
  shop: {
    shopList,
  },
  dispatch,
}) => {
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
    render: () =>
      <Popconfirm title="确定要购买？"><Button>购买</Button></Popconfirm>,
  }]

  const onChange = (list) => {
    dispatch({ type: 'shop/search', payload: { address: list.join('/') } })
  }

  return (
    <div>
      <div style={{ backgroundColor: '#f8f8f8' }}>
        <Cascader
          options={city}
          size="large"
          placeholder="请选择地区"
          changeOnSelect
          onChange={onChange}
        />
      </div>
      <Table
        dataSource={shopList}
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
      this.props.dispatch({ type: 'shop/list' })
    }

    render () {
      return (
        <WrappedComponent {...this.props} />
      )
    }
  }
}

userList.propTypes = {
  shop: PropTypes.object,
  dispatch: PropTypes.func,
}

const UserList = HOC(userList)

export default connect(({ shop }) => ({ shop }))(UserList)
