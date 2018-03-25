import { Table, Modal, Button } from 'antd'
import React from 'react'
import Tree from './tree'

// rowSelection object indicates the need for row selection
class selectTable extends React.Component {
  static contextTypes = {
    selectList: React.PropTypes.array,
    data: React.PropTypes.array,
  }
  static propTypes={
    selectList: React.PropTypes.func,
  }
  constructor () {
    super()
    this.state = {
      data: [],
      authority: [],
      authorityModal: false,
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
        // 给父组件  index.js 回传数据
          this.props.selectList(selectedRows)
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        },
        getCheckboxProps: record => ({
          disabled: record.per_role === '超级管理员', // Column configuration not to be checked
        }),
      },
      columns: [
        {
          title: '用户账号',
          dataIndex: 'account',
        }, {
          title: '姓名',
          dataIndex: 'name',
        }, {
          title: '账号性质',
          dataIndex: 'per_role',
        }, {
          title: '权限',
          dataIndex: 'authorityShow',
          render: (text, record) => (<a onClick={() => {
            this.showAuthority(text, record)
          }}
          >{text}</a>),
        }, {
          title: '备注',
          dataIndex: 'breif',
        },
      ],
    }
  }

  componentWillReceiveProps (nextProps) {
    // 展示效果不佳，并且后期维护麻烦，考虑更换成弹层展示
    let nextPropsCopy = JSON.parse(JSON.stringify(nextProps))
    nextPropsCopy.data.forEach((item) => {
      item.authorityShow = '查看'
    })
    this.setState({ data: nextPropsCopy.data })
  }
    showAuthority = (text, record) => {
      console.log(record.authority, text)
      this.setState({ authorityModal: true, authority: record.authority })
    }
    handleCancel = () => {
      this.setState({ authorityModal: false })
    }

    render () {
      console.log(this.state, this.state.authority)
      return (<div>
        <Table rowSelection={this.state.rowSelection} pagination={false} columns={this.state.columns} dataSource={this.state.data} />
        <Modal visible={this.state.authorityModal}
          title="权限详情"
          onCancel={this.handleCancel}
          footer={[<Button key="submit" type="primary" onClick={this.handleCancel}>
            确定
          </Button>,
          ]}
        >
          <Tree checkedKeys={this.state.authority} onlyForShow />
        </Modal>
      </div>)
    }
}
export default selectTable
