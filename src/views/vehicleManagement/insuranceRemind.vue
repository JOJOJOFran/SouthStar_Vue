<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataForm" label-position="left" label-width="80px" style="margin-left:50px;">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('vehicleManageTable.plateNumber')" prop="type">
              <el-input :placeholder="$t('vehicleManageTable.plateNumber')" v-model="listQuery.plateNum" style="width: 220px;" class="filter-item" @keyup.enter.native="handleFilter"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('vehicleManageTable.selectYear')" label-width="80px" class="postInfo-container-item">
              <el-date-picker v-model="listQuery.year" :placeholder="$t('vehicleManageTable.selectYear')" type="year"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">{{ $t('table.search') }}</el-button>
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
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
      :data="list"
      fit
      border
      highlight-current-row
      style="width: 100%;">
      <template v-for='(item,index) in headers' >
        <el-table-column
          :label="item"
          :key="index"
          width="150px" align="center"
          v-if="index===0" fixed="left">
          <template slot-scope="scope">
            <span>{{ scope.row[item] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="item"
          :key="index"
          width="150px" align="center"
          v-else>
          <template slot-scope="scope">
            <span>{{ scope.row[item] }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="total" @pagination="getList" />
  </div>
</template>

<script>
import { insuranceList,importInsurance } from '@/api/vehicleManage'
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
        year: this.getLocalDatetime(),
        plateNum: '',
        typeCode: 'InsuranceJournal',
      },
      downloadLoading:false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true;
      insuranceList(this.listQuery).then(response => {
        this.list = response.data.datas.rows;
        this.headers=response.data.datas.title;
        this.total=this.list.length;
        // for (var i = 0; i < this.total; i++) {
        //   this.list[i].expiring_business = this.isTimeOver(this.list[i].商业保险结束时间);
        //   this.list[i].expiring_transportation = this.isTimeOver(this.list[i].交强险结束时间);
        // }
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000)
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
      console.log(results);
      console.log(header);
      var typeCode='InsuranceJournal';
      var keyName='PlateNum';
      var year=2019;
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
          this.$message({
            message: '导入数据成功',
            type: 'success'
          });
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
    // handleDelete(row) {
    //   this.$confirm('确认删除吗, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     insuranceReminderDelete(row.id).then(response => {
    //       this.$message({
    //         type: 'success',
    //         message: '删除成功!'
    //       })
    //     })
    //     const index = this.list.indexOf(row)
    //     this.list.splice(index, 1)
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消删除'
    //     })
    //   })
    // },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = this.headers;
          const filterVal = this.headers;
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.listQuery.year +'_保险明细表'
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
