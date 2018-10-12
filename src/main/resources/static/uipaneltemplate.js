$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'uipaneltemplate/list',
        datatype: "json",
        colModel: [
            {label: '模板名称', name: 'name', index: 'name', width: 80},
            {
                label: '模板Id',
                name: 'uiTemplateId',
                index: 'uiTemplateId',
                width: 80,
                formatter: function (cellValue, options, rowObject) {
                    return "模板" + cellValue;
                }
            },
            {label: '模板宽度', name: 'width', index: 'width', width: 80},
            {label: '模板高度', name: 'hight', index: 'hight', width: 80},
            {label: '排序', name: 'sort', index: 'sort', width: 80},
            {
                label: '状态',
                name: 'status',
                index: 'status',
                width: 80,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == 1) {
                        return "<font color='red'>正在编辑</font>"
                    }
                    return "<font color='blue'>编辑完成</font>"
                }
            },
            {label: '描述', name: 'description', index: 'description', width: 80},
            {label: '模板作者', name: 'author', index: 'author', width: 80},
            {label: '创建时间', name: 'createTime', index: 'createTime', width: 80},
            {label: '修改时间', name: 'updateTime', index: 'updateTime', width: 80},
            {
                label: '操作', name: 'id', index: 'id', width: 120, formatter: function (cellValue, options, rowObject) {
                var actionHtml = "<a class='btn btn-primary' onclick='vm.update(" + rowObject.id + ");'>&nbsp;修改</a>&nbsp;&nbsp;"
                    + "<a class='btn btn-primary' onclick='vm.drawPannel(" + rowObject.id + ")'>&nbsp;编辑模板</a>&nbsp;&nbsp;"
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
    vm.loadSelector();
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: "init",
        title: null,
        templateItems: [],
        queryId: "",
        uiPanelTemplate: {}
    },
    methods: {
        query: function () {
            vm.reload();
        },
        loadSelector: function () {
            $.ajax({
                type: "GET",
                url: baseURL + "uipaneltemplate/querySearchNames",
                contentType: "application/json",
                success: function (r) {
                    if (r.status === 0) {
                        vm.templateItems = r.data;
                    } else {
                        alert("加载模板下拉框信息失败");
                    }
                }
            });
        },
        add: function () {
            vm.showList = "updateOrSave";
            vm.title = "新增";
            vm.uiPanelTemplate = {};
        },
        update: function (event) {
            var id = event != null ? event : getSelectedRow();
            if (id == null) {
                return;
            }
            vm.showList = "updateOrSave";
            vm.title = "修改";

            vm.getInfo(id)
        },
        saveOrUpdate: function (event) {
            var url = vm.uiPanelTemplate.id == null ? "uipaneltemplate/save" : "uipaneltemplate/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.uiPanelTemplate),
                success: function (r) {
                    if (r.code === 0) {
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
                    url: baseURL + "uipaneltemplate/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.code == 0) {
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
            $.get(baseURL + "uipaneltemplate/info/" + id, function (r) {
                vm.uiPanelTemplate = r.uiPanelTemplate;
            });
        },
        reload: function (event) {
            vm.showList = "init";
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            $("#jqGrid").jqGrid('setGridParam', {
                page: page,
                postData: {id: vm.queryId}
            }).trigger("reloadGrid");
        },
        drawPannel: function (id) {
            var data = {
                panelid: id
            };
            window.location.href = baseURL + "/admin/app/drawpanel.html?" + $.param(data);

        }
    }
});