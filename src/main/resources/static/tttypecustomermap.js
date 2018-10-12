$(function () {

    initCustomerSelect();

    $('#jqGrid').jqGrid({
        url: baseURL + 'typecustomermap/list',
        datatype: "json",
        colModel: [
			{ label: '型号Id', name: 'devicetypeid', index: 'deviceTypeId', width: 80 },
			{ label: '型号名称', name: 'devicetype', index: 'deviceType', width: 80 },
            { label: '关联渠道数', name: 'customerMapNumber', index: 'customerMapNumber', width: 80 },
			{ label: '操作', name: 'opt', width:60,
                formatter: function (value, grid, rows, state) {
                    return '<a class="btn btn-default" onclick="detail('+ rows.id +')">详细</a>'
                        + '&nbsp;&nbsp;'
                        + '<a class="btn btn-default" onclick="edit('+ rows.id +')">配置</a>';
                }
			}
        ],
		viewrecords: true,
        height: 540,
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
		ttTypeCustomerMap: {},
		editable: false,

        queryDeviceTypeId: '',
        queryDeviceTypeName: '',

        deviceTypeIdSelected: '',
        deviceTypeNameSelected: '',
        customerIdSelected: '',
        customerNameSelected: '',
        customers: [],
        customerMaps: []
	},
	methods: {
		query: function () {
			vm.reload();
		},
        add: function () {
		    var select = document.getElementById('customerSelect');
		    var index = select.selectedIndex;

		    if (index === -1) {
		        alert("请选择关联渠道");
		        return;
            }

		    var text = select.options[index].text;
		    var value = select.options[index].value;
		    console.log("devicetypeid: " + vm.deviceTypeIdSelected);

            vm.customerMaps.push({customerid: value, customername: text, devicetypeid: vm.deviceTypeIdSelected});
        },
        deleteCustomerMap: function (index) {
		    vm.customerMaps.splice(index, 1);
        },
        submit: function () {
            $.ajax({
                url : baseURL + "typecustomermap/save",
                type : 'post',
                contentType: "application/json",
                data : JSON.stringify(vm.customerMaps),
                cache : false,
                success : function(r) {
                    if (r.status === 0) {
                        alert('操作成功', function(index){
                            vm.reload();
                            vm.showList = true;
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
		getInfo: function(id){
			$.get(baseURL + "typecustomermap/info/"+id, function(r){
                vm.ttTypeCustomerMap = r.ttTypeCustomerMap;
            });
		},
		reload: function (event) {
			vm.showList = true;
			vm.customerMaps = [];

			console.log("queryDeviceTypeId: " + vm.queryDeviceTypeId);
			console.log("queryDeviceName: " + vm.queryDeviceTypeName);

            var grid = $('#jqGrid');
			var page = grid.jqGrid('getGridParam','page');
			grid.jqGrid('setGridParam',{
                postData: {
                    'deviceTypeId': vm.queryDeviceTypeId,
                    'deviceType': vm.queryDeviceTypeName
                },
                page: page
            }).trigger("reloadGrid");
		}
	}
});

function initCustomerSelect() {
    $.get(baseURL + "customer/query", function (r) {
        if (r.status === 0) {
            vm.customers = r.customers;
        } else {
            alert(r.msg);
        }
    });
}

function initCustomerMap() {
    $.get(baseURL + "typecustomermap/info/" + vm.deviceTypeIdSelected, function (r) {
        if (r.status === 0) {
            vm.customerMaps = r.customerMaps;
        } else {
            alert(r.msg);
        }
    });
}

function detail(id) {
    vm.title = "详情";
    vm.editable = false;
    vm.showList = false;

    var grid = $('#jqGrid');
    vm.deviceTypeIdSelected = grid.jqGrid('getCell', id, 'devicetypeid');
    vm.deviceTypeNameSelected = grid.jqGrid('getCell', id, 'devicetype');
    vm.customerIdSelected = '';

    console.log(vm.deviceTypeIdSelected);
    console.log(vm.deviceTypeNameSelected);

    initCustomerMap();
}

function edit(id) {
    vm.title = "配置";
    vm.editable = true;
    vm.showList = false;

    var grid = $('#jqGrid');
    vm.deviceTypeIdSelected = grid.jqGrid('getCell', id, 'devicetypeid');
    vm.deviceTypeNameSelected = grid.jqGrid('getCell', id, 'devicetype');
    vm.customerIdSelected = '';

    console.log(vm.deviceTypeIdSelected);
    console.log(vm.deviceTypeNameSelected);

    initCustomerMap();
}