const menuTree = [{
  title: '系统设置',
  key: '1',
  children: [{
    title: '权限管理',
    key: '1-1',
    mpid: '1',
    bpid: '1',
    route: '/authority',
  }, {
    title: '基础信息',
    key: '1-2',
    mpid: '1',
    bpid: '1',
    route: '/basicInfo',
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
  }],
},
//   {
//   title: '消息推送',
//   key: '2',
//   children: [{
//     title: 'app推送',
//     key: '2-1',
//     mpid: '2',
//     bpid: '2',
//     children: [{
//       title: '有读',
//       key: '2-1-1',
//       mpid: '2-1',
//       bpid: '2-1',
//     }],
//   }],
// }, {
//   title: '产品运营',
//   key: '3',
//   children: [{
//     title: '内容管理',
//     key: '3-1',
//     mpid: '3',
//     bpid: '3',
//     children: [{
//       title: '文章管理',
//       key: '3-1-1',
//       mpid: '3-1',
//       bpid: '3-1',
//       route: '/articleManage',
//     }, {
//       title: '合集管理',
//       key: '3-1-2',
//       mpid: '3-1',
//       bpid: '3-1',
//     }, {
//       title: '类目管理',
//       key: '3-1-3',
//       mpid: '3-1',
//       bpid: '3-1',
//       route: '/categoryManage',
//     }],
//   }],
// }, {
//   title: '数据库管理',
//   key: '4',
//   children: [{
//     title: '简历总览',
//     key: '4-1',
//     mpid: '4',
//     bpid: '4',
//     children: [{
//       title: '有意愿简历库',
//       key: '4-1-1',
//       mpid: '4-1',
//       bpid: '4-1',
//       route: '/willResumeDataBase',
//     }, {
//       title: '标签库管理',
//       key: '4-1-2',
//       mpid: '4-1',
//       bpid: '4-1',
//       route: '/tagDataManage',
//     }],
//   }, {
//     title: '简历数据管理',
//     key: '4-2',
//     mpid: '4',
//     bpid: '4',
//     children: [{
//       title: '标签管理',
//       key: '4-2-1',
//       mpid: '4-2',
//       bpid: '4-2',
//       route: '/tagManage',
//     }, {
//       title: '简历详情',
//       key: '4-2-2',
//       mpid: '-1',
//       bpid: '4-2',
//       route: '/resumeDetail',
//     },],
//   }],
// }
// {
//   title: 'demo',
//   key: '999',
//   children: [{
//     title: 'login',
//     mpid: '999',
//     bpid: '999',
//     key: '999-1',
//     route: '/demo/in',
//   }, {
//     title: 'notfound',
//     mpid: '999',
//     bpid: '999',
//     key: '999-2',
//     route: '/demo/notfound',
//   }],
// }
]

module.exports = {
  menuTree,
}
