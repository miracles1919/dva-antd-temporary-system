const API = 'http://localhost:8088/productManage'

module.exports = {
  name: '农商系统',
  // prefix: 'fanfan',
  footerText: 'Ant Design Admin  © 2018 农商系统',
  // logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  CORS: ['http://localhost:8088'],
  openPages: ['/login', '/register'],
  apiPrefix: '/api/v1',
  cookieName: {
    uid: 'new_platform_uid',
    token: 'new_platform_token',
  },
  API,
  api: {
    login: `${API}/adminlogin`,
    register: `${API}/userregister`,
    sellRegister: `${API}/sellregister`,
    upload: `${API}/imgUpload`,
  },
}
