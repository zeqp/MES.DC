<template>
  <el-row>
    <el-col :span="6" :offset="3">
      <el-card>
        <div slot="header" class="clearfix">
          <span>生产报工</span>
        </div>
        <router-link to="/task"><img src="../assets/networking.png" class="image"></router-link>
      </el-card>
    </el-col>
    <el-col :span="6" :offset="6">
      <el-card>
        <div slot="header" class="clearfix">
          <span>Andon</span>
        </div>
        <router-link to="/andon"><img src="../assets/placeholder.png" class="image"></router-link>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'home',
}
</script>
<style scoped>
.image {
  width: 100%;
  display: block;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>

