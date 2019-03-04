<template>
  <div class="wrapper">
    <div class="shade" v-if="reviewStatus=='0'"></div>
    <div class="page_placard">
      <!-- <p class="share-distribution-tip">
      推荐壕友，壕友消费就有佣金拿。月薪万元，轻松赚钱。
      </p>-->
      <div class="poster">
        <div class="qrcode" style="display:none"></div>
        <div class="poster-img">
            <div class="censor-cont" v-if="reviewStatus == 0"> 
              <p>你的料正在审核中，完成后将收到服务通知，即可保存海报。<br/>若有疑问请添加客服微信：renrenyouliao888</p> 
              <div class="btn">
                <button class="close-censor" @click="backPrePage()">关闭</button>
              </div>
            </div>
          <img src>
        </div>
        <p class="notice">长按图片保存并分享</p>
      </div>
      <div class="poster-options flex-wrap"> 
          <div :class="curPosterType==1?'active':''" @click="curPosterType!=1?createCanvas(userHeadBase64,cover,prefix,1):''">
            <img :src="require('../../assets/img/poster1.png')"  alt="">
          </div>
          <div :class="curPosterType==2?'active':''" @click="curPosterType!=2?createCanvas(userHeadBase64,cover,prefix,2):''">
            <img :src="require('../../assets/img/poster2.png')" alt="">
          </div>
          <div :class="curPosterType==3?'active':''" @click="curPosterType!=3?createCanvas(userHeadBase64,cover,prefix,3):''">
            <img :src="require('../../assets/img/poster3.png')" alt="">
          </div>
          <div :class="curPosterType==4?'active':''" @click="curPosterType!=4?createCanvas(userHeadBase64,cover,prefix,4):''">
            <img :src="require('../../assets/img/poster4.png')" alt="">
          </div>
      </div>
      <div class="btns" v-if="!isDistribution">
        <button
          class="default"
          @click="noticeFans(1)"
          v-if="period==1"
        >{{noticeTimes=='0'?'通知粉丝':`再次通知 · 已通知${noticeTimes}次`}}</button>
        <button
          class="default"
          @click="messagePushed=='0'?noticeFans(0):''"
          v-if="period=='0'"
        >{{messagePushed=='0'?'通知粉丝':`已通知过粉丝`}}</button>
        <button class="active" @click="openDetail()">查看详情</button>
        <button class="close" @click="navToHome()">关闭</button>
      </div>
      <div class="btns" v-if="isDistribution">
        <button class="active" @click="backMarket()">完成 · 返回料集市</button>
      </div>
    </div>
    
  </div>
</template>
<script type="text/javascript">
import { api } from "api/newFeed.js";
import { detail} from "api/qrcodeUrl.js";
import { Indicator, Toast } from "mint-ui";
import { canvas } from "api/canvas/index.js";
export default {
  data() {
    return {
      // 料的id
      id: "",
      // 海报图片
      posterImg: "",
      // 料的类型 单卖或包时段
      period: 0,
      title: "",
      // 当前海报类型
      curPosterType: 1,
      freeT: "",
      buyT: "",
      // 付费图片
      cover: "",
      // 通知次数  只对period==1（包时段）时有效
      noticeTimes: 0,
      // 是否已通知 只对period==0（单卖）时有效
      messagePushed: 0,
      // 用户
      user: {},
      // 料的类型
      prefix: "",
      // 头像的base64
      userHeadBase64: "",
      // camnvas
      canvas: document.createElement("canvas"),
      // 切换海报可否点击
      isClick: true,
      // 是否是通过分销进来的海报
      isDistribution: false,
      // 背景缩略图列表
      topicBackgroundList: [],
      // 背景图
      bgImg: "",
      reviewStatus: 1 //是否审核通过
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    // 赚佣金生成海报
    this.isDistribution = this.$route.query.isDistribution || false;

    this.getPoster();
  },
  methods: {
    // 生成二维码
    createQrCode(period) {
      $(".qrcode").qrcode({
        render: "canvas", //也可以替换为table
        width: 100,
        height: 100,
        text: `${detail()}?id=${this.id}&qrCode=1`
        // text: period==1?`${detailList()}?id=${this.id}&qrCode=1`:`${detail()}?id=${this.id}&qrCode=1`
      });
    },
     // 创建canvas 画布
    async createCanvas (userImg,cover,type,bg) {
      if(!this.isClick){
        return;
      }
      this.isClick = false;
      Indicator.open('生成海报中...')
      this.curPosterType = bg;
      let can = this.canvas;
      let ctx = can.getContext("2d");
      can.width = 750;
      can.height = 1000 ;
      this.putPosterTypeMethod(bg);
   
       let res = await canvas({
        ctx:ctx,
        canObj:can,
        qrCode:$(".qrcode canvas").get(0).toDataURL("image/png"),
        title:this.title,
        price:this.price,
        freeT:this.freeT,
        buyT:this.buyT,
        buyImg:cover,
        ty:type,
        bg:bg,
        userName:this.user.nickname,
        userImg:userImg
      }) 
      setTimeout(()=>{
        Indicator.close();
      },100)
      const poster = $(".poster img").get(0);
      poster.crossOrigin = "anonymous";
      poster.src = res;
      this.isClick = true;
    },

   


  /**获取海报 */
    getPoster() {
      Indicator.open();
      api
        .getPosterInfo({ id: this.id })
        .then(res => {
          Indicator.close();
          if (res.data.code == 200) {
            let {  cover,  reviewStatus, id,noticeTimes, period, prefix,price, title,freePart ,payPart,posterType,user,isFree,messagePushed}    = res.data.result;
            this.title = title;
            this.price = price/100;
            this.period = period;
            this.cover = cover;
            this.freeT = freePart||'';
            this.user = user;
            this.noticeTimes = noticeTimes;
            this.curPosterType = posterType;
            this.buyT = payPart; 
            this.reviewStatus = reviewStatus;
            this.createQrCode(period);
           
            if(isFree==1){
              prefix="免费";
            }else{
               prefix = prefix?  prefix.substring(1,prefix.length-1):'';
            }
            this.prefix = prefix;

            this.getBase64(user.headImgUrl,prefix,posterType)
          } else {
            Toast(res.data.message);
          }
        })
        .catch(err => {
          Indicator.close();
        });
    },
     /*
    * 将头像转换base64
    */
     getBase64(imgUrl,prefix,posterType) {
       let that = this;
      window.URL = window.URL || window.webkitURL;
      var xhr = new XMLHttpRequest();
      xhr.open("get", imgUrl, true);
      that.createCanvas('',that.cover,that.prefix,posterType);
      // 至关重要
      xhr.responseType = "blob";
      xhr.onload = function() {
       
        if (this.status == 200) {
          //得到一个blob对象
          var blob = this.response;
          // 至关重要
          let oFileReader = new FileReader();
          oFileReader.onloadend = function (e) {
            let base64 = e.target.result;
            that.userHeadBase64 = base64;
             setTimeout(()=>{
              that.createCanvas(base64,that.cover,that.prefix,posterType);
            },100)
          };
          oFileReader.readAsDataURL(blob);
        }
      }
      xhr.send();
    },
    // 提交海报类型
    putPosterTypeMethod(t){
      api.putPosterType({id:this.id,posterType:t}).then(res=>{
        if(res.data.code==200){

        }
      }).catch(err=>{

      })
    },
    /**
     *  打开料的详情
     *  @如果period=0 则跳转到info-detail，如果为1则跳转到info-time-list
     */
    openDetail() {
      console.log(this.period);
      this.$router.push({
        path: "/info-detail",
        query: { id: this.id }
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
            if (t == 1) {
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

    // 跳转到首页
    navToHome() {
      this.$router.replace("/");
    },
    // 返回料集市
    backMarket() {
      this.$router.replace("/market");
    },

    // 返回上一页
    backPrePage(){
      this.$router.go(-1)
    }
  },
  beforeDestroy() {
    Indicator.close();
  }
};
</script>
<style  scoped lang="scss">
.shade{
  width:100%;
  height: 100vh;
  background: rgba(0,0,0,0.7);
  position: fixed;
  z-index:10;
}
.page_placard {
  padding-top: 60px;
  background-color: #fff;
  .share-distribution-tip {
    color: #f34434;
    font-size: 28px;
    line-height: 40px;
    padding: 0 60px 30px;
    font-weight: bold;
  }
}
.poster {
  padding: 0 60px 20px;
  background-color: #fff;
  border-bottom: 1px solid rgba(51, 51, 51, 0.12);
  position: relative;
  img {
    width: 100%;
    height: 840px;
  }
  button {
    width: 100%;
    height: 96px;
    border: 1px solid rgba(51, 51, 51, 0.12);
    color: #666;
    font-size: 28px;
    border-radius: 8px;
    background-color: #fff;
    margin-top: 24px;
    font-weight: bold;
  }
}
.poster-options {
  overflow-x: scroll;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: 20px 0;
  box-sizing: border-box;
  width: calc(100% - 40px);
  margin: 0 auto;
  div {
    padding: 20px;
    &.active {
      background-color: #e8e8f0;
      border-radius: 8px;
    }
  }

  img {
    width: 120px;
    height: 160px;
    border-radius: 4px;
  }
}
.notice {
  margin-top: 20px;
  text-align: center;
  font-size: 28px;
  color: #666;
  border: 1px solid rgba(51, 51, 51, 0.12);
  border-radius: 8px;
  line-height: 96px;
  font-weight: bold;
}

.page_placard .btns {
  justify-content: space-around;
  align-items: center;
  font-size: 30px;
  text-align: center;
  padding: 0 30px 40px;
}

.page_placard .btns button {
  line-height: 96px;
  font-size: 28px;
  border: none;
  border-radius: 8px;
  margin-bottom: 30px;
  width: 100%;
  display: block;
  color: #fff;
  font-weight: bold;
}
.page_placard .btns button:focus {
  outline: none;
}
.page_placard .btns button.active {
  background: #f34434;
}
.page_placard .btns .default {
  background: #407fe7;
}
.page_placard .btns .close {
  color: #666;
  border: 1px solid rgba(51, 51, 51, 0.12);
  background-color: #fff;
}
.poster-img{ 
   .censor-cont{
      background: #fff;
      border-radius: 8px;
      color:#555;
      font-weight: 500;
      position:absolute;
      width:600px;
      height:300px;
      top:500px;
      left:75px;
      padding:30px;
      box-sizing: border-box;
      z-index:12;
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