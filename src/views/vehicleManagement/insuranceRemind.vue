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
            <el-form-item :label="'商业险到期月份'" label-width="120px" class="postInfo-container-item">
              <el-date-picker v-model="listQuery.businessInsuranceEndDate" format="yyyy-MM" value-format="yyyy-MM"  type="date"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="'交强险到期月份'" label-width="120px" class="postInfo-container-item">
              <el-date-picker v-model="listQuery.autoInsuranceEndTime" format="yyyy-MM" value-format="yyyy-MM"  type="date"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">{{ $t('table.search') }}</el-button>
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
            <el-button v-waves  class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="8">
            <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
          </el-col>
        </el-row> -->
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
      <el-table-column :label="'车牌号'" prop="id" sortable="custom" align="center" width="120" fixed>
        <template slot-scope="scope">
          <span style="color:blue">{{ scope.row.plateNum }}</span>
        </template>
      </el-table-column>
       <el-table-column :label="'品牌'" width="auto" align="center" fixed>
        <template slot-scope="scope">
          <span>{{ scope.row.carBrand }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'车损'"  align="center" width="auto" fixed>
        <template slot-scope="scope">
          <span>{{ scope.row.vehicleDamage }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'三责50万'" width="120" align="center" fixed>
        <template slot-scope="scope">
          <span>{{ scope.row.threeResponsibility50 }}</span>
        </template>
      </el-table-column>
       <el-table-column :label="'三责100万'" width="120" align="center" fixed>
        <template slot-scope="scope">
          <span>{{ scope.row.threeResponsibility100 }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('applyTable.caozuo')" align="center" width="150" fixed>
        <template slot-scope="scope">
          <el-button  type="primary" size="mini" @click="handleUpdate(scope.row)">{{ scope.row.edit }}</el-button>
          <el-button  type="danger" size="mini" @click="handleDelete(scope.row)">{{ scope.row.delete }}</el-button>
        </template>
      </el-table-column>
      <el-table-column :label="'玻璃'" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.glass }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'驾驶员'" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.driver }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'乘客'" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.passenger }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'自燃'" align="center" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.autoignition }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'涉水'" align="center" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.forWater }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'无法找到第三方'" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.thirdParty }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'不计免赔'" align="center" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.excludingDeductible }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'驾乘意外'" align="center" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.unexpected }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'商业险合计'" align="center" width="100">
        <template slot-scope="scope">
          <span style="color:blue">{{ scope.row.businessInsurance }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'交强险'" align="center" width="auto">
        <template slot-scope="scope">
          <span style="color:blue">{{ scope.row.autoInsurance }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'车船税'" align="center" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.carTax }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'总合计'" align="center" width="auto">
        <template slot-scope="scope">
          <span style="color:blue">{{ scope.row.countMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'商业险期间'" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.businessInsuranceStartDate +'至' + scope.row.businessInsuranceEndDate}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'交强险期间'" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.autoInsuranceStartDate +'至' + scope.row.autoInsuranceEndDate}}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="total" @pagination="getList" />
    
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :fullscreen="true"
      style="position: absolute;"
      center
    >
      <el-form
        ref="dataForm"
        :model="model"
        label-position="left"
        label-width="150px"
        style="margin-left: 2%;"
        :rules="rules"
      >
        <el-row :gutter="50">
          <el-col :span="8">
            <el-form-item label="车牌号" prop="plateNum">
              <el-select v-model="model.plateNum" @change="plateChange" filterable placeholder="请选择" style="width: 100%;" :disabled="disabledFlag">
                <el-option v-for="item in plateOptions" :key="item.value" :label="item.value" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌" prop="carBrand">
              <el-input v-model="model.carBrand" style="width: 100%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车损">
              <el-input-number v-model="model.vehicleDamage" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="8">
            <el-form-item label="三责50万">
              <el-input-number v-model="model.threeResponsibility50" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="三责100万">
              <el-input-number v-model="model.threeResponsibility100" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="玻璃">
              <el-input-number v-model="model.glass" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="8">
            <el-form-item label="驾驶员">
              <el-input-number v-model="model.driver" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="乘客">
             <el-input-number v-model="model.passenger" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="自燃">
              <el-input-number v-model="model.autoignition" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="8">
            <el-form-item label="涉水">
             <el-input-number v-model="model.forWater" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="无法找到第三方">
              <el-input-number v-model="model.thirdParty" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不计免赔">
              <el-input-number v-model="model.excludingDeductible" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="8">
            <el-form-item label="交强险">
              <el-input-number v-model="model.autoInsurance" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="交强险开始时间">
              <el-date-picker v-model="model.autoInsuranceStartDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="交强险结束时间">
              <el-date-picker v-model="model.autoInsuranceEndDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="8">
            <el-form-item label="商业险合计">
              <el-input-number v-model="model.businessInsurance" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商业险开始时间">
              <el-date-picker v-model="model.businessInsuranceStartDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商业险结束时间">
              <el-date-picker v-model="model.businessInsuranceEndDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="8">
            <el-form-item label="驾乘意外">
              <el-input-number v-model="model.unexpected" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车船税">
              <el-input-number v-model="model.carTax" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总合计">
              <el-input-number v-model="model.countMoney" :min="0" style="width: 100%;"></el-input-number>
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
import { insuranceReminderList,insuranceReminderDelete,insuranceReminder,insuranceReminderUpdate,insuranceReminderAdd,vehicleAllList } from '@/api/vehicleManage'
import { setToken, getToken } from '@/utils/auth'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ComplexTable',
   components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey:0,
      headers:[],
      list: [],
      total: 0,
      page:1,
      listLoading: true,
      listQuery: {
        plateNum: '',
        autoInsuranceEndTime: this.getLocalDatetime(),
        businessInsuranceEndDate: this.getLocalDatetime(),
        page: 1,
        limit: 10
      },
      model:{
        id:0,// 后台生成
        carBrand:'', // 品牌
        plateNum:'', // 车牌号
        vehicleDamage:0, // 车损
        threeResponsibility50:0, // 三责50万
        threeResponsibility100:0, // 三责100万
        glass:0, // 玻璃
        driver:0, // 驾驶员
        passenger:0, // 乘客
        autoignition:0, // 自燃
        forWater:0, // 涉水
        thirdParty:0, // 无法找到第三方
        excludingDeductible:0, // 不计免赔
        unexpected:0, // 驾乘意外
        businessInsurance:0, // 商业险合计
        autoInsurance:0, // 交强险
        carTax:0, // 车船税
        countMoney: 0, // 总合计
        businessInsuranceStartDate:'', // 商业险开始时间
        businessInsuranceEndDate:'', // 商业险结束时间
        autoInsuranceStartDate:'', // 交强险开始时间
        autoInsuranceEndDate:'' // 交强险结束时间
      },
      rules: {
        plateNum: [{ required: true, message: '车牌号不能为空' }],
        carBrand: [{ required: true, message: '品牌不能为空' }]
      },
      disabledFlag:false,
      downloadLoading:false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改保险记录',
        create: '新增保险记录'
      },
      plateOptions:[],
    }
  },
  created() {
    vehicleAllList().then(response => {
      this.plateList = response.data.datas;
      var count = response.data.datas.length;
      for (var i = 0; i < count; i++) {
        var obj = {
          key: this.plateList[i].id,
          value: this.plateList[i].plateNumber,
          vehicleBrand:this.plateList[i].vehicleBrand
        }
        this.plateOptions.push(obj);
      }
    });
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.list =[];
      this.total=0;
      if(this.listQuery.autoInsuranceEndTime !== ''){
        this.listQuery.autoInsuranceEndTime = this.getQueryTimeStr(this.listQuery.autoInsuranceEndTime)
      }
      if(this.listQuery.businessInsuranceEndDate !== ''){
        this.listQuery.businessInsuranceEndDate = this.getQueryTimeStr(this.listQuery.businessInsuranceEndDate)
      }
      insuranceReminderList(this.listQuery).then(response => {
        if(response.data.datas !== null){
          this.list = response.data.datas;
          this.total=response.data.pageInfo.sum;
          for (var i = 0; i < this.total; i++) {
            this.list[i].edit ='修改';
            this.list[i].delete ='删除';
            this.list[i].businessInsuranceStartDate =this.list[i].businessInsuranceStartDate.split(' ')[0];
            this.list[i].businessInsuranceEndDate =this.list[i].businessInsuranceEndDate.split(' ')[0];
            this.list[i].autoInsuranceStartDate =this.list[i].autoInsuranceStartDate.split(' ')[0];
            this.list[i].autoInsuranceEndDate =this.list[i].autoInsuranceEndDate.split(' ')[0];
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
    //转换查询时间格式
    getQueryTimeStr(dateStr){
      var year = dateStr.split('-')[0];
      var month = dateStr.split('-')[1];
      var d = new Date(year, month, 0);
      var countDay = d.getDate();
      return dateStr+"-" +countDay+" 23:59:59";
    },
    plateChange(item){
       for (var i = 0; i < this.plateOptions.length; i++) {
        if(this.plateOptions[i].value===item){
          this.model.carBrand = this.plateOptions[i].vehicleBrand
          break
        }
      }
    },
    handleCreate() {
      this.model = {
        id:0,// 后台生成
        carBrand:'', // 品牌
        plateNum:'', // 车牌号
        vehicleDamage:0, // 车损
        threeResponsibility50:0, // 三责50万
        threeResponsibility100:0, // 三责100万
        glass:0, // 玻璃
        driver:0, // 驾驶员
        passenger:0, // 乘客
        autoignition:0, // 自燃
        forWater:0, // 涉水
        thirdParty:0, // 无法找到第三方
        excludingDeductible:0, // 不计免赔
        unexpected:0, // 驾乘意外
        businessInsurance:0, // 商业险合计
        autoInsurance:0, // 交强险
        carTax:0, // 车船税
        countMoney:0, // 总合计
        businessInsuranceStartDate:'', // 商业险开始时间
        businessInsuranceEndDate:'', // 商业险结束时间
        autoInsuranceStartDate:'', // 交强险开始时间
        autoInsuranceEndDate:'' // 交强险结束时间
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.disabledFlag = false
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
      if (this.model.carBrand === '') {
        this.$message({
          message: '品牌不能为空',
          type: 'error',
          duration: 2 * 1000
        })
        return
      }
      insuranceReminderAdd(this.model).then(response => {
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
        id: row.id,// 后台生成
        carBrand:row.carBrand, // 品牌
        plateNum:row.plateNum, // 车牌号
        vehicleDamage:row.vehicleDamage, // 车损
        threeResponsibility50:row.threeResponsibility50, // 三责50万
        threeResponsibility100:row.threeResponsibility100, // 三责100万
        glass:row.glass, // 玻璃
        driver:row.driver, // 驾驶员
        passenger:row.passenger, // 乘客
        autoignition:row.autoignition, // 自燃
        forWater:row.forWater, // 涉水
        thirdParty:row.thirdParty, // 无法找到第三方
        excludingDeductible:row.excludingDeductible, // 不计免赔
        unexpected:row.unexpected, // 驾乘意外
        businessInsurance:row.businessInsurance, // 商业险合计
        autoInsurance:row.autoInsurance, // 交强险
        carTax:row.carTax, // 车船税
        countMoney:row.countMoney, // 总合计
        businessInsuranceStartDate:row.businessInsuranceStartDate, // 商业险开始时间
        businessInsuranceEndDate:row.businessInsuranceEndDate, // 商业险结束时间
        autoInsuranceStartDate:row.autoInsuranceStartDate, // 交强险开始时间
        autoInsuranceEndDate:row.autoInsuranceEndDate // 交强险结束时间
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.disabledFlag = true
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
      if (this.model.carBrand === '') {
        this.$message({
          message: '品牌不能为空',
          type: 'error',
          duration: 2 * 1000
        })
        return
      }
      insuranceReminderUpdate(this.model.id,this.model).then(response => {
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
      this.$confirm('此操作将删除该保险数据, 是否继续?', '提示', {
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
      insuranceReminderDelete(id).then(response => {
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
    //判断是否还有一个月到期
    isTimeOver(timeStr){
      var time= new Date(timeStr)/1000;
      var timestamp = new Date().getTime() / 1000;//当前时间
      var timeDiff = (timestamp - time) / 60;//分钟间隔
      var dayDiff=(timeDiff/60)/24;
      var status = dayDiff >= 30 ? false : true;
      return status;
    },
    getLocalDatetime() {
      var objD = new Date();
      var date = objD.getFullYear()+'-'+ (objD.getMonth()+1);
      return date;
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [
            '车牌号', 
            '品牌', 
            '车损', 
            '三责50万', 
            '三责100万', 
            '玻璃', 
            '驾驶员',
            '乘客',
            '自燃',
            '涉水',
            '无法找到第三方',
            '不计免赔',
            '驾乘意外',
            '商业险合计',
            '交强险',
            '车船税',
            '总合计',
            '商业险开始时间',
            '商业险结束时间',
            '交强险开始时间',
            '交强险结束时间'
          ]
          const filterVal = [
            'plateNum', 
            'carBrand', 
            'vehicleDamage',
            'threeResponsibility50',
            'threeResponsibility100', 
            'glass',
            'driver',
            'passenger',
            'autoignition',
            'forWater',
            'thirdParty',
            'excludingDeductible',
            'unexpected',
            'businessInsurance',
            'autoInsurance',
            'carTax',
            'countMoney',
            'businessInsuranceStartDate',
            'businessInsuranceEndDate',
            'autoInsuranceStartDate',
            'autoInsuranceEndDate'
          ]
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '保险明细列表'
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
