var it_service_common = {
    adminUrl: 'http://' + window.location.host + '/web/pcmanage',
    imgCbUrl: 'http://' + window.location.host + '/web/pcmanage/admin/uploadcb-sample.html',

    //adminUrl: 'http://' + window.location.host + '/cttq_ask_admin/web/pcmanage',
    //imgCbUrl: 'http://' + window.location.host + '/cttq_ask_admin/web/pcmanage/admin/uploadcb-sample.html',

    //currentUrl: 'http://aiqas.cttq.com:808'
    currentUrl: 'http://aidev.cttq.com:808'
};

var it_service_url = {
    //ECC-问题分类列表查询
    quesTypeList: it_service_common.currentUrl + '/its/questype/quesTypeList',
    //ECC-新增问题分类
    AddQuesType: it_service_common.currentUrl + '/its/questype/addQuesType',
    //ECC-问题分类启用状态修改
    UpdateTypeEnableState: it_service_common.currentUrl + '/its/questype/updateTypeEnableState',
    //ECC-问题分类删除
    DeleteQuesType: it_service_common.currentUrl + '/its/questype/deleteQuesType',

    //Ecc-客服人员列表查询
    CustomersList: it_service_common.currentUrl + '/its/customerService/customerServiceList',
    //Ecc-新增客服人员
    AddCustomer: it_service_common.currentUrl + '/its/customerService/addCustomerService',
    //ECC-客服人员状态修改
    UpdateCustomerServiceState: it_service_common.currentUrl + '/its/customerService/updateCustomerServiceState',
    //ECC-客服人员删除
    DeleteCustomerService: it_service_common.currentUrl + '/its/customerService/deleteCustomerService',

    //Ecc-所属系统列表查询
    BelongSysTypeList: it_service_common.currentUrl + '/its/belongSysType/belongSysTypeList',
    //ECC-新增所属系统
    AddBelongSysType: it_service_common.currentUrl + '/its/belongSysType/addBelongSysType',
    //ECC-所属系统启用状态修改
    UpdateSysTypeState: it_service_common.currentUrl + '/its/belongSysType/updateSysTypeState',
    //ECC-所属系统删除
    DeleteBelongSysType: it_service_common.currentUrl + '/its/belongSysType/deleteBelongSysType',

    //ECC-快速回复列表查询
    QuickReplyList: it_service_common.currentUrl + '/its/quickReply/quickReplyList',
    //ECC-新增快速回复
    AddQuickReply: it_service_common.currentUrl + '/its/quickReply/addQuickReply',
    //ECC-快速回复状态修改
    UpdateQuickReplyState: it_service_common.currentUrl + '/its/quickReply/updateQuickReplyState',
    //ECC-快速回复删除
    DeleteQuickReply: it_service_common.currentUrl + '/its/quickReply/deleteQuickReply',

    //ECC-工单列表头查询
    QueryWorkBillHead: it_service_common.currentUrl + '/its/mainques/queryWorkBillHead',
    //ECC-工单列表查询（待受理、处理中、异常）
    WorkBillOtherList: it_service_common.currentUrl + '/its/mainques/workBillOtherList',
    //ECC-工单列表查询（我的工单和全部工单）
    WorkBillMainList: it_service_common.currentUrl + '/its/mainques/workBillMainList',
    //ECC-查询问题详情
    QueryQuesDetail: it_service_common.currentUrl + '/its/mainques/queryQuesDetail',
    //ECC-问题回复
    ReplyQues: it_service_common.currentUrl + '/its/reply/replyQues',
    //ECC-修改工单基本信息
    UpdateWorkBillInfo: it_service_common.currentUrl + '/its/mainques/updateWorkBillInfo',
    //ECC-转业务流程
    TurnFlowHandle: it_service_common.currentUrl + '/its/flow/turnFlowHandle',
    //ECC-修改工单状态
    UpdateWorkBillState: it_service_common.currentUrl + '/its/mainques/updateWorkBillState',
    //ECC-流程处理信息查询
    QueryFlowHandle: it_service_common.currentUrl + '/its/flow/queryFlowHandle',
    //ECC-新建订单
    AddWorkBill: it_service_common.currentUrl + '/its/mainques/addWorkBill',

    //查询人员角色
    QueryPersonalRole: it_service_common.currentUrl + '/its/customerService/queryPersonalRole',
    //流程回调
    FlowCallBack: it_service_common.currentUrl + '/its/flow/flowCallBack',

    //消息推送
    PushMsg: it_service_common.currentUrl + '/jpush2/JPushMsg',
    //图片上传http://aidev.cttq.com:808/upload/upload?cb=http://localhost:63342/cttq_ask_admin/web/uploadcb-sample.html
    ImgUpload: it_service_common.currentUrl + '/upload/upload?cb=' + it_service_common.imgCbUrl
};