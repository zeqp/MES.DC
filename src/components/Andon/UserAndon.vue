<template>
  <el-container>
    <el-main>
      <el-card>
        <div slot="header" class="clearfix">
          <span>{{andonTypeName}}</span>
          <el-button style="float: right; padding: 8px" type="warning" v-if="Config.CanAndon" @click="Config.ShowAndonStart=true">ANDON</el-button>
          <el-button style="float: right; padding: 8px" type="info" v-if="!Config.CanAndon" @click="Config.ShowAndonInfo = true">查看</el-button>
        </div>
        <el-image style="height: 180px" :src="Config.ImgUrl+Config.User.Photo" fit="fill">
          <div slot="error" class="image-slot">
            <img src="../../assets/mes.jpg" />
          </div>
        </el-image>
      </el-card>
      <el-card>
        <el-form :model="CurAndonModel" label-width="80px" size="mini">
          <el-form-item label="处理人员">
            <el-input v-model="CurAndonModel.TargetName" :readonly="true" placeholder="处理人员"></el-input>
          </el-form-item>
          <el-form-item label="确认时间">
            <el-input v-model="CurAndonModel.ResponseTime" :readonly="true" placeholder="确认时间"></el-input>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-input v-model="CurAndonModel.StartTime" :readonly="true" placeholder="开始时间"></el-input>
          </el-form-item>
          <el-form-item label="完成时间">
            <el-input v-model="CurAndonModel.EndTime" :readonly="true" placeholder="完成时间"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-input :value="statusName" :readonly="true" placeholder="状态"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card style="text-align:center;">
        <el-button-group>
          <el-button type="success" :disabled="CurAndonModel.Status != 0" @click="Config.ShowAndonConfirm = true">确认</el-button>
          <el-button type="success" :disabled="CurAndonModel.Status != 1" @click="Config.ShowAndonProcess = true">处理</el-button>
          <el-button type="success" :disabled="CurAndonModel.Status != 2" @click="Config.ShowAndonDone = true">关闭</el-button>
        </el-button-group>
      </el-card>
      <andon-start :taskId="Config.TaskId" :andonType="Config.AndonType" :targetUserId="Config.User.Id" :visible.sync="Config.ShowAndonStart" @andonchange="getAndon"></andon-start>
      <andon-confirm :andonId="CurAndonModel.Id" :visible.sync="Config.ShowAndonConfirm" @andonchange="getAndon"></andon-confirm>
      <andon-process :andonId="CurAndonModel.Id" :visible.sync="Config.ShowAndonProcess" @andonchange="getAndon"></andon-process>
      <andon-done :andonId="CurAndonModel.Id" :visible.sync="Config.ShowAndonDone" @andonchange="getAndon"></andon-done>
      <andon-show :andon="CurAndonModel" :visible.sync="Config.ShowAndonInfo"></andon-show>
    </el-main>
  </el-container>
</template>

<script>
import andonSvc from "../../api/andon"
import andonStart from "./Start.vue"
import andonConfirm from "./Confirm.vue"
import andonProcess from "./Process.vue"
import andonDone from "./Done.vue"
import andonShow from "./Show.vue"
export default {
  name: 'userAndon',
  components: {
    andonStart, andonConfirm, andonProcess, andonDone, andonShow
  },
  props: {
    andonType: Number,
    taskId: String,
    user: Object
  },
  data() {
    return {
      Config: {        ImgUrl: process.env.VUE_APP_ImgUrl, AndonType: this.andonType, TaskId: this.taskId, User: this.user, CanAndon: false,
        ShowAndonStart: false, ShowAndonConfirm: false, ShowAndonProcess: false, ShowAndonDone: false, ShowAndonInfo: false      },
      CurAndonModel: {}
    };
  },
  computed: {
    andonTypeName() {
      var andonName = "";
      switch (this.Config.AndonType) {
        case 0: andonName = "操作员"; break;
        case 1: andonName = "设计/工艺"; break;
        case 2: andonName = "质检"; break;
        case 3: andonName = "调度"; break;
        case 4: andonName = "设备"; break;
        default: break;
      }
      return andonName;
    },
    statusName() {
      var value = this.CurAndonModel.Status;
      var valString = "";
      switch (value) {
        case 0: valString = "待处理"; break;
        case 1: valString = "处理中"; break;
        case 2: valString = "已处理"; break;
        case 3: valString = "已完成"; break;
        default: break;
      }
      return valString;
    }
  },
  watch: {
    taskId(val, old) {
      this.Config.TaskId = val;
      this.getAndon();
    },
    user(val, old) {
      this.Config.User = val;
      this.getAndon();
    }
  },
  mounted() {
    this.getAndon();
  },
  methods: {
    getAndon() {
      if (this.Config.User == undefined || this.Config.User == null) return;
      if (this.Config.TaskId == undefined || this.Config.TaskId == null) return;
      var queryModel = { TaskId: this.Config.TaskId, Type: this.Config.AndonType, TargetId: this.Config.User.Id };
      console.log(queryModel);
      andonSvc.getAndon(queryModel).then(result => {
        if (result.Data !== null) {
          this.Config.CanAndon = false;
          this.CurAndonModel = result.Data;
        } else {
          this.Config.CanAndon = true;
          this.CurAndonModel = { Id: "", TargetUser: "", ResponseTime: null, StartTime: null, EndTime: null, Status: null };
        }
      });
    }
  }
}
</script>
<style scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
