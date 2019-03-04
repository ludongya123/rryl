<template>
  <div class="footer">
    <router-link class="link" v-for="(item,index) in types" :to="item.path" :key="index">
      <!-- <img :src="item.path === curPath ? item.dataImg : item.img" alt=""> -->
      <i
        class="iconfont"
        :class="item.path === curPath?'cur-path':''"
        v-html="item.path === curPath ? item.dataImg : item.img"
      ></i>
      <span :style="{color: item.path === curPath ? item.dataColor : item.color}">{{item.name}}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      curPath: "/",
      hasRestrict: false,
      types: [
        {
          path: "/",
          name: "新建料",
          query: "new",
          color: "#999",
          dataColor: "#333",
          img: "&#xe69f;",
          dataImg: "&#xe69e;"
        },
        // {
        //   path: '/market',
        //   name: '料集市',
        //   color: '#999',
        //   dataColor: '#333',
        //   img: '&#xe6b2;',
        //   dataImg: '&#xe6c8;'
        // },
        {
          path: "/myInfo",
          name: "我的料",
          color: "#999",
          dataColor: "#333",
          img: "&#xe697;",
          dataImg: "&#xe696;"
        },

        {
          path: "/personal",
          name: "我的",
          color: "#999",
          dataColor: "#333",
          img: "&#xe6a0;",
          dataImg: "&#xe69c;"
        }
      ]
    };
  },
  created() {
    this.curPath = this.$route.path;
    // if (this.curPath == "/") {
      
    // }
  },
  methods: {

  }
};
</script>

<style scoped>
.footer {
  width: 100%;
  height: 94px;
  background-color: #ffffff;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 300;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  font-size: 0;
  overflow: hidden;
  padding: 6px 0 20px;
  box-shadow: 0 -2px 0 rgba(0, 0, 0, 0.04);
}
.content-title {
  color: #333;
  font-size: 30px;
  font-weight: 500;
  padding: 48px 48px 32px 48px;
}
.content-wxchat {
  color: #666;
  font-size: 28px;
  padding: 0 48px 0 48px;
}
.confire {
  width: 144px;
  height: 72px;
  text-align: center;
  line-height: 72px;
  color: #fff;
  font-size: 28px;
  background-color: #f34434;
  border-radius: 8px;
  position: absolute;
  right: 32px;
  bottom: 32px;
}
.footer .link {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 14px;
}
.footer .link i {
  color: #999;
  font-size: 40px;
}
.footer .link i.cur-path {
  color: #333;
}

.footer .link span {
  font-size: 20px;
  line-height: 50px;
}
</style>
