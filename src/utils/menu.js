const menuTree = [{
  title: '系统设置',
  key: '1',
  children: [{
    title: '修改密码',
    key: '1-1',
    mpid: '1',
    bpid: '1',
    route: '/modify',
  }],
}, {
  title: '审核注册',
  key: '2',
  route: '/review',
}, {
  title: '商品',
  key: '3',
  children: [{
    title: '上架',
    key: '3-1',
    mpid: '3',
    bpid: '3',
    route: '/add',
  }, {
    title: '列表',
    key: '3-2',
    mpid: '3',
    bpid: '3',
    route: '/list',
  }, {
    title: '列表',
    key: '3-3',
    mpid: '3',
    bpid: '3',
    route: '/list2',
  }, {
    title: '购物车',
    key: '3-4',
    mpid: '3',
    bpid: '3',
    route: '/cart',
  }, {
    title: '我的订单',
    key: '3-5',
    mpid: '3',
    bpid: '3',
    route: '/order',
  }],
}]

module.exports = {
  menuTree,
}
