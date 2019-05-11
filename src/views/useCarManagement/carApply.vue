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
          <el-col :span="8">
            <el-form-item :label="$t('applyTable.applyStatus')" prop="type">
              <el-select v-model="listQuery.status" :placeholder="$t('applyTable.applyStatus')" clearable class="filter-item" style="width: 230px">
                <el-option v-for="item in applyStatusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="80px" :label="$t('applyTable.beginTime')" class="postInfo-container-item">
              <el-date-picker v-model="listQuery.beginTime" type="date" format="yyyy-MM-dd" :placeholder="$t('applyTable.beginTime')"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label-width="80px" :label="$t('applyTable.endTime')" class="postInfo-container-item">
              <el-date-picker v-model="listQuery.endTime" type="date" format="yyyy-MM-dd" :placeholder="$t('applyTable.endTime')"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('applyTable.create') }}</el-button>
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
      <el-table-column :label="$t('applyTable.applyNum')" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{ scope.row.applyNum }}</span>
        </template>
      </el-table-column>
       <el-table-column width="auto" align="center" :label="$t('applyTable.carProperty')">
        <template slot-scope="scope">
          <span>{{ scope.row.carProperty }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('applyTable.userName')"  align="center" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
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
      <el-table-column :label="$t('applyTable.status')" align="center" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('applyTable.checkStatus')" align="center" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.checkStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('applyTable.caozuo')" align="center" width="auto">
        <template slot-scope="scope">
          <el-button v-if="scope.row.caozuo!=='提交'" type="primary" size="mini" @click="handleDetail(scope.row)">{{ scope.row.detail }}</el-button>
          <el-button v-if="scope.row.caozuo==='提交'" style="background-color:#42b983" type="primary" size="mini" @click="handleSubmit(scope.row)">{{ scope.row.caozuo }}</el-button>
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('applyTable.caozuo')" align="center" width="auto" class-name="small-padding fixed-width">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button v-if="scope.row.caozuo==='提交'" type="primary" size="mini" @click="handleSubmit(scope.row)">{{ scope.row.caozuo }}</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" id="">
      <el-form ref="dataForm" :rules="rules" :model="addParam" label-position="left" label-width="100px" style=" margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.userName')" prop="userName">
              <el-input v-model="addParam.userName" style="width: 205px;" :readonly="readOnlyFlag"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.userMobile')" prop="userMobile">
              <el-input v-model="addParam.userMobile"  class="filter-item" style="width: 205px;" :readonly="readOnlyFlag"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.userDept')" prop="dept">
              <el-select v-model="addParam.departmentId" class="filter-item" @change="deptChange" placeholder="请选择" style="width: 205px;" :disabled="readOnlyFlag">
                <el-option v-for="item in deptOptions" :key="item.key" :label="item.display_name" :value="item.key"  />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.userCount')" prop="userCount">
              <el-input v-model="addParam.userCount"  class="filter-item" @keyup.enter.native="handleFilter" style="width: 205px;" :readonly="readOnlyFlag"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.carType')" prop="carType">
              <el-select v-model="addParam.carType" class="filter-item" placeholder="请选择" :disabled="readOnlyFlag" style="width: 205px;">
                <el-option v-for="item in carTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"  />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.useArea')" prop="useArea">
              <el-select v-model="addParam.useArea" class="filter-item" placeholder="请选择" :disabled="readOnlyFlag" style="width: 205px;">
                <el-option v-for="item in useAreaOptions" :key="item.key" :label="item.display_name" :value="item.key"  />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.startPoint')" prop="startPoint">
              <el-input v-model="addParam.startPoint"  class="filter-item" @keyup.enter.native="handleFilter" style="width: 205px;" :readonly="readOnlyFlag"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.destination')" prop="destination">
              <el-input v-model="addParam.destination"  class="filter-item" @keyup.enter.native="handleFilter" style="width: 205px;" :readonly="readOnlyFlag"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.startPlanTime')" class="postInfo-container-item" prop="datetime">
              <el-date-picker v-model="addParam.startPlanTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('applyTable.startPlanTime')" :readonly="readOnlyFlag" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.endTime')" class="postInfo-container-item" prop="datetime">
              <el-date-picker v-model="addParam.backPlanTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('applyTable.endTime')" style="width: 205px;" :readonly="readOnlyFlag"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.carProperty')" prop="carProperty">
              <el-select v-model="addParam.carProperty" class="filter-item" placeholder="请选择" :disabled="readOnlyFlag" style="width: 205px;">
                <el-option v-for="item in carPropertyOptions" :key="item.key" :label="item.display_name" :value="item.key"  />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.applyReason')" prop="applyReson">
              <el-input v-model="addParam.applyReson"  class="filter-item" @keyup.enter.native="handleFilter" style="width: 205px;" :readonly="readOnlyFlag"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="$t('applyTable.remark')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="addParam.remark" type="textarea" placeholder="请输入" style="width: 540px;" :readonly="readOnlyFlag"/>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.applicantName')">
              <el-input v-model="addParam.applicantName"  class="filter-item" style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.applicantPhone')">
              <el-input v-model="addParam.applicantPhone"  class="filter-item" style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.departmentName')">
              <el-select v-model="applyDepartmentId" class="filter-item" placeholder="请选择" :disabled="true"  style="width: 205px;">
                <el-option v-for="item in deptOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus!=='detail'" @click="dialogFormVisible = false">{{ $t('applyTable.cancel') }}</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="draftData()">{{ $t('applyTable.draft') }}</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData()">{{ $t('applyTable.confirm') }}</el-button>
        <el-button v-if="dialogStatus==='draft'" type="primary" @click="createSubmit()">{{ $t('applyTable.confirm') }}</el-button>
        <el-button v-if="dialogStatus==='detail'" type="primary" @click="dialogFormVisible = false">确定</el-button>
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
import { applyList, deptList,carTypeList,carPropertyList,addApply,addApplyDraft,applyDetail,submityDraft} from '@/api/applyCar'
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


import {validatePhone} from '@/utils/validate'
var validPhone=(rule, value,callback)=>{
  if (!value){
      callback(new Error('请输入电话号码'))
  }else  if (!validatePhone(value)){
    callback(new Error('请输入正确的11位手机号码'))
  }else {
   callback()
  }
}

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
        applicantId: '', //申请人ID
        status:'',
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
        ,remark: ''
      },
      applyDepartmentId:getNewToken("DepartmentId"),//详情页补充申请人单位
      deptOptions:[],
      applyStatusOptions:[{key:'',display_name:'全部'},{key:'1',display_name:'待审核'},{key:'2',display_name:'已审核'},{key:'0',display_name:'草稿'}],
      useAreaOptions:[{key:'县区内',display_name:'县区内'},{key:'市内',display_name:'市内'},{key:'市外',display_name:'市外'},{key:'省外',display_name:'省外'}],
      carPropertyOptions:[{key:0,display_name:'公务用车组'},{key:1,display_name:'执法用车组'}],
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
      rules: {
        userName: [{ required: true, message: '请填写用车人', trigger: 'blur' }],
        userMobile: [{ required: true, trigger: 'blur', validator: validPhone }],//这里需要用到全局变量,
        // dept:[{ required: true, message: '请选择用车单位', trigger: 'change' }],
        userCount:[{ required: true, message: '请填写乘车人数', trigger: 'blur' }],
        carType: [{ required: true, message: '请选择用车类型', trigger: 'change' }],
        useArea: [{ required: true, message: '请选择用车区域', trigger: 'change' }],
        startPoint:[{ required: true, message: '请填写出发地', trigger: 'blur' }],
        destination:[{ required: true, message: '请填写目的地', trigger: 'blur' }],
        carProperty:[{ required: true, message: '请选择用车性质', trigger: 'change' }],
        applyReson:[{ required: true, message: '请填写用车事由', trigger: 'blur' }],
        // dept: [{ required: true, message: '请选择单位'}],
        // carType: [{ required: true, message: '请选择类型'}],
        // useArea: [{ required: true, message: '请选择区域'}],
        // carProperty: [{ required: true, message: '请选择性质'}],
        // datetime: [{ required: true, message: '请选择时间' }],
        // userMobile: [{ type: 'date', required: true, message: '请填写用车人', trigger: 'change' }],
      },
      downloadLoading: false,
      readOnlyFlag:false,
      submitId:'',
    }
  },
  created() {
    this.listQuery.applicantId=getNewToken("ApplicationId");
    this.addParam.departmentId=getNewToken("DepartmentId");
    this.addParam.applicantId=getNewToken("ApplicationId");
    this.addParam.applicantName=getNewToken("DisplayName");
    this.addParam.applicantPhone=getNewToken("Phone");
    deptList().then(response => {
      this.deptList = response.data.datas;
      var count = response.data.datas.length;
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
      applyList(this.listQuery).then(response => {
        var data = response.data.datas;
        if(data) {
          this.list = response.data.datas;
          this.total = response.data.pageInfo.sum;
          for (var i = 0; i < this.list.length; i++) {
            this.list[i].detail = "详情";
            if(this.list[i].status == "起草"){
              this.list[i].caozuo = "提交";
            }
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
    deptChange(item){
      for(var i=0;i<this.deptList.length;i++){
        if(this.deptList[i].id==item){
          this.addParam.departmentName=this.deptList[i].departmentName;
        }
      }
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
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    clearParam(){
      this.listQuery.applicantId=getNewToken("ApplicationId");
      this.addParam.departmentId=getNewToken("DepartmentId");
      this.addParam.applicantId=getNewToken("ApplicationId");
      this.addParam.applicantName=getNewToken("DisplayName");
      this.addParam.applicantPhone=getNewToken("Phone");
      this.addParam={
            id:''
          , applyNum:''
          , applicantId: getNewToken("ApplicationId") //申请人ID
          , applicantName: getNewToken("DisplayName")
          , applicantPhone: getNewToken("Phone")
          , departmentName: ''
          , departmentId:getNewToken("DepartmentId")
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
          , remark:''
          , status: 0
          , createDate:'2019-01-01'
          ,remark: ''
      }
    },
    handleCreate() {
      this.clearParam();
      this.readOnlyFlag=false;
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          addApply(this.addParam).then(response => {
            debugger
            if(response.data.code==0){
              this.dialogFormVisible = false;
              this.$message({
                message: '提交成功',
                type: 'success'
              });
              this.getList();
            }else {
              this.$message({
                message: '提交失败',
                type: 'error'
              })
            }
          })
        }
      })
    },
    handleDraft(row) {
      applyDetail(row.applyId).then(response => {
        this.addParam = response.data.datas[0];
        this.dialogStatus = 'draft'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      });
    },
    draftData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addApplyDraft(this.addParam).then(response => {
            if(response.data.code==0){
              this.dialogFormVisible = false;
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.getList();
            }else {
              this.$message({
                message: '保存失败',
                type: 'error'
              })
            }
          })
        }
      })
    },
    handleSubmit(row){
      this.submitId=row.id;
      this.readOnlyFlag=false;
      applyDetail(row.id).then(response => {
        this.addParam = response.data.datas[0];
        this.dialogStatus = 'draft'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      });
    },
    createSubmit(){
      submityDraft(this.submitId,this.addParam).then(response => {
        if(response.data.code==0){
          this.dialogFormVisible = false;
          this.$message({
            message: '提交成功',
            type: 'success'
          });
          this.getList();
        }else {
          this.$message({
            message: '提交失败',
            type: 'error'
          })
        }
      })
    },
    handleDetail(row) {
      this.readOnlyFlag=true;
      applyDetail(row.id).then(response => {
        this.applyDepartmentId = response.data.datas[0].applyDepartmentId;
        this.addParam = response.data.datas[0];
        this.dialogStatus = 'detail'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      });
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['流程编号','用车人','用车类型','用车人电话','出发时间','归队时间','出发地','目的地','用车事由','申请状态','审核状态']
        const filterVal = ['applyNum','userName','carType','userMobile','startPlanTime','backPlanTime','startPoint','destination','applyReson','status','checkStatus'];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '用车申请列表'
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
