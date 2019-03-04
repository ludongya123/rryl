<template>
    <div class="wrapper">

        <v-update v-if="isShowUpdate"  @jumphelp="toUpdateHelp()" @update="toUpdateVersion()"></v-update>
        <v-servicing v-if="isShowServicing"></v-servicing>
        <v-noticebar @showbar="showNoticeBar"></v-noticebar>
        <div class="top" :class="isShowNoticeBar==1?'top1':''">
            <div class="balance flex-wrap">
                <div class="user-info-head">
                    <img :src="userInfo.headImgUrl">
                </div>
                <div class="user-info-nickname">
                    <p class="nick-name">{{userInfo.nickname}}</p>
                    <p class="is-vip" v-if="userInfo.qualitySeller==1"><img :src="require('../../assets/img/original_golden_seller.png')" alt=""> <span>金牌卖家</span></p>
                </div>
                <div class="user-balance">
                    <p class="title">余额 <span>·</span> 元</p>
                    <p class="price">{{userInfo.balance}}</p>
                </div>
                
            </div>
            <p class="xiline"></p>
            <div class="flex-wrap income">
                <p class="left">今日收益&nbsp;&nbsp;<span>{{userInfo.balanceAmountToday}}元</span></p>
                &nbsp;&nbsp;
                &nbsp;&nbsp;
                <p class="right">总收益&nbsp;&nbsp;<span>{{userInfo.balanceAmount}}元</span></p>
            </div>
            <div class="btn">
                <button @click="putForward"><i class="iconfont">&#xe69b;</i><span>提现</span></button>
            </div>
            <p class="count">本月还可免费提现 {{userInfo.remainCashTimes}} 次</p>
            <div class="flex-wrap fans">
                <p class="half-border" @click="jump(1)">我的粉丝<span> {{userInfo.fansNum}}</span></p>
                <p class="half-border" @click="jump(2)">我的关注<span> {{userInfo.subscribeNum}}</span></p>
            </div>
        </div>
        <div class="menu">
            <div class="flex-wrap" @click="setJump1()">
                <span class="icon ask">
                    <i class="iconfont">&#xe6e0;</i>
                </span>
                <span class="text">问答</span>
                <i class="iconfont arrow">&#xe68d;</i>
            </div>
            <p class="xiline"></p>
            <div class="flex-wrap" @click="setJump('incomeDetail')">
                <span class="icon">
                    <i class="iconfont">&#xe68c;</i>
                </span>
                <span class="text">账单明细</span>
                <i class="iconfont arrow">&#xe68d;</i>
            </div>
            <p class="xiline"></p>
            <div class="flex-wrap" @click="setJump('news')">
                <span class="icon  news">
                    <i class="iconfont">&#xe698;</i>
                </span>
                <span class="text">消息</span>
                <i class="iconfont arrow">&#xe68d;</i>
            </div>
            <p class="xiline"></p>
            <div class="flex-wrap" @click="setJump('setting')">
                <span class="icon set">
                    <i class="iconfont">&#xe6a3;</i>
                </span>
                <span class="text">设置</span>
                <i class="iconfont arrow">&#xe68d;</i>
            </div>
            <p class="xiline"></p>
        </div>

        <p class="re-login">账号切换遇到问题？<span @click="reLogin()">点击重新登录</span></p>
        <p class="version">人人有料 v{{version}} </p>
        <v-footer></v-footer>
    </div>
</template>
<script>
import Footer from 'com/footer'
import {MessageBox,Indicator,Toast} from 'mint-ui'
import { api } from "api/newFeed.js"
import { getUser ,checkPsd } from "@/api/myProfit.js"
import {login } from "@/api/login.js"
import  noticeBar  from "@/components/noticeBar.vue"
import  updateVersion  from "@/components/updateVersion.vue"
import  servicingPage from "@/components/servicingPage.vue"
export default {
    components: {
      'v-footer':Footer,
      'v-noticebar':noticeBar,
        "v-update":updateVersion,
        'v-servicing': servicingPage
    },
    data(){
        return{
            userInfo: {},
            isSetPsd: true ,  // 是否设置密码
            version:localStorage.getItem('version'),
            // 维护通告 0 不显示 1显示
            isShowNoticeBar:0,
             // 是否显示版本更新提醒
            isShowUpdate:false,
            // 是否显示维护页
            isShowServicing:false
        }
    },
    mounted () {
      this.checkIsPsd()
      this.getUserInfo()
    },
    methods: {
        // 跳转到更新版本帮助
        toUpdateHelp(){
            window.location.href="http://mp.weixin.qq.com/s?__biz=MzU3NjY4NjA3OA==&mid=100000080&idx=1&sn=48825bc6114a3f5fc604ac2229e0aa6b&chksm=7d1153c14a66dad728e9303241162df52c7103ab75ec7003f5e3ff65ab872f3bffa136bc7874#rd";
        },
        // 确认更新并刷新页面
        toUpdateVersion(){
            window.location.reload();
        },
        // 监听是否显示维护公告
        showNoticeBar(val){
            this.isShowNoticeBar =  val;
        },
        /**
         * 检查是否设置密码
         */
        checkIsPsd(){
            Indicator.open();
            checkPsd().then(res => {
                Indicator.close();
                if(res.data.code==200){
                    this.isSetPsd = res.data.result
                }else{
                    this.isShowUpdate = sessionStorage.getItem('updateVersion')||false
                    this.isShowServicing = sessionStorage.getItem('servicing')||false
                }
                
            })
        },
        /**
         * 获取用户信息
         */
        getUserInfo(){
            Indicator.open();
            getUser().then(res=>{
                Indicator.close();
                if(res.data.code==200){
                    this.userInfo = res.data.result;
                }
            })
        },

        //跳转分类
        setJump: function (path) {   
            this.$router.push({
                path: `/${path}`,
                query: path === 'setting' ? {hasPsd: this.isSetPsd,isNew: this.userInfo.newUser} : ''
            })
        },
        // 跳转问答
        setJump1(){
            window.location.href = `../dist1/index.html#/market-s?type=${2}`;
        },
        //去提现
        putForward: function () {      
            if (!this.isSetPsd) {
                MessageBox.confirm('你还未设置提现密码，为了你的账户安全，是否现在就去设置？').then(action => {
                    this.$router.push({
                        path: '/setPsd',
                        query:{money:this.userInfo.balance}
                    })
                });
            } else {
                this.$router.push({
                    path: '/drawCash',
                    query:{money:this.userInfo.balance}
                })
            }
        },

        //   跳转到用户列表（关注或者粉丝）
        jump(type){
            this.$router.push({
                path:'/userlist',
                query:{type:type,count:type==1?this.userInfo.fansNum:this.userInfo.subscribeNum}
            })
        },
        // 重新登录
        reLogin(){
            localStorage.removeItem('Authorization');
            login(api);
        },
        updateVersion(){
            window.location.reload();
        }
    } 
}
</script>
<style lang="scss" scoped>
.wrapper{
    height: 100vh;
    background: #fff;
    padding-bottom:200px;   
}
    .top{
        padding: 60px 40px 40px;
        background: #fff;
        &.top1{
            padding-top:142px;
        }
        // 
        .balance{
            justify-content:space-between;
            align-items: center;
            padding-bottom:20px;
            .user-info-head{
                height: 80px;
                width:80px;
                border-radius: 50%;
                overflow: hidden;
                img{
                    width:100%;
                }
            }
            .user-info-nickname{
                flex:1;
                margin: 0 20px;
                overflow: hidden;
                .nick-name{
                    @include fontStyle(46px,28px,#333);
                    font-weight: bold;
                    @include singleEls;
                }
                .is-vip{
                    @include fontStyle(46px,24px,#E9B30D );
                    font-weight: bold;
                    img{
                        width:36px;
                        height: 36px;
                        vertical-align: middle;
                    }
                }
            }
            .user-balance{
                 text-align:right;
                .title{
                    @include fontStyle(40px,24px,#999);
                }
                .price{
                    @include fontStyle(70px,56px,#333);
                }
            }
        }
        .income{
            color:#999;
            font-size:24px;
            padding: 30px 0;
            span{
                color:#666;
            }
        }
        .btn{
            margin-top:40px;
            button{
                font-size:28px;
                color:#fff;
                padding:30px 0;
                width:100%;
                background: #F34434 ;
                border-radius: 8px;
                font-weight: bold;
                i{
                    margin-right:10px;
                    font-size:32px;
                    font-weight: normal;
                }
            }
        }
        .count{
            text-align: center;
            color:#999;
            font-size: 24px;
            line-height: 32px;
            margin:16px  0 10px;
            display: none;
        }
        .btn{
            text-align: center;
        }
        .flex-wrap{
            justify-content: center;
        }
        .fans{
            justify-content: space-between;
            color:#666;
            font-size: 26px;
            margin-top:32px;
            p{
                width:calc((100% - 32px) / 2);
                border-radius: 8px;
                text-align: center;
                padding: 30px 0;
                color:#666;
                span{
                    color:#999;
                    margin-left:6px;
                    // padding:20px;
                }
            }
            
        }
    }
    .menu{
        background: #fff;
        border-top:1px solid #eee;
        .flex-wrap{
            justify-content: space-between;
            padding: 26px 40px;
            align-items: center;
            span.text{
                flex:1;
                margin-left:20px;
                text-align: left;
                color:#333;
                font-size: 28px;
                font-weight: bold;
            }
            .icon{
                width:72px;
                height:72px;
                background: #407FE7 ;
                border-radius: 50%;
                color:#fff;
                text-align: center;
                padding-top:20px;
                box-sizing: border-box;
                i{
                    // font-size: 96px;
                }
            }
            .news{
                background: #F88629;
            }
            .ask{
                background-color: #58CC81;
            }
            .set{
                background: #999;
            }
            .arrow{
                color:#999;
            }
        }
    }

.half-border{
     position: relative;
     z-index:10;         
 }
 
.half-border:after{
        left:0;
        top:-2px;
       content: '';
       z-index:9;
       position: absolute;
       width: 200%;
       height: 200%;
       border-radius: 8px;
       border: 1px solid rgba(0,0,0,0.16);
       -webkit-transform-origin: 0 0;
       -moz-transform-origin: 0 0;
       -ms-transform-origin: 0 0;
       -o-transform-origin: 0 0;
       transform-origin: 0 0;
       -webkit-transform: scale(0.5, 0.5);
       -ms-transform: scale(0.5, 0.5);
       -o-transform: scale(0.5, 0.5);
       transform: scale(0.5, 0.5);
       -webkit-box-sizing: border-box;
       -moz-box-sizing: border-box;
       box-sizing: border-box;
}

.re-login{
    text-align: center;
    margin-top:40px;
    color:#999;
    font-size: 24px;
    span{
        color:#666;
        font-weight: bold;
        // border-bottom:1px solid #666;
        text-decoration: underline;
    }
}

.version{
    text-align: center;
    @include fontStyle(40px,24px,#999);
    margin-top: 10px;
    span{
        font-weight: bold;
        color:#666;
    }
}
</style>


