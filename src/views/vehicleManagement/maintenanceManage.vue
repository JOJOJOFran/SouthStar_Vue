<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataForm" label-position="left" label-width="80px" style="margin-left:50px;">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('vehicleManageTable.plateNumber')">
              <el-input :placeholder="$t('vehicleManageTable.plateNumber')" v-model="listQuery.plateNum" style="width: 220px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('vehicleManageTable.startDate')">
              <el-date-picker v-model="listQuery.startDate" type="date" value-format="yyyy-MM-dd" :placeholder="$t('vehicleManageTable.startDate')"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('vehicleManageTable.endDate')">
              <el-date-picker v-model="listQuery.endDate" type="date" value-format="yyyy-MM-dd" :placeholder="$t('vehicleManageTable.endDate')"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('vehicleManageTable.carProperty')">
              <el-select v-model="listQuery.status" :placeholder="$t('vehicleManageTable.carProperty')" style="width；220px" >
                <el-option v-for="item in carPropertyOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="8">
            <el-form-item :label="$t('vehicleManageTable.maintainType')">
              <el-select v-model="listQuery.status" :placeholder="$t('vehicleManageTable.maintainType')" style="width；220px" >
                <el-option v-for="item in maintainTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
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
      style="width: 100%;">
      <el-table-column :label="$t('vehicleManageTable.plateNumber')" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.plateNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('vehicleManageTable.carProperty')"  align="center" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.carProperty }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('vehicleManageTable.applyer')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.applyer }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('vehicleManageTable.applyDate')" min-width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.applyDate }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('vehicleManageTable.captain')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.captain }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('vehicleManageTable.maintainType')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.maintainType }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('vehicleManageTable.amountCount')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.amount}}</span>
        </template>
      </el-table-column>
       <el-table-column :label="$t('vehicleManageTable.checker')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.checker }}</span>
        </template>
      </el-table-column>
       <el-table-column :label="$t('vehicleManageTable.watcher')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.watcher }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('vehicleManageTable.operation')" align="center" width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">{{ scope.row.edit }}</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">{{ scope.row.delete }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%">
      <el-form :model="addParam" label-position="left" label-width="100px" style=" margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('vehicleManageTable.applyer')" prop="userName">
              <el-input v-model="addParam.applyer" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <el-form-item :label="$t('vehicleManageTable.applyDate')" >
              <el-date-picker v-model="addParam.applyDate" value-format="yyyy-MM-dd" :placeholder="$t('vehicleManageTable.applyDate')" type="date" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('vehicleManageTable.plateNumber')" >
              <!-- <el-input v-model="addParam.plateNumber" style="width: 205px;"/> -->
              <el-select v-model="addParam.plateNumber" filterable placeholder="请选择">
                <el-option
                  v-for="item in plateOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('vehicleManageTable.captain')" >
              <el-input v-model="addParam.captain" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('vehicleManageTable.carProperty')" prop="dept">
              <el-select v-model="addParam.carProperty" :placeholder="$t('vehicleManageTable.carProperty')"  style="width: 205px;">
                <el-option v-for="item in carPropertyOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('vehicleManageTable.maintainType')">
              <el-select v-model="addParam.maintainType" :placeholder="$t('vehicleManageTable.maintainType')" clearable style="width: 205px;">
                <el-option v-for="item in maintainTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>       
        <el-row>
          <el-col :span="24" style="padding-right:30px;">
            <el-form-item :label="$t('vehicleManageTable.subjectDetail')" prop="dept">
           <el-table
              :data="detailList"
              border
              fit
              highlight-current-row>
              <el-table-column :label="$t('vehicleManageTable.subject')" width="auto"  align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.subject"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('vehicleManageTable.number')" width="100"  align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.number"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('vehicleManageTable.price')" width="100"  align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.price"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('vehicleManageTable.amount')" width="100"  align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.amount"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" width="100">
                <template slot="header" slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handleAddRow()">添加</el-button>
                </template>
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="handleDeleteRow(scope.row)">{{ scope.row.delete }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('vehicleManageTable.amountCount')" prop="dept">
              <el-input v-model="addParam.amount" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row> 
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('vehicleManageTable.checker')" prop="dept">
              <el-input v-model="addParam.checker" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('vehicleManageTable.watcher')">
              <el-input v-model="addParam.watcher" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row> 
        <el-form-item :label="$t('vehicleManageTable.remark')">
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
import {maintainList,maintainAdd,maintainItem,maintainDelete,maintainUpdate,vehicleAllList} from '@/api/vehicleManage'
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
      carPropertyOptions:[{key:0,display_name:'公务用车'},{key:1,display_name:'执法用车'}],
      maintainTypeOptions:[{key:0,display_name:'保养'},{key:1,display_name:'维修'}],
      plateList:[],
      plateOptions:[],
      deptList: null,
      list: [],
      total: 0,
      listLoading: true,
      tableKey: 0,
      listQuery: {
        plateNum: '',
        startDate: '',
        endDate: '',
        maintainType: '',
        carProperty: '',
        page: 1,
        limit: 10
      },
      itemDetailList:[],
      editId:'',//当前编辑行的Id
      addParam: {
        applyer:'',
        applyDate:'',
        plateNumber: '',
        captain:'',
        carProperty:'',
        maintainType:'',
        amount:'',
        checker:'',
        watcher:'',
        remark: '',
      },
      detailList:[],

      showReviewer: false,
      dialogFormVisible: false,
      dialogVisible: false,
      dialogStatus: '',
      textMap: {
        edit: '编辑维修保养',
        create: '新增维修保养'
      },
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false,
    }
  },
  created() {
    vehicleAllList().then(response => {
      this.plateList = response.data.datas;
      var count = response.data.datas.length;
      for (var i = 0; i < count; i++) {
        var obj = {
          key: this.plateList[i].id,
          value: this.plateList[i].plateNumber
        }
        this.plateOptions.push(obj);
      }
    });
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      maintainList(this.listQuery).then(response => {
        if(response.data.datas){
          this.list = response.data.datas;
          this.total = response.data.pageInfo.sum;
          for (var i = 0; i < this.total; i++) {
            this.list[i].edit = '编辑';
            this.list[i].delete ='删除';
          }
        }
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000)
      })
    },
    handleAddRow(){
      var obj={
        subject:'',
        number: '',
        price:'',
        amount: '',
        delete:'删除'
      };
      this.detailList.push(obj);
    },
    handleDeleteRow(row){
      for(var i=0;i<this.detailList.length;i++){
        if(row.subject==this.detailList[i].subject){
          this.detailList.splice(i,1);
        }
      }
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
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //新增维修保养
    createData() {
      var lines=[];
      for(var i=0;i<this.detailList.length;i++){
        var obj={
          subject:this.detailList[i].subject,
          number: this.detailList[i].number,
          price:this.detailList[i].price,
          amount: this.detailList[i].amount
        };
        lines.push(obj);
      }
      var data={
        header:this.addParam,
        lines:lines,
        linesChanged:true
      };
      maintainAdd(data).then(response => {
        this.dialogFormVisible = false;
        if(response.data.code==0){
          this.$message({
            message: '新增成功',
            type: 'success',
            duration: 2000
          });
        }
        this.getList();
      })
    },
    handleEdit(row) {
      this.detailList=[];
      this.itemDetailList=[];
      this.editId=row.id;
      maintainItem(row.id).then(response => {
        var result=response.data.datas;
        this.addParam = result.header;
        if(result.lines.length > 0){
          for(var i=0;i<result.lines.length;i++)
          {
            var obj={
              subject:result.lines[i].subject,
              number: result.lines[i].number,
              price: result.lines[i].price,
              amount: result.lines[i].amount,
              delete:'删除'
            }
            var obj1={
              subject:result.lines[i].subject,
              number: result.lines[i].number,
              price: result.lines[i].price,
              amount: result.lines[i].amount,
            }
            this.detailList.push(obj);
            this.itemDetailList.push(obj1);
          }
        }
        this.dialogStatus = 'edit';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    //编辑维修保养
    editData() {
      var lines=[];
      for(var i=0;i<this.detailList.length;i++){
        var obj={
          subject:this.detailList[i].subject,
          number: this.detailList[i].number,
          price:this.detailList[i].price,
          amount: this.detailList[i].amount
        };
        lines.push(obj);
      }
      var linesChanged=false;
      if(JSON.stringify(lines) !=JSON.stringify(this.itemDetailList)){
        linesChanged=true;
      }
      var data={
        header:this.addParam,
        lines:lines,
        linesChanged:linesChanged
      };
      maintainUpdate(this.editId,data).then(response => {
        this.dialogFormVisible = false;
        if(response.data.code==0){
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 2000
          });
        }
        this.getList();
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        maintainDelete(row.id).then(response => {
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
          const tHeader = ['车牌号', '车车辆类型', '申请人', '申请时间', '车队长', '申请事项', '合计金额', '审核人', '监查人']
          const filterVal = ['plateNumber', 'carProperty', 'applyer', 'applyDate', 'captain', 'maintainType', 'amount', 'checker', 'watcher']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '车辆维修保养列表'
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
