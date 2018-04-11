import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Cascader, Input, Form, InputNumber } from 'antd'
import { connect } from 'dva'
import city from 'utils/city'

const FormItem = Form.Item

const NumberCell = ({ editable, value, onChange, max }) => {
  return (
    <div>
      {
        editable
          ? <InputNumber value={value} onChange={onChange} max={max} min={1} />
          : value
      }
    </div>
  )
}

NumberCell.propTypes = {
  editable: PropTypes.bool,
  value: PropTypes.number,
  onChange: PropTypes.func,
  max: PropTypes.number,
}

const BtnCell = ({ editable, buy, sure, add, cancel }) => {
  return (
    <div>
      {
        editable ?
          <div>
            <Button onClick={sure}>确定</Button>
            <Button onClick={cancel} style={{ marginLeft: '10px' }}>取消</Button>
          </div>
          :
          <div>
            <Button onClick={buy}>购买</Button>
            <Button type="primary" style={{ marginLeft: '10px' }} onClick={add}>加入购物车</Button>
          </div>
      }
    </div>
  )
}

BtnCell.propTypes = {
  editable: PropTypes.bool,
  buy: PropTypes.func,
  sure: PropTypes.func,
  add: PropTypes.func,
  cancel: PropTypes.func,
}

const userList = ({
  shop: {
    shopList,
    cacheList,
    shopType,
  },
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    resetFields,
  },
}) => {
  const opEdit = (key, bool, shopType) => {
    const newData = [...shopList]
    const target = newData.filter(item => key === item.key)[0]
    if (target) {
      if (!bool) {
        Object.assign(target, cacheList.filter(item => key === item.key)[0])
      }
      target.editable = bool
      dispatch({
        type: 'shop/updateState',
        payload: { shopList: newData, shopType },
      })
    }
  }

  const sure = (record) => {
    let { id, number, price } = record
    if (shopType === 'cart') {
      dispatch({ type: 'shop/cartAdd', payload: { number, productId: id } })
    } else if (shopType === 'buy') {
      dispatch({ type: 'shop/buy', payload: { number, productId: id, payMoney: number * price } })
    }
  }

  const handleChange = (value, key, column) => {
    const newData = [...shopList]
    const target = newData.filter(item => key === item.key)[0]
    if (target) {
      target[column] = value
      dispatch({
        type: 'shop/updateState',
        payload: { shopList: newData },
      })
    }
  }

  const columns = [{
    title: '溯源码',
    dataIndex: 'id',
    key: 'id',
  }, {
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
    width: 105,
    render: (text, record) => {
      return (
        <NumberCell
          editable={record.editable}
          value={Number(text)}
          onChange={value => handleChange(value, record.key, 'number')}
          max={cacheList.filter(item => item.key === record.key)[0].number}
        />
      )
    },
  }, {
    title: '操作',
    width: 250,
    render: (text, record) => {
      return (
        <BtnCell
          editable={record.editable}
          buy={opEdit.bind(this, record.id, true, 'buy')}
          add={opEdit.bind(this, record.id, true, 'cart')}
          cancel={opEdit.bind(this, record.id, false, '')}
          sure={sure.bind(this, record)}
        />
      )
    },
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
  form: PropTypes.object,
}

const UserList = HOC(userList)

export default connect(({ shop }) => ({ shop }))(Form.create()(UserList))
