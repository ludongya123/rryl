<template>
  <div class="page">
    <router-link :to="{path: hasPsd ? '/updatePsd' : '/setPsd',query:{source: true}}" class="flex-wrap">
      <span class="left"> <i class="iconfont">&#xe6ae;</i> 提现密码</span>
      <span class="is-set" :class="hasPsd?'':'no-set'">{{hasPsd ? '已设置' : '未设置'}}</span>
      <i class="iconfont">&#xe68d;</i>
    </router-link>
    <div class="flex-wrap" @click="gosub" v-if="count>0">
      <span class="left"> <i class="iconfont">&#xe6d6;</i> 订阅设置</span>
      <span class="has-set" v-if="count <=0" >未设置</span>
      <span class="has-set" v-else>已设置 {{count}} 种订阅方式 </span>
      <i class="iconfont">&#xe68d;</i>
    </div>
    <router-link to="/help" class="flex-wrap">
      <span class="left"> <i class="iconfont">&#xe6a5;</i> 常见问题</span>
      <i class="iconfont">&#xe68d;</i>
    </router-link>
  </div>
</template>

<script>
import { api } from "api/hasSub"
import { Indicator, Toast,MessageBox } from "mint-ui";
  export default {
    data(){
      return {
         hasPsd: false,
         count: 0,
         isNew: false,
      }
    },
    created(){
      this.hasPsd = this.$route.query.hasPsd;
      //查询订阅设置的个数
      this.subCount();
      this.isNew = this.$route.query.isNew; // 0 不是新人 1是新人
    },
    methods:{
      subCount(){
        api.getSubcount().then(res =>{
          if(res.data.code == 200){
             this.count = res.data.result
          }
        })
      },
      // 判断是否可以去订阅页面
      gosub(){
        if(this.isNew == 1){
          Toast('新用户暂不能设置订阅套餐,详情联系客服')
          return
        }else{
          this.$router.push({path:'/setSub'})
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .page {
    box-sizing: border-box;
    background-color: #fff;
    height: 100vh;
  }

  .flex-wrap {
    justify-content: space-between;
    padding: 0 40px;
    line-height: 110px;
    background: #fff;
    color: #333333;
    font-size: 28px;
    align-items: center;
    border-bottom: 1px solid #f3f3f3;
    &>i{
      color:#888;
    }
    .is-set{
        font-size: 26px;
        position: relative;
        top:3px;
        color: #999;
    }
    .no-set{
      color:#F34434 ;
    }
    .has-set{
      color: #999;
      font-size: 26px;
    }
    .left {
      flex: 1;
      font-weight: bold;
        i{
          font-size: 32px;
          color:#333;
          margin-right: 6px;
          font-weight: normal;
        }
        
    }
  }


  .flex-wrap img {
    width: 30px;
    height: 30px;
    display: block;
    margin-left: 20px;
  }
</style>
