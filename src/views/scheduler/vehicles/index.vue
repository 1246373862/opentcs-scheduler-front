<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="车辆名称" prop="postName">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入车辆名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="procStatus">
        <el-select
          v-model="queryParams.procStatus"
          placeholder="车辆状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sys_vehicles_procstatus"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="postList"
    >
      <el-table-column width="55" align="center" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="电量" align="center" prop="energyLevel" />
      <el-table-column label="当前位置" align="center" prop="currentPosition" />
      <el-table-column label="订单状态" align="center" prop="procStatus">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_vehicles_procstatus"
            :value="scope.row.procStatus"
          />
        </template>
      </el-table-column>
      <el-table-column label="订单编号" align="center" prop="transportOrder" />
      <el-table-column label="运行状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_vehicles_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column label="集成级别" align="center" prop="integrationLevel"></el-table-column>
      <el-table-column label="暂停状态" align="center" prop="paused">
        <template slot-scope="scope">
          <span>{{ scope.row.paused ? "true" : "false" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >初始化</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="stoporrecover(scope.row)"
            v-hasPermi="['system:post:remove']"
            >暂停/恢复</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 初始化车辆对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="点位" prop="point">
          <el-select
            v-model="form.point"
            placeholder="请选择初始点位"
            clearable
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="item in points"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
  <script>
import {
  listPost,
  getPost,
  delPost,
  addPost,
  updatePost,
} from "@/api/system/post";
import { listVehicles, initVehicle,pausedVehicle} from "@/api/scheduler/vehicles";
import { getPoints } from "@/api/scheduler/map";
export default {
  name: "vehicles",
  dicts: ["sys_vehicles_procstatus", "sys_vehicles_status"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 车辆表格数据
      postList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        procStatus: undefined,
      },
      initParams: {
        name: undefined,
        point: undefined,
      },
      pausedParams:{
        name: undefined,
        pause: undefined
      },
      points: [],
      // 表单参数
      form: {
        point: undefined,
        name: undefined,
      },
      // 表单校验
      rules: {
        points: [
          { required: true, message: "初始点位不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询车辆列表 */
    getList() {
      this.loading = true;
      listVehicles(this.queryParams).then((response) => {
        this.postList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        point: undefined,
        name: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 初始化按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form.name = row.name;
      getPoints().then((response) => {
        this.points = response.data;
        this.open = true;
        this.title = "初始化车辆";
      });
      console.log(this.form);
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          initVehicle(this.form).then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 暂停/恢复按钮操作 */
    stoporrecover(row) {
      const name = row.name;
      const paused = row.paused;
      this.pausedParams.name = name;
      this.pausedParams.paused = !paused;
      if (paused) {
        this.$modal
          .confirm('是否恢复运行车辆"' + name + '"？')
          .then(() => pausedVehicle(this.pausedParams))
          .then(() => {
            this.getList();
            this.$modal.msgSuccess("恢复成功");
          })
          .catch(() => {});
      } else {
        this.$modal
          .confirm('是否暂停车辆"' + name + '"？')
          .then(() => pausedVehicle(this.pausedParams))
          .then(() => {
            this.getList();
            this.$modal.msgSuccess("恢复成功");
          })
          .catch(() => {});
      }
    },
  },
};
</script>
  