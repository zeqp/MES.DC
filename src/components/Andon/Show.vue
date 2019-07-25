<template>
  <el-dialog title="Andon信息" :visible="visible" :before-close="dialogClose" width="50%">
    <el-row>
      <el-col :span="10">
        <el-form :model="AndonModel" label-width="80px" :disabled="true">
          <el-form-item label="工单号">
            <el-input v-model="AndonModel.PlantOrder"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-input v-model="AndonModel.AndonType"></el-input>
          </el-form-item>
          <el-form-item label="发起人">
            <el-input v-model="AndonModel.CreatorName"></el-input>
          </el-form-item>
          <el-form-item label="执行人">
            <el-input v-model="AndonModel.TargetName"></el-input>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-input v-model="AndonModel.StartTime"></el-input>
          </el-form-item>
          <el-form-item label="确认时间">
            <el-input v-model="AndonModel.ResponseTime"></el-input>
          </el-form-item>
          <el-form-item label="完成时间">
            <el-input v-model="AndonModel.EndTime"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-input v-model="AndonModel.Status"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12" :offset="2">
        <el-form :model="AndonModel" label-width="80px" :disabled="true">
          <el-form-item label="故障信息">
            <el-input v-model="AndonModel.FaultRemark" type="textarea" :rows="4"></el-input>
          </el-form-item>
          <el-form-item label="故障原因">
            <el-input v-model="AndonModel.RepairFaultCourse" type="textarea" :rows="4"></el-input>
          </el-form-item>
          <el-form-item label="关闭信息">
            <el-input v-model="AndonModel.CloseInfo" type="textarea" :rows="4"></el-input>
          </el-form-item>
          <el-form-item label="评价">
            <el-input v-model="AndonModel.AssessingInfo" type="textarea" :rows="4"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="success" @click="doneAndon()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'andonDone',
  props: {
    visible: Boolean,
    andon: Object
  },
  data() {
    return {
      AndonModel: this.andon
    }
  },
  watch: {
    andon(val, old) {
      this.AndonModel = val;
    }
  },
  methods: {
    doneAndon() {
      this.$emit('update:visible', false)
    },
    dialogClose(done) {
      done();
      this.$emit('update:visible', false)
    }
  }
}
</script>
