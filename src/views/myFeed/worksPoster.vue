<template>
  <div class="all">
    <div class="shade" v-if="reviewStatus=='0'"></div>
      <div class="wrapper">
        <div class="qrcode" style="display:none"></div>
        <div class="bg-img">
            <img :src="poster[posterType-1]" alt="">
        </div> 
        <div class="poster-img">
            <p class="tip">长按图片保存并分享</p>  
            <div class="poster-img-container">
              <img src="" alt="" class="poster">
                <div class="censor-cont" v-if="reviewStatus=='0'"> 
                  <p>你的料正在审核中，完成后将收到服务通知，即可保存海报。<br/>若有疑问请添加客服微信：renrenyouliao888</p> 
                  <div class="btn">
                    <button class="close-censor" @click="backPrePage()">关闭</button>
                  </div>
                </div>
            </div>
        </div>
        <div class="handel-area flex-wrap top">
            <div class="handel-item" @click="noticeFans(1)" v-if="period==1">
                <i class="iconfont">&#xe698;</i>
                <p>{{noticeTimes=='0'?'通知粉丝':`再次通知 · 已通知${noticeTimes}次`}}</p>
            </div>
            <div class="handel-item" @click="messagePushed=='0'?noticeFans(0):''" v-if="period=='0'">
                <i class="iconfont">&#xe698;</i>
                <p>{{messagePushed=='0'?'通知粉丝':`已通知过粉丝`}}</p>
            </div>
            <div class="handel-item" @click="changeOpen(isPublic)" :class="isFree?'disabled':''">
                <i class="iconfont" v-if="isPublic!=1">&#xe6d9;</i>
                <i class="iconfont" v-else>&#xe6da;</i>
                <p>{{isPublic==1?'已公开':'一键公开'}}</p>
            </div>
            <div class="handel-item" @click='navToBuyRecord'>
                <i class="iconfont">&#xe68c;</i>
                <p>收益明细</p>
            </div>
        </div>
        <div class="handel-area flex-wrap btm">
            <div class="handel-item" @click="openDetail()">
                <i class="iconfont">&#xe697;</i>
                <p>查看详情</p>
            </div>
            <div class="handel-item" @click='updateInfo()'>
                <i class="iconfont">&#xe6db;</i>
                <p>更新</p>
            </div>
            <div class="handel-item" @click='deleteInfo()' :class="sellCount!=0?'disabled':''">
                <i class="iconfont">&#xe6a9;</i>
                <p>删除</p>
            </div>
        </div>
    </div>
    
  </div>
</template>
<script>
import { api } from "api/myFeed";
import { detail} from "api/qrcodeUrl.js";
import { canvas } from "api/canvas/index.js";
import { Indicator, Toast, MessageBox } from "mint-ui";
export default {
  data() {
    return {
      poster: [  require("../../../static/img/poster_bg_yellow.png"), //postertype:1
        require("../../../static/img/poster_bg_img_basketball.png"), //postertype:2
        require("../../../static/img/poster_bg_img_game.png"), // posterType:3
        require("../../../static/img/poster_bg_img_stadium.png"), //postertype:4
        require("../../../static/img/poster_bg_1111.png")], //postertype:5],
      id: "",
      period: 0,
      // 价格
      price: "",
      // 标题
      title: "",
      // 付费图
      cover: "",
      // 卖家
      user: {},
      freeT: "",
      // 付费部分
      buyT: "",
      // 通知粉丝次数  包时段有效
      noticeTimes: 0,
      // 是否已通知  单卖有效
      messagePushed: 1,
      // 包时间段天数
      periodDays: 0,
      // 料的背景类型
      posterType: 0,
    //   是否免费类型   0不免费   1免费
      isFree:0,
      // 是否公开
      isPublic: 0,
      // 销量
      sellCount:0,
      // 是否是审核中 0审核中  1支正常 -1下架
      reviewStatus: 1
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getPoster(this.id);
  },
  methods: {
    // 生成二维码
    createQrCode(period) {
      $(".qrcode").qrcode({
        render: "canvas", //也可以替换为table
        width: 100,
        height: 100,
        text: `${detail()}?id=${this.id}&qrCode=1`
      });
    },

    // 创建canvas 画布
    async createCanvas(userImg, cover, type, bg) {
      Indicator.open("生成海报中...");
      let can = document.createElement("canvas");
      let ctx = can.getContext("2d");
      can.width = 750;
      can.height = 1000;
      let res = await canvas({
        canObj: can,
        qrCode: $(".qrcode canvas")
          .get(0)
          .toDataURL("image/png"),
        title: this.title,
        price: this.price / 100,
        freeT: this.freeT,
        buyT: this.buyT,
        buyImg: cover,
        ty: type,
        userName: this.user.nickname,
        userImg: userImg,
        bg: bg
      });
      const poster = $("img.poster").get(0);
      poster.crossOrigin = "anonymous";
      poster.src = res;
      Indicator.close();
    },
     /***
     * 获取海报
     */
    async getPoster(id) {
      Indicator.open("加载中");
      try {
        var res = await api.writingPoster({
          id: id
        });
        if (res.code == 200) {
          let {
            cover,
            user,
            period,
            prefix,
            noticeTimes,
            isPublic,
            revenue,
            freePart,
            payPart,
            price,
            title,
            periodDays,
            posterType,
            isFree,
            sellCount,
            messagePushed,
            reviewStatus
          } = res.result;
          this.money = revenue;
          this.period = period;
          this.noticeTimes = noticeTimes;
          this.price = price;
          this.title = title;
          this.freeT = freePart || "";
          this.cover = cover;
          this.user = user;
          this.periodDays = periodDays;
          this.messagePushed = messagePushed;
          this.buyT = payPart;
          this.posterType = posterType;
          this.isPublic = isPublic;
          this.isFree = isFree;
          this.sellCount =sellCount;
          this.reviewStatus = reviewStatus;
          Indicator.close();

          this.createQrCode(period);

          if (isFree == 1) {
            prefix = "免费";
          } else {
            prefix = prefix ? prefix.substring(1, prefix.length - 1) : "";
          }

          this.getBase64(user.headImgUrl, prefix, posterType);
        } else {
          Indicator.close();
        }
      } catch (e) {
        Indicator.close();
      }
    },
    /*
        * 将头像转换base64
        */
    getBase64(imgUrl, prefix, posterType) {
      let that = this;
      that.createCanvas("base64", that.cover, prefix, posterType);
      window.URL = window.URL || window.webkitURL;
      var xhr = new XMLHttpRequest();
      xhr.open("get", imgUrl, true);
      // 至关重要
      xhr.responseType = "blob";
      xhr.onload = function() {
        if (this.status == 200) {
          //得到一个blob对象
          var blob = this.response;
          let oFileReader = new FileReader();
          oFileReader.onloadend = function(e) {
            let base64 = e.target.result;
            setTimeout(() => {
              that.createCanvas(base64, that.cover, prefix, posterType);
            }, 100);
          };
          oFileReader.readAsDataURL(blob);
        }
      };
      xhr.send();
    },
    /**
     * 点击知识更新
     */
    updateInfo() {
      MessageBox.alert('追加更新功能已停止使用')
      return;
      this.$router.replace({
        path: `/`,
        query: {
          updateId: this.id,
          updateTitle: this.title,
          updatePrice: this.price,
          updataDay: this.periodDays,
          period: this.period
        }
      });
    },

    /**
     * 通知粉丝
     */
    noticeFans(t) {
      Indicator.open();
      api
        .notifyFans({ id: this.id })
        .then(res => {
          Indicator.close();
          if (res.data.code == 200) {
            if (t === 1) {
              Toast("通知粉丝成功");
              this.noticeTimes++;
            } else {
              Toast("通知粉丝成功");
              this.messagePushed = 1;
            }
          } else {
            Toast(res.data.message);
          }
        })
        .catch(() => {
          Indicator.close();
        });
    },
  // 返回上一页
    backPrePage(){
      this.$router.go(-1)
    },
    /**
     * 打开海报详情，
     */
    openDetail() {
      this.$router.push({
        path: `/info-detail`,
        query: { id: this.id }
      });
    },
    // 删除料
    deleteInfo() {
      if(this.sellCount!=0){
        Toast('该料已售出,不能删除');
        return;
      }
      MessageBox({
        title: "删除提醒",
        message: "确定删除此条信息吗",
        confirmButtonHighlight: "#ff0b04",
        showCancelButton: true
      }).then(action => {
        if (action == "cancel") return;
        api
          .del({
            id: this.id
          })
          .then(res => {
            if (res.code == 200) {
              Toast({
                message: "删除成功"
              });
              setTimeout(() => {
                this.$router.go(-1);
              }, 1000);
            } else {
              Toast({
                message: "删除失败"
              });
            }
          });
      });
    },
    /**
     * 跳转到购买记录
     */
    navToBuyRecord() {
      this.$router.push({
        path: `/buy-record`,
        query: { id: this.id, money: this.money }
      });
    },

    /**
     * 切换一键公开
     */
    async changeOpen(t) {
      if(this.isFree == 1){
          Toast('该料免费，不需要此操作');
          return;
      }
      Indicator.open();
      try {
        let res = await api.openFeed({ id: this.id, idPublic: t == 1 ? 0 : 1 });
        Indicator.close();
        if (res.data.code == 200) {
            Toast(`${t==1?'已关闭公开':'已公开料'}`)
            this.isPublic = res.data.result;
        }
      } catch (e) {
        Indicator.close();
      }
    }
  },

  beforeDestroy(t) {
    Indicator.close();
  }
};
</script>
<style lang="scss" scoped>

.shade{
  width:100%;
  height: 100vh;
  background: rgba(0,0,0,0.7);
  position: fixed;
  z-index:10;
}
.bg-img {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  overflow: hidden;
  img {
    display: block;
    object-fit: cover;
    width: 140%;
    filter: blur(20px);
    transform: scale(1.5);
    min-height: 100vh;
  }
}
.poster-img {
  text-align: center;
  position: relative; 
  padding: 60px 60px 0;
  margin-bottom: 60px;
  .tip {
    margin-bottom: 20px;
    @include fontStyle(40px, 26px, #fff);
    opacity: 0.7;
  }
  img {
    width: 100%;
    height: 840px;
    border: 4px solid rgba(255, 255, 255, 1);
    border-radius: 8px;
    box-shadow: 0 40px 80px 0 rgba(0, 0, 0, 0.1);
  }
}
.handel-area {
  text-align: center;
  position: relative;
  z-index: 1;
  padding: 0 60px;
  margin-top: 40px;
  &.btm {
    opacity: 0.8;
  }
  &.top {
    p {
      font-weight: bold;
    }
  }
  .handel-item {
    width: calc(100% / 3);
    box-sizing: border-box;
    font-size: 28px;
    padding: 16px 0;
    &.disabled{
        opacity: 0.4;
        font-weight: normal;
    }
    i {
      font-size: 46px;
      color: #fff;
    }
    p {
      @include fontStyle(40px, 28px, #fff);
      margin-top: 16px;
    }
  }
}
.poster-img-container{ 
   .censor-cont{
      background: #fff;
      border-radius: 8px;
      color:#555;
      font-weight: 500;
      position:absolute;
      width:600px;
      height:300px;
      top:640px;
      left:75px;
      padding:30px;
      box-sizing: border-box;
      z-index:13;
      p{
        @include fontStyle(40px ,30px ,#555);
        text-align: left;
      }
      .btn{
        text-align: right;
        margin-top:10px;
        button{
          color: #fff;
          background: #F34434;
          border-radius: 8px;
          height:72px;
          width: 144px;
          margin-top: 20px;
          border: none;
          font-size: 28px;
        }
      }
      
   }
   
  }
</style>
