const APIV1 = '/api/v1'
const APIV2 = '/api/v2'

module.exports = {
  name: '农商系统',
  prefix: 'fanfan',
  footerText: 'Ant Design Admin  © 2017 beichoo',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  CORS: ['https://api-dev.beichoo.com'],
  openPages: ['/login', '/register'],
  apiPrefix: '/api/v1',
  cookieName: {
    uid: 'new_platform_uid',
    token: 'new_platform_token',
  },
  APIV1,
  APIV2,
  api: {

  },
}
