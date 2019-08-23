<template>
  <div class="body-panel">
    <baidu-map id="allMap" class="bm-view" :center="center" :zoom="14" :scroll-wheel-zoom="true" @ready="handler">
        <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>

        <bml-marker-clusterer :averageCenter="true">
          <bm-marker v-for="(marker,index) of markList" :key="index" @click="infoWindowOpen(index)" :position="{lng: markList[index].lng, lat: markList[index].lat}" :icon="{url:markList[index].icon, size: {width: 40, height: 50}}">
            <bm-label :content="markList[index].plateNumber+'('+markList[index].status+')'" :position="{lng: markList[index].lng, lat: markList[index].lat}" :offset="labelOffset" :labelStyle="{background:'#FFFF00', fontSize : '12px'}"/>
          </bm-marker>
        </bml-marker-clusterer>
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
    <div style="z-index: 10;position: absolute;top:0px;left:0px;bottom: 0px;padding-bottom:20px;width: 250px;background-color: white;overflow-y:scroll">
      <el-input placeholder="输入关键字检索" v-model="filterText"></el-input>
      <el-tree
        style="margin-top: 20px;"
        class="filter-tree"
        :data="data2"
        :props="defaultProps"
        node-key="id"
        :default-checked-keys="checkKey"
        :default-expanded-keys="expandedKeys"
        :filter-node-method="filterNode"
        ref="tree2"
        show-checkbox
        :render-content="renderContent"
        @node-expand="handleExpand"
        @node-collapse="handleCollapse"
        @check="handleCheckChange">
            <span class="custom-tree-node" slot-scope="{ node }">
            <span> <i :class="node.icon"></i>{{ node.label }}</span>
            </span>
      </el-tree>
    </div>
    <div style="z-index:10;position:absolute;right:10px;bottom: 180px;width:150px;height:70px;background-color: white;">
         <el-checkbox-group   v-model="checkFenceOne" class="checkGroup" style="width:150px;height:70px;">
              <el-checkbox  v-for="(item,index1) in fenceList" :label="item.fence_name"  :key="item.district"  
                           style="margin-left:15px;margin-top:10px"
                           @change="checked=>handleCheckedFenceChange(checked,item)">{{item.fence_name}}</el-checkbox>
         </el-checkbox-group>
    </div>
    <div id="building-foot" style="z-index:10;position:absolute;left:250px;bottom:0px;right:-15px;height:160px;background-color: white;font-size:12px">
      <div style="width:100%;height:30px;border-top:3px solid #409EFF">
        <div class="title">实时数据</div>
        <div class="sign" style="background-color:#EB7201">{{onlineCount+outlineCount+parkCount}}</div>
        <div class="label">全部</div>
        <div class="sign" style="background-color:#0ED152">{{onlineCount}}</div>
        <div class="label">行程</div>
        <div class="sign" style="background-color:#409EFF">{{parkCount}}</div>
        <div class="label">停车</div>
        <div class="sign" style="background-color:#616161">{{outlineCount}}</div>
        <div class="label">入库</div>
        <div class="sign" style="background-color:#EA1313">0</div>
        <div class="label">报警</div>
        <div class="sign" style="background-color:#1FB223">{{onlinePercent.toFixed(2)}}%</div>
        <div class="label">出勤率</div>
      </div>
      <el-table
        :data="markList"
        stripe
        fit
        highlight-current-row
        height="160"
        :header-cell-style="{'background-color':'#409EFF','height':'20px','color':'white','font-size':'12px','padding':'0px'}"
        :cell-style="{'height':'20px','font-size':'12px','padding':'0px'}"
        style="width: 100%;">
        <el-table-column :label="'车牌号'" align="center" width="auto">
          <template slot-scope="scope">
            <span style="color:#409EFF">{{ scope.row.plateNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'发动机号'" width="auto" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.deviceNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'车辆性质'" width="auto" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.entityType }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'经度'" width="auto" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.lng}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'纬度'" width="auto" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.lat }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'速度'" width="auto" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.speed }}km/h</span>
          </template>
        </el-table-column>
        <el-table-column :label="'定位时间'" width="auto" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.time }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'状态'" width="auto" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column :label="'地理位置'" width="auto" align="center">
          <template slot-scope="scope">
            <span style="color:#409EFF;cursor:pointer" @click="getLocationDetail(scope.row)">{{ scope.row.locationDetail}}</span>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <!--轨迹查询弹窗-->
    <el-dialog :title="$t('userAndCarTable.queryTrajectory')" @close="closeDialog" :visible.sync="dialogFormVisible" id="" width="90%" :fullscreen="true">
      <div class="filter-container">
      <el-form ref="dataForm"   label-position="left" label-width="100px">
        <el-row style="margin-top: -25px !important;">
          <el-col :span="5">
            <el-form-item :label="$t('userAndCarTable.plateNumber')">
              <el-select v-model="trajectoryParam.entity_name" @change="selectPlateChange()" :placeholder="$t('userAndCarTable.plateNumber')" style="width:150px">
                <el-option v-for="item in carOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label-width="80px" :label="$t('applyTable.beginTime')">
              <el-date-picker v-model="trajectoryParam.start_time" type="datetime"  :placeholder="$t('applyTable.beginTime')"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label-width="80px" :label="$t('applyTable.endTime')">
              <el-date-picker v-model="trajectoryParam.end_time" type="datetime"  :placeholder="$t('applyTable.endTime')"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item :label="$t('userAndCarTable.minLong')">
              <el-select v-model="trajectoryParam.radius_threshold" :placeholder="$t('userAndCarTable.minLong')" style="width:150px">
                <el-option v-for="item in longOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-search" @click="searchTrajectory()">{{ $t('table.search') }}</el-button>
            <el-button :loading="downloadLoading" type="primary" icon="el-icon-download" @click="exportTrajectory">{{ $t('table.export') }}</el-button>
          </el-col>
        </el-row>
        <div style="position:absolute;top:120px;bottom:0px;left:0px;right:0px;">
          <baidu-map class="bm-dialog" :center="{lng: 114.32, lat: 30.38}" :zoom="14" :scroll-wheel-zoom="true" @ready="handler">
            <!-- <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type> -->
            <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
            <bm-polyline :path="trackPoints" stroke-color="blue" :stroke-opacity="1" :stroke-weight="8" :editing="false" :strokeStyle="'solid'" ></bm-polyline>
            
            <bml-lushu
              @stop="reset"
              :path="trackPoints"
              :icon="icon"
              :play="play"
              :speed="500"
              :rotation="true">
            </bml-lushu>

            <bm-marker v-for="(marker,index) of rowMarkList" :key="index" :position="{lng: rowMarkList[index].lng, lat: rowMarkList[index].lat}" :rotation="rowMarkList[index].rotation" :icon="{url:rowIcon,size:{width:8,height:8}}">
            </bm-marker>

            <bm-marker v-show="showStartAndEnd" @click="startWindowOpen()" :position="{lng:startMarker.lng,lat:startMarker.lat}"  :icon="{url:startMarker.icon, size: {width: 32, height: 32}}"></bm-marker>
            <bm-marker v-show="showStartAndEnd" @click="endWindowOpen()" :position="{lng:endMarker.lng,lat:endMarker.lat}" :icon="{url:endMarker.icon, size: {width: 32, height: 32}}"></bm-marker>
            <bm-info-window :show="isStartAndEndWindow" :position="{lng:infoWindowData.lng,lat:infoWindowData.lat}" @close="startAndEndWindowClose" title="实时位置详情" style="line-height:30px;padding:2px;">
              <span style="font-weight:bold">车辆：</span><span style="color:#0A8CFF;">{{infoWindowData.plateNumber}}</span><br/>
              <span style="font-weight:bold">经度：</span><span style="color:#0A8CFF;">{{infoWindowData.lng}}</span><br/>
              <span style="font-weight:bold">纬度：</span><span style="color:#0A8CFF;">{{infoWindowData.lat}}</span><br/>
              <span style="font-weight:bold">时间：</span><span style="color:#0A8CFF;">{{infoWindowData.time}}</span><br/>
              <span style="font-weight:bold">地址：</span><span style="color:#0A8CFF;">{{infoWindowData.location}}</span><br/>
            </bm-info-window>
            <!-- <bm-marker v-for="(item0,index0) of speeding" @click="openLabel(index0,0)" :key="index0" :position="{lng: speeding[index0].lng, lat: speeding[index0].lat}" :icon="{url:speeding[index0].icon, size: {width: 32, height: 32}}">
            </bm-marker> -->
            <!-- <bm-marker v-for="(item1,index1) of harsh_acceleration" @click="openLabel(index1,1)" :key="index1" :position="{lng: harsh_acceleration[index1].lng, lat: harsh_acceleration[index1].lat}" :icon="{url:harsh_acceleration[index1].icon, size: {width: 32, height: 32}}">
            </bm-marker>
            <bm-marker v-for="(item2,index2) of harsh_steering" :key="index2" @click="openLabel(index2,2)" :position="{lng: harsh_steering[index2].lng, lat: harsh_steering[index2].lat}" :icon="{url:harsh_steering[index2].icon, size: {width: 32, height: 32}}">
            </bm-marker> -->
            <bm-marker v-for="(item3,index3) of stay_points" :key="index3" @click="openLabel(index3,3)" :position="{lng: stay_points[index3].lng, lat: stay_points[index3].lat}" :icon="{url:stay_points[index3].icon, size: {width: 32, height: 32}}">
            </bm-marker>
            <bm-info-window :show="showLabel" :position="{lng:labelObj.lng,lat:labelObj.lat}" @close="startAndEndWindowClose" style="line-height:30px;padding:2px;">
              <span style="color:#0A8CFF;">{{labelObj.label}}</span><br/>
            </bm-info-window>
          </baidu-map>
        </div>
        <div v-show="showBehavior" style="width:375px;height:70px;border:1px solid lightgray;z-index:100;position:absolute;top:130px;right:20px;background:white;">
          <div style="height:70px;">
             <div class="behavior" style="color:black;">总里程</div>
             <div class="behavior" style="color:black;">超速</div>
             <div class="behavior" style="color:black;">急加速</div>
             <div class="behavior" style="color:black;">急转弯</div>
             <div class="behavior" style="color:black;">停留</div>
             <div class="behavior">{{distance}}</div>
             <div class="behavior">{{speeding.length}}</div>
             <div class="behavior">{{harsh_acceleration.length}}</div>
             <div class="behavior">{{harsh_steering.length}}</div>
             <div class="behavior">{{stay_points.length}}</div>
          </div>
        </div>
      </el-form>
      </div>
    </el-dialog>

    <!--快速派车弹窗-->
    <el-dialog :title="$t('userAndCarTable.fastDispach')" :visible.sync="dispachFormVisible">
      <el-form ref="dataForm" :rules="rules" label-position="left" label-width="100px" style=" margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item  :label="$t('userAndCarTable.plateNumber')" class="postInfo-container-item">
              <el-input v-model="vehicleDetail.plateNumber"  class="filter-item"  style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  :label="$t('userAndCarTable.vehicleProperties')" class="postInfo-container-item" >
              <el-input v-model="vehicleDetail.vehicleProperties"  class="filter-item"  style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  :label="$t('userAndCarTable.currentState')" class="postInfo-container-item" >
              <el-input v-model="vehicleDetail.currentState"  class="filter-item"  style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  :label="$t('userAndCarTable.departmentName')" class="postInfo-container-item" >
              <el-input v-model="vehicleDetail.departmentName"  class="filter-item"  style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.chooseDriver')" prop="driver">
              <el-autocomplete
                class="inline-input"
                v-model="dispatchModel.driverName"
                :fetch-suggestions="querySearchDriver"
                suffix-icon="el-icon-search"
                placeholder="请选择驾驶员"
                @select="handleSelectDriver"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.userMobile')" class="postInfo-container-item" >
              <el-input v-model="dispatchModel.driverPhone"  class="filter-item"  style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.applyNum')" prop="applyNum">
              <el-autocomplete
                class="inline-input"
                v-model="applyDetail.applyNum"
                :fetch-suggestions="querySearchApply"
                suffix-icon="el-icon-search"
                placeholder="请选择申请单号"
                @select="handleSelectApply"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.userDept')" class="postInfo-container-item" >
              <el-input v-model="applyDetail.departmentName"  class="filter-item"  style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.userName')" class="postInfo-container-item" >
              <el-input v-model="applyDetail.userName"  class="filter-item"  style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.userMobile')" class="postInfo-container-item" >
              <el-input v-model="applyDetail.userMobile"  class="filter-item"  style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.carProperty')" class="postInfo-container-item" >
              <el-input v-model="applyDetail.carProperty"  class="filter-item"  style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.carType')" class="postInfo-container-item" >
              <el-input v-model="applyDetail.carType"  class="filter-item"  style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.startPoint')" class="postInfo-container-item" >
              <el-input v-model="applyDetail.startPoint"  class="filter-item"  style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.destination')" class="postInfo-container-item" >
              <el-input v-model="applyDetail.destination"  class="filter-item"  style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
        </el-row>
         <!-- <el-row>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.startPlanTime')" class="postInfo-container-item" >
              <el-input v-model="applyDetail.startPlanTime"  class="filter-item"  style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.backPlanTime')" class="postInfo-container-item" >
              <el-input v-model="applyDetail.backPlanTime"  class="filter-item"  style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
        </el-row> -->
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  type="primary" @click="takeOrder()">派车</el-button>
        <el-button  @click="dispachFormVisible = false">{{ $t('applyTable.cancel') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {listByApplyNum,driverEnableList,queryItemByPlateNum,dispatch} from '@/api/applyCar'
import GithubCorner from '@/components/GithubCorner'
import jsonp from 'jsonp'
import Vue from 'vue'
import BaiduMap from 'vue-baidu-map'
import {BmlMarkerClusterer} from 'vue-baidu-map'
import {BmlLushu} from 'vue-baidu-map'

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

import park0 from '@/assets/park/park_0度.png'
import park45 from '@/assets/park/park_45度.png'
import park90 from '@/assets/park/park_90度.png'
import park135 from '@/assets/park/park_135度.png'
import park180 from '@/assets/park/park_180度.png'
import park225 from '@/assets/park/park_225度.png'
import park270 from '@/assets/park/park_270度.png'
import park315 from '@/assets/park/park_315度.png'

import row from '@/assets/row.png'
import start from '@/assets/起点.png'
import end from '@/assets/终点.png'

import speed from '@/assets/behavior/超速.png'
import acceleration from '@/assets/behavior/急加速.png'
import steering from '@/assets/behavior/急转弯.png'
import stay from '@/assets/behavior/停留.png'

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'zGObvGv0ofXzW7TpsYCtwTgCp8OGtfTw'
})

export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    BmlMarkerClusterer,
    BmlLushu
    // 'bm-marker':BmlMarker,
    // 'bm-info-window':InfoWindow,
    // 'bm-label':Label,
    // 'bm-polygon':Polygon
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  data() {
    return {
      rules: {
        driver: [{ required: false, message: '请选择驾驶员', trigger: 'blur' }],
        applyNum: [{ required: false, message: '请选择申请单号', trigger: 'blur' }],
      },
      filterText:'',
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      expandedKeys:[0,1,2],
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
      rowMarkList:[],//轨迹方向箭头
      list: null,
      commentList:[],
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
      center:{lng: 114.35, lat: 30.35},
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
      selectPlate:'轨迹查询选中车辆',
      isStartAndEndWindow:false,
      infoWindowData:{
        lng:0,
        lat:0,
        plateNumber:'',
        location:'',
        time:'',
      },
      startMarker:{lng:0,lat:0,icon:start},//轨迹起点
      endMarker:{lng:0,lat:0,icon:end},//轨迹终点
      showStartAndEnd:false,
      onlineCount:0,
      parkCount:0,
      outlineCount:0,
      onlinePercent:0,
      //驾驶员行为分析
      drivingbehaviors:['超速','急变速','急转弯','停留'],
      checkedBehavior:[],
      distance:0.00,
      speeding:[],//超速
      harsh_acceleration:[],//急加速
      harsh_breaking:[],//急刹车
      harsh_steering:[],//急转弯
      stay_points:[],//停留点
      rowIcon:row,
      showLabel:false,
      labelObj:{
        lng:0,
        lat:0,
        label:''
      },
      showBehavior:false,
      play: true,//轨迹回放开始
      icon: {
        url: 'http://api.map.baidu.com/library/LuShu/1.2/examples/car.png',
        size: {width: 52, height: 26},
        opts: {anchor: {width: 27, height:13}}
      }
      // icon: {
      //   url: online0,
      //   size: {width: 40, height: 50},
      //   opts: {anchor: {width: 20, height:25}}
      // }
    };
  },
  mounted() {
     this.queryCars();
     this.init();
     this.queryFences();
  },
  methods: {
    renderContent(h, { node, data, store }) {
      if(data.className=="online"){
        return (
          <span style="color:#0ED152;font-size:14px">{node.label}</span>
        );
      }else if(data.className=="park"){
        return (
          <span style="color:#259BFF;font-size:14px">{node.label}</span>
        );
      }else{
        return (
          <span style="font-size:14px">{node.label}</span>
        );
      }
    },
    reset () {
      this.play = false;
    },
    handler ({BMap, map}) {
      this.zoom = 15;
    },
    infoWindowClose (e) {
       this.isShow = false;
    },
    startAndEndWindowClose(e) {
       this.isStartAndEndWindow = false;
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
        that.selectPlate=e.plateNumber;
      });
    },
    openLabel(index,type){
      var that = this;
      if(type==0){
        that.labelObj={
          lng:that.speeding[index].lng,
          lat:that.speeding[index].lat,
          label:that.speeding[index].label
        }
      }
      else if(type==1){
        that.labelObj.lng=that.harsh_acceleration[index].lng;
        that.labelObj.lat=that.harsh_acceleration[index].lat;
        that.labelObj.label=that.harsh_acceleration[index].label;
      }
      else if(type==2){
        that.labelObj.lng=that.harsh_steering[index].lng;
        that.labelObj.lat=that.harsh_steering[index].lat;
        that.labelObj.label=that.harsh_steering[index].label;
      }
      else if(type==3){
        that.labelObj.lng=that.stay_points[index].lng;
        that.labelObj.lat=that.stay_points[index].lat;
        that.labelObj.label=that.stay_points[index].label;
      }
      that.showLabel=true;
    },
    selectPlateChange(event, item){
      this.selectPlate = item.display_name;
    },
    startWindowOpen(){
      var that=this;
      var point = new BMap.Point(that.startMarker.lng, that.startMarker.lat);
      var myGeo = new BMap.Geocoder();
      // 根据坐标得到地址描述
      myGeo.getLocation(point, function (result) {
        that.infoWindowData.lat=that.startMarker.lat;
        that.infoWindowData.lng=that.startMarker.lng;
        that.infoWindowData.plateNumber=that.selectPlate;
        that.infoWindowData.location=result.address;
        that.infoWindowData.time=that.timestampToTime(that.startMarker.loc_time);
        that.isStartAndEndWindow = true;
      });
    },
    endWindowOpen(){
      var that=this;
      var point = new BMap.Point(that.endMarker.lng, that.endMarker.lat);
      var myGeo = new BMap.Geocoder();
      // 根据坐标得到地址描述
      myGeo.getLocation(point, function (result) {
        that.infoWindowData.lat=that.endMarker.lat;
        that.infoWindowData.lng=that.endMarker.lng;
        that.infoWindowData.plateNumber=that.selectPlate;
        that.infoWindowData.location=result.address;
        that.infoWindowData.time=that.timestampToTime(that.endMarker.loc_time);
        that.isStartAndEndWindow = true;
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
    //选择申请单
    querySearchApply(queryString, cb){
      listByApplyNum({carProperty:this.vehicleDetail.vehicleProperties,applyNum:queryString}).then(response => {
        var result = response.data.datas;
        var carData=[];
        for(var i=0;i<result.length;i++){
          if(result[i].applyNum.indexOf(queryString) !=-1){
            var obj={
              value:result[i].applyNum,
              applyId:result[i].id,
              applyNum: result[i].applyNum,
              departmentName: result[i].departmentName,
              carProperty: result[i].carProperty,
              carType:result[i].carType,
              userName:result[i].userName,
              userMobile:result[i].userMobile,
              startPoint: result[i].startPoint,
              destination: result[i].destination,
              startPlanTime:result[i].startPlanTime,
              backPlanTime:result[i].backPlanTime
            }
            carData.push(obj);
          }
        }
        cb(carData);
      });
    },
    handleSelectApply(item){
      this.applyDetail={
        applyId:item.id,
        applyNum:item.applyNum ,
        departmentName: item.departmentName,
        carProperty: item.carProperty,
        carType:item.carType,
        userName:item.userName,
        userMobile:item.userMobile,
        startPoint: item.startPoint,
        destination: item.destination,
        startPlanTime:item.startPlanTime,
        backPlanTime:item.backPlanTime
      };
    },
    //选择司机
    querySearchDriver(queryString, cb){
      driverEnableList().then(response => {
        var result = response.data.datas;
        var carData=[];
        for(var i=0;i<result.length;i++){
          for(var i=0;i<result.length;i++){
            if(result[i].desc.indexOf(queryString) !=-1){
              carData.push({value:result[i].desc,id:result[i].id,driverName:result[i].name,driverPhone:result[i].mobileNum});
            }
          }
        }
        cb(carData);
      });
    },
    handleSelectDriver(item){
      this.dispatchModel.driverId=item.id;
      this.dispatchModel.driverName=item.driverName;
      this.dispatchModel.driverPhone=item.driverPhone;
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
    //点击派车
    takeOrder(){
         dispatch(this.applyDetail.applyId,this.dispatchModel).then(response => {
          if(response.data.code==0){
            this.$message({
              message: '派车成功',
              type: 'success'
            });
            this.dispachFormVisible = false;
          }
          else{
            this.$message({
              message: '派车失败',
              type: 'error'
            })
          }
        });
    },
    //轨迹查询
    handleTrajectory(){
      this.trackPoints=[];
      this.rowMarkList=[];
      this.exportData=[];
      this.dialogFormVisible = true;
      this.showStartAndEnd=false;
      this.speeding = [];//超速
      this.harsh_acceleration = [];//急加速
      this.harsh_breaking=[];//急刹车
      this.harsh_steering=[],//急转弯
      this.stay_points=[];//停留点
      this.showLabel=false;
      this.labelObj={
        lng:0,
        lat:0,
        label:''
      };
      this.showBehavior=false;
    },
    //查询轨迹
    searchTrajectory(){
      this.speeding = [];//超速
      this.harsh_acceleration = [];//急加速
      this.harsh_breaking=[];//急刹车
      this.harsh_steering=[],//急转弯
      this.stay_points=[];//停留点
      this.showLabel=false;
      this.labelObj={
        lng:0,
        lat:0,
        label:''
      };

      this.trackPoints=[];
      this.rowMarkList=[];
      this.exportData=[];
      this.startMarker = {lng:0,lat:0,icon:start};//轨迹起点
      this.endMarker = {lng:0,lat:0,icon:end};//轨迹终点
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
      param +='&start_time='+start_time+'&end_time='+end_time+'&is_processed=1&page_size=1000';
      var that=this;
      jsonp('http://yingyan.baidu.com/api/v3/track/gettrack?'+param, {}, (err, response) =>{
        if (err) {
          Message({
            message: err.message,
            type: 'error',
            duration: 5 * 1000
          })
        } else {
          var stime=that.GetUnixTime(this.trajectoryParam.start_time);
          var etime=that.GetUnixTime(this.trajectoryParam.end_time);
          var behaviorParam='ak=zGObvGv0ofXzW7TpsYCtwTgCp8OGtfTw&service_id=200846&entity_name='+that.trajectoryParam.entity_name;
              behaviorParam+='&process_option=need_denoise=1,radius_threshold='+that.trajectoryParam.radius_threshold+',need_vacuate=1,need_mapmatch=1,transport_mode=driving';
              behaviorParam +='&start_time='+stime+'&end_time='+etime+'&is_processed=1';
          jsonp('http://yingyan.baidu.com/api/v3/analysis/drivingbehavior?'+behaviorParam, {}, (error, resp) =>{
            if (error) {
              Message({
                message: error.message,
                type: 'error',
                duration: 5 * 1000
              })
            }else{
              jsonp('http://yingyan.baidu.com/api/v3/analysis/staypoint?'+behaviorParam, {}, (ex, result) =>{
                if (ex) {
                  Message({
                    message: error.message,
                    type: 'error',
                    duration: 5 * 1000
                  })
                }else{
                  //轨迹数据
                  var data=response.points;
                  if(data.length==0){
                    this.$message({
                      message: '当前时段无数据',
                      type: 'warning'
                    })
                    return;
                  }
                  for (var i = 0; i < data.length; i++) {
                    that.trackPoints.push({lng:data[i].longitude, lat:data[i].latitude});
                    this.rowMarkList.push({lng:data[i].longitude, lat:data[i].latitude,rotation:data[i].direction});
                    that.exportData.push(data[i]);
                  }
                  var startPoint = response.start_point;
                  var endPoint = response.end_point;
                  that.distance=(response.distance/1000).toFixed(2);//总里程
                  that.startMarker={lng:startPoint.longitude, lat:startPoint.latitude,icon:start,loc_time:startPoint.loc_time,plateNumber:'',location:''};
                  that.endMarker={lng:endPoint.longitude, lat:endPoint.latitude,icon:end,loc_time:endPoint.loc_time,plateNumber:'',location:''};
                  that.showStartAndEnd=true;
                  //驾驶员行为数据
                  for(var j=0;j<resp.speeding.length;j++){
                    var obj={
                      distance:resp.speeding[j].speeding_distance,
                      lng:resp.speeding[j].speeding_points[0].longitude,
                      lat:resp.speeding[j].speeding_points[0].latitude,
                      limit_speed:resp.speeding[j].speeding_points[0].limit_speed,
                      actual_speed:resp.speeding[j].speeding_points[0].actual_speed,
                      loc_time:that.timestampToTime(resp.speeding[j].speeding_points[0].loc_time),
                      icon:speed,
                      label:'时速：'+resp.speeding[j].speeding_points[0].actual_speed+'km/h，限速：'+resp.speeding[j].speeding_points[0].limit_speed+'km/h'
                    }
                    var actual_speed = resp.speeding[j].speeding_points[0].actual_speed;
                    var limit_speed = resp.speeding[j].speeding_points[0].limit_speed;
                    //超速20%记录超速点
                    if(actual_speed*(1+0.3)>limit_speed){
                      that.speeding.push(obj);
                    }
                  }
                  for(var k=0;k<resp.harsh_acceleration.length;k++){
                    var obj={
                      lng:resp.harsh_acceleration[k].longitude,
                      lat:resp.harsh_acceleration[k].latitude,
                      loc_time:that.timestampToTime(resp.harsh_acceleration[k].loc_time),
                      icon:acceleration,
                      label:'加速前：'+resp.harsh_acceleration[k].initial_speed+'km/h，加速后：'+resp.harsh_acceleration[k].end_speed+'km/h'
                    }
                    that.harsh_acceleration.push(obj);
                  }
                  for(var m=0;m<resp.harsh_steering.length;m++){
                    var type='';
                    if(resp.harsh_steering[m].turn_type=="left"){
                      type='左转弯';
                    }
                    else if(resp.harsh_steering[m].turn_type=="right"){
                      type='右转弯';
                    }
                    else{
                      type='方向未知';
                    }
                    var obj={
                      lng:resp.harsh_steering[m].longitude,
                      lat:resp.harsh_steering[m].latitude,
                      loc_time:that.timestampToTime(resp.harsh_steering[m].loc_time),
                      speed:resp.harsh_steering[m].speed,
                      icon:steering,
                      label:'转向：'+type+'，时速：'+resp.harsh_steering[m].speed+'km/h'
                    }
                    that.harsh_steering.push(obj);
                  }
                  //停留点
                  if(result.staypoint_num>0){
                    for(var n=0;n<result.stay_points.length;n++){
                      var obj={
                        lng:result.stay_points[n].stay_point.longitude,
                        lat:result.stay_points[n].stay_point.latitude,
                        startTime:that.timestampToTime(result.stay_points[n].start_time),
                        endTime:that.timestampToTime(result.stay_points[n].end_time),
                        duration:result.stay_points[n].duration/60,
                        icon:stay,
                        label:'开始时间：'+that.timestampToTime(result.stay_points[n].start_time)+'，时长：'+ (result.stay_points[n].duration/60).toFixed(0)+'分钟'
                      }
                      that.stay_points.push(obj);
                    }
                  }
                  this.showBehavior=true;
                  this.play = true;
                }
              });
            }
          });
        }
      });
    },
    closeDialog(){
      this.downloadLoading = false;
    },
    //轨迹数据导出
    exportTrajectory(){
      if(this.exportData.length==0){
        this.$message({
          message: '请先查询轨迹，再导出数据',
          type: 'warning'
        })
        return;
      }
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
            that.exportData[that.m].plateNumber=that.selectPlate;
            that.exportData[that.m].direction=that.getDirectionDesc(that.exportData[that.m].direction);
            if (that.m == that.exportData.length - 1) {
              import('@/vendor/Export2Excel').then(excel => {
                const tHeader = ['车牌号','时间','经度','纬度','速度','方向','定位','地理位置']
                const filterVal = ['plateNumber','create_time','longitude','latitude','speed','direction','locate_mode','address'];
                const data = that.formatJson(filterVal, that.exportData);
                excel.export_json_to_excel({
                  header: tHeader,
                  data,
                  filename: '车辆行驶轨迹数据_'+that.selectPlate
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
    //树节点关闭事件
    handleCollapse(data, checked, indeterminate) {
      var id=data.id;
      for(var i=0;i<this.expandedKeys.length;i++){
        if(this.expandedKeys[i]==id){
          this.expandedKeys.splice(i,1);
        }
      }
    },
    //树节点展开事件
    handleExpand(data, checked, indeterminate) {
      var id=data.id;
      this.expandedKeys.push(id);
    },
    //树节点点击事件
    handleCheckChange(data, checked) {
      this.center={lng: data.lng, lat: data.lat};
      // if(!data.children && checked){
      //   this.checkData.push(data.desc);
      //   this.checkKey.push(data.id);
      // }
      // else if(!data.children && !checked){
      //   for(var k=0;k<this.checkData.length;k++){
      //     if(data.desc == this.checkData[k]){
      //       this.checkData.splice(k, 1);
      //       this.checkKey.splice(k, 1)
      //     }
      //   }
      // }
      this.checkKey=[];
      this.checkData = checked.checkedNodes;
      for(var i=0;i<this.checkData.length;i++){
        this.checkKey.push(this.checkData[i].id);
      }
      this.GetCheckEntities(this.checkData);
    },
    //请求选中车辆的位置
    GetCheckEntities(data){
      var newData = [];
      for (var f = 0; f < this.list.length;f++) {
        if(data.length==0){
          newData.push(this.list[f]);
        }else {
          for (var j = 0; j < data.length; j++) {
            if (this.list[f].entity_desc == data[j].desc) {
              newData.push(this.list[f]);
            }
          }
        }
      }
      this.loadEntities(newData);//加载marker点
    },
    init(){
      setInterval(this.queryCars,20000);
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
            this.onlineCount=0;
            this.outlineCount=0;
            this.parkCount=0;
            for(var i=0;i<result.length;i++){
              //过滤精确度大于20米的数据，存入历史表
              if(result[i].latest_location.radius!=undefined && result[i].latest_location.radius < 20){
                if(this.commentList.length == 0){
                  this.commentList.push(result[i]);
                }else{
                  var flag=false;
                  var index=0;
                  for(var j=0;j<this.commentList.length;j++){
                    if(this.commentList[j].entity_name == result[i].entity_name){
                      flag = true;
                      index = j;
                    }
                  }
                  if(flag){
                    this.commentList.splice(index,1,result[i])
                  }else{
                    this.commentList.push(result[i]);
                  }
                }
              }
              var obj = {
                key: result[i].entity_name,
                display_name: result[i].entity_desc
              }
              this.carOptions.push(obj);
              var onlineStatus = 0; //在线状态 0在线 1离线
              var lastTime = this.GetUnixTime(result[i].modify_time);
              onlineStatus = this.getOnlineStatus(lastTime);
              //判断是否静止
              var speed=result[i].latest_location.speed?result[i].latest_location.speed:0;
              var radius = result[i].latest_location.radius;
              var isMove = this.getSpeed(speed);
              var className = "";
              var statusName="";
              ////***调整状态 */
              var lat = result[i].latest_location.latitude;
              var lng = result[i].latest_location.longitude;
              //解决定位在纸坊东站的问题
              if(onlineStatus !=0 && lng.toFixed(2)==114.35){
                  lng = 114.34506991838;
              }
              if(speed > 200 || radius>100){
                lng=114.34426197814;
                lat=30.360739347049;
                speed=0;
              }
              //解决初始化定位在坐标(0,0)的问题，初始化位置在车库
              if(lng==0 && lat==0){
                lng=114.34424057114;
                lat=30.360944120379;
              }
              if(onlineStatus==0 && speed==0){
                onlineStatus=2;
              }
              var isOnGarage = this.getStatusName(lng,lat);//坐标是否在车库指定范围
              if(onlineStatus==0){
                if(isOnGarage){
                  statusName="入库";
                  this.outlineCount++;
                }else{
                  statusName="行程";
                  className = "online";
                  this.onlineCount++;
                }
              }
              else if(onlineStatus==1){
                if(isOnGarage){
                  statusName="入库";
                  this.outlineCount++;
                }else{
                  this.parkCount++;
                  statusName="停车";
                  className = "park";
                }
              }
              else if(onlineStatus==2){
                if(isOnGarage){
                  statusName="入库";
                  this.outlineCount++;
                }else{
                  this.parkCount++;
                  statusName="停车";
                  className = "park";
                }
              }
              // if (onlineStatus == 1) {
              //   statusName="离线";
              // }
              // else if (onlineStatus == 0) {
              //   if (isMove == "静止") {
              //     className = "park";
              //     statusName="停车";
              //   } else {
              //     className = "online";
              //     statusName="在线";
              //   }
              // }
              // if(onlineStatus==0){
              //   if (isMove == "静止") {
              //     this.parkCount++;
              //   }else{
              //     this.onlineCount++;
              //   }
              // }else{
              //   this.outlineCount++;
              // }
              if(result[i].entityType == "公务用车组"){
                treeData[0].children[0].children.push({id:1+'_'+i,className:className,desc:result[i].entity_desc,lat:result[i].latest_location.latitude,lng:result[i].latest_location.longitude,label:result[i].entity_desc+" ( "+statusName+" )"});
              }else if(result[i].entityType == "应急执法组") {
                treeData[0].children[1].children.push({id:2+'_'+i,className:className,desc:result[i].entity_desc,lat:result[i].latest_location.latitude,lng:result[i].latest_location.longitude,label:result[i].entity_desc+" ( "+statusName+" )"});
              }
            }
            this.onlinePercent=((this.onlineCount+this.parkCount)/result.length)*100;

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
            console.log(this.commentList);
          }
        }
      })
    },
    loadEntities(data) {
      var that=this;
      that.markList=[];

      for (var x = 0; x < data.length; x++) {
        var lng = data[x].latest_location.longitude;
        var lat = data[x].latest_location.latitude;
        var lastTime = this.GetUnixTime(data[x].modify_time);
        var speed=data[x].latest_location.speed?data[x].latest_location.speed:0;
        var radius = data[x].latest_location.radius;
        //解决定位在纸坊东站的问题
        if(onlineStatus !=0 && lng.toFixed(2)==114.35){
            lng = 114.34506991838;
        }
        if(speed > 200 || radius>100){
          lng=114.34426197814;
          lat=30.360739347049;
          speed=0;
        }
        //解决初始化定位在坐标(0,0)的问题，初始化位置在车库
        if(lng==0 && lat==0){
          lng=114.34424057114;
          lat=30.360944120379;
        }
         //判断是否静止
        var isMove = this.getSpeed(speed);
        var onlineStatus = this.getOnlineStatus(lastTime);//在线状态 0在线 1离线
        if(onlineStatus==0 && speed==0){
          onlineStatus=2;
        }
        var isOnGarage = this.getStatusName(lng,lat);//坐标是否在车库指定范围
        var statusName = null;
        if(onlineStatus==0){
          if(isOnGarage){
            statusName="入库";
          }else{
            statusName="行程";
          }
        }
        else if(onlineStatus==1){
          if(isOnGarage){
            statusName="入库";
          }else{
            statusName="停车";
          }
        }
        else if(onlineStatus==2){
          if(isOnGarage){
            statusName="入库";
          }else{
            statusName="停车";
          }
        }
        // if(onlineStatus==0){
        //   statusName="在线";
        // }else if(onlineStatus==1){
        //   statusName="离线";
        // }
        // else if(onlineStatus==2){
        //   statusName="停车";
        // }
        
        // var radius = data[x].latest_location.radius;
        // if(radius != undefined && radius>=20){
        //   for(var i=0;i<this.commentList.length;i++){
        //     if(this.commentList[i].entity_name==data[x].entity_name){
        //       lng=this.commentList[i].latest_location.longitude;
        //       lat=this.commentList[i].latest_location.latitude;
        //       break;
        //     }
        //   }
        // }
        var imgName = this.getDirection(data[x].latest_location.direction, onlineStatus,isOnGarage);
        var obj={
          lng:lng,
          lat:lat,
          icon:imgName,
          entityName:data[x].entity_name,
          plateNumber:data[x].entity_desc,
          entityType:data[x].entityType,
          speed:speed,
          time:this.timestampToTime(data[x].latest_location.loc_time),
          location:'',
          deviceNumber:data[x].deviceNumber,
          vinCode:data[x].vinCode,
          status:statusName,
          // locationDetail:'查看详细位置',
        };
        that.markList.push(obj);
      }
    },
    //获取Unix时间戳
    GetUnixTime (timeStr) {
      var time = new Date(timeStr);
      return (time.getTime() / 1000);
    },
    //将unix时间转换成一般时间
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = date.getDate() + ' ';
      var h = date.getHours() + ':';
      var m = date.getMinutes() + ':';
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
    },
    //判断当前设备是否在线，规则是最后上传的轨迹点
    //时间在当前系统时间十分钟内判断为在线，否则为离线
    //param {number} time UNIX时间戳
    //return {number} 在线状态 0在线 1离线 2停车
    getOnlineStatus(time) {
      var status = 0;
      var timestamp = new Date().getTime() / 1000;
      var timeDiff = (timestamp - time) / 60;
      status = timeDiff >= 10 ? 1 : 0;
      return status;
    },
    getStatusName(lng,lat){
      var isOnGarage=false;
      //车库坐标范围
      var top_left={lng:114.34271,lat:30.361739};
      var top_right={lng:114.348046,lat:30.361739};
      var bottom_left={lng:114.34271,lat:30.35719};
      var bottom_right={lng:114.348046,lat:30.35719};
      if(lng>top_left.lng && lng<top_right.lng && lat>bottom_left.lat && lat < top_left.lat){
        isOnGarage=true;
      }
      return isOnGarage;
    },
    getDirection(direction, onlineStatus,isOnGarage) {
      var directionImg = '';
      direction = direction || 0;
      if (onlineStatus == 0 && !isOnGarage) {//在线-行程中
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
          default:
            directionImg = online0;
            break;
        }
      }
      else if ((onlineStatus == 1 || onlineStatus == 2) && !isOnGarage) {//停车--行程中停车
        switch (Math.floor((direction) / 22.5)) {
          case 0:
          case 15:
            directionImg = park0;
            break;
          case 1:
          case 2:
            directionImg = park45;
            break;
          case 3:
          case 4:
            directionImg = park90;
            break;
          case 5:
          case 6:
            directionImg = park135;
            break;
          case 7:
          case 8:
            directionImg = park180;
            break;
          case 9:
          case 10:
            directionImg = park225;
            break;
          case 11:
          case 12:
            directionImg = park270;
            break;
          case 13:
          case 14:
            directionImg = park315;
            break;
          default:
            directionImg = park0;
            break;
        }
      }
      else{//离线--入库
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
          default:
            directionImg = outline0;
            break;
        }
      }
      return directionImg;
    },
    /**
     * 返回当前设备运动方向描述，一共分为8种，45度一个
     *
     * @param {number} direction 方向数据
     * @return {string} 方向描述
     */
    getDirectionDesc: function(direction) {
        var directionDesc = '';
        direction = direction || 0;
        switch (Math.floor((direction) / 22.5)) {
            case 0:
            case 15:
                directionDesc = '(北)';
            break;
            case 1:
            case 2:
                directionDesc = '(东北)';
            break;
            case 3:
            case 4:
                directionDesc = '(东)';
            break;
            case 5:
            case 6:
                directionDesc = '(东南)';
            break;
            case 7:
            case 8:
                directionDesc = '(南)';
            break;
            case 9:
            case 10:
                directionDesc = '(西南)';
            break;
            case 11:
            case 12:
                directionDesc = '(西)';
            break;
            case 13:
            case 14:
                directionDesc = '(西北)';
            break;
        }
        return directionDesc;
     },
    //判断当前设备是否为静止，规则是速度小于1km/h返回静止，
    //否则返回速度
    //param {number} speed 速度 单位为 km/h
    //return {string} 速度
    getSpeed(speed) {
      var speedDesc
      if (speed >= 150) {
        speedDesc = ' -- ';
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
  .body-panel{
    position: absolute;
    top:0px;
    left:0px;
    right: 0px;
    bottom: 0px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .node-icon-outline{
      background-image: url("outline.png");
      background-repeat:no-repeat;
      width: 40px;
      height: 12px;
      background-position: center;
      display: inline-block;
      /*padding-right: 10px;*/
  }
  .node-icon-park{
    background-image: url("online.png");
    background-repeat:no-repeat;
    width: 40px;
    height: 12px;
    background-position: center;
    display: inline-block;
    /*padding-right: 10px;*/
  }
  .node-icon-online{
    background-image: url("online.png");
    background-repeat:no-repeat;
    width: 40px;
    height: 12px;
    background-position: center;
    display: inline-block;
     /*padding-right: 10px;*/
  }
  .bm-view {
    position: absolute;
    top:0px;
    left:250px;
    right: 0px;
    bottom: 0px;
    z-index: 0
  }
  .bm-dialog {
   width: 100%;
    height: 100%;
  }
  .el-table .cell{
    line-height: 14px !important;
    font-size: 12px !important;
  }
  .title{
    height:20px;line-height:20px;color:#409EFF;margin-top:5px;margin-left:20px;float:left;font-size: 14px;font-weight: bold;
  }
  .sign{
    height:20px;line-height:20px;width:40px;margin-top:5px;margin-left:30px;float:left;border-radius: 5px 5px 5px 5px;color:white;text-align: center
  }
  .label{
    height:20px;line-height:20px;margin-top:5px;margin-left:5px;float:left
  }
  .behavior{
    width:74px;height:35px;float:left;line-height:35px;text-align:center;color:#0A8CFF;font-weight:bold;font-size:15px;
  }
</style>
