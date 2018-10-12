$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + '/admin/switch/list',
        datatype: "json",
        colModel: [			
			{ label: 'id', name: 'id', index: 'id', width: 50, key: true },
			{ label: '应用包名', name: 'packagename', index: 'packageName', width: 80 }, 
			{ label: '开关类型', name: 'switchname', index: 'switchName', width: 80 }, 	
			{ label: '最小版本号', name: 'startcode', index: 'startCode', width: 80 }, 			
			{ label: '最大版本号', name: 'endcode', index: 'endCode', width: 80 }, 			
			{ label: '状态', name: 'open', index: 'open', width: 80 ,formatter:function(cellValue,options,rowObject){  
				if(cellValue == 0){
					return "关闭";
				}else{
					return "打开";
				}
			} }, 			
			{ label: '操作', name: 'id', index: 'id', width: 120,formatter:function(cellValue,options,rowObject){  
                var html = "<a  class='btn btn-primary' onclick='vm.edit("+rowObject.id+");'>编辑</a>";
				return html;
			} }
        ],
		viewrecords: true,
        height: 385,
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

var setting = {
		data: {
			simpleData: {
				enable: true,
				idKey: "id",
				pIdKey: "pId",
				rootPId: -1
			},
			key: {
				url:"nourl"
			}
		},
		check:{
			enable:true,
			nocheckInherit:true
		}
	};
var ztree;
var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true,
		title: "开关数据编辑",
		rule:{
			zNodes:[],
			oldNodes:[]
		}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function () {
			vm.showList = false;
            vm.loadSwitchTcmapInfo(null);
		},
		edit: function (id) {
			vm.showList = false;
            vm.getInfo(id);
            vm.loadSwitchTcmapInfo(id);
		},
		del: function () {
			var ids = getSelectedRows();
			if(ids == null){
				return ;
			}
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "admin/switch/delete",
                    contentType: "application/json",
				    data: JSON.stringify(ids),
				    success: function(r){
				    	alert(r.msg, function(index){
							$("#jqGrid").trigger("reloadGrid");
						});
					}
				});
			});
		},
		saveOrUpdate: function (event) {
			loading("加载中，请稍后...");
			var delNodes = [];
			var addNodes = [];
			var newNodes = ztree.getNodesByFilter(function(node){
            	if(node.level == 2 && node.checked == true){
            		return true;
            	}
            });
			var oldNodes = vm.rule.oldNodes;
			//获取删除应用
			for(var i in oldNodes){
				var exit = false;
				for(var j in newNodes){
					if(newNodes[j].pId == oldNodes[i].deviceTypeId && newNodes[j].id == oldNodes[i].customerId){
						exit = true;
						break;
					}
				}
				if(!exit){
					delNodes.push(oldNodes[i].id);
				}
			} 
			
			for(var i in newNodes){
				var node =  newNodes[i].pId+"_"+newNodes[i].id;
				addNodes.push(node);
			}
			var param = {
					addNodes:addNodes.toString(),
					delNodes:delNodes.toString(),
					switchId:vm.rule.switchId,
					switchName:$("#switchName").val(),
					startCode:$("#startCode").val(),
					endCode:$("#endCode").val(),
					packageName:$("#packageName").val(),
					open:$("#open").val()
			};
			var url = vm.rule.switchId == null ? "admin/switch/save" : "admin/switch/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                dataType: "json",
			    data: param,
			    success: function(r){
			    	if(r.status == 0){
						alert('提交成功', function(index){
							closeLoading();
							vm.reload();
						});
					}else{
						alert(r.msg);
						closeLoading();
					}
				}
			});
		},
		reload: function (event) {
			vm.showList = true;
			var queryParam = {
					appName:$("#appName").val()
			}
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{ 
                page:page,
                postData:queryParam
            }).trigger("reloadGrid");
		},
		getInfo: function(id){
			$.get(baseURL + "/admin/switch/info/"+id, function(r){
                var switchEntity = r.switchEntity;
                $("#startCode").val(switchEntity.startcode);
                $("#endCode").val(switchEntity.endcode);
                $("#packageName").val(switchEntity.packagename);
                $("#open").val(switchEntity.open);
                $("#switchName").val(switchEntity.switchname);
            });
		},
		loadSwitchTcmapInfo: function(switchId) {
			vm.rule.switchId = switchId;
			//加载型号树
			$.when(
		            $.getJSON(baseURL + "typecustomermap/queryAll"),
		            $.getJSON(baseURL + "admin/switch/listSwitchTc", {switchId: switchId})
		    	).done(function(r,result){
		    		var customerMaps = r[0].customerMaps;
		    		vm.rule.oldNodes = result[0].switchTcmaps;
		    		var arr = new Array();
					vm.zNodes = [{id:0, 
										pId:0, 
										name:"全部", 
										open:true
										}];
					for(var i in customerMaps){
						var devicetypeid = customerMaps[i].devicetypeid;
						var devicetype = customerMaps[i].devicetype;
						var customerid = customerMaps[i].customerid;
						var customername = customerMaps[i].customername;
						if(!isInArray(arr, devicetypeid)){
							var zDevicetypeNode = {
									id:devicetypeid, 
									pId:0, 
									name:devicetype,
									file:"core/standardData"
									};
							vm.zNodes.push(zDevicetypeNode);
							arr.push(devicetypeid);
							for(var j in vm.rule.oldNodes){
								if(vm.rule.oldNodes[j].deviceTypeId == devicetypeid){
									zDevicetypeNode.checked = true;
								}
							}
						}
						var zCustomerNode = {
								id:customerid, 
								pId:devicetypeid, 
								name:customername,
								file:"core/standardData"
								};
						vm.zNodes.push(zCustomerNode);
						for(var j in vm.rule.oldNodes){
							if(vm.rule.oldNodes[j].deviceTypeId == devicetypeid && vm.rule.oldNodes[j].customerId == customerid){
								zCustomerNode.checked = true;
								break;
							}
						}
					}
					ztree = $.fn.zTree.init($("#modelTree"), setting, vm.zNodes);
					//折叠所有节点
					ztree.expandAll(false);
		    	});
	    }
	}
});