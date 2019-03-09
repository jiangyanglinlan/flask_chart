// 生成图表
var createChart = function (option) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('chartmain'));
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

// 重绘图表
var reviewChart = function () {
    var myChart = echarts.init(document.getElementById('chartmain'));
    myChart.setOption(option, true);
    initTodos()
}

// 修改类型
var changeType = function(current_type) {
    togglePie(current_type)
    option.series[0].type = current_type
    reviewChart()
}

// 柱状/折线 -> 饼状
var toPie = function () {
    option.legend.data = option.xAxis.data
    // 删除 x, y 轴
    delete option.xAxis
    delete option.yAxis
    list = []
    for (var i = 0; i < option.legend.data.length; ++i) {
        list.push(
            {
                value: option.series[0].data[i],
                name: option.legend.data[i]
            },
        )
    }
    option.series[0].data = list
}

// 饼状 -> 柱状/折线
var toPillar = function () {
    option.xAxis = {}
    option.xAxis.data = option.legend.data
    option.yAxis = {}
    option.legend.data = Array()
    option.legend.data.push(option.series[0].name)
    l = Array()
    for (var i = 0; i < option.series[0].data.length; ++i) {
        l.push(option.series[0].data[i].value)
    }
    option.series[0].data = l
}

// 饼图
var togglePie = function(current_type) {
    option_type = option.series[0].type
    if (current_type == 'pie' && option_type != 'pie') {
        // 当前是柱状或折线图时, 转化为饼状
        toPie()
    } else if (current_type != 'pie' && option_type == 'pie') {
        // 当前是饼状时, 转化为柱状
        toPillar()
    }
}

// 修改图表类型
$('.chart-type').on('click', function(e){
    current_type = $(this).data('name')
    changeType(current_type)
})

var __main = function () {
    option = createOption()
    createChart(option)
    bindEvents()
    initTodos()
}

__main()