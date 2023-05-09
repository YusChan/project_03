// 模块一：点击input框
const ips = document.querySelectorAll('[type=text]');
for (let i = 0; i < ips.length; i++) {
    ips[i].addEventListener('focus', function() {
        ips.forEach(function(ele) {
            ele.classList.remove('sixpx')
        })
        this.classList.add('sixpx')
    })
    ips[i].addEventListener('blur', function() {
        ips.forEach((ele) => {
            ele.classList.remove('sixpx')
        })
    })
}

//模块2: 点击 未完成任务，给其添加样式，然后将已完成任务去除样式
// 模块3：点击未完成显示未完成盒子，点击已完成显示已完成盒子
const w = document.querySelector('.w');
const y = document.querySelector('.y');
const main_w = document.querySelector('#main-w');
const main_y = document.querySelector('#main-y');
const nav_ul = document.querySelector('.nav_ul');
nav_ul.addEventListener('click', function(e) {
    const { target } = e
    if (target.tagName === 'LI') {
        if (target.classList[0] === 'w') {
            y.classList.remove('active')
            target.classList.add('active')

            main_y.className = 'none';
            main_w.className = 'block'
        }
        if (target.classList[0] === 'y') {
            w.classList.remove('active')
            target.classList.add('active')

            main_w.className = 'none';
            main_y.className = 'block'
        }
    }
})

//模块4：显示时间模块
// 声明一个时间函数
function showTime() {
    const date = new Date()
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()
    let h = date.getHours()
    h = h < 10 ? '0' + h : h
    let mi = date.getMinutes()
    mi = mi < 10 ? '0' + mi : mi
    let s = date.getSeconds()
    s = s < 10 ? '0' + s : s
    return `${y}-${m}-${d} ${h}:${mi}:${s}`
}
// 防止定时器1秒之后调用showTime()函数，首先在外面调用一次
document.querySelector('.date').innerHTML = showTime()

// 定义一个定时器，每1秒调用一次showTime()函数 获取最新时间
setInterval(function() {
    // 将返回的最新时间，写入date盒子页面中
    document.querySelector('.date').innerHTML = showTime()
}, 1000)


const w_arr = JSON.parse(localStorage.getItem('data_w')) || [];
const y_arr = JSON.parse(localStorage.getItem('data_y')) || [];
// 模块5：渲染业务
// flag变量用于，区别渲染未完成还是已完成页面，当flag参数是w 则是渲染未完成页面，参数是y则渲染已完成页面
function render(arr, flag) {
    let str;
    if (flag === 'w') {
        str = '添加已完成任务'
    } else if (flag === 'y') {
        str = '删除已完成任务'
    }
    const newTr = arr.map((ele, index) => {
        return `<tr>
            <td>${ele.date}</td>
            <td>${ele.a}</td>
            <td>${ele.b}</td>
            <td>${ele.c}</td>
            <td>${ele.d}</td>
            <td>
                <a href="#" data-id=${index}>${str}</a>
            </td>
        </tr> `
    }).join('')
    if (flag === 'w') {
        document.querySelector('#main-w tbody').innerHTML = newTr
    } else if (flag === 'y') {
        document.querySelector('#main-y tbody').innerHTML = newTr
    }
}
render(w_arr, 'w')
render(y_arr, 'y')

//模块6：新增业务
// 点击添加添加表单数据到表格中
// 首先获取表单
const ipt1 = document.querySelector('.ipt1')
const ipt2 = document.querySelector('.ipt2')
const ipt3 = document.querySelector('.ipt3')
const ipt4 = document.querySelector('.ipt4')
document.querySelector('.info').addEventListener('submit', function(e) {
    // 取消默认行为，不提交表单数据
    e.preventDefault();
    // 判断表示是否有为空的
    if (!(ipt1.value && ipt2.value && ipt3.value && ipt4.value)) return alert('待办不能为空哦');
    // 向未待办数组追加数据
    w_arr.push({
        'date': showTime(),
        'a': ipt1.value,
        'b': ipt2.value,
        'c': ipt3.value,
        'd': ipt4.value
    });
    // 将追加到未待办数组的最新数据转换为JSON字符串的形式 添加到本地存储中
    localStorage.setItem('data_w', JSON.stringify(w_arr));
    // 然后调用渲染函数，渲染页面
    render(w_arr, 'w');
    // 最后将表单里面的数据清除 reset()
    this.reset()
})

// 模块7：点击添加已完成任务，添加到已完成任务的数组中
// 采用事件委托形式
document.querySelector('#main-w tbody').addEventListener('click', function(e) {
    const { target } = e
    if (target.tagName === 'A') {
        // 将对应的未完成数组中已完成的任务加入到已完成数组中
        y_arr.push(w_arr[target.dataset.id]);
        // 然后将添加到已完成数组中对象的date属性赋值为当前最新的时间
        y_arr[target.dataset.id].date = showTime();
        // 将已完成数组中的最新数据转换为JSON字符串，添加到本地存储中
        localStorage.setItem('data_y', JSON.stringify(y_arr));
        // 然后将已完成数组中最新的数据渲染到已完成页面中
        render(y_arr, 'y');
        // 将添加到已完成数组中对应的未完成的那条数据删除
        w_arr.splice(target.dataset.id, 1);
        // 然后将未完成数组中的最新数据转换为JSON字符串的形式 添加到本地存储中
        localStorage.setItem('data_w', JSON.stringify(w_arr));
        // 然后重新渲染未完成数组中最新的数据
        render(w_arr, 'w')
    }
})

// 模块8：将已完成数组中的任务删除
document.querySelector('#main-y tbody').addEventListener('click', function(e) {
    const { target } = e
    if (target.tagName === 'A') {
        if (confirm('您确定要删除吗 ? ')) {
            // 将要在已完成数组中移除的数组移除
            y_arr.splice(target.dataset.id, 1);
            // 然后将已完成数组中最新的数据转换为JSON字符串，存储到本地存储中
            localStorage.setItem('data_y', JSON.stringify(y_arr));
            // 将已完成数组中最新的数据渲染到已完成页面中
            render(y_arr, 'y')
        }
    }
})