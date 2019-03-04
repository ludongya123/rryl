<template>
  <div class="recordBox">
    <mt-loadmore :bottom-method="loadBottom" bottomPullText="" :auto-fill="false" ref="loadmore">
      <div class="list-item flex-wrap" v-for="(item,index) in recordList"
           :key="index" @click="goResult(item)">
        <div class="flex-l">
          <div class="title" v-if="item.state === 0 || item.state === 1">提现<span v-if="item.state==0">（审核中）</span><span v-if="item.state==1">（审核已通过）</span></div>
          <div class="title" :class="item.state !== 2 ? 'warnTitle' : ''"
               v-else-if="item.state !== 0 && item.state !== 1">{{recordState[item.state]}}
          </div>
          <div class="time">{{item.updateDate}}</div>
        </div>
        <div class="flex-r">-{{item.totalAmount / 100}}元</div>
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
  import {cashRecord} from 'api/myProfit'
  import {Indicator, Loadmore} from 'mint-ui'

  export default {
    data () {
      return {
        recordState: {'-2': '提现失败（请联系客服）', '-1': '提现失败（请联系客服）', '2': '提现成功','9':'提现处理中','-9':'提现异常'},
        recordList: [],     //提现列表
        showRecord: true,  //是否有提现记录
        scrollNodata: true,
        params: {
          pageSize: 15,
          pageNum: 1
        }
      }
    },
    created () {
      Indicator.open({spinnerType: 'fading-circle'})
      cashRecord(this.params).then(res => {
        const data = res.data
        Indicator.close()
        if (Number(data.code) === 200 && data.result.length !== 0) {
          this.showRecord = true
          this.recordList = data.result
        } else {
          this.showRecord = false
        }
      }).catch(res => {
        Indicator.close()
        this.showRecord = false
      })
    },
    methods: {
      goResult: function (obj) {      // 跳转到相应的提现结果
        if (obj.state !== 2) {
          this.$router.push({
            path: '/result',
            query: obj
          })
        }
      },
      loadBottom: function () {    //上拉加载
        this.params.pageNum++
        cashRecord(this.params).then(res => {
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

  .list-item .flex-l .time {
    color: #999;
    font-size: 24px;
    margin-top: 20px;
  }

  .list-item .flex-l .title span {
    color: #ff0b04;
  }

  .list-item .flex-l .warnTitle {
    color: #ff0b04;
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
