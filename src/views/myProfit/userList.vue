<template>
    <div class="wrapper">
        <p class="title" v-show="list.length!=0"><span>{{type==1?'粉丝':'关注'}} · {{count}}</span></p>
        <div
            v-infinite-scroll="LoadMore"
            infinite-scroll-disabled="disLoading"
            infinite-scroll-distance="10">
            <div v-for="(item,index) in list"  :key="index" >
                <div class="flex-wrap list-item" @click="jump(item.userId)">
                    <div class="img">
                        <img :src="item.headImgUrl" alt="">
                    </div>
                    <span class="nickname" >{{item.nickname}}</span>
                    <p class="sub">{{item.relation==2?'ta订阅了我' : item.relation ==1?'已订阅':''}} <i class="iconfont arrow">&#xe68d;</i></p>
                </div>
                <p class="xiline"></p>
            </div>
        </div>
        <div class="nodata" v-show="list.length==0&&!isInit">
            <img :src="require('../../assets/img/loseEffect.png')" alt="">
            <p class="text-center">暂时还没有{{type==1?'粉丝':'关注'}}</p>
        </div>
        <v-loadmore v-show="isloading"></v-loadmore>
    </div>
</template>
<script>
import LoadMore from "@/components/loading.vue";
import { InfiniteScroll } from 'mint-ui';
import {getUserList} from 'api/myProfit'
export default {
    components: {
        "v-loadmore": LoadMore
    },
    data(){
        return {
            type:0,
            count:0,
            page:1,
            disLoading:false,
            isloading:true,
            list:[],
            isInit:true
        }
    },
    mounted(){
        this.type = this.$route.query.type;
        this.count = this.$route.query.count;
        this.getUserListInfo()
    },
    methods:{
        jump(id){
            this.$router.push({
                path:'/userhome',
                query:{id:id}
            })
        },
        // 获取粉丝或者关注列表
        getUserListInfo(){
            this.disLoading = true;
            getUserList({"listType":this.type,"pageNum":this.page,"pageSize":20}).then(res=>{
                if(res.data.code==200){
                    this.isInit = false;
                    let list = res.data.result;
                    this.list = [...this.list , ...list];
                    if(list.length<20){
                        this.isloading = false;
                        this.disLoading = true;
                    }
                    if(list.length==20){
                        this.isloading = true;
                        this.disLoading = false;
                        this.page = +this.page+1;
                    }
                }
            })
        },
        LoadMore(){
            this.getUserListInfo()
        }
    }
}
</script>
<style lang="scss" scoped>
.wrapper{
    padding-top:90px;
}
    .title{
        line-height: 90px;
        background: #fff;
        color:#999 ;
        font-size:24px;
        position: fixed;
        width:100%;
        top:0;
        padding: 0 40px;
        // box-shadow: 0 1px 20px 1px #ddd;
    }
    .list-item{
        padding: 30px  40px;
        background: #fff;
        justify-content: space-between;
        align-items: center;
        .img{
            width:80px;
            height:80px;
            border-radius: 50%;
            overflow: hidden;
            img{
                width:100%;
            }
        }
        .nickname{
            color:#333;
            font-size:28px;
            margin:0 18px;
            flex:1;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 1.3;
            font-weight: bold;
        }
        .sub{
            color: #999;
            font-size: 26px;
        }
        i{
            color:#999;
        }
    }
    .nodata{
        padding-top:100px;
        img{
            width:100%;
        }
        p{
            color:#999;
            margin-top:20px;
        }
    }
</style>


