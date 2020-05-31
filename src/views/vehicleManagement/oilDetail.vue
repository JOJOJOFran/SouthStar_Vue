<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataForm" label-position="left" label-width="80px" style="margin-left:50px;">
        <el-row>
          <el-col :span="6">
            <el-form-item :label="'车牌号'" prop="type">
              <el-select v-model="listQuery.plateNum" filterable clearable placeholder="请选择" style="width: 220px;">
                <el-option v-for="item in plateOptions" :key="item.value" :label="item.value" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="'开始时间'" label-width="80px" class="postInfo-container-item">
              <el-date-picker v-model="listQuery.staTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"  type="date"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="'结束时间'" label-width="80px" class="postInfo-container-item">
              <el-date-picker v-model="listQuery.endTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"  type="date"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">{{ $t('table.search') }}</el-button>
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
            <el-button v-waves  class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
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
      <el-table-column label="日期" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.handleTime.split(' ')[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车牌号" width="100" align="center">
        <template slot-scope="scope">
          <span style="color:blue">{{ scope.row.plateNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆性质" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carPropertyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用车里程数" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mileage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆状况" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carCondition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="加油时间" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.handleTime.split(' ')[1]  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="加油型号" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oilType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="油卡编号" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cardCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="加油数量(L)" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oilNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额(元)" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.surplus }}</span>
        </template>
      </el-table-column>
       <el-table-column label="经办人" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.handlePerson }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注说明" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作)" align="center" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button  type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button  type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    
     <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :fullscreen="true"
      style="position: absolute;"
      center
      :rules="rules"
    >
      <el-form
        ref="dataForm"
        :model="model"
        label-position="left"
        label-width="150px"
        style="margin-left: 15%;"
        :rules="rules"
      >
        <el-row :gutter="50">
          <el-col :span="10">
            <el-form-item label="车牌号" prop="plateNum">
              <el-select v-model="model.plateNum" @change="plateChange" filterable placeholder="请选择" style="width: 100%;" :disabled="disabledFlag">
                <el-option v-for="item in plateOptions" :key="item.value" :label="item.value" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="车辆性质">
              <el-select v-model="model.carProperty" placeholder="请选择" style="width: 100%;" :disabled="disabledCarProperty">
                <el-option v-for="item in carPropertyOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="10">
            <el-form-item label="用车里程数">
              <el-input-number v-model="model.mileage" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="车辆状况">
              <el-select v-model="model.carCondition" placeholder="请选择" style="width: 100%;">
                <el-option v-for="item in conditionOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="10">
            <el-form-item label="加油时间">
              <el-date-picker v-model="model.handleTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="加油型号">
              <el-select v-model="model.oilType" placeholder="请选择" style="width: 100%;">
                <el-option v-for="item in oilTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="10">
            <el-form-item label="加油数量">
              <el-input-number v-model="model.oilNum" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="油卡编号">
              <el-input v-model="model.cardCode" style="width: 100%;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="10">
            <el-form-item label="金额">
              <el-input-number v-model="model.amount" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="余额">
              <el-input-number v-model="model.surplus" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="10">
            <el-form-item label="经办人">
              <el-input v-model="model.handlePerson" style="width: 100%;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="20">
            <el-form-item label="备注说明">
              <el-input v-model="model.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {oilCostList,oilCostDelete,oilCostItem,oilCostUpdate,oilCostAdd,vehicleAllList} from '@/api/vehicleManage'
import { setToken, getToken } from '@/utils/auth'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import UploadExcelComponent from '@/components/UploadExcel/index.vue'

const deptOptions = []

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = deptOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination},
  directives: { waves },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      tableKey: 0,
      listQuery: {
        plateNum: '',
        staTime: this.getLocalDatetime(),
        endTime: this.getLocalDatetime(),
        page: 1,
        limit: 10
      },
      model: {
        handleTime:'', // 加油时间
        plateNum:'', // 车牌号
        carProperty:'', // 车辆性质
        mileage:0, // 用车里程数
        carCondition:'', // 车辆状况
        oilType:'', // 加油型号
        cardCode:'', // 油卡编号
        oilNum:0, // 加油数量(升)
        amount:0, // 金额
        surplus:0, // 余额
        handlePerson:'', // 经办人
        remark:'' // 备注
      },
      plateOptions:[],
      carPropertyOptions:[{key:'0',display_name:'公务用车组'},{key:'1',display_name:'应急执法组'}],
      conditionOptions:[{key:'良好',display_name:'良好'},{key:'一般',display_name:'一般'},{key:'异常',display_name:'异常'}],
      oilTypeOptions:[
        {key:'95#汽油',display_name:'95#汽油'},
        {key:'92#汽油',display_name:'92#汽油'},
        {key:'天然气',display_name:'天然气'},
        {key:'柴油',display_name:'柴油'},
        {key:'电动',display_name:'电动'}
      ],
      disabledFlag:false,
      disabledCarProperty:false,
      downloadLoading:false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改加油记录',
        create: '新增加油记录'
      },
      rules: {
        plateNum: [{ required: true, message: '车牌号不能为空' }],
      },
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      vehicleAllList().then(response => {
      this.plateList = response.data.datas;
      var count = response.data.datas.length;
      for (var i = 0; i < count; i++) {
        var obj = {
          key: this.plateList[i].id,
          value: this.plateList[i].plateNumber,
          vehicleProperties:this.plateList[i].vehicleProperties
        }
        this.plateOptions.push(obj);
      }
    });
      this.getList()
    },
    getList() {
      this.listLoading = true;
      this.list =[];
      this.total=0;
      oilCostList(this.listQuery).then(response => {
        if(response.data.datas !== null){
          this.list = response.data.datas;
          this.total = response.data.pageInfo.sum;
          for (var i = 0; i < this.total; i++) {
            this.list[i].edit = '编辑';
            this.list[i].delete ='删除';
            this.list[i].carPropertyName = this.list[i].carProperty ==='0'?'公务用车组':'应急执法组';
          }
          setTimeout(() => {
            this.listLoading = false;
          }, 1.5 * 1000)
        }
        else{
          this.listLoading = false;
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
      var str = yy + '-' + MM + '-' + dd
      return str
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    plateChange(item){
      for (var i = 0; i < this.plateOptions.length; i++) {
        if(this.plateOptions[i].value===item){
          this.model.carProperty = this.plateOptions[i].vehicleProperties + ''
          break
        }
      }
    },
    handleCreate() {
      this.model = {
        id:0,
        handleTime:'', // 加油时间
        plateNum:'', // 车牌号
        carProperty:'', // 车辆性质
        mileage:0, // 用车里程数
        carCondition:'', // 车辆状况
        oilType:'', // 加油型号
        cardCode:'', // 油卡编号
        oilNum:0, // 加油数量(升)
        amount:0, // 金额
        surplus:0, // 余额
        handlePerson:'', // 经办人
        remark:'' // 备注
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.disabledFlag = false
      this.disabledCarProperty = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      if (this.model.plateNum === '') {
        this.$message({
          message: '车牌号不能为空',
          type: 'error',
          duration: 2 * 1000
        })
        return
      }
      oilCostAdd(this.model).then(response => {
        if (response.data.code === 0) {
          this.$message({
            message: '新增成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.dialogFormVisible = false
          this.getList()
        } else {
          this.$message({
            message: '新增失败',
            type: 'error',
            duration: 2 * 1000
          })
        }
      })
    },
    handleUpdate(row) {
      this.model = {
        id:row.id,
        handleTime:row.handleTime, // 加油时间
        plateNum:row.plateNum, // 车牌号
        carProperty:row.carProperty, // 车辆性质
        mileage:row.mileage, // 用车里程数
        carCondition:row.carCondition, // 车辆状况
        oilType:row.oilType, // 加油型号
        cardCode:row.cardCode, // 油卡编号
        oilNum:row.oilNum, // 加油数量(升)
        amount:row.amount, // 金额
        surplus:row.surplus, // 余额
        handlePerson:row.handlePerson, // 经办人
        remark:row.remark // 备注
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.disabledFlag = true
      this.disabledCarProperty = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData(){
      if (this.model.plateNum === '') {
        this.$message({
          message: '车牌号不能为空',
          type: 'error',
          duration: 2 * 1000
        })
        return
      }
      oilCostUpdate(this.model.id,this.model).then(response => {
        if (response.data.code === 0) {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.dialogFormVisible = false
          this.getList()
        } else {
          this.$message({
            message: '修改失败',
            type: 'error',
            duration: 2 * 1000
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将删除该加油记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteData(row) {
      var id = row.id // 类型Id
      oilCostDelete(id).then(response => {
        if (response.data.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [
            '车牌号', 
            '车辆性质', 
            '用车里程数', 
            '车辆状况', 
            '加油时间', 
            '加油型号', 
            '油卡编号',
            '加油数量(升)',
            '金额',
            '余额',
            '经办人',
            '备注'
          ]
          const filterVal = [
            'plateNum', 
            'carPropertyName', 
            'mileage',
            'carCondition', 
            'handleTime',
            'oilType',
            'cardCode',
            'oilNum',
            'amount',
            'surplus',
            'handlePerson',
            'remark'
          ]
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '加油记录列表'
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
