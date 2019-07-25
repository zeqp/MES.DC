<template>
  <el-dialog title="Andon处理" :visible="visible" :before-close="dialogClose" width="30%">
    <el-input type="textarea" :rows="3" placeholder="故障原因" v-model="QueryModel.RepairFaultCourse" autofocus="true"></el-input>
    <div style="height:10px;">&nbsp;</div>
    <el-input type="textarea" :rows="3" placeholder="维修措施" v-model="QueryModel.RepairInfo"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button type="success" @click="processAndon()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import andonSvc from "../../api/andon"
export default {
  name: 'andonProcess',
  props: {
    andonId: String,
    visible: Boolean
  },
  data() {
    return {
      QueryModel: { workid: this.andonId, RepairFaultCourse: null, RepairInfo: "" }
    }
  },
  watch: {
    andonId(val, old) {
      this.QueryModel.workid = val;
    }
  },
  methods: {
    processAndon() {
      andonSvc.process(this.QueryModel).then(result => {
        console.log(result);
        this.QueryModel.RepairFaultCourse = null;
        this.QueryModel.RepairInfo = null;
        this.$message({
          type: result.Data.Status ? "success" : "error",
          message: result.Data.Message
        });
        this.$emit('andonchange')
      });
      this.$emit('update:visible', false)
    },
    dialogClose(done) {
      this.QueryModel.RepairFaultCourse = null;
      this.QueryModel.RepairInfo = null;
      done();
      this.$emit('update:visible', false)
    }
  }
}
</script>
