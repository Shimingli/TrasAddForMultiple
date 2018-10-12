$(function () {
    $("#jqGrid").jqGrid({
        url:'/ditto/grid/list',
        datatype: "json",
        colModel: [			
			{ label: '专题ID', name: 'id', index: 'id', width: 50, key: true },
			{ label: '专题名称', name: 'name', index: 'name', width: 80 }, 			
			{ label: '操作', name: 'updatetime', index: 'updateTime', width: 80,formatter: function(value, options, row){
				return [
					"<button type='button' class='btn btn-danger btn-xs' onclick='del("+row.id+")'>删除</button>"
				].join('');
			}}			
        ],
		viewrecords: true,
        height: 450,
        rowNum: 3,
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
       /* 	var page = $("#jqGrid").getGridParam("page");
			var rowNum = $("#jqGrid").getGridParam("rowNum");
			var records = $("#jqGrid").getGridParam("records");
			if (page ==2 && rowNum== records) {
				$("#jqGrid").setGridParam({"page":1});
			}
			var page2 = $("#jqGrid").getGridParam("page");
			reload();*/
        }
    });
});

function del (id){
	$.ajax({
		url:"/ditto/grid/del",
		type:"get",
		data:{"id":id},
		success:function(data){
			if (data.status==0) {
				alert("success");
				$("#jqGrid").trigger("reloadGrid");
			}
		}
	});
}
 
function reload () {
	var page = $("#jqGrid").jqGrid('getGridParam','page');
	$("#jqGrid").jqGrid('setGridParam',{
        page:page
    }).trigger("reloadGrid");
}