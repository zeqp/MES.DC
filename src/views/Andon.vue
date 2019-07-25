<template>
  <el-container>
    <el-header>
      <el-form :inline="true" :model="TaskModel">
        <el-form-item label="工序">
          <el-input placeholder="工序" v-model="TaskModel.ProduceUnitName" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="工单号">
          <el-input placeholder="工单号" v-model="TaskModel.PlantOrder" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="$router.push('/andonhis')">Andon历史</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="6" v-if="TaskUser.PE != null">
          <user-andon :andonType="1" :taskId="TaskModel.Id" :user="TaskUser.PE"></user-andon>
        </el-col>
        <el-col :span="6" v-if="TaskUser.IPQC != null">
          <user-andon :andonType="2" :taskId="TaskModel.Id" :user="TaskUser.IPQC"></user-andon>
        </el-col>
        <el-col :span="6" v-if="TaskUser.Control != null">
          <user-andon :andonType="3" :taskId="TaskModel.Id" :user="TaskUser.Control"></user-andon>
        </el-col>
        <el-col :span="6" v-if="TaskUser.Device != null">
          <user-andon :andonType="4" :taskId="TaskModel.Id" :user="TaskUser.Device"></user-andon>
        </el-col>
      </el-row>
      <Login :visible.sync="Config.IsShowLogin" @loginSuccess="loginSuccess" />
    </el-main>
  </el-container>
</template>

<script>
import andonSvc from "../api/andon"
import Login from "@/components/Login.vue";
import UserAndon from "../components/Andon/UserAndon.vue"
export default {
  name: 'Andon',
  components: {
    Login, UserAndon
  },
  data() {
    return {
      Config: { IsShowLogin: true },
      TaskModel: {},
      TaskUser: {}
    }
  },
  mounted() {
    this.$root.Config.ActiveMenuIndex = "2";
  },
  methods: {
    loginSuccess() {
      andonSvc.getCurTask().then(result => {
        this.TaskModel = result.Data;
        andonSvc.getTaskUser(result.Data.Id).then(result => {
          this.TaskUser = result.Data;
        });
      });
    }
  }
}
</script>