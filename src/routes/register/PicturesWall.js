import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal } from 'antd'
import { imgUpload } from 'services/login'
import styles from './index.less'

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  upload = ({ file }) => {
    let formData = new FormData()
    let { dispatch } = this.props
    formData.append('multipartFile', file)
    imgUpload(formData).then(({ status, data }) => {
      if (status === 200) {
        let fileList = [...this.props.fileList]
        file.status = 'done'
        file.url = `http://${data}`
        fileList.push(file)
        dispatch({ type: 'login/updateState', payload: { fileList } })
      }
    })
  }

  render () {
    const { previewVisible, previewImage } = this.state
    const { fileList } = this.props

    console.log(fileList)
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    return (
      <div className={styles.upload}>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          customRequest={this.upload}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

PicturesWall.propTypes = {
  dispatch: PropTypes.func,
  fileList: PropTypes.array,
}

export default PicturesWall
