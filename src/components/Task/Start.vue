<template>
  <div style="display:none;"></div>
</template>
<script>
import taskSvc from "../../api/task"
export default {
  name: 'taskStart',
  props: {
    taskId: String,
    visible: Boolean
  },
  data() {
    return {
      TaskId: this.taskId,
      Visible: this.visible
    }
  },
  watch: {
    visible: function (val, old) {
      if (val) {
        this.show();
      }
    }
  },
  methods: {
    show() {
      this.$confirm("确定已领料，并开始生产作业？", "领料开工", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        taskSvc.taskStart({ ProjecttaskId: this.TaskId }).then(result => {
          console.log(result);
          this.$message({
            type: result.Data.Status ? "success" : "error",
            message: result.Data.Message
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '领料开工已取消'
        });
      }).finally(() => {
        this.$emit("Complated", "taskStart");
      });
    }
  }
}
</script>