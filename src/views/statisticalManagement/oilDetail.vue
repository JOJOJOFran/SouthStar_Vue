<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataForm" label-position="left" label-width="80px" style="margin-left:50px;">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('statisticalTable.plateNumber')" prop="type">
              <el-input :placeholder="$t('statisticalTable.plateNumber')" v-model="listQuery.plateNum" style="width: 220px;" class="filter-item" @keyup.enter.native="handleFilter"/>
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
            <el-form-item :label="$t('statisticalTable.month')">
              <el-date-picker v-model="listQuery.periodName" type="month" :placeholder="$t('statisticalTable.selectMonth')"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
          </el-col>
          <el-col :span="8">
            <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
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
      style="width: 100%;">
      <el-table-column :label="$t('statisticalTable.orderNum')" align="center" width="50px">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNum }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('statisticalTable.addOilDate')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.addOilDate }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('statisticalTable.plateNumber')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.plateNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('statisticalTable.carProperty')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carProperty }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('statisticalTable.odograph')" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.odograph }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('statisticalTable.condition')" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.condition }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('statisticalTable.addOilTime')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.addOilTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('statisticalTable.oilType')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oilType }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('statisticalTable.carCode')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('statisticalTable.oilAmount')" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oilAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('statisticalTable.moneyAmount')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.moneyAmount }}</span>
        </template>
      </el-table-column>
       <el-table-column :label="$t('statisticalTable.surplusAmount')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.surplusAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('statisticalTable.dealPerson')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dealPerson }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('statisticalTable.remark')" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('statisticalTable.caozuo')" align="center" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button  type="primary" size="mini" @click="handleAccounting(scope.row)">修改</el-button>
          <el-button  type="danger" size="mini" @click="handleAccounting(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import {vehicleList} from '@/api/vehicleManage'
import { setToken, getToken } from '@/utils/auth'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

const deptOptions = []

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = deptOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination,UploadExcelComponent},
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
      dialogImageUrl: '',
      deptList: null,
      list: [],
      total: 0,
      listLoading: true,
      tableKey: 0,
      listQuery: {
        startDate: '',
        endDate: '',
        PlateNum: '',
        page: 1,
        limit: 10
      },
      addParam: {
        PlateNum: '',
        VehiclBrand: '',
        InsuranceStartDate: '',
        InsuranceEndDate: '',
        InsuranceType: '',
        InsuranceFee: '',
        DealPerson: '',
        ReminderDate: '', // 提醒时间？
        Status: 0,
        Remark: ''
      },
      carPropertyOptions:[{key:0,display_name:'公务用车组'},{key:1,display_name:'应急执法组'}],
      dialogFormVisible: false,
      dialogVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      downloadLoading: false,

      tableData: [],
      tableHeader: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      var userName = getToken('UserName')
      console.log(userName)
      this.getList()
    },
    getList() {
      this.listLoading = false
      // this.listLoading = true;
      // insuranceReminderList(this.listQuery).then(response => {
      //   this.list = response.data.datas;
      //   //this.total = response.data.pageInfo.sum;
      //   this.total=this.list.length;
      //   for (var i = 0; i < this.total; i++) {
      //     this.list[i].edit = '编辑';
      //     this.list[i].delete ='删除';
      //   }
      //   setTimeout(() => {
      //     this.listLoading = false;
      //   }, 1.5 * 1000)
      // })
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      var listData=[];
      for(var i=0;i<results.length;i++){
        var lineObj={
          orderNum:results[i].序号,
          addOilDate:results[i].日期,
          plateNumber:results[i].车牌号,
          carProperty:results[i].车辆性质,
          odograph:results[i].用车里程数,
          condition:results[i].车辆目前状况?results[i].车辆目前状况:'',
          addOilTime:results[i].加油时间,
          oilType:results[i].加油型号,
          carCode:results[i].油卡编号,
          oilAmount:results[i].加油数量,
          moneyAmount:results[i].金额,
          surplusAmount:results[i].余额,
          dealPerson:results[i].加油人,
          remark:results[i].备注?results[i].备注:''
        }
        listData.push(lineObj);
        this.list.push(lineObj);
      }
      console.log(listData);
    },
    carPropertyChange(item){

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
      var str = yy + '' + MM + '' + dd + '' + hh + '' + mm + '' + ss
      return str
    },
    handleFilter() {
      this.listQuery.page = 1
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
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      
    },
    handleEdit(row) {
      
    },
    editData(row) {
      
    },
    handleDelete(row) {
      this.$confirm('确认删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
       
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['流程编号', '用车人', '用车类型', '用车人电话', '出发时间', '归队时间', '出发地', '目的地', '用车事由', '申请状态', '审核状态']
          const filterVal = ['applyNum', 'userName', 'carType', 'userMobile', 'startPlanTime', 'backPlanTime', 'startPoint', 'destination', 'applyReson', 'status', 'checkStatus']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '用车申请列表'
          })
          this.downloadLoading = false
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
