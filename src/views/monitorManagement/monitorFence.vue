<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataForm" label-position="left" label-width="80px" style="margin-left:50px;">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('monitorTable.fenceName')" prop="type">
              <el-input :placeholder="$t('monitorTable.inputFenceName')" v-model="listQuery.fenceName" style="width: 220px;" class="filter-item" @keyup.enter.native="handleFilter"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="80px" :label="$t('monitorTable.startTime')" class="postInfo-container-item">
              <el-date-picker v-model="listQuery.startTime"  type="date" format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="80px" :label="$t('monitorTable.endTime')" class="postInfo-container-item">
              <el-date-picker v-model="listQuery.endTime"  type="date" format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
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
      <el-table-column :label="$t('monitorTable.fence_id')" prop="id" sortable="custom" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.fence_id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('monitorTable.fenceName')" prop="id" sortable="custom" align="center" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.fence_name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('monitorTable.create_time')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('monitorTable.modify_time')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.modify_time }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('monitorTable.district')" min-width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.district }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('monitorTable.delete')" align="center" width="auto">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">{{ scope.row.delete }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
  import { setToken,getToken} from '@/utils/auth'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import jsonp from 'jsonp'


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
        ak:'zGObvGv0ofXzW7TpsYCtwTgCp8OGtfTw',
        service_id:'200846',
        list: null,
        total: 0,
        listLoading: true,
        tableKey: 0,
        listQuery: {
          fenceName:'',
          startTime:'2018-01-01',
          endTime:'2021-01-01',
          page: 1,
          limit: 10
        },
        showReviewer: false,
        pvData: [],
        downloadLoading: false
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        var url='http://yingyan.baidu.com/api/v3/fence/list?ak='+this.ak+'&service_id='+this.service_id+'&fence_ids=6,7';
        jsonp(url, {fence_ids: '6,7'}, (err, response) =>{
          var listData = response.fences;
          var size=response.size;
          var data=[];
          for (var i = 0; i < size; i++) {
            if(listData[i].fence_name.indexOf(this.listQuery.fenceName)!=-1 &&
            (this.GetUnixTime(this.listQuery.startTime) < this.GetUnixTime(listData[i].create_time)
            &&this.GetUnixTime(this.listQuery.endTime)>this.GetUnixTime(listData[i].create_time)))
            {
              listData[i].delete ='删除';
              data.push(listData[i]);
            }
          }
          this.list=data;
          this.total=data.length;
          setTimeout(() => {
            this.listLoading = false;
          }, 1.5 * 1000)
        })
      },
      GetUnixTime (timeStr) {
        var time = new Date(timeStr);
        return (time.getTime() / 1000);
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        row.status = status
      },
      sortChange(data) {
        const { prop, order } = data
        if (prop === 'id') {
          this.sortByID(order);
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
      handleDelete(row) {
        this.$confirm('确认删除吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var url='http://yingyan.baidu.com/api/v3/fence/delete?ak='+this.ak+'&service_id='+this.service_id+'&fence_ids='+row.fence_id;
          jsonp(url, {fence_ids: row.fence_id}, (err, response) =>{
            if(response.status==0){
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
            setTimeout(() => {
              this.listLoading = false;
            }, 1.5 * 1000)
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
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
