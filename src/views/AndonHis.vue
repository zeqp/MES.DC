<template>
  <el-container>
    <el-header>
      <el-form :inline="true" :model="QueryModel">
        <el-form-item label="开始日期">
          <el-date-picker v-model="QueryModel.StartTime" type="date" placeholder="开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="QueryModel.EndTime" type="date" placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="QueryModel.Status" placeholder="状态">
            <el-option label="所有" value="-1"></el-option>
            <el-option label="待处理" value="0"></el-option>
            <el-option label="处理中" value="1"></el-option>
            <el-option label="已处理" value="2"></el-option>
            <el-option label="已完成" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getListData">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table :data="ListData" style="width: 100%" :height="tableHeight" :max-height="tableHeight" @row-click="rowClick">
        <el-table-column prop="AndonType" :formatter="typeFormat" label="类型"></el-table-column>
        <el-table-column prop="PlantOrder" label="工单号"></el-table-column>
        <el-table-column prop="StartTime" :formatter="dateFormat" label="开始时间"></el-table-column>
        <el-table-column prop="EndTime" :formatter="dateFormat" label="完成时间"></el-table-column>
        <el-table-column prop="CreatorName" label="发起人"></el-table-column>
        <el-table-column prop="TargetName" label="执行人"></el-table-column>
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
      <andon-show :visible.sync="Config.ShowAdnonInfo" :andon="CurAndon"></andon-show>
    </el-footer>
  </el-container>
</template>

<script>
import andonSvc from "../api/andon";
import moment from "moment";
import AndonShow from "../components/Andon/Show.vue"
export default {
  name: "andonhis",
  components: {
    AndonShow
  },
  data() {
    return {
      Config: { WindowHeight: window.innerHeight, TotalRows: 0, ShowAdnonInfo: false },
      QueryModel: { StartTime: moment(new Date()).format("YYYY-MM-DD"), EndTime: "", Status: -1, SortDirection: 1, SortField: "StartTime", PageSize: 10, PageIndex: 1 },
      ListData: [],
      CurAndon: {}
    };
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.Config.WindowHeight = window.innerHeight;
      });
    });
    this.getListData();
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
    getListData() {
      andonSvc.getHis(this.QueryModel).then(result => {
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
    statusFormat(row, cloumn, value, index) {
      var valString = value;
      switch (value) {
        case 0: valString = "待处理"; break;
        case 2: valString = "处理中"; break;
        case 3: valString = "已处理"; break;
        case 4: valString = "已完成"; break;
        default: break;
      }
      return valString;
    },
    typeFormat(row, cloumn, value, index) {
      var valString = value;
      switch (value) {
        case 1: valString = "设计/工艺"; break;
        case 2: valString = "质检"; break;
        case 3: valString = "调度"; break;
        case 4: valString = "设备"; break;
        default: break;
      }
      return valString;
    },
    dateFormat(row, cloumn, value, index) {
      if (!value) return "";
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    },
    rowClick(row, column, event) {
      this.CurAndon = row;
      this.Config.ShowAdnonInfo = true;
    }
  }
};
</script>
