<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="车辆名称" prop="postName">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入车辆名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="procStatus">
          <el-select v-model="queryParams.procStatus" placeholder="车辆状态" clearable>
            <el-option
              v-for="dict in dict.type.sys_vehicles_procstatus"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
  
    
  
      <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="电量" align="center" prop="energyLevel" />
        <el-table-column label="当前位置" align="center" prop="currentPosition" />
        <el-table-column label="订单状态" align="center" prop="procStatus">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_vehicles_procstatus" :value="scope.row.procStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="订单编号" align="center" prop="transportOrder" />
        <el-table-column label="运行状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_vehicles_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:post:edit']"
            >订单详情</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:post:remove']"
            >暂停/恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
  
      <!-- 添加或修改车辆对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="车辆名称" prop="postName">
            <el-input v-model="form.postName" placeholder="请输入车辆名称" />
          </el-form-item>
          <el-form-item label="车辆编码" prop="postCode">
            <el-input v-model="form.postCode" placeholder="请输入编码名称" />
          </el-form-item>
          <el-form-item label="车辆顺序" prop="postSort">
            <el-input-number v-model="form.postSort" controls-position="right" :min="0" />
          </el-form-item>
          <el-form-item label="车辆状态" prop="procStatus">
            <el-radio-group v-model="form.procStatus">
              <el-radio
                v-for="dict in dict.type.sys_vehicles_procstatus"
                :key="dict.value"
                :label="dict.value"
              >{{dict.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
  import { listPost, getPost, delPost, addPost, updatePost } from "@/api/system/post";
  import {listVehicles} from "@/api/scheduler/vehicles";
  export default {
    name: "Post",
    dicts: ['sys_vehicles_procstatus','sys_vehicles_status'],
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
          procStatus: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          postName: [
            { required: true, message: "车辆名称不能为空", trigger: "blur" }
          ],
          postCode: [
            { required: true, message: "车辆编码不能为空", trigger: "blur" }
          ],
          postSort: [
            { required: true, message: "车辆顺序不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询车辆列表 */
      getList() {
        this.loading = true;
        listVehicles(this.queryParams).then(response => {
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
          postId: undefined,
          postCode: undefined,
          postName: undefined,
          postSort: 0,
          procStatus: "0",
          remark: undefined
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
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.postId)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加车辆";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const postId = row.postId || this.ids
        getPost(postId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改车辆";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.postId != undefined) {
              updatePost(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addPost(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const postIds = row.postId || this.ids;
        this.$modal.confirm('是否确认删除车辆编号为"' + postIds + '"的数据项？').then(function() {
          return delPost(postIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('system/post/export', {
          ...this.queryParams
        }, `post_${new Date().getTime()}.xlsx`)
      }
    }
  };
  </script>
  