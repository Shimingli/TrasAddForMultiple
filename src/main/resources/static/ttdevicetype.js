$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'devicetype/list',
        datatype: "json",
        colModel: [
			{ label: '型号id', name: 'devicetypeid', index: 'deviceTypeId', width: 80 },
			{ label: '型号名称', name: 'devicetype', index: 'deviceType', width: 80 },
			{ label: '型号描述', name: 'devicetypedesc', index: 'deviceTypeDesc', width: 80 },
            { label: '操作', name: 'opt', width:60,
                formatter: function (value, grid, rows, state) {
                    return '<a class="btn btn-default" onclick="edit('+ rows.id +')">修改</a>'
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

Vue.use(window.vuelidate.default);
var required = window.validators.required;

var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true,
		title: null,
		ttDevicetype: {
            devicetypeid: '',
            devicetype: '',
            devicetypedesc: ''
		},
        readonly: "",
        deviceTypeId: "",
        deviceTypeName: "",
		label: {
            id: '型号id',
            name: '型号名称',
            desc: '型号描述'
		}
	},
    validations: {
	    ttDevicetype: {
	        required: required,
            devicetypeid: {
                required: function (text) {
                    var reg = /^\d{4}$/;
                    return reg.test(text);
                }
            },
            devicetype: {
	            required: required
            },
            devicetypedesc: {

            }
        }
    },
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.readonly = null;

            vm.ttDevicetype.devicetypeid = "";
			vm.ttDevicetype.devicetype = "";
			vm.ttDevicetype.devicetypedesc = "";
		},
		update: function (event) {
			var id = getSelectedRow();
			if(id == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            vm.readonly = "readonly";

            vm.getInfo(id)
		},
		saveOrUpdate: function (validate) {

		    validate.$touch();//验证所有信息

            if (validate.$error) {
                console.log("验证失败");
                return;
            }

            var url = vm.ttDevicetype.id == null ? "devicetype/save" : "devicetype/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.ttDevicetype),
			    success: function(r){
				    console.log("r.status: " + r.status);
				    console.log("r.msg: " + r.msg);
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
				    url: baseURL + "devicetype/delete",
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
		getInfo: function(id){
			$.get(baseURL + "devicetype/info/"+id, function(r){
                vm.ttDevicetype = r.ttDevicetype;
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
                postData:{
                	'deviceTypeId': vm.deviceTypeId,
					'deviceType': vm.deviceTypeName
				},
                page:page
            }).trigger("reloadGrid");
		}
	}
});

function edit(id) {
    if(id == null){
        return ;
    }
    vm.showList = false;
    vm.title = "修改";
    vm.readonly = "readonly";

    vm.getInfo(id);
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
            url: baseURL + "devicetype/delete",
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