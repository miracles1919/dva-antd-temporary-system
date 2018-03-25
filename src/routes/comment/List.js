import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input } from 'antd'
import { logo } from 'config'
import { connect } from 'dva'

import AddComment from './Add'
import styles from './List.less'

const commentItem = {
  'comment_id|+1': 1,
  'praise_num|+1': 0,
  mtime: 1512309170,
  article_id: 'wx-http://mp.weixin.qq.com/s?__biz=MzU1MDA4NjkwMg==&mid=2247483806&idx=1&sn=8298528256ab7b3169a312ba8c3b6002&scene=0',
  share_num: 0,
  ctime: 1512309170,
  content: '不学化学， 悲痛欲绝 👍\n数学学不好， 我拿圆规扎你d👏',
  praise: 0,
  from_user_info: {
    portrait: logo,
    user_id: 1750300186,
    name: '石原',
  },
  operation_time: 1512309170,
}

const ListItem = () => {
  const { praise, content, ctime } = commentItem
  const shareNum = commentItem.share_num
  const { portrait, name } = commentItem.from_user_info

  return (
    <div>
      <div className={styles.commentItem}>
        <div className={styles.item}>
          <div className={styles.head}>
            <div className={styles.verticalCenter}>
              <img className={styles.logo} alt="" src={portrait} />
              <span>{name}</span>
            </div>
            <p className={styles.time}>前天11：18</p>
          </div>
          <p className={styles.num}>
            <span style={{ marginRight: '15px' }}>{praise}人赞</span>
            <span>{shareNum}人分享</span>
          </p>
          <p>{ content }</p>
        </div>
        <div className={styles.button}>
          <Button>回复</Button>
        </div>
      </div>
      <p className={styles.blue}>查看全部20条回复</p>
    </div>
  )
}

const CommentList = ({ comment, dispatch }) => {
  const data = [1, 2]
  const { tagData, tag } = comment
  console.log('comment', comment)
  return (
    <div>
      <AddComment tagData={tagData} tag={tag} dispatch={dispatch} />
      {data.map((item, index) => {
        return <ListItem key={`c${index}`} />
      })}
    </div>
  )
}


CommentList.propTypes = {
  comment: PropTypes.object,
  dispatch: PropTypes.func,
}


export default connect(({ comment, dispatch }) => ({ comment, dispatch }))(CommentList)

