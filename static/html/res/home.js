$(function () {
    var dg = $('#dg').datagrid({
        url: '/res?pid=-1',
        pagination: true,
        fitColumns: true,
        rownumbers: true,
        fit: true,
        toolbar: '#toolbar',
        method: 'get',
        singleSelect: true,
        columns: [[
            {
                field: 'id', title: 'Id', sortable: true
            }, {
                field: 'res_name', title: '资源名称', width: 100, sortable: true
            }, {
                field: 'res_type', title: '资源类型', width: 100, sortable: true,
                formatter: function (value) {
                    if (value == 0) {
                        return '菜单'
                    } else {
                        return '资源'
                    }
                }
            }, {
                field: 'path', title: '路径', width: 100, sortable: true
            }, {
                field: 'create_time', title: '创建时间', width: 100, sortable: true,
                formatter: function (value, row, index) {
                    return new Date(value).format("yyyy-MM-dd hh:mm:ss");
                }
            }, {
                field: 'update_time', title: '最后一次更新时间', width: 100, sortable: true,
                formatter: function (value, row, index) {
                    return new Date(value).format("yyyy-MM-dd hh:mm:ss");
                }
            }
        ]],
        onSelect: function (rowIndex, rowData) {
            $('table.ddv.datagrid-f').each(function (index, ddv) {
                $(ddv).datagrid('unselectAll');
            });
        },
        view: detailview,
        detailFormatter: function (index, row) {
            return '<div style="padding:2px"><table class="ddv"></table></div>';
        },
        onExpandRow: function (index, row) {
            var ddv = $(this).datagrid('getRowDetail', index).find('table.ddv');
            ddv.datagrid({
                method: 'get',
                url: '/res?pid=' + row.id,
                fitColumns: true,
                singleSelect: true,
                loadMsg: '',
                height: 'auto',
                columns: [[
                    {field: 'id', title: 'Id', sortable: true},
                    {
                        field: 'res_name', title: '角色名', width: 100, sortable: true
                    }, {
                        field: 'res_type', title: '资源类型', width: 100, sortable: true,
                        formatter: function (value) {
                            if (value == 0) {
                                return '菜单'
                            } else {
                                return '资源'
                            }
                        }
                    }, {
                        field: 'path', title: '路径', width: 100, sortable: true
                    }, {
                        field: 'create_time', title: '创建时间', width: 100, sortable: true,
                        formatter: function (value, row, index) {
                            return new Date(value).format("yyyy-MM-dd hh:mm:ss");
                        }
                    }, {
                        field: 'update_time', title: '最后一次更新时间', width: 100, sortable: true,
                        formatter: function (value, row, index) {
                            return new Date(value).format("yyyy-MM-dd hh:mm:ss");
                        }
                    }
                ]],
                onResize: function () {
                    $('#dg').datagrid('fixDetailRowHeight', index);
                },
                onLoadSuccess: function () {
                    setTimeout(function () {
                        $('#dg').datagrid('fixDetailRowHeight', index);
                    }, 0);
                },
                onSelect: function (rowIndex, rowData) {
                    var cur = this;
                    $('table.ddv.datagrid-f').each(function (index, item) {
                        if (cur != item) {
                            $(item).datagrid('unselectAll');
                        }
                    });
                    dg.datagrid('unselectAll');
                },
            });
            $('#dg').datagrid('fixDetailRowHeight', index);
        }
    });
});
// =========================================================================================================================================================
function query() {
    $('#dg').datagrid({
        queryParams: {
            resName: $('#resName').val()
        }
    });
}

var base = '/res/';
var url;

function initForm() {
    $('#res_type').combobox({value: 0});
    $('#seq').numberspinner({value: 0});
    $('#path').textbox({disabled: false});
}

function add() {
    $('#dlg').dialog('open').dialog('center').dialog('setTitle', '添加');
    initForm();
    url = base;
}

function edit() {
    console.info($('#dg').datagrid('subgrid'));
    console.info($('#dg').datagrid('subgrid').datagrid('getSelected'));
    var row = $('#dg').datagrid('getSelected');
    if (row == null) {
        $('table.ddv.datagrid-f').each(function (index, item) {
            row = $(item).datagrid('getSelected');
        });
    }
    if (row) {
        initForm();
        $('#dlg').dialog('open').dialog('center').dialog('setTitle', '编辑');
        if (row.pid == -1) {
            $('#fm').form('load', {
                res_name: row.res_name,
                path: row.path
            })
        } else {
            $('#fm').form('load', row);
        }
        url = base + row.id;
    } else {
        $.alertMsg('请选择一行数据');
    }
}

function save() {
    $('#fm').form('submit', {
        url: url,
        onSubmit: function () {
            if ($(this).form('validate')) {
                $.messager.progress();
                return true;
            }
            return false;
        },
        success: function (result) {
            $.messager.progress('close');
            var result = eval('(' + result + ')');
            if (result.ok) {
                $('#cc').combobox('reload');
                $('#dlg').dialog('close');        // close the dialog
                $('#dg').datagrid('reload');    // reload the user data
            } else {
                $.messager.show({
                    title: '系统提示',
                    msg: result.msg
                });
            }
        }
    });
}

function destroy() {
    var row = $('#dg').datagrid('getSelected');
    if (row == null) {
        $('table.ddv.datagrid-f').each(function (index, item) {
            row = $(item).datagrid('getSelected');
        });
    }
    if (row) {
        $.messager.confirm('系统提醒', '您确定删除这条数据吗?', function (r) {
            if (r) {
                $.messager.progress();
                $.ajax({
                    url: base + row.id,
                    type: 'DELETE',
                    dataType: 'json',
                    success: function (result) {
                        $.messager.progress('close');
                        if (result.ok) {
                            $('#dg').datagrid('reload');    // reload the user data
                        } else {
                            $.messager.show({    // show error message
                                title: '系统提示',
                                msg: result.msg
                            });
                        }
                    }
                });
            }
        });
    }
}