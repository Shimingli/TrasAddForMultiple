var topicSel = T.p('id');
$(function () {
	skyworthbox.initApplist();
	initAlbumMapList();
});
//------- 取专辑app列表 ---------
function initAlbumMapList(){
	$("#appmapGrid").jqGrid({
        url: baseURL + '/admin/albumappmap/list',
        datatype: "json",
        postData:{
        	'albumid':topicSel
        },
        colModel: [
			{ label: 'appID', name: 'id', index: 'id', width: 30, key: true },
			{ label: '图片', name: 'siconpath', index: 'siconpath', width: 25,formatter: function(value, options, row){
				return "<img src='"+value+"' width='25px' height='25px'>";
			}}, 			
			{ label: '分类', name: 'classList', index: 'classList', width: 120 ,formatter: function(value, options, row){
				if(value != null && value != ''){
					var classNames = "";
					for(var o in value){
						classNames =  classNames + "|" + value[o].classname ;
					}
					classNames = classNames.substring(1);
					return classNames;
				}else{
					return '';
				}
			}},
			{ label: '名称', name: 'aliasname', index: 'aliasname', width: 60 },
			{ label: '包名', name: 'packagename', index: 'packagename', width: 80 },
			{ label: '最新版本', name: 'appVersionEntity', index: 'appVersionEntity', width: 60 ,formatter: function(value, options, row){
				if(value != null && value != ''){
					return value.versionname;
				}else{
					return '';
				}
			}},
			{ label: '排序', name: 'totalnum', index: 'totalnum', width: 40 ,formatter: function(value, options, row){
				return "<input id='"+row.id+"Sort' value='0' size='4' />";
			}},
			{ label: '下载次', name: 'downloadnum', index: 'downloadnum', width: 80 },
			{ label: '发布状态', name: 'appVersionEntity', index: 'appVersionEntity', width: 80 ,formatter: function(value, options, row){
				if(value != null && value.publish != null && value.publish == 1){
					return '发布';
				}else{
					return '下架';
				}
			}},
			{ label: '操作', name: 'updatetime', index: 'updateTime', width: 80,formatter: function(value, options, row){
				return [
					"<button type='button' class='btn btn-info btn-xs' onclick='vm.update("+row.id+")'>保存</button>",
					"<button type='button' class='btn btn-danger btn-xs' onclick='vm.delAppMap("+row.id+")'>删除</button>"
				].join('');
			}}
        ],
		viewrecords: true,
        height: 385,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: false, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: false,
        pager: "#appmapGridPager",
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
        	$("#appmapGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        },
        loadComplete:function(){
        	initAlbumMapSort();
        },
        onSelectAll:function(rowids,statue){
        	/*var opt = 0;
        	if(statue){
        		opt = 1;
        	}
    		for (var i = 0; i < rowids.length; i++) {
    			var sort = $('#'+(rowids[i]+'Sort')).val();
    			var obj = new Object();
    			obj.sort = sort;
    			obj.opt = opt;  // 1增加
    			map.put(rowids[i],obj);
			}*/
        },onSelectRow:function(rowid,statue){
        	/*var obj = new Object();
        	if(statue){
        		obj.opt = 1;
        	}else{
        		obj.opt = 0;
        	}
			var sort = $('#'+(rowid+'Sort')).val();
			obj.sort = sort;
			map.put(rowid,obj);*/
        }
    });
}
function initAlbumMapSort(){
	$.ajax({
		type: "POST",
		url: baseURL + '/admin/albumappmap/listAlbumMapSort',
		data:{
			'albumid':topicSel
		},
		dataType : 'json',
	    success: function(r){
	    	if(r.status === 0){
	    		var data = r.data;
	    		for (var i = 0; i < data.length; i++) {
	    			$('#'+(data[i].appid+'Sort')).val(data[i].sort);
				}
			}
		}
	});
}
function add(id){
	vm.albumAppMap.sort = 0;
	vm.albumAppMap.appid = id;
	vm.albumAppMap.albumid = topicSel;
	loading("正在添加，请稍后...");
	$.ajax({
		type: "POST",
	    url: baseURL + "/admin/albumappmap/save",
	    contentType: "application/json",
	    data: JSON.stringify(vm.albumAppMap),
	    success: function(r){
	    	closeLoading();
	    	if(r.status === 0){
	    		alert('操作成功',function(){
					vm.reload();
				});
			}else{
				alert(r.msg);
			}
		},
		error : function() {
			closeLoading();
		}
	});
}
var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true,
		title: null,
		albumAppMap: {}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		update: function (id) {
			var sort = $('#'+id+'Sort').val();
			vm.albumAppMap.sort = sort;
			vm.albumAppMap.appid = id;
			vm.albumAppMap.albumid = topicSel;
			$.ajax({
				type: "POST",
			    url: baseURL + "/admin/albumappmap/update",
        	    contentType: "application/json",
    		    data: JSON.stringify(vm.albumAppMap),
			    success: function(r){
			    	if(r.status === 0){
						alert('操作成功');
					}else{
						alert(r.msg);
					}
				}
			});
		},
		delAppMap: function (id) {
			vm.albumAppMap.appid = id;
			vm.albumAppMap.albumid = topicSel;
			confirm('确定删除专题应用？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "/admin/albumappmap/delAppMap",
				    contentType: "application/json",
	    		    data: JSON.stringify(vm.albumAppMap),
				    success: function(r){
				    	if(r.status === 0){
							alert('操作成功',function(){
								vm.reload();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		del: function (event) {
			confirm('确定清空专题应用？', function(){
				$.ajax({
					type: "POST",
					url: baseURL + "/admin/albumappmap/delete/"+topicSel,
					dataType : 'json',
					success: function(r){
						if(r.status === 0){
							alert('操作成功',function(){
								vm.reload();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		reload: function (event) {
			vm.showList = true;
			// 发布
			var tdClass = $("#tdClass").val();
			var publish = $("#publish").val();
			var channel = $("#channel").val();
			var startDate = $("#startDate").val();
			var endDate = $("#endDate").val();
			var namekeyword = $("#namekeyword").val();
			var selectType = $("#selectType").val();
			var page = $("#appmapGrid").jqGrid('getGridParam','page');
			$("#appmapGrid").jqGrid('setGridParam',{
				postData:{
		        	'firstClassId':tdClass,
		        	'publish':publish,
		        	'customerId':channel,
		        	'startDate':startDate,
		        	'endDate':endDate,
		        	'selectType':selectType,
		        	'albumid':topicSel,
		        	'appName':namekeyword
		        },
                page:page
            }).trigger("reloadGrid");
		}
	}
});


