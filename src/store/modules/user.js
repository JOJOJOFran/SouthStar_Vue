import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken,setNewToken,getNewToken,removeNewToken,setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'


const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    account:'',
    pwd:''
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_Account: (state, account) => {
      state.account = account
    },
    SET_Pwd: (state, pwd) => {
      state.pwd = pwd
    }
  },
  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, password).then(response => {
          const data = response.data.datas;
          if(data){
            setNewToken("UserInfo",JSON.stringify(data));
            setNewToken("Account",username);
            setNewToken("Pwd",password);
            setNewToken("DisplayName",data.name);
            setNewToken("ApplicationId",data.id);
            setNewToken("Phone",data.phone);
            setNewToken("RoleName",data.roles[0]);
            setNewToken("DepartmentId",data.departmentId);
            commit('SET_TOKEN', data.token)
            setToken(data.token)
            resetRouter()
            // dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
            resolve(response.data)
          }else{
            resolve(response.data)
          }
          
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
     // return new Promise() user.state;
       return new Promise((resolve, reject) => {
        var userInfoStr = getNewToken("UserInfo")
        if (userInfoStr !== undefined) {
          var data = JSON.parse(userInfoStr)
          commit('SET_NAME', data.name)
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
          commit('SET_INTRODUCTION','admin')
          resolve(data)
        }else{
          commit('SET_NAME','')
        }
        // const username = getNewToken("Account")
        // const password = getNewToken("Pwd")
        // loginByUsername(username, password).then(response => {
        //   if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
        //     reject('error')
        //   }
        //   const data = response.data.datas;

        //   if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
        //     commit('SET_ROLES', data.roles)
        //   } else {
        //     reject('getInfo: roles must be a non-null array !')
        //   }
        //   commit('SET_NAME', data.name)
        //   commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        //   commit('SET_INTRODUCTION','admin')
        //    resolve(data)
        //  }).catch(error => {
        //    reject(error)
        //  })
       })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeNewToken("RoleName")
          removeToken()
          resetRouter()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user



//
// import { loginByUsername, logout, getUserInfo } from '@/api/login'
// import { getToken, setToken, removeToken } from '@/utils/auth'
//
// const user = {
//   state: {
//     user: '',
//     status: '',
//     code: '',
//     token: getToken(),
//     name: '',
//     avatar: '',
//     introduction: '',
//     roles: [],
//     setting: {
//       articlePlatform: []
//     }
//   },
//
//   mutations: {
//     SET_CODE: (state, code) => {
//       state.code = code
//     },
//     SET_TOKEN: (state, token) => {
//       state.token = token
//     },
//     SET_INTRODUCTION: (state, introduction) => {
//       state.introduction = introduction
//     },
//     SET_SETTING: (state, setting) => {
//       state.setting = setting
//     },
//     SET_STATUS: (state, status) => {
//       state.status = status
//     },
//     SET_NAME: (state, name) => {
//       state.name = name
//     },
//     SET_AVATAR: (state, avatar) => {
//       state.avatar = avatar
//     },
//     SET_ROLES: (state, roles) => {
//       state.roles = roles
//     }
//   },
//
//   actions: {
//     // 用户名登录
//     LoginByUsername({ commit }, userInfo) {
//       const username = userInfo.username.trim()
//       return new Promise((resolve, reject) => {
//         loginByUsername(username, userInfo.password).then(response => {
//           const data = response.data
//           commit('SET_TOKEN', data.token)
//           setToken(response.data.token)
//           resolve()
//         }).catch(error => {
//           reject(error)
//         })
//       })
//     },
//
//     // 获取用户信息
//     GetUserInfo({ commit, state }) {
//       return new Promise((resolve, reject) => {
//         getUserInfo(state.token).then(response => {
//           if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
//             reject('error')
//           }
//           const data = response.data
//
//           if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
//             commit('SET_ROLES', data.roles)
//           } else {
//             reject('getInfo: roles must be a non-null array !')
//           }
//
//           commit('SET_NAME', data.name)
//           commit('SET_AVATAR', data.avatar)
//           commit('SET_INTRODUCTION', data.introduction)
//           resolve(response)
//         }).catch(error => {
//           reject(error)
//         })
//       })
//     },
//
//     // 第三方验证登录
//     // LoginByThirdparty({ commit, state }, code) {
//     //   return new Promise((resolve, reject) => {
//     //     commit('SET_CODE', code)
//     //     loginByThirdparty(state.status, state.email, state.code).then(response => {
//     //       commit('SET_TOKEN', response.data.token)
//     //       setToken(response.data.token)
//     //       resolve()
//     //     }).catch(error => {
//     //       reject(error)
//     //     })
//     //   })
//     // },
//
//     // 登出
//     LogOut({ commit, state }) {
//       return new Promise((resolve, reject) => {
//         logout(state.token).then(() => {
//           commit('SET_TOKEN', '')
//           commit('SET_ROLES', [])
//           removeToken()
//           resolve()
//         }).catch(error => {
//           reject(error)
//         })
//       })
//     },
//
//     // 前端 登出
//     FedLogOut({ commit }) {
//       return new Promise(resolve => {
//         commit('SET_TOKEN', '')
//         removeToken()
//         resolve()
//       })
//     },
//
//     // 动态修改权限
//     ChangeRoles({ commit, dispatch }, role) {
//       return new Promise(resolve => {
//         commit('SET_TOKEN', role)
//         setToken(role)
//         getUserInfo(role).then(response => {
//           const data = response.data
//           commit('SET_ROLES', data.roles)
//           commit('SET_NAME', data.name)
//           commit('SET_AVATAR', data.avatar)
//           commit('SET_INTRODUCTION', data.introduction)
//           dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
//           resolve()
//         })
//       })
//     }
//   }
// }
//
// export default user

