<template>
    <div style="width: auto;height: 225px" id="echarts2">
    </div>
  </template>
   
  <script>
  import echarts from 'echarts'
  export default {
    name: 'echarts2',
    data () {
      return {
        // option配置
        option: {
          title: {
            text: 'Referer of a Website',
            subtext: 'Fake Data',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '50%',
              data: [
                { value: 1048, name: 'Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union' },
                { value: 300, name: 'Video' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
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
        echarts.init(document.getElementById('echarts2')).setOption(this.option)
      }
    }
  }
  </script>
   
  <style scoped>
   
  </style>