<template>
  <div class="recordBox">
    <mt-loadmore :bottom-method="loadBottom" bottomPullText="" :auto-fill="false" ref="loadmore">
      <div>
        <div class="list-item flex-wrap" v-for="(item,index) in recordList" :key="index">
          <div class="flex-l">
            <div class="left-title" v-if="!item.cashBalance">{{item.title}}</div>
            <div class="left-title" v-if="item.cashBalance&&item.cashBalance.state=='0'">提现 <span>(审核中) </span></div>
            <div class="left-title" v-if="item.cashBalance&&item.cashBalance.state=='1'">提现 <span>(审核中)</span> </div>
            <div class="left-title" v-if="item.cashBalance&&item.cashBalance.state=='2'">提现完成</div>
            <div class="left-title" v-if="item.cashBalance&&item.cashBalance.state=='-1'"><span>提现失败（请联系客服）</span></div>
            <div class="left-title" v-if="item.cashBalance&&item.cashBalance.state=='-2'"> <span>提现失败（请联系客服）</span></div>
            <div class="left-time" v-if="!item.cashBalance">{{item.createDate}}</div>
            <div class="left-time" v-if="item.cashBalance">{{item.cashBalance.updateDate}}</div>
          </div>
          <div class="flex-r gray" v-if="item.sign=='-'">{{item.sign}}{{item.balanceAmount / 100}}元</div>
          <div class="flex-r" v-if="item.sign=='+'">{{item.sign}}{{item.balanceAmount / 100}}元</div>
        </div>
      </div>
    </mt-loadmore>
    <div class="nodata-init" v-if="!showRecord">
      <img src="../../assets/img/not_money.png" alt="">
      <div>你还没有收益，快去新建料吧！</div>
    </div>
    <!--<div class="nodata-scroll" v-show="!scrollNodata">没有更多啦！</div>-->
  </div>
</template>

<script>
  import {incomeBalance} from 'api/myProfit'
  import {Indicator, Loadmore} from 'mint-ui'

  export default {
    data () {
      return {
        recordState: {'-2': '提现未完成', '-1': '审核不通过', '2': '提现完成'},
        recordList: [],     //明细列表
        showRecord: true,  //是否有明细记录
        scrollNodata: true,
        params: {
          pageSize: 15,
          pageNum: 1
        }
      }
    },
    created () {
      Indicator.open({spinnerType: 'fading-circle'})
      incomeBalance(this.params).then(res => {
        const data = res.data
        Indicator.close()
        if (Number(data.code) === 200 && data.result.length !== 0) {
          this.showRecord = true
          this.recordList = data.result;
        } else {
          this.showRecord = false
        }
      }).catch(res => {
        Indicator.close()
        this.showRecord = false
      })
    },
    methods: {
      loadBottom: function () {    //上拉加载
        this.params.pageNum++
        incomeBalance(this.params).then(res => {
          this.recordList = [...this.recordList, ...res.data.result]
          this.$refs.loadmore.onBottomLoaded()
        }).catch(res => {
          this.$refs.loadmore.onBottomLoaded()
        })
      }
    },
    destroyed () {
      Indicator.close()
    }
  }

</script>

<style scoped>

  .recordBox {
    padding-top: 20px;
  }

  .list-item {
    padding: 30px 40px;
    color: #333;
    font-size: 28px;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-bottom:1px solid rgba(0,0,0,0.04);
  }

  .list-item .flex-l .left-time {
    color: #999;
    font-size: 24px;
    margin-top: 20px;
  }

  .list-item .flex-l .left-title span {
    color: #ff0b04;
  }
  .list-item .flex-l .warnTitle{
    color: #ff0b04;
  }
  .list-item .flex-r{
    color: #ff0b04;
    font-weight: bold;
  }
  .list-item .flex-r.gray{
    color:#666;
  }
  .nodata-init {
    text-align: center;
    font-size: 30px;
    color: #999;
    padding-top: 200px;
  }

  .nodata-init img {
    width: 570px;
    height: 330px;
  }

  .nodata-scroll {
    text-align: center;
    line-height: 80px;
    color: #888;
    font-size: 26px;
  }
</style>
