var appversionid = T.p("appversionid");
var appid = T.p("appid");
$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + '/admin/tbapp/listOldApp',
        datatype: "json",
        postData:{
        	appversionid:appversionid,
        	appid:appid
        },
        colModel: [			
			{ label: '应用ID', name: 'id', index: 'id', width: 30, key: true },
			{ label: '名称', name: 'aliasname', index: 'aliasname', width: 60 }, 			
			{ label: '图片', name: 'siconpath', index: 'siconpath', width: 40,formatter: function(cellValue,options,rowObject){
				var	imgUrl = '<img src="'+baseURL + '/file/download?fullPath='+ rowObject.siconpath+'" style="width:60px;height:40px;"/>';
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
			{ label: '最新版本', name: 'versionname', index: 'versionname', width: 50 }, 			
			{ label: '文件大小', name: 'apksize', index: 'apksize', width: 30 }, 			
			{ label: '更新时间', name: 'updatetime', index: 'updatetime', width: 50,formatter:function(cellValue,options,rowObject){  
                return (moment(rowObject.updateTime)).format("YYYY-MM-DD HH:mm:ss");
			} }, 			
			{ label: '发布状态', name: 'publish', index: 'publish', width: 30 ,formatter:function(cellValue,options,rowObject){  
                if(cellValue == 1){
                	return "上架";
                }else{
                	return "下架";
                }
			} }, 
			{ label: '广告插件', name: 'adflag', index: 'adflag', width: 30 ,formatter:function(cellValue,options,rowObject){ 
                if(cellValue == 1){
                	return "有";
                }else{
                	return "无";
                }
			} }, 
			{ label: '操作', name: 'id', index: 'id', width: 40,formatter: function(cellValue,options,rowObject){
				var actionHtml = "<a class='btn btn-primary btn-xs' onclick='vm.updateOldApp("+rowObject.id+");'>&nbsp;修改</a>&nbsp;&nbsp;" +
						"<a class='btn btn-primary btn-xs' onclick='del("+rowObject.appversionid+");'>&nbsp;删除</a>";
	            return actionHtml;
	        } }		
        ],
		viewrecords: true,
        height: 385,
        rowNum: 30,
		rowList : [30,50],
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
    main.init();
});

function del(id){
	confirm('确定要删除选中的记录？', function(){
		$.ajax({
			type: "POST",
		    url: baseURL + "/admin/tbapp/delAppVersion",
		    datatype: "json",
		    data: {appversionid:id},
		    success: function(r){
				if(r.code == 0){
					alert('删除成功', function(index){
						reloadOldApp();
					});
				}else{
					alert(r.msg);
				}
			}
		});
	});
}

function reloadOldApp() {
	vm.showList = true;
	var page = $("#jqGrid").jqGrid('getGridParam','page');
	$("#jqGrid").jqGrid('setGridParam',{ 
        page:page
    }).trigger("reloadGrid");
}


