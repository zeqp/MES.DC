<template>
  <el-dialog title="Andon关闭" :visible="visible" :before-close="dialogClose" width="30%">
    <el-input type="textarea" :rows="3" placeholder="关闭信息" v-model="QueryModel.CloseInfo" autofocus="true"></el-input>
    <div style="height:10px;">&nbsp;</div>
    <el-input type="textarea" :rows="3" placeholder="评价" v-model="QueryModel.AssessingInfo"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button type="success" @click="doneAndon()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import andonSvc from "../../api/andon"
export default {
  name: 'andonDone',
  props: {
    andonId: String,
    visible: Boolean
  },
  data() {
    return {
      QueryModel: { workid: this.andonId, CloseInfo: null, AssessingInfo: "" }
    }
  },
  watch: {
    andonId(val, old) {
      this.QueryModel.workid = val;
    }
  },
  methods: {
    doneAndon() {
      andonSvc.done(this.QueryModel).then(result => {
        console.log(result);
        this.QueryModel.CloseInfo = null;
        this.QueryModel.AssessingInfo = null;
        this.$message({
          type: result.Data.Status ? "success" : "error",
          message: result.Data.Message
        });
        this.$emit('andonchange')
      });
      this.$emit('update:visible', false)
    },
    dialogClose(done) {
      this.QueryModel.CloseInfo = null;
      this.QueryModel.AssessingInfo = null;
      done();
      this.$emit('update:visible', false)
    }
  }
}
</script>
