<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="80px" style="margin-left:50px;">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('applyTable.applyNum')" prop="type">
              <el-input :placeholder="$t('applyTable.applyNum')" v-model="listQuery.applyNum" style="width: 220px;" class="filter-item" @keyup.enter.native="handleFilter"/>
            </el-form-item>
          </el-col>
          <!--<el-col :span="8">-->
            <!--<el-form-item :label="$t('applyTable.applyStatus')" prop="type">-->
              <!--<el-select v-model="listQuery.status" :placeholder="$t('applyTable.applyStatus')" clearable class="filter-item" style="width: 230px">-->
                <!--<el-option v-for="item in applyStatusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="8">
            <el-form-item label-width="80px" :label="$t('applyTable.beginTime')" class="postInfo-container-item">
              <!--<el-date-picker v-model="listQuery.startDate" type="datetime" format="yyyy-MM-dd" :placeholder="$t('applyTable.beginTime')"/>-->
              <el-date-picker
                v-model="listQuery.startDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="80px" :label="$t('applyTable.endTime')" class="postInfo-container-item">
              <!--<el-date-picker v-model="listQuery.endDate" type="datetime" format="yyyy-MM-dd" :placeholder="$t('applyTable.endTime')"/>-->
              <el-date-picker
                v-model="listQuery.endDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column :label="$t('applyTable.applyNum')" align="center" width="120">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{ scope.row.applyNum }}</span>
        </template>
      </el-table-column>
       <el-table-column width="auto" align="center" :label="$t('applyTable.carProperty')">
        <template slot-scope="scope">
          <span>{{ scope.row.carProperty }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('applyTable.userName')" align="center" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('applyTable.carType')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carType }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('applyTable.userMobile')" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userMobile }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'类型'" width="70" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carType }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('applyTable.startPlanTime')" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startPlanTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('applyTable.backPlanTime')" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.backPlanTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('applyTable.startPoint')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startPoint }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('applyTable.destination')" align="center" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.destination }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('applyTable.applyReason')" align="center" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.applyReson }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('applyTable.status')" align="center" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('applyTable.dispatchStatus')" align="center" width="auto">
        <template slot-scope="scope">
          <span style="color: green;">{{ scope.row.checkStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('applyTable.diaodu')" align="center" width="auto">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="scope.row.diaodu==='调度'" style="background-color:#42b983" @click="handleDetail(scope.row)">{{ scope.row.diaodu }}</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.diaodu==='重新调度'" @click="handleDetail(scope.row)">{{ scope.row.diaodu }}</el-button>
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('applyTable.auto')" align="center" width="auto" class-name="small-padding fixed-width">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button v-if="scope.row.auto==='自动调度'" type="primary" size="mini" @click="handleDraft(scope.row)">{{ scope.row.auto }}</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog  :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" id="">
      <el-form ref="dataForm" :model="addParam" label-position="left" label-width="100px" style=" margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.userName')" prop="userName">
              <el-input v-model="addParam.userName" style="width: 205px;" :readOnly="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.userMobile')" >
              <el-input v-model="addParam.userMobile"  :readOnly="true" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.userDept')" prop="dept">
              <el-select v-model="addParam.departmentId" class="filter-item" placeholder="请选择" :disabled="true">
                <el-option v-for="item in deptOptions" :key="item.key" :label="item.display_name" :value="item.key" style="width: 205px;"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.userCount')">
              <el-input v-model="addParam.userCount"  class="filter-item" style="width: 205px;" :readOnly="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.carType')" prop="carType">
              <el-select v-model="addParam.carType" class="filter-item" placeholder="请选择" :disabled="true">
                <el-option v-for="item in carTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" style="width: 205px;"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.useArea')" prop="useArea">
              <el-select v-model="addParam.useArea" class="filter-item" placeholder="请选择" :disabled="true">
                <el-option v-for="item in useAreaOptions" :key="item.key" :label="item.display_name" :value="item.key" style="width: 205px;"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.startPoint')">
              <el-input v-model="addParam.startPoint"  :readOnly="true"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.destination')">
              <el-input v-model="addParam.destination"  :readOnly="true"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.startPlanTime')" class="postInfo-container-item" >
              <el-date-picker v-model="addParam.startPlanTime" type="datetime" format="yyyy-MM-dd" :disabled="true" :placeholder="$t('applyTable.endTime')" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.endTime')" class="postInfo-container-item" >
              <el-date-picker v-model="addParam.backPlanTime" type="datetime" format="yyyy-MM-dd" :disabled="true" :placeholder="$t('applyTable.endTime')" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.carProperty')" >
              <el-select v-model="addParam.carProperty"  placeholder="请选择" :disabled="true">
                <el-option v-for="item in carPropertyOptions" :key="item.key" :label="item.display_name" :value="item.key" style="width: 205px;"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.applyReason')" >
              <el-input v-model="addParam.applyReson"    :readOnly="true" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="$t('applyTable.remark')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="addParam.remark" type="textarea" :readOnly="true" placeholder="请输入" style="width: 540px;"/>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.applicantName')">
              <el-input v-model="addParam.applicantName"  :readOnly="true" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.applicantPhone')">
              <el-input v-model="addParam.applicantPhone"  :readOnly="true" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.departmentName')" prop="dept">
              <el-select v-model="applyDepartmentId" class="filter-item" placeholder="请选择" :disabled="true">
                <el-option v-for="item in deptOptions" :key="item.key" :label="item.display_name" :value="item.key" style="width: 205px;"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.chooseCar')">
              <!--<el-input v-model="model.PlateNumber" suffix-icon="el-icon-search" v-on:input="handleChooseCar(addParam.ApplyId)" style="width: 205px;"/>-->
              <el-autocomplete
                class="inline-input"
                v-model="dispatchModel.plateNumber"
                :fetch-suggestions="querySearchCar"
                suffix-icon="el-icon-search"
                placeholder="请输入内容"
                @select="handleSelectCar"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.chooseDriver')">
              <!--<el-input v-model="model.DriverName" suffix-icon="el-icon-search"  class="filter-item" style="width: 205px;"/>-->
              <el-autocomplete
                class="inline-input"
                v-model="dispatchModel.driverName"
                :fetch-suggestions="querySearchDriver"
                suffix-icon="el-icon-search"
                placeholder="请输入内容"
                @select="handleSelectDriver"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.departureTime')" >
              <el-date-picker v-model="dispatchModel.departureTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('applyTable.departureTime')" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('applyTable.cancel') }}</el-button>
        <el-button v-if="dialogStatus==='detail'" type="primary" @click="dispatchData()">确定</el-button>
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
  import { scheduleList, deptList,driverEnableList,vehicleEnableList,scheduleItem,applyDetail,dispatch,redispatch,dispatchItem} from '@/api/applyCar'
  import { setNewToken,getNewToken} from '@/utils/auth'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  const deptOptions = []

  // arr to obj ,such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = deptOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {
      return {
        tableKey: 0,
        deptList:null,
        carTypeList:null,
        carPropertyList:null,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          applyNum:'',
          startDate:'',
          endDate:'',
          page: 1,
          limit: 10
        },
        addParam:{
          id:''
          , applyNum: ''
          , applicantId: '' //申请人ID
          , applicantName: ''
          , applicantPhone: ''
          , departmentName: ''
          , departmentId:''
          , userName: ''// 用车人姓名,
          , userMobile: ''// 用车人电话,
          , userTitle: ''
          , userCount: ''
          , carType: ''
          , carProperty:''//使用性质
          , useArea: ''
          , startPoint: ''
          , destination: ''
          , applyReson: ''
          , startPlanTime: ''
          , backPlanTime: ''
          , fileName:''
          , reciverId: ''
          , reciverMobile:''
          , status: 0
          , createDate:'2019-01-01'
          , remark: ''
          , content:''
         
        },
        applyDepartmentId:'',
        deptOptions:[],
        applyStatusOptions:[{key:'',display_name:'全部'},{key:'0',display_name:'未审核'},{key:'1',display_name:'通过'},{key:'2',display_name:'驳回'},{key:'3',display_name:'已派车'}],
        useAreaOptions:[{key:'县区内',display_name:'县区内'},{key:'市内',display_name:'市内'},{key:'市外',display_name:'市外'},{key:'省外',display_name:'省外'}],
        carPropertyOptions:[{key:0,display_name:'公务用车组'},{key:1,display_name:'应急执法组'}],
        carTypeOptions:[{key:'轿车',display_name:'轿车'},{key:'商务车',display_name:'商务车'},{key:'小型客车',display_name:'小型客车'},{key:'客车',display_name:'客车'}],
        statusOptions: ['published', 'deleted'],
        showReviewer: false,
        temp: {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          type: '',
          status: 'published'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          detail: '申请详情',
          create: '创建申请',
          draft:'草稿信息'
        },
        dialogPvVisible: false,
        pvData: [],
        downloadLoading: false,
        applyId:'',
        dispatchModel:{
          driverId: '',
          driverName: '',
          driverPhone: '',
          vehicleId: '',
          plateNumber: '',
          dispatchType: 1,
          queueNo: 0,
          queueId: '',
          departureTime:''//出车时间
        },
        dispatchType:'',
      }
    },
    created() {
       deptList().then(response => {
          this.deptList = response.data.datas
          var count = response.data.datas.length
          for (var i = 0; i < count; i++) {
            var obj = {
              key: this.deptList[i].id,
              display_name: this.deptList[i].departmentName
            }
            this.deptOptions.push(obj);
          }
          this.getList();
        });
    },
    methods: {
      handleFilter() {
        this.listQuery.page = 1;
        this.getList();
      },
      getList() {
        this.listLoading = true;
        scheduleList(this.listQuery).then(response => {
          var data = response.data.datas;
          if(data) {
            this.list = response.data.datas;
            this.total = response.data.pageInfo.sum;
            for (var i = 0; i < this.list.length; i++) {
              if (this.list[i].checkStatus == '待调度') {
                this.list[i].diaodu = "调度";
                this.list[i].auto = "自动调度";
              }
              else if (this.list[i].checkStatus == '已调度') {
                this.list[i].diaodu = "重新调度";
              }
            }
          }else{
            this.list = [];
            this.total = 0;
          }
          
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      getLocalDatetime(){
        var objD = new Date();
        var yy = objD.getYear();
        if (yy < 1900)
          yy = yy + 1900;
        var MM = objD.getMonth() + 1;
        if (MM < 10)
          MM = '0' + MM;
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
        var str = yy + "" + MM + "" + dd + "" + hh + "" + mm + "" + ss;
        return str;
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      sortChange(data) {
        const { prop, order } = data
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.sort = '+id'
        } else {
          this.listQuery.sort = '-id'
        }
        this.handleFilter()
      },
      //选择车辆
      querySearchCar(queryString, cb){
        vehicleEnableList().then(response => {
          var result = response.data.datas;
          var carData=[];
          for(var i=0;i<result.length;i++){
              if(this.addParam.carProperty==0 || this.addParam.carProperty=='0'){
                 if(result[i].desc.indexOf(queryString) !=-1 && result[i].desc.indexOf("公务用车") !=-1){
                    carData.push({value:result[i].desc,id:result[i].id,plateNumber:result[i].plateNumber});
                 }
              }else{
                if(result[i].desc.indexOf(queryString) !=-1 && result[i].desc.indexOf("应急执法") !=-1){
                    carData.push({value:result[i].desc,id:result[i].id,plateNumber:result[i].plateNumber});
                 }
              }
          }
          cb(carData);
        });
      },
      handleSelectCar(item){
        this.dispatchModel.vehicleId=item.id;
        this.dispatchModel.plateNumber=item.value;
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
        this.dispatchModel.driverName=item.driverName+'('+item.driverPhone+')';
        this.dispatchModel.driverPhone=item.driverPhone;
      },
      handleDetail(row) {
        debugger
        this.applyId=row.applyId;
        this.dispatchType=row.checkStatus==="待调度"?0:1;
        applyDetail(row.applyId).then(resp => {
          if(this.dispatchType==1){
             dispatchItem(row.id).then(response => {
                this.dispatchModel.vehicleId=response.data.datas.vehicleId;
                this.dispatchModel.plateNumber=response.data.datas.plateNumber;
                this.dispatchModel.driverId=response.data.datas.driverId;
                this.dispatchModel.driverName=response.data.datas.driverName;
                this.dispatchModel.departureTime=response.data.datas.departureTime;
                this.applyDepartmentId = resp.data.datas[0].applyDepartmentId;
                this.addParam = resp.data.datas[0];
                this.dialogStatus = 'detail';
                this.dialogFormVisible = true;
                this.$nextTick(() => {
                  this.$refs['dataForm'].clearValidate()
                });
             });
          }else{
            this.applyDepartmentId = resp.data.datas[0].applyDepartmentId;
            this.addParam = resp.data.datas[0];
            this.dialogStatus = 'detail';
            this.dialogFormVisible = true;
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            });
          }
        }); 
      },
      dispatchData(){
        if(this.dispatchType==0){//调度
          dispatch(this.applyId,this.dispatchModel).then(response => {
            if(response.data.code==0){
              this.$message({
                message: '调度成功',
                type: 'success'
              });
              this.getList();
              this.dialogFormVisible = false;
            }
            else{
              this.$message({
                message: '调度失败',
                type: 'error'
              })
            }
          });
        }else{//重新调度
          redispatch(this.applyId,this.dispatchModel).then(response => {
            if(response.data.code==0){
              this.$message({
                message: '重新调度成功',
                type: 'success'
              });
              this.getList();
              this.dialogFormVisible = false;
            }
            else{
              this.$message({
                message: '重新调度失败',
                type: 'error'
              })
            }
          });
        }
      },
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData
          this.dialogPvVisible = true
        })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['流程编号','用车人','用车类型','用车人电话','出发时间','归队时间','出发地','目的地','用车事由']
          const filterVal = ['applyNum','userName','carType','userMobile','startPlanTime','backPlanTime','startPoint','destination','applyReson'];
          const data = this.formatJson(filterVal, this.list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '派单列表'
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
