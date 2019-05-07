<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="80px" style="margin-left:50px;">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('userAndCarTable.plateNumber')" prop="type">
              <el-input :placeholder="$t('userAndCarTable.plateNumber')" v-model="listQuery.plateNumber" style="width: 220px;" class="filter-item" @keyup.enter.native="handleFilter"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('userAndCarTable.currentState')" prop="type">
              <el-select v-model="listQuery.currentState" :placeholder="$t('applyTable.currentState')" clearable class="filter-item" style="width: 230px">
                <el-option v-for="item in applyStatusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('userAndCarTable.departmentName')" prop="type">
              <el-select v-model="listQuery.departmentId" :placeholder="$t('userAndCarTable.departmentName')" clearable class="filter-item" style="width: 230px">
                <el-option v-for="item in deptOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column :label="$t('userAndCarTable.plateNumber')" prop="id" sortable="custom" align="center" width="120px">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{ scope.row.plateNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.vehicleBrand')" prop="id" sortable="custom" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.vehicleBrand }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.vechileType')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.vechileType }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.approvedSeating')" min-width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.approvedSeating }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.vehicleProperties')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.vehicleProperties }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.departmentName')" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.departmentName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.remark')" align="center" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAndCarTable.currentState')" align="center" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.currentState }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" width="auto">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">{{ scope.row.detail }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" id="">
      <el-form ref="dataForm" :rules="rules" :model="addParam" label-position="left" label-width="100px" style=" margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.plateNumber')" prop="userName">
              <el-input v-model="addParam.plateNumber" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.vehicleColor')" >
              <el-input v-model="addParam.vehicleColor" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.vehicleBrand')" >
              <el-input v-model="addParam.vehicleBrand" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.vechileType')" >
              <el-select v-model="addParam.vechileType" class="filter-item" placeholder="请选择">
                <el-option v-for="item in carTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" style="width: 205px;"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.approvedSeating')" prop="dept">
              <el-input v-model="addParam.approvedSeating" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.initMileage')">
              <el-input v-model="addParam.initMileage" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.tankCapacity')">
              <el-input v-model="addParam.tankCapacity" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.purchasePrice')">
              <el-input v-model="addParam.purchasePrice" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.vin')">
              <el-input v-model="addParam.vin"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.engineNo')">
              <el-input v-model="addParam.engineNo"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.vehicleLicOwner')">
              <el-input v-model="addParam.vehicleLicOwner"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.bookOriginValue')">
              <el-input v-model="addParam.bookOriginValue"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.terminalNo')" prop="carProperty">
                <el-input v-model="addParam.terminalNo"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.vehicleProperties')" prop="type">
              <el-select v-model="addParam.vehicleProperties" class="filter-item" placeholder="请选择">
                <el-option v-for="item in carPropertyOptions" :key="item.key" :label="item.display_name" :value="item.key" style="width: 205px;"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.faCardNum')">
              <el-input v-model="addParam.faCardNum" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.oilType')" >
              <el-select v-model="addParam.oilType" class="filter-item" placeholder="请选择">
                <el-option v-for="item in oilTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" style="width: 205px;"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.departmentName')" >
              <el-select v-model="addParam.departmentId" class="filter-item" placeholder="请选择">
                <el-option v-for="item in deptOptions" :key="item.key" :label="item.display_name" :value="item.key" style="width: 205px;"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.displacament')">
              <el-input v-model="addParam.displacament"  class="filter-item" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.loadWeight')">
              <el-input v-model="addParam.loadWeight"  class="filter-item" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('userAndCarTable.curbWeight')">
              <el-input v-model="addParam.curbWeight"  class="filter-item" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('userAndCarTable.remark')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="addParam.remark" type="textarea" placeholder="请输入" style="width: 540px;"/>
        </el-form-item>

        <el-form-item :label="$t('userAndCarTable.uploadImage')">
          <el-upload
            :multiple="true"
            action="http://upload.qiniup.com"
            accept="image/jpeg,image/gif,image/png,image/bmp"
            list-type="picture-card"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeUpload"
            :data="dataObj"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button  @click="dialogFormVisible = false">{{ $t('userAndCarTable.cancel') }}</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData()">{{ $t('userAndCarTable.save') }}</el-button>
        <el-button v-if="dialogStatus==='edit'" type="primary" @click="editData()">{{ $t('userAndCarTable.save') }}</el-button>
      </div> -->
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
  import { vehicleList,deptList,vehicleItem,vehicleDelete,vehicleAdd,vehicleUpdate,getImageToken} from '@/api/userAndCar'
  import { vehicleEnableList} from '@/api/applyCar'
  import { getQiniuToken } from '@/api/qiniu'
  import { setToken,getToken} from '@/utils/auth'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  // import SparkMD5 from 'spark-md5'

  const deptOptions = [];

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
        dialogImageUrl:'',
        tableKey: 0,
        deptList:null,
        carTypeList:null,
        carPropertyList:null,
        basicColorList:null,
        basicBrandList:null,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          plateNumber:'',
          currentState:'',
          departmentId:'',
          page: 1,
          limit: 10
        },
        addParam:{
          driverId:'',
          driverName:'',
          departmentId:'',
          departmentName:'',
          plateNumber:'',
          vehicleColor:'',
          vehicleBrand:'',
          vechileType:'',
          approvedSeating:'',
          vin:'',
          engineNo:'',
          purchasePrice:'',
          terminalNo:'',
          initMileage:'',
          tankCapacity:'',
          vehicleLicOwner:'',
          bookOriginValue:'',
          displacament:'',
          vehicleProperties:'',
          faCardNum:'',
          oilType:'',
          carIcon:'',
          loadWeight:'',
          curbWeight:'',
          remark:'',
          image:'',
          currentState:1
        },
        deptOptions:[],
        applyStatusOptions:[{key:'',display_name:'全部'},{key:'1',display_name:'空闲'},{key:'2',display_name:'出车'},{key:'3',display_name:'不可用'},{key:'4',display_name:'维修'}],
        useAreaOptions:[{key:'县区内',display_name:'县区内'},{key:'市内',display_name:'市内'},{key:'市外',display_name:'市外'},{key:'省外',display_name:'省外'}],
        carPropertyOptions:[{key:'0',display_name:'公务用车组'},{key:'1',display_name:'应急执法组'}],
        carTypeOptions:[{key:'轿车',display_name:'轿车'},{key:'客车',display_name:'客车'}],
        basicBrandOptions:[{key:'奔驰',display_name:'奔驰'},{key:'宝马',display_name:'宝马'}],
        oilTypeOptions:[{key:'1',display_name:'汽油'},{key:'0',display_name:'柴油'},{key:'2',display_name:'天然气'},{key:'3',display_name:'电动'}],
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
        dialogVisible:false,
        dialogStatus: '',
        textMap: {
          edit: '编辑车辆',
          create: '新增车辆'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          // userName: [{ required: true, message: '请填写用车人' }],
          // dept: [{ required: true, message: '请选择单位'}],
          // carType: [{ required: true, message: '请选择类型'}],
          // useArea: [{ required: true, message: '请选择区域'}],
          // carProperty: [{ required: true, message: '请选择性质'}],
          // datetime: [{ required: true, message: '请选择时间' }],
          // userMobile: [{ type: 'date', required: true, message: '请填写用车人', trigger: 'change' }],
        },
        downloadLoading: false,
        editId:'',
        fileIndex:0,
        dataObj: {
          key: '',
          token:''
        },
        image_uri: [],
        fileList: []
      }
    },
    created() {
      this.init()
    },
    methods: {
      init(){
        var userName = getToken('UserName');
        console.log(userName);
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
      getList() {
        this.list=[];
        this.total=0;
        this.listLoading = true;
        vehicleEnableList().then(response => {
          var data=response.data.datas;
          if(data){
            this.list = response.data.datas;
            this.total = response.data.datas.length?response.data.datas.length:0;
          }
          for (var i = 0; i < this.total; i++) {
            this.list[i].detail = '查看';
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handlePictureCardPreview(file){
        debugger;
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // getImageToken(fileName,data){
      //   getImageToken(data).then(response => {
      //     var uploadToken=response.data.datas.uploadToken;
      //     this.fileToken={
      //       key:fileName,
      //       token:uploadToken
      //     }
      //   });
      // },
      beforeUpload(file){
        const _self = this;
        return new Promise((resolve, reject) => {
          getQiniuToken(file.name).then(response => {
            debugger;
            const token = response.data.datas.uploadToken;
             _self.dataObj.key ='southstar:'+ file.name;
            _self.dataObj.token = token;
            resolve(true)
          })
        }).catch(err => {
          console.log(err);
          reject(false)
        })
      },
      // onFileChange (file,fileList) {
      //   // element 中组件对 file 进行加工，这里使用未加工的对象，只有未加工的对象才能在 blobSlice.call() 中正常操作
      //   var that=this;
      //   this.fileIndex++;
      //   let fileRaw = file.raw;
      //   this.fileName = file.name;
      //   let arr = file.name.split('.');
      //   if (arr && arr.length > 1) {
      //     let suffixName = arr[arr.length - 1].toLowerCase()
      //   }
      //   let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      //   let fileReader = new FileReader();
      //   let chunkSize = 2097152;
      //   let chunks = Math.ceil(file.size / chunkSize);
      //   let currentChunk = 0;
      //   let spark = new SparkMD5();
      //   fileReader.onload = function (e) {
      //     spark.append(e.target.result);
      //     currentChunk++;
      //     if (currentChunk < chunks) {
      //       loadNext()
      //     } else {
      //       if(that.fileIndex==2){
      //         that.getImageToken(file.name,spark.end());
      //       }
      //     }
      //   };
      //   fileReader.onerror = function () {
      //     console.warn('FileReader error.');
      //   };
      //   function loadNext () {
      //     let start = currentChunk * chunkSize;
      //     let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
      //     // 注意这里的 fileRaw
      //     fileReader.readAsArrayBuffer(blobSlice.call(fileRaw, start, end));
      //   };
      //   loadNext();
      // },
      handleRemove(){},
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
      clearParam(){
        this.addParam={
          driverId:'',
          driverName:'',
          departmentId:'',
          departmentName:'',
          plateNumber:'',
          vehicleColor:'',
          vehicleBrand:'',
          vechileType:'',
          approvedSeating:'',
          vin:'',
          engineNo:'',
          purchasePrice:'',
          terminalNo:'',
          initMileage:'',
          tankCapacity:'',
          vehicleLicOwner:'',
          bookOriginValue:'',
          displacament:'',
          vehicleProperties:'',
          faCardNum:'',
          oilType:'',
          carIcon:'',
          loadWeight:'',
          curbWeight:'',
          remark:'',
          image:'',
          currentState:1
        }
      },
      handleCreate() {
        this.clearParam();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        });
      },
      createData() {
        vehicleAdd(this.addParam).then(response => {
          debugger
          if(response.data.code==0){
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.getList();
            this.dialogFormVisible = false;
          }else{
            this.$message({
              message: '添加失败',
              type: 'error'
            })
          }
        });
      },
      handleEdit(row) {
        this.editId=row.id;
        var that=this;
        vehicleItem(row.id).then(response => {
          that.addParam = response.data.datas;
          that.dialogStatus = 'edit';
          that.dialogFormVisible = true;
          that.$nextTick(() => {
            that.$refs['dataForm'].clearValidate();
          })
        });
      },
      editData() {
        vehicleUpdate(this.editId,this.addParam).then(response => {
          if(response.data.code==0){
            this.getList();
            this.dialogFormVisible = false;
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          }else{
            this.$message({
              message: '修改失败',
              type: 'error'
            })
          }
        });
      },
      handleDelete(row) {
        this.$confirm('确认删除吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          vehicleDelete(row.id).then(response => {
            if(response.data.code==0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['车牌号','车辆品牌','车辆类型','核定座位数','车辆性质','所属单位','备注信息']
          const filterVal = ['plateNumber','vehicleBrand','vechileType','approvedSeating','vehicleProperties','departmentName','remark'];
          const data = this.formatJson(filterVal, this.list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '车辆列表'
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
