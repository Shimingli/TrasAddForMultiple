$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'tuappsprovide/list',
        datatype: "json",
        colModel: [
            {label: '应用名称', name: 'appname', index: 'appName', width: 80},
            {label: '应用包名', name: 'packagename', index: 'packageName', width: 80},
            {
                label: '是否显示', name: 'hide', index: 'hide', width: 40,
                formatter: function (value, grid, rows, state) {
                    if (value === 0) {
                        return '<span class="label label-success">显示</span>';
                    } else {
                        return '<span class="label label-danger">隐藏</span>'
                    }
                }
            },
            {
                label: '投放的型号渠道', name: 'dc', width: 60,
                formatter: function (value, grid, rows, state) {
                    return '<a class="btn btn-default" data-toggle="modal" data-target="#dc" data-id="' + rows.id + '" data-act="detail">查看</a>'
                        + '&nbsp;'
                        + '<a class="btn btn-default" data-toggle="modal" data-target="#dc" data-id="' + rows.id + '" data-act="edit">配置</a>';
                }
            },
            {label: '最大安装数', name: 'maxinstall', index: 'maxInstall', width: 60},
            {label: '已安装数', name: 'countofinstall', index: 'countOfInstall', width: 60},
            {
                label: '是否限制安装数', name: 'numberlimit', index: 'numberLimit', width: 60,
                formatter: function (value, grid, rows, state) {
                    if (value === 0) {
                        return '<span class="label label-success">不限制</span>';
                    } else {
                        return '<span class="label label-danger">限制</span>';
                    }

                }
            },
            {label: '最近下载时间', name: 'createtime', index: 'createTime', width: 80},
            {label: '修改时间', name: 'updatetime', index: 'updateTime', width: 80},
            {
                label: '操作', name: 'opt', width: 60,
                formatter: function (value, grid, rows, state) {
                    return '<a class="btn btn-default" data-toggle="modal" data-target="#update" data-id="' + rows.id + '">修改</a>'
                        + '&nbsp;'
                        + '<a class="btn btn-default" onclick="del(' + rows.id + ')">删除</a>';
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
        postData: {
            'uses': -1
        },
        gridComplete: function () {
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });

    $("#appJqGrid").jqGrid({
        url: baseURL + 'admin/tbapp/list',
        datatype: "json",
        colModel: [
            {label: '应用名称', name: 'aliasname', index: 'aliasname', width: 80},
            {label: '应用包名', name: 'packagename', index: 'packagename', width: 80},
            {
                label: '操作', name: 'opt', width: 60,
                formatter: function (value, grid, rows, state) {
                    return '<a class="btn btn-default" onclick="add(' + rows.id + ')">添加</a>';
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
        multiselect: true,
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

    $("#dcJqGrid").jqGrid({
        url: baseURL + 'appsprovidemap/list',
        datatype: "json",
        colModel: [
            {label: '型号名称', name: 'devicetype', index: 'deviceType', width: 80},
            {label: '渠道名称', name: 'customername', index: 'customerName', width: 80},
            {
                label: '操作', name: 'opt', width: 60,
                formatter: function (value, grid, rows, state) {
                    return '<a class="btn btn-default" onclick="delDC(' + rows.id + ')">删除</a>';
                }
            }
        ],
        viewrecords: true,
        height: 200,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
        multiselect: true,
        pager: "#dcJqGridPager",
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
            var grid = $("#dcJqGrid");
            grid.closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
            grid.setGridWidth(572);
        }
    });

    $('#dc').on('show.bs.modal', function (event) {
        initDeviceTypeSelect();

        var button = $(event.relatedTarget);
        var id = button.data('id');
        var act = button.data('act');

        vm.appsProvideSelectId = id;

        console.log("id: " + id);
        console.log("act: " + act);

        var grid = $('#jqGrid');
        vm.labelAppNameDC = grid.jqGrid('getCell', id, 'appname');
        vm.labelPackageDC = grid.jqGrid('getCell', id, 'packagename');

        vm.queryDeviceTypeDC = '';
        vm.queryCustomerDC = '';

        var dcGrid = $('#dcJqGrid');
        var page = dcGrid.jqGrid('getGridParam', 'page');

        if (act === "edit") {
            vm.labelTitleDC = "配置";
            vm.inEdit = true;
            jQuery("#dcJqGrid").setGridParam({
                postData: {
                    'provideid': vm.appsProvideSelectId,
                    'deviceType': vm.queryDeviceTypeDC,
                    'customerName': vm.queryCustomerDC
                },
                page: page
            }).showCol("opt").trigger("reloadGrid");
        } else {
            vm.labelTitleDC = "查看";
            vm.inEdit = false;
            jQuery("#dcJqGrid").setGridParam({
                postData: {
                    'provideid': vm.appsProvideSelectId,
                    'deviceType': vm.queryDeviceTypeDC,
                    'customerName': vm.queryCustomerDC
                },
                page: page
            }).hideCol("opt").trigger("reloadGrid");
        }
    });

    $('#update').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var id = button.data('id');

        console.log("id: " + id);

        $.get(baseURL + "tuappsprovide/info/" + id, function (r) {
            vm.tuAppsProvide = r.tuAppsProvide;
            vm.isShowSelected = r.tuAppsProvide.hide;
            vm.maxInstall = r.tuAppsProvide.maxinstall;
            vm.isLimitSelected = r.tuAppsProvide.numberlimit;
        });

        vm.appsProvideSelectId = id;
    });
});

Vue.component('vm-select', {
    props: ['id', 'options', 'value', 'method'],
    template: "<select id='id' class='form-control selectpicker' data-live-search='true' title='请选择' data-live-search-placeholder='搜索'><option :value='option.value' v-for='option in options'>{{ option.text }}</option></select>",
    mounted: function () {
        var vm = this;
        $(this.$el).selectpicker('val', this.value != null ? this.value : null);
        $(this.$el).on('changed.bs.select', function () {
            vm.$emit('input', $(this).val());
            if (typeof(vm.method) != 'undefined') {
                vm.method(vm.index, vm.childidx, this.value);
            }
        });
        $(this.$el).on('show.bs.select', function () {
            if (typeof(vm.load) != 'undefined') {
                vm.load(vm.index, vm.childidx);
            }
        });
    },
    updated: function () {
        $(this.$el).selectpicker('refresh');
    },
    destroyed: function () {
        $(this.$el).selectpicker('destroy');
    }
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: true,
        title: null,

        // 页面控制相关data
        inEdit: false,

        // 用于查询的data
        queryAppName: '',
        queryAppPackage: '',
        queryAddAppName: '',
        queryDeviceTypeDC: '',
        queryCustomerDC: '',

        // select相关的data
        appUsesSelectOptions: [
            {value: 'rough', text: '粗犷推送'},
            {value: 'precision', text: '精准推送'},
            {value: 'ott', text: 'ott大师推送'},
            {value: 'hot_search', text: '热搜应用'},
            {value: 'must_install', text: '装机必备'},
            {value: 'enter_recommend', text: '进入时推荐'},
            {value: 'exit_recommend', text: '退出时推荐'},
            {value: 'hotkey_recommend', text: '热键推送应用'}
        ],
        appUsesSelected: '',
        deviceTypeList: [],
        deviceTypeSelected: '',
        customerMaps: [],
        customerSelected: '',
        isShowList: [
            {text: '显示', value: 0},
            {text: '隐藏', value: 1}
        ],
        isShowSelected: 0,
        isLimitList: [
            {text: '不限制', value: 0},
            {text: '限制', value: 1}
        ],
        isLimitSelected: 0,

        // 标签data
        labelTitleDC: '',
        labelAppNameDC: '',
        labelPackageDC: '',

        maxInstall: 0,

        tuAppsProvide: {},

        appsProvideSelectId: null
    },
    watch: {
        appUsesSelected: function (newSelected) {
            vm.reload();
        },
        deviceTypeSelected: function (deviceTypeId) {
            initCustomerSelectByDeviceTypeId(deviceTypeId);
        }
    },
    methods: {
        query: function () {
            vm.reload();
        },
        queryAppList: function () {
            vm.reloadAppGrid();
        },
        queryDCList: function () {
            vm.reloadDcGird();
        },
        add: function () {
            if (vm.appUsesSelected === '') {
                alert("必须选择应用的用途");
                return;
            }
            console.log("appUsesSelected: " + vm.appUsesSelected);

            var grid = $("#appJqGrid");
            var rowKey = grid.getGridParam("selrow");
            if (!rowKey) {
                alert("请选择至少一条需要添加的应用");
                return;
            }

            var ids = grid.getGridParam("selarrrow");
            console.log("ids: " + ids);

            var addData = [];
            ids.forEach(function (value, index, array) {
                addData.push({appid: value, uses: vm.appUsesSelected});
            });

            $.ajax({
                type: "POST",
                url: baseURL + "tuappsprovide/save",
                contentType: "application/json",
                data: JSON.stringify(addData),
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
        addDC: function () {
            if (vm.deviceTypeSelected === '') {
                alert("请选择型号");
                return;
            }
            if (vm.customerSelected === '') {
                alert("请选择渠道");
                return;
            }
            var dcData = {};
            dcData.provideid = vm.appsProvideSelectId;
            dcData.devicetypeid = vm.deviceTypeSelected;
            dcData.customerid = vm.customerSelected;
            $.ajax({
                type: "POST",
                url: baseURL + "appsprovidemap/save",
                contentType: "application/json",
                data: JSON.stringify(dcData),
                success: function (r) {
                    if (r.status === 0) {
                        alert('操作成功', function (index) {
                            vm.reloadDcGird();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        update: function () {
            console.log("update");
            vm.tuAppsProvide.hide = vm.isShowSelected;
            vm.tuAppsProvide.maxinstall = vm.maxInstall;
            vm.tuAppsProvide.numberlimit = vm.isLimitSelected;
            $.ajax({
                type: "POST",
                url: baseURL + "tuappsprovide/update",
                contentType: "application/json",
                data: JSON.stringify(vm.tuAppsProvide),
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
                    url: baseURL + "tuappsprovide/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.status === 0) {
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
        delDC: function (event) {
            var ids = this.getSelectedRowsDC();
            if (ids == null) {
                return;
            }

            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "appsprovidemap/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.status === 0) {
                            alert('操作成功', function (index) {
                                $("#dcJqGrid").trigger("reloadGrid");
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        getSelectedRowsDC: function () {
            var grid = $("#dcJqGrid");
            var rowKey = grid.getGridParam("selrow");
            if (!rowKey) {
                alert("请选择一条记录");
                return;
            }

            return grid.getGridParam("selarrrow");
        },
        reload: function (event) {
            var grid = $("#jqGrid");
            var page = grid.jqGrid('getGridParam', 'page');
            grid.jqGrid('setGridParam', {
                postData: {
                    'uses': vm.appUsesSelected,
                    'packageName': vm.queryAppPackage,
                    'name': vm.queryAppName
                },
                page: page
            }).trigger("reloadGrid");
        },
        reloadAppGrid: function (event) {
            var grid = $("#appJqGrid");
            var page = grid.jqGrid('getGridParam', 'page');
            grid.jqGrid('setGridParam', {
                postData: {
                    'appName': vm.queryAddAppName
                },
                page: page
            }).trigger("reloadGrid");
        },
        reloadDcGird: function (event) {
            var grid = $("#dcJqGrid");
            var page = grid.jqGrid('getGridParam', 'page');
            grid.jqGrid('setGridParam', {
                postData: {
                    'provideid': vm.appsProvideSelectId,
                    'deviceType': vm.queryDeviceTypeDC,
                    'customerName': vm.queryCustomerDC
                },
                page: page
            }).trigger("reloadGrid");
        }
    }
});

function add(id) {
    if (id == null) {
        return;
    }
    if (vm.appUsesSelected === '') {
        alert("必须选择应用的用途");
        return;
    }
    var addData = [];
    addData.push({appid: id, uses: vm.appUsesSelected});
    $.ajax({
        type: "POST",
        url: baseURL + "tuappsprovide/save",
        contentType: "application/json",
        data: JSON.stringify(addData),
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
}

function del(id) {
    if (id == null) {
        return;
    }

    var ids = [];
    ids.push(id);

    confirm('确定要删除记录？', function () {
        $.ajax({
            type: "POST",
            url: baseURL + "tuappsprovide/delete",
            contentType: "application/json",
            data: JSON.stringify(ids),
            success: function (r) {
                if (r.status === 0) {
                    alert('操作成功', function (index) {
                        $("#jqGrid").trigger("reloadGrid");
                    });
                } else {
                    alert(r.msg);
                }
            }
        });
    });
}

function delDC(id) {
    if (id == null) {
        return;
    }

    var ids = [];
    ids.push(id);
    confirm('确定要删除记录？', function () {
        $.ajax({
            type: "POST",
            url: baseURL + "appsprovidemap/delete",
            contentType: "application/json",
            data: JSON.stringify(ids),
            success: function (r) {
                if (r.status === 0) {
                    alert('操作成功', function (index) {
                        $("#dcJqGrid").trigger("reloadGrid");
                    });
                } else {
                    alert(r.msg);
                }
            }
        });
    });
}

function initDeviceTypeSelect() {
    $.get(baseURL + "devicetype/query", function (r) {
        if (r.status === 0) {
            vm.deviceTypeList = generateSelectOptions(r.deviceTypeList, 'devicetype', 'devicetypeid');
        } else {
            alert(r.msg);
        }
    });
}

function initCustomerSelectByDeviceTypeId(deviceTypeId) {
    $.get(baseURL + "typecustomermap/info/" + deviceTypeId, function (r) {
        if (r.status === 0) {
            vm.customerMaps = generateSelectOptions(r.customerMaps, 'customername', 'customerid');
            vm.customerSelected = '';
        } else {
            alert(r.msg);
        }
    });
}

function generateSelectOptions(list, tkey, vkey) {
    var options = [];
    for (var i = 0; i < list.length; i++) {
        var option = {
            text: '',
            value: ''
        };
        option.text = list[i][tkey];
        option.value = list[i][vkey];
        options.push(option);
    }
    return options;
}