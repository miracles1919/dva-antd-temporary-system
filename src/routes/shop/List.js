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
  return (
    <div>
      {
        editable
          ? <Cascader
            value={value.split('/')}
            options={city}
            onChange={val => onChange(val)}
            changeOnSelect
          />
          : value
      }
    </div>
  )
}

AddressCell.propTypes = {
  editable: PropTypes.bool,
  value: PropTypes.string,
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
            <Popconfirm title="确定要删除？" onConfirm={off}>
              <Button>删除</Button>
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

const list = ({
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
        onChange={value => handleChange(value.join('/'), record.key, column)}
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
    dispatch({ type: 'shop/update', payload: { key } })
  }

  const off = key => {
    dispatch({ type: 'shop/del', payload: { produId: key } })
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
    dataIndex: 'prodImg',
    key: 'prodImg',
    render: (url) => <img src={url} alt="img" width={80} />,
  }, {
    title: '出产时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (text, record) => renderTime(text, record, 'createTime'),
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

const List = HOC(list)

list.propTypes = {
  shop: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ shop }) => ({ shop }))(List)
