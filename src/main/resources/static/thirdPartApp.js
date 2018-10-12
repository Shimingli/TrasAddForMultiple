
$(function(){
	$("#jqGrid").jqGrid({
        url: baseURL + '/admin/tbapp/list',
        datatype: "json",
        postData:{
        	deviceTypeId:T.p("deviceTypeId"),
			customerId:T.p("customerId")
		},
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
			{ label: '二级分类', name: 'classList', index: 'classList', width: 50 ,formatter:function(cellValue,options,rowObject){  
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
			{ label: '应用包名', name: 'packagename', index: 'packagename', width: 70 }			
        ],
		viewrecords: true,
        height: 500,
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
	applistvm.loadFirstClass();
});    

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
		reload: function () {
			var queryParam = {
				appName:$("#appName").val(),
				firstClassId:$("#firstClassId").val() ,
				secondClassId:$("#secondClassId").val() ,
				publish:$("#publish").val(),
				deviceTypeId:T.p("deviceTypeId") ,
				customerId:T.p("customerId")
			};
			console.log("queryParam:"+JSON.stringify(queryParam));
			applistvm.showList =true;
			var page = 1;
			$("#jqGrid").jqGrid('setGridParam',{ 
                page:page,
                postData:queryParam
            }).trigger("reloadGrid");
		},
		del: function () {
			var ids = getSelectedRows();
			if(ids == null){
				return ;
			}
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "/admin/tbapp/delete",
                    contentType: "application/json",
				    data: JSON.stringify(ids),
				    success: function(r){
						if(r.code == 0){
							alert('删除成功', function(index){
								applistvm.reload();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		}
	}
});