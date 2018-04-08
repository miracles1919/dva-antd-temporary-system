import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Cascader, Popconfirm, Input, Form } from 'antd'
import { connect } from 'dva'
import city from 'utils/city'

const FormItem = Form.Item

const userList = ({
  shop: {
    shopList,
  },
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    resetFields,
  },
}) => {
  const buy = (id) => {
    dispatch({ type: 'shop/buy', payload: { id } })
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
    render: (text, record) =>
      <Popconfirm title="确定要购买？" onConfirm={buy.bind(this, record.id)}><Button>购买</Button></Popconfirm>,
  }]

  const onChange = (list) => {
    dispatch({ type: 'shop/search', payload: { address: list.join('/') } })
  }

  const onSubmit = (e) => {
    e.preventDefault()

    validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      let values = {}
      if (fieldsValue.address) {
        values.address = fieldsValue.address.join('/')
      }

      if (fieldsValue.name) {
        values.name = fieldsValue.name
      }

      dispatch({ type: 'shop/search', payload: values })
    })
  }

  const clear = () => {
    resetFields()
    dispatch({ type: 'shop/search', payload: {} })
  }

  return (
    <div>
      <div style={{ backgroundColor: '#f8f8f8' }}>
        <Form layout="inline" onSubmit={onSubmit}>
          <FormItem>
            {getFieldDecorator('address', {})(
              <Cascader
                options={city}
                size="large"
                placeholder="请选择地区"
                changeOnSelect
                onChange={onChange}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('name', {})(
              <Input placeholder="请输入商品名称" />
            )}
          </FormItem>
          <Button type="primary" htmlType="submit">搜索</Button>
          <span style={{ cursor: 'pointer', marginLeft: '20px' }} onClick={clear}>清空</span>
        </Form>

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

export default connect(({ shop }) => ({ shop }))(Form.create()(UserList))
