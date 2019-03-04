<template>
    <div class="wrapper">
        <div class="flex-wrap item" @click="jump(1)">
            <img :src="require('../../assets/img/news1.png')" alt="" class="icon">
            <div class="flex-r">
                <div class="item-title flex-wrap">
                    <h2>购买通知</h2>
                    <span>{{news1.length==0?'':news1[0].creatDate}}</span>
                </div>
                <div class="item-info">
                    <p>{{news1.length==0?'暂时没有消息':news1[0].content}}</p>
                    <!-- <span>new</span> -->
                </div>
            </div>
        </div>

        <!-- <div class="flex-wrap item" @click="jump(2)">
            <img :src="require('../../assets/img/news2.png')" alt="" class="icon">
            <div class="flex-r">
                <div class="item-title flex-wrap">
                    <h2>提现通知</h2>
                    <span>{{news2.length==0?'':news2[0].creatDate}}</span>
                </div>
                <div class="item-info">
                    <p>{{news2.length==0?'暂时没有消息':news2[0].content}}</p>

                </div>
            </div>
        </div> -->

        <div class="flex-wrap item" @click="jump(3)">
            <img :src="require('../../assets/img/news3.png')" alt="" class="icon">
            <div class="flex-r">
                <div class="item-title flex-wrap">
                    <h2>退款通知</h2>
                    <span>{{news3.length==0?'':news3[0].creatDate}}</span>
                </div>
                <div class="item-info">
                    <p>{{news3.length==0?'暂时没有消息':news3[0].content}}</p>
                    <!-- <span>new</span> -->
                </div>
            </div>
        </div>

        <div class="flex-wrap item" @click="jump(0)">
            <img :src="require('../../assets/img/news4.png')" alt="" class="icon">
            <div class="flex-r">
                <div class="item-title flex-wrap">
                    <h2>系统消息</h2>
                    <span>{{news0.length==0?'':news0[0].creatDate}}</span>
                </div>
                <div class="item-info">
                    <p>{{news0.length==0?'暂时没有消息':news0[0].content}}</p>
                    <!-- <span>new</span> -->
                </div>
            </div>
        </div>
    </div> 
</template>


<script>
import {getNews} from 'api/myProfit'
export default {
  data() {
    return {
        // 系统信息
        news0:[],
        // 购买通知
        news1:[],
        // 提现通知
        news2:[],
        // 退款通知
        news3:[]
    };
  },
  created(){
      this.getNewsType(0)
      this.getNewsType(1)
    //   this.getNewsType(2)
      this.getNewsType(3)
  },
  methods:{
      getNewsType(type){
          getNews({"type":type,"pageNum":1,"pageSize":1}).then(res=>{
            if(res.data.code==200){
                
                switch(type){
                    case 0:
                    this.news0 = res.data.result;
                    break;
                    case 1:
                    this.news1 = res.data.result;
                    break;
                    case 2:
                    this.news2 = res.data.result;
                    break;
                    case 3:
                    this.news3 = res.data.result;
                    break;

                }
            }
          })
      },
      jump(t){
          this.$router.push({path:'/news-detail',query:{t:t}})
      }
  }
};
</script>

<style scoped>
.wrapper {
  padding-top: 20px;
}
.flex-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
}
.item {
  padding: 20px 30px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}
.item:nth-child(4) {
  border: none;
}
.icon {
  width: 90px;
  margin-right: 20px;
}
.flex-r {
  flex: 1;
  overflow: hidden;
}
.flex-r .item-title {
  margin-bottom: 20px;
  
}
.flex-r .item-title h2 {
  color: #101010;
  font-size: 32px;
  line-height: 1.4;
}
.flex-r .item-title span {
  font-size: 24px;
  color: #888;
}

.flex-r .item-info p {
  font-size: 28px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}
.flex-r .item-info span {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #ff4000;
}
</style>

