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
      <el-form-item label="订单编号" prop="postName">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入订单编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:post:add']"
        >新增</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="ordersList">
      <el-table-column width="55" align="center" />
      <el-table-column label="订单编号" align="center" prop="name" />
      <el-table-column label="订单类型" align="center" prop="type" />
      <el-table-column label="订单状态" align="center" prop="state" />
      <el-table-column label="预定执行车辆" align="center" prop="intendedVehicle"/>
      <el-table-column label="实际执行车辆" align="center" prop="processingVehicle"/>
      <el-table-column label="能否撤回" align="center" prop="dispensable">
        <template slot-scope="scope">
          <span>{{ scope.row.paused ? "true" : "false" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" align="center" prop="data"/>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="stoporrecover(scope.row)"
            >更改预执行车辆</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="withdraw(scope.row)"
            >撤回</el-button
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

    <!-- 添加或修改车辆对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="下拉选择" prop="point">
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
  listVehicles,
  initVehicle,
  pausedVehicle,
} from "@/api/scheduler/vehicles";
import {getOrders,withdraw} from "@/api/scheduler/orders";
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
      // 订单表格数据
      ordersList: [],
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
      pausedParams: {
        name: undefined,
        pause: undefined,
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
    /** 查询订单列表 */
    getList() {
      this.loading = true;
      getOrders().then((response) => {
        this.ordersList = response.rows;
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
    withdraw(row) {
      if(row.dispensable){
        this.$modal.msgError("该订单无法被撤回");
      }else{
        this.$modal
          .confirm('是否撤回订单"' + row.name + '"？')
          .then(() => withdraw(row.name))
          .then(() => {
            this.getList();
            this.$modal.msgSuccess("撤回成功");
          })
          .catch(() => {});
      }
    },
  },
};
</script>
    