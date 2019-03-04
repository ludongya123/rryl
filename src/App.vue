<template>
  <div id="app">
    <!-- <v-place v-if="isShowPalce"></v-place> -->
    <keep-alive >
      <router-view v-if="$route.meta.keepAlive" ></router-view>
    </keep-alive>
    <router-view v-if="!this.$route.meta.keepAlive"  ></router-view>
  </div>
</template>
<script type="text/javascript">
import { api } from "@/api/newFeed.js";
import { Indicator } from "mint-ui";
import {login } from "@/api/login.js"
import PlaceHolder from "@/components/placeholader.vue"
function GetQueryString(key) {
  let href = window.location.search.substr(1);
  let obj = {};
  href.split("&").forEach(function(t) {
    let str = t.split("=");
    obj[str[0]] = str[1];
  });
  return obj[key];
}
export default {
  components:{
    'v-place':PlaceHolder
  },
  data() {
    return { 
      isShowPalce:false
    }
  },
  created(){ 
    //  if (/(iPhone|iPad|iPod|iOS)/i.test(window.navigator.userAgent)) {
    //     this.isShowPalce = true;
    //   }
  },
  methods:{ },

  beforeCreate() {

    let href = window.location.href;
    if(href.indexOf("sanweiche")>=0){
      href = href.replace('chi.sanweiche.com','yl.doe529.cn');
      window.location.replace(href);
      return;
    }
    if(href.indexOf("zixianzi")>=0){
      href = href.replace('rryl.zixianzi.com','yl.doe529.cn');
      window.location.replace(href);
      return;
    }
    // localStorage.setItem('Authorization','USERTOKEN_&&_20181221160418500898249968357576_&&_085c9f1250ed4be697048387f1b3359e')
    // 定义版本
    localStorage.setItem('version','2.5.2')
  }

};
</script>
<style lang="scss">

#app {
  width: 100%;
  height: 100%;
}
</style>

