<template>
    <div>
      <div class="header ">
          <p class="header-title">收益总额 · 元</p>
          <p class="header-cash">{{sellMoney/100}}</p>
          <!-- <p class="xiline"></p>
          <p class="money">原收益  <span>100元</span>&nbsp;&nbsp;&nbsp;分销收益  <span>10元</span></p> -->
        </div>
        
        <div class="list-group">
          <div class="list-title">交易记录</div>
          <div class="xiline"></div>
          <template v-for="(item, index) in records" >
              <div class="list-item flex-wrap" :key="index">
                <img :src="item.headImgUrl">
                <div class="user">
                  <div class="username">{{item.nickname}}</div>
                  <div class="time">{{item.createDate}}</div>
                </div>
                <div class="flex-right">+{{item.totalAmount/100}}元</div>
              </div>
              <div class="xiline" :key="index"></div>
          </template>
          <div class="nodata" v-if="records.length==0">
            <img src="../../assets/img/init_nodata.png">
            <div>还没有购买记录!</div>
          </div>
        </div>
    </div>
</template>
<script>
  import Footer from 'com/footer'
  import axios from 'axios'
  import {api,Cell } from 'api/myFeed'
  import Mint from 'mint-ui';
  export default {
    data () {
      return {
        // 是否限时加载中
        isShowLoading:false,
        records:[],
        sellMoney:0,
        price:''
      }
    },

    methods: {
      /***
       * 购买记录
       * 
       */
        async getBuyRecord(id){
          Mint.Indicator.open({
            text: '加载中...'
          })
          var res = await api.buyRecord({
            "id": id
          })
          Mint.Indicator.close();
          this.records = res.result.boughtRecordList
        }
    },

    created () {
      this.sellMoney = this.$route.query.money
      this.getBuyRecord(this.$route.query.id)
      
    }
  }
</script>
<style lang="scss" scoped>

    .header {
      box-sizing: border-box;
      position: fixed;
      
      top: 0;
      left: 0;
      width: 100%;
      background-color: #fff;
      padding: 40px 40px 0;
      font-size: 24px;
      z-index: 10;
      height:295px;
      .header-title{
        color:#999;
        font-size: 24px;
        line-height: 34px;
        text-align: center;
      }
      .header-cash {
        color: #F34434;
        font-size: 88px;
        font-weight: bold;
        line-height: 140px;
        text-align: center;
      }
      .money{
        color:#999;
        text-align: center;
        padding: 30px 0;
        span{
          color:#666;
        }
      }
    }
    
    
    
    /* 记录*/
    
    .list-group {
      position: relative;
      top: 295px;
      color: #333;
      font-size: 28px;
     
    }
    
    .list-title {
      padding: 30px 40px ;
      background-color: #fff;
      color:#999;
    }
    
    .list-item {
      padding:  40px;
      background-color: #fff;
      align-items: center;
    }
    
    .list-item img{
      width:80px;
      height:80px;
      display: block;
      border-radius: 40px;
    }
    .list-item .user{
      flex:1;
      margin: 0 20px;
      overflow: hidden;
    }
    .list-item .user .username{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 40px;
    }
    .list-item .user .time{
      color:#999;
      font-size:24px;
      line-height: 40px;
    }
    
    .list-item .flex-right{
      color:#F34434;
      font-size:28px;
    }
    
    .nodata{
      text-align: center;
      font-size:30px;
      color:#999;
      padding-top:200px;
    }
    .nodata img{
      width:570px;
      height:330px;
    }
</style>