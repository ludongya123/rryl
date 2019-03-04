import Vue from 'vue'
import Vuex from 'vuex'

import Profit from './myProfit/index'   //引入（我的收益）模块store

Vue.use(Vuex)


export default new Vuex.Store({
  // 直接引用使用当前引用名，
  // store.state.Profit ====> object
  // 使用健值对引入
  // a: Profit store.state.a ====> object
  modules: {
    Profit
  }
})
