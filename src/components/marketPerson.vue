<template>
    <div class="component">
        <div class="component-content" @click="toPage()">
            <div class="com-top flex-wrap">
                <div class="head-img"><img :src="user.headImgUrl" alt=""></div>
                <div class="user-info">
                    <h3>{{user.nickname}}</h3>
                    <p><span>料数量 · {{user.topicCount}}</span> <span>销量 · {{user.topicSellCount}}</span></p>
                </div>
                <button class="focus" @click.stop="sendFocus(1)" v-if="user.isFan===0"><i class="iconfont">&#xe699;</i> 关注 </button>
                <button   @click.stop="sendFocus(-1)" v-if="user.isFan===1"><i class="iconfont">&#xe699;</i> 已关注 </button>
            </div>
            <div class="com-btm flex-wrap">
                <div class="left">
                    <p class="tip">最近发布</p>
                    <h3 class="title">{{user.title}}</h3>
                </div>
                <div class="right">
                    <span><i class="iconfont">&#xe6a6;</i>{{user.price/100}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        user:Object,
        index:Number
    },
    data(){
        return{

        }
    },
    created(){
         
    },
    methods:{
        // 发送取消 关注 事件
        /**
         * type -1取关  1关注
         */
        sendFocus(type){
            this.$emit('tofocus',type,this.index);
        },
        // 发送跳转路由事件
        toPage(){
            this.$emit('todetail',this.user.userId)
        }
    }
}
</script>
<style lang="scss" scoped>
    .component{
        padding: 0 20px;
        .component-content{
            background: #fff;
            padding: 0 20px 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow:0 40px 80px rgba(0,0,0,0.04);
            .com-top{
                align-items: center;
                padding: 30px 20px;
                .head-img{
                    width:72px;
                    height: 72px;
                    &>img{
                        width:100%;
                        border-radius: 50%;
                    }
                }
                .user-info{
                    flex:1;
                    margin : 0 16px;
                    position: relative;
                    top:6px;
                    h3{
                        color:#333;
                        font-size: 28px;
                        line-height: 40px;
                        font-weight: bold;
                    }
                    p{
                        color:#999;
                        font-size: 24px;
                        line-height: 40px;
                        span{
                            line-height: 1;
                        }
                    } 
                }
                button{
                    padding: 16px 26px;
                    border:1px solid rgba(51,51,51,0.12);
                    border-radius: 8px;
                    color:#666;
                    font-size: 28px;
                    background: #fff;
                    i{
                        font-size: 28px;
                        margin-right: 6px;
                    }
                    &.focus{
                        border-color:#407FE7;
                        background: #407FE7;
                        color:#fff;
                    }

                }
            }
            .com-btm{
                padding: 24px 30px;
                align-items: flex-end;
                background: linear-gradient(to right,#F9F9FD ,#fff);
                border:1px solid rgba(244,244,248,1);
                border-radius: 8px;
                .left{
                    flex: 1;
                    overflow: hidden;
                    .tip{
                        color:#999;
                        font-size: 24px;
                        line-height: 34px;
                        margin-bottom: 8px;
                    }
                    .title{
                        color:#333;
                        line-height: 46px;
                        font-size: 28px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        font-weight: bold;
                    }
                }
                .right{
                    width: 138px;
                    text-align: right;
                    span{
                        font-size: 40px;
                        line-height:60px;
                        color:#F34434 ;
                        i{
                            font-size: 32px;
                        }
                    }
                }
            }
        }
    }
</style>

