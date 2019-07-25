<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-date-picker v-model="QueryModel.qDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间"></el-date-picker>
            <el-button type="primary" @click="getListData">查询</el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-button type="success" @click="changeQDate(-1)">上一日</el-button>
            <el-button type="success" @click="changeQDate(0)">今日</el-button>
            <el-button type="success" @click="changeQDate(1)">下一日</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table :data="ListData" style="width: 100%" :height="tableHeight" :max-height="tableHeight" @row-click="rowClick">
        <el-table-column prop="PlantOrder" label="工单号" width="180"></el-table-column>
        <el-table-column prop="PlanStartTime" :formatter="dateFormat" label="计划时间" width="180"></el-table-column>
        <el-table-column prop="ActualStartTime" :formatter="dateFormat" label="开始时间" width="180"></el-table-column>
        <el-table-column prop="MaterialVerNo" label="BOM"></el-table-column>
        <el-table-column prop="MaterialCode" label="图纸"></el-table-column>
        <el-table-column prop="OPName" label="人员"></el-table-column>
        <el-table-column prop="Status" :formatter="statusFormat" label="状态"></el-table-column>
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
      <Login :visible.sync="Config.IsShowLogin" @loginSuccess="loginSuccess" />
    </el-footer>
  </el-container>
</template>

<script>
// @ is an alias to /src
import Login from "@/components/Login.vue";
import taskSvc from "../api/task";
import moment from "moment";
export default {
  name: "task",
  components: {
    Login
  },
  data() {
    return {
      Config: { WindowHeight: window.innerHeight, TotalRows: 0, IsShowLogin: true },
      QueryModel: { OPid: null, qDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"), daytype: 0, SortDirection: 0, SortField: "Id", PageSize: 10, PageIndex: 1 },
      ListData: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.Config.WindowHeight = window.innerHeight;
      });
    });
    this.$root.Config.ActiveMenuIndex ="1";
  },
  computed: {
    totalPages() {
      return this.Config.TotalRows % this.QueryModel.PageSize
        ? parseInt(this.Config.TotalRows / this.QueryModel.PageSize) + 1
        : this.Config.TotalRows / this.QueryModel.PageSize;
    },
    tableHeight() {
      return this.Config.WindowHeight - 260;
    }
  },
  methods: {
    loginSuccess(result) {
      this.getListData();
    },
    getListData() {
      taskSvc.getTask(this.QueryModel).then(result => {
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
    changeQDate(days) {
      switch (days) {
        case -1:
          {
            this.QueryModel.qDate = moment(this.QueryModel.qDate)
              .add(-1, "d")
              .format("YYYY-MM-DD HH:mm:ss");
          }
          break;
        case 1:
          {
            this.QueryModel.qDate = moment(this.QueryModel.qDate)
              .add(1, "d")
              .format("YYYY-MM-DD HH:mm:ss");
          }
          break;
        default:
          {
            this.QueryModel.qDate = moment(new Date()).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          break;
      }
      this.QueryModel.PageIndex = 1;
      this.getListData();
    },
    getPage(index) {
      var totalPages = this.getTotalPages();
      this.QueryModel.PageIndex = index;
      if (index <= 0) this.QueryModel.PageIndex = 1;
      if (index > totalPages) this.QueryModel.PageIndex = totalPages;
      this.getListData();
    },
    statusFormat(row, cloumn, value, index) {
      var valString = value;
      switch (value) {
        case 1: valString = "编制"; break;
        case 2: valString = "已下发"; break;
        case 3: valString = "执行中"; break;
        case 4: valString = "挂起"; break;
        case 5: valString = "中止"; break;
        case 6: valString = "滞后"; break;
        case 9: valString = "完成"; break;
        default: break;
      }
      return valString;
    },
    dateFormat(row, cloumn, value, index) {
      if (!value) return "";
      return moment(value).format("YY-MM-DD");
    },
    rowClick(row, column, event) {
      this.$router.push("/taskbom/" + row.MaterialVerId + "/" + row.Id);
    }
  }
};
</script>
