<template>
  <div class="mask-all">
    <div class="all-content">
      <div class="all-icon">
        <i class="iconfont">&#xe6ab;</i>
      </div>
      <div class="content-ti">账号异常</div>
      <div class="content-wx">请联系客服微信: renrenyouliao888</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return{}
  }
};
</script>
<style>
.mask-all {
  background-color: #999;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 999;
  /* display: table; */
}
.all-content {
  text-align: center;
  color: #fff;
  /* display: table-cell;
  vertical-align: middle; */
  margin-top: 45%;
}
.all-icon i {
  font-size: 80px;
}
.content-ti {
  font-size: 48px;
  margin-top: 36px;
}
.content-wx {
  font-size: 28px;
  margin-top: 20px;
}
</style>


