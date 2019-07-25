<template>
  <el-container id="app">
    <el-header id="nav" style="padding:0;background-color:#545c64;">
      <el-row>
        <el-col :span="12">
          <el-menu :default-active="$root.Config.ActiveMenuIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :router="true">
            <el-menu-item index="0" :route="{path:'/'}">
              <img src="./assets/logo120_36.png">
            </el-menu-item>
            <el-menu-item index="1" :route="{path:'/task'}">生产报工</el-menu-item>
            <el-menu-item index="2" :route="{path:'/andon'}">ANDON</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="8" :offset="4" v-if="$root.Config.IsAuthenticated">
          <el-menu mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item>
              <a>
                <img :src="ImgUrl + $root.CurUserModel.Photo" style="width:40px;height:40px;">
                <!-- <el-avatar shape="square" size="large" :src="BaseUrl + $root.CurUserModel.Photo"></el-avatar> -->
              </a>
            </el-menu-item>
            <el-menu-item>
              <el-tag>{{$root.CurUserModel.Name}}</el-tag>
            </el-menu-item>
            <el-menu-item>
              <el-button type="danger" @click="loginOut">退出登录</el-button>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      BaseUrl: process.env.VUE_APP_BaseUrl,
      ImgUrl: process.env.VUE_APP_ImgUrl
    };
  },
  methods: {
    handleSelect(index, indexPath) {
      console.log("handleSelect", index, indexPath);
      this.$root.Config.ActiveMenuIndex = index;
    },
    loginOut() {
      let TokenKey = process.env.VUE_APP_TokenKey;
      localStorage.removeItem(TokenKey);
      this.$root.Config.IsAuthenticated = false;
      this.$root.CurUserModel = {};
      this.$router.replace("/");
    }
  }
};
</script>
