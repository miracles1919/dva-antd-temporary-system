import React from 'react'
import { Button, Form, Select, Input, DatePicker, Table, Modal } from 'antd'
import PropTypes from 'prop-types'
import { getArticle } from 'services/weather'

import styles from './article.css'


const { RangePicker } = DatePicker
const FormItem = Form.Item
const Option = Select.Option


class article extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tableLoading: false,
      tableData: [],
      previewVisible: false,
      category: '',
      source: '',
      title: '',
      timeList: [],
      page: '',
      pageMax: '',
      issuer: '',
      sortBtnIndex: 0, // 排序按钮

    }
  }

  componentDidMount () {
    this.tablePageChange(1)
  }

  handleCancel = () => this.setState({ previewVisible: false })

  addArticle = () => {
    this.props.history.push(`${this.props.match.url}/addArticle`)
  }

  titleChange = (e) => {
    this.setState({
      title: e.target.value,
    })
  }

  sourceChange = (e) => {
    this.setState({
      source: e.target.value,
    })
  }

  issuerChange = (e) => {
    this.setState({
      issuer: e.target.value,
    })
  }

  tablePageChange = (page) => {
    // localStorage.setItem('currentPage', page)
    this.setState({
      tableLoading: true,
    })

    getArticle({ page }).then((res) => {
      console.log(res)
      const data = res.article_list
      let tableData = []
      data.map((val, index) => {
        return tableData.push(Object.assign(val, {key: index}))
      })
      this.setState({
        tableData,
        tableLoading: false,
        page: res.page,
        pageMax: res.page_max,
      })
    })
  }


  render () {
    const btnList = ['按时间排序', '按浏览量排序', '按评论数排序', '按热度排序']
    const { sortBtnIndex } = this.state

    const columns = [{
      title: '文章标题',
      dataIndex: 'title',
      key: 'title',
      width: '250px',
    }, {
      title: '封面',
      dataIndex: 'cover',
      key: 'cover',
      render:
        src =>
          (<img src={src}
                width={50}
                height={50}
                onClick={() => {
                  this.setState({ previewImage: src, previewVisible: true })
                }}
            />
          )
    }, {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: '250px',
    }, {
      title: '具体来源（公众号）',
      dataIndex: 'issuer_nickname',
    }, {
      title: '公众号id',
      dataIndex: 'issuer',
    }, {
      title: '时间',
      dataIndex: 'ctime',
      key: 'ctime',
      width: '180px',
      // render: (data) => (
      //   <div>{moment(data, 'X').format('YYYY-MM-DD HH:mm')}</div>
      // )
    }, {
      title: '操作',
      key: 'action',
      width: '100px',
      render: (record) => (
        <div>
          <Button onClick={() => {
            this.props.history.push({
              pathname: `${this.props.match.url}/editArticle` + '/' + encodeURIComponent(record.uri),
              query: {
                id: record.id,
                title: record.title,
                source: record.source,
                cover: record.cover,
                category: record.category,
              },
            })
          }}>编辑</Button>
          <Button onClick={() => {
            this.props.history.push({
              pathname: `${this.props.match.url}/discussArticle` + '/' + encodeURIComponent(record.uri),
              query: {
                id: record.id,
                title: record.title,
                source: record.source,
                cover: record.cover,
                category: record.category,
                flag: 1,
              }
            })
          }} style={{marginTop: 10}}>评论</Button>
        </div>
      ),
    }, {
      title: '上架 下架',
      key: 'operation',
      render: (record) => (
        <div>
          <Button >{record.status === 0 ? '下架' : '取消下架'}</Button>
        </div>
      )
    }]

    return (
      <div className={styles.editWrap}>
        <Button
          type="primary"
          size={'large'}
          onClick={() => { this.addArticle() }}
        >新增文章</Button>
        <div className={styles.editPool}>
          <Form layout="inline">
            <FormItem label={'分类'}>
              <Select
                placeholder=""
                style={{ width: '120px', display: 'inline-block' }}
                size={'small'}
                defaultValue={'all'}
              >
                <Option value="all">全部</Option>
              </Select>
            </FormItem>
            <FormItem label={'文章标题'}>
              <Input placeholder="请输入" size={'small'} value={this.state.title} onChange={this.titleChange}/>
            </FormItem>
            <FormItem label={'文章来源'}>
              <Input placeholder="请输入" size={'small'} value={this.state.source} onChange={this.sourceChange}/>
            </FormItem>
            <FormItem label={'时间'}>
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder={['Start Time', 'End Time']}
                size={'small'}
                onOk={() => {
                }}
              />
            </FormItem>
            <FormItem label={'公众号ID'}>
              <Input placeholder="请输入" size={'small'} value={this.state.issuer} onChange={this.issuerChange} />
            </FormItem>
            <FormItem>
              <Button type="primary" size={'small'} onClick={this.articleSearch}>查询</Button>
            </FormItem>
          </Form>
          <div>
            {btnList.map((item, index) => {
              return (
                <Button
                  key={`btn${index}`}
                  type={sortBtnIndex === index ? 'primary' : 'default'}
                >
                  {item}
                </Button>
              )
            })}
          </div>

        </div>
        <div style={{ width: '100%' }}>
          <Table
            columns={columns}
            dataSource={this.state.tableData}
            pagination={{
              defaultPageSize: 10,
              total: this.state.pageMax,
              current: this.state.page,
              onChange: this.tablePageChange,
            }}
            loading={this.state.tableLoading}
          />
          <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
          </Modal>
        </div>
      </div>
    )
  }
}

article.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object
}

export default article
