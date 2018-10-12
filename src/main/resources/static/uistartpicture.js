$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'uistartpicture/list',
        datatype: "json",
        colModel: [
            {label: 'id', name: 'id', index: 'id', width: 50, key: true, hidden: true},
            // TODO 转为图片展示
            {
                label: '图片',
                name: 'imageurl',
                index: 'imageUrl',
                width: 80,
                formatter: function (cellValue, options, rowObject) {
                    var imgUrl = '<img src="' + baseURL + '/file/download?fullPath=' + cellValue + '" style="width:100px;height:80px;"/>';
                    return imgUrl;
                }
            },
            // TODO  改为中文名称
            {label: '型号ID', name: 'devicetypeid', index: 'deviceTypeId', width: 80},
            // TODO  改为中文名称
            {label: '渠道ID', name: 'customerid', index: 'customerId', width: 80},
            {label: '创建时间', name: 'createtime', index: 'createTime', width: 80},
            {label: '更新时间', name: 'updatetime', index: 'updateTime', width: 80},
            {
                label: '跳转类型',
                name: 'intenttype',
                index: 'intentType',
                width: 80,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == 0) {
                        return 'App';
                    }
                    if (cellValue == 1) {
                        return 'Action';
                    }
                    return '尚未指定';
                }
            },
            {label: '包名', name: 'packagename', index: 'packageName', width: 80},
            {label: '类名', name: 'classname', index: 'className', width: 80},
            {label: 'Action名', name: 'action', index: 'action', width: 80},
            {label: 'uri', name: 'uristring', index: 'uriString', width: 80},
            {label: '参数JSON串', name: 'parameters', index: 'parameters', width: 80},
            {label: '动作类别', name: 'intentcategory', index: 'intentCategory', width: 80}
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
    vm.loadDevicetype();
    $('#uiStartPictureFile').uploadifive(uiStartPictureFileUploadSetting);
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: true,
        title: null,
        queryParam: {
            devicetypeList: [],
            customerList: [],
            devicetypeid: -1,
            customerid: -1,
        },
        uiStartPicture: {}
    },
    methods: {
        query: function () {
            vm.reload();
        },
        add: function () {
            vm.showList = false;
            vm.title = "新增";
            vm.uiStartPicture = {};
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
            var url = vm.uiStartPicture.id == null ? "uistartpicture/save" : "uistartpicture/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.uiStartPicture),
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
                    url: baseURL + "uistartpicture/delete",
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
            $.get(baseURL + "uistartpicture/info/" + id, function (r) {
                vm.uiStartPicture = r.uiStartPicture;
            });
        },
        reload: function (event) {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            var params = {
                deviceTypeId: vm.queryParam.devicetypeid,
                customerId: vm.queryParam.customerid
            };

            $("#jqGrid").jqGrid('setGridParam', {
                page: page,
                postData: params
            }).trigger("reloadGrid");
        }, /**加载型号*/
        loadDevicetype: function () {
            $.get(baseURL + "devicetype/query", function (r) {
                vm.queryParam.devicetypeList = [];
                for (var i in r.deviceTypeList) {
                    var deviceType = {};
                    deviceType.devicetype = r.deviceTypeList[i].devicetype;
                    deviceType.devicetypeid = r.deviceTypeList[i].devicetypeid;
                    vm.queryParam.devicetypeList.push(deviceType);
                }
                vm.loadCustomer();
            });
        },
        /**加载渠道*/
        loadCustomer: function () {
            var devicetypeid = vm.queryParam.devicetypeid;
            vm.queryParam.customerList = [];
            //全部渠道
            if (devicetypeid == -1) {
                $.get(baseURL + "customer/query", function (r) {
                    for (var i in r.customers) {
                        var customer = {};
                        customer.customerid = r.customers[i].customerid;
                        customer.customername = r.customers[i].customername;
                        vm.queryParam.customerList.push(customer);
                    }
                });
            } else {
                $.get(baseURL + "typecustomermap/info/" + devicetypeid, function (r) {
                    for (var i in r.customerMaps) {
                        var customer = {};
                        customer.customerid = r.customerMaps[i].customerid;
                        customer.customername = r.customerMaps[i].customername;
                        vm.queryParam.customerList.push(customer);
                    }
                });
            }
        },
        devidetypeSelect: function (event) {
            vm.loadCustomer();
        }
    }
});


var main = {
    uiStartPictureCallback: function (file, data) {
        var jsonObj = JSON.parse(data);
        var status = jsonObj.status;
        var msg = jsonObj.msg;
        if (status == 0) {
            var fileName = file.name;
            var filePath = jsonObj.filePath;
            vm.uiStartPicture.imageurl = filePath;
            $("#uiStartPictureSrc").attr("src", baseURL + '/file/download?fullPath=' + filePath);
            $("#uiStartPictureSrc").css("display", "block");
            alert('图片：' + fileName + '上传成功');
        } else if (status = 1) {
            alert(msg);
        } else if (status == 2) {
            alert(msg);
        }
    },
    removeIcon: function (id) {
        confirm("确定是否删除？", function () {
            $("#" + id).empty();
            alert("删除成功！");
        });
    }
};
