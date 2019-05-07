<template>
  <div class="body-panel">
    <link rel="stylesheet" href="http://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.css" >
    <div id="allmap" style="width: 100%;height:100%;z-index: 0"/>
    <div style="height:100px;z-index: 10;position: absolute;top:0px;left:30px;right: 30px;">
      <panel-group @handleSetLineChartData="handleSetLineChartData"/>
    </div>

    <!--<baidu-map class="bm-view" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler" >-->
    <bm-info-window :position="{lng: 0, lat: 0}" :show="infoWindow.show" title="Info Window Title" @close="infoWindowClose" @open="infoWindowOpen">
      <!--<p v-text="infoWindow.contents"></p>-->
      <span style="font-weight:bold">车辆：</span><span style="color:#0A8CFF" @click="infoWindowClose()">1111</span><br>
      <span style="font-weight:bold">类型：</span><span style="color:#0A8CFF">2222</span><br>
      <button @click="clear">Clear</button>
    </bm-info-window>

    <!--<bm-marker :position="markerPoint" :dragging="true" animation="BMAP_ANIMATION_BOUNCE" :icon="{url: 'http://developer.baidu.com/map/jsdemo/img/fox.gif', size: {width: 300, height: 157}}"></bm-marker>-->

    <!--</baidu-map>-->

  </div>
</template>

<script>
import { queryCars } from '@/api/baiduApi'
import jsonp from 'jsonp'
import Vue from 'vue'
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'zGObvGv0ofXzW7TpsYCtwTgCp8OGtfTw'
})

import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

// var MyComponent = Vue.extend({
//   template: '<a style="color:#07bb49;" v-on:click="world()">add Shop</a>',
//   methods:{
//     world() {
//       alert(222);
//     }
//   }
// });
// var component = new MyComponent().$mount();

// var WindowComponent=Vue.extend({
//   template: '<a id="fastPai" v-on:click="sendOrder()" href="javascript:" style="text-decoration:underline;margin-left:120px;color:blue !important">快速派车</a>' +
//             '<a id="queryTrajectory" v-on:click="queryTrajectory()" href="javascript:" style="text-decoration:underline;margin-left:10px;color:blue !important">轨迹查询</a>',
//   methods:{
//     sendOrder() {
//       alert(111);
//     },
//     queryTrajectory(){
//       alert(222);
//     }
//   }
// });

export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      carList: null,
      map: null,
      menuIndex: 0, // 类别
      keyword: '', // 关键字
      markerPoint: null, // 记住气泡，页面刷新后重构
      markerData: {}, // 记住气泡，页面刷新后重构
      infoWindow: {
        show: true,
        contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      },
      center: { lng: 0, lat: 0 },
      zoom: 3,
      markerPoint: { lng: 0, lat: 0 },
      points: []
    }
  },
  mounted() {
    this.loadMap()
  },
  methods: {
    handler({ BMap, map }) {
      console.log(BMap, map)
      this.center.lng = 0
      this.center.lat = 0
      this.zoom = 15
    },
    infoWindowClose(e) {
      this.infoWindow.show = false
    },
    infoWindowOpen(e) {
      this.infoWindow.show = true
    },
    clear() {
      this.infoWindow.contents = ''
    },

    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    loadMap() {
      // 百度地图API功能
      this.map = new BMap.Map('allmap') // 创建Map实例
      this.map.centerAndZoom(new BMap.Point(114.32, 30.38), 14) // 初始化地图,设置中心点坐标和地图级别
      // this.map.centerAndZoom(new BMap.Point(0, 0), 14) ;// 初始化地图,设置中心点坐标和地图级别
      this.map.addControl(new BMap.ScaleControl()) // 添加比例尺控件
      // 添加地图类型控件
      this.map.addControl(new BMap.MapTypeControl({
        mapTypes: [
          BMAP_NORMAL_MAP,
          BMAP_HYBRID_MAP
        ],
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT
      }))
      this.map.addControl(new BMap.ScaleControl())
      this.map.setCurrentCity('武汉') // 设置地图显示的城市 此项是必须设置的
      this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放

      setInterval(this.queryCars, 10000)
    },
    queryCars() {
      var data = {
        ak: 'zGObvGv0ofXzW7TpsYCtwTgCp8OGtfTw',
        service_id: '200846'
        // filter: "entityType:A"
        // 加入类型、关键字
      }
      jsonp('http://yingyan.baidu.com/api/v3/entity/list?ak=zGObvGv0ofXzW7TpsYCtwTgCp8OGtfTw&service_id=200846', data, (err, response) => {
        if (err) {
          Message({
            message: err.message,
            type: 'error',
            duration: 5 * 1000
          })
        } else {
          if (response.entities.length > 0) {
            console.log(response)
            this.loadEntities(response.entities)
          }
        }
      })
    },
    loadEntities(data) {
      this.map.clearOverlays()
      var that = this
      for (var i = 0; i < data.length; i++) {
        var lastTime = this.GetUnixTime(data[i].modify_time)
        var onlineStatus = this.getOnlineStatus(lastTime)// 在线状态 0在线 1离线

        var imgName = this.getDirection(data[i].latest_location.direction, onlineStatus)
        var imgUrl = '../../../../src/icons/imgs/' + imgName// 根据方向选择图片

        var pt = new BMap.Point(data[i].latest_location.longitude, data[i].latest_location.latitude)
        var myIcon1 = new BMap.Icon(imgUrl, new BMap.Size(40, 50))
        var marker = new BMap.Marker(pt, { icon: myIcon1 }) // 创建标注
        var speed = data[i].latest_location.speed ? data[i].latest_location.speed : 0
        marker.customData = {
          entity_desc: data[i].entity_desc,
          longitude: data[i].latest_location.longitude,
          latitude: data[i].latest_location.latitude,
          loc_time: data[i].latest_location.loc_time,
          entity_type: data[i].entity_type,
          speed: speed
        }
        var longitude = parseFloat(data[i].latest_location.longitude)
        var pt1 = new BMap.Point(longitude, data[i].latest_location.latitude) // 设置文本偏移量);
        var label = new BMap.Label(data[i].entity_desc + ',' + speed + 'km/h', pt1)
        label.setOffset(new BMap.Size(30, 10))
        label.setStyle({ border: '1px solid #0A8CFF' })
        marker.setLabel(label)
        this.map.addOverlay(marker)
        // 设置事件
        marker.addEventListener('click', function(e) {
          that.createMessageBox(pt1, e.target.customData)
        })
      }
      if (this.markerPoint != null) {
        this.createMessageBox(pt1, this.markerData)
      }
    },
    // 获取Unix时间戳
    GetUnixTime(timeStr) {
      var time = new Date(timeStr)
      return (time.getTime() / 1000)
    },
    // 将unix时间转换成一般时间
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate() + ' '
      var h = date.getHours() + ':'
      var m = date.getMinutes() + ':'
      var s = date.getSeconds()
      return Y + M + D + h + m + s
    },
    // 判断当前设备是否在线，规则是最后上传的轨迹点
    // 时间在当前系统时间十分钟内判断为在线，否则为离线
    // param {number} time UNIX时间戳
    // return {number} 在线状态 0在线 1离线
    getOnlineStatus(time) {
      var status = 0
      var timestamp = new Date().getTime() / 1000
      var timeDiff = (timestamp - time) / 60
      status = timeDiff >= 10 ? 1 : 0
      return status
    },
    getDirection(direction, onlineStatus) {
      var directionImg = ''
      direction = direction || 0
      if (onlineStatus == 0) { // 在线
        switch (Math.floor((direction) / 22.5)) {
          case 0:
          case 15:
            directionImg = 'online/online_0度.png'
            break
          case 1:
          case 2:
            directionImg = 'online/online_45度.png'
            break
          case 3:
          case 4:
            directionImg = 'online/online_90度.png'
            break
          case 5:
          case 6:
            directionImg = 'online/online_135度.png'
            break
          case 7:
          case 8:
            directionImg = 'online/online_180度.png'
            break
          case 9:
          case 10:
            directionImg = 'online/online_225度.png'
            break
          case 11:
          case 12:
            directionImg = 'online/online_270度.png'
            break
          case 13:
          case 14:
            directionImg = 'online/online_315度.png'
            break
        }
      } else if (onlineStatus == 1) { // 离线
        switch (Math.floor((direction) / 22.5)) {
          case 0:
          case 15:
            directionImg = 'outline/outline_0度.png'
            break
          case 1:
          case 2:
            directionImg = 'outline/outline_45度.png'
            break
          case 3:
          case 4:
            directionImg = 'outline/outline_90度.png'
            break
          case 5:
          case 6:
            directionImg = 'outline/outline_135度.png'
            break
          case 7:
          case 8:
            directionImg = 'outline/outline_180度.png'
            break
          case 9:
          case 10:
            directionImg = 'outline/outline_225度.png'
            break
          case 11:
          case 12:
            directionImg = 'outline/outline_270度.png'
            break
          case 13:
          case 14:
            directionImg = 'outline/outline_315度.png'
            break
        }
      }
      return directionImg
    },
    // 创建信息框
    createMessageBox(point, data) {
      this.infoWindowOpen()
      // var that=this;
      // this.markerPoint = point;
      // this.markerData = data;
      // var myGeo = new BMap.Geocoder();
      // // 根据坐标得到地址描述
      // myGeo.getLocation(point, function (result) {
      //   if (result) {
      //     var address = result.address;
      //     // var component= new WindowComponent();
      //     // component=component.$mount();
      //     // console.log(component);
      //     // var htmlStr = component.$options.template;
      //     // console.log(htmlStr);
      //     var content = '<div style="margin:0;line-height:30px;padding:2px;">' +
      //       '<span style="font-weight:bold">车辆：</span><span style="color:#0A8CFF">' + data.entity_desc + '</span><br/>' +
      //       '<span style="font-weight:bold">类型：</span><span style="color:#0A8CFF">' + '公务用车组' + '</span><br/>' +
      //       '<span style="font-weight:bold">速度：</span><span style="color:#0A8CFF">' + data.speed + 'km/h </span><br/>' +
      //       '<span style="font-weight:bold">地址：</span><span style="color:#0A8CFF" title="' + address + '">' + address + '</span><br/>' +
      //       '<span style="font-weight:bold">定位：</span><span style="color:#0A8CFF">' + data.longitude + ',' + data.latitude + '</span><br/>' +
      //       '<span style="font-weight:bold">时间：</span><span style="color:#0A8CFF">' + that.timestampToTime(data.loc_time) + '</span><br/>' +
      //       '</div>' +
      //       '<div style="margin:0;line-height:30px;padding:2px;">' +
      //       '<a id="fastPai" href="javascript:" style="text-decoration:underline;margin-left:120px;color:blue !important">快速派车</a>' +
      //       '<a id="queryTrajectory" @click="queryTrajectory()" href="javascript:" style="text-decoration:underline;margin-left:10px;color:blue !important">轨迹查询</a>'+
      //       '</div>';
      //
      //     // var component= new MyComponent();
      //     // component=component.$mount();
      //     var searchInfoWindow = new BMapLib.SearchInfoWindow(that.map, content, {
      //       title: "详 情", //标题
      //       width: 220, //宽度
      //       height: 220, //高度
      //       enableSendToPhone: false,
      //       panel: "panel", //检索结果面板
      //       enableAutoPan: true, //自动平移
      //       searchTypes: [
      //       ]
      //     });
      //     searchInfoWindow.open(point);
      //   }
      // });
    },
    // 轨迹查询
    queryTrajectory() {
      alert(111)
    }
    // sendOrder(){
    //   alert(222);
    // }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.body-panel{
  position: absolute;
  top:0px;
  left:0px;
  right: 0px;
  bottom: 0px;
}
.bm-view {
  width: 100%;height:100%;z-index: 0
}
</style>
