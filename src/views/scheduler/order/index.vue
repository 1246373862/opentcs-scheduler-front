<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单编号" prop="postName">
        <el-input v-model="queryParams.name" placeholder="请输入订单编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">创建订单</el-button>
        <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="getList">刷新</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="ordersList">
      <el-table-column width="55" align="center" />
      <el-table-column label="订单编号" align="center" prop="name" />
      <el-table-column label="订单类型" align="center" prop="type" />
      <el-table-column label="订单状态" align="center" prop="state" />
      <el-table-column label="预定执行车辆" align="center" prop="intendedVehicle">
        <template slot-scope="scope">
          <span>{{
      scope.row.intendedVehicle === null
        ? "自动分配"
        : scope.row.intendedVehicle
    }}</span>
        </template></el-table-column>

      <el-table-column label="实际执行车辆" align="center" prop="processingVehicle" />
      <el-table-column label="无法撤回" align="center" prop="dispensable">
        <template slot-scope="scope">
          <span>{{ scope.row.paused ? "true" : "false" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="creationTime" />
      <el-table-column label="截止时间" align="center" prop="deadline" />
      <el-table-column label="完成时间" align="center" prop="finishedTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="detail(scope.row)">详情</el-button>
          <el-button size="mini" type="text" @click="update(scope.row)">更改预执行车辆</el-button>
          <el-button size="mini" type="text" @click="withdraw(scope.row)">撤回</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 订单详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-table v-loading="loading" :data="destinations">
          <el-table-column width="55" align="center" />
          <el-table-column label="目的地" align="center" prop="locationName" />
          <el-table-column label="操作" align="center" prop="operation" />
          <el-table-column label="当前状态" align="center" prop="state" />
        </el-table>
      </el-form>
    </el-dialog>
    <!-- 创建订单对话框 -->
    <el-dialog :title="titleAdd" :visible.sync="openAdd" width="500px" append-to-body>
      <el-form ref="form" :model="formAdd" label-width="80px" :rules="rulesAdd">
        <el-form-item label="执行车辆" prop="vehicleName">
          <el-select v-model="formAdd.vehicleName" placeholder="请下拉选择车辆名称(为空则自动分配)" clearable
            :style="{ width: '100%' }">
            <el-option v-for="item in vehicleList" :key="item.name" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="无法撤回" prop="dispensable">
          <el-select v-model="formAdd.dispensable" placeholder="false可撤回/ture不可撤回" clearable :style="{ width: '100%' }">
            <el-option :label="true" :value="true"></el-option>
            <el-option :label="false" :value="false"></el-option>
          </el-select>
        </el-form-item>

        <!-- 动态表单部分 -->
        <el-button @click="addRow" type="primary" size="mini">添加任务</el-button>
        <div>
          <el-form-item label="运输作业" v-for="(row, index) in formAdd.destinations" :key="index">
            <div>
              <el-select v-model="row.destLocationName" placeholder="请下拉选择目的地" clearable :style="{ width: '70%' }">
                <el-option v-for="item in locations" :key="item.name" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </div>
            <div> <el-select v-model="row.destOperation" placeholder="请下拉选择操作" clearable :style="{ width: '70%' }">
                <el-option v-for="item in operations" :key="item" :label="item" :value="item">
                </el-option>
              </el-select></div>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRow(index)">删除</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 更改预执行车辆对话框 -->
    <el-dialog :title="titleUpdate" :visible.sync="openUpdate" width="500px" append-to-body>
      <el-form ref="form" :model="formUpdate" label-width="80px">
        <el-form-item label="车辆" prop="point">
          <el-select v-model="formUpdate.vehicleName" placeholder="请选择车辆" clearable :style="{ width: '100%' }">
            <el-option v-for="item in vehicleList" :key="item.name" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormUpdate">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listVehicles
} from "@/api/scheduler/vehicles";
import {
  getLocations
} from "@/api/scheduler/map";
import {
  getOrders,
  withdraw,
  selectOneByName,
  createOrder,
  updateOrders
} from "@/api/scheduler/orders";
export default {
  name: "vehicles",
  dicts: ["sys_vehicles_procstatus", "sys_vehicles_status"],
  data() {
    return {
      titleAdd: "",
      titleUpdate: "",
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
      openAdd: false,
      openUpdate: false,
      operations: ["Load cargo", "NOP", "Unload cargo"],
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
      vehicleList: [],
      points: [],
      // 表单参数
      formAdd: {
        destinations: [
          { destLocationName: '123', destOperation: '123' } // 初始一行数据
        ]
      },
      form: {},
      formUpdate: {},
      destinations: [],
      locations: [],
      // 表单校验
      rules: {
        points: [
          { required: true, message: "初始点位不能为空", trigger: "blur" },
        ],
      },
      rulesAdd: {
        dispensable: [
          { required: true, message: "参数不能为空", trigger: "blur" },
        ],
        destinations: [
          { required: true, message: "运输任务不能为空", trigger: "blur" },
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询订单列表 */
    getList() {
      this.loading = true;
      getOrders(this.queryParams).then((response) => {
        this.ordersList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      this.loading = true;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openAdd = false;
      this.openUpdate = false;
      this.reset();
    },
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          createOrder(this.formAdd).then(response => {
            this.$modal.msgSuccess("创建订单成功");
            this.open = false;
            this.getList();
            this.cancel()
          });
        }
      });
    },
    submitFormUpdate: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateOrders(this.formUpdate).then(response => {
            this.$modal.msgSuccess("创建订单成功");
            this.open = false;
            this.getList();
            this.cancel()
          });
        }
      });
    }
    ,
    // 表单重置
    reset() {
      this.form = {};
      (this.formAdd = {}),
        this.formUpdate = {},
        this.resetForm("formUpdate");
      this.resetForm("form");
      this.resetForm("formAdd");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /**撤回按钮操作 */
    withdraw(row) {
      if (row.dispensable) {
        this.$modal.msgError("该订单无法被撤回");
      } else {
        this.$modal
          .confirm('是否撤回订单"' + row.name + '"？')
          .then(() => withdraw(row.name))
          .then(() => {
            this.getList();
            this.$modal.msgSuccess("撤回成功");
          })
          .catch(() => { });
      }
    },
    detail(row) {
      this.reset();
      selectOneByName(row).then((response) => {
        this.destinations = JSON.parse(response.data.destinations);
        this.open = true;
        this.title = "订单详情";
      });
      console.log(this.form);
    },
    update(row) {
      this.reset();
      this.formUpdate.name = row.name;
      this.getVehicles();
      this.openUpdate = true;
      this.titleUpdate = "更改预执行车辆";
    },
    getVehicles() {
      listVehicles(this.queryParams).then((response) => {
        this.vehicleList = response.rows;
      });
    },
    handleAdd() {
      this.reset();
      this.getVehicles();
      getLocations().then((response) => {
        this.locations = response.data;
      });
      this.openAdd = true;
      this.titleAdd = "创建订单";
    },
    addRow() {
      if (!this.formAdd.destinations) {
        this.$set(this.formAdd, "destinations", [
          { destLocationName: "", destOperation: "" },
        ]);
      } else {
        this.formAdd.destinations.push({
          destLocationName: "",
          destOperation: "",
        });
      }
    },
    deleteRow(index) {
      this.formAdd.destinations.splice(index, 1);
    },
  },
};
</script>