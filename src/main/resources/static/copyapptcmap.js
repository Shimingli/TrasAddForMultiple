$(function () {
    vm.loadZTree();
    vm.loadDevicetype();
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
			zNodes:[]
		}
		
	},
	methods: {
		save: function (event) {
			confirm('确定复制选中的渠道？', function(){
				loading("加载中，请稍后...");
				var addNodes = [];
				var newNodes = ztree.getNodesByFilter(function(node){
	            	if(node.level == 2 && node.checked == true){
	            		return true;
	            	}
	            });
				for(var i in newNodes){
					var node = newNodes[i].pId+"_"+newNodes[i].id;
					addNodes.push(node);
				}
				if(addNodes.length == 0){
					alert("请至少选择一个机型!");
					return;
				}
				var param = {
						addNodes:addNodes.toString(),
						sourceDevicetypeId:$("#deviceTypeId").val(),
						sourceCustomerId:$("#customerId").val()
				};
				var url = "admin/tbapptcmap/copyAppTcmap";
				$.ajax({
					type: "POST",
				    url: baseURL + url,
	                dataType: "json",
				    data: param,
				    success: function(r){
				    	if(r.status == 0){
							alert(r.msg, function(index){
								closeLoading();
							});
						}else{
							alert(r.msg);
							closeLoading();
						}
					}
				});
			});
			
		},
		
		loadZTree: function() {
			//加载型号树
			$.get(baseURL + "typecustomermap/queryAll",function(r){
				var customerMaps = r.customerMaps;
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
					if(devicetypeid == $("#devicetypeid").val() && customerid == $("#customerid").val()){
						continue;
					}
					if(!isInArray(arr, devicetypeid)){
						var zDevicetypeNode = {
								id:devicetypeid, 
								pId:0, 
								name:devicetype,
								file:"core/standardData"
								};
						vm.zNodes.push(zDevicetypeNode);
						arr.push(devicetypeid);
					}
					var zCustomerNode = {
							id:customerid, 
							pId:devicetypeid, 
							name:customername,
							file:"core/standardData"
							};
					vm.zNodes.push(zCustomerNode);
				}
				ztree = $.fn.zTree.init($("#modelTree"), setting, vm.zNodes);
				//折叠所有节点
				ztree.expandAll(false);
			});
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