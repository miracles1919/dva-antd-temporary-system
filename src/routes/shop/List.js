import React from 'react'
import PropTypes from 'prop-types'
import { Table, Input, Button, Popconfirm, InputNumber, DatePicker, Cascader } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import city from 'utils/city'

const EditableCell = ({ editable, value, onChange }) => {
  return (
    <div>
      {editable
        ? <Input value={value} onChange={e => onChange(e.target.value)} />
        : value
      }
    </div>
  )
}

EditableCell.propTypes = {
  editable: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
}

const NumberCell = ({ editable, value, onChange }) => {
  return (
    <div>
      {
        editable
          ? <InputNumber value={value} onChange={val => onChange(val)} />
          : value
      }
    </div>
  )
}

NumberCell.propTypes = {
  editable: PropTypes.bool,
  value: PropTypes.number,
  onChange: PropTypes.func,
}

const TimeCell = ({ editable, value, onChange }) => {
  return (
    <div>
      {
        editable
          ? <DatePicker value={moment(value)} onChange={val => onChange(val.format('YYYY-MM-DD'))} />
          : value
      }
    </div>
  )
}

TimeCell.propTypes = {
  editable: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
}

const AddressCell = ({ editable, value, onChange }) => {
  console.log(value)
  return (
    <div>
      {
        editable
          ? <Cascader
            value={value}
            options={city}
            onChange={val => onChange(val)}
          />
          : value.join('／')
      }
    </div>
  )
}

AddressCell.propTypes = {
  editable: PropTypes.bool,
  value: PropTypes.array,
  onChange: PropTypes.func,
}

const BtnCell = ({ editable, edit, save, off, cancel }) => {
  return (
    <div>
      {
        editable ?
          <div>
            <Button onClick={save}>确定</Button>
            <Button onClick={cancel}>取消</Button>
          </div>
          :
          <div>
            <Button onClick={edit}>编辑</Button>
            <Popconfirm title="确定要下架？" onConfirm={off}>
              <Button>下架</Button>
            </Popconfirm>
          </div>
      }
    </div>
  )
}

BtnCell.propTypes = {
  editable: PropTypes.bool,
  edit: PropTypes.func,
  save: PropTypes.func,
  off: PropTypes.func,
  cancel: PropTypes.func,
}

const List = ({
  shop: {
    shopList,
    cacheList,
  },
  dispatch,
}) => {
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

  const renderColumns = (text, record, column) => {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => handleChange(value, record.key, column)}
      />
    )
  }

  const renderNumber = (text, record, column) => {
    return (
      <NumberCell
        editable={record.editable}
        value={Number(text)}
        onChange={value => handleChange(value, record.key, column)}
      />
    )
  }

  const renderTime = (text, record, column) => {
    return (
      <TimeCell
        editable={record.editable}
        value={text}
        onChange={value => handleChange(value, record.key, column)}
      />
    )
  }

  const renderAddress = (text, record, column) => {
    return (
      <AddressCell
        editable={record.editable}
        value={text}
        onChange={value => handleChange(value, record.key, column)}
      />
    )
  }

  const edit = key => {
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

  const save = key => {
    const newData = [...shopList]
    const target = newData.filter(item => key === item.key)[0]
    if (target) {
      target.editable = false
      dispatch({
        type: 'shop/updateState',
        payload: { shopList: newData },
      })
    }
  }

  const off = key => {
    const newData = shopList.filter(item => key !== item.key)
    dispatch({
      type: 'shop/updateState',
      payload: { shopList: newData },
    })
  }

  const cancel = key => {
    const newData = [...shopList]
    const target = newData.filter(item => key === item.key)[0]
    if (target) {
      Object.assign(target, cacheList.filter(item => key === item.key)[0])
      target.editable = false
      dispatch({
        type: 'shop/updateState',
        payload: { shopList: newData },
      })
    }
  }

  const columns = [{
    title: '商品名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    render: (text, record) => renderColumns(text, record, 'name'),
  }, {
    title: '照片',
    dataIndex: 'img',
    key: 'img',
  }, {
    title: '出产时间',
    dataIndex: 'time',
    key: 'time',
    render: (text, record) => renderTime(text, record, 'time'),
  }, {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    render: (text, record) => renderAddress(text, record, 'address'),
  }, {
    title: '价格',
    dataIndex: 'price',
    key: 'price',
    render: (text, record) => renderNumber(text, record, 'price'),
  }, {
    title: '数量',
    dataIndex: 'number',
    key: 'number',
    render: (text, record) => renderNumber(text, record, 'number'),
  }, {
    title: '操作',
    render: (text, record) => {
      let { key } = record
      return (<BtnCell
        editable={record.editable}
        edit={edit.bind(this, key)}
        save={save.bind(this, key)}
        off={off.bind(this, key)}
        cancel={cancel.bind(this, key)}
      />)
    },
  }]

  return (
    <Table
      dataSource={shopList}
      columns={columns}
    />
  )
}

List.propTypes = {
  shop: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ shop }) => ({ shop }))(List)
