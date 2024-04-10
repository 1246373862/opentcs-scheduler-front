<template>
  <div :class="className" :style="{minHeight:height,width:width}"/>
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'

// 饼状平铺图
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
      default: '300px'
    },
    seriesData: {
      type: Array,
      default: () => {
        return [
          {
            name: '示例数据',
            type: 'pie',
            radius: '50%',
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: '{b} : {c} ({d}%)'
                },
                labelLine: { show: true }
              }
            },
            data: [
              { value: 1048, name: '类目一' },
              { value: 735, name: '类目二' },
              { value: 580, name: '类目三' }
            ]
          }
        ]
      }
    }
  },
  watch: {
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
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
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
