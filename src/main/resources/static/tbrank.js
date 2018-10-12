$(function () {
	initClass();
	skyworthbox.initApplist();
});
//---------- 初始化分类 ---------
function initClass(){
	loading("加载中，请稍后...");
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/tbclass/listByClassLevel',
		data:{
			"classLevel":1
		},
		dataType : 'json',
	    success: function(r){
	    	closeLoading();
	    	if(r.status === 0){
	    		var parent=$('#tdclass');
				parent.empty();
				var data = r.data;
				for(var i in data){
					parent.append('<option value="'+data[i].id+'">'+data[i].classname+'</option>');
				}
				initTable();
			}
		},
		error : function() {
			closeLoading();
		}
	});
}
//---------- 初始化列表 ---------
function initTable(){
	var classid = $('#tdclass').val();
	$("#jqGrid").jqGrid({
        url: baseURL + '/admin/tbRank/list',
        datatype: "json",
        colModel: [			
			{ label: '排序', name: 'sort', index: 'sort', width: 50,formatter: function(value, options, row){
				return "<input value='"+value+"' id='"+row.id+"Sort'>";
			}},
			{ label: '应用ID', name: 'appid', index: 'appid', width: 80}, 			
			{ label: '名称', name: 'aliasName', index: 'aliasName', width: 60}, 			
			{ label: '应用图片', name: 'siconPath', index: 'siconPath', width: 80,formatter: function(value, options, row){
				return "<img src='"+value+"' width='25px' height='25px'>";
			}}, 			
			{ label: '操作', name: 'id', index: 'id', width: 60,formatter: function(value, options, row){
				return [
					"<button type='button' class='btn btn-info btn-xs' onclick='update("+row.id+")'>修改</button>",
					"<button type='button' class='btn btn-danger btn-xs' onclick='del("+row.id+")'>删除</button>"
				].join('');
			}}			
        ],
		viewrecords: true,
        height: 450,
        rowNum: 30,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: false,
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
        },
        postData:{
        	'classid':classid
        }
    });
}
var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true,
		title: null,
		album: {},
	},
	methods: {
		query: function () {
			vm.reload();
		},
		reload: function (event) {
			var classid = $('#tdclass').val();
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
				postData:{
		        	'classid':classid
		        },
                page:page
            }).trigger("reloadGrid");
		}
	}
});
function add(appid){
	loading("正在保存，请稍后...");
	var classid = $('#tdclass').val();
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/tbRank/save',
		data:{
			"appid":appid,
			'classid':classid
		},
		dataType : 'json',
	    success: function(r){
	    	closeLoading();
	    	if(r.status === 0){
	    		vm.reload();
			}
		},
		error : function() {
			closeLoading();
		}
	});
}
function update(id){
	var sort = $('#'+(id+'Sort')).val();
	loading("正在修改，请稍后...");
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/tbRank/update',
		data:{
			'sort':sort,
			'id':id
		},
		dataType : 'json',
	    success: function(r){
	    	closeLoading();
	    	if(r.status === 0){
	    		vm.reload();
			}
		},
		error : function() {
			closeLoading();
		}
	});
}

function del(id){
	confirm('确定删除专题应用？', function(){
		loading("正在删除，请稍后...");
		$.post(baseURL + '/admin/tbRank/delete', {"id": id},
			function(r){
				closeLoading();
				if(r.status === 0){
					vm.reload();
				}
			}, "json");
	});
}
