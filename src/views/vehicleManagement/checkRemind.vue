<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataForm" label-position="left" label-width="80px" style="margin-left:50px;">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('vehicleManageTable.plateNum')" label-width="80px" class="postInfo-container-item">
              <el-input :placeholder="$t('vehicleManageTable.plateNum')" v-model="listQuery.plateNum" style="width: 220px;" class="filter-item" @keyup.enter.native="handleFilter"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('vehicleManageTable.startDate')" label-width="80px" class="postInfo-container-item">
              <el-date-picker v-model="listQuery.startTime" :placeholder="$t('applyTable.endTime')" type="date" format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('vehicleManageTable.endDate')" label-width="80px" class="postInfo-container-item">
              <el-date-picker v-model="listQuery.endTime" :placeholder="$t('applyTable.beginTime')" type="date" format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
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
      <el-table-column :label="$t('vehicleManageTable.plateNum')" prop="id" sortable="custom" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.plateNum }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('vehicleManageTable.vehiclBrand')" prop="id" sortable="custom" align="center" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.vehiclBrand }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('vehicleManageTable.motDate')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.motDate }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('vehicleManageTable.dealPerson')" min-width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.dealPerson }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('vehicleManageTable.reminderDate')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reminderDate }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('vehicleManageTable.remark')" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('vehicleManageTable.edit')" align="center" width="auto">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">{{ scope.row.edit }}</el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('vehicleManageTable.delete')" align="center" width="auto">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDelete(scope.row)">{{ scope.row.delete }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" >
      <el-form :model="addParam" label-position="left" label-width="100px" style=" margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('vehicleManageTable.plateNum')" prop="userName">
              <el-input v-model="addParam.plateNum" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('vehicleManageTable.vehiclBrand')" >
              <el-input v-model="addParam.vehiclBrand" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('vehicleManageTable.motDate')" >
              <el-date-picker v-model="addParam.motDate" :placeholder="$t('vehicleManageTable.motDate')" type="date" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('vehicleManageTable.reminderDate')" >
              <el-date-picker v-model="addParam.reminderDate" :placeholder="$t('vehicleManageTable.reminderDate')" type="date" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('vehicleManageTable.dealPerson')">
              <el-input v-model="addParam.dealPerson" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('userAndCarTable.remark')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="addParam.remark" type="textarea" placeholder="请输入" style="width: 540px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('userAndCarTable.cancel') }}</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData()">{{ $t('userAndCarTable.save') }}</el-button>
        <el-button v-if="dialogStatus==='edit'" type="primary" @click="editData()">{{ $t('userAndCarTable.save') }}</el-button>

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
import { motReminderList, motReminderDelete, motReminder, motReminderUpdate, motReminderAdd } from '@/api/vehicleManage'
import { setToken, getToken } from '@/utils/auth'
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
        MOTDate: '',
        DealPerson: '',
        ReminderDate: '', // 提醒时间？
        Status: 0,
        Remark: ''
      },
      statusOptions: ['published', 'deleted'],
      showReviewer: false,
      dialogFormVisible: false,
      dialogVisible: false,
      dialogStatus: '',
      textMap: {
        edit: '编辑年检提醒',
        create: '新增年检提醒'
      },
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false
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
      // motReminderList(this.listQuery).then(response => {
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
      motReminderAdd(this.addParam).then(() => {
        this.list.unshift(this.addParam)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleEdit(row) {
      motReminder(row.id).then(response => {
        this.addParam = response.data.datas[0]
        this.dialogStatus = 'edit'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    editData(row) {
      motReminderUpdate(row.id, this.addParam).then(() => {
        this.list.unshift(this.addParam)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        motReminderDelete(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
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
