$(function () {
	skyworthbox.initApplist();
    $("#jqGrid").jqGrid({
        url: baseURL + 'admin/tbapptcmap/list',
        datatype: "json",
        colModel: [			
			{ label: 'id', name: 'id', index: 'id', width: 50, key: true },
			{ label: '应用ID', name: 'id', index: 'id', width: 40 }, 			
			{ label: '应用名称', name: 'aliasName', index: 'aliasName', width: 80 }, 			
			{ label: '图片', name: 'siconPath', index: 'siconPath', width: 80,formatter:function(cellValue,options,rowObject){  
				var	imgUrl = '<img src="'+baseURL + '/file/download?fullPath='+ rowObject.siconPath+'" style="width:50px;height:25px;"/>';
	            return imgUrl;
			} },	
			{ label: '操作', name: 'id', index: 'id', width: 120,formatter:function(cellValue,options,rowObject){  
                return "<a  class='btn btn-danger btn-xs' onclick='vm.delApp("+rowObject.id+");'>删除</a>";
			} }
        ],
        height: 385,
        rowNum: 10,
		rowList : [10,30,50],
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
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-y" : "hidden" }); 
        }
    });
    vm.loadDevicetype();
});

var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true
	},
	methods: {
		query: function () {
			vm.reload();
		},
		editAllApp:function(){
			confirm('确定要添加该渠道关联所有应用？', function(){
				loading("加载中，请稍后...");
				var url = "admin/tbapptcmap/editAllApp";
				$.ajax({
					type: "POST",
				    url: baseURL + url,
				    datatype: "json",
				    data: {
				    	deviceTypeId:$("#deviceTypeId").val(),
						customerId:$("#customerId").val()
				    },
				    success: function(r){
				    	if(r.status == 0){
							alert('关联成功', function(index){
								closeLoading();
								vm.reload();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		cancelAllApp:function(){
			confirm('确定要取消该渠道下关联的所有应用？', function(){
				var url = "admin/tbapptcmap/cancelAllApp";
				$.ajax({
					type: "POST",
				    url: baseURL + url,
				    datatype: "json",
				    data: {
				    	deviceTypeId:$("#deviceTypeId").val(),
						customerId:$("#customerId").val()
				    },
				    success: function(r){
				    	if(r.status == 0){
							alert(r.msg, function(index){
								vm.reload();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
			
		},
		delApp: function(appid){
			confirm('确定要删除选中的应用？', function(){
				var url = "admin/tbapptcmap/delApp";
				$.get(baseURL + url,{appid:appid,deviceTypeId:$("#deviceTypeId").val(),customerId:$("#customerId").val()},
						function(r){
					if(r.status == 0){
						alert(r.msg, function(index){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				});
				
			});
		},
		reload: function (event) {
			var param = {
					name:$("#name").val(),
					deviceTypeId:$("#deviceTypeId").val(),
					customerId:$("#customerId").val()
			}
			$("#jqGrid").jqGrid('setGridParam',{ 
                page:1,
                postData:param
            }).trigger("reloadGrid");
		},
		/**加载型号*/
		loadDevicetype: function(){
			$.get(baseURL + "devicetype/query",function(r){
				var optionhtml = '';
		    	for(var i in r.deviceTypeList){
		    		optionhtml += '<option value="'+r.deviceTypeList[i].devicetypeid+'">'+r.deviceTypeList[i].devicetype+'</option>'
				}
		    	$("#deviceTypeId").html(optionhtml);
                vm.loadCustomer();
            });
		},
		/**加载渠道*/
		loadCustomer:function(){
			var devicetypeid = $("#deviceTypeId").val();
			$.get(baseURL + "typecustomermap/info/"+devicetypeid, function(r){
					var optionhtml = '';
			    	for(var i in r.customerMaps){
			    		optionhtml += '<option value="'+r.customerMaps[i].customerid+'">'+r.customerMaps[i].customername+'</option>'
					}
			    	$("#customerId").html(optionhtml);
	        });
			
		},
		devidetypeSelect: function(){
			vm.loadCustomer();
		}
		
	}
});

/**批量添加*/
function addBatch(){
	var appIds = getAppSelectedRows();
	if(appIds == null || appIds == undefined || appIds.length < 1){
		alert("请至少选择一条记录");
		return ;
	}
	loading("正在保存，请稍后...");
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/tbapptcmap/save',
		data:{
			"appIds":appIds.toString(),
			"deviceTypeId":$("#deviceTypeId").val(),
			"customerId":$("#customerId").val()
		},
		dataType : 'json',
	    success: function(r){
	    	closeLoading();
	    	if(r.status === 0){
	    		alert(r.msg, function(index){
	    			vm.reload();
				});
			}
		},
		error : function(r) {
			alert(r.msg, function(index){
				closeLoading();
			});
		}
	});
}
/**单个添加*/
function add(appId){
	loading("正在保存，请稍后...");
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/tbapptcmap/save',
		data:{
			"appIds":appId,
			"deviceTypeId":$("#deviceTypeId").val(),
			"customerId":$("#customerId").val()
		},
		dataType : 'json',
	    success: function(r){
	    	closeLoading();
	    	if(r.status === 0){
	    		alert(r.msg, function(index){
	    			vm.reload();
				});
			}
		},
		error : function(r) {
			alert(r.msg, function(index){
				closeLoading();
			});
		}
	});
}