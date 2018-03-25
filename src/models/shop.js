import modelExtend from 'dva-model-extend'

import { model } from './common'

export default modelExtend(model, {
  namespace: 'shop',

  state: {
    addImg: '',
    shopList: [{
      name: 'iphone8', img: 'iphone81', key: '1', price: '8888', number: 12, time: '2018-03-04', address: '杭州', editable: false,
    }],
  },

})
