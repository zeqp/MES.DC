<template>
  <el-dialog title="挂起" :visible="visible" :before-close="dialogClose" width="400px">
    <el-card class="box-card">
      <div v-for="item in ListStopType" :key="item.Id" style="margin-top:10px">
        <el-button type="info" @click="stopTask(item.Id)" style="width:300px;">{{item.Name}}</el-button>
      </div>
    </el-card>
  </el-dialog>
</template>
<script>
import taskSvc from "../../api/task"
export default {
  name: 'taskStop',
  props: {
    taskId: String,
    visible: Boolean
  },
  data() {
    return {
      ListStopType: [],
      QueryModel: { ProjecttaskId: this.taskId, Type: null }
    }
  },
  mounted() {
    taskSvc.getStopType().then(result => {
      this.ListStopType = result.Data;
    });
  },
  methods: {
    stopTask(type) {
      this.QueryModel.Type = type;
      taskSvc.taskStop(this.QueryModel).then(result => {
        console.log(result);
        this.$message({
          type: result.Data.Status ? "success" : "error",
          message: result.Data.Message
        });
      });
      this.$emit('update:visible', false)
    },
    dialogClose(done) {
      done();
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style scoped>
.button{margin-top: 10px}
</style>

