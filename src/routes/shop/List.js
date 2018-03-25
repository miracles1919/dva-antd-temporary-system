import React from 'react'
import { Table, Input, Button } from 'antd'
import { connect } from 'dva'

const EditableCell = ({ editable, value, onChange }) => {
  return (
    <div>
      {editable
        ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
        : value
      }
    </div>
  )
}

const BtnCell = ({ editable, edit }) => {
  return (
    <div>
      {editable
        ? <div><Button>确定</Button><Button>取消</Button></div>
        : <div><Button onClick={edit}>编辑</Button><Button>下架</Button></div>
      }
    </div>
  )
}

const List = ({
  shop: { shopList },
  dispatch,
}) => {
  let renderColumns = (text, record, column) => {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
      />
    )
  }

  let edit = key => {
    const newData = [...shopList]
    const target = newData.filter(item => key === item.key)[0]
    if (target) {
      target.editable = true
      dispatch({
        type: 'shop/updateState',
        payload: { shopList: newData },
      })
    }
  }

  let columns = [{
    title: '商品名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => renderColumns(text, record, 'name'),
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
    render: (text, record) => <Button onClick={edit.bind(this, record.key)}>编辑</Button>,
  }]

  return (
    <Table
      dataSource={shopList}
      columns={columns}
    />
  )
}

export default connect(({ shop }) => ({ shop }))(List)
