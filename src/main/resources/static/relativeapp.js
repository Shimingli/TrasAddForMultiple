var appid = T.p("appid");
$(function(){
	initTable();
	skyworthbox.initApplist();
});
//---------- 初始化列表 ---------
function initTable(){
	getRelativeAppInfo();
	$("#relativejqGrid").jqGrid({
        url: baseURL + 'admin/tbapprecommendmap/list',
        datatype: "json",
        postData:{
        	appid:appid
        },
        colModel: [			
            { label: 'ID', name: 'id', index: 'id', width: 30, key: true },
			{ label: '应用ID', name: 'appid', index: 'appid', width: 80 }, 			
			{ label: '名称', name: 'aliasname', index: 'aliasname', width: 60}, 			
			{ label: '图片', name: 'siconpath', index: 'siconpath', width: 40,formatter: function(cellValue,options,rowObject){
				var	imgUrl = '<img src="'+baseURL + '/file/download?fullPath='+ rowObject.siconpath+'" style="width:50px;height:25px;"/>';
	            return imgUrl;
	        } },	
	        { label: '排序', name: 'sort', index: 'sort', width: 70,formatter: function(value, options, row){
				return "<input value='"+value+"' id='"+row.id+"Sort'>";
			}},
			{ label: '操作', name: 'id', index: 'id', width: 60,formatter: function(value, options, row){
				return "<button type='button' class='btn btn-info btn-xs' onclick='update("+row.id+")'>修改</button>";
			}}			
        ],
		viewrecords: true,
        height: 450,
        rowNum: 30,
		rowList : [10,30,50],
        rownumWidth: 25, 
        autowidth:true,
        multiselect: true,
        pager: "#relativejqGridPager",
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
//        	$("#relativejqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-y" : "hidden" }); 
        }
    });
}
var relativevm = new Vue({
	el:'#relativeapp',
	data:{
		showList: true,
		title: null
	},
	methods: {
		reload: function (event) {
			relativevm.showList = true;
			var page = $("#relativejqGrid").jqGrid('getGridParam','page');
			$("#relativejqGrid").jqGrid('setGridParam',{
				postData:{
		        	'appid':appid
		        },
                page:page
            }).trigger("reloadGrid");
		},
		del: function (event) {
			var grid = $("#relativejqGrid");
		    var rowKey = grid.getGridParam("selrow");
		    if(!rowKey){
		    	alert("至少选择一条记录");
		    	return ;
		    }
			var ids = grid.getGridParam("selarrrow");
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "/admin/tbapprecommendmap/delete",
                    contentType: "application/json",
				    data: JSON.stringify(ids),
				    success: function(r){
						if(r.status == 0){
							alert('删除成功', function(index){
								relativevm.reload();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
	}
});
/**批量添加*/
function addBatch(){
	var recommendappids = getAppSelectedRows();
	if(recommendappids == null || recommendappids == undefined || recommendappids.length < 1){
		alert("请至少选择一条记录");
		return ;
	}
	loading("正在保存，请稍后...");
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/tbapprecommendmap/save',
		data:{
			"recommendappids":recommendappids.toString(),
			"appid":appid
		},
		dataType : 'json',
	    success: function(r){
	    	closeLoading();
	    	if(r.status === 0){
	    		alert(r.msg, function(index){
	    			relativevm.reload();
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
function add(recommendappid){
	loading("正在保存，请稍后...");
	if(recommendappid == appid){
		alert("不能关联自己");
		return ;
	}
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/tbapprecommendmap/save',
		data:{
			"recommendappids":recommendappid,
			"appid":appid
		},
		dataType : 'json',
	    success: function(r){
	    	closeLoading();
	    	if(r.status === 0){
	    		alert(r.msg, function(index){
	    			relativevm.reload();
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
/**修改排序*/
function update(id){
	var sort = $('#'+(id+'Sort')).val();
	loading("正在修改，请稍后...");
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/tbapprecommendmap/update',
		data:{
			'sort':sort,
			'id':id
		},
		dataType : 'json',
	    success: function(r){
	    	closeLoading();
	    	if(r.status === 0){
	    		alert(r.msg, function(index){
	    			relativevm.reload();
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
/**通过id获取应用详情*/
function getRelativeAppInfo(){
	$.ajax({
		type: "POST",
	    url: baseURL + "/admin/tbapp/info/"+appid,
	    datatype: "json",
	    data: {},
	    async:false, 
	    success: function(r){
	    	$("#relativeAppName").val(r.tbApp.name);
	    }
	});
}