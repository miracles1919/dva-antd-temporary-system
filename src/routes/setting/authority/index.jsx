import React from 'react'
import { Button, Col, Row, Modal } from 'antd'
import { deleAccount, getUserList } from 'services/login'
import { menu } from 'utils'
import SelectTable from './table'
import Modalsuper from './modal'
import emitter from './events'

class Authority extends React.Component {
  // 创造顶层的context
  static childContextTypes = {
    data: React.PropTypes.array,
    selectList: React.PropTypes.array,
  }

  constructor () {
    super()
    this.state = {
      selectList: [], // 选中的内容
      visibleForDelete: false, // 展示删除列表的弹层
      deleteList: [], // 删除弹层的展示内容
      data: [], // 表格的展示数据
      loading: false,
    }
  }
  getChildContext () {
    return { data: this.state.data, selectList: this.state.selectList }
  }
  componentDidMount () {
    // 为了避免说我组件已经卸载我却还在setstate
    this._isMounted = true
    getUserList({}).then(res => {
      if (res.success) {
        res.data.map((item, index) => {
          if (item.authority[0] === 'admin') {
            let authorityList = []
            menu.forEach((item1) => {
              authorityList.push(item1.key)
            })
            item.authority = authorityList
          }
          item.key = index
          return item
        })
        this.setState({ data: res.data })
      }
    }).catch((error) => {
      alert('加载失败')
      console.log(error)
    })
    // 如果isTrue为true，说明这个emit是修改账号发起的，此种情况下需要手动清空selectList，否则会出现数据没选中，点击修改
    //  按钮，依旧会弹出修改页面，因为此时selectList不为空
    this.eventEmitter = emitter.addListener('changeList', (data, isTrue) => {
      if (isTrue) {
        this.setState({ data, selectList: [] })
      } else {
        this.setState({ data })
      }
    })
  }
  componentWillUnmount () {
    this._isMounted = false
    emitter.removeListener('changeList', (data, isTrue) => {
      if (isTrue) {
        this.setState({ data, selectList: [] })
      } else {
        this.setState({ data })
      }
    })
  }

  // 判断要展示那个弹层（可能性有3种）
  showModal = (isEdit) => {
    if (isEdit) {
      if (this.state.selectList.length === 0) {
        Modal.info({ title: '请先选中您要操作的数据' })
        return
      }
      if (this.state.selectList.length > 1) {
        Modal.warn({ title: '单次操作只能选中一条数据' })
        return
      }
    }
    this.refs.Modalsuper.setVisible(true, isEdit)
  }
  // 子组件传递选中的值
  selectList = (selectList) => {
    this.setState({ selectList })
  }
  // 删除确认弹层
  showModalForDelete = () => {
    let deleteList = []
    if (this.state.selectList.length === 0) {
      Modal.info({ title: '请先选中您要操作的数据' })
      return
    }
    this.state.selectList.forEach((item, index) => {
      let str = `${item.name}-${item.per_role}-${item.account}`
      deleteList.push(<div key={index}>{str}</div>)
    })
    this.setState({ deleteList, visibleForDelete: true })
  }
  // 删除操作
  handleOk = () => {
    let DeleteAccountList = []
    this.state.selectList.forEach((item) => {
      DeleteAccountList.push(item.account)
    })
    this.setState({ loading: true })
    deleAccount({ account_list: DeleteAccountList }).then(resource => {
      if (resource.success) {
        getUserList({}).then(res => {
          if (res.success) {
            res.data.map((item, index) => {
              item.key = index
              return item
            })
            this.setState({
              data: res.data,
              visibleForDelete: false,
              // 手动清空selectList
              selectList: [],
              loading: true,
            })
          }
        })
      }
    }).catch(() => {
      Modal.error({ title: '删除失败' })
    })
  }
  // 取消删除
  handleCancel = () => {
    this.setState({ visibleForDelete: false })
  }
  render () {
    console.log(menu)
    return (<div style={{ margin: 15, padding: 15 }} >
      <Row style={{ marginBottom: 15 }}>
        <Col span={3}>
          <Button type="primary" style={{ width: 100 }} onClick={this.showModal.bind(this, false)}>添加</Button>
        </Col>
        <Col span={3}>
          <Button type="primary" style={{ width: 100 }} onClick={this.showModal.bind(this, true)}>修改</Button>
        </Col>
        <Col span={3}>
          <Button onClick={this.showModalForDelete} type="primary" style={{ width: 100 }}>
            删除
          </Button>
        </Col>
      </Row>
      <Row>
        <SelectTable selectList={this.selectList} data={this.state.data} />
      </Row>
      <Modal title="是否确认删除以下账号"
        visible={this.state.visibleForDelete}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>取消</Button>,
          <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
            确定
          </Button>,
        ]}
      >
        {this.state.deleteList}
      </Modal>
      <Modalsuper ref="Modalsuper" />
    </div>)
  }
}
export default Authority
