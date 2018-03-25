import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Form, Select, Row, Col } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
const { Option } = Select

const AddComment = ({
  form: {
    getFieldDecorator,
  },
  tagData,
  tag,
  dispatch,
}) => {
  const formItemLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 12 },
  }

  let labelSelect = (val) => {
    dispatch({ type: 'comment/updateState', payload: { tag: val } })
  }

  let onChange = (e) => {
    console.log(e)
    console.log(e.target.value)
  }

  return (
    <div style={{ width: '400px' }}>
      <FormItem>
        {getFieldDecorator('textDetail', {
          rules: [{ required: true, message: '请输入评论' }],
        })(
          <TextArea placeholder="请输入评论" rows={6} onChange={onChange} maxLength="8" />
        )}
      </FormItem>
      <Row>
        <Col span={12}>
          <FormItem label="选择账户" {...formItemLayout}>
            {getFieldDecorator('tag', {
              rules: [{ required: true, message: '请选择标签' }],
            })(
              <Select placeholder="标签" style={{ width: 100 }} onSelect={labelSelect}>
                {Object.keys(tagData).map((item) => {
                  return (
                    <Option key={item}>{item}</Option>
                  )
                })}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem>
            {getFieldDecorator('user_id', {
              rules: [{ required: true, message: '请选择用户' }],
            })(
              <Select placeholder="用户名" style={{ width: 100 }}>
                {tag !== '' ? tagData[tag].map((item) => {
                  return (
                    <Option key={item.user_id}>{item.user_name}</Option>
                  )
                }) : null}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
    </div>
  )
}


AddComment.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  tagData: PropTypes.object,
  tag: PropTypes.string,
}


export default Form.create()(AddComment)
