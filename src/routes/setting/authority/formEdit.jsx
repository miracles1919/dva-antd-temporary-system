import { Form, Input, Select, Button, Modal } from 'antd'
import { updateAccount } from 'services/login'
import React from 'react'
import Tree from './tree'
import emitter from './events'

const FormItem = Form.Item
const Option = Select.Option
class RegistrationForm extends React.Component {
  // 使用context
  static contextTypes = { selectList: React.PropTypes.array, data: React.PropTypes.array }
  static propTypes = {
    isX: React.PropTypes.bool,
    form: React.PropTypes.object,
    close: React.PropTypes.func,
  }
  state = {
    loading: false,
    name: '', // 姓名
    account: '', // 邮箱账号
    per_role: '', // 角色
    authority: [], // 权限
    breif: '', // 备注
    isFirst: true, // 判断是否第一次加载数据   输入框的字数显示
    isFirstAuthroity: true, // 判断是否第一次加载数据   权限的展示
    nameLengthBreif: 0, // 备注的字符长度
    charcterChange: false, // 在修改页面是否修改过权限
  }
  componentWillUnmount () {
    console.log('componentWillUnmount')
  }
  // 获取子组件tree的值
  getTreeValue=(value) => {
    this.setState({
      authority: value,
      isFirstAuthroity: false,
      charcterChange: true,
    })
  }
  // 去除树的父节点
  filterList=(list) => {
    list.forEach((item) => {
    // debugger
      let idx = list.indexOf(item.slice(0, item.length - 2))
      if (idx > -1) {
        list.splice(idx, 1)
      }
    })
  }
  // 关闭弹层
   handleCancel=() => {
     this.props.close(false)
   }
  // 提交动作
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 为了消除tree组件的值不能被表单域捕获到的尴尬
        if (this.state.charcterChange) {
          values.authority = JSON.parse(JSON.stringify(this.state.authority))
        } else {
          values.authority = JSON.parse(JSON.stringify(this.context.selectList[0].authority))
        }
        this.filterList(values.authority)
        console.log('Received values of form:  ', values)
        values.name = this.context.selectList[0].name
        values.account = this.context.selectList[0].account
        this.setState({ loading: true })
        console.log(values.authority)
        updateAccount(values)
          .then((res) => {
            if (res.success) {
              values.key = Math.random()
              let idx = 0
              // 确定修改的数据是第几条
              this.context.data.forEach((item, index) => {
                if (item.account === values.account) {
                  idx = index
                }
              })
              let copyData = JSON.parse(JSON.stringify(this.context.data))
              copyData[idx] = values
              // 回传修改后的数据
              //  emitter.emit('changeList',[...copyData])
              this.setState({
                loading: false,
                authority: [],
                charcterChange: false,
              })
              this.props.form.resetFields()
              this.props.close(false)
              emitter.emit('changeList', [...copyData], true)
            }
          })
      }
    })
  }
  // 切换角色的时候给默认值
  handleChange=(value) => {
    this.setState({
      charcterChange: true,
    })
    if (value === '管理员') {
      this.setState({
        authority: ['1-1', '1-2'],
        isFirstAuthroity: false,
      })
    } else if (value === '有读运营') {
      this.setState({
        authority: ['1-2', '2-1-1', '3-1-1', '3-1-2', '3-1-3'],
        isFirstAuthroity: false,
      })
    }else if (value === '数据库运营') {
      this.setState({
          authority: ['1-2', '4-2-1','4-2-2'],
          isFirstAuthroity: false,
      });

    }else if (value === '高级数据库运营') {
      this.setState({
        authority: ['1-2', '4-1-1','4-1-2','4-2-1','4-2-2'] ,
        isFirstAuthroity: false,
      });
    }
  }

  countLengthBreif=(e) => {
    e = e || window.event
    let keyCode = e.keyCode || e.which
    let length = e.target.value.length
    if (keyCode === 32 || keyCode === 13 || keyCode === 8) {
      if (e.target.value.length <= 20) {
        if (keyCode === 8) {
          // 下面的条件成立，说明删除操作是在中文输入法删除拼音的时候触发的
          if (length > this.state.nameLengthBreif) {
            return
          }
        }
        this.setState({
          nameLengthBreif: e.target.value.length,
          isFirst: false,
        })
      } else {
        // 下面的条件成立，说明删除操作是在中文输入法删除拼音的时候触发的
        if (keyCode === 8) {
          return
        }
        Modal.error({
          title: '备注长度不得大于20个字符',
        })
        this.props.form.setFieldsValue({
          breif: e.target.value.slice(0, 20),
        })
        this.setState({
          nameLengthBreif: 20,
          isFirst: false,
        })
      }
    }
  }
    countLengthBreifPress=(e) => {
      if (e.target.value.length < 20) {
        this.setState({
          nameLengthBreif: e.target.value.length + 1,
          isFirst: false,
        })
      } else {
        Modal.error({
          title: '备注长度不得大于20个字符',
        })
        this.props.form.setFieldsValue({
          breif: e.target.value.slice(0, 20),
        })
        this.setState({
          nameLengthBreif: 20,
          isFirst: false,
        })
      }
    }
    render () {
      console.log('edit', this.state.isFirstAuthroity)
      if (this.context.selectList[0].breif) {
        this.state.isFirst
          ? (this.state.nameLengthBreif = this.context.selectList[0].breif.length)
          : this.state.nameLengthBreif
      }
      const { getFieldDecorator } = this.props.form
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      }
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="姓&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 名"
          >
            {getFieldDecorator('name', {
              rules: [{
                required: false, message: '请输入姓名',
              }],
            })(
              <span>{this.context.selectList[0].name}</span>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="邮&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 箱"
          >
            {getFieldDecorator('account', {
              rules: [{
                type: 'email', message: '请输入邮箱',
              }, {
                required: false, message: 'Please input your E-mail!',
              }],
            })(
              <span>{this.context.selectList[0].account}</span>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="账号性质"
          >
            {getFieldDecorator('per_role', {
              initialValue: this.context.selectList[0].per_role,
              rules: [{
                required: true,
              }],
            })(
              <Select style={{ width: 120 }} onChange={this.handleChange}>
                <Option value="管理员">管理员</Option>
                <Option value="有读运营">有读运营</Option>
                <Option value="数据库运营">数据库运营</Option>
                <Option value="高级数据库运营">高级数据库运营</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="账号权限"
          >
            {getFieldDecorator('authority', {
              rules: [{
                required: false,
              }],
            })(
              <Tree onSelectTree={this.getTreeValue} checkedKeys={this.state.isFirstAuthroity ? this.context.selectList[0].authority : this.state.authority} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 注"
          >
            {getFieldDecorator('breif', {
              initialValue: this.context.selectList[0].breif,
              rules: [{
                required: false,
              }],
            })(
              <Input onKeyUp={this.countLengthBreif} onKeyPress={this.countLengthBreifPress} suffix={<span style={{ color: '#c7c4c4' }}>{`${this.state.nameLengthBreif}/20`}</span>} />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button className="hfaj1" key="back" onClick={this.handleCancel} style={{ marginRight: 30 }}>取消</Button>
            <Button htmlType="submit" key="submit" type="primary" loading={this.state.loading} >
              确定
            </Button>
          </FormItem>
        </Form>
      )
    }
}
const WrappedRegistrationForm = Form.create()(RegistrationForm)
export default WrappedRegistrationForm
