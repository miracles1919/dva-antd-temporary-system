import React from 'react'
import PropTypes from 'prop-types'
import { Input, Cascader, Form, Button, Upload, Icon, DatePicker, InputNumber } from 'antd'
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
    fileList,
  },
}) => {
  const { getFieldDecorator, resetFields, setFields } = form

  const formItemLayout = {
    labelCol: { span: 6, offset: 0 },
    wrapperCol: { span: 14, offset: 0 },
  }

  const onSubmit = (e) => {
    e.preventDefault()

    let { validateFields } = form

    validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      dispatch({ type: 'shop/shelves', payload: fieldsValue })
      resetFields()
    })
  }

  const uploadImg = ({ file }) => {
    dispatch({ type: 'shop/upload', payload: { file } })
  }

  const onRemove = (file) => {
    const newFileList = fileList.filter(item => item.uid !== file.uid)
    dispatch({ type: 'shop/updateState', payload: { fileList: newFileList } })
    setFields({ img: { value: '' } })
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
                getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    message: '必填',
                  }],
                })(
                  <Input placeholder="请输入商品名称" style={{ width: '100%' }} />
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
                getFieldDecorator('createTime', {
                  rules: [{
                    required: true,
                    message: '请选择时间',
                  }],
                })(
                  <DatePicker style={{ width: '100%' }} />
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
                  }],
                })(
                  <InputNumber min={1} style={{ width: '100%' }} />
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
                  }],
                })(
                  <InputNumber min={1} style={{ width: '100%' }} />
                )
              }
            </FormItem>
          </li>
          <li>
            <FormItem
              {...formItemLayout}
              label="图片"
            >
              {getFieldDecorator('img', {
                rules: [{
                  required: true,
                  message: '请选择图片',
                }],
              })(
                <Upload
                  listType="picture-card"
                  customRequest={uploadImg}
                  fileList={fileList}
                  onRemove={onRemove}
                >
                  {fileList.length > 0 ? null
                    : <UploadButton />
                  }
                </Upload>
              )}
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
