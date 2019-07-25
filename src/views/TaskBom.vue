<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-input placeholder="工单号" v-model="TaskModel.PlantOrder" :readonly="true">
              <template slot="prepend">工单号：</template>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-input placeholder="状态" v-model="statusName" :readonly="true">
              <template slot="prepend">状态：</template>
            </el-input>
          </div>
        </el-col>
        <el-col :span="12" :offset="2">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="$router.go(-1)">返回</el-button>
            <el-button type="success" @click="Config.ShowTaskStart=true">领料开工</el-button>
            <el-button type="success" @click="Config.ShowTaskSuccess=true">报工</el-button>
            <el-button type="success" @click="Config.ShowTaskStop=true">挂起</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table :data="ListData" style="width: 100%" :height="tableHeight" :max-height="tableHeight">
        <el-table-column prop="MaterialId" label="物料类型编码"></el-table-column>
        <el-table-column prop="MaterialName" label="物料类型名称"></el-table-column>
        <el-table-column prop="Spec" label="物料规格" width="180"></el-table-column>
        <el-table-column prop="ShareNum" label="数量" width="180"></el-table-column>
        <el-table-column prop="MaterialType" label="物料类型"></el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-button-group>
        <el-button type="primary" plain icon="el-icon-d-arrow-left" title="首页" @click="getPage(1)"></el-button>
        <el-button type="primary" plain icon="el-icon-arrow-left" title="上一页" @click="getPage(QueryModel.PageIndex-1)"></el-button>
        <el-button type="primary" plain>{{QueryModel.PageIndex}}/{{totalPages}}({{Config.TotalRows}})</el-button>
        <el-button type="primary" plain icon="el-icon-arrow-right" title="下一页" @click="getPage(QueryModel.PageIndex+1)"></el-button>
        <el-button type="primary" plain icon="el-icon-d-arrow-right" title="尾页" @click="getPage(totalPages)"></el-button>
      </el-button-group>
      <task-start :taskId="TaskModel.Id" :visible="Config.ShowTaskStart" @Complated="ShowComplated"></task-start>
      <task-success :taskId="TaskModel.Id" :visible.sync="Config.ShowTaskSuccess"></task-success>
      <task-stop :taskId="TaskModel.Id" :visible.sync="Config.ShowTaskStop"></task-stop>
    </el-footer>
  </el-container>
</template>

<script>
// @ is an alias to /src
import taskSvc from "../api/task";
import moment from "moment";

import TaskStart from "../components/Task/Start.vue"
import TaskSuccess from "../components/Task/Success.vue"
import TaskStop from "../components/Task/Stop.vue"

export default {
  name: "taskbom",
  components: {
    TaskStart, TaskSuccess, TaskStop
  },
  data() {
    return {
      Config: { WindowHeight: window.innerHeight, TotalRows: 0, ShowTaskStart: false, ShowTaskSuccess: false, ShowTaskStop: false },
      QueryModel: { id: this.$route.params.id, SortDirection: 0, SortField: "Id", PageSize: 10, PageIndex: 1 },
      TaskModel: { Id: this.$route.params.taskId },
      ListData: []
    };
  },
  mounted() {
    this.getTaskData();
    this.getListData();
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.Config.WindowHeight = window.innerHeight;
      });
    })
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'getListData'
  },
  computed: {
    totalPages() {
      return this.Config.TotalRows % this.QueryModel.PageSize
        ? parseInt(this.Config.TotalRows / this.QueryModel.PageSize) + 1
        : this.Config.TotalRows / this.QueryModel.PageSize;
    },
    tableHeight() {
      return this.Config.WindowHeight - 260;
    },
    statusName() {
      var valString = this.TaskModel.Status;
      switch (this.TaskModel.Status) {
        case 1: valString = "编制"; break;
        case 2: valString = "待下发"; break;
        case 3: valString = "执行中"; break;
        case 4: valString = "挂起"; break;
        case 5: valString = "中止"; break;
        case 6: valString = "滞后"; break;
        case 9: valString = "完成"; break;
        default: break;
      }
      return valString;
    }
  },
  methods: {
    getTaskData() {
      taskSvc.getModel(this.TaskModel.Id).then(result => {
        this.TaskModel = result.Data;
      })
    },
    getListData() {
      taskSvc.getBom(this.QueryModel).then(result => {
        this.QueryModel.PageIndex = result.Data.PageIndex;
        this.Config.TotalRows = result.Data.TotalRecords;
        this.ListData = result.Data.Rows;
      });
    },
    getTotalPages() {
      return this.Config.TotalRows % this.QueryModel.PageSize
        ? parseInt(this.Config.TotalRows / this.QueryModel.PageSize) + 1
        : this.Config.TotalRows / this.QueryModel.PageSize;
    },
    getPage(index) {
      var totalPages = this.getTotalPages();
      this.QueryModel.PageIndex = index;
      if (index <= 0) this.QueryModel.PageIndex = 1;
      if (index > totalPages) this.QueryModel.PageIndex = totalPages;
      this.getListData();
    },
    dateFormat(row, cloumn, value, index) {
      if (!value) return "";
      return moment(value).format("YY-MM-DD");
    },
    ShowComplated(name) {
      switch (name) {
        case "taskStart": this.Config.ShowTaskStart = false; break;
        default: break;
      }
    }
  }
};
</script>
