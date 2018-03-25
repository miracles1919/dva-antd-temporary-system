import { Modal } from 'antd'
import React from 'react'
import Form from './form'
import FormEdit from './formEdit'

class App extends React.Component {
  state = {
    visible: false, // 控制弹层的展现和关闭
    isEdit: false, // 判断是新增还是修改
    isX: false, // 判断弹层的关闭动作是否是通过点击右上角的 X 来实现的
  }
  // 父组件和子组件都通过这个函数来控制弹层是否展现
  setVisible = (value, isEdit) => {
    this.setState({ visible: value, isEdit, isX: false })
  }
  // 点击右上角的 X 时触发
  handleCancel = () => {
    this.setState({ visible: false, isX: true })
  }

  render () {
    const form = this.state.isEdit
      ? <FormEdit close={this.setVisible} />
      : <Form close={this.setVisible} isX={this.state.isX} />
    const { visible } = this.state
    return (<div>
      <Modal visible={visible} title="添加后台账号" onCancel={this.handleCancel} footer={null}>
        {form}
      </Modal>
    </div>)
  }
}

export default App
