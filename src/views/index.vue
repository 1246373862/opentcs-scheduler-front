<template>
  <div>
    <!--块类统计-->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card" shadow="hover">
          <h3>订单总量</h3>
          <div>
            <i class="el-icon-s-shop" style="color: purple"></i>
            <span v-text="ordersNum"></span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="hover">
          <h3>小车总量</h3>
          <div>
            <i class="el-icon-user-solid" style="color: green"></i>
            <span v-text="vehiclesNum"></span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="hover">
          <h3>在运行小车数量</h3>
          <div>
            <i class="el-icon-s-flag" style="color: red"></i>
            <span>28%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" shadow="hover">
          <h3>当前在线用户数</h3>
          <div>
            <i class="el-icon-star-on" style="color: blue"></i>
            <span>358</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--acharts统计图-->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="box-card" shadow="hover">
          <echarts1 />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" shadow="hover">
          <echarts2 />
        </el-card>
        <el-card class="box-card" shadow="hover">
          <echarts3 />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
 
<script>
import echarts1 from '@/views/echarts/echarts1'
import echarts2 from '@/views/echarts/echarts2'
import echarts3 from '@/views/echarts/echarts3'
import { getOrders } from "@/api/scheduler/orders";
import { listVehicles } from "@/api/scheduler/vehicles";
export default {
  name: 'home',
  data(){
    return {
      ordersNum: 0,
      vehiclesNum: 0,
    };
  },
  components: {
    echarts1,
    echarts2,
    echarts3
  },
  methods:{
    getOrders() {
      getOrders().then((response) => {
        this.ordersNum = response.rows.length;
      });
    },
    getVehicles() {
      listVehicles().then((response) => {
        this.vehiclesNum = response.rows.length;
      });
    },
  },
  created() {
    this.getOrders();
    this.getVehicles();
  }
}
</script>
 
<style scoped>
.el-card{
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
  margin-left: 20px;
  margin-right: 20px;
}
</style>