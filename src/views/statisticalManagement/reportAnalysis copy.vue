<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataForm" label-position="left" label-width="80px" style="margin-left:50px;">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('statisticalTable.month')">
              <el-date-picker v-model="listQuery.periodName" type="month" style="width:200px" :placeholder="$t('statisticalTable.selectMonth')"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('statisticalTable.carProperty')">
              <el-select v-model="listQuery.carProperty" :placeholder="$t('statisticalTable.carProperty')" @change="carPropertyChange">
                <el-option v-for="item in carPropertyOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item :label="$t('statisticalTable.department')" prop="type">
                <el-select v-model="listQuery.depName" filterable placeholder="请选择">
                  <el-option
                    v-for="item in selectDeptList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
               </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('statisticalTable.plateNumber')">
                <el-select v-model="listQuery.vehicleId" filterable placeholder="请选择">
                  <el-option
                    v-for="item in selectPlateList"
                    :key="item.vehicleId"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('statisticalTable.driverName')">
                <el-select v-model="listQuery.driverId" filterable placeholder="请选择">
                  <el-option
                    v-for="item in selectDriverList"
                    :key="item.driverId"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="8">
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
      height="450"
      style="width: 100%;">
      <el-table-column :label="$t('statisticalTable.applyNum')" align="center" width="120" fixed="left">
          <template slot-scope="scope">
            <span style="color:#409EFF">{{ scope.row.applyNum }}</span>
          </template>
      </el-table-column>
      <el-table-column label="用车单位信息" align="center">
        <el-table-column :label="$t('statisticalTable.department')" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.departmentName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('statisticalTable.userName')" width="auto" align="100">
          <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('statisticalTable.userMobile')" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.userMobile }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('statisticalTable.startPoint')" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.startPoint }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('statisticalTable.destination')" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.destination }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('statisticalTable.applyReason')" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.applyReson }}</span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="平台调度信息" align="center">
          <el-table-column :label="$t('statisticalTable.driverName')" align="center" width="180">
            <template slot-scope="scope">
              <span style="color:#409EFF">{{ scope.row.driverName }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('statisticalTable.plateNumber')" align="center" width="160">
            <template slot-scope="scope">
              <span style="color:#409EFF">{{ scope.row.plateNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('statisticalTable.carType')" align="center" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.carType}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('statisticalTable.vehicleBrand')" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.vehicleBrand }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('statisticalTable.displacament')" align="center" width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.displacament }}</span>
            </template>
          </el-table-column>
      </el-table-column>

      <el-table-column label="用车信息" align="center">
          <el-table-column :label="$t('statisticalTable.startPlanTime')" align="center" width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.startPlanTime}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('statisticalTable.backPlanTime')" align="center" width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.backTime }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('statisticalTable.countTime')" align="center" width="100">
            <template slot-scope="scope">
              <span style="color:red">{{ scope.row.useTime }}</span>
            </template>
          </el-table-column>
       </el-table-column>

      <el-table-column label="用车里程" align="center">
          <el-table-column :label="$t('statisticalTable.startMileage')" align="center" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.startKm}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('statisticalTable.endMileage')" align="center" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.endKm }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('statisticalTable.countMileage')" align="center" width="120">
            <template slot-scope="scope">
              <span style="color:red">{{ scope.row.useMiles }}</span>
            </template>
          </el-table-column>
      </el-table-column>

      <el-table-column label="用车费用" align="center">
          <el-table-column :label="$t('statisticalTable.mileageFee')" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.milePrice}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('statisticalTable.useTimeFee')" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.timePrice }}</span>
            </template>
          </el-table-column>
      </el-table-column>
      
      <el-table-column label="其他费用" align="center">
        <el-table-column :label="$t('statisticalTable.expresswayExpense')" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.highwayFee }}</span>
          </template>
          </el-table-column>
          <el-table-column :label="$t('statisticalTable.parkExpense')" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.parkFee}}</span>
            </template>
          </el-table-column>
      </el-table-column>

      <el-table-column :label="$t('statisticalTable.totalFee')" align="center" width="100" fixed="right">
            <template slot-scope="scope">
              <span>{{ scope.row.totalFee }}</span>
            </template>
      </el-table-column>

      <el-table-column :label="$t('statisticalTable.caozuo')" align="center" width="auto" fixed="right">
        <template slot-scope="scope">
          <el-button  type="primary" size="mini" @click="handleAccounting(scope.row)">{{ scope.row.costAccounting }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog  :title="'核算设置'" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" label-position="left" label-width="100px" style=" margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('statisticalTable.unitMilePrice')" label-width="200">
              <el-input v-model="receiptModel.unitMilePrice" style="width: 150px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('statisticalTable.unitTimePrice')" label-width="200" >
              <el-input v-model="receiptModel.unitTimePrice" style="width: 150px;"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('applyTable.cancel') }}</el-button>
        <el-button type="primary" @click="setUnitPrice">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { driverEnableList,vehicleEnableList,deptList} from '@/api/applyCar'
import {dispatchDept,reportList,setUnitPrice} from '@/api/statistical'
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
      total: 0,
      listLoading: true,
      listQuery: {
        driverId: '', 
        vehicleId:'',
        depName:'',
        periodName:this.getLocalDatetime(),
        carProperty:0,
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
      reportList(this.listQuery).then(response => {
        var data = response.data.datas;
        if(data) {
          this.list = response.data.datas;
          for (var i = 0; i < this.list.length; i++) {
            this.list[i].costAccounting = "核算";
            this.list[i].unitTimePrice=this.list[i].unitTimePrice.toFixed(2);
            this.list[i].totalFee=this.list[i].totalFee.toFixed(2);
            this.list[i].timePrice=this.list[i].timePrice.toFixed(2);
          }
        }
        else{
            this.list = [];
            this.total = 0;
          }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // handleCheckedTypeChange(val,item){
    //   if(val){
    //    switch(item){
    //     case "司机姓名":
    //       this.showDriver=true;
    //       break;
    //     case "车牌号":
    //       this.showPlate=true;
    //       break;
    //     case "用车单位":
    //       this.showDepartment=true;
    //       break;
    //    }
    //   }else{
    //     switch(item){
    //     case "司机姓名":
    //       this.showDriver=false;
    //       this.listQuery.driverId='';
    //       break;
    //     case "车牌号":
    //       this.showPlate=false;
    //       this.listQuery.vehicleId = '';
    //       break;
    //     case "用车单位":
    //       this.showDepartment=false;
    //       this.listQuery.depName='';
    //       break;
    //    }
    //   }
    // },
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
    //核算模板设置
    handleAccounting(row){
      this.dialogFormVisible=true;
      this.receiptModel.receiptId=row.receiptId;
    },
    setUnitPrice(){
      setUnitPrice(this.receiptModel).then(response => {
        if(response.data.code==0){
          this.dialogFormVisible=false;
          this.$message({
            message: '设置成功',
            type: 'success'
          });
          this.getList();
        }else {
          this.$message({
            message: '设置失败',
            type: 'error'
          })
        }
      })
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
    //  //通过时间获取年月
    // getMonthByTimeStr(timeStr){
    //   var objD = new Date(timeStr);
    //   var yy = objD.getYear();
    //   if (yy < 1900)
    //     yy = yy + 1900;
    //   var MM = objD.getMonth() + 1;
    //   if (MM < 10)
    //     MM = '0' + MM;
    //   var str = yy + "-" + MM;
    //   return str;
    // },
    // handleDownload() {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['流程编号','用车人','用车类型','用车人电话','出发时间','归队时间','出发地','目的地','用车事由','申请状态','审核状态']
    //     const filterVal = ['applyNum','userName','carType','userMobile','startPlanTime','backPlanTime','startPoint','destination','applyReson','status','checkStatus'];
    //     const data = this.formatJson(filterVal, this.list);
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: '用车申请列表'
    //     });
    //     this.downloadLoading = false;
    //   });
    // },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const multiHeader = [['申请单号','用车单位信息','','','','','','平台调度信息','','','','','用车信息','','','用车里程','','','用车费用','','其他费用','','合计(元)']];
          const header = ['', '用车单位','用车人','电话','出发地','目的地','事项','驾驶员','车辆','车辆类型','车辆品牌','排量','出发时间','归队时间','用时(分钟)','初始里程(KM)','归队里程(KM)','出行里程(KM)','里程费','时长费','高速费','停车费',''];
          const filterVal = ['applyNum','departmentName','userName','userMobile','startPoint','destination','applyReson','driverName','plateNumber','carType','vehicleBrand','displacament','startPlanTime','backTime','useTime','startKm','endKm','useMiles','milePrice','timePrice','highwayFee','parkFee','totalFee'];
          const list = this.list;
          const data = this.formatJson(filterVal, list);
          const merges = ['A1:A2', 'B1:G1','H1:L1','M1:O1','P1:R1','S1:T1','U1:V1','W1:W2'];
          excel.export_json_to_excel({
            multiHeader,
            header,
            merges,
            data,
            filename: '派车单汇总列表'
          })
          this.downloadLoading = false;
        })
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
