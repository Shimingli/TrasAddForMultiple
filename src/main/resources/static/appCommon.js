
var skyworthbox = {
		initApplist:function(){
			skyworthbox.loadHtml();
		    $("#appJqGrid").jqGrid({
		        url: baseURL + '/admin/tbapp/list',
		        datatype: "json",
		        colModel: [			
					{ label: '应用ID', name: 'id', index: 'id', width: 30, key: true },
					{ label: '名称', name: 'aliasname', index: 'aliasname', width: 50}, 			
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
					{ label: '发布状态', name: 'appVersionEntity.publish', index: 'publish', width: 30 ,formatter:function(cellValue,options,rowObject){  
		                if(cellValue == 1){
		                	return "上架";
		                }else{
		                	return "下架";
		                }
					} }, 
					{ label: '应用包名', name: 'packagename', index: 'packagename', width: 30 }, 			
					{ label: '操作', name: 'id', index: 'id', width: 30,formatter: function(cellValue,options,rowObject){
						var actionHtml = "<a class='btn btn-primary btn-xs' onclick='add("+rowObject.id+");'>添加</a>";
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
		        pager: "#appJqGridPager",
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
		        	$("#appJqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-y" : "hidden" }); 
		        }
		    });
		    applistvm.loadFirstClass();
		    applistvm.loadDevicetype();
		},
		loadHtml : function(){
			var applisthtml = '<div v-show="showList"><div class="box-header"><form>\
							<div class="row"><div class="col-md-2">\
								<label>一级分类</label>\
								<select class="form-control" id="firstClassId" onchange="applistvm.queryFirstClassIdSelect();">\
								</select>\
							 </div>\
			<div class="col-md-2">\
								<label>二级分类</label>\
								<select class="form-control" id="secondClassId">\
								</select>\
							 </div>\
				<div class="col-md-2">\
				<label>型号</label>\
				<select class="form-control" id="devicetypeid" onchange="applistvm.devidetypeSelect();">\
				</select>\
			 </div>\
			 <div class="col-md-2">\
				<label>渠道</label>\
				<select class="form-control" id="customerid">\
				</select>\
			 </div>\
			<div class="form-group col-sm-2">\
				<label>发布状态</label>\
				<select class="form-control" id="publish">\
					<option value="-1">全部</option>\
					<option value="1">上架</option>\
					<option value="0">下架</option>\
				</select>\
			</div>\
			<div class="form-group col-sm-2">\
				<label>应用名称</label> \
				<input class="form-control" id="appName"/>\
			</div>\
			<div class="col-md-4">\
				<div class="form-group">\
						<label >&nbsp;&nbsp;</label> \
						<div class="input-group">\
					        <a  class="btn btn-default" onclick="applistvm.query();">&nbsp;查询</a>&nbsp;&nbsp;\
							<a class="btn btn-primary" onclick="addBatch();"><i class="fa fa-plus"></i>&nbsp;批量新增</a>\
					    </div>\
				</div>\
				</div>\
			</div>\
		</form>\
		</div>\
	    <table id="appJqGrid"></table>\
	    <div id="appJqGridPager"></div>\
		</div>';
		$("#applist").html(applisthtml);
	}
};

var applistvm = new Vue({
	el:'#applist',
	data:{
		showList: true
	},
	methods: {
		query: function () {
			applistvm.reload();
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
			    	applistvm.loadSecondClass();
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
			applistvm.loadSecondClass();
		},
		/**加载型号*/
		loadDevicetype: function(){
			$.get(baseURL + "devicetype/query",function(r){
				var optionhtml = '<option value="">全部</option>';
		    	for(var i in r.deviceTypeList){
		    		optionhtml += '<option value="'+r.deviceTypeList[i].devicetypeid+'">'+r.deviceTypeList[i].devicetype+'</option>'
				}
		    	$("#devicetypeid").html(optionhtml);
		    	applistvm.loadCustomer();
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
			applistvm.loadCustomer();
		},
		reload: function () {
			var queryParam = {
				appName:$("#appName").val(),
				firstClassId:$("#firstClassId").val() ,
				secondClassId:$("#secondClassId").val() ,
				publish:$("#publish").val(),
				deviceTypeId:$("#devicetypeid").val() ,
				customerId:$("#customerid").val()
			};
			applistvm.showList =true;
			var page = 1;
			$("#appJqGrid").jqGrid('setGridParam',{ 
                page:page,
                postData:queryParam
            }).trigger("reloadGrid");
		},
		
	}
});