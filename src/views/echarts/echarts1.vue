<template>
    <div style="width: auto;height: 470px" id="echarts1">
    </div>
  </template>
   
  <script>
  import echarts from 'echarts'
  const colors = ['#5470C6', '#EE6666']
  export default {
    name: 'echarts1',
    data () {
      return {
        // option配置
        option: {
          color: colors,
          tooltip: {
            trigger: 'none',
            axisPointer: {
              type: 'cross'
            }
          },
          legend: {},
          grid: {
            top: 70,
            bottom: 50
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                alignWithLabel: true
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: colors[1]
                }
              },
              axisPointer: {
                label: {
                  formatter: function (params) {
                    return (
                      'Precipitation  ' +
                      params.value +
                      (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                    )
                  }
                }
              },
              // prettier-ignore
              data: ['2023-1', '2023-2', '2023-3', '2023-4', '2023-5', '2023-6', '2023-7', '2023-8', '2023-9', '2023-10', '2023-11', '2023-12']
            },
            {
              type: 'category',
              axisTick: {
                alignWithLabel: true
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: colors[0]
                }
              },
              axisPointer: {
                label: {
                  formatter: function (params) {
                    return (
                      'Precipitation  ' +
                      params.value +
                      (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                    )
                  }
                }
              },
              // prettier-ignore
              data: ['2024-1', '2024-2', '2024-3', '2024-4', '2024-5', '2024-6', '2024-7', '2024-8', '2024-9', '2024-10', '2024-11', '2024-12']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '订单数(2024)',
              type: 'line',
              xAxisIndex: 1,
              smooth: true,
              emphasis: {
                focus: 'series'
              },
              data: [
                2, 5, 9, 26, 28, 70, 175, 182, 48, 18, 6, 2
              ]
            },
            {
              name: '订单数(2023)',
              type: 'line',
              smooth: true,
              emphasis: {
                focus: 'series'
              },
              data: [
                3, 5, 11, 18, 48, 69, 231, 46, 55, 18, 10, 0
              ]
            }
          ]
        }
      }
    },
    mounted () {
      this.echartsInit()
    },
    methods: {
      echartsInit () {
        // 在生命周期中挂载
        echarts.init(document.getElementById('echarts1')).setOption(this.option)
      }
    }
  }
  </script>
   
  <style scoped>
   
  </style>