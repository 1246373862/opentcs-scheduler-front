<template>
  <div>
    <canvas ref="graphCanvas" width="1400" height="900"></canvas>
  </div>
</template>
  
  <script>
import { getMap, getLocations } from "@/api/scheduler/map";
import { listVehicles } from "@/api/scheduler/vehicles";
export default {
  name: "map",
  data() {
    return {
      points: [],
      locations: [],
      vehicles: [],
    };
  },
  created() {
    setInterval(() => {
      this.getLocations();
      this.getMap();
      this.getVehicles();
      this.renderGraph();
    }, 500);
  },
  methods: {
    getVehicles() {
      listVehicles().then((response) => {
        this.vehicles = response.rows;
      });
    },
    getLocations() {
      getLocations().then((response) => {
        this.locations = response.data;
      });
    },
    getMap() {
      getMap().then((response) => {
        this.points = response.data.points;
      });
    },
    renderGraph() {
      const canvas = this.$refs.graphCanvas;
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1.5;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.font = "12px Arial";

      this.locations.forEach((location) => {
        const x = location.position.x / 50;
        const y = location.position.y / -50;

        // 绘制location
        ctx.strokeStyle = "#000"; // 橙色
        ctx.strokeRect(x - 10, y - 10, 20, 20);

        // 显示位置名称
        ctx.fillStyle = "#000000";
        ctx.fillText(location.name, x + 10, y - 10); // 在正方形旁边显示位置名称

        // 连接位置中心与相应的点
        const attachedPoint = this.points.find(
          (point) => point.name === location.attachedLinks[0].point.name
        );
        if (attachedPoint) {
          ctx.setLineDash([5, 5]); // 设置虚线样式
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(
            attachedPoint.position.x / 50,
            attachedPoint.position.y / -50
          );
          ctx.stroke();
          ctx.setLineDash([]); // 恢复实线样式
        }
      });
      this.points.forEach((point) => {
        const x = point.position.x / 50;
        const y = point.position.y / -50;

        ctx.fillStyle = "#0000FF"; // 橙色
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(point.name, x, y + 20);

        // 绘制小车
        if (point.occupyingVehicle !== null) {
          drawVehicle(ctx, x, y, point.occupyingVehicle.name);
        }

        ctx.fillStyle = "#000000";
        point.outgoingPaths.forEach((path) => {
          const targetPoint = this.points.find(
            (p) => p.name === path.name.split(" --- ")[1]
          );
          if (targetPoint) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(
              targetPoint.position.x / 50,
              targetPoint.position.y / -50
            );
            ctx.stroke();

            // 根据 incomingPaths 和 outgoingPaths 属性确定箭头方向
            if (
              point.incomingPaths.some((inPath) => inPath.name === path.name)
            ) {
              // 箭头指向当前点
              drawArrow(ctx, x, y, x, y);
            } else {
              // 箭头指向下一个点
              drawArrow(
                ctx,
                x,
                y,
                targetPoint.position.x / 50,
                targetPoint.position.y / -50
              );
            }
          }
        });
      });
      // 绘制 allocatedResources 和 claimedResources 表示的路径
      this.vehicles.forEach((vehicle) => {
        vehicle.allocatedResources.forEach((resource) => {
          const start = this.points.find(
            (point) => point.name === resource.start
          );
          const end = this.points.find((point) => point.name === resource.end);
          if (start && end) {
            ctx.strokeStyle = 'green'; // 设置线条颜色为半透明绿色
            ctx.lineWidth = 7; // 设置线条粗度为3
            ctx.setLineDash([9, 9]); // 设置虚线样式
            ctx.beginPath();
            ctx.moveTo(start.position.x / 50, start.position.y / -50);
            ctx.lineTo(end.position.x / 50, end.position.y / -50);
            ctx.stroke();
            ctx.setLineDash([]); // 恢复实线样式
          }
        });

        vehicle.claimedResources.forEach((resource) => {
          const start = this.points.find(
            (point) => point.name === resource.start
          );
          const end = this.points.find((point) => point.name === resource.end);
          if (start && end) {
            ctx.strokeStyle = 'rgba(0, 128, 0, 0.5)'; // 设置线条颜色为半透明绿色
            ctx.lineWidth = 7; // 设置线条粗度为3
            ctx.setLineDash([9, 9]); // 设置虚线样式
            ctx.beginPath();
            ctx.moveTo(start.position.x / 50, start.position.y / -50);
            ctx.lineTo(end.position.x / 50, end.position.y / -50);
            ctx.stroke();
            ctx.setLineDash([]); // 恢复实线样式
          }
        });
      });
    },

  },
};

function drawArrow(ctx, fromX, fromY, toX, toY) {
  const headLength = 10; // 箭头长度
  const angle = Math.atan2(toY - fromY, toX - fromX);

  // 计算箭头顶点坐标
  const x1 = toX - headLength * Math.cos(angle - Math.PI / 6);
  const y1 = toY - headLength * Math.sin(angle - Math.PI / 6);
  const x2 = toX - headLength * Math.cos(angle + Math.PI / 6);
  const y2 = toY - headLength * Math.sin(angle + Math.PI / 6);

  // 绘制箭头线段
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(x1, y1);
  ctx.moveTo(toX, toY);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawVehicle(ctx, x, y, vehicleName) {
  // 绘制大一点的小车
  ctx.fillStyle = "#FF0000"; // 红色
  ctx.fillRect(x - 8, y - 8, 16, 16);

  // 显示车辆名称
  ctx.fillStyle = "#FF0000";
  ctx.fillText(vehicleName, x + 10, y - 10);
}
</script>
  
  <style>
canvas {
  background-color: #f1f1f1;
}
</style>
  