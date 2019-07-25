<template>
  <el-dialog title="登录" :visible="visible" width="30%" center :show-close="false" :close-on-click-modal="false">
    <el-tabs v-model="Model.LoginType" @tab-click="loginTabClick">
      <el-tab-pane label="刷卡登录" name="Card">
        <el-input v-model="Model.Card" placeholder="请在设备上刷卡登录" readonly>
          <template slot="prepend">卡号：</template>
        </el-input>
      </el-tab-pane>
      <el-tab-pane label="密码登录" name="Account">
        <el-input v-model="Model.UserName" placeholder="请输入用户名">
          <template slot="prepend">用户名：</template>
        </el-input>
        <el-input v-model="Model.Password" placeholder="请输入密码" type="password" style="margin-top:10px">
          <template slot="prepend">密&nbsp;&nbsp;&nbsp;码：</template>
        </el-input>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="loginSubmitClick">登录</el-button>
    </span>
  </el-dialog>
</template>

<script>
import loginSvc from "../api/login";
export default {
  name: "Login",
  props: {
    visible: Boolean
  },
  data() {
    return {
      Config: {},
      Model: { LoginType: "Card", UserName: null, Password: null, Card: null },
      WS: null
    };
  },
  mounted() {
    var tokenKey = process.env.VUE_APP_TokenKey;
    localStorage.removeItem(tokenKey);
    this.$root.Config.IsAuthenticated = false;
    this.$root.CurUserModel = {};
    this.WsInit();
  },
  methods: {
    loginTabClick(tab, event) {
      this.Model.LoginType = tab.name;
    },
    loginSubmitClick() {
      //登录
      loginSvc.getToken(this.Model).then(result => {
        console.log(result);
        if (result.Code !== "0") return;
        var tokenKey = process.env.VUE_APP_TokenKey;
        localStorage.setItem(tokenKey, result.Data);
        this.updateUser();
        this.$emit('update:visible', false)
        this.$emit("loginSuccess", result);
      });
    },
    updateUser() {
      //登录成功后，获取用户基本信息
      loginSvc.getUser().then(result => {
        if (result.Code !== "0") return;
        this.$root.Config.IsAuthenticated = true;
        this.$root.CurUserModel = result.Data;
      });
    },
    WsInit() {
      var wsUrl = process.env.VUE_APP_WebSocketUrl;
      this.WS = new WebSocket(wsUrl);
      this.WS.onopen = this.WsOpen;
      this.WS.onerror = this.WsError;
      this.WS.onmessage = this.WsMessage;
      this.WS.onclose = this.WsClose;
    },
    WsOpen() {
      this.WS.send('{"Type":"ReadCard","Data":""}');
    },
    WsError(error) {
      console.error("WsError", error);
    },
    WsMessage(msg) {
      console.log("WsMessage", msg);
      var result = JSON.parse(msg.data);
      if(result.Code==="0")
      {
        this.Model.LoginType="Card";
        this.Model.Card=result.Data;
        this.loginSubmitClick();
      }
    },
    WsClose(e) {
      console.log("WsClose", e);
    }
  },
  destroyed() {
    this.WS.close();
  }
};
</script>
