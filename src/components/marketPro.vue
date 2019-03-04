<template>
    <div class="component">
        <div class="flex-wrap item" @click="toDetail()">
            <div class="left">
                <p class="date-time">2018-10-25 12:00</p>
                <h3 class="title">明日7点  皇马对马德里竞技比分竞猜皇马对马德里竞技比分竞猜</h3>
                <div class="price-precent">
                    <span>价格 · 50元</span>
                    <span>转化率 · 10%</span>
                </div>
            </div>
            <div class="right">
                <p class="tip">佣金</p>
                <p class="price"><i class="iconfont">&#xe6a6;</i><span>2.5</span></p>
                 <button>分享赚</button> 
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{}
    },
    methods:{
        toDetail(){
            this.$emit('topage',3)
        }
    }
}
</script>
<style lang="scss" scoped>

    .item{
        width:710px;
        height: 244px;
        background: url(static/img/coupon_bg.png) no-repeat;
        background-size: cover;
        margin : 0 auto;
        margin-bottom: 20px;
        box-shadow:0 40px 80px rgba(0,0,0,0.04);
        .left{
            padding:30px 40px;
            flex:1;
            .date-time{
                color:#333;
                opacity: 0.4;
                font-size: 24px;
                line-height: 40px;
            }
            .title{
                @include fontStyle(46px,32px,#333);
                font-weight: bold;
                margin:8px 0 16px;
                @include manyEls (2);
            }
            .price-precent{
                @include fontStyle(28px,24px,#999);
            }
        }
        .right{
            width:192px;
            padding: 48px 44px;
            box-sizing: border-box;
            text-align: center;
            .tip{
                @include fontStyle(28px,24px,#fff);
                opacity: 0.8;
            }
            .price{
                color:#fff;
                .iconfont{
                    font-size: 32px;
                }
                span{
                    font-size: 56px;
                    font-weight: bold;
                    line-height: 60px;
                }
            }
            button{
                color:$font-red ;
                font-size: 24px;
                background: #fff;
                border-radius: 8px;
                width:104px;
                height:64px;
                padding: 0;
            }
        }
    }
</style>
