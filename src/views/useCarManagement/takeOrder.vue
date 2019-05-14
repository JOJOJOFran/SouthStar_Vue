<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="80px" style="margin-left:50px;">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('applyTable.applyNum')" prop="type">
              <el-input :placeholder="$t('applyTable.applyNum')" v-model="listQuery.applyNum" style="width: 220px;" class="filter-item"/>
            </el-form-item>
          </el-col>
          <!--<el-col :span="8">-->
          <!--<el-form-item :label="$t('applyTable.applyStatus')" prop="type">-->
          <!--<el-select v-model="listQuery.status" :placeholder="$t('applyTable.applyStatus')" clearable class="filter-item" style="width: 230px">-->
          <!--<el-option v-for="item in applyStatusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="8">
            <el-form-item label-width="80px" :label="$t('applyTable.beginTime')" class="postInfo-container-item">
              <el-date-picker v-model="listQuery.startDate" type="date" format="yyyy-MM-dd" :placeholder="$t('applyTable.beginTime')"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="80px" :label="$t('applyTable.endTime')" class="postInfo-container-item">
              <el-date-picker v-model="listQuery.endDate" type="date" format="yyyy-MM-dd" :placeholder="$t('applyTable.endTime')"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"> -->
     <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column align="center" :label="$t('applyTable.applyNum')" width="115">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{ scope.row.applyNum }}</span>
        </template>
      </el-table-column>
       <el-table-column width="auto" align="center" :label="$t('applyTable.carProperty')">
        <template slot-scope="scope">
          <span>{{ scope.row.carProperty }}</span>
        </template>
      </el-table-column>
      <el-table-column width="auto" align="center" :label="$t('applyTable.userName')">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110" align="center" :label="$t('applyTable.userMobile')">
        <template slot-scope="scope">
          <span>{{ scope.row.userMobile }}</span>
        </template>
      </el-table-column>
        <el-table-column :label="'类型'" width="70" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carType }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" :label="$t('applyTable.startPlanTime')" width="155">
        <template slot-scope="scope">
          <span>{{ scope.row.startPlanTime }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" :label="$t('applyTable.backPlanTime')" width="155">
        <template slot-scope="scope">
          <span>{{ scope.row.backTime }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" :label="$t('applyTable.startPoint')" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.startPoint }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" :label="$t('applyTable.destination')" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.destination }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" :label="$t('applyTable.applyReason')" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.applyReson }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" :label="$t('applyTable.currentStatus')" width="70">
        <template slot-scope="scope">
          <span style="color: green;">{{ scope.row.checkStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('applyTable.caozuo')" align="center" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" style="background-color:#42b983" @click="handleCalculation(scope.row)">{{ scope.row.calculation }}</el-button>
          <el-button type="primary" size="mini"  @click="handlePrint(scope.row)">{{ scope.row.print }}</el-button>
          <el-button type="danger" size="mini" v-if="scope.row.checkStatus =='已完成'"  plain disabled>{{ scope.row.cancel }}</el-button>
          <el-button type="danger" size="mini" v-else  @click="handleDelete(scope.row)">{{ scope.row.cancel }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog  :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="addParam" label-position="left" label-width="100px" style=" margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.userName')">
              <el-input v-model="addParam.userName" style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.userMobile')" >
              <el-input v-model="addParam.userMobile"  class="filter-item" style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.userDept')" prop="dept">
              <el-select v-model="addParam.departmentId" class="filter-item" placeholder="请选择" :disabled="true">
                <el-option v-for="item in deptOptions" :key="item.key" :label="item.display_name" :value="item.key" style="width: 205px;" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.userCount')">
              <el-input v-model="addParam.userCount"  class="filter-item"  style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.carType')" prop="carType">
              <el-select v-model="addParam.carType" class="filter-item" placeholder="请选择" :disabled="true">
                <el-option v-for="item in carTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" style="width: 205px;" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.useArea')" prop="useArea">
              <el-select v-model="addParam.useArea" class="filter-item" placeholder="请选择" :disabled="true">
                <el-option v-for="item in useAreaOptions" :key="item.key" :label="item.display_name" :value="item.key" style="width: 205px;" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.startPoint')">
              <el-input v-model="addParam.startPoint"  class="filter-item"  style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.destination')">
              <el-input v-model="addParam.destination"  class="filter-item"  style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.startPlanTime')" class="postInfo-container-item" >
              <el-date-picker v-model="addParam.startPlanTime" type="datetime" format="yyyy-MM-dd" :placeholder="$t('applyTable.endTime')" :readonly="true" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.endTime')" class="postInfo-container-item" >
              <el-date-picker v-model="addParam.backPlanTime" type="datetime" format="yyyy-MM-dd" :placeholder="$t('applyTable.endTime')" :readonly="true" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.carProperty')" >
              <el-select v-model="addParam.carProperty" class="filter-item" placeholder="请选择" :disabled="true">
                <el-option v-for="item in carPropertyOptions" :key="item.key" :label="item.display_name" :value="item.key"  style="width: 205px;"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.applyReason')" >
              <el-input v-model="addParam.applyReson"  class="filter-item" :readonly="true" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="$t('applyTable.remark')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="addParam.remark" type="textarea" placeholder="请输入" :readonly="true" style="width: 540px;"/>
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
          <!-- <el-col :span="12">
            <el-form-item :label="$t('applyTable.departmentName')">
              <el-input v-model="addParam.applyDepartmentId"  class="filter-item" style="width: 205px;"/>
            </el-form-item>
          </el-col> -->
          <el-form-item :label="$t('applyTable.departmentName')" prop="dept">
              <el-select v-model="addParam.applyDepartmentId" class="filter-item" placeholder="请选择" :disabled="true">
                <el-option v-for="item in deptOptions" :key="item.key" :label="item.display_name" :value="item.key" style="width: 205px;" />
              </el-select>
            </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.chooseCar')">
              <el-input v-model="addParam.plateNumber"  class="filter-item" style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.chooseDriver')">
              <el-input v-model="addParam.driverName"  class="filter-item" style="width: 205px;" :readonly="true"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus==='detail'" type="primary" @click="dialogFormVisible = false">确定</el-button>
      </div>
    </el-dialog>

    <!-- 应急执法 -->
    <el-dialog  :title="'回执明细'" :visible.sync="emergencyFormVisible">
      <el-form ref="dataForm" :model="addParam" label-position="left" label-width="100px" style=" margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.applyNum')">
              <el-input v-model="addParam.applyNum" style="width: 205px;" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.departmentName')" >
              <el-input v-model="addParam.departmentName"  class="filter-item" :disabled="true" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
           <el-form-item :label="$t('applyTable.userName')" >
              <el-input v-model="addParam.userName"  class="filter-item" :disabled="true" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.userMobile')">
              <el-input v-model="addParam.userMobile"  class="filter-item" :disabled="true" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="12">
           <el-form-item :label="$t('applyTable.plateNumber')" >
              <el-input v-model="addParam.plateNumber"  class="filter-item" :disabled="true" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.driverName')">
              <el-input v-model="addParam.driverName"  class="filter-item" :disabled="true"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.startMileage')">
                <el-input v-model="recieptModel.startKm"  class="filter-item"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.endMileage')">
              <el-input v-model="recieptModel.endKm"  class="filter-item"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.countMileage')">
              <el-input v-model="recieptModel.currentKm"  class="filter-item"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.isClean')">
              <el-select v-model="recieptModel.isClean" class="filter-item" placeholder="请选择"  style="width: 205px;">
                <el-option v-for="item in cleanOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.warehousingTime')" class="postInfo-container-item" >
              <el-date-picker v-model="recieptModel.backTime" type="datetime" @change="getCountTime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('applyTable.warehousingTime')" style="width: 205px;"/>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item :label="$t('applyTable.countTime')">
             <el-input v-model="recieptModel.useTime"  class="filter-item"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.satisfactionDegree')" class="postInfo-container-item" >
               <el-select v-model="recieptModel.evaluation" class="filter-item" placeholder="请选择"  style="width: 205px;">
                <el-option v-for="item in degreeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="emergencyFormVisible = false">{{ $t('applyTable.cancel') }}</el-button>
        <el-button type="primary" @click="calculationData">确定</el-button>
      </div>
    </el-dialog>
    <!-- 公务用车 --> 
    <el-dialog  :title="'回执明细'" :visible.sync="businessFormVisible">
      <el-form ref="dataForm" :model="addParam" label-position="left" label-width="100px" style=" margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.applyNum')">
              <el-input v-model="addParam.applyNum" style="width: 205px;" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.departmentName')" >
              <el-input v-model="addParam.departmentName"  class="filter-item" :disabled="true" style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
           <el-form-item :label="$t('applyTable.userName')" >
              <el-input v-model="addParam.userName"  class="filter-item" :disabled="true" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.userMobile')">
              <el-input v-model="addParam.userMobile"  class="filter-item" :disabled="true"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
           <el-form-item :label="$t('applyTable.plateNumber')" >
              <el-input v-model="addParam.plateNumber"  class="filter-item" :disabled="true" style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.driverName')">
              <el-input v-model="addParam.driverName"  class="filter-item" :disabled="true"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.startMileage')">
                <el-input v-model="recieptModel.startKm"  class="filter-item"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.endMileage')">
              <el-input v-model="recieptModel.endKm"  class="filter-item"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.countMileage')">
              <el-input v-model="recieptModel.currentKm"  class="filter-item"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item :label="$t('applyTable.isClean')">
              <el-select v-model="recieptModel.isClean" class="filter-item" placeholder="请选择" style="width: 205px;">
                <el-option v-for="item in cleanOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.expresswayExpense')">
              <el-input v-model="recieptModel.highwayFee"  class="filter-item"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('applyTable.parkExpense')">
            <el-input v-model="recieptModel.parkFee"  class="filter-item"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
         
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.warehousingTime')" class="postInfo-container-item" >
              <el-date-picker v-model="recieptModel.backTime" type="datetime" @change="getCountTime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('applyTable.warehousingTime')" style="width: 205px;"/>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item :label="$t('applyTable.countTime')">
             <el-input v-model="recieptModel.useTime"  class="filter-item"  style="width: 205px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  :label="$t('applyTable.satisfactionDegree')" class="postInfo-container-item" >
               <el-select v-model="recieptModel.evaluation" class="filter-item" placeholder="请选择" style="width: 205px;">
                <el-option v-for="item in degreeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="businessFormVisible = false">{{ $t('applyTable.cancel') }}</el-button>
        <el-button type="primary" @click="calculationData">确定</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog> -->

    <el-dialog  :title="textMap[dialogStatus]" :visible.sync="businessPrintVisible" width="90%">
       <el-form ref="dataForm"  label-position="left" label-width="80px" style="margin-left:20px;">
          <div ref="print" style="width:100%;height:100%;" id="printContent">
            <div class="postInfo-container">
              <table width="100%" height="100%" border="1" cellspacing="0">
            <tr>
              <td colspan="7"><h1 style="text-align:center;font-weight:bold;font-family:'STKaiti';">武汉市江夏新城通汽车服务有限公司</h1></td>
            </tr>
            <tr>
              <td colspan="7"><h2 style="text-align:center;font-family:'STKaiti';">公务用车派车单</h2></td>
            </tr>
            <tr>
              <td style="text-align:center;border-right: none">编号:</td>
              <td style="text-align:center;font-weight:bold;font-family:'STKaiti';border-left: none;border-right: none">
                {{addParam.applyNum}}
              </td>
              <td style="border-right: none;border-left: none"></td>
              <td style="border-left: none;border-right: none"></td>
              <td style="border-left: none;border-right: none"></td>
              <td style="text-align:center;border-left: none;border-right: none">日期:</td>
              <td style="border-left: none;text-align:center;font-weight:bold;font-family:'STKaiti';">
                {{localDate}}
              </td>
            </tr>
            <tr>
              <td rowspan="3" style="text-align:center;">用车单位申请信息</td>
              <td style="text-align:center;">用车单位</td>
              <td id="userDepartment" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                  {{addParam.userDepartment}}
              </td>
              <td style="text-align:center;">用车事由</td>
              <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                {{addParam.applyReson}}
              </td>
              <td style="text-align:center;">出发地点</td>
              <td id="startPoint" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                {{addParam.startPoint}}
              </td>
            </tr>
            <tr>
              <td style="text-align:center;">用车人</td>
              <td id="userName" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
               {{addParam.userName}}
              </td>
              <td style="text-align:center;">联系电话</td>
              <td id="userMobile" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                {{addParam.userMobile}}
              </td>
              <td style="text-align:center;">目的地</td>
              <td id="destination" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                {{addParam.destination}}
              </td>
            </tr>
            <tr>
              <td style="text-align:center;">计划出车时间</td>
              <td id="startPlanTime" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                  {{addParam.startPlanTime}}
              </td>
              <td style="text-align:center;">搭车人数</td>
              <td id="userCount" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                {{addParam.userCount}}
              </td>
              <td style="text-align:center;">用车性质</td>
              <td id="userProperty" style="text-align:center;font-weight:bold;font-family:'STKaiti'">
                公务用车
                <!--<el-col :span="24">-->
                  <!--<el-input v-model="addParam.carProperty"  readonly="true"  style="width: 205px;"/>-->
                <!--</el-col>-->
              </td>
            </tr>
            <tr>
              <td rowspan="2" style="text-align:center;">公用平台出车信息</td>
              <td style="text-align:center;">派用车种类</td>
              <td id="carType" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                {{addParam.carType}}
              </td>
              <td style="text-align:center;">调度车辆</td>
              <td id="plateNumber" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                {{addParam.plateNumber}}
              </td>
              <td style="text-align:center;">调度驾驶员</td>
              <td id="driverName" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                {{addParam.driverName}}
              </td>
            </tr>
            <tr>
              <td style="text-align:center;">出车时间</td>
              <td  style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                {{addParam.startPlanTime}}
              </td>
              <td style="text-align:center;">归队时间</td>
              <td  style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                {{recieptModel.backTime}}
              </td>
              <td style="text-align:center;">用车时长(或备注)</td>
              <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                {{recieptModel.useTime}}
              </td>
            </tr>
            <tr>
              <td style="text-align:center;" rowspan="3">驾驶人员填写</td>
              <td style="text-align:center;">出车前里程数(公里)</td>
              <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                {{recieptModel.startKm}}
              </td>
              <td style="text-align:center;">收车后里程数(公里)</td>
              <td style="text-align:center;font-weight:bold;font-family:'STKaiti';"> 
                {{recieptModel.endKm}}
              </td>
              <td style="text-align:center;">本次行车里程(公里)</td>
              <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                {{recieptModel.currentKm}}
              </td>
            </tr>
            <tr>
              <td style="text-align:center;">高速(元)</td>
              <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                 {{recieptModel.highwayFee}}
              </td>
              <td style="text-align:center;">停车费(元)</td>
              <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                {{recieptModel.parkFee}}
              </td>
              <td style="text-align:center;" rowspan="2">驾驶员签字</td>
              <td rowspan="2"></td>
            </tr>
            <tr>
              <td style="text-align:center;">是否清洗</td>
              <td>
                <el-col :span="24" style="margin-left: 20px;">
                  <el-checkbox-group v-model="checkClean" :disabled="true">
                    <el-checkbox label="是" name="type"></el-checkbox>
                    <el-checkbox label="否" name="type"></el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </td>
              <td  style="text-align:center;">入库时间</td>
              <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                {{recieptModel.backTime}}
              </td>
            </tr>
            <tr>
              <td style="text-align:center;" colspan="2"><span>对此次出行的评价</span></td>
              <td style="text-align:center;" colspan="5">
                <el-col :span="10">
                  <el-checkbox-group v-model="addParam.achievement" style="width:400px" :disabled="true">
                        <el-checkbox label="准时到达" name="type"></el-checkbox>
                        <el-checkbox label="满意" name="type"></el-checkbox>
                        <el-checkbox label="一般" name="type"></el-checkbox>
                        <el-checkbox label="不满意" name="type"></el-checkbox>
                      </el-checkbox-group>
                </el-col>
                <span style="margin-left:20px;">用车人签字：</span>
                <span style="margin-left:100px;">电话：</span>
              </td>
            </tr>
            <tr>
              <td colspan="7">
                <span style="margin-left:120px;">收车人签字：</span>
                <span style="margin-left:250px;">收车时间：</span>
                <span style="margin-left:250px;">客户投诉电话：027-87985966</span>
              </td>
            </tr>
            <tr>
              <td colspan="7"><span style="margin-left:20px;">备注：本派车单由申请用车部门确认签字后，交给驾驶员作为出车凭证</span></td>
            </tr>
          </table>
            </div>
        </div>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="businessPrintVisible = false">{{ $t('applyTable.cancel') }}</el-button>
        <el-button type="primary" @click="printData()">打印</el-button>
      </div>
    </el-dialog>

    <el-dialog  :title="textMap[dialogStatus]" :visible.sync="emergencyPrintVisible" width="90%">
        <el-form ref="dataForm" label-position="left" label-width="80px" style="margin-left:20px;">
          <div ref="print" style="width:100%;height:100%;">
            <div class="postInfo-container">
              <table width="100%" height="100%" border="1" cellspacing="0">
                <tr>
                  <td colspan="7"><h1 style="text-align:center;font-weight:bold;font-family:'STKaiti';">武汉市江夏新城通汽车服务有限公司</h1></td>
                </tr>
                <tr>
                  <td colspan="7"><h2 style="text-align:center;font-family:'STKaiti';">执法保障用车派车单</h2></td>
                </tr>
                <tr>
                  <td style="text-align:center;border-right: none">编号:</td>
                  <td style="text-align:center;font-weight:bold;font-family:'STKaiti';border-left: none;border-right: none">
                    {{addParam.applyNum}}
                  </td>
                  <td style="border-right: none;border-left: none"></td>
                  <td style="border-left: none;border-right: none"></td>
                  <td style="border-left: none;border-right: none"></td>
                  <td style="text-align:center;border-left: none;border-right: none">日期:</td>
                  <td style="border-left: none;border-right: none;font-family:'STKaiti';text-align:center;font-weight:bold;">
                    {{localDate}}
                  </td>
                </tr>
                <tr>
                  <td rowspan="3" style="text-align:center;">用车单位申请信息</td>
                  <td style="text-align:center;">用车单位</td>
                  <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                    {{addParam.userDepartment}}
                  </td>
                  <td style="text-align:center;">用车事由</td>
                  <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                    {{addParam.applyReson}}
                  </td>
                  <td style="text-align:center;">出发地点</td>
                  <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                    {{addParam.startPoint}}
                  </td>
                </tr>
                <tr>
                  <td style="text-align:center;">用车人</td>
                  <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                    {{addParam.userName}}
                  </td>
                  <td style="text-align:center;">联系电话</td>
                  <td  style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                    {{addParam.userMobile}}
                  </td>
                  <td style="text-align:center;">目的地</td>
                  <td  style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                    {{addParam.destination}}
                  </td>
                </tr>
                <tr>
                  <td style="text-align:center;">计划出车时间</td>
                  <td  style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                    {{addParam.startPlanTime}}
                  </td>
                  <td style="text-align:center;">搭车人数</td>
                  <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                    {{addParam.userCount}}
                  </td>
                  <td style="text-align:center;">用车性质</td>
                  <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                    执法用车
                  </td>
                </tr>
                <tr>
                  <td rowspan="2" style="text-align:center;">公用平台出车信息</td>
                  <td style="text-align:center;">派用车种类</td>
                  <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                    {{addParam.carType}}
                  </td>
                  <td style="text-align:center;">调度车辆</td>
                  <td  style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                    {{addParam.plateNumber}}
                  </td>
                  <td style="text-align:center;">调度驾驶员</td>
                  <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                    {{addParam.driverName}}
                  </td>
                </tr>
                <tr>
                  <td style="text-align:center;">出车时间</td>
                  <td  style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                    {{addParam.startPlanTime}}
                  </td>
                  <td style="text-align:center;">归队时间</td>
                  <td  style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                    {{recieptModel.backTime}}
                  </td>
                  <td style="text-align:center;">用车时长(或备注)</td>
                  <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                    {{recieptModel.useTime}}
                  </td>
                </tr>
                <tr>
                  <td style="text-align:center;" rowspan="2">驾驶人员填写</td>
                  <td style="text-align:center;">出车前里程数(公里)</td>
                  <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                     {{recieptModel.startKm}}
                  </td>
                  <td style="text-align:center;">收车后里程数(公里)</td>
                  <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                     {{recieptModel.endKm}}
                  </td>
                  <td style="text-align:center;">本次行车里程(公里)</td>
                  <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                     {{recieptModel.currentKm}}
                  </td>
                </tr>
                <tr>
                  <td style="text-align:center;">是否清洗</td>
                  <td>
                    <el-col :span="24" style="margin-left: 20px;">
                      <el-checkbox-group v-model="checkClean" :disabled="true">
                        <el-checkbox label="是" name="type"></el-checkbox>
                        <el-checkbox label="否" name="type"></el-checkbox>
                      </el-checkbox-group>
                    </el-col>
                  </td>
                  <td  style="text-align:center;">入库时间</td>
                  <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                     {{recieptModel.backTime}}
                  </td>
                  <td style="text-align:center;">驾驶员签字</td>
                  <td ></td>
                </tr>
                <tr>
                  <td style="text-align:center;" colspan="2"><span>对此次出行的评价</span></td>
                  <td style="text-align:center;" colspan="5">
                    <el-col :span="10">
                      <el-checkbox-group v-model="checkDegree" :disabled="true" style="width:400px">
                        <el-checkbox label="准时到达" name="type"></el-checkbox>
                        <el-checkbox label="满意" name="type" ></el-checkbox>
                        <el-checkbox label="一般" name="type" ></el-checkbox>
                        <el-checkbox label="不满意" name="type" ></el-checkbox>
                      </el-checkbox-group>
                      
                    </el-col>
                    <span style="margin-left:30px;">用车人签字：</span>
                    <span style="margin-left:100px;">电话：</span>
                  </td>
                </tr>
                <tr>
                  <td colspan="7">
                    <span style="margin-left:120px;">收车人签字：</span>
                    <span style="margin-left:250px;">收车时间：</span>
                    <span style="margin-left:250px;">客户投诉电话：027-87985966</span>
                  </td>
                </tr>
                <tr>
                  <td colspan="7"><span style="margin-left:20px;">备注：本派车单由申请用车部门确认签字后，交给驾驶员作为出车凭证</span></td>
                </tr>
              </table>
            </div>
          </div>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="emergencyPrintVisible = false">{{ $t('applyTable.cancel') }}</el-button>
        <el-button type="primary" @click="printData()">打印</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  // import { fetchList } from '@/api/article'
  import { dispatchList, deptList,dispatchItem,applyDetail,recieptSet,recieptGet,cancelOrder,deleteOrder} from '@/api/applyCar'
  import { setNewToken,getNewToken} from '@/utils/auth'
  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Vue from 'vue'
  // import Print from 'vue-print-nb'
  import Print from '@/print'
  Vue.use(Print);

  export default {
    name: 'InlineEditTable',
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
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          applyNum:'',
          startDate:'',
          endDate:'',
          page: 1,
          limit: 10
        },
        deptList:null,
        deptOptions:[],
        useAreaOptions:[{key:'县区内',display_name:'县区内'},{key:'市内',display_name:'市内'},{key:'市外',display_name:'市外'},{key:'省外',display_name:'省外'}],
        carPropertyOptions:[{key:0,display_name:'公务用车组'},{key:1,display_name:'执法用车组'}],
        carTypeOptions:[{key:'轿车',display_name:'轿车'},{key:'商务车',display_name:'商务车'},{key:'小型客车',display_name:'小型客车'},{key:'客车',display_name:'客车'}],
        cleanOptions:[{key:true,display_name:'是'},{key:false,display_name:'否'}],
        degreeOptions:[{key:1,display_name:'准时到达'},{key:16,display_name:'满意'},{key:32,display_name:'一般'},{key:48,display_name:'不满意'}],
        temp: {},
        showPrintContent:true,
        dispatchId:'',
        dialogFormVisible: false,
        printFormVisible: false,
        dialogStatus: '',
        textMap: {
          detail:'派车单详情',
          print:'打印派车单'
        },
        dialogPvVisible: false,
        // addParam:{}
        addParam:{
          applyNum: '',
          applicantId: "",
          applicantName: "",
          departmentId: "",
          departmentName: "",
          userName: "",
          userMobile: "",
          applyReson: "",
          userCount: "",
          carType: "",
          startPoint: "",
          destination: "",
          carProperty: "0",
          startPlanTime: "",
          backPlanTime: "",
          remark: "",
          driverId:"",
          driverName: "",
          driverPhone: "",
          vehicleId: "",
          plateNumber:""
        },
        applyDepartmentId:'',
        localDate:'',
        businessFormVisible:false,
        emergencyFormVisible:false,
        businessPrintVisible:false,
        emergencyPrintVisible:false,
        recieptModel:{//核算
          dispatchId: '',
          startKm: '',
          endKm: '',
          currentKm: '',
          highwayFee: '',
          parkFee: '',
          isClean: true,
          evaluation: '',
          backTime: '',
          useTime:'',//用车时长
          applyId:'',
        },
        checkClean:[],
        checkDegree:[],
        recieptApplyId:'',
      }
    },
    created() {
      this.addParam.departmentId=getNewToken("DepartmentId");
      this.addParam.applicantId=getNewToken("ApplicationId");
      this.addParam.applicantName=getNewToken("DisplayName");
      this.addParam.applicantPhone=getNewToken("Phone");
      this.localDate=this.getLocalDatetime();
      deptList().then(response => {
        this.deptList = response.data.datas;
        var count = response.data.datas.length;
        for (var i = 0; i < count; i++) {
          var obj = {
            key: this.deptList[i].id,
            display_name: this.deptList[i].departmentName
          };
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
        // this.list=[];
        // this.total=0;
        this.listLoading = true;
        dispatchList(this.listQuery).then(response => {
          var data = response.data.datas;
          if(data) {
            this.list = response.data.datas;
            this.total = response.data.pageInfo.sum;
            for (var i = 0; i < this.list.length; i++) {
              // this.list[i].startPlanTime = this.list[i].startPlanTime.split('T')[0];
              // this.list[i].backPlanTime = this.list[i].backPlanTime.split('T')[0];
              this.list[i].detail = "详情";
              this.list[i].print = "打印";
              this.list[i].calculation = "回执";
              if(this.list[i].sourceType==0)
              {
                this.list[i].cancel="取消";
              }else{
                this.list[i].cancel="删除";
              }
            }
          }
          else{
            this.list = [];
            this.total = 0;
          }
          this.listLoading = false;
        })
      },
      handleSelectVehicle(){},
      handleSelectDriver(){},
      querySearchVehicle(){},
      querySearchDriver(){},
      querySearchDept(){},
      handleSelectDept(){},

      handleDetail(row){
        applyDetail(row.applyId).then(resp => {
          this.dispatchId=row.id;
          dispatchItem(row.id).then(response => {
            this.addParam = response.data.datas;
            this.addParam.applicantId = resp.data.datas[0].applicantId;
            this.addParam.applicantPhone = resp.data.datas[0].applicantPhone;
            this.addParam.applicantName = resp.data.datas[0].applicantName;
            this.dialogStatus = 'detail';
            this.dialogFormVisible = true;
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate();
            })
          });
        });
      },
      handlePrint(row){
        this.dispatchId=row.id;
        //详情
        dispatchItem(row.id).then(response => {
          //核算
          this.clearRecieptModel();
          recieptGet(row.id).then(res => {
            this.addParam = response.data.datas;
            for(var i=0;i<this.deptList.length;i++){
                if(this.deptList[i].id==this.addParam.departmentId){
                    this.addParam.departmentName=this.deptList[i].departmentName;
                }
            }
            if(res.data.datas){
              this.recieptModel = res.data.datas;
              this.checkClean=[];
              this.checkDegree=[];
              if(this.recieptModel.isClean){
                this.checkClean.push("是");
              }else{
                this.checkClean.push("否");
              }
              if(this.recieptModel.evaluation==1){
                this.checkDegree.push("准时到达");
              }else if(this.recieptModel.evaluation==16){
                this.checkDegree.push("满意");
              }
              else if(this.recieptModel.evaluation==32){
                this.checkDegree.push("一般");
              }
              else if(this.recieptModel.evaluation==48){
                this.checkDegree.push("不满意");
              }
              
            }
            this.dialogStatus = 'print';
            if(row.carProperty !="公务用车"){
              this.emergencyPrintVisible=true;
            }else{
              this.businessPrintVisible = true;
            }
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate();
            })
          });
        });
      },
      clearRecieptModel(){
        this.recieptModel={//核算
          dispatchId: '',
          startKm: '',
          endKm: '',
          currentKm: '',
          highwayFee: '',
          parkFee: '',
          isClean: true,
          evaluation: '',
          backTime: '',
          applyId:'',
          useTime:''
        }
      },
      printData(){
        this.$print(this.$refs.print);
      },
      handleCalculation(row){
        this.addParam.applyNum=row.applyNum;
        this.addParam.departmentName=row.userDepartment;
        this.addParam.userName=row.userName;
        this.addParam.userMobile=row.userMobile;
        this.addParam.driverName = row.driverName;
        this.addParam.plateNumber = row.plateNumber;
        this.addParam.startPlanTime=row.startPlanTime;
        this.applyDepartmentId=row.applyDepartmentId;

        this.clearRecieptModel();

        this.recieptModel.dispatchId= row.id;
        // this.recieptModel.applyId= row.applyId;
        this.recieptApplyId=row.applyId;
        recieptGet(row.id).then(response => {
          if(response.data.datas){
            this.recieptModel = response.data.datas;
          }
          if(row.carProperty=="公务用车"){
            this.businessFormVisible=true;
          }else{
            this.emergencyFormVisible=true;
          }
        });
      },
      calculationData(){
        this.recieptModel.applyId=this.recieptApplyId;
         recieptSet(this.recieptModel).then(response => {
          if(response.data.code==0){
            this.businessFormVisible=false;
            this.emergencyFormVisible=false;
            this.$message({
              message: '核算成功',
              type: 'success'
            });
            this.getList();
          }else {
            this.$message({
              message: '核算失败',
              type: 'error'
            })
          }
        })
      },
      handleDelete(row) {
        if(row.sourceType==0)
        {
          this.$confirm('确认取消派车单吗, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            cancelOrder(row.id).then(response => {
              if (response.data.code == 0) {
                this.$message({
                type: 'success',
                message: '取消成功!'
                })
                this.getList()
              }
            })
          }).catch(() => {
            // this.$message({
            // type: 'info',
            // message: '已取消操作'
            //})
          })
        }else{
          this.$confirm('确认删除派车单吗, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteOrder(row.id).then(response => {
              if (response.data.code == 0) {
                  this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getList()
              }
            })
          }).catch(() => {
            // this.$message({
            // type: 'info',
            // message: '已取消删除'
            // })
          })
        }
      },
      getCountTime(value){
        var startTime=this.GetUnixTime(this.addParam.startPlanTime);
        var endTime=this.GetUnixTime(value);
        this.recieptModel.useTime=(endTime-startTime)/60;
      },
      //获取Unix时间戳
      GetUnixTime (timeStr) {
        var objD = new Date(timeStr);
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
        var str = yy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":00";
        var time = new Date(str);
        return (time.getTime() / 1000);
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
        var str = yy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss;
        return str;
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['流程编号','用车人','用车类型','用车人电话','出发时间','归队时间','出发地','目的地','用车事由']
          const filterVal = ['applyNum','userName','carType','userMobile','startPlanTime','backPlanTime','startPoint','destination','applyReson'];
          const data = this.formatJson(filterVal, this.list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '派单列表'
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

<style scoped>
  td{
    height: 40px;
  }
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
