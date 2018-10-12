$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'customer/list',
        datatype: "json",
        colModel: [
			{ label: '渠道id', name: 'customerid', index: 'customerId', width: 80 },
			{ label: '渠道名称', name: 'customername', index: 'customerName', width: 80 },
			{ label: '渠道描述', name: 'customerdesc', index: 'customerDesc', width: 80 },
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

var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true,
		title: null,
		ttCustomer: {
            customerid: '',
            customername: '',
            customerdesc: ''
        },
		readonly: "",
        customerId: "",
        customerName: "",
        label: {
            id: '渠道id',
            name: '渠道名称',
            desc: '渠道描述'
        }
	},
	methods: {
		query: function () {
			vm.reload();
		},
        clear: function () {
            vm.customerId = "";
            vm.customerName = "";
        },
		add: function(){
			vm.showList = false;
			vm.title = "新增";
            vm.readonly = null;
			vm.ttCustomer.customerid = '';
			vm.ttCustomer.customername = '';
			vm.ttCustomer.customerdesc = '';
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
		saveOrUpdate: function (event) {
			var url = vm.ttCustomer.id == null ? "customer/save" : "customer/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.ttCustomer),
			    success: function(r){
			    	if(r.status === 0){
						alert('操作成功', function(index){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		del: function (event) {
			var ids = getSelectedRows();
            console.log(ids);
			if(ids == null){
				return ;
			}

			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "customer/delete",
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
			$.get(baseURL + "customer/info/"+id, function(r){
                vm.ttCustomer = r.ttCustomer;
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
				postData: {
					'customerId': vm.customerId,
					'customerName': vm.customerName
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
            url: baseURL + "customer/delete",
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