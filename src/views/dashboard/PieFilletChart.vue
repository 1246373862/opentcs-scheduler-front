<template>
  <div :class="className" :style="{minHeight:height,width:width}"/>
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'

// 饼状环形圆角图
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
      default: '250px'
    },
    seriesData: {
      type: Array,
      default: () => {
        return [
          {
            name: '用户统计',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '15',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: '新增' },
              { value: 735, name: '冻结' },
              { value: 355, name: '活跃' }
            ]
          }
        ]
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
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'roma')
      this.drawChart()
    },
    drawChart() {
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          // formatter: '{a} <br/>{b} : {c} ({d}%)',
          formatter: '{b} : {c} ({d}%)',
          backgroundColor: 'rgba(255,255,255,0.8)',
          color: 'black',
          borderWidth: '1',
          borderColor: 'gray',
          textStyle: {
            color: 'black'
          }
        },
        legend: {
          left: 'center'
        },
        series: this.seriesData
      })
    }
  }
}
</script>
