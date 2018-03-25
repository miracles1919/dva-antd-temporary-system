const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix, logo } = config

let commentsList = Mock.mock({
  'comment_list|1-10': [{
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
  }],
  total: 10,
  page_num: 1,
  page_max: 1,
})

let tagObj = Mock.mock({
  tag_data: {
    前端: [{
      user_account: '13955449107',
      user_id: '1748300001',
      user_name: 'xxx',
    }],
    运营: [],

  },
})


module.exports = {
  [`GET ${apiPrefix}/user/user_manage/comments`] (req, res) {
    res.json({ code: 0, data: commentsList })
  },

  [`GET ${apiPrefix}/user/user_manage/tag_list`] (req, res) {
    res.json({ code: 0, data: tagObj })
  },
}
