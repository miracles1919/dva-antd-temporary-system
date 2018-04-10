import React from 'react'
import PropTypes from 'prop-types'
import { Form, Table, Input, Button } from 'antd'
import { connect } from 'dva'

const FormItem = Form.Item

const Search = ({
  form: {
    getFieldDecorator,
    validateFields,
  },
  shop: {
    searchProd,
  },
  dispatch,
}) => {
  console.log(searchProd)
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
    title: '生产人',
    dataIndex: 'seller',
    key: 'seller',
  }, {
    title: '价格',
    dataIndex: 'price',
    key: 'price',
  }, {
    title: '数量',
    dataIndex: 'number',
    key: 'number',
  }]

  const onSubmit = (e) => {
    e.preventDefault()

    validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      fieldsValue.productId = fieldsValue.productId.trim()
      dispatch({ type: 'shop/searchId', payload: fieldsValue })
    })
  }

  const data = Object.keys(searchProd).length > 0 ? [searchProd] : []
  return (
    <div>
      <Form layout="inline" onSubmit={onSubmit}>
        <FormItem
          label="溯源码"
        >
          {getFieldDecorator('productId', {})(
            <Input />
          )}
        </FormItem>
        <Button type="primary" htmlType="submit">搜索</Button>
      </Form>
      <Table
        columns={columns}
        dataSource={data}
      />
    </div>
  )
}

Search.propTypes = {
  form: PropTypes.object,
  shop: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ shop }) => ({ shop }))(Form.create()(Search))
