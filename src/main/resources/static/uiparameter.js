$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'uiparameter/list',
        datatype: "json",
        colModel: [
            {label: '参数模板名称', name: 'name', index: 'name', width: 80},
            {label: '跳转类型', name: 'intentType', index: 'intentType', width: 80},
            {label: '包名', name: 'packageName', index: 'packageName', width: 80},
            {label: '类名', name: 'className', index: 'className', width: 80},
            {label: 'Action名', name: 'action', index: 'action', width: 80},
            {label: 'uri', name: 'uriString', index: 'uriString', width: 80},
            {label: '参数(JSON)', name: 'parameters', index: 'parameters', width: 80},
            {label: '创建时间', name: 'createTime', index: 'createTime', width: 80},
            {label: '更新时间', name: 'updateTime', index: 'updateTime', width: 80}
        ],
        viewrecords: true,
        height: 385,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader: {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames: {
            page: "page",
            rows: "limit",
            order: "order"
        },
        gridComplete: function () {
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });
    vm.loadqueryItems();


    $("#appJqGrid").jqGrid({
        url: baseURL + 'admin/tbapp/list',
        datatype: "json",
        colModel: [
            {label: '应用名称', name: 'aliasname', index: 'aliasname', width: 100},
            {label: '应用包名', name: 'packagename', index: 'packagename', width: 100},
            {
                label: '操作', name: 'opt', width: 60,
                formatter: function (value, grid, rows, state) {
                    return '<a class="btn btn-primary" data-toggle="modal" data-target="#getAppVersionInfo" data-id="' + rows.id + '">版本选择</a>'
                }
            }
        ],
        viewrecords: true,
        height: 280,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: false,
        multiselect: false,
        pager: "#appJqGridPager",
        jsonReader: {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames: {
            page: "page",
            rows: "limit",
            order: "order"
        },
        gridComplete: function () {
            $("#appJqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });


    $("#jqAppVersionInfoGrid").jqGrid({
        url: baseURL + 'admin/tbapp/versionList',
        datatype: "json",
        colModel: [
            {label: '文件名称', name: 'apkName', index: 'apkName', width: 100},
            {label: '应用包名', name: 'apkPackageName', index: 'apkPackageName', width: 100},
            {label: '应用版本名称', name: 'apkVersionName', index: 'apkVersionName', width: 100},
            {label: '应用版本号', name: 'apkVersionCode', index: 'apkVersionCode', width: 100},
            {label: '下载地址', name: 'apkcdnUrl', index: 'apkcdnUrl', width: 100},
            {label: '文件大小', name: 'apkSize', index: 'apkSize', width: 100},
            {label: 'MD5', name: 'apkMd5', index: 'apkMd5', width: 100},
            {
                label: '操作', name: 'opt', width: 60,
                formatter: function (value, grid, rows, state) {
                    return "<a class='btn btn-primary' onclick=setInstallAppInfo(" + JSON.stringify(rows) + ")>选择</a>"
                }
            }
        ],
        viewrecords: true,
        height: 280,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
        multiselect: false,
        pager: "#jqAppVersionInfoGridPager",
        jsonReader: {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames: {
            page: "page",
            rows: "limit",
            order: "order"
        },
        gridComplete: function () {
            $("#jqAppVersionInfoGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });

    $('#getAppVersionInfo').on('show.bs.modal', function (event) {

        console.log("open appversion info");
        var button = $(event.relatedTarget);
        var id = button.data('id');
        var param = {appid: id};
        var grid = $("#jqAppVersionInfoGrid");
        var page = grid.jqGrid('getGridParam', 'page');
        grid.jqGrid('setGridParam', {
            postData: param,
            page: page
        }).trigger("reloadGrid");

    });

});


var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: true,
        title: null,
        chooseApp: true,
        chooseAction: false,
        chooseBroadcast: false,
        chooseUrl: false,
        chooseInstall: false,
        uiParameter: {},
        items: [],
        queryItems: [],
        queryId: null,
        queryAddAppName: null
    },
    methods: {
        query: function () {
            vm.reload();
        },
        loadqueryItems: function () {

            $.ajax({
                type: "GET",
                url: baseURL + "uiparameter/findAllName",
                contentType: "application/json",
                success: function (r) {
                    if (r.status === 0) {
                        vm.queryItems = r.result;
                    } else {
                        alert("加载参数查询下拉框信息失败");
                    }
                }
            });

        },
        selectIntentType: function () {

            var intentType = vm.uiParameter.intentType;

            if (intentType == 'App') {
                vm.chooseApp = true;
                vm.chooseAction = false;
                vm.chooseBroadcast = false;
                vm.chooseUrl = false;
                vm.chooseInstall = false;
            }
            if (intentType == 'Action') {
                vm.chooseApp = false;
                vm.chooseAction = true;
                vm.chooseBroadcast = false;
                vm.chooseUrl = false;
                vm.chooseInstall = false;
            }
            if (intentType == 'url') {
                vm.chooseApp = false;
                vm.chooseAction = false;
                vm.chooseBroadcast = false;
                vm.chooseUrl = true;
                vm.chooseInstall = false;
            }
            if (intentType == 'Broadcast') {
                vm.chooseApp = false;
                vm.chooseAction = false;
                vm.chooseBroadcast = true;
                vm.chooseUrl = false;
                vm.chooseInstall = false;
            }
            if (intentType == 'install') {
                vm.chooseApp = false;
                vm.chooseAction = false;
                vm.chooseBroadcast = false;
                vm.chooseUrl = false;
                vm.chooseInstall = true;
            }
        },
        add: function () {
            vm.showList = false;
            // 默认 下拉框 是 App
            vm.chooseApp = true;
            vm.title = "新增";
            vm.uiParameter = {};
        },
        addParameters: function () {

            vm.items.push({
                key: '',
                value: ''
            });

        },
        removeParameters: function (index) {
            vm.items.splice(index, 1);
        },
        update: function (event) {
            var id = getSelectedRow();
            if (id == null) {
                return;
            }
            vm.showList = false;
            vm.title = "修改";

            vm.getInfo(id)
        },
        saveOrUpdate: function (event) {
            var url = vm.uiParameter.id == null ? "uiparameter/save" : "uiparameter/update";

            // items 装为 字符串 记录
            if (vm.items == null || vm.items.length == 0) {
                vm.uiParameter.parameters = null;
            } else {
                vm.uiParameter.parameters = JSON.stringify(vm.items);
            }

            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.uiParameter),
                success: function (r) {
                    if (r.status === 0) {
                        alert('操作成功', function (index) {
                            vm.reload();

                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        del: function (event) {
            var ids = getSelectedRows();
            if (ids == null) {
                return;
            }

            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "uiparameter/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.status == 0) {
                            alert('操作成功', function (index) {
                                $("#jqGrid").trigger("reloadGrid");
                            });
                            // 重新加载下拉框
                            vm.loadqueryItems();
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        getInfo: function (id) {
            $.get(baseURL + "uiparameter/info/" + id, function (r) {
                vm.uiParameter = r.uiParameter;
                if (r.uiParameter.parameters == null) {
                    vm.items = [];
                } else {
                    vm.items = JSON.parse(r.uiParameter.parameters);
                }
                if (r.uiParameter.intentType == 'App') {
                    vm.chooseApp = true;
                    vm.chooseAction = false;
                    vm.chooseBroadcast = false;
                    vm.chooseUrl = false;
                    vm.chooseInstall = false;
                }

                if (r.uiParameter.intentType == 'Action') {
                    vm.chooseApp = false;
                    vm.chooseAction = true;
                    vm.chooseBroadcast = false;
                    vm.chooseUrl = false;
                    vm.chooseInstall = false;
                }

                if (r.uiParameter.intentType == 'url') {
                    vm.chooseApp = false;
                    vm.chooseAction = false;
                    vm.chooseBroadcast = false;
                    vm.chooseUrl = true;
                    vm.chooseInstall = false;
                }
                if (r.uiParameter.intentType == 'Broadcast') {
                    vm.chooseApp = false;
                    vm.chooseAction = false;
                    vm.chooseBroadcast = true;
                    vm.chooseUrl = false;
                    vm.chooseInstall = false;
                }
                if (r.uiParameter.intentType == 'install') {
                    vm.chooseApp = false;
                    vm.chooseAction = false;
                    vm.chooseBroadcast = false;
                    vm.chooseUrl = false;
                    vm.chooseInstall = true;
                }
            });
        },
        reload: function (event) {
            vm.showList = true;
            var params = {id: vm.queryId};
            var page = 1;
            $("#jqGrid").jqGrid('setGridParam', {
                page: page,
                postData: params
            }).trigger("reloadGrid");
        },
        queryAppList: function () {

            var grid = $("#appJqGrid");
            var page = grid.jqGrid('getGridParam', 'page');
            grid.jqGrid('setGridParam', {
                postData: {
                    'appName': vm.queryAddAppName
                },
                page: page
            }).trigger("reloadGrid");

        }

    }

});

function setInstallAppInfo(row) {


     vm.uiParameter.apkPackageName = row.apkPackageName;
     vm.uiParameter.apkVersionName = row.apkVersionName;
     vm.uiParameter.apkVersionCode = row.apkVersionCode;
     vm.uiParameter.apkcdnUrl = row.apkcdnUrl;
     vm.uiParameter.apkSize = row.apkSize;
     vm.uiParameter.apkName = row.apkName;
     vm.uiParameter.apkMd5 = row.apkMd5;

    $("#chooseInstall_apkPackageName").val(row.apkPackageName);
    $("#chooseInstall_apkVersionName").val(row.apkVersionName);
    $("#chooseInstall_apkVersionCode").val(row.apkVersionCode);
    $("#chooseInstall_apkcdnUrl").val(row.apkcdnUrl);
    $("#chooseInstall_apkSize").val(row.apkSize);
    $("#chooseInstall_apkName").val(row.apkName);
    $("#chooseInstall_apkMd5").val(row.apkMd5);


    $('#getAppVersionInfo').modal('hide')

}