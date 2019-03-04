<template>
    <div class="wrapper">
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="distance">
        <li v-for="item in list">
            <h2>{{item.content}}</h2>
            <p>{{item.createDate}}</p>
        </li>
        </ul>
        <div class="loading flex-wrap" v-show="showLoading">
            <img :src="require('../../assets/img/loading.png')" alt="">
            <span>加载中...</span>
        </div>
        <div class="nodata" v-if="list.length==0">
            <img :src="require('../../assets/img/nonews.png')" alt="">
            <p class="no-news">暂无任何消息！</p>
        </div>
    </div>
</template>
<script>
import { InfiniteScroll, Toast } from "mint-ui";
import { getNews } from "api/myProfit";
export default {
  name: "消息详情",
  data() {
    return {
      list: [],
      loading: false,
      showLoading: false,
      distance: 10,
      type: "",
      page: 1
    };
  },
  created() {
    this.getNewsList(this.$route.query.t);
    this.type = this.$route.query.t;
  },
  methods: {
    getNewsList(t) {
      this.loading = true;
      this.showLoading = true;
      getNews({ type: t, pageSize: 15, pageNum: this.page }).then(res => {
        if (res.data.code == 200) {
          let list = res.data.result;
          setTimeout(() => {
            this.list = [...this.list, ...list];
            this.showLoading = false;
            if (list.length == 15) {
              this.loading = false;
              this.page = +this.page + 1;
            }
            if (list.length == 0) {
              Toast("没有更多啦~~");
            }
          }, 600);
        }
      });
    },
    loadMore() {
      this.getNewsList(this.type);
    }
  }
};
</script>

<style scoped>
.flex-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
.loading {
  color: #888;
  font-size: 28px;
  padding: 30px;
}
.loading img {
  width: 30px;
  height: 30px;
  animation: rotate 1s linear infinite;
  margin-right: 20px;
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.nodata {
  padding: 200px 0 0;
  text-align: center;
}
.nodata img {
  width: 570px;
  height: 333px;
}
.nodata .no-news{
  text-align: center;
  margin-top:20px;
  color:#888;
  font-size:32px;
}
ul li {
  padding: 20px 30px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}
ul li h2 {
  font-size: 32px;
  color: #101010;
  margin-bottom: 20px;
  line-height: 1.3;
  word-break: break-all;
}
ul li p {
  font-size: 28px;
  color: #999;
}
</style>
