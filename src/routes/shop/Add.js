import React from 'react'
import PropTypes from 'prop-types'
import { Input, Cascader, Form, Button, Upload, Icon, DatePicker } from 'antd'
import city from 'utils/city'
import { connect } from 'dva'

import styles from './Add.less'

const FormItem = Form.Item

const UploadButton = () => {
  return (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  )
}

const Add = ({
  form,
  dispatch,
  shop: {
    addImg,
  },
}) => {
  const { getFieldDecorator } = form

  const formItemLayout = {
    labelCol: { span: 6, offset: 0 },
    wrapperCol: { span: 14, offset: 0 },
  }

  const checkNum = (rule, value, callback) => {
    if (value > 0 || !value) {
      callback()
      return
    }
    callback('请输入正确的数量')
  }

  const checkPrice = (rule, value, callback) => {
    if (value > 0 || !value) {
      callback()
      return
    }
    callback('请输入正确的价格')
  }

  const onSubmit = (e) => {
    e.preventDefault()

    let { validateFields } = form

    validateFields((err, fieldsValue) => {
      if (err) {
        return
      }

      console.log(fieldsValue)
    })
  }

  return (
    <div className={styles.wrap}>
      <Form onSubmit={onSubmit}>
        <ul>
          <li>
            <FormItem
              {...formItemLayout}
              label="商品名称"
            >
              {
                getFieldDecorator('shopName', {
                  rules: [{
                    required: true,
                    message: '必填',
                  }],
                })(
                  <Input placeholder="请输入商品名称" style={{ width: '185px' }} />
                )
              }
            </FormItem>
          </li>
          <li>
            <FormItem
              {...formItemLayout}
              label="所在地区"
            >
              {
                getFieldDecorator('location', {
                  rules: [{
                    required: true,
                    message: '必选',
                  }],
                })(
                  <Cascader
                    size="large"
                    style={{ width: '100%' }}
                    options={city}
                    changeOnSelect
                    placeholder="请选择地区"
                  />
                )
              }
            </FormItem>
          </li>
          <li>
            <FormItem
              {...formItemLayout}
              label="出产时间"
            >
              {
                getFieldDecorator('time', {
                  rules: [{
                    required: true,
                    message: '请选择时间',
                  }],
                })(
                  <DatePicker />
                )
              }
            </FormItem>
          </li>
          <li>
            <FormItem
              {...formItemLayout}
              label="商品数量"
            >
              {
                getFieldDecorator('number', {
                  initialValue: 1,
                  rules: [{
                    required: true,
                    message: '必填',
                  }, {
                    validator: checkNum,
                  }],
                })(
                  <Input />
                )
              }
            </FormItem>
          </li>
          <li>
            <FormItem
              {...formItemLayout}
              label="价格"
            >
              {
                getFieldDecorator('price', {
                  rules: [{
                    required: true,
                    message: '必填',
                  }, {
                    validator: checkPrice,
                  }],
                })(
                  <Input />
                )
              }
            </FormItem>
          </li>
          <li>
            <FormItem
              {...formItemLayout}
              label="图片"
            >
              {
                getFieldDecorator('img', {
                  rules: [{
                    required: true,
                    message: '请选择图片',
                  }],
                })(
                  <Upload
                    listType="picture-card"
                    showUploadList={false}
                  >
                    {
                      addImg ? '' : <UploadButton />
                    }
                  </Upload>
                )
              }
            </FormItem>
          </li>
        </ul>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit">上架</Button>
        </div>
      </Form>
    </div>
  )
}

Add.propTypes = {
  dispatch: PropTypes.func,
  form: PropTypes.object,
  shop: PropTypes.object,
}

export default connect(({ shop }) => ({ shop }))(Form.create()(Add))
