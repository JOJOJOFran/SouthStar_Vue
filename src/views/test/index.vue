<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form  label-position="left" label-width="80px" style="margin-left:50px;">
        <el-row>
          <el-col :span="8">
            <el-form-item label-width="80px" :label="'选择月份'" class="postInfo-container-item">
              <!-- <el-date-picker v-model="listQuery.month" type="date" format="yyyy-MM" :placeholder="'选择月份'"/> -->
              <el-date-picker
                v-model="listQuery.month"
                type="date"
                format="yyyy-MM"
                value-format="yyyy-MM"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleOperation">开始同步</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      listQuery:{
        month : ''
      },
      m:1,
    }
  },
  methods: {
    handleOperation() {
      var that = this;
      var countDay = 0;
      var year = this.listQuery.month.split('-')[0];
      var month = this.listQuery.month.split('-')[1];
      var d = new Date(year, month, 0);
      countDay = d.getDate();
      var dateTime = '';
      if(that.m<10){
        dateTime = this.listQuery.month+'-0'+ that.m;
      }else{
        dateTime = this.listQuery.month+'-'+ that.m;
      }
        // dateTime = this.listQuery.month+'-'+ that.m;
      if (that.m <= countDay) {
        var url = 'http://175.24.107.148:5000/api/SyncTrace/daily-trace?dateTime='+dateTime;
        axios({
          method: 'post',
          // data:{dateTime:dateTime},
          url: url
        }).then(response=>{
          if(response.data.message === '同步成功'){
            if (that.m === countDay) {
              console.log('所有同步完成!!!!!!!!!!')
            }else{
              console.log(dateTime + '同步成功（√√√√√√√√√√√），'+ response.data.message +'!')
              that.m++;
              that.handleOperation();
            }
          }
          else if(response.data.message === '数据为空'){
            console.log(dateTime + '数据为空（**********），'+ response.data.message +'!')
            that.m++;
            that.handleOperation();
          }
          else{
            console.log(dateTime +'同步失败（××××××××××），'+ response.data.Message +'!')
            that.m++;
            that.handleOperation();
          }
        }).catch((error) => {
          console.log(dateTime +'同步失败（××××××××××）!')
          that.m++;
          that.handleOperation();
        });
      }else{
        that.m++;
        that.handleOperation();
      }
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
