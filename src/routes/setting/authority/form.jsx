import { Form, Input, Select, Button, Modal } from 'antd'
import { addAccount } from 'services/login'
import React from 'react'
import Tree from './tree'
import emitter from './events'

const FormItem = Form.Item
const Option = Select.Option
class RegistrationForm extends React.Component {
  //  使用context
  static contextTypes = {
    data: React.PropTypes.array,
  }
  static propTypes = {
    isX: React.PropTypes.bool,
    form: React.PropTypes.object,
    close: React.PropTypes.func,
  }
  constructor (props) {
    super(props)
    this.state = {
      loading: false, //  确定按钮的圈圈
      authority: [],
      nameLength: 0, //  名字的长度
      nameLengthBreif: 0, //  备注的长度
      breif: '',
    }
  }
  //  为了实现点 X 的时候也能清空
  componentWillReceiveProps (nextProps) {
    if (nextProps.isX) {
      this.props.form.resetFields()
      this.state = {
        loading: false,
        authority: [],
        nameLength: 0,
        nameLengthBreif: 0,
      }
    }
  }
  //  获得selectTree的值
  getTreeValue = (value) => {
    console.log('getTreeValue', value)
    this.setState({ authority: value })
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
  //  点击取消时清空表单
  handleCancel = () => {
    this.props.close(false)
    this.setState({ authority: [], nameLength: 0, nameLengthBreif: 0 })
    this.props.form.resetFields()
  }
  //  提交动作
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 为了消除tree组件的值不能被表单域捕获到的尴尬
        values.authority = JSON.parse(JSON.stringify(this.state.authority))
        if (values.authority.length === 0) {
          Modal.error({ title: '所选角色的权限不能为空' })
          return
        }
        this.filterList(values.authority)
        let self = this
        console.log('Received values of form: ', values)
        this.setState({ loading: true })
        addAccount(values).then((res) => {
          if (res.success) {
            // 表格的每条数据都需要一个key属性
            values.key = Math.random()
            emitter.emit('changeList', [
              ...this.context.data,
              values,
            ])
            this.setState({ loading: false, authority: [], nameLength: 0, nameLengthBreif: 0 })
            this.props.close(false)
            this.props.form.resetFields()
          }
        }).catch((error) => {
          self.setState({ loading: false })
          Modal.error({ title: '该邮箱已被注册，请确认' })
          console.log('发生错误！', error)
        })
      }
    })
  }
  // 切换角色是重置默认选项
  handleChange = (value) => {
    if (value === '管理员') {
      this.setState({
        authority: ['1-1', '1-2'],
      })
    } else if (value === '有读运营') {
      this.setState({
        authority: ['1-2', '2-1-1', '3-1-1', '3-1-2', '3-1-3'],
      })
    }else if (value === '数据库运营') {
      this.setState({
          authority: ['1-2', '4-2-1','4-2-2'],
      });

    }else if (value === '高级数据库运营') {
      this.setState({
        authority: ['1-2', '4-1-1','4-1-2','4-2-1','4-2-2'] ,
      });
    }
  }
  // 计算名字输入框的字符数,中文输入法状态
  countLength = (e) => {
    e = e || window.event
    let keyCode = e.keyCode || e.which
    let length = e.target.value.length
    if (keyCode === 32 || keyCode === 13 || keyCode === 8) {
      if (e.target.value.length <= 8) {
        if (keyCode === 8) {
          // 下面的条件成立，说明删除操作是在中文输入法删除拼音的时候触发的
          if (length > this.state.nameLength) {
            return
          }
        }
        this.setState({ nameLength: e.target.value.length })
      } else {
        // 如果在中文输入法下，当汉字还未输入时，按下删除键不做任何反应
        if (keyCode === 8) {
          return
        }
        Modal.error({ title: '姓名长度不得大于8个字符' })
        this.props.form.setFieldsValue({
          name: e.target.value.slice(0, 8),
        })
        this.setState({ nameLength: 8 })
      }
    }
  }
  // 计算名字输入框的字符数,英文输入法状态
  countLengthPress = (e) => {
    if (e.target.value.length < 8) {
      this.setState({
        nameLength: e.target.value.length + 1,
      })
    } else {
      Modal.error({ title: '备注长度不得大于8个字符' })
      this.props.form.setFieldsValue({
        name: e.target.value.slice(0, 8),
      })
      this.setState({ nameLength: 8 })
    }
  }
  // 计算备注输入框的字符数，中文输入法状态 （键值分别对应着 空格键  回车键  删除键）
  countLengthBreif = (e) => {
    e = e || window.event
    let keyCode = e.keyCode || e.which
    let length = e.target.value.length
    console.log(keyCode, e.target.value.length)
    if (keyCode === 32 || keyCode === 13 || keyCode === 8) {
      if (e.target.value.length <= 20) {
        if (keyCode === 8) {
          // 下面的条件成立，说明删除操作是在中文输入法删除拼音的时候触发的
          if (length > this.state.nameLengthBreif) {
            return
          }
        }
        this.setState({ nameLengthBreif: e.target.value.length })
      } else {
        if (keyCode === 8) {
          return
        }
        Modal.error({ title: '备注长度不得大于20个字符' })
        this.props.form.setFieldsValue({
          breif: e.target.value.slice(0, 20),
        })
        this.setState({ nameLengthBreif: 20 })
      }
    }
  }
  // 计算备注输入框的字符数，英文输入法状态
  countLengthBreifPress = (e) => {
    if (e.target.value.length < 20) {
      this.setState({
        nameLengthBreif: e.target.value.length + 1,
      })
    } else {
      Modal.error({ title: '备注长度不得大于20个字符' })
      this.props.form.setFieldsValue({
        breif: e.target.value.slice(0, 20),
      })
      this.setState({ nameLengthBreif: 20 })
    }
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 4,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 16,
        },
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

    return (<Form onSubmit={this.handleSubmit}>
      <FormItem {...formItemLayout} label="姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名">
        {
          getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入使用者姓名',
              },
            ],
          })(<Input
            style={{ width: 150 }}
            onKeyPress={this.countLengthPress}
            onKeyUp={this.countLength}
            suffix={<span style={{ color: '#c7c4c4' }} > {`${this.state.nameLength}/8`} </span>}
          />)
        }
      </FormItem>
      <FormItem {...formItemLayout} label="邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱">
        {
          getFieldDecorator('account', {
            rules: [
              {
                type: 'email',
                message: '请输入正确格式的邮箱账号',
              }, {
                required: true,
                message: '请输入邮箱',
              },
            ],
          })(<Input />)
        }
      </FormItem>
      <FormItem {...formItemLayout} label="账号性质">
        {
          getFieldDecorator('per_role', {
            rules: [
              {
                required: true,
                message: '请选择账号',
              },
            ],
          })(<Select style={{ width: 120 }} onChange={this.handleChange}>
            <Option value="管理员">管理员</Option>
            <Option value="有读运营">有读运营</Option>
            <Option value="数据库运营">数据库运营</Option>
            <Option value="高级数据库运营">高级数据库运营</Option>
          </Select>)
        }
      </FormItem>
      <FormItem {...formItemLayout} label="账号权限">
        {
          getFieldDecorator('authority', {
            rules: [
              {
                required: false,
              },
            ],
          })(<Tree onSelectTree={this.getTreeValue} checkedKeys={this.state.authority} />)
        }
      </FormItem>
      <FormItem {...formItemLayout} label="备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注">
        {
          getFieldDecorator('breif', {
            rules: [
              {
                required: false,
              },
            ],
          })(<Input onKeyPress={this.countLengthBreifPress}
            onKeyUp={this.countLengthBreif}
            suffix={<span style={{ color: '#c7c4c4' }} > {
              `${this.state.nameLengthBreif}/20`
            }
            </span>}
          />)
        }
      </FormItem>
      <FormItem {...tailFormItemLayout}>
        <Button
          key="back"
          onClick={this.handleCancel}
          style={{ marginRight: 30 }}
        >取消
        </Button>
        <Button htmlType="submit" key="submit" type="primary" loading={this.state.loading}>
          确定
        </Button>
      </FormItem>
    </Form>)
  }
}
const WrappedRegistrationForm = Form.create()(RegistrationForm)
export default WrappedRegistrationForm
