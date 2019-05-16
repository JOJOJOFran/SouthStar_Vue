<template>
  <div class="icons-container">
    <el-tabs type="border-card">
      <el-tab-pane label="Excel模板">
        <div class="template-item" title="点击下载模板" @click="downloadTemplate('InsuranceJournal')">
          <div class="excel-img"></div>
          <div class="excel-title">保险明细表</div>
        </div>
         <div class="template-item" title="点击下载模板">
          <div class="excel-img"></div>
          <div class="excel-title">加油明细表</div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  methods: {
    downloadTemplate(type){
      var url='';
      switch(type){
        case 'InsuranceJournal':
          url='/static/excelTemplate/保险明细表模板.xlsx';
          break;
      }
      window.open(window.location.origin + url)
    }
  }
}
</script>

<style lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;
  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }
  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }
  .disabled {
    pointer-events: none;
  }
  .template-item{
    width: 200px;
    height: 110px;
    margin-top: 30px;
    margin-left: 30px;
    float: left;
    cursor: pointer;
  }
  .excel-img{
    width: 64px;
    height:64px;
    margin-left:68px;
    background: url('Excel.png');
  }
  .excel-title{
    margin-top:15px;
    font-size: 15px;
    font-weight: bold;
    width: 100%;
    height:30px;
    line-height: 30px;
    text-align: center;
    color:#409EFF;
  }
}
</style>