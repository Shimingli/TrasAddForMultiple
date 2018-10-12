$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + '/admin/tbapp/list',
        datatype: "json",
        colModel: [			
			{ label: '应用ID', name: 'id', index: 'id', width: 30, key: true },
			{ label: '名称', name: 'aliasname', index: 'aliasname', width: 50 ,formatter: function(cellValue,options,rowObject){
				var	apkUrl = '<a href="'+baseURL + '/file/download?fullPath='+ rowObject.appVersionEntity.apkpath+'" title="下载应用">'+rowObject.aliasname+'</a>';
	            return apkUrl;
	        } }, 			
			{ label: '图片', name: 'siconpath', index: 'siconpath', width: 40,formatter: function(cellValue,options,rowObject){
				var	imgUrl = '<img src="'+baseURL + '/file/download?fullPath='+ rowObject.siconpath+'" style="width:50px;height:25px;"/>';
	            return imgUrl;
	        } }, 
	        { label: '一级分类', name: 'classList', index: 'classList', width: 30 ,formatter:function(cellValue,options,rowObject){  
				var classList = rowObject.classList;
				for(var i in classList){
					if(classList[i].classlevel == 1){
						return classList[i].classname;
					}
				}
                return "";
			}}, 
			{ label: '二级分类', name: 'classList', index: 'classList', width: 30 ,formatter:function(cellValue,options,rowObject){  
				var classNames = "";
				var classList = rowObject.classList;
				for(var i in classList){
					if(classList[i].classlevel == 2){
						classNames += classList[i].classname;
						if(i < classList.length - 1){
							classNames += "\n";
						}
					}
				}
                return classNames;
			}}, 			
			{ label: '最新版本', name: 'appVersionEntity.versionname', index: 'versionname', width: 30 }, 			
			{ label: '文件大小', name: 'appVersionEntity.apksize', index: 'apksize', width: 30 }, 			
			{ label: '更新时间', name: 'appVersionEntity.updatetime', index: 'updatetime', width: 50,formatter:function(cellValue,options,rowObject){  
                return (moment(rowObject.updateTime)).format("YYYY-MM-DD HH:mm:ss");
			} }, 			
			{ label: '蜜币', name: 'beecoin', index: 'beecoin', width: 30 }, 			
			{ label: '维币', name: 'weicoin', index: 'weicoin', width: 30 }, 			
			{ label: '发布状态', name: 'appVersionEntity.publish', index: 'publish', width: 30 ,formatter:function(cellValue,options,rowObject){  
                if(cellValue == 1){
                	return "上架";
                }else{
                	return "下架";
                }
			} }, 
			{ label: '广告插件', name: 'appVersionEntity.adflag', index: 'adflag', width: 30 ,formatter:function(cellValue,options,rowObject){ 
                if(cellValue == 1){
                	return "有";
                }else{
                	return "无";
                }
			} }, 
			{ label: '虚拟下载次数', name: 'visualdownloadnum', index: 'visualdownloadnum', width: 30 }, 			
			{ label: '点赞次数', name: 'upnum', index: 'upnum', width: 30 }, 	
			{ label: '版本/升级', name: 'id', index: 'id', width: 60,formatter: function(cellValue,options,rowObject){
				var actionHtml = "<a class='btn btn-primary btn-xs' onclick='vm.listOldAppVersion("+rowObject.id+","+rowObject.appVersionEntity.id+")'>旧版本</a>&nbsp;&nbsp;"
							    +"<a class='btn btn-primary btn-xs' onclick='vm.upgrade("+rowObject.id+")'>升级</a>";
	            return actionHtml;
	        } },
			{ label: '操作', name: 'id', index: 'id', width: 30,formatter: function(cellValue,options,rowObject){
				var actionHtml = "<a class='btn btn-primary btn-xs' onclick='vm.update("+rowObject.id+");'>修改</a>";
	            return actionHtml;
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
        	//隐藏grid垂直滚动条
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-y" : "hidden" }); 
        }
    });
    queryVM.loadDevicetype();
    queryVM.loadFirstClass();
    main.init();
});

var queryVM = new Vue({
	el:'#queryapp',
	data:{
		showList: true,
		title: null
	},
	methods: {
		query: function () {
			queryVM.reload();
		},
		/**获取一级分类*/
		loadFirstClass: function(){
			$.ajax({
				type: "POST",
			    url: baseURL + "/admin/tbclass/queryClassByParams",
			    datatype: "json",
			    data: {classlevel:1},
			    success: function(r){
			    	var optionhtml = '<option value="">全部</option>';
			    	for(var i in r.tbClassList){
			    		optionhtml += '<option value="'+r.tbClassList[i].id+'">'+r.tbClassList[i].classname+'</option>'
					}
			    	$("#firstClassId").html(optionhtml);
	                queryVM.loadSecondClass();
			    }
			});
		},
		/**获取二级分类*/
		loadSecondClass: function(){
			var	parentclassid = $("#firstClassId").val();
			$.ajax({
				type: "POST",
			    url: baseURL + "/admin/tbclass/queryClassByParams",
			    datatype: "json",
			    data: {parentclassid:parentclassid,classlevel:2},
			    success: function(r){
			    	var optionhtml = '<option value="">全部</option>';
			    	for(var i in r.tbClassList){
			    		optionhtml += '<option value="'+r.tbClassList[i].id+'">'+r.tbClassList[i].classname+'</option>'
					}
			    	$("#secondClassId").html(optionhtml);
			    }
			});
		},
		
		queryFirstClassIdSelect :function(){
			queryVM.loadSecondClass();
		},
		/**加载型号*/
		loadDevicetype: function(){
			$.get(baseURL + "devicetype/query",function(r){
				var optionhtml = '<option value="">全部</option>';
		    	for(var i in r.deviceTypeList){
		    		optionhtml += '<option value="'+r.deviceTypeList[i].devicetypeid+'">'+r.deviceTypeList[i].devicetype+'</option>'
				}
		    	$("#devicetypeid").html(optionhtml);
                queryVM.loadCustomer();
            });
		},
		/**加载渠道*/
		loadCustomer:function(){
			var devicetypeid = $("#devicetypeid").val();
			//全部渠道
			if(devicetypeid == null || devicetypeid == ''){
				$.get(baseURL + "customer/query", function(r){
					var optionhtml = '<option value="">全部</option>';
			    	for(var i in r.customers){
			    		optionhtml += '<option value="'+r.customers[i].customerid+'">'+r.customers[i].customername+'</option>'
					}
			    	$("#customerid").html(optionhtml);
	            });
			}else{
				$.get(baseURL + "typecustomermap/info/"+devicetypeid, function(r){
					var optionhtml = '<option value="">全部</option>';
			    	for(var i in r.customerMaps){
			    		optionhtml += '<option value="'+r.customerMaps[i].customerid+'">'+r.customerMaps[i].customername+'</option>'
					}
			    	$("#customerid").html(optionhtml);
	            });
			}
		},
		devidetypeSelect: function(event){
			queryVM.loadCustomer();
		},
		//获取相关应用列表
		listRelate: function () {
			var ids = getSelectedRows();
			if(ids == null || ids.length > 1){
				alert("请选择一条记录");
				return ;
			}
			window.location.href = baseURL + "/admin/app/relativeapp.html?appid="+ids[0];
		},
		reload: function () {
			var queryParam = {
				appName:$("#appName").val(),
				deviceTypeId:$("#devicetypeid").val() ,
				customerId:$("#customerid").val() ,
				firstClassId:$("#firstClassId").val() ,
				secondClassId:$("#secondClassId").val() ,
				publish:$("#publish").val(),
				startDate:$("#startDate").val(),
				endDate:$("#endDate").val()
			};
			queryVM.showList =true;
			vm.showList = true;
			var page = 1;
			$("#jqGrid").jqGrid('setGridParam',{ 
                page:page,
                postData:queryParam
            }).trigger("reloadGrid");
		},
		
	}
});

