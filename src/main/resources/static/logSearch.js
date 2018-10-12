$(function() {
	$("#jqGrid").jqGrid({
			url : baseURL + 'api/searchLogList',
			datatype : "json",
			colModel : [
					{
						label : '应用ID',
						name : 'appid',
						index : 'appid',
						width : 30
					},
					{
						label : '应用名称',
						name : 'appname',
						index : 'appname',
						width : 40
					},
					{
						label : '渠道',
						name : 'customerid',
						index : 'customerid',
						width : 40
					},
					{
						label : '时间',
						name : 'createtime',
						index : 'createtime',
						width : 30
					},
					{
						label : '操作',
						name : 'appid',
						index : 'appid',
						width : 18,
						key : true,
						formatter : function(cellValue, options,
								rowObject) {
							var actionHtml = "<a class='btn btn-primary' onclick='vm.del("
									+ cellValue
									+ ");'>&nbsp;删除</a>";
							return actionHtml;
						}
					} ],
			viewrecords : true,
			height : 385,
			rowNum : 10,
			rowList : [ 10, 30, 50 ],
			rownumWidth : 40,
			autowidth : true,
			multiselect : true,
			pager : "#jqGridPager",
			jsonReader : {
				root : "page.list",
				page : "page.currPage",
				total : "page.totalPage",
				records : "page.totalCount"
			},
			prmNames : {
				page : "page",
				rows : "limit",
				order : "order"
			},
			gridComplete : function() {
	
			}
		});
	vm.loadCustomerList();
    vm.loadDeviceTypeList();
    vm.loadClassTypeList();
	$('.form_date').datetimepicker({
		language : 'zh-CN',
		weekStart : 1,
		todayBtn : 1,
		autoclose : 1,
		todayHighlight : 1,
		startView : 2,
		minView : 2,
		forceParse : 0
	});
});

var vm = new Vue({
	el : '#rrapp',
	data : {
		showList : true,
		tbApp : {
			startlevel : 1,
			safecert : 0,
			review : 0,
			beecoin : 0,
			weicoin : 0,
			controlstyle : [],
			visualdownloadnum : 0,
			upnum : 0,
			classIds : [],
			appVersionEntity : {}
		},
		tbClass : {
			firstClassList : [],
			secondClassList : [],
			secondClassId : []
		},
		tbAppVersion : {
			upgradetype : 0,
			upgradeall : 1
		},
		queryParam : {
			customerList : [],
			deviceTypeList:[],
			classTypeList:[]
		}
	},
	methods : {
		query : function() {
			vm.reload();
		},
		excelExport : function(event) {
			var appName = $("#appName").val();
			var customerId = $("#customerId").val();
			var startDate = $("#startDate").val();
			var endDate = $("#endDate").val();
			window.location.href = "/appstore/api/exportSearchLog?appName="
					+ appName + "&&customerId=" + customerId + "&&startDate="
					+ startDate + "&&endDate=" + endDate;
		},
		del : function(event) {
			var ids = getSelectedRows();
			if (ids == null) {
				return;
			}
			confirm('确定要删除选中的记录？', function() {
				$.ajax({
					type : "POST",
					url : baseURL + 'api/delSearchLog',
					contentType : "application/json",
					data : JSON.stringify(ids),
					success : function(r) {
						if (r.code == 0) {
							alert('操作成功', function(index) {
								vm.reload();
							});
						} else {
							alert(r.msg);
						}
					}
				});
			});
		},
		reload : function(event) {
			var queryParam = {
				appName : $("#appName").val(),
				customerId : $("#customerId").val(),
				startDate : $("#startDate").val(),
				endDate : $("#endDate").val()
			};
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam', 'page');
			$("#jqGrid").jqGrid('setGridParam', {
				page : page,
				postData : queryParam
			}).trigger("reloadGrid");
		},
		loadCustomerList: function(){
			$.get(baseURL + "api/queryCustomerList",function(data){
				for (var i = 0; i < data.length; i++) {
					var customer = {};
					customer.customerId = data[i].customerid;
					customer.customerName = data[i].customername;
					vm.queryParam.customerList.push(customer);
				}
            });
		},
		loadDeviceTypeList: function(){
			$.get(baseURL + "api/queryDeviceTypeList",function(data){
				for (var i = 0; i < data.length; i++) {
					var deviceType = {};
					deviceType.id = data[i].id;
					deviceType.deviceType = data[i].devicetype;
					vm.queryParam.deviceTypeList.push(deviceType);
				}
			});
		},
		loadClassTypeList: function(){
			$.get(baseURL + "api/queryClassTypeList",function(data){
				for (var i = 0; i < data.length; i++) {
					var classType = {};
					classType.classId = data[i].classid;
					classType.className = data[i].classname;
					vm.queryParam.classTypeList.push(classType);
				}
			});
		}
	}
});
