import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button } from 'antd'
import { connect } from 'dva'

class Review extends React.Component {
  constructor (props) {
    super(props)
    this.columns = [{
      title: '账号',
      dataIndex: 'account',
      key: 'account',
    }, {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    }, {
      title: '照片',
      dataIndex: 'imgurlone',
      key: 'imgurlone',
      colSpan: 3,
      width: 100,
      render: url => <img src={url} alt="img" width={80} />,
    }, {
      // title: '照片',
      dataIndex: 'imgurltwo',
      key: 'imgurltwo',
      width: 100,
      colSpan: 0,
      render: url => <img src={url} alt="img" width={80} />,
    }, {
      // title: '照片',
      dataIndex: 'imgurlthree',
      key: 'imgurlthree',
      width: 100,
      colSpan: 0,
      render: url => <img src={url} alt="img" width={80} />,
    }, {
      title: '身份证',
      dataIndex: 'idCard',
      key: 'idCard',
    }, {
      title: '操作',
      render: (text, record) => (
        <div>
          <Button type="primary" onClick={this.pass.bind(this, record.id)}>通过</Button>
          <Button style={{ marginLeft: '10px' }} onClick={this.fail.bind(this, record.id)}>不通过</Button>
        </div>
      ),
    }]
  }

  componentDidMount () {
    this.props.dispatch({ type: 'setting/list' })
  }

  pass (id) {
    this.props.dispatch({ type: 'setting/check', payload: { id, type: true } })
  }

  fail (id) {
    this.props.dispatch({ type: 'setting/check', payload: { id, type: false } })
  }

  render () {
    const { reviewList } = this.props.setting

    return (
      <div>
        <Table columns={this.columns} dataSource={reviewList} />
      </div>
    )
  }
}

Review.propTypes = {
  dispatch: PropTypes.func,
  setting: PropTypes.object,
}

export default connect(({ setting }) => ({ setting }))(Review)
