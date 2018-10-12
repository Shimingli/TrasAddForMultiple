$(function () {

    $("#jqGrid").jqGrid({
        url: baseURL + 'tttcgroup/list',
        datatype: "json",
        colModel: [
			{ label: 'id', name: 'id', index: 'id', width: 60 },
			{ label: '用户Id', name: 'userid', index: 'userId', width: 80 },
			{ label: '分组名称', name: 'groupname', index: 'groupName', width: 80 },
			{ label: '分组描述', name: 'groupdesc', index: 'groupDesc', width: 80 },
			{ label: '创建时间', name: 'createtime', index: 'createTime', width: 80 },
            { label: '操作', name: 'opt', width:60,
                formatter: function (value, grid, rows, state) {
                    return '<a class="btn btn-default" onclick="detail('+ rows.id +')">详细</a>'
                        + '&nbsp;&nbsp;'
                        + '<a class="btn btn-default" onclick="edit('+ rows.id +')">修改</a>'
						+ '&nbsp;&nbsp;'
						+ '<a class="btn btn-default" onclick="del('+ rows.id +')">删除</a>';
                }
            }
        ],
		viewrecords: true,
        height: 540,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader : {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames : {
            page:"page", 
            rows:"limit", 
            order: "order"
        },
        gridComplete:function(){
        	//隐藏grid底部滚动条
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        }
    });
});

var vm = new Vue({
	el:'#rrapp',
	data:{
		// 控制页面展示的data
        title: null,
		showList: true,
		modeAdd: false,
		modeEdit: false,
        groupReadable: null,
        groupDesReadable: null,

        // 表示分组的data
		ttTcgroup: {
			id: null,
			userid: '',
			groupname: '',
			groupdesc: '',
			relationList: []
		},

        // 查询data
        queryGroupName: '',

        // select相关的data
        deviceTypeList: [],
        deviceTypeSelected: '',
        customerMaps: [],
        customerSelected: ''
	},
    watch: {
        deviceTypeSelected: function(deviceTypeId) {
            console.log("devicetTypeId: " + deviceTypeId);
            $.get(baseURL + "typecustomermap/info/" + deviceTypeId, function (r) {
                if (r.status === 0) {
                	console.log("set customer select");
                    vm.customerMaps = r.customerMaps;
                    vm.customerSelected = '';
                } else {
                    alert(r.msg);
                }
            });
        }
    },
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
            vm.title = "新增";
            vm.showList = false;
            vm.modeAdd = true;
            vm.modeEdit = false;
            vm.groupReadable = null;
			vm.groupDesReadable = null;

            ttTcgroup = vm.initGroup();

            initDeviceTypeSelect();
		},
		update: function (event) {
			var id = getSelectedRow();
			if(id == null){
				return ;
			}

			edit(id);
		},
		saveOrUpdate: function (event) {
			var url = vm.ttTcgroup.id == null ? "tttcgroup/save" : "tttcgroup/update";

			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.ttTcgroup),
			    success: function(r){
			    	if(r.status === 0){
						alert('操作成功', function(index){
							vm.reload();
							vm.showList = true;
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
        del: function (event) {
            var ids = getSelectedRows();
            if(ids == null){
                return ;
            }

            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "tttcgroup/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function(r){
                        if(r.status == 0){
                            alert('操作成功', function(index){
                                $("#jqGrid").trigger("reloadGrid");
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        reload: function (event) {
            vm.showList = true;
            var grid = $('#jqGrid');
            var page = grid.jqGrid('getGridParam','page');
            grid.jqGrid('setGridParam',{
                postData: {
                    'groupName': vm.queryGroupName
                },
                page: page
            }).trigger("reloadGrid");

            vm.ttTcgroup = vm.initGroup();
        },
        initGroup: function () {
          return {
              id: null,
              userid: '',
              groupname: '',
              groupdesc: '',
              relationList: []
          };
        },
        addRelation: function () {
            var deviceTypeSelect = document.getElementById('deviceTypeSelect');
            var deviceTypeIndex = deviceTypeSelect.selectedIndex;
            if (deviceTypeIndex === -1) {
                alert("请选择关联渠道");
                return;
            }
            var deviceTypId = deviceTypeSelect.options[deviceTypeIndex].value;
            var deviceType = deviceTypeSelect.options[deviceTypeIndex].text;

            var customerSelect = document.getElementById('customerSelect');
            var customerIndex = customerSelect.selectedIndex;
            if (customerIndex === -1) {
                alert("请选择关联渠道");
                return;
            }
            var customerId = customerSelect.options[customerIndex].value;
            var customer = customerSelect.options[customerIndex].text;

            vm.ttTcgroup.relationList.push({devicetypeid: deviceTypId, devicetype: deviceType, customerid: customerId, customername: customer});
        },
		deleteRelation: function (index) {
            vm.ttTcgroup.relationList.splice(index, 1);
        }
	}
});

function initDeviceTypeSelect() {
    $.get(baseURL + "devicetype/query", function (r) {
        if (r.status === 0) {
            vm.deviceTypeList = r.deviceTypeList;
            vm.deviceTypeIdSelected = '';
        } else {
            alert(r.msg);
        }
    });
}

function getGroupData() {
    $.get(baseURL + "tttcgroup/info/" + vm.ttTcgroup.id, function (r) {
        if (r.status === 0) {
            vm.ttTcgroup = r.ttTcgroup;
            if (typeof(vm.ttTcgroup.relationList) === "undefined") {
                vm.ttTcgroup.relationList = [];
            }
        } else {
            alert(r.msg);
        }
    });
}

function detail(id) {
	vm.title = "详情";
	vm.showList = false;
	vm.modeAdd = false;
	vm.modeEdit = false;
    vm.groupReadable = "readonly";
    vm.groupDesReadable = "readonly";

    var grid = $('#jqGrid');
    vm.ttTcgroup.id = grid.jqGrid('getCell', id, 'id');
    vm.ttTcgroup.groupname = grid.jqGrid('getCell', id, 'groupname');

    console.log("groupIdSelected: " + vm.ttTcgroup.id);
    console.log("groupNameSelected: " + vm.ttTcgroup.groupname);

    getGroupData();
}

function edit(id) {
    vm.title = "修改";
    vm.showList = false;
    vm.modeAdd = false;
    vm.modeEdit = true;
    vm.groupReadable = "readonly";
    vm.groupDesReadable = null;

    var grid = $('#jqGrid');
    vm.ttTcgroup.id = grid.jqGrid('getCell', id, 'id');
    vm.ttTcgroup.groupname = grid.jqGrid('getCell', id, 'groupname');

    console.log("groupIdSelected: " + vm.ttTcgroup.id);
    console.log("groupNameSelected: " + vm.ttTcgroup.groupname);

    initDeviceTypeSelect();
    getGroupData();
}

function del(id) {
    if(id == null){
        return ;
    }

    var ids = [];
    ids.push(id);

    confirm('确定要删除记录？', function(){
        $.ajax({
            type: "POST",
            url: baseURL + "tttcgroup/delete",
            contentType: "application/json",
            data: JSON.stringify(ids),
            success: function(r){
                if(r.status == 0){
                    alert('操作成功', function(index){
                        $("#jqGrid").trigger("reloadGrid");
                    });
                }else{
                    alert(r.msg);
                }
            }
        });
    });
}
