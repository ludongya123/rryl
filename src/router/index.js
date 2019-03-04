import Vue from 'vue'
import Router from 'vue-router'

//  新建料
const NewFeed = () => import('view/newFeed/index') // 新建料
const newPoster = () => import('view/newFeed/newPoster') // 新建海报
// 我的料
const MyFeed = () => import('view/myFeed/index') // 我的料首页
const worksPoster = () => import('view/myFeed/worksPoster') // 新料的海报
const complain = () => import('view/myFeed/complain') // 纠纷投诉
const infoDetail = () => import('view/myFeed/infoDetail') // 料详情
const infoTimeList = () => import('view/myFeed/infoTimeList') // 包时段料列表
const infoTimeListDetail = () => import('view/myFeed/infoTimeListDetail')// 包时段料列表详情
const buyRecord = () => import('view/myFeed/buyRecord') // 购买记录
// 我的个人中心
const MyProfit = () => import('view/myProfit/index') // 我的收益
const UserList = () => import('view/myProfit/userList') // 用户列表（粉丝或商户）
const UserHome = () => import('view/myProfit/userHome') // 用户列表（粉丝或商户）
const Setting = () => import('view/myProfit/setting') // 设置
const Help = () => import('view/myProfit/help') // 常见问题
const SetPsd = () => import('view/myProfit/setPsd') // 忘记密码
const UpdatePsd = () => import('view/myProfit/updatePsd') // 提现密码
const DrawCash = () => import('view/myProfit/drawCash') // 新提现
const DrawcashRecord = () => import('view/myProfit/drawcashRecord') // 提现记录
const IncomeDetail = () => import('view/myProfit/incomeDetail') // 账单明细
const DrawcashState = () => import('view/myProfit/drawcashState') // 提现结果
const News = () => import('view/myProfit/NewsList') // 消息分类
const NewsDetail = () => import('view/myProfit/NewsDetail') // 消息单个分类列表
const UpdateHelp = () => import('view/myProfit/updateVersionHelp.vue') // 更新帮助

// 料集市
// const Market = () => import('view/feedMarket/index')          // 料集市首页
// const MarketSearch = ()=> import('view/feedMarket/search')  //调查页面

// 订阅
const SetSub = () => import('view/myProfit/setSub') // 订阅设置页面

const Blocked = () => import('view/newFeed/blocked') // 被封禁页面
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/myInfo',
      name: '我的料',
      component: MyFeed,
      redirect: '/'
    },
    // {
    //   path:"*",
    //   redirect:'/'
    // },
    {
      path: '/',
      name: '新建料',
      component: NewFeed,
      meta: {
        keepAlive: true
      }
    },

    {
      path: '/personal',
      name: '我的收益',
      component: MyProfit,
      redirect: '/'
    },
    {
      path: '/userlist',
      name: '用户列表',
      component: UserList,
      redirect: '/'
    },
    {
      path: '/userhome',
      name: '用户主页',
      component: UserHome,
      redirect: '/'
    },
    {
      path: '/setting',
      name: '设置',
      component: Setting,
      redirect: '/'
    },
    {
      path: '/help',
      name: '常见问题',
      component: Help,
      redirect: '/'
    },
    {
      path: '/setPsd',
      name: '忘记密码',
      component: SetPsd,
      redirect: '/'
    },
    {
      path: '/updatePsd',
      name: '提现密码',
      component: UpdatePsd,
      redirect: '/'
    },
    {
      path: '/drawCash',
      name: '提现',
      component: DrawCash,
      redirect: '/'
    },
    {
      path: '/record',
      name: '提现记录',
      component: DrawcashRecord,
      redirect: '/'
    },
    {
      path: '/incomeDetail',
      name: '账单明细',
      component: IncomeDetail,
      redirect: '/'
    },
    {
      path: '/result',
      name: '提现结果',
      component: DrawcashState,
      redirect: '/'
    },
    {
      path: '/newposter',
      name: '新建海报',
      redirect: '/',

      component: newPoster
    },
    {
      path: '/works-poster',
      name: '海报',
      component: worksPoster,
      redirect: '/'
    },
    {
      path: '/complain',
      name: '投诉',
      component: complain,
      redirect: '/'
    },
    {
      path: '/info-detail',
      name: '详情',
      component: infoDetail,
      redirect: '/'
    },
    {
      path: '/info-time-list',
      name: '详情2',
      component: infoDetail,
      redirect: '/'
    },
    {
      path: '/info-time-list-detail',
      name: '包时段详情',
      component: infoTimeListDetail,
      redirect: '/'
    },
    {
      path: '/buy-record',
      name: '购买记录',
      component: buyRecord,
      redirect: '/'
    },
    {
      path: '/news',
      name: '消息中心',
      component: News,
      redirect: '/'

    },
    {
      path: '/news-detail',
      name: '消息详情',
      component: NewsDetail,
      redirect: '/'
    },
    {
      path: '/update-help',
      name: '更新帮助',
      component: UpdateHelp,
      redirect: '/'
    },

    {
      path: '/setSub',
      name: '订阅设置',
      component: SetSub,
      redirect: '/'
    },
    {
      path: '/blocked',
      name: '被封禁',
      component: Blocked,
      redirect: '/'
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
