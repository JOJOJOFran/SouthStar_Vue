import Vue from 'vue'
import Router from 'vue-router'
import { getNewToken } from '@/utils/auth'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/

export const constantRouterMap = getMenuByUserRole()

export function getMenuByUserRole() {
  var role = getNewToken("RoleName")
  debugger
  var menus = [
    {
      path: '/redirect',
      component: Layout,
      hidden: true,
      children: [
        {
          path: '/redirect/:path*',
          component: () => import('@/views/redirect/index')
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/login/index'),
      hidden: true
    },
    {
      path: '/auth-redirect',
      component: () => import('@/views/login/authredirect'),
      hidden: true
    },
    {
      path: '/404',
      component: () => import('@/views/errorPage/404'),
      hidden: true
    },
    {
      path: '/401',
      component: () => import('@/views/errorPage/401'),
      hidden: true
    }
  ]
  if(role !== undefined){
    if(role === 'admin'){
      menus = [
        {
          path: '/redirect',
          component: Layout,
          hidden: true,
          children: [
            {
              path: '/redirect/:path*',
              component: () => import('@/views/redirect/index')
            }
          ]
        },
        {
          path: '/login',
          component: () => import('@/views/login/index'),
          hidden: true
        },
        {
          path: '/auth-redirect',
          component: () => import('@/views/login/authredirect'),
          hidden: true
        },
        {
          path: '/404',
          component: () => import('@/views/errorPage/404'),
          hidden: true
        },
        {
          path: '/401',
          component: () => import('@/views/errorPage/401'),
          hidden: true
        },
        {
          path: '',
          component: Layout,
          redirect: 'dashboard',
          children: [
            {
              path: 'dashboard',
              component: () => import('@/views/dashboard/index'),
              name: 'Dashboard',
              meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
            },
            //  {
            //    path: 'dashboard',
            //    component: () => import('@/views/useCarManagement/quickDispatch'),
            //    name: 'Dashboard',
            //    meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
            //  },  
      
          ]
        },
        {
          path: '/useCarManagement',
          component: Layout,
          redirect: '/useCarManagement/index',
          meta: {
            title: 'useCarManagement',
            icon: 'useCarManagement',
            noCache: true
          },
          children: [
            // {
            //   path: 'quickDispatch',
            //   component: () => import('@/views/useCarManagement/quickDispatch'),
            //   name: 'quickDispatch',
            //   meta: { title: 'quickDispatch' }
            // },
            {
              path: 'quickDispatchForBusiness',
              component: () => import('@/views/useCarManagement/quickDispatchForBusiness'),
              name: 'quickDispatch',
              meta: { title: 'quickDispatchForBusiness' }
            },
            {
              path: 'quickDispatchForEmergency',
              component: () => import('@/views/useCarManagement/quickDispatchForEmergency'),
              name: 'quickDispatchForEmergency',
              meta: { title: 'quickDispatchForEmergency' }
            },
            {
              path: 'carApply',
              component: () => import('@/views/useCarManagement/carApply'),
              name: 'carApply',
              meta: { title: 'carApply' }
            },
            {
              path: 'carApproval',
              component: () => import('@/views/useCarManagement/carApproval'),
              name: 'carApproval',
              meta: { title: 'carApproval' }
            },
            {
              path: 'carDispatch',
              component: () => import('@/views/useCarManagement/carDispatch'),
              name: 'carDispatch',
              meta: { title: 'carDispatch' }
            },
            {
              path: 'takeOrder',
              component: () => import('@/views/useCarManagement/takeOrder'),
              name: 'takeOrder',
              meta: { title: 'takeOrder' }
            }
          ]
        },
        // {
        //   path: '/dispatchManagement',
        //   component: Layout,
        //   redirect: '/dispatchManagement/index',
        //   meta: {
        //     title: 'dispatchManagement',
        //     icon: 'dispatchManagement',
        //     noCache: true
        //   },
        //   children: [
        //     {
        //       path: 'dispatchCar',
        //       component: () => import('@/views/dispatchManagement/dispatchCar'),
        //       name: 'dispatchCar',
        //       meta: { title: 'dispatchCar' }
        //     },
        //     {
        //       path: 'dispatchDriver',
        //       component: () => import('@/views/dispatchManagement/dispatchDriver'),
        //       name: 'dispatchDriver',
        //       meta: { title: 'dispatchDriver' }
        //     },
        //     {
        //       path: 'dispatchAlignment',
        //       component: () => import('@/views/dispatchManagement/dispatchAlignment'),
        //       name: 'dispatchAlignment',
        //       meta: { title: 'dispatchAlignment' }
        //     }
        //   ]
        // },
        {
          path: '/monitorManagement',
          component: Layout,
          redirect: '/monitorManagement/index',
          meta: {
            title: 'monitorManagement',
            icon: 'monitorManagement',
            noCache: true
          },
          children: [
            {
              path: 'monitorLocation',
              component: () => import('@/views/monitorManagement/monitorLocation'),
              name: 'monitorLocation',
              meta: { title: 'monitorLocation' }
            },
            {
              path: 'monitorFence',
              component: () => import('@/views/monitorManagement/monitorFence'),
              name: 'monitorFence',
              meta: { title: 'monitorFence' }
            }
          ]
        },
        // {
        //   path: '/securityManagement',
        //   component: Layout,
        //   redirect: '/securityManagement/index',
        //   meta: {
        //     title: 'securityManagement',
        //     icon: 'securityManagement',
        //     noCache: true
        //   },
        //   children: [
        //     {
        //       path: 'vehicleAccident',
        //       component: () => import('@/views/securityManagement/vehicleAccident'),
        //       name: 'vehicleAccident',
        //       meta: { title: 'vehicleAccident' }
        //     },
        //     {
        //       path: 'vehicleViolation',
        //       component: () => import('@/views/securityManagement/vehicleViolation'),
        //       name: 'vehicleViolation',
        //       meta: { title: 'vehicleViolation' }
        //     }
        //   ]
        // },
        {
          path: '/vehicleManagement',
          component: Layout,
          redirect: '/vehicleManagement/index',
          meta: {
            title: 'vehicleManagement',
            icon: 'vehicleManagement',
            noCache: true
          },
          children: [
            {
              path: 'checkRemind',
              component: () => import('@/views/vehicleManagement/checkRemind'),
              name: 'checkRemind',
              meta: { title: 'checkRemind' }
            },
            {
              path: 'insuranceRemind',
              component: () => import('@/views/vehicleManagement/insuranceRemind'),
              name: 'insuranceRemind',
              meta: { title: 'insuranceRemind' }
            },
            // {
            //   path: 'maintenanceRemind',
            //   component: () => import('@/views/vehicleManagement/maintenanceRemind'),
            //   name: 'maintenanceRemind',
            //   meta: { title: 'maintenanceRemind' }
            // },
            {
              path: 'maintenanceManage',
              component: () => import('@/views/vehicleManagement/maintenanceManage'),
              name: 'maintenanceManage',
              meta: { title: 'maintenanceManage' }
            },
            {
              path: 'oilDetail',
              component: () => import('@/views/vehicleManagement/oilDetail'),
              name: 'oilDetail',
              meta: { title: 'oilDetail' }
            }
          ]
        },
        {
          path: '/statisticalManagement',
          component: Layout,
          redirect: '/statisticalManagement/index',
          meta: {
            title: 'statisticalManagement',
            icon: 'statisticalManagement',
            noCache: true
          },
          children: [
            // {
            //   path: 'useCarStatistical',
            //   component: () => import('@/views/statisticalManagement/useCarStatistical'),
            //   name: 'useCarStatistical',
            //   meta: { title: 'useCarStatistical' }
            // },
            {
              path: 'reportAnalysis',
              component: () => import('@/views/statisticalManagement/reportAnalysis'),
              name: 'reportAnalysis',
              meta: { title: 'reportAnalysis' }
            }
            // {
            //   path: 'oilDetail',
            //   component: () => import('@/views/statisticalManagement/oilDetail'),
            //   name: 'oilDetail',
            //   meta: { title: 'oilDetail' }
            // }
          ]
        },
        {
          path: '/carAndUserManage',
          component: Layout,
          redirect: '/carAndUserManage/index',
          meta: {
            title: 'carAndUserManage',
            icon: 'carAndUserManage',
            noCache: true
          },
          children: [
            {
              path: 'carIndex',
              component: () => import('@/views/carAndUserManage/carIndex'),
              name: 'carIndex',
              meta: { title: 'carIndex' }
            },
            {
              path: 'driverIndex',
              component: () => import('@/views/carAndUserManage/driverIndex'),
              name: 'driverIndex',
              meta: { title: 'driverIndex' }
            },
            {
              path: 'userIndex',
              component: () => import('@/views/carAndUserManage/userIndex'),
              name: 'userIndex',
              meta: { title: 'userIndex' }
            }
          ]
        },
        {
          path: '/formworkManagement',//模板管理
          component: Layout,
          redirect: '/formworkManagement/index',
          meta: {
            title: 'formworkManagement',
            icon: 'formworkManagement',
            noCache: true
          },
          children: [
            {
              path: 'tableFormwork',
              component: () => import('@/views/formworkManagement/tableFormwork'),
              name: 'tableFormwork',
              meta: { title: 'tableFormwork' }
            },
            {
              path: 'excelFormwork',
              component: () => import('@/views/formworkManagement/excelFormwork'),
              name: 'excelFormwork',
              meta: { title: 'excelFormwork' }  
            },
          ]
        },
        {
          path: '/uploadExcelData',//数据导入
          component: Layout,
          redirect: '/uploadExcelData/index',
          meta: {
            title: 'uploadExcelData',
            icon: 'uploadExcelData',
            noCache: true
          },
          children: [
            {
              path: 'uploadExcelData',
              component: () => import('@/views/uploadExcelData/uploadExcelData'),
              name: 'uploadExcelData',
              meta: { title: 'uploadExcelData' }
            },
          ]
        }
        // {
        //   path: '/test',//测试同步页面
        //   component: Layout,
        //   redirect: '/test/index',
        //   meta: {
        //     title: '数据同步',
        //     icon: 'uploadExcelData',
        //     noCache: true
        //   },
        //   children: [
        //     {
        //       path: 'index',
        //       component: () => import('@/views/test/index'),
        //       name: '数据同步',
        //       meta: { title: '数据同步' }
        //     },
        //   ]
        // }  
      ]
    }
    else if(role === 'user')
    {
      menus =  [
        {
          path: '/redirect',
          component: Layout,
          hidden: true,
          children: [
            {
              path: '/redirect/:path*',
              component: () => import('@/views/redirect/index')
            }
          ]
        },
        {
          path: '/login',
          component: () => import('@/views/login/index'),
          hidden: true
        },
        {
          path: '/auth-redirect',
          component: () => import('@/views/login/authredirect'),
          hidden: true
        },
        {
          path: '/404',
          component: () => import('@/views/errorPage/404'),
          hidden: true
        },
        {
          path: '/401',
          component: () => import('@/views/errorPage/401'),
          hidden: true
        },
        {
          path: '',
          component: Layout,
          redirect: 'dashboard',
          children: [
            {
              path: 'dashboard',
              component: () => import('@/views/dashboard/index'),
              name: 'Dashboard',
              meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
            },
          ]
        },
        {
          path: '/useCarManagement',
          component: Layout,
          redirect: '/useCarManagement/index',
          meta: {
            title: 'useCarManagement',
            icon: 'useCarManagement',
            noCache: true
          },
          children: [
            {
              path: 'quickDispatchForBusiness',
              component: () => import('@/views/useCarManagement/quickDispatchForBusiness'),
              name: 'quickDispatch',
              meta: { title: 'quickDispatchForBusiness' }
            },
            {
              path: 'quickDispatchForEmergency',
              component: () => import('@/views/useCarManagement/quickDispatchForEmergency'),
              name: 'quickDispatchForEmergency',
              meta: { title: 'quickDispatchForEmergency' }
            },
            {
              path: 'carApply',
              component: () => import('@/views/useCarManagement/carApply'),
              name: 'carApply',
              meta: { title: 'carApply' }
            },
            {
              path: 'carApproval',
              component: () => import('@/views/useCarManagement/carApproval'),
              name: 'carApproval',
              meta: { title: 'carApproval' }
            },
            {
              path: 'carDispatch',
              component: () => import('@/views/useCarManagement/carDispatch'),
              name: 'carDispatch',
              meta: { title: 'carDispatch' }
            },
            {
              path: 'takeOrder',
              component: () => import('@/views/useCarManagement/takeOrder'),
              name: 'takeOrder',
              meta: { title: 'takeOrder' }
            }
          ]
        }
      ]
    }
  }
  return menus
}


export const constantRouterAdminMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      },
      //  {
      //    path: 'dashboard',
      //    component: () => import('@/views/useCarManagement/quickDispatch'),
      //    name: 'Dashboard',
      //    meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      //  },  

    ]
  },
  {
    path: '/useCarManagement',
    component: Layout,
    redirect: '/useCarManagement/index',
    meta: {
      title: 'useCarManagement',
      icon: 'useCarManagement',
      noCache: true
    },
    children: [
      // {
      //   path: 'quickDispatch',
      //   component: () => import('@/views/useCarManagement/quickDispatch'),
      //   name: 'quickDispatch',
      //   meta: { title: 'quickDispatch' }
      // },
      {
        path: 'quickDispatchForBusiness',
        component: () => import('@/views/useCarManagement/quickDispatchForBusiness'),
        name: 'quickDispatch',
        meta: { title: 'quickDispatchForBusiness' }
      },
      {
        path: 'quickDispatchForEmergency',
        component: () => import('@/views/useCarManagement/quickDispatchForEmergency'),
        name: 'quickDispatchForEmergency',
        meta: { title: 'quickDispatchForEmergency' }
      },
      {
        path: 'carApply',
        component: () => import('@/views/useCarManagement/carApply'),
        name: 'carApply',
        meta: { title: 'carApply' }
      },
      {
        path: 'carApproval',
        component: () => import('@/views/useCarManagement/carApproval'),
        name: 'carApproval',
        meta: { title: 'carApproval' }
      },
      {
        path: 'carDispatch',
        component: () => import('@/views/useCarManagement/carDispatch'),
        name: 'carDispatch',
        meta: { title: 'carDispatch' }
      },
      {
        path: 'takeOrder',
        component: () => import('@/views/useCarManagement/takeOrder'),
        name: 'takeOrder',
        meta: { title: 'takeOrder' }
      }
    ]
  },
  // {
  //   path: '/dispatchManagement',
  //   component: Layout,
  //   redirect: '/dispatchManagement/index',
  //   meta: {
  //     title: 'dispatchManagement',
  //     icon: 'dispatchManagement',
  //     noCache: true
  //   },
  //   children: [
  //     {
  //       path: 'dispatchCar',
  //       component: () => import('@/views/dispatchManagement/dispatchCar'),
  //       name: 'dispatchCar',
  //       meta: { title: 'dispatchCar' }
  //     },
  //     {
  //       path: 'dispatchDriver',
  //       component: () => import('@/views/dispatchManagement/dispatchDriver'),
  //       name: 'dispatchDriver',
  //       meta: { title: 'dispatchDriver' }
  //     },
  //     {
  //       path: 'dispatchAlignment',
  //       component: () => import('@/views/dispatchManagement/dispatchAlignment'),
  //       name: 'dispatchAlignment',
  //       meta: { title: 'dispatchAlignment' }
  //     }
  //   ]
  // },
  {
    path: '/monitorManagement',
    component: Layout,
    redirect: '/monitorManagement/index',
    meta: {
      title: 'monitorManagement',
      icon: 'monitorManagement',
      noCache: true
    },
    children: [
      {
        path: 'monitorLocation',
        component: () => import('@/views/monitorManagement/monitorLocation'),
        name: 'monitorLocation',
        meta: { title: 'monitorLocation' }
      },
      {
        path: 'monitorFence',
        component: () => import('@/views/monitorManagement/monitorFence'),
        name: 'monitorFence',
        meta: { title: 'monitorFence' }
      }
    ]
  },
  // {
  //   path: '/securityManagement',
  //   component: Layout,
  //   redirect: '/securityManagement/index',
  //   meta: {
  //     title: 'securityManagement',
  //     icon: 'securityManagement',
  //     noCache: true
  //   },
  //   children: [
  //     {
  //       path: 'vehicleAccident',
  //       component: () => import('@/views/securityManagement/vehicleAccident'),
  //       name: 'vehicleAccident',
  //       meta: { title: 'vehicleAccident' }
  //     },
  //     {
  //       path: 'vehicleViolation',
  //       component: () => import('@/views/securityManagement/vehicleViolation'),
  //       name: 'vehicleViolation',
  //       meta: { title: 'vehicleViolation' }
  //     }
  //   ]
  // },
  {
    path: '/vehicleManagement',
    component: Layout,
    redirect: '/vehicleManagement/index',
    meta: {
      title: 'vehicleManagement',
      icon: 'vehicleManagement',
      noCache: true
    },
    children: [
      {
        path: 'checkRemind',
        component: () => import('@/views/vehicleManagement/checkRemind'),
        name: 'checkRemind',
        meta: { title: 'checkRemind' }
      },
      {
        path: 'insuranceRemind',
        component: () => import('@/views/vehicleManagement/insuranceRemind'),
        name: 'insuranceRemind',
        meta: { title: 'insuranceRemind' }
      },
      // {
      //   path: 'maintenanceRemind',
      //   component: () => import('@/views/vehicleManagement/maintenanceRemind'),
      //   name: 'maintenanceRemind',
      //   meta: { title: 'maintenanceRemind' }
      // },
      {
        path: 'maintenanceManage',
        component: () => import('@/views/vehicleManagement/maintenanceManage'),
        name: 'maintenanceManage',
        meta: { title: 'maintenanceManage' }
      },
      {
        path: 'oilDetail',
        component: () => import('@/views/vehicleManagement/oilDetail'),
        name: 'oilDetail',
        meta: { title: 'oilDetail' }
      }
    ]
  },
  {
    path: '/statisticalManagement',
    component: Layout,
    redirect: '/statisticalManagement/index',
    meta: {
      title: 'statisticalManagement',
      icon: 'statisticalManagement',
      noCache: true
    },
    children: [
      // {
      //   path: 'useCarStatistical',
      //   component: () => import('@/views/statisticalManagement/useCarStatistical'),
      //   name: 'useCarStatistical',
      //   meta: { title: 'useCarStatistical' }
      // },
      {
        path: 'reportAnalysis',
        component: () => import('@/views/statisticalManagement/reportAnalysis'),
        name: 'reportAnalysis',
        meta: { title: 'reportAnalysis' }
      }
      // {
      //   path: 'oilDetail',
      //   component: () => import('@/views/statisticalManagement/oilDetail'),
      //   name: 'oilDetail',
      //   meta: { title: 'oilDetail' }
      // }
    ]
  },
  {
    path: '/carAndUserManage',
    component: Layout,
    redirect: '/carAndUserManage/index',
    meta: {
      title: 'carAndUserManage',
      icon: 'carAndUserManage',
      noCache: true
    },
    children: [
      {
        path: 'carIndex',
        component: () => import('@/views/carAndUserManage/carIndex'),
        name: 'carIndex',
        meta: { title: 'carIndex' }
      },
      {
        path: 'driverIndex',
        component: () => import('@/views/carAndUserManage/driverIndex'),
        name: 'driverIndex',
        meta: { title: 'driverIndex' }
      },
      {
        path: 'userIndex',
        component: () => import('@/views/carAndUserManage/userIndex'),
        name: 'userIndex',
        meta: { title: 'userIndex' }
      }
    ]
  },
  {
    path: '/formworkManagement',//模板管理
    component: Layout,
    redirect: '/formworkManagement/index',
    meta: {
      title: 'formworkManagement',
      icon: 'formworkManagement',
      noCache: true
    },
    children: [
      {
        path: 'tableFormwork',
        component: () => import('@/views/formworkManagement/tableFormwork'),
        name: 'tableFormwork',
        meta: { title: 'tableFormwork' }
      },
      {
        path: 'excelFormwork',
        component: () => import('@/views/formworkManagement/excelFormwork'),
        name: 'excelFormwork',
        meta: { title: 'excelFormwork' }
      },
    ]
  },
  {
    path: '/uploadExcelData',//数据导入
    component: Layout,
    redirect: '/uploadExcelData/index',
    meta: {
      title: 'uploadExcelData',
      icon: 'uploadExcelData',
      noCache: true
    },
    children: [
      {
        path: 'uploadExcelData',
        component: () => import('@/views/uploadExcelData/uploadExcelData'),
        name: 'uploadExcelData',
        meta: { title: 'uploadExcelData' }
      },
    ]
  },
  {
    path: '/test',//测试同步页面
    component: Layout,
    redirect: '/test/index',
    meta: {
      title: '数据同步',
      icon: 'uploadExcelData',
      noCache: true
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/test/index'),
        name: '数据同步',
        meta: { title: '数据同步' }
      },
    ]
  }
  
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // }
]

export const constantRouterUserMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      },
    ]
  },
  {
    path: '/useCarManagement',
    component: Layout,
    redirect: '/useCarManagement/index',
    meta: {
      title: 'useCarManagement',
      icon: 'useCarManagement',
      noCache: true
    },
    children: [
      {
        path: 'quickDispatchForBusiness',
        component: () => import('@/views/useCarManagement/quickDispatchForBusiness'),
        name: 'quickDispatch',
        meta: { title: 'quickDispatchForBusiness' }
      },
      {
        path: 'quickDispatchForEmergency',
        component: () => import('@/views/useCarManagement/quickDispatchForEmergency'),
        name: 'quickDispatchForEmergency',
        meta: { title: 'quickDispatchForEmergency' }
      },
      {
        path: 'carApply',
        component: () => import('@/views/useCarManagement/carApply'),
        name: 'carApply',
        meta: { title: 'carApply' }
      },
      {
        path: 'carApproval',
        component: () => import('@/views/useCarManagement/carApproval'),
        name: 'carApproval',
        meta: { title: 'carApproval' }
      },
      {
        path: 'carDispatch',
        component: () => import('@/views/useCarManagement/carDispatch'),
        name: 'carDispatch',
        meta: { title: 'carDispatch' }
      },
      {
        path: 'takeOrder',
        component: () => import('@/views/useCarManagement/takeOrder'),
        name: 'takeOrder',
        meta: { title: 'takeOrder' }
      }
    ]
  }
]

// export default new Router({
//   // mode: 'history', // require service support
//   scrollBehavior: () => ({ y: 0 }),
//   routes: constantRouterMap
// })

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export const asyncRouterMap = [
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/index',
  //   alwaysShow: true, // will always show the root menu
  //   meta: {
  //     title: 'permission',
  //     icon: 'lock',
  //     roles: ['admin'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'pagePermission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'directivePermission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/useCarManagement',
  //   component: Layout,
  //   redirect: '/useCarManagement/index',
  //   meta: {
  //     title: 'useCarManagement',
  //     icon: 'useCarManagement',
  //     roles: ['admin'],
  //     noCache: true
  //   },
  //   children: [
  //     {
  //       path: 'quickDispatch',
  //       component: () => import('@/views/useCarManagement/quickDispatch'),
  //       name: 'quickDispatch',
  //       meta: { title: 'quickDispatch'}
  //     },
  //     {
  //       path: 'carApply',
  //       component: () => import('@/views/useCarManagement/carApply'),
  //       name: 'carApply',
  //       meta: { title: 'carApply'}
  //     },
  //     {
  //       path: 'carApproval',
  //       component: () => import('@/views/useCarManagement/carApproval'),
  //       name: 'carApproval',
  //       meta: { title: 'carApproval' }
  //     },
  //     {
  //       path: 'carDispatch',
  //       component: () => import('@/views/useCarManagement/carDispatch'),
  //       name: 'carDispatch',
  //       meta: { title: 'carDispatch' }
  //     } ,
  //     {
  //       path: 'takeOrder',
  //       component: () => import('@/views/useCarManagement/takeOrder'),
  //       name: 'takeOrder',
  //       meta: { title: 'takeOrder' }
  //     }
  //   ]
  // },
  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/svg-icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },
  //
  // /** When your routing table is too long, you can split it into small modules**/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,
  //
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'example',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'createArticle', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'editArticle', noCache: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'articleList', icon: 'list' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'tab', icon: 'tab' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'errorPages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/errorPage/401'),
  //       name: 'Page401',
  //       meta: { title: 'page401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/errorPage/404'),
  //       name: 'Page404',
  //       meta: { title: 'page404', noCache: true }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/error-log',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/errorLog/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'errorLog', icon: 'bug' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/exportExcel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'exportExcel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/selectExcel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'selectExcel' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/uploadExcel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'uploadExcel' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   meta: { title: 'zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'exportZip' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/theme',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'theme', icon: 'theme' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'clipboardDemo', icon: 'clipboard' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/i18n',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/i18n-demo/index'),
  //       name: 'I18n',
  //       meta: { title: 'i18n', icon: 'international' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'externalLink', icon: 'link' }
  //     }
  //   ]
  // },

  // { path: '*', redirect: '/404', hidden: true }
]

export default router
