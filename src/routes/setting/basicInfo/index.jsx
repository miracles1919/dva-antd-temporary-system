import { Form, Input, Button, message, Modal } from 'antd'
import React from 'react'
// import PropTypes from 'prop-types'
import { getInfomation, resetPassword } from 'services/login'

const FormItem = Form.Item
class MyComponent extends React.Component {
  static propTypes = {
  }
  static propTypes = {
    form: React.PropTypes.object,
  }
  constructor (props) {
    super(props)
    this.state = {
      confirmDirty: false,
      userInfo: {},
      uesrEditInfo: {},
    }
  }
  componentDidMount () {
    getInfomation().then((res) => {
      if (res.success) {
        console.log(res.data.info)
        this.setState({
          userInfo: res.data.info,
        })
      }
    }).catch((error) => {
      message.error(error.message)
    })
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
    checkPassword = (rule, value, callback) => {
      const form = this.props.form
      if (value && value !== form.getFieldValue('password')) {
        callback('两次密码输入不一致！')
      } else {
        callback()
      }
    }
    checkConfirm = (rule, value, callback) => {
      const form = this.props.form
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      if (value && value.length < 6) {
        callback('密码长度应大于6个字符')
        return
      }
      callback()
    }
    countLengthPress = (e) => {
      if (e.target.value.length >= 16) {
        Modal.error({ title: '密码长度不得大于16个字符' })
        this.props.form.setFieldsValue({
          password: e.target.value.slice(0, 16),
        })
      }
    }

 handleCancel=() => {
   this.props.form.resetFields()
 }
 handleSubmit = (e) => {
   e.preventDefault()
   this.props.form.validateFieldsAndScroll((err, values) => {
     console.log(111, err)
     if (!err) {
       console.log('Received values of form: ', values)
       let editInfo = {}
       editInfo.account = this.state.userInfo.account
       editInfo.password = values.prevPassword
       editInfo._password = values.confirm
       console.log(values, editInfo)
       resetPassword(editInfo).then((res) => {
         if (res.success) {
           message.success('修改成功')
           this.props.form.resetFields()
         }
       }).catch((error) => {
         message.error(error.message)
       })
     }
   })
 }
 render () {
   const { getFieldDecorator } = this.props.form
   const formItemLayout = {
     labelCol: {
       span: 2,
     },
     wrapperCol: {
       span: 10,
     },
   }
   const tailFormItemLayout = {
     wrapperCol: {
       span: 4,
     },
   }
   console.log(this.state)
   return (
     <div style={{ marginTop: 15, padding: 15 }}>
       <Form onSubmit={this.handleSubmit} >
         <FormItem
           {...formItemLayout}
           label="姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名"
         >
           {getFieldDecorator('name')(
             <span>{this.state.userInfo.name}</span>
           )}
         </FormItem>
         <FormItem
           {...formItemLayout}
           label="账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号"
         >
           {getFieldDecorator('account')(
             <span>{this.state.userInfo.account}</span>
           )}
         </FormItem>
         <FormItem
           {...formItemLayout}
           label="修改密码"
         >
           {getFieldDecorator('prevPassword', {
             rules: [{
               required: true, message: '请输入原密码!',
             }],
           })(
             <Input style={{ width: 230 }} placeholder="请输入原密码" type="password" />
           )}
         </FormItem>
         <FormItem
           {...formItemLayout}
           style={{ marginLeft: 93 }}
         >
           {getFieldDecorator('password', {
             rules: [{
               required: true, message: '请输入新密码，长度为6~16个字符',
             }, {
               validator: this.checkConfirm,
             }],
           })(
             <Input style={{ width: 230 }} placeholder="请输入新密码，长度为6~16个字符" onKeyPress={this.countLengthPress} type="password" />
           )}
         </FormItem>
         <FormItem
           {...formItemLayout}
           style={{ marginLeft: 93 }}
         >
           {getFieldDecorator('confirm', {
             rules: [{
               required: true, message: '请再次输入新密码',
             }, {
               validator: this.checkPassword,
             }],
           })(
             <Input style={{ width: 230 }} placeholder="请再次输入新密码" type="password" onBlur={this.handleConfirmBlur} />
           )}
         </FormItem>
         <FormItem {...tailFormItemLayout}>
           {/* <Button className="hfaj1" key="back" onClick={this.handleCancel} style={{ marginRight: 30, marginLeft: 30 }}>清空</Button> */}
           <Button
             htmlType="submit"
             key="submit"
             type="primary"
             style={{ marginLeft: 93 }}
           >
              修改
           </Button>
         </FormItem>
       </Form>
     </div>
   )
 }
}

const editComponent = Form.create()(MyComponent)
export default editComponent
