<template>
  <div class="app-container">
    <div style="margin-top: 10px">
        <span style="margin-left:20px;font-family:'STKaiti';font-size:20px;">填表模板类型：</span>
        <el-radio-group v-model="checkTemplate" @change="templateChange">
          <el-radio :label="'0'" :key="0" border>公务用车</el-radio>
          <el-radio :label="'1'" :key="1" border>执法保障用车</el-radio>
        </el-radio-group>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      height="500px"
      style="width: 100%;margin-top:30px;">
      <el-table-column :label="'序号'" align="center" width="100">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'模板名称'" align="center" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" width="100">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">{{ scope.row.delete }}</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import {getTemplate,getTemplateKeys,delTemplate} from '@/api/applyCar'

export default {
  data() {
    return {
      checkTemplate:'0',
      list: [],
      listLoading: true,
    }
  },
  created() {
    this.getTemplateList(0);
  },
  methods: {
    //获取所有模板
    getTemplateList(type){
      this.listLoading=true;
      getTemplateKeys(type).then(response => {
        var result = response.data.datas;
        this.list=[];
        for(var i=0;i<result.length;i++){
          var obj={
            delete:'删除',
            number:i+1,
            key:result[i]
          }
          this.list.push(obj);
        }
        this.listLoading=false;
      });
    },
    //模板选中事件
    templateChange(item){
      this.getTemplateList(item);
    },
    handleDelete(row) {
      this.$confirm('确认删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var keyData=[];
        keyData.push(row.key);
        delTemplate(this.checkTemplate,keyData).then(response => {
          if (response.data.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTemplateList(this.checkTemplate);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
  }
}
</script>
