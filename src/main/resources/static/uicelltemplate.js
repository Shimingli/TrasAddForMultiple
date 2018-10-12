$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'uicelltemplate/list',
        datatype: "json",
        colModel: [			
			{ label: 'id', name: 'id', index: 'id', width: 50, key: true },
			{ label: '', name: 'panelid', index: 'panelid', width: 80 }, 			
			{ label: '', name: 'name', index: 'name', width: 80 }, 			
			{ label: '', name: 'description', index: 'description', width: 80 }, 			
			{ label: '', name: 'celllevel', index: 'cellLevel', width: 80 }, 			
			{ label: '', name: 'parentid', index: 'parentId', width: 80 }, 			
			{ label: '', name: 'imageurl', index: 'imageUrl', width: 80 }, 			
			{ label: '', name: 'image2url', index: 'Image2Url', width: 80 }, 			
			{ label: '', name: 'row', index: 'row', width: 80 }, 			
			{ label: '', name: 'column', index: 'column', width: 80 }, 			
			{ label: '', name: 'rowsize', index: 'rowSize', width: 80 }, 			
			{ label: '', name: 'columnsize', index: 'columnSize', width: 80 }, 			
			{ label: '', name: 'intenttype', index: 'intentType', width: 80 }, 			
			{ label: '', name: 'packagename', index: 'packageName', width: 80 }, 			
			{ label: '', name: 'classname', index: 'className', width: 80 }, 			
			{ label: '', name: 'action', index: 'action', width: 80 }, 			
			{ label: '', name: 'uristring', index: 'uriString', width: 80 }, 			
			{ label: '', name: 'parameters', index: 'parameters', width: 80 }, 			
			{ label: '', name: 'intentcategory', index: 'intentCategory', width: 80 }, 			
			{ label: '', name: 'createtime', index: 'createTime', width: 80 }, 			
			{ label: '', name: 'updatetime', index: 'updateTime', width: 80 }			
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
		uiCellTemplate: {}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.uiCellTemplate = {};
		},
		update: function (event) {
			var id = getSelectedRow();
			if(id == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(id)
		},
		saveOrUpdate: function (event) {
			var url = vm.uiCellTemplate.id == null ? "uicelltemplate/save" : "uicelltemplate/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.uiCellTemplate),
			    success: function(r){
			    	if(r.code === 0){
						alert('操作成功', function(index){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		del: function (event) {
			var ids = getSelectedRows();
			if(ids == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "uicelltemplate/delete",
                    contentType: "application/json",
				    data: JSON.stringify(ids),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								$("#jqGrid").trigger("reloadGrid");
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		getInfo: function(id){
			$.get(baseURL + "uicelltemplate/info/"+id, function(r){
                vm.uiCellTemplate = r.uiCellTemplate;
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{ 
                page:page
            }).trigger("reloadGrid");
		}
	}
});