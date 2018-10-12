$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'uilauncher/list',
        datatype: "json",
        colModel: [
            {label: '名称', name: 'names', index: 'names', width: 80},
            {
                label: '状态',
                name: 'status',
                index: 'status',
                width: 80,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == 1) {
                        return '<font style="color: red">正在编辑</font>';
                    }
                    if (cellValue == 2) {
                        return '<font style="color: cornflowerblue">编辑完成</font>';
                    }
                    return '<font style="color: blue">发布</font>';
                }
            },
            {label: '版本', name: 'version', index: 'version', width: 80},
            {label: '描述', name: 'description', index: 'description', width: 80},
            {label: '创建时间', name: 'createTime', index: 'createTime', width: 80},
            {label: '修改时间', name: 'updateTime', index: 'updateTime', width: 80},
            {
                label: '操作', name: 'id', index: 'id', width: 120, formatter: function (cellValue, options, rowObject) {

                var actionHtml = "<a class='btn btn-primary' onclick='vm.firstTitle(" + rowObject.id + ");'>&nbsp;一级标题</a>&nbsp;&nbsp;"
                    + "<a class='btn btn-primary' onclick='vm.mapping(" + rowObject.id + ")'>&nbsp;型号渠道映射</a>&nbsp;&nbsp;"
                return actionHtml;
            }
            }
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
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: true,
        title: null,
        uiLauncher: {},
        queryParameters: {},
        launcherItems: [],
        launcherid: null,
        status: null
    },
    methods: {
        loadqueryItems: function () {
            $.ajax({
                type: "GET",
                url: baseURL + "uilauncher/findAllName",
                contentType: "application/json",
                success: function (r) {
                    if (r.status === 0) {
                        vm.launcherItems = r.result;
                    } else {
                        alert("加载参数查询下拉框信息失败");
                    }
                }
            });
        },
        query: function () {
            vm.reload();
        },
        add: function () {
            vm.showList = false;
            vm.title = "新增";
            vm.uiLauncher = {};
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
            var url = vm.uiLauncher.id == null ? "uilauncher/save" : "uilauncher/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.uiLauncher),
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

            confirm('确定要删除选中的记录？注意模板设计内容也会一起删除', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "uilauncher/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.status == 0) {
                            alert('操作成功', function (index) {
                                $("#jqGrid").trigger("reloadGrid");
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        getInfo: function (id) {
            $.get(baseURL + "uilauncher/info/" + id, function (r) {
                vm.uiLauncher = r.uiLauncher;
            });
        },
        reload: function (event) {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            $("#jqGrid").jqGrid('setGridParam', {
                page: page,
                postData: {
                    'id': vm.launcherid,
                    'status': vm.status
                },
            }).trigger("reloadGrid");
        },
        firstTitle: function (id) {

            var data = {
                launcherid: id,
                titleLevel: 1
            };
            window.location.href = baseURL + "/admin/app/uititle.html?" + $.param(data);
        },
        mapping: function (id) {

            relationshipVM.launcherid = id;

            $.ajax({
                type: "GET",
                data: {'launcherid': id},
                url: baseURL + "uilaunchertcmap/findObjectByLauncherid",
                success: function (r) {
                    if (r.status === 0) {
                        relationshipVM.items = r.result;
                    } else {
                        alert("获取以保存信息失败");
                    }
                }
            });
            relationshipVM.loadSelectors();
            $("#addRelationship").modal("show");
        }

    }
});


var relationshipVM = new Vue({
    el: '#addRelationship',
    data: {
        id: null,
        items: [],
        deviceTypeItems: [],
        customerItems: [],
        launcherid: null
    },
    methods: {
        loadSelectors: function () {
            $.ajax({
                type: "GET",
                url: baseURL + "customer/query",
                success: function (r) {
                    if (r.status === 0) {
                        relationshipVM.customerItems = r.customers;
                    } else {
                        alert("加载渠道下拉框信息失败");
                    }
                }
            });
            $.ajax({
                type: "GET",
                url: baseURL + "devicetype/query",
                success: function (r) {
                    if (r.status === 0) {
                        relationshipVM.deviceTypeItems = r.deviceTypeList;
                    } else {
                        alert("加载型号下拉框信息失败");
                    }
                }
            });
        },
        addMapping: function () {
            relationshipVM.items.push({
                launcherid: relationshipVM.launcherid,
                deviceTypeId: '',
                customerId: ''
            });
        },
        removeMapping: function (index, id) {
            if(id != null){
                var paramId = [];
                paramId.push(id);
                $.ajax({
                    type: "POST",
                    data: JSON.stringify(paramId),
                    contentType: "application/json",
                    url: baseURL + "uilaunchertcmap/delete",
                    success: function (r) {
                        if (r.status === 0) {
                            relationshipVM.items.splice(index, 1);
                        } else {
                            alert("删除信息信息失败");
                        }
                    }
                });
            }else {
                relationshipVM.items.splice(index,1);
            }


        },
        saveOrUpdate: function (event) {
            // 删除原来的再保存
            var url = "uilaunchertcmap/saveinbatch/" + relationshipVM.launcherid;
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(relationshipVM.items),
                success: function (r) {
                    if (r.status === 0) {
                        alert('操作成功', function (index) {
                            $('#addRelationship').modal('hide')
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        }

    }
});