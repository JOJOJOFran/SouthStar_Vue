<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataForm" label-position="left" label-width="80px" style="margin-left:50px;">
        <el-row>
          <el-col :span="7">
            <el-form-item :label="$t('uploadExcelTable.templateType')" prop="type">
              <el-select v-model="templateType" :placeholder="$t('uploadExcelTable.selectTemplateType')" clearable class="filter-item" style="width: 230px">
                <el-option v-for="item in templateOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item :label="$t('uploadExcelTable.selectYear')">
              <el-date-picker v-model="year" type="year" :placeholder="$t('uploadExcelTable.selectYear')"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight:bold;">导入结果</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">关闭</el-button> -->
      </div>
      <div  style="height:120px;overflow-y:scroll;width:100%;" >
         <div class="text item" style="color:green;">{{resultMsg}}</div>
        <div v-for="item in messages" :key="item" class="text item" style="color:red;">
          {{'错误消息：' + item +'；' }}
        </div>
      </div>
    </el-card>
    <div style="width:100%;height:40px;line-height:40px;margin-top:10px;">
      <span style="font-weight:bold;margin-left:20px;">错误列表</span>
      <span style="color:red;">(注意:请及时纠正错误数据，并在纠正后【上传】)</span>
      <el-button type="primary" v-show="showBtn" style="margin-left:70px;" @click="submitData">上传<i class="el-icon-upload el-icon--right"></i></el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="errorDatas"
      fit
      highlight-current-row
      style="width: 100%;margin-top:10px;">
      <template v-for='(item,index) in headers' >
        <el-table-column
          :show-overflow-tooltip="true"
          :label="item"
          :key="index"
          width="150px" align="center"
          v-if="index===0" fixed="left">
          <template slot-scope="scope">
            <el-input v-model="scope.row.data[item]" @blur="valueChanged"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          :label="item"
          :key="index"
          width="150px" align="center"
          v-else>
          <template slot-scope="scope">
            <el-input v-model="scope.row.data[item]" @blur="valueChanged"></el-input>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import {importInsurance,typeList } from '@/api/template'
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
  components: { Pagination,UploadExcelComponent },
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
      templateOptions: [],
      templateType:'',
      year:this.getLocalDatetime(),
      templateList:[],
      listLoading: false,
      headers:[],
      resultMsg:'',
      messages:[],
      errorDatas:[],
      showBtn: false,
    }
  },
  created() {
    this.typeList();
  },
  methods: {
    typeList() {
      typeList().then(response => {
        this.templateList = response.data.datas;
        var count = response.data.datas.length;
        for (var i = 0; i < count; i++) {
          var obj = {
            key: this.templateList[i].code,
            display_name: this.templateList[i].name
          }
          this.templateOptions.push(obj);
        }
      });
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
      return false;
    },
    handleSuccess({ results, header }) {
      // console.log(results);
      // console.log(header);
     
      var typeCode=this.templateType;//'InsuranceJournal';
      var year=this.year;
      var keyName='PlateNum';
      if(typeCode==''){
        this.$message({
          message: '请选择模板类型',
          type: 'warning'
        });
        return;
      }
      if(year==''){
        this.$message({
          message: '请选择年份',
          type: 'warning'
        });
        return;
      }
      if(results.length>0){
        for(var i=0;i<results.length;i++){
          var businessInsuranceStartDate=results[i].商业险保险期间.split('-')[0];
          var businessInsuranceEndDate=results[i].商业险保险期间.split('-')[1];
          var compulsoryInsuranceStartDate=results[i].交强险保险期间.split('-')[1];
          var compulsoryInsuranceEndDate=results[i].交强险保险期间.split('-')[1];

          results[i].商业保险开始时间=businessInsuranceStartDate.replace('.','-').replace('.','-');
          results[i].商业保险结束时间=businessInsuranceEndDate.replace('.','-').replace('.','-');
          results[i].交强险开始时间=compulsoryInsuranceStartDate.replace('.','-').replace('.','-');
          results[i].交强险结束时间=compulsoryInsuranceEndDate.replace('.','-').replace('.','-');
        }
      }
      importInsurance(typeCode,keyName, year,results).then(response => {
        if(response.data.code==0){
          this.headers=header;
          this.resultMsg = response.data.datas.message+'。';
          this.messages=response.data.datas.errorMessages;
          this.errorDatas = response.data.datas.errorDatas;
          if(this.errorDatas.length>0){
            this.showBtn=true;
          }
        }else{
          this.$message({
            message: '导入数据失败',
            type: 'error'
          })
        }
      })
    },
    valueChanged(){
      console.log(this.errorDatas);
    },
    submitData(){
      var typeCode=this.templateType;//'InsuranceJournal';
      var year=this.year;
      var keyName='PlateNum';
      if(typeCode==''){
        this.$message({
          message: '请选择模板类型',
          type: 'warning'
        });
        return;
      }
      if(year==''){
        this.$message({
          message: '请选择年份',
          type: 'warning'
        });
        return;
      }
      var data=[];
      for(var i=0;i<this.errorDatas.length;i++){
        data.push(this.errorDatas[i].data);
      }
      importInsurance(typeCode,keyName, year,data).then(response => {
        if(response.data.code==0){
          this.resultMsg = response.data.datas.message+'。';
          this.messages=response.data.datas.errorMessages;
          this.errorDatas = response.data.datas.errorDatas;
          if(this.errorDatas.length>0){
            this.showBtn=true;
          }
        }else{
          this.$message({
            message: '导入数据失败',
            type: 'error'
          })
        }
      })
    },
    getLocalDatetime() {
      var objD = new Date();
      var yy = objD.getFullYear()+'';
      return yy;
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
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-card__body{
    padding-top: 5px;
    padding-bottom: 5px;
  }
</style>
