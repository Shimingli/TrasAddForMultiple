var launcherid = T.p('launcherid');
var titleLevel = T.p('titleLevel');
var parentId = T.p('parentId');
var navTitle;
console.log(titleLevel);
if (titleLevel == 1) {
    navTitle = "主界面>一级标题";
}
// document.getElementById("nav_title_navTitle").innerHTML = navTitle;
if (titleLevel == 2) {

    navTitle = "主界面>一级标题>二级标题";
}


console.log(launcherid);
console.log(titleLevel);
console.log(parentId);

$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'uititle/list',
        datatype: "json",
        colModel: [
            {label: '标题名称', name: 'name', index: 'name', width: 80},
            {
                label: '焦点图片',
                name: 'iconfocus',
                index: 'iconfocus',
                width: 80,
                formatter: function (cellValue, options, rowObject) {
                    var imgUrl = "图片没上传";
                    if(cellValue != null){
                        imgUrl = '<img src="' + baseURL + '/file/download?fullPath=' + cellValue + '" style="width:100px;height:80px;"/>';
                    }
                    return imgUrl;
                }
            },
            {label: '模板Id', name: 'uiTemplateId', index: 'uiTemplateId', width: 80,formatter:function (cellValue, options, rowObject) {
                return "模板" + cellValue;
            }},
            {
                label: '无焦点图片',
                name: 'iconunfocus',
                index: 'iconunfocus',
                width: 80,
                formatter: function (cellValue, options, rowObject) {
                    var imgUrl = "图片没上传";
                    if(cellValue != null){
                         imgUrl = '<img src="' + baseURL + '/file/download?fullPath=' + cellValue + '" style="width:100px;height:80px;"/>';
                    }
                    return imgUrl;
                }
            },{
                label: '选中图片',
                name: 'iconselected',
                index: 'iconselected',
                width: 80,
                formatter: function (cellValue, options, rowObject) {
                    var imgUrl = "图片没上传";
                    if(cellValue != null){

                         imgUrl = '<img src="' + baseURL + '/file/download?fullPath=' + cellValue + '" style="width:100px;height:80px;"/>';
                    }
                    return imgUrl;
                }
            },
            /*{label: '模板宽度', name: 'width', index: 'width', width: 80},
            {label: '模板高度', name: 'hight', index: 'hight', width: 80},*/
            {label: '排序', name: 'sort', index: 'sort', width: 80},
            {
                label: '状态',
                name: 'status',
                index: 'status',
                width: 80,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == 1) {
                        return "<font color='blue'>正在编辑</font>"
                    }
                    return "<font color='red'>编辑完成</font>"
                }
            },
            {label: '描述', name: 'description', index: 'description', width: 80},
        /*    {label: '模板', name: 'templateId', index: 'templateId', width: 80},*/
            {
                label: '是否使用图片',
                name: 'isUsePic',
                index: 'isUsePic',
                width: 80,
                formatter: function (cellValue, options, rowObject) {
                    if (cellValue == 1) {
                        return "<font color='blue'>使用</font>"
                    }
                    return "<font color='red'>不使用</font>"
                }
            },
            {label: '创建时间', name: 'createTime', index: 'createTime', width: 80},
            {label: '修改时间', name: 'updateTime', index: 'updateTime', width: 80},
            {
                label: '操作', name: 'id', index: 'id', width: 120, formatter: function (cellValue, options, rowObject) {
                var actionHtml;
                if (rowObject.titleLevel == 1) {
                    actionHtml = "<a class='btn btn-primary' onclick='vm.secondTitle(" + rowObject.id + ");'>&nbsp;二级标题</a>&nbsp;&nbsp;"
                }
                if (rowObject.titleLevel == 2) {
                        actionHtml = "<a class='btn btn-primary' onclick='vm.createTemplate(" + rowObject.id + "," + rowObject.templateId + ");'>&nbsp;编辑模板</a>&nbsp;&nbsp;"

                }
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
        postData: {
            launcherid: launcherid,
            titleLevel: titleLevel,
            parentId: parentId
        },
        gridComplete: function () {
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });
    $('#uiTitleIconUnfocus').uploadifive(uiTitleIconUnfocusUploadSetting);
    $('#uiTitleIconFocus').uploadifive(uiTitleIconFocusUploadSetting);
    $('#uiTitleIconSelected').uploadifive(uiTitleIconSelectedUploadSetting);

});

var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: true,
        title: null,
        uiTitle: {},
        navTitle: navTitle,
        launcherid: launcherid,
        titleLevel: titleLevel,
        parentId: parentId,
        templateItems:[]
    },
    methods: {
        query: function () {
            vm.reload();
        },
        loadtemplateItems: function () {
            $.ajax({
                type: "GET",
                url: baseURL + "uipaneltemplate/queryAllNames",
                contentType: "application/json",
                success: function (r) {
                    if (r.status === 0) {
                        console.log(r);
                        vm.templateItems = r.data;
                    } else {
                        alert("加载模板下拉框信息失败");
                    }
                }
            });

        },
        backward: function () {
            history.back(-1);
        },
        add: function () {
            vm.loadtemplateItems();
            vm.showList = false;
            if (titleLevel == 1) {
                vm.title = "新增一级标题";
                vm.titleLevel = 1;
            } else {
                vm.title = "新增二级标题";
                vm.titleLevel = 2;
            }
        },
        update: function (event) {
            var id = getSelectedRow();
            if (id == null) {
                return;
            }
            vm.loadtemplateItems();
            vm.showList = false;
            if (titleLevel == 1) {
                vm.title = "修改一级标题";
            } else {
                vm.title = "修改二级标题";
            }

            vm.getInfo(id)
        },
        saveOrUpdate: function (event) {
            vm.uiTitle.parentId = parentId;
            vm.uiTitle.launcherid = launcherid;
            vm.uiTitle.titleLevel = titleLevel;
            var data = JSON.stringify(vm.uiTitle);
            console.log(data);
            var url = vm.uiTitle.id == null ? "uititle/save" : "uititle/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: data,
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
                    url: baseURL + "uititle/delete",
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
            $.get(baseURL + "uititle/info/" + id, function (r) {
                vm.uiTitle = r.uiTitle;
            });
        },
        reload: function (event) {
            vm.showList = true;
            vm.chooseTemplateTag = false;
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            $("#jqGrid").jqGrid('setGridParam', {
                page: page
            }).trigger("reloadGrid");
        },
        secondTitle: function (id) {

            var data = {
                parentId: id,
                titleLevel: 2,
                launcherid: launcherid

            };
            window.location.href = baseURL + "/admin/app/uititle.html?" + $.param(data);

        },
        createTemplate: function (id, templateId) {
            var data = {
                // 根据 titleid 查找 cells
                titleid: id,
                titleLevel: 2,
                launcherid: launcherid,
                templateId: templateId
            };
            window.location.href = baseURL + "/admin/app/createTemplate.html?" + $.param(data);
        }
    }
});

var main = {
    uiTitleIconFocusCallback: function (file, data) {
        var jsonObj = JSON.parse(data);
        var status = jsonObj.status;
        var msg = jsonObj.msg;
        if (status == 0) {
            var fileName = file.name;
            var filePath = jsonObj.filePath;
            vm.uiTitle.iconfocus = filePath;
            $("#uiTitleIconFocusSrc").attr("src", baseURL + '/file/download?fullPath=' + filePath);
            $("#uiTitleIconFocusSrc").css("display", "block");
            alert('图片：' + fileName + '上传成功');
        } else if (status = 1) {
            alert(msg);
        } else if (status == 2) {
            alert(msg);
        }
    },
    uiTitleIconUnfocusCallback: function (file, data) {
        var jsonObj = JSON.parse(data);
        var status = jsonObj.status;
        var msg = jsonObj.msg;
        if (status == 0) {
            var fileName = file.name;
            var filePath = jsonObj.filePath;
            vm.uiTitle.iconunfocus = filePath;
            $("#uiTitleIconUnfocusSrc").attr("src", baseURL + '/file/download?fullPath=' + filePath);
            $("#uiTitleIconUnfocusSrc").css("display", "block");
            alert('图片：' + fileName + '上传成功');
        } else if (status = 1) {
            alert(msg);
        } else if (status == 2) {
            alert(msg);
        }
    },
    uiTitleIconSelectedCallback: function (file, data) {
        var jsonObj = JSON.parse(data);
        var status = jsonObj.status;
        var msg = jsonObj.msg;
        if (status == 0) {
            var fileName = file.name;
            var filePath = jsonObj.filePath;
            vm.uiTitle.iconselected = filePath;
            $("#uiTitleIconSelectedSrc").attr("src", baseURL + '/file/download?fullPath=' + filePath);
            $("#uiTitleIconSelectedSrc").css("display", "block");
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