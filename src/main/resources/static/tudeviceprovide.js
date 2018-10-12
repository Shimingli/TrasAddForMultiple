$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'tudeviceprovide/list',
        datatype: "json",
        colModel: [
			{ label: '序列号', name: 'sn', index: 'sn', width: 80 },
			{ label: '设备Id', name: 'deviceid', index: 'deviceId', width: 80 },
			{ label: '创建时间', name: 'createtime', index: 'createTime', width: 80 },
			{ label: '修改时间', name: 'updatetime', index: 'updateTime', width: 80 },
            { label: '操作', name: 'opt', width:60,
                formatter: function (value, grid, rows, state) {
                    return '<a class="btn btn-default" onclick="edit('+ rows.id +')">修改</a>'
                        + '&nbsp;&nbsp;'
                        + '<a class="btn btn-default" onclick="del('+ rows.id +')">删除</a>';
                }
            }
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
        postData: {
            'uses': '空'
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

        useSelected: '',

        querySn: '',
		queryDeviceId: '',

		useOptions: [
			{ text: '推送规避', value: '推送规避'},
			{ text: '精准强制升级', value: '精准强制升级'},
			{ text: '测试机器', value: '测试机器'}
		],
		tuDeviceProvide: {}
	},
	watch: {
		useSelected: function (use) {
			vm.reload();
        }
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			if (vm.useSelected === '') {
				alert("请选择用途");
				return;
			}

			vm.showList = false;
			vm.title = "新增";
			vm.tuDeviceProvide = {
				uses: vm.useSelected
			};
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
			var url = vm.tuDeviceProvide.id == null ? "tudeviceprovide/save" : "tudeviceprovide/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.tuDeviceProvide),
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
		del: function (event) {
			var ids = getSelectedRows();
			if(ids == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "tudeviceprovide/delete",
                    contentType: "application/json",
				    data: JSON.stringify(ids),
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
		},
		getInfo: function(id){
			$.get(baseURL + "tudeviceprovide/info/"+id, function(r){
                vm.tuDeviceProvide = r.tuDeviceProvide;
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
                postData: {
                    'uses': vm.useSelected,
                    'sn': vm.querySn,
					'deviceid': vm.queryDeviceId
                },
                page:page
            }).trigger("reloadGrid");
		}
	}
});

function edit(id) {
    if(id == null){
        return ;
    }
    vm.showList = false;
    vm.title = "修改";

    vm.getInfo(id);
}

function del(id) {
    if(id == null){
        return ;
    }

    var ids = [];
    ids.push(id);

    confirm('确定要删除记录？', function(){
        $.ajax({
            type: "POST",
            url: baseURL + "tudeviceprovide/delete",
            contentType: "application/json",
            data: JSON.stringify(ids),
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