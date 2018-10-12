var classLevelName;
$(function () {
	initTable();
});
function initTable(){
	$("#jqGrid").jqGrid({
        url: baseURL + '/admin/tbclass/list',
        datatype: "json",
        colNames : ['类别名称', '分类标识码','类型来源','缩略图',"父分类",'排序','类别操作'],
        colModel: [			
			{  name: 'classname', index: 'classname', width: 80 }, 			
			{  name: 'classid', index: 'classid', width: 80 }, 			
			{  name: 'source', index: 'source', width: 80 ,formatter: function(value, options, row){
				if(value == 0){
					return "蜜蜂市场";
				}else if(value == 1){
					return "应用商店";
				}else{
					return "共享类型";
				}
			}}, 			
			{  name: 'icon', index: 'icon', width: 80 ,formatter: function(value, options, row){
				return "<img src='"+value+"' width='25px' height='25px'>";
			}}, 			
			{  name: 'childList', index: 'childList', width: 80 }, 			
			{  name: 'sort', index: 'sort', width: 80 }, 			
			{  name: 'id', index: 'id', width: 80,formatter: function(value, options, row){
				return [
					"<button type='button' class='btn btn-info btn-xs' onclick='vm.update("+row.id+")'>修改</button>",
					"<button type='button' class='btn btn-danger btn-xs' onclick='vm.del("+row.id+")'>删除</button>"
				].join('');
			}}			
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
        postData:{
        	'classLevel':2
        },
        gridComplete:function(){
        	//隐藏grid底部滚动条
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        }
    });
}
var index;
var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true,
		title: null,
		tbClass: {}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			var classLevel = $('#classLevel').val();
			if(classLevel == 1){
				vm.title = "新增一级分类";
			}else{
				vm.title = "新增二级分类";
			}
			vm.tbClass = {};
			vm.tbClass.source = 0;
			$('#icon').val('');
		},
		update: function (id) {
			vm.showList = false;
            vm.title = "修改";
            $('#icon').val('');
            vm.getInfo(id)
		},
		saveOrUpdate: function (event) {
			var url = vm.tbClass.id == null ? "/admin/tbclass/save" : "/admin/tbclass/update";
			vm.tbClass.icon = $('#icon').val();
			vm.tbClass.classlevel = $('#classLevel').val();
			vm.tbClass.sort = $("#sort").val();
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.tbClass),
			    success: function(r){
			    	if(r.status === 0){
						alert('操作成功', function(index){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		del: function (id) {
			confirm('确定要删除选中的记录？', function(){
				$.get(baseURL + "/admin/tbclass/delete/"+id, function(r){
					alert('删除成功', function(index){
						$("#jqGrid").trigger("reloadGrid");
					});
	            });
			});
		},
		getInfo: function(id){
			$.get(baseURL + "/admin/tbclass/info/"+id, function(r){
                vm.tbClass = r.tbClass;
                $("#iconImg").attr('src',r.tbClass.icon); 
                $("#sort").val(r.tbClass.sort); 
            });
		},
		reload: function (event) {
			vm.showList = true;
			var classLevel = $('#classLevel').val();
			if(classLevel == 1){
				classLevelName = "子分类";
				$('#gl').hide();
			}else{
				classLevelName = "父分类";
				$('#gl').show();
			}
			$('#jqgh_jqGrid_childList').html(classLevelName);
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
				postData:{
		        	'classLevel':classLevel
		        },
                page:page
            }).trigger("reloadGrid");
		},
		connect: function(event){
			var html = '<div class="grid-btn row" style="width:300px;text-align: center;">';
			html += '<div style="width:200px;">';
			html += '<label>选择一级分类</label>';
			html += '<select class="form-control" style="text-align: center;" id="glClass">';
			html += '</select>';
			html += '</div>&nbsp;';
			html += '<div>';
			html += '<label>&nbsp;</label>';
			html += '<a class="btn btn-default" onclick="connectClass()">确定关联</a>';
			/*html += '<a class="btn btn-default" onclick="connectClass()">关闭</a>';*/
			html += '</div>';
			html += '</div>&nbsp;';
			// 关联分类
			index = layer.open({
				type: 1,
				title: "关联分类",
				closeBtn: 0,
				shadeClose: true,
				content: html
			});
			initClass();
		}
	}
});
//-------- 初始化分类下拉框 ---------
function initClass(){
	$.post(baseURL + '/admin/tbclass/listByClassLevel', {"classLevel": 1},
		function(r){
			if(r.status === 0){
	    		var parent=$('#glClass');
				parent.empty();
				var data = r.data;
				for(var i in data){
					parent.append('<option value="'+data[i].id+'">'+data[i].classname+'</option>');
				}
			}
		}, "json");
}
function connectClass(){
	var id = $('#glClass').val();
	var ids = getSelectedRows();
	if(ids == null){
		return ;
	}
	layer.close(index);
	$.ajax({
		type: "POST",
	    url: baseURL + "/admin/tbclass/updateConnect/"+id,
        contentType: "application/json",
	    data: JSON.stringify(ids),
	    success: function(r){
	    	if(r.status === 0){
				alert('操作成功', function(index){
					vm.reload();
				});
			}else{
				alert(r.msg);
			}
		}
	});
}

var iconImgUploadSetting = {
		'fileObjName':'iconFile', // file id
	    'progressData' : 'percentage',
	    'removeCompleted': true,
	    'auto':true,
	    'buttonCursor':'hand',
	    'buttonText': '上传类型图标',
	 //       'fileType'   : ['image/*','video/*'],
	    'fileSizeLimit' : '1MB',  
	    'uploadScript' : baseURL+'/file/picUpload?filename=iconFile',
	    'onUploadComplete' : function(file, data) { 
	    	var jsonObj = JSON.parse(data);
	    	var status = jsonObj.status;
	    	var msg = jsonObj.msg;
	    	if(status == 0){
	    		alert('上传图片成功');
	    		var filePath = jsonObj.filePath;
	    		$('#icon').val(filePath);
	    		$("#iconImg").attr('src',jsonObj.imgPath);
	    	}else if(status=1){
	    		alert(msg);
	    	}else if(status==2){
	    		alert(msg);
	    	}
		}
	};	   
	$('#iconFile').uploadifive(iconImgUploadSetting);