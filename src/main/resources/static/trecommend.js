$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'trecommend/list',
        datatype: "json",
        colModel: [
            {label: '型号', name: 'deviceTypeId', index: 'deviceTypeId', width: 80},
            {label: '渠道', name: 'customerId', index: 'customerId', width: 80},
            {label: '项目名称', name: 'name', index: 'name', width: 80},
            {label: '推荐语', name: 'description', index: 'description', width: 80},
            {label: '背景图片', name: 'imageUrl', index: 'imageUrl', width: 80,
                formatter: function (cellValue, options, rowObject) {
                    var imgUrl = '<img src="' + baseURL + '/file/download?fullPath=' + cellValue + '" style="width:100px;height:80px;"/>';
                    return imgUrl;
                }},
            {label: '排序', name: 'sort', index: 'sort', width: 80},
            {label: '推荐位用途', name: 'uses', index: 'uses', width: 80},
            {label: '跳转类型', name: 'intentType', index: 'intentType', width: 80},
            {label: '包名', name: 'packageName', index: 'packageName', width: 80},
            {label: '类名', name: 'className', index: 'className', width: 80},
            {label: 'Action名', name: 'action', index: 'action', width: 80},
            {label: 'uri', name: 'uriString', index: 'uriString', width: 80},
            {label: '参数字符串', name: 'parameters', index: 'parameters', width: 80},
            {label: '创建时间', name: 'createTime', index: 'createTime', width: 80},
            {label: '修改时间', name: 'updateTime', index: 'updateTime', width: 80}
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
    $('#recommendImgFile').uploadifive(uploadRecommendImgUploadSetting);
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: true,
        title: null,
        tRecommend: {}
    },
    methods: {
        query: function () {
            vm.reload();
        },
        add: function () {
            vm.showList = false;
            vm.title = "新增";
            vm.tRecommend = {};
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
            var url = vm.tRecommend.id == null ? "trecommend/save" : "trecommend/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.tRecommend),
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
                    url: baseURL + "trecommend/delete",
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
            $.get(baseURL + "trecommend/info/" + id, function (r) {
                vm.tRecommend = r.tRecommend;
            });
        },
        reload: function (event) {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            $("#jqGrid").jqGrid('setGridParam', {
                page: page
            }).trigger("reloadGrid");
        }
    }
});


var main = {
    uploadRecommendImgFileCallback: function (file, data) {
        var jsonObj = JSON.parse(data);
        var status = jsonObj.status;
        var msg = jsonObj.msg;
        if (status == 0) {
            var fileName = file.name;
            var filePath = jsonObj.filePath;
            vm.tRecommend.imageUrl = filePath;
            $("#recommendImgSrc").attr("src", baseURL + '/file/download?fullPath=' + filePath);
            $("#recommendImgSrc").css("display", "block");
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
