<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>

    <breadcrumb class="breadcrumb-container"/>
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item"/>

        <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip>

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip>

        <!-- <lang-select class="international right-menu-item"/> -->

        <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
          <theme-picker class="theme-switch right-menu-item"/>
        </el-tooltip>
      </template>
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <a target="_blank" @click="editPassword()">
            <el-dropdown-item>
              {{ $t('navbar.github') }}
            </el-dropdown-item>
          </a>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div class="app-container">
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" >
          <el-form :model="editParam" label-position="left" label-width="100px" style=" margin-left:50px;">
            <el-row>
              <el-col :span="12">
                <el-form-item :label="$t('userAndCarTable.userId')">
                  <el-input v-model="userAccount" style="width: 205px;" :readonly="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('userAndCarTable.password')" >
                  <el-input type="password" v-model="editParam.oldPasswordData" style="width: 205px;"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item :label="$t('userAndCarTable.newPassword')">
                  <el-input type="password" v-model="editParam.newPasswordData" style="width: 205px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('userAndCarTable.confirmPassword')">
                  <el-input type="password" v-model="confirmPassword" style="width: 205px;"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">{{ $t('userAndCarTable.cancel') }}</el-button>
            <el-button v-if="dialogStatus==='edit'" type="primary" @click="changePassword()">{{ $t('userAndCarTable.save') }}</el-button>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
          <el-table border fit highlight-current-row style="width: 100%">
            <el-table-column prop="key" label="Channel"/>
            <el-table-column prop="pv" label="Pv"/>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
          </span>
        </el-dialog>
      </div>

    </div>
    <div class="right-menu" style="margin-right: 30px;">
      欢迎您，<span style="color: #409EFF;">{{displayName}}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import { changePassword } from '@/api/login'
import { setNewToken,getNewToken} from '@/utils/auth'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogVisible: false,
      dialogStatus: '',
      textMap: {
        edit: '修改密码'
      },
      dialogPvVisible: false,
      userAccount: getNewToken("Account"),
      editParam: {
        userId: getNewToken("ApplicationId"),
        oldPasswordData: '',
        newPasswordData: ''
      },
      confirmPassword:'',
      displayName:getNewToken("DisplayName"),
      showWarning:false,
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    editPassword() {
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
    },
    changePassword() {
      if(this.editParam.newPasswordData=='' || this.editParam.oldPasswordData==''){
        this.$message({
            message: '密码不能为空',
            type: 'error'
        })
        return;
      }
      if(this.editParam.newPasswordData !=this.confirmPassword ){
        this.$message({
            message: '两次输入的新密码不一致',
            type: 'error'
        })
        return;
      }
      changePassword(this.editParam).then(response => {
        if (response.data.code == 0) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.dialogFormVisible = false
        } else {
          this.$message({
            message: '修改失败',
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
