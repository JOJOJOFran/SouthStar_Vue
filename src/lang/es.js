export default {
  route: {
    dashboard: '首页',

    quickDispatch: '快速派车单',
    useCarManagement: '用车管理',
    carApply: '用车申请',
    carApproval: '用车审批管理',
    carDispatch: '调度管理',
    takeOrder: '派单管理',

    dispatchManagement: '调度管理',
    dispatchCar: '可调度车辆',
    dispatchDriver: '可调度司机',
    dispatchAlignment: '派车队列',

    monitorManagement: '实时监控',
    monitorLocation: '实时位置监控',
    monitorFence: '电子围栏管理',

    securityManagement: '安全管理',
    vehicleAccident: '车辆事故查询',
    vehicleViolation: '车辆违章查询',

    vehicleManagement: '车务管理',
    checkRemind: '年检提醒',
    insuranceRemind: '保险管理',
    maintenanceRemind: '保养提醒',
    maintenanceManage: '维修记录',

    statisticalManagement: '统计分析',
    useCarStatistical: '用车统计',
    reportAnalysis: '报表分析',

    carAndUserManage: '后台管理',
    carIndex: '车辆管理',
    driverIndex: '驾驶员管理',
    userIndex: '用户管理',

    introduction: '简述',
    documentation: '文档',
    guide: '引导页',
    permission: '权限测试页',
    pagePermission: '页面权限',
    directivePermission: '指令权限',
    icons: '图标',
    components: '组件',
    componentIndex: '介绍',
    tinymce: '富文本编辑器',
    markdown: 'Markdown',
    jsonEditor: 'JSON编辑器',
    dndList: '列表拖拽',
    splitPane: 'Splitpane',
    avatarUpload: '头像上传',
    dropzone: 'Dropzone',
    sticky: 'Sticky',
    countTo: 'CountTo',
    componentMixin: '小组件',
    backToTop: '返回顶部',
    dragDialog: '拖拽 Dialog',
    dragSelect: '拖拽 Select',
    dragKanban: '可拖拽看板',
    charts: '图表',
    keyboardChart: '键盘图表',
    lineChart: '折线图',
    mixChart: '混合图表',
    example: '综合实例',
    nested: '路由嵌套',
    menu1: '菜单1',
    'menu1-1': '菜单1-1',
    'menu1-2': '菜单1-2',
    'menu1-2-1': '菜单1-2-1',
    'menu1-2-2': '菜单1-2-2',
    'menu1-3': '菜单1-3',
    menu2: '菜单2',
    Table: 'Table',
    dynamicTable: '动态Table',
    dragTable: '拖拽Table',
    inlineEditTable: 'Table内编辑',
    complexTable: '用户查询列表',
    treeTable: '树形表格',
    customTreeTable: '自定义树表',
    tab: 'Tab',
    form: '表单',
    createArticle: '创建文章',
    editArticle: '编辑文章',
    articleList: '文章列表',
    errorPages: '错误页面',
    page401: '401',
    page404: '404',
    errorLog: '错误日志',
    excel: 'Excel',
    exportExcel: 'Export Excel',
    selectExcel: 'Export Selected',
    uploadExcel: 'Upload Excel',
    zip: 'Zip',
    exportZip: 'Export Zip',
    theme: '换肤',
    clipboardDemo: 'Clipboard',
    i18n: '国际化',
    externalLink: '外链'
  },
  navbar: {
    logOut: '退出登录',
    dashboard: '首页',
    github: '修改密码',
    screenfull: '全屏',
    theme: '换肤',
    size: '布局大小'
  },
  login: {
    title: '系统登录',
    logIn: '登录',
    username: '账号',
    password: '密码',
    any: '随便填',
    thirdparty: '第三方登录',
    thirdpartyTips: '本地不能模拟，请结合自己业务进行模拟！！！'
  },
  documentation: {
    documentation: '文档',
    github: 'Github 地址'
  },
  permission: {
    roles: '你的权限',
    switchRoles: '切换权限'
  },
  guide: {
    description: '引导页对于一些第一次进入项目的人很有用，你可以简单介绍下项目的功能。本 Demo 是基于',
    button: '打开引导'
  },
  components: {
    documentation: '文档',
    tinymceTips: '富文本是管理后台一个核心的功能，但同时又是一个有很多坑的地方。在选择富文本的过程中我也走了不少的弯路，市面上常见的富文本都基本用过了，最终权衡了一下选择了Tinymce。更详细的富文本比较和介绍见',
    dropzoneTips: '由于我司业务有特殊需求，而且要传七牛 所以没用第三方，选择了自己封装。代码非常的简单，具体代码你可以在这里看到 @/components/Dropzone',
    stickyTips: '当页面滚动到预设的位置会吸附在顶部',
    backToTopTips1: '页面滚动到指定位置会在右下角出现返回顶部按钮',
    backToTopTips2: '可自定义按钮的样式、show/hide、出现的高度、返回的位置 如需文字提示，可在外部使用Element的el-tooltip元素',
    imageUploadTips: '由于我在使用时它只有vue@1版本，而且和mockjs不兼容，所以自己改造了一下，如果大家要使用的话，优先还是使用官方版本。'
  },
  applyStatusOptions: [{ key: '', display_name: '全部' }, { key: '1', display_name: '待审核' }, { key: '2', display_name: '已审核' }, { key: '0', display_name: '草稿' }],
  approveStatusOptions: [{ key: '', display_name: '全部' }, { key: '0', display_name: '未审核' }, { key: '1', display_name: '通过' }, { key: '2', display_name: '驳回' }, { key: '3', display_name: '已派车' }],
  dispatchStatusOptions: [{ key: '', display_name: '全部' }, { key: '0', display_name: '未审核' }, { key: '1', display_name: '通过' }, { key: '2', display_name: '驳回' }],

  carStatusOptions: [{ key: '', display_name: '全部' }, { key: '1', display_name: '在线' }, { key: '2', display_name: '离线' }, { key: '3', display_name: '异常' }],
  useAreaOptions: [{ key: '县区内', display_name: '县区内' }, { key: '市内', display_name: '市内' }, { key: '市外', display_name: '市外' }, { key: '省外', display_name: '省外' }],
  carPropertyOptions: [{ key: '0', display_name: '公务用车组' }, { key: '1', display_name: '应急执法组' }],
  carTypeOptions: [{ key: '0', display_name: '轿车' }, { key: '1', display_name: '客车' }],
  oilTypeOptions: [{ key: 'GasOilne', display_name: '汽油' }, { key: 'DieselOil', display_name: '柴油' }],
  basicColorOptions: [{ key: 'red', display_name: '红色' }, { key: 'white', display_name: '白色' }, { key: 'black', display_name: '黑色' }, { key: 'green', display_name: '绿色' }],

  applyTable: {
    applyNum: '流程编号',
    applyStatus: '申请状态',
    beginTime: '开始时间',
    endTime: '结束时间',
    userName: '用车人',
    carType: '用车类型',
    useArea: '用车区域',
    userMobile: '电话',
    userDept: '用车单位',
    userCount: '乘车人数',
    startPlanTime: '出发时间',
    backPlanTime: '归队时间',
    startPoint: '出发地',
    destination: '目的地',
    carProperty: '用车性质',
    applyReason: '用车事由',
    applicantName: '申请人',
    applicantPhone: '电话',
    departmentName: '申请人单位',
    remark: '备注',
    status: '申请状态',
    checkStatus: '审核状态',
    detail: '详情',
    caozuo: '操作',
    cancel: '取消',
    draft: '存为草稿',
    confirm: '提交',
    approve: '审批',
    dispatchStatus: '调度状态',
    diaodu: '调度',
    auto: '自动调度',
    mileage: '里程(km)',
    expenses: '费用(元)',
    print: '打印',
    edit: '编辑',
    approvalContent: '审批意见',
    agree: '同意',
    reject: '拒绝',
    actions: '编辑',
    chooseCar: '选择车辆',
    chooseDriver: '选择司机',
    create: '新增'
  },

  userAndCarTable: {
    plateNumber: '车牌号',
    currentState: '当前状态',
    departmentName: '所属单位',
    vehicleBrand: '车辆品牌',
    vechileType: '车辆类型',
    approvedSeating: '核定座位数',
    vehicleProperties: '车辆性质',
    remark: '备注',
    delete: '删除',
    edit: '编辑',
    cancel: '取消',
    save: '保存',
    vehicleColor: '车辆颜色',
    vehicleBrand: '车辆品牌',
    vechileType: '车辆类型',
    approvedSeating: '核定座位',
    initMileage: '初始里程',
    tankCapacity: '油箱容积',
    purchasePrice: '购入价格',
    vin: '车架号',
    engineNo: '发动机号',
    vehicleLicOwner: '行驶证车主',
    bookOriginValue: '账面净值',
    terminalNo: 'GPS编号',
    vehicleProperties: '使用性质',
    faCardNum: '固定资产卡号',
    oilType: '油料类型',
    displacament: '排量',
    loadWeight: '载重质量',
    curbWeight: '整备质量',
    uploadImage: '上传图片',
    queryTrajectory: '轨迹查询',
    fastDispach: '快速派车',
    minLong: '最小距离(m)',
    driverName: '驾驶员姓名',
    drivingLicNum: '驾驶证号',
    sex: '性别',
    mobileNum: '手机号',
    permittedType: '准驾车型',
    expirationDate: '证件截止日期',
    driverAge: '年龄',
    address: '地址',
    firstDriveDate: '领证日期',
    drivingLicType: '驾驶证类型',
    driverStatus: '状态',
    userName: '用户姓名',
    userId: '用户账号',
    roleName: '用户角色',
    email: '邮箱',
    password: '密码',
    newPassword: '新密码',
    confirmPassword: '确认密码'
  },

  vehicleManageTable: {
    maintenanceFolio: '维修单号',
    plateNumber: '车牌号码',
    startTime: '开始时间',
    endTime: '结束时间',
    plateNum: '车牌号码',
    repairStartDate: '维修开始时间',
    repairEndDate: '维修结束时间',
    garage: '维修地点',
    repairFee: '维修费用',
    dealPerson: '经办人',
    remark: '备注',
    edit: '编辑',
    delete: '删除',
    vehicleType: '车型',
    lastMaintainTime: '上次保养时间',
    maintainMiles: '上次保养里程',
    reminderDate: '提醒时间',
    status: '保养状态',
    vehiclBrand: '车辆品牌',
    motDate: '年检日期',
    insuranceStartDate: '保险开始时间',
    insuranceEndDate: '保险结束时间',
    insuranceType: '保险类型',
    insuranceFee: '保险费用',
    status: '状态'
  },
  monitorTable: {
    fenceName: '围栏名称',
    inputFenceName: '请输入围栏名称',
    startTime: '开始时间',
    endTime: '结束时间',
    fence_id: '围栏标识',
    create_time: '创建时间',
    modify_time: '修改时间',
    district: '行政区划',
    edit: '编辑',
    delete: '删除'
  },

  table: {
    userName: '用户名',
    departmentName: '单位',
    accountName: '用户账号',
    phone: '电话号码',
    roleName: '角色名称',
    email: '邮箱',
    remark: '备注',

    dynamicTips1: '固定表头, 按照表头顺序排序',
    dynamicTips2: '不固定表头, 按照点击顺序排序',
    dragTips1: '默认顺序',
    dragTips2: '拖拽后顺序',
    title: '标题',
    importance: '重要性',
    type: '类型',
    // remark: '点评',
    search: '搜索',
    add: '添加',
    export: '导出',
    reviewer: '审核人',
    id: '序号',
    date: '时间',
    author: '作者',
    readings: '阅读数',
    status: '状态',
    actions: '操作',
    edit: '编辑',
    publish: '发布',
    draft: '草稿',
    delete: '删除',
    cancel: '取 消',
    confirm: '确 定'
  },
  errorLog: {
    tips: '请点击右上角bug小图标',
    description: '现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在 Vue 官网提供了一个方法来捕获处理异常，你可以在其中进行错误处理或者异常上报。',
    documentation: '文档介绍'
  },
  excel: {
    export: '导出',
    selectedExport: '导出已选择项',
    placeholder: '请输入文件名(默认excel-list)'
  },
  zip: {
    export: '导出',
    placeholder: '请输入文件名(默认file)'
  },
  theme: {
    change: '换肤',
    documentation: '换肤文档',
    tips: 'Tips: 它区别于 navbar 上的 theme-pick, 是两种不同的换肤方法，各自有不同的应用场景，具体请参考文档。'
  },
  tagsView: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  }
}
