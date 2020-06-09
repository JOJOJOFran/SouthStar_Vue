<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataForm" label-position="left" label-width="80px" style="margin-left:50px;">
        <el-row>
          <el-col :span="6">
            <el-form-item :label="'开始时间'">
              <el-date-picker v-model="listQuery.startTime" type="date" style="width:200px" :placeholder="'开始时间'"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="'结束时间'">
              <el-date-picker v-model="listQuery.endTime" type="date" style="width:200px" :placeholder="'结束时间'"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('statisticalTable.carProperty')">
              <el-select v-model="listQuery.carProperty" :placeholder="$t('statisticalTable.carProperty')" clearable @change="carPropertyChange">
                <el-option v-for="item in carPropertyOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
             <el-form-item :label="$t('statisticalTable.department')" prop="type">
                <el-select v-model="listQuery.depName" filterable clearable placeholder="请选择">
                  <el-option
                    v-for="item in selectDeptList"
                    :key="item.deptId"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
               </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('statisticalTable.plateNumber')">
                <el-select v-model="listQuery.vehicleId" clearable filterable placeholder="选择车辆">
                  <el-option
                    v-for="item in selectPlateList"
                    :key="item.vehicleId"
                    :label="item.value"
                    :value="item.vehicleId">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('statisticalTable.driverName')">
                <el-select v-model="listQuery.driverId" clearable filterable placeholder="选择驾驶员">
                  <el-option
                    v-for="item in selectDriverList"
                    :key="item.driverId"
                    :label="item.value"
                    :value="item.driverId">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      show-summary
      height="600"
      style="width: 100%;">
      <el-table-column label="序号" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.$index+1  }}</span>
          </template>
      </el-table-column>
      <el-table-column label="车牌号" align="center" width="auto">
          <template slot-scope="scope">
            <span style="color:#409EFF">{{ scope.row.plateNumber  }}</span>
          </template>
      </el-table-column>
      <el-table-column label="品牌" align="center" width="auto">
          <template slot-scope="scope">
            <span>{{ scope.row.vehicleBrand  }}</span>
          </template>
      </el-table-column>
      <el-table-column label="车辆性质" align="center" width="auto">
          <template slot-scope="scope">
            <span>{{ scope.row.carPropertyName }}</span>
          </template>
      </el-table-column>
      <el-table-column
        prop="count"
        label="运营班次"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="totalMiles"
        label="总里程（公里）"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="totalUseTime"
        label="总时长（分钟）"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="totalFee"
        label="费用合计（元）"
        width="auto">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { driverEnableList,vehicleEnableList,deptList} from '@/api/applyCar'
import { reportPlatenum } from '@/api/statistical'
import { setNewToken,getNewToken} from '@/utils/auth'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const deptOptions = [];

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = deptOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})


export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      checkedTypes: ['司机姓名'],
      selectTypes: ['司机姓名', '车牌号', '用车单位'],
      showDriver:true,
      showPlate:false,
      showDepartment:false,
      selectDriverList:[],
      selectDeptList:[],
      selectPlateList:[],
      deptList:null,
      list: null,
      listLoading: true,
      listQuery: {
        driverId: '', 
        vehicleId:'',
        depName:'',
        carProperty:'',
        startTime:this.getLocalYearFirstDay(),
        endTime:this.getLocalDatetime()
      },
      driverName:'',
      plateNumber:'',
      applyDepartmentId:getNewToken("DepartmentId"),//详情页补充申请人单位
      deptOptions:[],
      carPropertyOptions:[{key:0,display_name:'公务用车组'},{key:1,display_name:'应急执法组'}],
      downloadLoading: false,
      receiptModel:{
        receiptId:'',
        unitTimePrice:'',
        unitMilePrice:''
      },
      dialogFormVisible: false,
    }
  },
  created() {
    this.getList();
    this.querySearchDept();
    this.querySearchVehicle(0);
    this.querySearchDriver();
  },
  methods: {
    handleFilter() {
      this.getList();
    },
    getList() {
      this.listLoading = true;
      // this.listQuery.periodName = this.getMonthByTimeStr(this.listQuery.periodName);
      reportPlatenum(this.listQuery).then(response => {
        var data = response.data.datas;
        if(data) {
          this.list = response.data.datas;
          for (var i = 0; i < this.list.length; i++) {
            this.list[i].unitTimePrice=parseFloat(this.list[i].unitTimePrice).toFixed(2);
            this.list[i].totalFee=parseFloat(this.list[i].totalFee).toFixed(2);
            this.list[i].timePrice=parseFloat(this.list[i].timePrice).toFixed(2);
            this.list[i].carPropertyName = this.list[i].vehicleProperties===0?'公务用车':'应急执法';
          }
        }
        else{
            this.list = [];
          }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    carPropertyChange(item){
      this.querySearchVehicle(item);
    },
    querySearchDept(){
      deptList().then(response => {
        var result = response.data.datas;
        if(result){
          for(var i=0;i<result.length;i++){
            this.selectDeptList.push({value:result[i].departmentName,deptId:result[i].id});
          }
        }
      });
    },
    //选择车辆
    querySearchVehicle(type){
      vehicleEnableList().then(response => {
        var data = response.data.datas;
        var count=0;
        if(data) {
          this.vehicleList = response.data.datas;
          count = response.data.datas.length;
          this.selectPlateList=[];
          for(var i=0;i< count;i++){
            if(type==0 && this.vehicleList[i].desc.toLowerCase().indexOf("公务用车") !=-1)//公务用车
            {
              this.selectPlateList.push({value:this.vehicleList[i].desc,plateNumber:this.vehicleList[i].plateNumber,vehicleId:this.vehicleList[i].id});
            }
            else if(type==1 && this.vehicleList[i].desc.toLowerCase().indexOf("应急执法") !=-1)
            {
              this.selectPlateList.push({value:this.vehicleList[i].desc,plateNumber:this.vehicleList[i].plateNumber,vehicleId:this.vehicleList[i].id});
            }
          }
        }
      });
    },
    //选择司机
    querySearchDriver(){
      driverEnableList().then(response => {
        var data = response.data.datas;
        var count=0;
        if(data) {
          this.driverList = data;
          count = response.data.datas.length;
          for(var i=0;i<count;i++){
            this.selectDriverList.push({value:this.driverList[i].name,name:this.driverList[i].name,driverId:this.driverList[i].id,driverPhone:this.driverList[i].mobileNum});
          }
        }
      });
    },
    //获取当前年月
    getLocalDatetime(){
      var objD = new Date();
      var yy = objD.getYear();
      if (yy < 1900)
        yy = yy + 1900;
      var MM = objD.getMonth() + 1;
      if (MM < 10)
        MM = '0' + MM;
      var str = yy + "-" + MM;
      return str;
    },
    //获取当前年月
    getLocalYearFirstDay(){
      var objD = new Date();
      var yy = objD.getYear();
      if (yy < 1900)
        yy = yy + 1900;
      var str = yy + "-01-01";
      return str;
    },
    handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['车牌号','品牌','车辆性质','运营班次','总里程(公里)','总时长','总费用']
          const filterVal = ['plateNumber','vehicleBrand','carPropertyName','count','totalMiles','totalUseTime','totalFee'];
          const data = this.formatJson(filterVal, this.list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename:'车辆运营情况明细表('+this.listQuery.startTime +'至'+ this.listQuery.endTime +')'
          });
          this.downloadLoading = false;
        });
      },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
