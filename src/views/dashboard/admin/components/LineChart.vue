<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import { dayCount } from '@/api/statistical'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null,
      dayArr: [],//天
      bussinessData: [],//公务用车
      emergencyData: []//应急执法
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.initData()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }

    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initData() {
      var listQuery = {
        startTime: this.getLocalMonth()+'-1',
        endTime: this.getLocalDate()
      }
      this.dayArr = []
      var date = new Date()
      var dateCount = date.getDate()
      var month = date.getMonth() +1
      var year = date.getFullYear()
      for(var i=1; i < dateCount+1; i++){
        var day = year+'-'+ month + '-' + i;
        this.dayArr.push(day)
      }
      dayCount(listQuery).then(response => {
        var data = response.data.datas;
        for (var i = 0; i < this.dayArr.length; i++) {
          var bussinessCount = 0
          var emergencyCount = 0
          for (var j = 0; j < data.length; j++) {
            if(this.dayArr[i] === data[j].date && data[j].carProperty === 0){
              bussinessCount = data[j].count
            }else if(this.dayArr[i] === data[j].date && data[j].carProperty === 1){
              emergencyCount = data[j].count
            }
          }
          this.bussinessData.push(bussinessCount)
          this.emergencyData.push(emergencyCount)
        }
        this.initChart()
      })
    },
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        xAxis: {
          data: this.dayArr,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['公务用车(次)', '应急执法(次)']
        },
        series: [{
          name: '公务用车(次)', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: this.bussinessData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '应急执法(次)',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: this.emergencyData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
     getLocalMonth(){
      var objD = new Date();
      var yy = objD.getYear();
      if (yy < 1900)
        yy = yy + 1900;
      var MM = objD.getMonth() + 1;
      var str = yy + "-" + MM;
      return str;
    },
    getLocalDate(){
        var objD = new Date();
        var yy = objD.getYear();
        if (yy < 1900)
          yy = yy + 1900;
        var MM = objD.getMonth() + 1;
        var dd = objD.getDate();
        var str = yy + "-" + MM + "-" + dd;
        return str;
      },
  }
}
</script>
