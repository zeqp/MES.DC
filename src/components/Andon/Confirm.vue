<template>
  <div style="display:none;"></div>
</template>
<script>
import andonSvc from "../../api/andon"
export default {
  name: 'andonConfirm',
  props: {
    andonId: String,
    visible: Boolean
  },
  data() {
    return {
      AndonId: this.andonId,
      Visible: this.visible
    }
  },
  watch: {
    andonId: function (val, old) {
      this.AndonId = val;
    },
    visible: function (val, old) {
      this.Visible = val;
      if (val) {
        this.show();
      }
    }
  },
  methods: {
    show() {
      this.$confirm("确认当前Andon问题？", "确认", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        andonSvc.confirm({ Id: this.AndonId }).then(result => {
          console.log(result);
          this.$message({
            type: result.Data.Status ? "success" : "error",
            message: result.Data.Message
          });
          this.$emit('andonchange');
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消确认'
        });
      }).finally(() => {
        this.$emit('update:visible', false)
      });
    }
  }
}
</script>