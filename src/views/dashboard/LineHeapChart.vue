<template>
  <div :class="className" :style="{minHeight:height,width:width}"/>
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'

// 折线堆叠图
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    xAxisData: {
      type: Array,
      default: () => {
        return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      }
    },
    seriesData: {
      type: Array,
      default: () => {
        return [{
          name: '示例1',
          type: 'line',
          stack: '总量',
          emphasis: {
            focus: 'series'
          },
          areaStyle: {
            // 改变区域颜色
            //color: '#fadb14'
          },
          // itemStyle: {
          //   normal: {
          //     // 折线点颜色
          //     color: '#d4b106',
          //     lineStyle: {
          //       // 折线颜色
          //       color: '#876800'
          //     }
          //   }
          // },
          // 光滑线条
          // smooth: true,
          data: [67, 6213, 66, 67, 78, 632, 1410, 4552, 4512, 555]
        }, {
          name: '示例2',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [120, 132, 101, 134, 90, 230, 210, 3466, 67, 36]
        }]
      }
    }
  },
  watch: {
    xAxisData: {
      deep: true,
      handler(val) {
        this.xAxisData = val
      }
    },
    seriesData: {
      deep: true,
      handler(val) {
        this.seriesData = val
        this.disposeChart()
        this.initChart()
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    this.disposeChart()
  },
  methods: {
    disposeChart() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'roma')
      this.drawChart()
    },
    drawChart() {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          left: 'center'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.xAxisData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: this.seriesData
      })
    }
  }
}
</script>
