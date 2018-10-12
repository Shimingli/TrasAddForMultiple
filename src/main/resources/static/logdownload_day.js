$(function() {
	$("#jqGrid").jqGrid({
		url : baseURL + 'api/dayDownloadList',
		datatype : "json",
		colModel : [ {
			label : 'App ID',
			name : 'appid',
			index : 'appid',
			width : 30,
			key : true
		}, {
			label : '应用名称',
			name : 'appname',
			index : 'appname',
			width : 50
		}, {
			label : '渠道',
			name : 'customerid',
			index : 'customerid',
			width : 30
		}, {
			label : '下载类型',
			name : 'source',
			index : 'source',
			width : 30
		}, {
			label : '时间',
			name : 'downloadDate',
			index : 'downloadDate',
			width : 30
		}, {
			label : '下载次数 /次',
			name : 'countofevent',
			index : 'countofevent',
			width : 30
		} ],
		viewrecords : true,
		height : 385,
		rowNum : 10,
		rowList : [ 10, 30, 50 ],
		rownumWidth : 25,
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

var vm = new Vue(
		{
			el : '#rrapp',
			data : {
				showList : true,
				showLastVersion : true,
				showMinVersion : true,
				showMaxVersion : true,
				title : null,
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
				excelExport : function() {
					var appName = $("#appName").val();
					var customerId = $("#customerId").val();
					var APKsource = $("#APKsource").val();
					var deviceId = $("#deviceId").val();
					var downloadFlag = $("#downloadFlag").val();
					var startDate = $("#startDate").val();
					var endDate = $("#endDate").val()
					window.location.href = "/appstore/api/exportDownloadDayCount?appName="
							+ appName
							+ "&&customerId="
							+ customerId
							+ "&&startDate="
							+ startDate
							+ "&&endDate="
							+ endDate
							+ "&&deviceId="
							+ deviceId
							+ "&&downloadFlag" + downloadFlag;
				},
				del : function(event) {
					var ids = getSelectedRows();
					if (ids == null) {
						return;
					}
					confirm('确定要删除选中的记录？', function() {
						$.ajax({
							type : "POST",
							url : baseURL + "/admin/tbapp/delete",
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
						APKsource : $("#APKsource").val(),
						deviceId : $("#deviceId").val(),
						downloadFlag : $("#downloadFlag").val(),
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
