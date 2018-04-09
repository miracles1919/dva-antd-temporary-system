import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input } from 'antd'
import styles from './index.less'
import PicturesWall from './PicturesWall'

const FormItem = Form.Item
const InputGroup = Input.Group

const Register = ({
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue,
    validateFields,
  },
  login: {
    register,
    confirmDirty,
    fileList,
  },
}) => {
  const handleOk = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      console.log(values)
      dispatch({
        type: 'login/register',
        payload: values,
      })
    })
  }

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== getFieldValue('password')) {
      callback('两次密码不一致！')
    } else {
      callback()
    }
  }

  const validateToNextPassword = (rule, value, callback) => {
    if (value && confirmDirty) {
      validateFields(['confirm'], { force: true })
    }
    callback()
  }

  const handleConfirmBlur = (e) => {
    const { value } = e.target
    dispatch({
      type: 'login/updateState',
      confirmDirty: confirmDirty || !value,
    })
  }

  const loop = () => {
    dispatch({ type: 'login/return' })
  }

  const wrapStyle = register === 'user' ? null : { height: '558px', marginTop: '-295px' }

  return (
    <div className={styles.form} style={wrapStyle}>
      <div className={styles.logo}>
        {register === 'user' ? '买家' : '商家' }注册
      </div>
      <form>
        <FormItem>
          {getFieldDecorator('account', {
            rules: [{
              required: true,
              message: '请输入账号',
            }],
          })(<Input size="large" onPressEnter={handleOk} placeholder="请输入账号" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{
              required: true,
              message: '请输入用户名',
            }],
          })(<Input size="large" onPressEnter={handleOk} placeholder="请输入用户名" />)}
        </FormItem>
        <FormItem>
          <InputGroup>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入密码',
                }, {
                  min: 6,
                  max: 20,
                  message: '请输入6~20位数字或字母组成的密码',
                }, {
                  validator: validateToNextPassword,
                },
              ],
            })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="请输入密码" />)}
          </InputGroup>
        </FormItem>
        <FormItem>
          <InputGroup>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请输入密码',
                }, {
                  validator: compareToFirstPassword,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                placeholder="请确认密码"
                onBlur={handleConfirmBlur}
              />
            )}
          </InputGroup>
        </FormItem>
        <FormItem>
          {getFieldDecorator('idCard', {
            rules: [{
              required: true,
              message: '请输入身份证',
            }, {
              pattern: /^\d{17}[\d|xX]$/,
              message: '请输入正确的身份证',
            }],
          })(
            <Input size="large" placeholder="请输入身份证" />
          )}
        </FormItem>
        {
          register === 'shop' ?
            <div>
              <p className={styles.tip}>请依次上传认证照片</p>
              <PicturesWall dispatch={dispatch} fileList={fileList} />
            </div> : null
        }
        <Row style={{ marginTop: '10px' }}>
          <Button type="primary" size="large" onClick={handleOk}>
            确认
          </Button>
        </Row>
        <span className={styles.return} onClick={loop} >返回登录</span>

      </form>
    </div>
  )
}

Register.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  login: PropTypes.object,
}

export default connect(({ login }) => ({ login }))(Form.create()(Register))
