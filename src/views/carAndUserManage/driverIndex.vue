<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px" style="margin-left:50px;">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('userAndCarTable.driverName')" prop="type">
              <el-input :placeholder="$t('userAndCarTable.driverName')" v-model="listQuery.name" style="width: 220px;" class="filter-item" @keyup.enter.native="handleFilter"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('userAndCarTable.drivingLicNum')" prop="type">
              <el-input :placeholder="$t('userAndCarTable.drivingLicNum')" v-model="listQuery.drivingLicNum" style="width: 220px;" class="filter-item" @keyup.enter.native="handleFilter"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('userAndCarTable.departmentName')" prop="type">
              <el-select v-model="listQuery.departmentId" :placeholder="$t('userAndCarTable.departmentName')" clearable class="filter-item" style="width: 230px">
                <el-option v-for="item in deptOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
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
      <el-table-column :label="$t('userAndCarTable.driverName')" sortable="custom" align="center" width="120px">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.sex')"  sortable="custom" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.groupNum')" sortable="custom" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.groupNum }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.mobileNum')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobileNum }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.drivingLicNum')" min-width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.drivingLicNum }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.permittedType')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.permittedType }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.expirationDate')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.expirationDate }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.remark')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.operation')" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">{{ scope.row.edit }}</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">{{ scope.row.delete }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog id="" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="addParam" label-position="left" label-width="100px" style=" margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.driverName')" >
              <el-input v-model="addParam.name" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.departmentName')" >
              <el-select v-model="addParam.departmentId" class="filter-item" placeholder="请选择"  style="width: 205px;">
                <el-option v-for="item in deptOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.driverAge')" >
              <el-input v-model="addParam.age" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.sex')" >
              <el-select v-model="addParam.sex" class="filter-item" placeholder="请选择"  style="width: 205px;">
                <el-option v-for="item in sexOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.mobileNum')" >
              <el-input v-model="addParam.mobileNum" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.address')">
              <el-input v-model="addParam.address" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.drivingLicNum')">
              <el-input v-model="addParam.drivingLicNum" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.firstDriveDate')">
              <el-date-picker v-model="addParam.issueDate" :placeholder="$t('userAndCarTable.firstDriveDate')" style="width: 205px;" type="date" format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.expirationDate')">
              <el-date-picker v-model="addParam.expirationDate" :placeholder="$t('userAndCarTable.expirationDate')" style="width: 205px;" type="date" format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.drivingLicType')">
               <el-input v-model="addParam.permittedType" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.driverStatus')">
              <el-select v-model="addParam.status" class="filter-item" placeholder="请选择" style="width: 205px;">
                <el-option v-for="item in driverStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.groupNum')">
              <el-select v-model="addParam.groupNum" class="filter-item" placeholder="请选择"  style="width: 205px;">
                <el-option v-for="item in groupOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('userAndCarTable.remark')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="addParam.remark" type="textarea" placeholder="请输入" style="width: 540px;"/>
        </el-form-item>

        <el-form-item :label="$t('userAndCarTable.uploadImage')">
          <el-upload
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card">
            <i class="el-icon-plus"/>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img :src="addParam.carIcon" width="100%" alt="">
          </el-dialog>
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
import { driverList, driverDelete, driverAdd, driverItem, driverUpdate, getImageToken, deptList } from '@/api/userAndCar'
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
      tableKey: 0,
      deptList: null,
      carTypeList: null,
      carPropertyList: null,
      basicColorList: null,
      basicBrandList: null,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        name: '',
        drivingLicNum: '',
        departmentId: '',
        page: 1,
        limit: 10
      },
      addParam: {
        id: '',
        departmentId: '', // 单位ID
        departmentName: '',
        name: '', // 姓名
        sex: 1, // 性别
        age: '',
        phoneNum: '',
        mobileNum: '',
        address: '',
        drivingLicNum: '', // 驾驶证编号
        permittedType: '', // 驾照类型
        issueDate: '', // 初次领证日期
        expirationDate: '', // 截止日期
        remark: '', // 备注
        status: '',
        image: '',// 图片
        groupNum:''
      },
      deptOptions: [],
      applyStatusOptions: [{ key: '', display_name: '全部' }, { key: '1', display_name: '在线' }, { key: '2', display_name: '离线' }, { key: '3', display_name: '异常' }],
      useAreaOptions: [{ key: '县区内', display_name: '县区内' }, { key: '市内', display_name: '市内' }, { key: '市外', display_name: '市外' }, { key: '省外', display_name: '省外' }],
      carPropertyOptions: [{ key: '0', display_name: '公务用车组' }, { key: '1', display_name: '应急执法组' }],
      sexOptions: [{ key: 1, display_name: '男' }, { key: 0, display_name: '女' }],
      carTypeOptions: [{ key: '0', display_name: '轿车' }, { key: '1', display_name: '客车' }],
      drivingLicTypeOptions: [{ key: 'C1', display_name: 'C1' }, { key: 'B2', display_name: 'B2' }],
      driverStatusOptions: [
        { key: 0, display_name: '空闲' }, { key: 1, display_name: '值班' }, { key: 2, display_name: '出车' },
        { key: 3, display_name: '请假' }//, { key: 5, display_name: '休假' }, { key: 6, display_name: '加班' }
      ],
      groupOptions:[{ key: 1, display_name: '一队' }, { key: 2, display_name: '二队' }, { key: 3, display_name: '三队' }],
      basicColorOptions: [],
      basicBrandOptions: [],
      oilTypeOptions: [{ key: 'GasOilne', display_name: '汽油' }, { key: 'DieselOil', display_name: '柴油' }],
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
      dialogVisible: false,
      dialogStatus: '',
      textMap: {
        edit: '编辑驾驶员',
        create: '新增驾驶员'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
      },
      downloadLoading: false,
      editId: ''
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
          this.deptOptions.push(obj)
        }
        this.getList();
      })
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    getList() {
      this.listLoading = true
      driverList(this.listQuery).then(response => {
        var data = response.data.datas
        if (data) {
          this.list = response.data.datas
          this.total = response.data.pageInfo.sum
          for (var i = 0; i < this.list.length; i++) {
            this.list[i].edit = '编辑'
            this.list[i].delete = '删除'
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
    handlePictureCardPreview() {},
    handleRemove() {},
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
    clearParam() {
      this.addParam = {
        id: '',
        departmentId: '', // 单位ID
        departmentName: '',
        name: '', // 姓名
        sex: 1, // 性别
        age: '',
        phoneNum: '',
        mobileNum: '',
        address: '',
        drivingLicNum: '', // 驾驶证编号
        permittedType: '', // 驾照类型
        issueDate: '', // 初次领证日期
        expirationDate: '', // 截止日期
        remark: '', // 备注
        status: '',
        image: '',// 图片
        groupNum:''
      }
    },
    handleCreate() {
      this.clearParam()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      console.log(this.addParam)
      driverAdd(this.addParam).then(response => {
        if (response.data.code == 0) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.getList()
          this.dialogFormVisible = false
        } else {
          this.$message({
            message: '添加失败',
            type: 'error'
          })
        }
      })
    },
    handleEdit(row) {
      this.editId = row.id
      driverItem(row.id).then(response => {
        this.addParam = response.data.datas[0]
        this.dialogStatus = 'edit'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    editData() {
      driverUpdate(this.editId, this.addParam).then(response => {
        if (response.data.code == 0) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.getList()
          this.dialogFormVisible = false
        } else {
          this.$message({
            message: '更新失败',
            type: 'error'
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        driverDelete(row.id).then(response => {
          if (response.data.code == 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          }
        })
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
          const tHeader = ['驾驶员姓名', '性别', '手机号', '驾驶证号', '准驾车型', '证件截止日期', '备注']
          const filterVal = ['name', 'sex', 'mobileNum', 'drivingLicNum', 'permittedType', 'expirationDate', 'remark']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '驾驶员列表'
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
