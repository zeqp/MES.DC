<template>
  <el-dialog title="报工" :visible="visible" :before-close="dialogClose" width="30%">
    <el-input type="textarea" :rows="3" placeholder="报工说明" v-model="QueryModel.Remark" autofocus="true"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button type="success" @click="submitTask(true)">正常报工</el-button>
      <el-button type="warning" @click="submitTask(false)">异常报工</el-button>
    </span>
  </el-dialog>
</template>
<script>
import taskSvc from "../../api/task"
export default {
  name: 'taskSuccess',
  props: {
    taskId: String,
    visible: Boolean
  },
  data() {
    return {
      QueryModel: { ProjecttaskId: this.taskId, Status: false, Remark: null }
    }
  },
  methods: {
    submitTask(status) {
      this.QueryModel.Status = status;
      taskSvc.taskSuccess(this.QueryModel).then(result => {
        console.log(result);
        this.QueryModel.Remark = null;
        this.$message({
          type: result.Data.Status ? "success" : "error",
          message: result.Data.Message
        });
      });
      this.$emit('update:visible', false)
    },
    dialogClose(done) {
      this.QueryModel.Remark = null;
      done();
      this.$emit('update:visible', false)
    }
  }
}
</script>
