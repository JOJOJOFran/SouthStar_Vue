<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :class-name="'sub-navbar '+postForm.status">
        <CommentForBusiness v-model="postForm.comment_disabled" />
        <!--<PlatformDropdown v-model="postForm.platforms" />-->
        <!--<SourceUrlDropdown v-model="postForm.source_uri" />-->
        <el-button v-loading="loading" style="margin-left: 10px;" type="primary"  @click="saveMould">保存模板</el-button>
        <el-button v-loading="loading" style="margin-left: 10px;" type="danger"  @click="clear">清空</el-button>
        <el-button v-loading="loading" style="margin-left: 10px;" type="success"  @click="submitForm">{{buttonText[btnStatus]}}
        </el-button>
        <el-button v-loading="loading" type="warning" @click="printForm">打印</el-button>
      </sticky>
      <div style="margin-top: 10px">
        <div style="width:110px;height:20px;margin-left:20px;font-family:'STKaiti';font-weight:bold;font-size:20px;">填表模板：</div>
        <!-- <span style=""></span> -->
        <div style="margin-left:70px">
          <el-radio-group v-model="checkTemplate" @change="templateChange">
            <el-radio :label="item" :key="item" v-for="item in templateList" border style="margin-top:10px;margin-left:0px;">{{item}}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <!-- 公务用车填写 -->
      <div class="createPost-main-container" v-show="!postForm.comment_disabled && !showPrintDetail">
        <el-form ref="dataForm"  label-position="left" label-width="80px" style="margin-left:20px;">
          <div ref="print" style="width:100%;height:100%;" id="printContent">
            <div class="postInfo-container">
              <table width="100%" height="100%" border="0" cellspacing="0" class="printTable">
            <tr>
              <td colspan="7" style="border:none"><h1 style="text-align:center;font-weight:bold;font-family:'STKaiti';margin-top:0px;margin-bottom:0px;">武汉市江夏新城通汽车服务有限公司</h1></td>
            </tr>
            <tr>
              <td colspan="7" style="border:none"><h2 style="text-align:center;font-family:'STKaiti';margin-top:0px;margin-bottom:0px;">公务用车派车单</h2></td>
            </tr>
            <tr>
              <td style="text-align:center;border-right: none">编号:</td>
                <td style="text-align:center;font-weight:bold;font-family:'STKaiti';border-left:none;border-right:none;border-top: none;">
                  {{addParam.applyNum}}
                </td>
                <td style="border-right: none;border-left: none;border-top: none"></td>
                <td style="border-left: none;border-right: none;border-top: none"></td>
                <td style="border-left: none;border-right: none;border-top: none"></td>
                <td style="text-align:center;border-left: none;border-right: none;border-top: none">日期:</td>
                <td style="border-left: none;border-top: none;font-family:'STKaiti';text-align:center;font-weight:bold;">
                  {{localDate}}
                </td>
            </tr>
            <tr>
              <td rowspan="3" style="text-align:center;">用车单位申请信息</td>
              <td style="text-align:center;">用车单位</td>
              <td id="userDepartment" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                  <el-col :span="24">
                      <!-- <el-autocomplete
                        class="inline-input"
                        v-model="addParam.departmentName"
                        :fetch-suggestions="querySearchDept"
                        suffix-icon="el-icon-search"
                        placeholder="请输入内容"
                        @select="handleSelectDept"
                        style="width: 205px;"
                      ></el-autocomplete> -->
                      <el-input v-model="addParam.departmentName"  style="width:100%;"/>
                  </el-col>
              </td>
              <td style="text-align:center;">用车事由</td>
              <td style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                <el-col :span="24">
                    <el-input v-model="addParam.applyReson"  style="width:100%;"/>
                </el-col>
              </td>
              <td style="text-align:center;">出发地点</td>
              <td id="startPoint" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                <el-col :span="24">
                  <el-input v-model="addParam.startPoint"  style="width:100%;"/>
                </el-col>
              </td>
            </tr>
            <tr>
              <td style="text-align:center;">用车人</td>
              <td id="userName" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                <el-col :span="24">
                  <el-input v-model="addParam.userName"  style="width:100%;"/>
                </el-col>
              </td>
              <td style="text-align:center;">联系电话</td>
              <td id="userMobile" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                <el-col :span="24">
                  <el-input v-model="addParam.userMobile"  style="width:100%;"/>
                </el-col>
              </td>
              <td style="text-align:center;">目的地</td>
              <td id="destination" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                <el-col :span="24">
                  <el-input v-model="addParam.destination"  style="width:100%;"/>
                </el-col>
              </td>
            </tr>
            <tr>
              <td style="text-align:center;">计划用车时间</td>
              <td id="startPlanTime" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                  <el-col :span="24">
                      <el-date-picker v-model="addParam.startPlanTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="计划用车时间" style="width:100%;"/>
                  </el-col>
              </td>
              <td style="text-align:center;">搭车人数</td>
              <td id="userCount" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                <el-col :span="24">
                  <el-input v-model="addParam.userCount"  style="width:100%;"/>
                </el-col>
              </td>
              <td style="text-align:center;">用车性质</td>
              <td id="userProperty" style="text-align:center;">
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
                <el-col :span="24">
                  <el-select v-model="addParam.carType" class="filter-item" placeholder="选择派车种类" style="width:100%;">
                    <el-option v-for="item in carTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
                  </el-select>
                </el-col>
              </td>
              <td style="text-align:center;">调度车辆</td>
              <td id="plateNumber" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                <el-col :span="24">
                  <el-autocomplete
                    class="inline-input"
                    v-model="addParam.plateNumber"
                    :fetch-suggestions="querySearchVehicle"
                    suffix-icon="el-icon-search"
                    placeholder="请输入内容"
                    @select="handleSelectVehicle"
                    style="width:100%;"
                  ></el-autocomplete>
                </el-col>
              </td>
              <td style="text-align:center;">调度驾驶员</td>
              <td id="driverName" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                <el-col :span="24">
                  <el-autocomplete
                    class="inline-input"
                    v-model="addParam.driverName"
                    :fetch-suggestions="querySearchDriver"
                    suffix-icon="el-icon-search"
                    placeholder="请输入内容"
                    @select="handleSelectDriver"
                    style="width:100%;"
                  ></el-autocomplete>
                </el-col>
              </td>
            </tr>
            <tr>
              <td style="text-align:center;">出车时间</td>
              <td  style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                <el-col :span="24">
                  <el-date-picker v-model="addParam.departureTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="出车时间" style="width:100%;"/>
                </el-col>
              </td>
              <td style="text-align:center;">归队时间</td>
              <td  style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                <!-- <el-col :span="24">
                  <el-date-picker v-model="addParam.backPlanTime" type="date" format="yyyy-MM-dd" placeholder="选择出车时间" style="width:205px;"/>
                </el-col> -->
              </td>
              <td style="text-align:center;">用车时长</td>
              <td style="text-align:center;">
                <!-- <el-col :span="24">
                  <el-input v-model="addParam.remark"  style="width: 205px;"/>
                </el-col> -->
              </td>
            </tr>
            <tr>
              <td style="text-align:center;" rowspan="3">驾驶人员填写</td>
              <td style="text-align:center;">出车前里程数(公里)</td>
              <td></td>
              <td style="text-align:center;">收车后里程数(公里)</td>
              <td></td>
              <td style="text-align:center;">本次行车里程(公里)</td>
              <td></td>
            </tr>
            <tr>
              <td style="text-align:center;">高速(元)</td>
              <td></td>
              <td style="text-align:center;">停车费(元)</td>
              <td></td>
              <td style="text-align:center;" rowspan="2">驾驶员签字</td>
              <td rowspan="2"></td>
            </tr>
            <tr>
              <td style="text-align:center;">是否清洗</td>
              <td>
                <el-col :span="24" style="margin-left: 20px;">
                  <el-checkbox-group v-model="addParam.achievement" :disabled="true">
                    <el-checkbox label="是" name="type"></el-checkbox>
                    <el-checkbox label="否" name="type"></el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </td>
              <td  style="text-align:center;">入库时间</td>
              <td></td>
            </tr>
            <tr>
              <td style="text-align:center;" colspan="2"><span>对此次出行的评价</span></td>
              <td style="text-align:center;" colspan="5">
                <el-col :span="10">
                  <el-checkbox-group v-model="addParam.achievement" :disabled="true">
                    <el-checkbox label="准时到达" name="type"></el-checkbox>
                    <el-checkbox label="满意" name="type"></el-checkbox>
                    <el-checkbox label="一般" name="type"></el-checkbox>
                    <el-checkbox label="迟到" name="type"></el-checkbox>
                    <el-checkbox label="取消订单" name="type"></el-checkbox>
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
                <span style="margin-left:250px;">平台电话：027-87985966</span>
              </td>
            </tr>
            <tr>
              <td colspan="7" style="border:none;"><span style="margin-left:20px;">备注：本派车单由申请用车部门确认签字后，交给驾驶员作为出车凭证</span></td>
            </tr>
          </table>
            </div>
        </div>
        </el-form>
      </div>
      <!-- 公务用车打印 -->
      <div class="createPost-main-container" v-show="!postForm.comment_disabled && showPrintDetail">
        <el-form ref="dataForm"  label-position="left" label-width="80px" style="margin-left:20px;">
          <div ref="printBusiness" style="width:100%;height:98%;" id="printContent">
            <div class="postInfo-container">
            <table width="100%" height="100%" border="0" cellspacing="0" class="printTable">
            <tr>
              <td colspan="7" style="border:none"><h1 style="text-align:center;font-weight:bold;font-family:'STKaiti';margin-top:0px;margin-bottom:0px;">武汉市江夏新城通汽车服务有限公司</h1></td>
            </tr>
            <tr>
              <td colspan="7" style="border:none"><h2 style="text-align:center;font-family:'STKaiti';margin-top:0px;margin-bottom:0px;">公务用车派车单</h2></td>
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
              <td style="border-left: none;font-family:'STKaiti';text-align:center;font-weight:bold;">
                {{localDate}}
              </td>
            </tr>
            <tr>
              <td rowspan="3" style="text-align:center;">用车单位申请信息</td>
              <td style="text-align:center;">用车单位</td>
              <td id="userDepartment" style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                  {{addParam.departmentName}}
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
              <td style="text-align:center;">计划用车时间</td>
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
                {{addParam.departureTime}}
              </td>
              <td style="text-align:center;">归队时间</td>
              <td  style="text-align:center;font-weight:bold;font-family:'STKaiti';">
                {{addParam.backPlanTime}}
              </td>
              <td style="text-align:center;">用车时长</td>
              <td style="text-align:center;">
                {{addParam.remark}}
              </td>
            </tr>
            <tr>
              <td style="text-align:center;" rowspan="3">驾驶人员填写</td>
              <td style="text-align:center;">出车前里程数(公里)</td>
              <td></td>
              <td style="text-align:center;">收车后里程数(公里)</td>
              <td></td>
              <td style="text-align:center;">本次行车里程(公里)</td>
              <td></td>
            </tr>
            <tr>
              <td style="text-align:center;">高速(元)</td>
              <td></td>
              <td style="text-align:center;">停车费(元)</td>
              <td></td>
              <td style="text-align:center;" rowspan="2">驾驶员签字</td>
              <td rowspan="2"></td>
            </tr>
            <tr>
              <td style="text-align:center;">是否清洗</td>
              <td>
                <el-col :span="24" style="margin-left: 20px;">
                  <el-checkbox-group v-model="addParam.achievement" :disabled="true">
                    <el-checkbox label="是" name="type"></el-checkbox>
                    <el-checkbox label="否" name="type"></el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </td>
              <td  style="text-align:center;">入库时间</td>
              <td></td>
            </tr>
            <tr>
              <td style="text-align:center;" colspan="2"><span>对此次出行的评价</span></td>
              <td style="text-align:center;" colspan="5">
                <el-col :span="10">
                  <el-checkbox-group style="width:450px" :disabled="true">
                    <el-checkbox label="准时到达" name="type"></el-checkbox>
                    <el-checkbox label="满意" name="type" ></el-checkbox>
                    <el-checkbox label="一般" name="type" ></el-checkbox>
                    <el-checkbox label="迟到" name="type" ></el-checkbox>
                    <el-checkbox label="取消订单" name="type" ></el-checkbox>
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
                <span style="margin-left:250px;">平台电话：027-87985966</span>
              </td>
            </tr>
            <tr>
              <td colspan="7"  style="height:30px;border:none;"><span style="margin-left:20px;">备注：本派车单由申请用车部门确认签字后，交给驾驶员作为出车凭证</span></td>
            </tr>
          </table>
            </div>
        </div>
        </el-form>
      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import { userSearch } from '@/api/remoteSearch'
import { setNewToken,getNewToken,removeNewToken} from '@/utils/auth'
import { deptList,driverEnableList,vehicleEnableList,driverAllList,vehicleAllList,quickDispatch,getQuickDispatchCache,setQuickDispatchCache,setTemplate,getTemplate,getTemplateKeys} from '@/api/applyCar'
import Warning from './Warning'
import { CommentForBusiness, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

import Vue from 'vue'
import Print from '@/print'
Vue.use(Print);

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  content_short: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}

export default {
  name: 'Business',
  components: { Tinymce, MDinput, Upload, Sticky, Warning, CommentForBusiness, PlatformDropdown, SourceUrlDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  watch: {
      clearParam(disabledFlag) {
        if(disabledFlag){
          this.showPrintDetail = false;
          var cookieKey = getNewToken("CookieKey_Emergency");
          if(cookieKey){
            this.getFormData(cookieKey);
          }else{
            this.clear();
          }
        }
        else if(!disabledFlag){
          this.showPrintDetail = false;
          var cookieKey = getNewToken("CookieKey_Business");
          if(cookieKey){
            this.getFormData(cookieKey);
          }
          else {
            this.clear();
          }
        }
        this.btnStatus='submit';
        
      }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validateURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {},
      deptList:[],
      driverList:[],
      vehicleList:[],
      useAreaOptions:[{key:'县区内',display_name:'县区内'},{key:'市内',display_name:'市内'},{key:'市外',display_name:'市外'},{key:'省外',display_name:'省外'}],
      //carPropertyOptions:[{key:0,display_name:'公务用车组'},{key:1,display_name:'应急执法组'}],
      carTypeOptions:[{key:'轿车',display_name:'轿车'},{key:'商务车',display_name:'商务车'},{key:'小型客车',display_name:'小型客车'},{key:'客车',display_name:'客车'}],
      deptOptions:[],
      vehicleOptions:[],
      driverOptions:[],
      addParam:{
        applyNum:'',
        applicantId: getNewToken("ApplicationId"),
        applicantName: getNewToken("DisplayName"),
        departmentId: getNewToken("DepartmentId"),
        departmentName: "",
        userName: "",
        userMobile: "",
        applyReson: "",
        userCount: "",
        carType: "",
        startPoint: "",//计划用车时间
        destination: "",
        carProperty: "0",
        startPlanTime: "",
        backPlanTime: "",
        remark: "",
        driverId:"",
        driverName: "",
        driverPhone: "",
        vehicleId: "",
        plateNumber:"",
        departureTime:""//出车时间
      },
      localDate:'',
      showPrintDetail:false,
      buttonText:{
        submit:'提交',
        // create:'填写'
      },
      btnStatus:'submit',
      checkTemplate:'',
      templateList:[],
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    lang() {
      return this.$store.getters.language
    },
    clearParam() {
        return this.postForm.comment_disabled;
    }
  },
  created() {
    //监测ctrl+s保存表单数据
    var that=this;
    document.onkeydown = function(e) {
      let keyCode = window.event.keyCode;
      if (keyCode == 83 && event.ctrlKey) {
          that.setFormData();
          event.preventDefault();
          event.returnValue = false;
          return false;
      }
    };

    this.localDate=this.getLocalDatetime();
    if(this.postForm.comment_disabled){
      this.addParam.carProperty="1";
    }else {
      this.addParam.carProperty="0";
    }
    this.addParam.departmentId=getNewToken("DepartmentId");
    this.addParam.applicantId=getNewToken("ApplicationId");
    this.addParam.applicantName=getNewToken("DisplayName");
    this.addParam.applicantPhone=getNewToken("Phone");

     var cookieKey = getNewToken("CookieKey_Business");
    if(cookieKey){
      this.getFormData(cookieKey);
    }
    else {
      this.clear();
    }
    this.getTemplateList();
  },
  methods: {
    //获取所有模板
    getTemplateList(){
      var type=0;//公务用车
      getTemplateKeys(type).then(response => {
        var result = response.data.datas;
        this.templateList=[];
        for(var i=0;i<result.length;i++){
          this.templateList.push(result[i]);
        }
      });
    },
    //模板选中事件
    templateChange(item){
      var type=0;//公务用车
      getTemplate(type,item).then(response => {
        var result = response.data.datas;
        if(result){
          this.addParam = result;
        }
      });
    },
    querySearchDept(queryString, cb){
      deptList().then(response => {
        var result = response.data.datas;
        var deptList=[];
        for(var i=0;i<result.length;i++){
          if(result[i].departmentName.toLowerCase().indexOf(queryString.toLowerCase()) !=-1){
            deptList.push({value:result[i].departmentName,deptId:result[i].id});
          }
        }
        cb(deptList);
      });
    },
    handleSelectDept(item){
      this.addParam.departmentId=item.deptId;
    },
    //选择车辆
    querySearchVehicle(queryString, cb){
      vehicleAllList(0).then(response => {
        var data = response.data.datas;
        var count=0;
        if(data) {
          this.vehicleList = response.data.datas;
          count = response.data.datas.length;
        }
        var carData=[];
        for(var i=0;i< count;i++){
          if(this.vehicleList[i].desc.toLowerCase().indexOf(queryString.toLowerCase()) !=-1){
            if(this.vehicleList[i].vehicleProperties==0)//公务用车
            {
              carData.push({value:this.vehicleList[i].plateNumber,plateNumber:this.vehicleList[i].plateNumber,vehicleId:this.vehicleList[i].id});
            }
          }
        }
        cb(carData);
      });
    },
    handleSelectVehicle(item){
      this.addParam.vehicleId=item.vehicleId;
      this.addParam.plateNumber=item.plateNumber;
    },
    //选择司机
    querySearchDriver(queryString, cb){
      driverAllList().then(response => {
        var data = response.data.datas;
        var count=0;
        if(data) {
          this.driverList = response.data.datas;
          count = response.data.datas.length;
        }
        var carData=[];
        for(var i=0;i<count;i++){
          var dataStr = this.driverList[i].desc;
          if(dataStr.indexOf(queryString.toLowerCase()) !=-1){
            carData.push({value:this.driverList[i].desc,name:this.driverList[i].name,driverId:this.driverList[i].id,driverPhone:this.driverList[i].mobileNum});
          }
        }
        cb(carData);
      });
    },
    handleSelectDriver(item){
      this.addParam.driverId=item.driverId;
      this.addParam.driverName = item.name+'('+item.driverPhone+')'
    },
    //保存表单数据
    setFormData(){
      // var valueString = JSON.stringify(this.addParam);
      var type='';
      var key='';
      if(this.postForm.comment_disabled){
        type="emergency";
        key=getNewToken("Account")+ "_" + type;
        //先移除CookieKey
        removeNewToken("CookieKey_Emergency");
        setNewToken("CookieKey_Emergency",key);
      }else {
        type="business";
        key=getNewToken("Account")+ "_" + type;
        //先移除CookieKey
        removeNewToken("CookieKey_Business");
        setNewToken("CookieKey_Business",key);
      }
      setQuickDispatchCache(key,this.addParam).then(response => {
        if(response.data.code==0){
          this.$message({
            message: '保存成功',
            type: 'success'
          });
        }else{
          this.$message({
            message: '保存失败',
            type: 'error'
          })
        }
      });
    },
    //保存模板
    saveMould(){
      var key=this.addParam.departmentName+'-'+this.addParam.userName;
      //清空不需要存入模板的内容
      // this.addParam.startPlanTime='';
      // this.addParam.backPlanTime='';
      // this.addParam.remark='';
      // this.addParam.driverId='';
      // this.addParam.driverName='';
      // this.addParam.driverPhone='';
      // this.addParam.vehicleId='';
      // this.addParam.plateNumber='';
      // this.addParam.departureTime='';
      var type=0;//公务用车
      setTemplate(type,key,this.addParam).then(response => {
        if(response.data.code==0){
          this.$message({
            message: '保存模板成功',
            type: 'success'
          });
          this.getTemplateList();
        }else{
          this.$message({
            message: '保存模板失败',
            type: 'error'
          })
        }
      });
    },
    //通过key获取页面数据缓存
    getFormData(key){
      this.$confirm('是否加载上一次未提交的数据?', '提示', {
          confirmButtonText: '加载',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getQuickDispatchCache(key).then(response => {
            if(response.data.datas){
              this.addParam=response.data.datas;
            }
          });
        }).catch(() => {
          this.clear();
        });
    },
    clear(){
      this.checkTemplate='';
      this.showPrintDetail=false;
      this.addParam = {
          applyNum:'',
          applicantId: getNewToken("ApplicationId"),
          applicantName: getNewToken("DisplayName"),
          departmentId: getNewToken("DepartmentId"),
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
          plateNumber:"",
          departureTime:""
        }
  },
    submitForm() {
      // if(this.btnStatus =='create'){
      //   this.showPrintDetail=false;
      //   this.btnStatus='submit';
      //   this.clear();
      //   return;
      // }
      if(this.postForm.comment_disabled){
        this.addParam.carProperty='1';
      }else{
        this.addParam.carProperty='0';
      }
      quickDispatch(this.addParam).then(response => {
        if(response.data.code==0){
          this.$message({
            message: '提交成功',
            type: 'success'
          });
          this.addParam.applyNum=response.data.datas.applyNum;
          this.showPrintDetail=true;
          // this.btnStatus='create';
           this.checkTemplate='';
          if(this.postForm.comment_disabled){
            removeNewToken("CookieKey_Emergency");
          }else{
            removeNewToken("CookieKey_Business");
          }
        }else{
          this.$message({
            message: '提交失败',
            type: 'error'
          })
        }
      });
    },
    printForm() {
      if(!this.showPrintDetail){
        this.$message({
          message: '请先提交申请',
          type: 'error'
        })
      }else if(!this.postForm.comment_disabled){
        this.$print(this.$refs.printBusiness);
      }else if(this.postForm.comment_disabled){
        this.$print(this.$refs.printEmergency);
      }
    },
    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
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
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 20px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
  .el-checkbox{
    margin-right: 10px !important;
  }
  .printTable{
    border-collapse:collapse;
  }
  .printTable tr td{
    border: 1px solid black;
    height: 35px;
  }
</style>
