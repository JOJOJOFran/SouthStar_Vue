<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import { monthCount } from '@/api/statistical'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

const animationDuration = 6000

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
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      monthArr: [],//月份
      bussinessData: [],//公务用车
      emergencyData: []//应急执法
    }
  },
  mounted() {
    this.initData()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initData() {
      var listQuery = {
        startTime: this.getPreMonthDay(this.getLocalMonth(),6)+'-01',
        endTime: this.getLocalMonth()+'-30'
      }
      this.monthArr = []
      var d = new Date()
      var monthNum = d.getMonth()
      for(var i=monthNum;i>0;i--){
        var month = this.getPreMonthDay(this.getLocalMonth(),i);
        this.monthArr.push(month)
      }
      this.monthArr.push(this.getLocalMonth())
      monthCount(listQuery).then(response => {
        var data = response.data.datas;
        for (var i = 0; i < this.monthArr.length; i++) {
          var bussinessCount = 0
          var emergencyCount = 0
          for (var j = 0; j < data.length; j++) {
            if(this.monthArr[i] === data[j].date && data[j].carProperty === 0){
              bussinessCount = data[j].count
            }else if(this.monthArr[i] === data[j].date && data[j].carProperty === 1){
              emergencyCount = data[j].count
            }
          }
          this.bussinessData.push(bussinessCount)
          this.emergencyData.push(emergencyCount)
        }
        this.initChart()
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.monthArr,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '公务用车(次)',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.bussinessData,
          animationDuration
        }, {
          name: '应急执法(次)',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.emergencyData,
          animationDuration
        }, 
        // {
        //   name: 'pageC',
        //   type: 'bar',
        //   stack: 'vistors',
        //   barWidth: '60%',
        //   data: [30, 52, 200, 334, 390, 330, 220],
        //   animationDuration
        // }
        ]
      })
    },
    getLocalMonth(){
      var objD = new Date();
      var yy = objD.getYear();
      if (yy < 1900)
        yy = yy + 1900;
      var MM = objD.getMonth() + 1;
      // if (MM < 10)
      //   MM = '0' + MM;
      var dd = objD.getDate();
      if (dd < 10)
        dd = '0' + dd;
      var hh = objD.getHours();
      if (hh < 10)
        hh = '0' + hh;
      var mm = objD.getMinutes();
      if (mm < 10)
        mm = '0' + mm;
      var ss = objD.getSeconds();
      if (ss < 10)
        ss = '0' + ss;
      var str = yy + "-" + MM;
      return str;
    },
    //获取当前月份半年前的月份
    getPreMonthDay: function(date, monthNum) {
      let dateArr = date.split('-')
      let year = dateArr[0] //获取当前日期的年份
      let month = dateArr[1] //获取当前日期的月份
      let year2 = year
      let month2 = parseInt(month) - monthNum
      if (month2 <= 0) {
        year2 =
          parseInt(year2) -
          parseInt(month2 / 12 == 0 ? 1 : Math.abs(parseInt(month2 / 12)) + 1)
        month2 = 12 - (Math.abs(month2) % 12)
      }
      // if (month2 < 10) {
      //   month2 = '0' + month2
      // }
      let t2 = year2 + '-' + month2
      return t2
    }
  }
}
</script>
