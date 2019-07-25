<template>
  <el-dialog title="ANDON" :visible="visible" :before-close="dialogClose" width="30%">
    <el-input type="textarea" :rows="3" placeholder="故障信息" v-model="QueryModel.FaultRemark" autofocus="true"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button type="success" @click="startAndon()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import andonSvc from "../../api/andon"
export default {
  name: 'andonStart',
  props: {
    taskId: String,
    andonType: Number,
    targetUserId: String,
    visible: Boolean
  },
  data() {
    return {
      QueryModel: { ProduceTaskId: this.taskId, AndonType: this.andonType, TargetUser: this.targetUserId, FaultRemark: "" }
    }
  },
  watch: {
    taskId(val, old) {
      this.QueryModel.ProduceTaskId = val;
    },
    targetUserId(val, old) {
      this.QueryModel.TargetUser = val;
    }
  },
  methods: {
    startAndon() {
      andonSvc.start(this.QueryModel).then(result => {
        console.log(result);
        this.QueryModel.FaultRemark = null;
        this.$message({
          type: result.Data.Status ? "success" : "error",
          message: result.Data.Message
        });
        this.$emit('andonchange')
      });
      this.$emit('update:visible', false)
    },
    dialogClose(done) {
      this.QueryModel.FaultRemark = null;
      done();
      this.$emit('update:visible', false)
    }
  }
}
</script>
