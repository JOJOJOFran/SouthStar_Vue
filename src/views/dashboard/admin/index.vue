<template>
  <div class="body-panel">
    <link rel="stylesheet" href="http://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.css" >
    
    <div style="height:100px;z-index: 10;position: absolute;top:0px;left:30px;right: 30px;">
      <panel-group @handleSetLineChartData="handleSetLineChartData" style="height:100px;margin-top:10px;"/>
    </div>

    <baidu-map class="bm-view" :center="center" :zoom="14" :scroll-wheel-zoom="true" @ready="handler">
        <!-- <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type> -->
        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>

        <bm-marker v-for="(marker,index) of markList" :key="index" @click="infoWindowOpen(index)" :position="{lng: markList[index].lng, lat: markList[index].lat}" :icon="{url:markList[index].icon, size: {width: 40, height: 50}}">
            <bm-label :content="markList[index].plateNumber" :position="{lng: markList[index].lng, lat: markList[index].lat}" :offset="labelOffset" :labelStyle="{color: 'blue', fontSize : '12px'}"/>
        </bm-marker>

      <bm-info-window :show="isShow" :position="infoPoints" @close="infoWindowClose" title="实时位置详情" style="line-height:30px;padding:2px;">
          <span style="font-weight:bold">车辆：</span><span style="color:#0A8CFF;">{{infoData.plateNumber}}</span><br/>
          <span style="font-weight:bold">车架号：</span><span style="color:#0A8CFF;">{{infoData.vinCode}}</span><br/>
          <span style="font-weight:bold">发动机号：</span><span style="color:#0A8CFF;">{{infoData.deviceNumber}}</span><br/>
          <span style="font-weight:bold">类型：</span><span style="color:#0A8CFF;">{{infoData.entityType}}</span><br/>
          <span style="font-weight:bold">速度：</span><span style="color:#0A8CFF;">{{infoData.speed}}km/h</span><br/>
          <span style="font-weight:bold">地址：</span><span style="color:#0A8CFF;">{{infoData.location}}</span><br/>
          <span style="font-weight:bold">定位：</span><span style="color:#0A8CFF;">{{infoData.lng+','+infoData.lat}}</span><br/>
          <span style="font-weight:bold">时间：</span><span style="color:#0A8CFF;">{{infoData.time}}</span><br/>
          <a @click="handleOrder()" style="text-decoration:underline;color:blue !important;">快速派车</a>
          <a @click="handleTrajectory()"  style="text-decoration:underline;margin-left:10px;color:blue !important;">轨迹查询</a>
        </bm-info-window>
        <bm-polygon :path="polygonPath" stroke-color="red" :stroke-opacity="1" :fillOpacity="0" :fillColor="''" :stroke-weight="3" :editing="false" :strokeStyle="'solid'"/>
    </baidu-map>
    <div style="z-index:10;position:absolute;left:10px;bottom: 10px;width:150px;height:70px;background-color: white;">
         <el-checkbox-group   v-model="checkFenceOne" class="checkGroup" style="width:150px;height:70px;">
              <el-checkbox  v-for="(item,index1) in fenceList" :label="item.fence_name"  :key="item.district"  
                           style="margin-left:15px;margin-top:10px"
                           @change="checked=>handleCheckedFenceChange(checked,item)">{{item.fence_name}}</el-checkbox>
         </el-checkbox-group>
    </div>
     <!--轨迹查询弹窗-->
    <el-dialog :title="$t('userAndCarTable.queryTrajectory')" :visible.sync="dialogFormVisible" id="" width="90%">
      <div class="filter-container">
      <el-form ref="dataForm"   label-position="left" label-width="100px">
        <el-row style="margin-top: -25px !important;">
          <el-col :span="6">
            <el-form-item :label="$t('userAndCarTable.plateNumber')">
              <el-select v-model="trajectoryParam.entity_name" :placeholder="$t('userAndCarTable.plateNumber')" class="filter-item">
                <el-option v-for="item in carOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" :label="$t('applyTable.beginTime')">
              <el-date-picker v-model="trajectoryParam.start_time" type="datetime"  :placeholder="$t('applyTable.beginTime')"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" :label="$t('applyTable.endTime')">
              <el-date-picker v-model="trajectoryParam.end_time" type="datetime"  :placeholder="$t('applyTable.endTime')"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('userAndCarTable.minLong')">
              <el-select v-model="trajectoryParam.radius_threshold" :placeholder="$t('userAndCarTable.minLong')" style="width: 230px">
                <el-option v-for="item in longOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-button type="primary" icon="el-icon-search" @click="searchTrajectory()">{{ $t('table.search') }}</el-button>
            <el-button :loading="downloadLoading" type="primary" icon="el-icon-download" @click="exportTrajectory">{{ $t('table.export') }}</el-button>
          </el-col>
        </el-row>
        <div style="width: 100%;height: 500px;margin-top: 20px;">
          <baidu-map class="bm-dialog" :center="{lng: 114.32, lat: 30.38}" :zoom="14" :scroll-wheel-zoom="true" @ready="handler">
            <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
            <bm-polyline :path="trackPoints" stroke-color="blue" :stroke-opacity="1" :stroke-weight="5" :editing="false" :strokeStyle="'solid'" ></bm-polyline>
            <bm-marker v-show="showStartAndEnd" :position="{lng:startMarker.lng,lat:startMarker.lat}" :dragging="true" :icon="{url:startMarker.icon, size: {width: 32, height: 32}}" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
            <bm-marker v-show="showStartAndEnd" :position="{lng:endMarker.lng,lat:endMarker.lat}" :dragging="true" :icon="{url:endMarker.icon, size: {width: 32, height: 32}}" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
          </baidu-map>
        </div>
      </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import jsonp from 'jsonp'
import Vue from 'vue'
import BaiduMap from 'vue-baidu-map'
import {BmlMarkerClusterer} from 'vue-baidu-map'
import {BmlLushu} from 'vue-baidu-map'
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'zGObvGv0ofXzW7TpsYCtwTgCp8OGtfTw'
})

import outline0 from '@/assets/outline/outline_0度.png'
import outline45 from '@/assets/outline/outline_45度.png'
import outline90 from '@/assets/outline/outline_90度.png'
import outline135 from '@/assets/outline/outline_135度.png'
import outline180 from '@/assets/outline/outline_180度.png'
import outline225 from '@/assets/outline/outline_225度.png'
import outline270 from '@/assets/outline/outline_270度.png'
import outline315 from '@/assets/outline/outline_315度.png'

import online0 from '@/assets/online/online_0度.png'
import online45 from '@/assets/online/online_45度.png'
import online90 from '@/assets/online/online_90度.png'
import online135 from '@/assets/online/online_135度.png'
import online180 from '@/assets/online/online_180度.png'
import online225 from '@/assets/online/online_225度.png'
import online270 from '@/assets/online/online_270度.png'
import online315 from '@/assets/online/online_315度.png'

import start from '@/assets/起点.png'
import end from '@/assets/终点.png'

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
    BoxCard,
    GithubCorner,
    BmlMarkerClusterer
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      isShow: false,
      infoPoints:{
        lng:0,
        lat:0,
      },
      infoData:{
        lng:0,
        lat:0,
        icon:'',
        entityName:'',
        plateNumber:'',
        entityType:'',
        speed:0,
        time:'',
        location:'',
        deviceNumber:'',
        vinCode:''
      },
      polygonPath:[],
      trackPoints:[],
      list: null,
      markList:[],
      fenceList:null,
      checkFenceOne:[],
      listQuery: {
        ak:'zGObvGv0ofXzW7TpsYCtwTgCp8OGtfTw',
        service_id:'200846'
      },
      checkData:[],
      checkKey:[],
      map:null,
      markerPoint:null,//记住气泡，页面刷新后重构
      markerData: {}, //记住气泡，页面刷新后重构
      dialogFormVisible: false,
      dispachFormVisible: false,
      trajectoryParam: {
        ak:'zGObvGv0ofXzW7TpsYCtwTgCp8OGtfTw',
        service_id: '200846',
        start_time: this.getLastDatetime(),
        end_time: this.getLocalDatetime(),
        entity_name: '',
        is_processed: 1,
        radius_threshold:20
      },
      carOptions:[],
      longOptions:[{key:'100',display_name:'100'},{key:'50',display_name:'50'},{key:'20',display_name:'20'}],
      downloadLoading: false,
      play: true,
      icon: {
        url: 'http://api.map.baidu.com/library/LuShu/1.2/examples/car.png',
        size: {width: 52, height: 26},
        opts: {anchor: {width: 27, height:13}}
      },
      m:0,
      exportData:[],
      zoom:15,
      center:{lng: 114.32, lat: 30.38},
      labelOffset:new BMap.Size(40, 10),
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],

      vehicleDetail:{
        plateNumber: '',
        currentState: '',
        departmentName: '',
        vehicleProperties: ''
      },
      applyDetail:{
        applyId:'',
        applyNum: '',
        departmentName: '',
        carProperty: '',
        carType:'',
        userName:'',
        userMobile:'',
        startPoint: '',
        destination: '',
        startPlanTime:'',
        backPlanTime:''
      },
      dispatchModel:{
        driverId: '',
        driverName: '',
        driverPhone: '',
        vehicleId: '',
        plateNumber: '',
        dispatchType: 1,
        queueNo: 0,
        queueId: ''
      },
      startMarker:{lng:0,lat:0,icon:start},//轨迹起点
      endMarker:{lng:0,lat:0,icon:end},//轨迹终点
      showStartAndEnd:false,
    }
  },
  mounted() {
     this.queryCars();
     this.init();
     this.queryFences();
  },
  methods: {
    init(){
      setInterval(this.queryCars,20000);
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    handler ({BMap, map}) {
      this.zoom = 15;
    },
    infoWindowClose (e) {
       this.isShow = false;
    },
    infoWindowOpen (index) {
      var that=this;
      var e=that.markList[index];
      that.infoPoints.lng = e.lng;
      that.infoPoints.lat = e.lat;

      var point = new BMap.Point(e.lng, e.lat);
      var myGeo = new BMap.Geocoder();
      // 根据坐标得到地址描述
      myGeo.getLocation(point, function (result) {
        e.location = result.address;
        that.infoData.lat=e.lat;
        that.infoData.lng=e.lng;
        that.infoData.icon=e.icon;
        that.infoData.plateNumber=e.plateNumber;
        that.infoData.entityType=e.entityType;
        that.infoData.speed=e.speed;
        that.infoData.location=e.location;
        that.infoData.time=e.time;
        that.infoData.entityName=e.entityName;
        that.infoData.deviceNumber=e.deviceNumber;
        that.infoData.vinCode=e.vinCode;

        that.trajectoryParam.entity_name=e.entityName;
        that.isShow = true;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleCheckedFenceChange(val,item){
      this.checkFenceOne=[];
      if(val){
        this.checkFenceOne.push(item.fence_name);
         var areaName = item.district;
        this.getBoundary(areaName);
      }else{
        this.polygonPath=[];
      }
    },
    //快递派车
    handleOrder(){
        this.$message({
              message: '暂未开放此功能',
              type: 'success'
        });
      // queryItemByPlateNum({plateNum:this.infoData.plateNumber}).then(response => {
      //   if(response.data.datas){
      //     var model = response.data.datas;
      //     this.vehicleDetail={
      //       plateNumber: model.plateNumber,
      //       currentState: model.currentState,
      //       departmentName: model.departmentId,
      //       vehicleProperties: model.vehicleProperties,
      //     };
      //     this.dispatchModel.vehicleId= model.id;
      //     this.dispatchModel.plateNumber=model.plateNumber;
      //   }
      //   this.dispachFormVisible = true;
      //   this.$nextTick(() => {
      //     this.$refs['dataForm'].clearValidate()
      //   })
      // });
    },
     //初始化围栏列表
    queryFences(){
      jsonp('http://yingyan.baidu.com/api/v3/fence/list?ak=zGObvGv0ofXzW7TpsYCtwTgCp8OGtfTw&service_id=200846&fence_ids=6,7,8', {fence_ids: '6,7,8'}, (err, response) =>{
        if (err) {
          Message({
            message: err.message,
            type: 'error',
            duration: 5 * 1000
          })
        } else {
          this.fenceList=response.fences;
        }
      })
    },
    queryCars(){
      var unixTime = this.GetUnixTime(this.getLocalDatetime());
      jsonp('http://yingyan.baidu.com/api/v3/entity/list?ak=zGObvGv0ofXzW7TpsYCtwTgCp8OGtfTw&service_id=200846&_='+unixTime, this.listQuery, (err, response) => {
        if (err) {
          Message({
            message: err.message,
            type: 'error',
            duration: 5 * 1000
          })
        } else {
          if (response.entities.length > 0) {
            var result = response.entities;
            if (result.length == 0) {
              Message({
                message: '暂无数据！',
                type: 'warning',
                duration: 5 * 1000
              });
              return;
            }
            this.list=[];
            this.list=result;

            var treeData=[];
            treeData=[{
              id:0,
              //icon:"el-icon-delete",
              //icon:'node-icon-park',
              label:'全部',
              children:[
                {
                  id: 1,
                  label: '公务用车组',
                  children: []
                },
                {
                  id: 2,
                  label: '应急执法组',
                  children: []
                }
              ]
            }];
            this.carOptions=[];
            for(var i=0;i<result.length;i++){
              var obj = {
                key: result[i].entity_name,
                display_name: result[i].entity_desc
              }
              this.carOptions.push(obj);
              var onlineStatus = 0; //在线状态 1在线 0离线
              var lastTime = this.GetUnixTime(result[i].modify_time);
              onlineStatus = this.getOnlineStatus(lastTime);
              //判断是否静止
              var speed=result[i].latest_location.speed?result[i].latest_location.speed:0;
              var isMove = this.getSpeed(speed);
              var icon = "";
              var statusName="";
              if (onlineStatus == 1) {
                icon = "node-icon-outline";
                statusName="离线";
              }
              else if (onlineStatus == 0) {
                if (isMove == "静止") {
                  // icon = "node-icon-park";
                  icon = "node-icon-online";
                  statusName="停车";
                } else {
                  icon = "node-icon-online";
                  statusName="在线";
                }
              }
              if(result[i].entityType == "公务用车组"){
                treeData[0].children[0].children.push({id:1+'_'+i,icon:icon,desc:result[i].entity_desc,lat:result[i].latest_location.latitude,lng:result[i].latest_location.longitude,label:result[i].entity_desc+" ( "+statusName+" )"});
              }else {
                treeData[0].children[1].children.push({id:2+'_'+i,icon:icon,desc:result[i].entity_desc,lat:result[i].latest_location.latitude,lng:result[i].latest_location.longitude,label:result[i].entity_desc+" ( "+statusName+" )"});
              }
            }
            var count0=treeData[0].children[0].children.length;
            var count1=treeData[0].children[1].children.length;
            treeData[0].label+='('+result.length+'辆)';
            treeData[0].children[0].label+='('+count0+'辆)';
            treeData[0].children[1].label+='('+count1+'辆)';
            this.data2=treeData;

            if(this.checkData.length==0){
              this.loadEntities(this.list);
            }else {
              this.GetCheckEntities(this.checkData);
            }
          }
        }
      })
    },
    loadEntities(data) {
      var that=this;
      that.markList=[]; 

      for (var x = 0; x < data.length; x++) {
        var lastTime = this.GetUnixTime(data[x].modify_time);
        var onlineStatus = this.getOnlineStatus(lastTime);//在线状态 0在线 1离线
        //判断是否静止
        var speed=data[x].latest_location.speed?data[x].latest_location.speed:0;
        var isMove = this.getSpeed(speed);

        var imgName = this.getDirection(data[x].latest_location.direction, onlineStatus);
        // var imgUrl = "../../../../src/icons/imgs/" + imgName;//根据方向选择图片
        var obj={
          lng:data[x].latest_location.longitude,
          lat:data[x].latest_location.latitude,
          icon:imgName,
          entityName:data[x].entity_name,
          plateNumber:data[x].entity_desc,
          entityType:data[x].entityType,
          speed:data[x].latest_location.speed?data[x].latest_location.speed:0,
          time:this.timestampToTime(data[x].latest_location.loc_time),
          location:'',
          deviceNumber:data[x].deviceNumber,
          vinCode:data[x].vinCode,
        };
        that.markList.push(obj);
      }
    },
        //轨迹查询
    handleTrajectory(){
      this.trackPoints=[];
      this.exportData=[];
      this.dialogFormVisible = true;
      this.showStartAndEnd=false;
    },
    //查询轨迹
    searchTrajectory(){
      this.trackPoints=[];
      this.exportData=[];
      var start_time=this.GetUnixTime(this.trajectoryParam.start_time);
      var end_time=this.GetUnixTime(this.trajectoryParam.end_time);
      if(end_time-start_time>86400){
        this.$message({
          message: '时间间隔不能大于一天',
          type: 'error'
        })
        return;
      }
      var param='ak=zGObvGv0ofXzW7TpsYCtwTgCp8OGtfTw&service_id=200846&entity_name='+this.trajectoryParam.entity_name;
      param+='&process_option=need_denoise=1,radius_threshold='+this.trajectoryParam.radius_threshold+',need_vacuate=1,need_mapmatch=1,transport_mode=driving';
      param +='&start_time='+start_time+'&end_time='+end_time+'&is_processed=1&page_size=500';
      var that=this;
      jsonp('http://yingyan.baidu.com/api/v3/track/gettrack?'+param, {}, (err, response) =>{
        if (err) {
          Message({
            message: err.message,
            type: 'error',
            duration: 5 * 1000
          })
        } else {
          var data=response.points;
          if(data.length>0)
          {
              for (var i = 0; i < data.length; i++) {
                that.trackPoints.push({lng:data[i].longitude, lat:data[i].latitude});
                that.exportData.push(data[i]);
              }
              this.startMarker={lng:data[0].longitude, lat:data[0].latitude,icon:start};
              var last=data.length-1;
              this.endMarker={lng:data[last].longitude, lat:data[last].latitude,icon:end};
              this.showStartAndEnd=true;
          }
         
          // this.exportData = data;
          // this.GetLocation();
        }
      })
    },
    //轨迹数据导出
    exportTrajectory(){
      this.downloadLoading = true;
      this.GetLocation();
    },
    //获取坐标点的地理位置
    GetLocation() {
      var that=this;
      if (that.m <= that.exportData.length - 1) {
        var point = new BMap.Point(that.exportData[that.m].longitude, that.exportData[that.m].latitude);
        var myGeo = new BMap.Geocoder();
        //        // 根据坐标得到地址描述
        myGeo.getLocation(point, function (result) {
          if (result) {
            var address = result.address;
            that.exportData[that.m].address=address;
            if (that.m == that.exportData.length - 1) {
              import('@/vendor/Export2Excel').then(excel => {
                const tHeader = ['时间','经度','纬度','速度','方向','定位','地理位置']
                const filterVal = ['create_time','longitude','latitude','speed','direction','locate_mode','address'];
                const data = that.formatJson(filterVal, that.exportData);
                excel.export_json_to_excel({
                  header: tHeader,
                  data,
                  filename: '用车申请列表'
                });
                that.downloadLoading = false;
              });
            }else {
              that.m++;
              that.GetLocation();
            }
          }
        });
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
      var directionImg = '';
      direction = direction || 0;
      if (onlineStatus == 0) {//在线
        switch (Math.floor((direction) / 22.5)) {
          case 0:
          case 15:
            directionImg = online0;
            break;
          case 1:
          case 2:
            directionImg = online45;
            break;
          case 3:
          case 4:
            directionImg = online90;
            break;
          case 5:
          case 6:
            directionImg = online135;
            break;
          case 7:
          case 8:
            directionImg = online180;
            break;
          case 9:
          case 10:
            directionImg = online225;
            break;
          case 11:
          case 12:
            directionImg = online270;
            break;
          case 13:
          case 14:
            directionImg = online315;
            break;
        }
      }
      else if (onlineStatus == 1) {//离线
        switch (Math.floor((direction) / 22.5)) {
          case 0:
          case 15:
            directionImg = outline0;
            break;
          case 1:
          case 2:
            directionImg = outline45;
            break;
          case 3:
          case 4:
            directionImg = outline90;
            break;
          case 5:
          case 6:
            directionImg = outline135;
            break;
          case 7:
          case 8:
            directionImg = outline180;
            break;
          case 9:
          case 10:
            directionImg = outline225;
            break;
          case 11:
          case 12:
            directionImg = outline270;
            break;
          case 13:
          case 14:
            directionImg = outline315;
            break;
        }
      }
      return directionImg;
    },
    //判断当前设备是否为静止，规则是速度小于1km/h返回静止，
    //否则返回速度
    //param {number} speed 速度 单位为 km/h
    //return {string} 速度
    getSpeed(speed) {
      var speedDesc
      if (speed >= 150) {
        speedDesc = ' - - ';
      } else if (speed >= 1 && speed < 150) {
        speedDesc = speed.toFixed(1) + 'km/h';
      } else {
        speedDesc = '静止';
      }
      return speedDesc;
    },
    getBoundary(areaName) {
      var that=this;
      that.polygonPath=[];//清除边界
      var bdary = new BMap.Boundary();
      bdary.get(areaName, function (rs) {       //获取行政区域
        var points = rs.boundaries[0].split(';'); //行政区域的点有多少个
        for (var i = 0; i < points.length; i++) {
          var lng=points[i].split(',')[0];
          var lat=points[i].split(',')[1];
          that.polygonPath.push({lng:lng,lat:lat});
        }
      })
    },
    getLocalDatetime() {
      var objD = new Date()
      var yy = objD.getYear()
      if (yy < 1900) { yy = yy + 1900 }
      var MM = objD.getMonth() + 1
      if (MM < 10) { MM = '0' + MM }
      var dd = objD.getDate()
      if (dd < 10) { dd = '0' + dd }
      var hh = objD.getHours()
      if (hh < 10) { hh = '0' + hh }
      var mm = objD.getMinutes()
      if (mm < 10) { mm = '0' + mm }
      var ss = objD.getSeconds()
      if (ss < 10) { ss = '0' + ss }
      var str = yy + '-' + MM + '-' + dd + ' ' + hh + ':' + mm + ':' + ss
      return str
    },
    getLastDatetime() {
      // var curDate = new Date();
      // var objD = new Date(curDate.getTime() - 24*60*60*1000)
      var objD = new Date();
      var yy = objD.getYear();
      if (yy < 1900) { yy = yy + 1900 }
      var MM = objD.getMonth() + 1
      if (MM < 10) { MM = '0' + MM }
      var dd = objD.getDate()
      if (dd < 10) { dd = '0' + dd }
      var hh = objD.getHours()
      if (hh < 10) { hh = '0' + hh }
      var mm = objD.getMinutes()
      if (mm < 10) { mm = '0' + mm }
      var ss = objD.getSeconds()
      if (ss < 10) { ss = '0' + ss }
      var str = yy + '-' + MM + '-' + dd + ' ' + '06:00:00';
      return str
    },

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
.bm-dialog {
  width: 100%;
  height: 100%;
}
</style>
