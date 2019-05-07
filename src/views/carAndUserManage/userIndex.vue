<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="80px" style="margin-left:50px;">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('userAndCarTable.userName')" prop="type">
              <el-input :placeholder="$t('userAndCarTable.userName')" v-model="listQuery.userName" style="width: 220px;" class="filter-item"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('userAndCarTable.userId')" prop="type">
              <el-input :placeholder="$t('userAndCarTable.userId')" v-model="listQuery.userId" style="width: 220px;" class="filter-item" />
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
      <el-table-column :label="$t('userAndCarTable.userId')" prop="id" sortable="custom" align="center" width="120px">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.userName')" prop="id" sortable="custom" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.mobileNum')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.departmentName')" min-width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.departmentName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.roleName')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.email')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.currentState')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.state }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column :label="$t('userAndCarTable.edit')" align="center" width="auto">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">{{ scope.row.edit }}</el-button>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('userAndCarTable.operation')" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">{{ scope.row.edit }}</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">{{ scope.row.delete }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" >
      <el-form :rules="rules" :model="addParam" label-position="left" label-width="100px" style=" margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.userId')">
              <el-input v-model="addParam.account" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.userName')" >
              <el-input v-model="addParam.displayName" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.mobileNum')" prop="dept">
              <el-input v-model="addParam.phone" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.email')">
              <el-input v-model="addParam.email" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.roleName')">
              <el-select v-model="addParam.roleId" class="filter-item" placeholder="请选择">
                <el-option v-for="item in roleOptions" :key="item.key" :label="item.display_name" :value="item.key" style="width: 205px;"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.departmentName')">
              <el-select v-model="addParam.departmentId" class="filter-item" placeholder="请选择">
                <el-option v-for="item in deptOptions" :key="item.key" :label="item.display_name" :value="item.key" style="width: 205px;"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-form-item :label="$t('userAndCarTable.remark')">-->
        <!--<el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="addParam.remark" type="textarea" placeholder="请输入" style="width: 540px;"/>-->
        <!--</el-form-item>-->

        <!--<el-form-item :label="$t('userAndCarTable.uploadImage')">-->
        <!--<el-upload-->
        <!--:multiple="true"-->
        <!--action="http://upload.qiniup.com"-->
        <!--accept="image/jpeg,image/gif,image/png,image/bmp"-->
        <!--list-type="picture-card"-->
        <!--:file-list="fileList"-->
        <!--:on-preview="handlePictureCardPreview"-->
        <!--:on-change="onFileChange"-->
        <!--:data="fileToken"-->
        <!--:on-remove="handleRemove">-->
        <!--<i class="el-icon-plus"></i>-->
        <!--</el-upload>-->
        <!--<el-dialog :visible.sync="dialogVisible">-->
        <!--<img width="100%" :src="dialogImageUrl" alt="">-->
        <!--</el-dialog>-->
        <!--</el-form-item>-->
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
import { userList, userDelete, userAdd, userItem, userUpdate, deptList, roleList } from '@/api/userAndCar'
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
      fileToken: {
        key: '20975961.jpg',
        token: 'YqRrb2TZ6Q9R5gbusiTGY7Ox8frdS_IH0Cr-m2T0:uwJWLucIdwWRg0jNy_mEUZwjYOg=:eyJzY29wZSI6InNvdXRoc3RhciIsImRlYWRsaW5lIjoxNTUzMjczMDcwfQ=='
      },
      fileList: [{ name: 'food.jpg', url: 'http://pojl0g6cl.bkt.clouddn.com/20975961.jpg?e=1552918399&token=YqRrb2TZ6Q9R5gbusiTGY7Ox8frdS_IH0Cr-m2T0:mcb0jwUtW72KqXA6ZBCUx5skfbc=' }],
      tableKey: 0,
      deptList: null,
      roleList: null,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        userName: '',
        userId: '',
        departmentId: '',
        page: 1,
        limit: 10
      },
      addParam: {
        account: '', // 用户ID
        password: '123456', // 密码
        displayName: '', // 用户姓名
        departmentId: '', // 单位ID
        phone: '', // 电话
        email: '', // 邮箱
        roleId: ''// 用户角色
      },
      deptOptions: [],
      roleOptions: [],
      carPropertyOptions: [],
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
        edit: '编辑用户',
        create: '新增用户'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        // userName: [{ required: true, message: '请填写用车人' }],
        // dept: [{ required: true, message: '请选择单位'}],
        // carType: [{ required: true, message: '请选择类型'}],
        // useArea: [{ required: true, message: '请选择区域'}],
        // carProperty: [{ required: true, message: '请选择性质'}],
        // datetime: [{ required: true, message: '请选择时间' }],
        // userMobile: [{ type: 'date', required: true, message: '请填写用车人', trigger: 'change' }],
      },
      downloadLoading: false,
      editId: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
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
      })
      roleList().then(response => {
        this.roleList = response.data.datas
        var count = response.data.datas.length
        for (var j = 0; j < count; j++) {
          var obj = {
            key: this.roleList[j].id,
            display_name: this.roleList[j].displayName
          }
          this.roleOptions.push(obj)
        }
      })
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    getList() {
      this.listLoading = true
      userList(this.listQuery).then(response => {
        var data = response.data.datas
        if (data) {
          this.list = response.data.datas;
          this.total = response.data.pageInfo.sum;
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
        account: '', // 用户ID
        password: '123456', // 密码
        displayName: '', // 用户姓名
        departmentId: '', // 单位ID
        phone: '', // 电话
        email: '', // 邮箱
        roleId: ''// 用户角色
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
      debugger
      userAdd(this.addParam).then(response => {
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
      debugger

      this.editId = row.id
      userItem(row.id).then(response => {
        this.addParam = response.data.datas
        this.dialogStatus = 'edit'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    editData() {
      userUpdate(this.editId, this.addParam).then(response => {
        if (response.data.code == 0) {
          this.getList()
          this.dialogFormVisible = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改失败',
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
        userDelete(row.id).then(response => {
          if (response.data.code == 200) {
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
          const tHeader = ['用户姓名', '账号', '电话号码', '单位', '角色名', '邮箱', '备注']
          const filterVal = ['userName', 'accountName', 'phone', 'departmentName', 'roleName', 'email', 'remark']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '用户列表'
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
