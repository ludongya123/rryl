<template>
    <div class="wrapper">
        <p class="date">{{createDate}}</p>
        <div class="content">
            <p class="tip">免费部分</p>
            <div class="free-area" v-html="freeT"></div>
            <p class="tip">付费部分</p>
            <div class="buy-area">
                <div  class="buyT" v-html="buyT">

                </div>
                <div class="imgs-area">
                    <template v-for="(item,index) in buyImgs" v-key="index">
                        <img :src="item.picUrl" alt="">
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Loadmore } from 'mint-ui';
import { api } from "api/myFeed";
import {Toast,Indicator} from "mint-ui";
export default {
    data(){
        return{
            // 料的id
            id:'',
            // 免费
            freeT:'',
            // 付费
            buyT:'',
            // 付费图片
            buyImgs:[],
            // 日期
            createDate:''
        }
    },
    mounted(){
        this.id = this.$route.query.id;
        this.getInfoDetail(this.id) 
    },
    methods:{
        async getInfoDetail(id) {
            Indicator.open({  text: "加载中..." });
            try {
                var res = await api.writingInfo2({
                    id: id
                });
                setTimeout(() => {
                    Indicator.close();
                }, 600);

                if (res.code == 200) {
                    console.log(res)
                    let { payPic,freePart,payPart,writeLatestTime} = res.result;

                    this.createDate = writeLatestTime;
                    this.freeT = freePart.replace(/(\r\n)|(\n)/g, "<br>");
                    this.buyT = payPart.replace(/(\r\n)|(\n)/g, "<br>");;
                    this.buyImgs = payPic;

                }
                if (res.code == 50005) {
                    this.loseEffect = true;
                }
            } catch (e) {
                Indicator.close();
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.wrapper{
    padding: 30px 40px;
    background-color: #fff;
    .date,.tip{
        color:#999;
        font-size: 24px;
        line-height: 40px;
    }
    .date{
        margin-bottom: 20px;
    }
    .tip{
        margin-bottom: 20px;
    }
    .free-area ,.buy-area{
        color:#666;
        font-size:28px;
        line-height: 52px;
        padding-bottom:20px;
        word-break: break-all;
        img{
            width:100%;
            border-radius: 8px;
        }
    }
}
</style>
