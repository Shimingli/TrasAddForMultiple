$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'admin/tbapp/queryAppTcmapList',
        datatype: "json",
        colModel: [			
			{ label: '应用ID', name: 'id', index: 'id', width: 50, key: true },
			{ label: '应用名称', name: 'aliasname', index: 'aliasname', width: 120 }, 			
			{ label: '应用版本', name: 'appVersionEntity.versionname', index: 'versionname', width: 120 }, 			
			{ label: '发布状态', name: 'appVersionEntity.publish', index: 'publish', width: 40,formatter:function(cellValue,options,rowObject){  
				if(cellValue == 1){
                	return "上架";
                }else{
                	return "下架";
                }
			} },	
			{ label: '操作', name: 'id', index: 'id', width: 120,formatter:function(cellValue,options,rowObject){  
				
                return "<a  class='btn btn-primary btn-xs' onclick='vm.editApp("+rowObject.id+",\""+rowObject.aliasname+"\");'>编辑机型</a>";
			} }
        ],
		viewrecords: true,
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
		showList: false,
		title: null,
		rule:{
			zNodes:[],
			oldNodes:[]
		}
		
	},
	methods: {
		query: function () {
			vm.reload();
		},
		editApp: function (id,appName) {
			vm.title = appName;
			vm.showList = true;
            vm.getInfo(id);
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
				var node = vm.rule.appid +"_"+newNodes[i].pId+"_"+newNodes[i].id;
				addNodes.push(node);
			}
			var param = {
					addNodes:addNodes.toString(),
					delNodes:delNodes.toString()
			};
			var url = "admin/tbapptcmap/saveAppTcmap";
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
			vm.showList = false;
			var queryParam = {
					appName:$("#appName").val()
			}
			$("#jqGrid").jqGrid('setGridParam',{ 
                page:1,
                postData:queryParam
            }).trigger("reloadGrid");
		},
		getInfo: function(appId) {
			vm.rule.appid = appId;
			//加载型号树
			$.when(
		            $.getJSON(baseURL + "typecustomermap/queryAll"),
		            $.getJSON(baseURL + "admin/tbapptcmap/listAppTc", {appId: appId})
		    	).done(function(r,result){
		    		var customerMaps = r[0].customerMaps;
		    		vm.rule.oldNodes = result[0].appTcmaps;
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