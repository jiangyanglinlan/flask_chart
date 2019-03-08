var log = function() {
    console.log.apply(console, arguments)
}

// 返回自己在父元素中的下标
var indexOfElement = function(element) {
    var parent = element.parentElement
    for (var i = 0; i < parent.children.length; i++) {
        var e = parent.children[i]
        if (e === element) {
            return i
        }
    }
}

// 给 add button 绑定添加事件
var bindEventAdd = function() {
    log('bind add button')
    var addButton = document.querySelector('#id-button-add')
    log('add button', addButton)
    addButton.addEventListener('click', function(){
        log('click add')
        // 获得 input.value
        var name = document.querySelector('#id-input-name').value
        var value = document.querySelector('#id-input-value').value
        // 生成数据对象
        var todo = {
            'name': name,
            'value': value
        }
        todoList.push(todo)
        saveTodos()
        insertTodo(todo)
    })
}

var bindEventEnter = function() {
    var todoContainer = document.querySelector('#id-div-container')
    todoContainer.addEventListener('keydown', function(event){
        log('container keydown', event, event.target)
        var target = event.target
        if(event.key === 'Enter') {
            log('按了回车')
            // 失去焦点
            target.blur()
            // 阻止默认行为的发生, 也就是不插入回车
            event.preventDefault()
            // 更新
            var index = indexOfElement(target.parentElement)
            log('update index',  index)
            log('target =', target)
            // 把元素在 todoList 中更新
            todoList[index].value = target.innerHTML
            // todoList.splice(index, 1)
            saveTodos()

        }
    })
}

var bindEventButton = function() {
    // 通过 event.target 的 class 来检查点击的是什么
    var todoContainer = document.querySelector('#id-div-container')
    todoContainer.addEventListener('click', function(event){
        log('container click', event, event.target)
        var target = event.target
        if (target.classList.contains('todo-delete')) {
            log('delete')
            var todoDiv = target.parentElement
            var index = indexOfElement(target.parentElement)
            log('delete index',  index)
            todoDiv.remove()
            // 把元素从 todoList 中 remove 掉
            // delete todoList[index]
            todoList.splice(index, 1)
            saveTodos()
        } else if (target.classList.contains('todo-edit')) {
            log('edit')
            var cell = target.parentElement
            var span = cell.children[3]
            log('span is ', span)
            span.setAttribute('contenteditable', 'true')
            span.focus()
        }
    })
}

var EventType = {
    blur: 'blur',
    click: 'click',
}

var bindEventBlur = function() {
    log('bind event blur function')
    var todoContainer = document.querySelector('#id-div-container')
    todoContainer.addEventListener(EventType.blur, function(event){
        log('container blur', event, event.target)
        var target = event.target
        if (target.classList.contains('todo-value')) {
            log('update and save')
            // 让 span 不可编辑
            target.setAttribute('contenteditable', 'false')
            // 更新
            var index = indexOfElement(target.parentElement)
            log('update index',  index)
            // 把元素在 todoList 中更新
            todoList[index].value = target.innerHTML
            log('target =', target)
            // todoList.splice(index, 1)
            saveTodos()
        }
    }, true)
}


var bindEvents = function() {
    // 添加 数据
    bindEventAdd()
    // 文本框输入数据按回车保存
    bindEventEnter()
    // 完成按钮和删除按钮
    bindEventButton()
    // 文本框失去焦点后保存
    bindEventBlur()
}

// 插入数据
var insertTodo = function(todo) {
    // 添加到 container 中
    var todoContainer = document.querySelector('#id-div-container')
    var t = templateTodo(todo)
    // 这个方法用来添加元素更加方便, 不需要 createElement
    todoContainer.insertAdjacentHTML('beforeend', t);
}

// 插入的模板
var templateTodo = function(todo) {
    var t = `
        <div class='todo-cell'>
            <button class='todo-delete'>删除</button>
            <button class='todo-edit'>编辑</button>
            <span class='todo-label'>${todo.name}</span> <span class="todo-value">${todo.value}</span>
        </div>
    `
    return t
}

// 加载数据
var loadTodos = function() {
    result = new Array()
    if (option.series[0].type != 'pie') {
        var v = option.series[0].data
        var name = option.xAxis.data
        for (var i = 0; i < v.length; i++) {
            data = {'name': name[i], 'value': v[i]}
            result.push(data)
        }
    } else {
        var s = option.series[0].data
        for (var i = 0; i < s.length; i++) {
            result.push(s[i])
        }
    }
    return result
}

// 保存数据
var saveTodos = function() {
    var name = new Array()
    var value = new Array()
    if (option.series[0].type != 'pie') {
        for (var i = 0; i < todoList.length; i++) {
            name.push(todoList[i].name)
            value.push(todoList[i].value)
        }
        option.xAxis.data = name
        option.series[0].data = value
    } else {
        for (var i = 0; i < todoList.length; i++) {
            name.push(todoList[i].name)
            value.push({'name': todoList[i].name, 'value': todoList[i].value})
        }
        option.legend.data = name
        option.series[0].data = value
    }
    reviewChart()
}

// 页面初始化数据
var initTodos = function() {
    todoList = loadTodos()
    for (var i = 0; i < todoList.length; i++) {
        insertTodo(todoList[i])
    }
}

// 获取当前时间
var currentTime = function() {
    var d = new Date();
    return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + ' ' + d.getHours() +
        ':' + d.getMinutes() + ':' + d.getSeconds()
}

$(function(){
    $('.save').click(function(){
        m = {
            'pie': '饼状图',
            'bar': '柱状图',
            'line': '折线图',
        }
        var data = {
            'name': '创建于' + currentTime() + '的' + m[series[0].type],
            'option': JSON.stringify(option)
        }
        console.log('data =', data)
        $.ajax({
            type: 'POST',
            url: '/chart/api/v1.0/items',
            data: data,  // 要 post 的数据
            success: function(data){  // 这个data是接收到的响应的实体
                if (data['result'] == 'success') {
                    log('ajax 成功!')
                    console.log(data['option_id'])
                    console.log(data['option_name'])
                }
                // if(data[''] == 'vote'){
                //     votesNum.text(Number(votesNum.text()) + 1);
                //     $('.voted').text('已赞');
                // } else if(data == 'cancel'){
                //     votesNum.text(votesNum.text() - 1);
                //     $('.voted').text('觉得不错？');
                // } else if(data == 'disable'){
                //     alert('你不能给自己点赞');  // 这里可以用模态框，会好看点~~懒得弄了
                // } else if(data.status == 302){
                //     location.href = data.location;
                // }
            }
        });
    });
});