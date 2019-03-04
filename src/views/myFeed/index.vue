<template>
  <div class="wrapper">
    <v-noticebar @showbar="showNoticeBar"></v-noticebar>
    <!-- 放料入口 -->
    <div class="tada" @click="inportShow=true">
      <img :src="require('../../assets/img/liao_trailer.png')" alt>
    </div>
    <div class="qr-code-modal" v-show="inportShow">
      <div class="content">
        <h2>放料入口</h2>
        <p>长按识别二维码关注，一手好料不错过</p>
        <div class="img">
          <img :src="require('../../assets/img/qr_code.jpg')" alt>
        </div>
        <div class="btn" @click="inportShow=false">
          <button>确定</button>
        </div>
      </div>
    </div>
    <!-- 头部导航 -->
    <div class="nav flex-wrap" :class="isShowNoticeBar==1?'nav1':''">
      <div class="sell" :class="curTab=='sell'?'active':''" @click="changeTab('sell')">
        <p>
          <i class="iconfont">&#xe6a7;</i>
          <span>我卖的料</span>
          <sup>{{sellCount>99?'99+':sellCount}}</sup>
        </p>
        <div class="dot" v-show="curTab=='sell'">·</div>
      </div>
      <div class="buy" :class="curTab=='buy'?'active':''" @click="changeTab('buy')">
        <p>
          <i class="iconfont">&#xe695;</i>
          <span>我买的料</span>
          <sup>{{buyCount>99?'99+':buyCount}}</sup>
        </p>
        <div class="dot" v-show="curTab=='buy'">·</div>
      </div>
    </div>
    <!-- 我卖的料 -->
    <div
      class="group sell"
      :class="isShowNoticeBar==1?'group1':''"
      v-show="curTab=='sell'"
      v-infinite-scroll="getSell"
      infinite-scroll-disabled="disloadingSell"
      infinite-scroll-distance="10"
    >
      <template v-for="(item,index) in sellInfo" v-key="index">
        <div class="item-all">
          <!-- 违规遮罩层 -->
          <div class="item-mask" v-if="item.reviewStatus == -1">
            <div>
              <p class="item-title">已下架</p>
              <p class="item-con">资料异常，暂被下架，请联系客服</p>
              <p class="item-con">微信: renrenyouliao888</p>
            </div>
          </div>
          <div class="item" @click="openPoster(item.period,item.id)" :key="index">
            <div class="content">
              <div class="time-state flex-wrap">
                <span>{{item.updateDate}}</span>
                <p>
                  <span v-if="item.isFree!=1">{{item.prefix}}</span>
                  <span v-if="item.isFree==1">免费</span>
                  <span v-if="item.timeLimit==1">
                    <i class="iconfont">&#xe694;</i>
                    {{item.isEnd==1?'已过期':'未过期'}}
                  </span>
                  <span v-if="item.reviewStatus==0">
                    <i class="iconfont">&#xe694;</i>
                    未开放
                  </span>
                  <span v-if="item.isPublic==1">
                    <i class="iconfont">&#xe68e;</i>
                    <i>{{item.price/100}} 元</i>
                  </span>
                </p>
              </div>
              <!-- 新加分销 tip 和分享赚 -->
              <div class="title-price flex-wrap">
                <h2>
                  <span v-if="item.isDistribution==1" class="share-tip">分销</span>
                  {{item.title}}
                </h2>
                <span v-if="item.isPublic!=1">
                  <i class="iconfont">&#xe6a6;</i>
                  {{item.price/100}}
                </span>
                <span v-if="item.isPublic==1" class="open-tip">已公开</span>
                <!-- <button v-if="item.distributionLevel==2" class="share-btn">分享赚</button> -->
              </div>
              <p class="xiline"></p>
              <div class="count flex-wrap">
                <div class="read-num">
                  <p class="_title">浏览</p>
                  <p class="_cont">{{item.readTimes}}</p>
                </div>
                <span></span>
                <div class="read-num">
                  <p class="_title">已售</p>
                  <p class="_cont">{{item.sellCount}}</p>
                </div>
                <span></span>
                <div class="read-num">
                  <p class="_title">收益总额 · 元</p>
                  <p class="_cont red">{{item.revenue/100}}</p>
                </div>
              </div>
            </div>
            <div class="give-back-btn flex-wrap" v-show="item.moneyBack==1">
              <button @click.stop="isTk(item,index,0)" v-if="item.handleMoneyBack=='0'">不中退款</button>
              <button
                class="confirm"
                @click.stop="isTk(item,index,1)"
                v-if="item.handleMoneyBack=='0'"
              >中了收款</button>
              <p class="judge" v-if="item.handleMoneyBack==1">
                判定为：
                <span style="color:#ff0b04">不中</span>
              </p>
              <p class="judge" v-if="item.handleMoneyBack==2">
                判定为：
                <span style="color:#ff0b04">中了</span>
              </p>
            </div>
          </div>
        </div>
      </template>

      <!-- 卖的料为空 -->
      <div class="nodata-init-sale" v-if="initSellNodata">
        <img :src="require('../../assets/img/init_nodata.png')">
        <div>你还没有料，快去新建料吧！</div>
      </div>
    </div>

    <!-- 我买的料 -->
    <div
      class="group buy"
      :class="isShowNoticeBar==1?'group1':''"
      v-show="curTab=='buy'"
      v-infinite-scroll="getBuy"
      infinite-scroll-disabled="disloadingBuy"
      infinite-scroll-distance="10"
    >
      <!-- <p class="tip">待更新的料</p> -->
      <template v-for="(item,index) in buyInfo" v-key="index">
        <div class="item-all">
          <div class="item-mask" v-if="item.reviewStatus == -1">
            <div>
              <p class="item-title">已下架</p>
              <p class="item-con">资料异常，暂被下架，请联系客服</p>
              <p class="item-con">微信: renrenyouliao888</p>
            </div>
          </div>
          <div class="item" @click="openDetail(item.period,item.id)">
            <div class="head flex-wrap">
              <div class="headimg">
                <img :src="item.user.headImgUrl" alt>
              </div>
              <p class="user-name">{{item.user.nickname}}</p>
              <p class="update-date">{{item.updateDate}}</p>
            </div>
            <div class="cont flex-wrap">
              <!-- 新增分销 -->
              <div class="title-desc">
                <h2 class="flex-wrap">
                  <i v-if="item.isNew==1"></i>
                  <span class="sub-tip" v-if="item.type==3" >订阅</span>
                  <span class="title" :class="item.isNew==1?'new':''">{{item.title}}</span>
                </h2>
                <p v-if="item.period==1">
                  <i class="iconfont">&#xe691;</i>
                  {{item.remainDays>0?`剩余 ${item.remainDays} 天到期`:'已到期'}}
                </p>
                <p class="tk-tag" v-if="item.moneyBack==1 && item.type!=3"> 
                  <span>{{item.handleMoneyBack==0?"卖家尚未判定":item.handleMoneyBack==1?"卖家已退款":"卖家已收款"}}</span>
                  <span>{{item.refund/100==0?'':`· ${item.refund/100}元`}}</span>
                </p>
                <!-- <p
                  class="tk-tag"
                  v-if="item.moneyBack==1"
                >{{item.handleMoneyBack==0?"卖家尚未判定":item.handleMoneyBack==1?`卖家已退款 · ${item.refund/100}元`:`卖家已收款 · ${item.refund/100}元`}}</p> -->
              </div>
              <div class="cover" v-if="item.imgUrl!=''&&item.imgUrl">
                <img :src="item.imgUrl" alt>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 买的料为空 -->
      <div class="nodata-init-buy" v-if="initBuyNodata">
        <img src="../../assets/img/init_nodata.png">
        <div>你还未购买过任何料！</div>
      </div>
    </div>

    <v-footer></v-footer>
    <v-loadmore v-show="isloading"></v-loadmore>
  </div>
</template>
<script>
import { InfiniteScroll, MessageBox, Indicator } from "mint-ui";
import LoadMore from "@/components/loading.vue";
import { api } from "api/myFeed";
import Footer from "com/footer";
import noticeBar from "@/components/noticeBar.vue";
export default {
  components: {
    "v-loadmore": LoadMore,
    "v-footer": Footer,
    "v-noticebar": noticeBar
  },
  data() {
    return {
      // 维护通告 0 不显示 1显示
      isShowNoticeBar: 0,
      // 放料入口公众号的模态框是否显示
      inportShow: false,
      // 显示加载loading
      isloading: true,
      // 当前tab页
      curTab: "sell",
      // 是否禁止上拉加载
      disloadingSell: false,
      disloadingBuy: false,
      // 初次加载是否没有数据
      initSellNodata: false,
      initBuyNodata: false,
      // 我卖的料
      sellInfo: [],
      // 我买的料
      buyInfo: [],
      // 卖的料的页码
      sellPage: 1,
      // 买的料的页码
      buyPage: 1,
      // 点击我买的料的次数
      clickBuyTab: 1,
      // 卖的料数量
      sellCount: 0,
      // 买的料数量
      buyCount: 0
    };
  },
  mounted() {},
  methods: {
    // 监听是否显示维护公告
    showNoticeBar(val) {
      this.isShowNoticeBar = val;
    },
    // 改变tab页
    changeTab(tab) {
      this.curTab = tab;
      if (tab == "buy" && this.clickBuyTab == 1) {
        this.getBuy();
        this.clickBuyTab++;
      }
    },
    // 获取我卖的料
    getSell() {
      if (this.curTab != "sell") return;
      this.disloadingSell = true;
      this.isloading = true;
      api
        .sellOff({
          pageSize: 10,
          pageNum: this.sellPage
        })
        .then(res => {
          if (res.code == 200) {
            this.sellCount = res.result.sellTopicCount;
            this.buyCount = res.result.boughtTopicCount;
            let list = res.result.topicList;
            this.sellInfo = [...this.sellInfo, ...list];
            if (list.length == 0 && this.sellPage == 1) {
              this.initSellNodata = true;
            }

            if (list.length < 10) {
              this.isloading = false;
            }

            if (list.length == 10) {
              this.sellPage++;
              this.disloadingSell = false;
            }
          }
        });
    },
    //获取已买的料
    getBuy() {
      if (this.curTab != "buy") return;
      this.disloadingBuy = true;
      this.isloading = true;
      api
        .getted({
          pageSize: 10,
          pageNum: this.buyPage
        })
        .then(res => {
          if (res.code == 200) {
            let list = res.result.topicList;
            this.buyInfo = [...this.buyInfo, ...list];
            this.sellCount = res.result.sellTopicCount;
            this.buyCount = res.result.boughtTopicCount;
            if (list.length == 0 && this.buyPage == 1) {
              this.initBuyNodata = true;
            }

            if (list.length < 10) {
              this.isloading = false;
            }

            if (list.length == 10) {
              this.buyPage++;
              this.disloadingBuy = false;
            }
          }
        });
    },
    // 不中退款或者收款

    isTk(item, index, t) {
      let id = item.id;
      MessageBox({
        title: "提示",
        message: t == "1" ? "确定该料为中了收款吗？" : "确定该料为不中退款吗?",
        confirmButtonHighlight: "#ff0b04",
        showCancelButton: true
      }).then(action => {
        if (action == "cancel") return;
        Indicator.open();
        api
          .moneyGet({
            id: id,
            guess: t
          })
          .then(res => {
            Indicator.close();
            if (res.code == 200) {
              let sellArr = this.sellInfo;
              sellArr[index].handleMoneyBack =
                t == "0" ? "1" : t == "1" ? "2" : "0";
              this.sellInfo = sellArr;
            }
          });
      });
    },

    // 打开料的海报页面
    openPoster(type, id) {
      this.$router.push({
        path: "/works-poster",
        query: { id: id }
      });
    },
    // 打开详情
    openDetail(type, id) {
      this.$router.push({
        path: "/info-detail",
        query: { id: id }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 140px 0 130px;
}
.tada {
  position: fixed;
  right: 0;
  bottom: 140px;
  width: 170px;
  animation-duration: 1s;
  animation-iteration-count: 3;
  img {
    width: 100%;
  }
  z-index:300;
}
.qr-code-modal {
  top: 0;
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: 500;
  background-color: rgba(0, 0, 0, 0.6);
  .content {
    background: #fff;
    border-radius: 8px;
    padding: 48px;
    text-align: center;
    width: 550px;
    left: 50px;
    top: 150px;
    position: absolute;
    h2 {
      color: #333;
      font-weight: bold;
      font-size: 30px;
      line-height: 42px;
    }
    p {
      line-height: 50px;
      font-size: 28px;
      color: #666;
      margin: 16px 0 0;
    }
    img {
      width: 100%;
    }
    .btn {
      margin-top: 30px;
      text-align: right;
      button {
        width: 144px;
        height: 72px;
        color: #fff;
        font-size: 28px;
        background-color: #f34434;
        border-radius: 8px;
      }
    }
  }
}
.nav {
  justify-content: space-around;
  text-align: center;
  background: #fff;
  font-size: 28px;
  padding: 40px 0 0;
  line-height: 1;
  color: #999;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 10;
  & > div {
    position: relative;
    width: 50%;
  }
  .active {
    color: #333;
    font-weight: bold;
  }
  i {
    font-size: 30px;
  }
  sup {
    font-size: 24px;
    position: absolute;
    left: 264px;
    top: -8px;
  }
  .dot {
    margin-top: 10px;
    font-weight: bold;
    font-size: 32px;
  }
  &.nav1 {
    top: 82px;
  }
}

.group {
  padding: 0 20px;
  .item {
    background: #fff;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
  }
  &.group1 {
    padding-top: 82px;
  }
  .item-all {
    position: relative;
    .item-mask {
      width: 100%;
      height: 100%;
      background-color: #fff;
      z-index: 2;
      position: absolute;
      opacity: 0.96;
      text-align: center;
      border-radius: 8px;
      padding-top:40px;
      box-sizing: border-box;
      .item-title { 
        font-size: 30px;
        color: #333;
      }
      .item-con {
        color: #999;
        font-size: 26px;
        padding-top: 20px;
      }
    }
  }
}
.sell .item {
  .content {
    padding: 34px 40px;
    .time-state {
      justify-content: space-between;
      font-size: 24px;
      color: #999;
      align-items: center;
      i {
        font-size: 26px;
      }
    }
    .title-price {
      justify-content: space-between;
      align-items: center;
      color: #333;
      font-size: 28px;
      font-weight: bold;
      h2 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        margin-right: 20px;
        line-height: 54px;
        font-size: 32px;
        .share-tip {
          color: #fff;
          display: inline-block;
          background: #f88629;
          border-radius: 6px;
          font-size: 24px;
          position: relative;
          top: -4px;
          width: 70px;
          height: 36px;
          text-align: center;
          line-height: 45px;
          margin-right: 10px;
        }
      }
      .share-btn {
        width: 120px;
        height: 62px;
        border-radius: 8px;
        color: #fff;
        background: #f34434;
        font-size: 28px;
      }
      margin: 16px 0 20px;
      & > span {
        color: #666;
        font-size: 40px;
        i {
          font-size: 32px;
        }
        &.open-tip {
          @include fontStyle(42px, 30px, #666);
          font-weight: normal;
        }
      }
    }
    .count {
      justify-content: space-around;
      text-align: center;
      padding-top: 34px;
      align-items: center;
      span {
        height: 40px;
        width: 1px;
        border-left: 1px solid rgba(0, 0, 0, 0.08);
      }
      ._title {
        color: #999;
        font-size: 24px;
        margin-bottom: 10px;
      }
      ._cont {
        font-size: 40px;
        color: #333;
        font-weight: bold;
      }
      .red {
        color: #f34434;
      }
    }
  }
  .give-back-btn {
    justify-content: flex-end;
    align-items: center;
    padding: 0 40px 30px;
    button {
      background: #fff;
      height: 72px;
      width: 176px;
      color: #666;
      font-size: 26px;
      border: 0.5px solid rgba(51, 51, 51, 0.12);
      margin-left: 20px;
      border-radius: 8px;
    }
    button.dis {
      color: rgba(51, 51, 51, 0.4);
    }
    button.confirm {
      color: #fff;
      background: #f34434;
      font-weight: bold;
    }
    .judge {
      font-size: 24px;
    }
  }
}
.buy p.tip {
  padding: 30px 0;
  color: #999;
  font-size: 24px;
}
.buy .item {
  padding: 30px 40px;
  position: relative;
  .item-mask {
    width: 100%;
    height: 100%;
    background-color: #fff;
    z-index: 999;
    position: absolute;
    opacity: 0.96;
    text-align: center;
    border-radius: 8px;
    .item-title {
      margin-top: 18%;
      font-size: 30px;
      color: #333;
    }
    .item-con {
      color: #999;
      font-size: 26px;
      padding-top: 20px;
    }
  }
  .head {
    justify-content: space-between;
    color: #999;
    font-size: 24px;
    align-items: center;
    line-height: 34px;
    .headimg {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    .user-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0 20px;
    }
  }
  .cont {
    justify-content: space-between;
    margin-top: 20px;
    .cover {
      width: 88px;
      height: 88px;
      border-radius: 8px;
      overflow: hidden;
      margin-left: 20px;
      img {
        min-width: 100%;
        max-height: 100%;
      }
    }
    .title-desc {
      flex: 1;
      overflow: hidden;
      h2 {
        font-size: 32px;
        color: #333;
        font-weight: bold;
        line-height: 54px;
        // align-items: center;
        vertical-align: middle;
        i {
          background-color: #f34434;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .share-tip {
          color: #fff;
          display: inline-block;
          background: #f88629;
          border-radius: 6px;
          font-size: 24px;
          position: relative;
          top: -4px;
          width: 70px;
          height: 36px;
          text-align: center;
          line-height: 45px;
          margin-right: 10px;
        }
        .title {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          flex: 1;
          color: #666;
          &.new {
            color: #333;
          }
        }
      }
      p {
        color: #999;
        font-size: 24px;
        margin-top: 10px;
        line-height: 34px;
        i {
          font-size: 24px;
          margin-right: 10px;
        }
      }
      .tk-tag {
        color: #f34434;
        font-weight: bold;
      }
      .sub-tip{
        color: #666;
        font-size: 24px;
        height: 40px;
        padding: 0 10px;
        margin-right: 10px;
        border-radius: 6px;
        border: 1px solid rgba(51, 51, 51, 0.12);
        text-align: center;
        // line-height: 47px;
        font-weight: normal;
      }
    }
  }
}

.nodata-init-buy,
.nodata-init-sale {
  font-size: 30px;
  color: #999;
  text-align: center;
}

.nodata-init-buy img,
.nodata-init-sale img {
  width: 570px;
  height: 330px;
  margin-top: 200px;
}
</style>
