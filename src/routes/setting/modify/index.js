import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input } from 'antd'

const FormItem = Form.Item

const Modify = ({
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue,
    validateFields,
  },
  setting: {
    modifyDirty,
  },
  dispatch,
}) => {
  const onSubmit = (e) => {
    e.preventDefault()

    validateFields((err, fieldsValue) => {
      if (err) {
        return
      }

      dispatch({
        type: 'setting/mod',
        payload: fieldsValue,
      })
    })
  }

  const validateToNextPassword = (rule, value, callback) => {
    if (value && modifyDirty) {
      validateFields(['confirmPassword'], { force: true })
    }
    callback()
  }

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== getFieldValue('newPassword')) {
      callback('两次密码不一致！')
    } else {
      callback()
    }
  }

  return (
    <div style={{ width: '200px', paddingLeft: '20px', paddingTop: '10px' }}>
      <Form onSubmit={onSubmit}>
        <FormItem
          label="请输入旧密码"
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true,
              message: '请输入旧密码',
            }],
          })(
            <Input size="large" type="password" width={200} />)
          }
        </FormItem>
        <FormItem
          label="请输入新密码"
        >
          {getFieldDecorator('newPassword', {
            rules: [{
              required: true,
              message: '请输入新密码',
            }, {
              min: 6,
              max: 20,
              message: '请输入6~20位数字或字母组成的密码',
            }, {
              validator: validateToNextPassword,
            }],
          })(
            <Input size="large" type="password" width={200} />)
          }
        </FormItem>
        <FormItem
          label="请确认新密码"
        >
          {getFieldDecorator('confirmPassword', {
            rules: [{
              required: true,
              message: '请输入新密码',
            }, {
              validator: compareToFirstPassword,
            }],
          })(
            <Input size="large" type="password" width={200} />)
          }
        </FormItem>
        <Button type="primary" htmlType="submit" style={{ marginTop: '20px', marginBottom: '20px' }}>修改密码</Button>
      </Form>
    </div>
  )
}

Modify.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  setting: PropTypes.object,
}

export default connect(({ setting }) => ({ setting }))(Form.create()(Modify))
