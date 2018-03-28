import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Col, Form, Input } from 'antd'
import { config } from 'utils'
import styles from './index.less'

const FormItem = Form.Item
const InputGroup = Input.Group

const Login = ({
  loading,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({
        type: 'login/login',
        payload: values,
      })
    })
  }

  const loop = (type) => {
    dispatch({ type: 'login/loop', payload: { register: type } })
  }

  return (
    <div className={styles.form}>
      <div className={styles.logo}>
        <img alt={'logo'} src={config.logo} />
      </div>
      <form>
        <FormItem>
          {getFieldDecorator('account', {
            rules: [{
              required: true,
              message: '请输入账号',
            }],
          })(<Input size="large" onPressEnter={handleOk} placeholder="Account" />)}
        </FormItem>
        <FormItem>
          <InputGroup>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入密码',
                },
                {
                  min: 6,
                  max: 20,
                  message: '请输入6~20位数字或字母组成的密码',
                },
              ],
            })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="Password" />)}
          </InputGroup>
        </FormItem>
        <Row style={{ marginBottom: '10px' }}>
          <Button type="primary" size="large" onClick={handleOk} loading={loading.effects.login}>
            登录
          </Button>
        </Row>
        <Row type="flex">
          <Col span={12}><Button size="large" onClick={loop.bind(this, 'shop')}>商家注册</Button></Col>
          <Col span={12}><Button size="large" onClick={loop.bind(this, 'user')}>买家注册</Button></Col>
        </Row>

      </form>
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ loading }) => ({ loading }))(Form.create()(Login))
