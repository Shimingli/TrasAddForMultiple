$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + '/admin/album/list',
        datatype: "json",
        colModel: [			
			{ label: '专题ID', name: 'id', index: 'id', width: 50, key: true },
			{ label: '专题名称', name: 'name', index: 'name', width: 80 }, 			
			{ label: '专题合集', name: 'albumlevel', index: 'albumlevel', width: 60 ,formatter: function(value, options, row){
				return (value == 1 ? "专题合集" : "普通专题");
			}}, 			
			{ label: '专题来源', name: 'source', index: 'source', width: 60,formatter: function(value, options, row){
				return (value == 0 ? "蜜蜂市场" : "应用商店");
			}}, 			
			{ label: '专题背景图片', name: 'backimage', index: 'backimage', width: 80,formatter: function(value, options, row){
				return "<img src='"+value+"' width='50px' height='25px'>";
			}}, 			
			{ label: '专题图片', name: 'image', index: 'image', width: 80,formatter: function(value, options, row){
				return "<img src='"+value+"' width='50px' height='50px'>";
			}}, 			
			{ label: '排序', name: 'sort', index: 'sort', width: 40 }, 			
			{ label: '创建时间', name: 'createtime', index: 'createTime', width: 80 }, 			
			{ label: '操作', name: 'updatetime', index: 'updateTime', width: 80,formatter: function(value, options, row){
				var btnName = '进入专辑';
				if(row.albumlevel == 1){
					btnName = '查看合集';
				}
				return [
					"<button type='button' class='btn btn-info btn-xs' onclick='update("+row.id+")'>修改</button>",
					"<button type='button' class='btn btn-danger btn-xs' onclick='del("+row.id+")'>删除</button>",
					"<button type='button' class='btn btn-danger btn-xs' onclick='vm.albumappmap(\""+row.albumid+"\","+row.albumlevel+")'>"+btnName+"</button>"
				].join('');
			}}			
        ],
		viewrecords: true,
        height: 450,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: false, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: false,
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
		add: function(){
			vm.initParent('');
			vm.title = "新增";
			vm.album = {};
		},
		saveOrUpdate: function (event) {
			var url = vm.album.id == null ? "/admin/album/save" : "/admin/album/update";
			var sort = $("#sort").val();
			vm.album.sort = sort;
			var albumImage = $('#albumImage').val();
			vm.album.image = albumImage;
			var albumBackimage = $('#albumBackimage').val();
			vm.album.backimage = albumBackimage;
			//console.log("sort:"+vm.album.sort);
			var albumLevel = vm.album.albumLevel;
			if(albumLevel){
				vm.album.albumlevel = 1;
			}else{
				vm.album.albumlevel = 2;
			}
			var parent = $('#parent').val();
			vm.album.parentid = parent;
			var validating = vm.validating();
			var source = T.p('source');
			vm.album.source = source;
			if(!vm.validating()){
				return ;
			}
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.album),
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
		reload: function (id) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			var albumLevel = $("#albumLevel").val();
			$("#jqGrid").jqGrid('setGridParam',{
				postData:{
		        	'parentid':id,
		        	'albumLevel':albumLevel
		        },
                page:page
            }).trigger("reloadGrid");
		},
		validating : function(event){
			var name = vm.album.name;
			if(typeof(name) == 'undefined' || name == ''){
				alert("专辑名称不能为空!");
				return false;
			}
			return true;
		},
		checkAlbuml : function(event){
			// --------- 点击checkbox事件 ---------
			var albumLevel = vm.album.albumLevel;
			if(albumLevel){
				$("#parent").val('');
				$("#parentDiv").hide(); 
			}else{
				$("#parentDiv").show();
			}
		},
		albumappmap : function(id,albumlevel){
			if(albumlevel == 1){
				vm.reload(id);
			}else{
				// --------- 跳转专题应用 ---------
				var source = T.p('source');
				window.location.href = baseURL+"/admin/app/albumappmap.html?source="+source+"&id="+id;
			}
		},
		initParent : function(id){
			vm.showList = false;
			$.get(baseURL + "/admin/album/listParent", function(r){
				if(r.status === 0){
		    		var parent=$('#parent');
		    		parent.empty();
					var data = r.data;
					parent.append('<option value="">不选择</option>');
					for(var i in data){
						parent.append('<option value="'+data[i].albumid+'">'+data[i].name+'</option>');
					}
					if(id != ''){
						getInfo(id);
					}
				}else{
					alert(r.msg);
				}
		    });
		}
	}
});
function update(id) {
//	var id = getSelectedRow();
	vm.initParent(id);
    vm.title = "修改";
    $('#albumBackimage').val('');
    $('#albumImage').val('');
}
function getInfo(id){
	$.get(baseURL + "/admin/album/info/"+id, function(r){
        vm.album = r.album;
        if(vm.album.albumlevel == 1){
        	vm.album.albumLevel = true;
        }else{
        	vm.album.albumLevel = false;
        }
        if(vm.album.sort != null){
        	$('#sort').val(vm.album.sort);
        }
        if(vm.album.parentid != null){
        	$('#parent').val(vm.album.parentid);
        }
        vm.checkAlbuml();
        $("#albumLevel").attr("disabled",true);
    });
}
function del(id) {
	confirm('确定要删除选中的记录？', function(){
		$.ajax({
			type: "POST",
		    url: baseURL + "/admin/album/delete/"+id,
            contentType: "application/json",
		    success: function(r){
				if(r.status == 0){
					alert('操作成功', function(index){
						$("#jqGrid").trigger("reloadGrid");
					});
				}else{
					alert(r.msg);
				}
			}
		});
	});
}
var backimageUploadSetting = {
	'fileObjName':'backimageFile', // file id
    'progressData' : 'percentage',
    'removeCompleted': true,
    'auto':true,
    'buttonCursor':'hand',
    'buttonText': '上传专题背景图',
 //       'fileType'   : ['image/*','video/*'],
    'fileSizeLimit' : '1MB',  
    'uploadScript' : baseURL+'/file/picUpload?filename=backimageFile',
    'onUploadComplete' : function(file, data) { 
    	var jsonObj = JSON.parse(data);
    	var status = jsonObj.status;
    	var msg = jsonObj.msg;
    	if(status == 0){
    		alert('上传图片成功');
    		var filePath = jsonObj.filePath;
    		$('#albumBackimage').val(filePath);
    	}else if(status=1){
    		alert(msg);
    	}else if(status==2){
    		alert(msg);
    	}
	}
};	   
$('#backimageFile').uploadifive(backimageUploadSetting);

var imageUploadSetting = {
		'fileObjName':'imageFile', // file id
		'progressData' : 'percentage',
		'removeCompleted': true,
		'auto':true,
		'buttonCursor':'hand',
		'buttonText': '上传背景图',
		//       'fileType'   : ['image/*','video/*'],
		'fileSizeLimit' : '1MB',  
		'uploadScript' : baseURL+'/file/picUpload?filename=imageFile',
		'onUploadComplete' : function(file, data) { 
			var jsonObj = JSON.parse(data);
			var status = jsonObj.status;
			var msg = jsonObj.msg;
			if(status == 0){
				alert('上传图片成功');
				var filePath = jsonObj.filePath;
				$('#albumImage').val(filePath);
			}else if(status=1){
				alert(msg);
			}else if(status==2){
				alert(msg);
			}
		}
};	   
$('#imageFile').uploadifive(imageUploadSetting);