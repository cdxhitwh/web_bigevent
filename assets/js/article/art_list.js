$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage
  // d定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }
  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
  // 定义一个查询参数对象，将来请求数据的时候
  // 需要将请求对象提交到服务器
  var q = {
    pagenum: 1, //页码值，默认请求第一页
    pagesize: 2, //每页显示的数据条数
    cate_id: '', //文章分类的id
    state: '', //文章的发布状态
  }

  initTable()
  initCate()

  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败')
        }
        // 使用模板引擎渲染页面数据
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        renderPage(res.total)
        console.log('ok,but no data')
      },
    })
  }

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败')
        }
        // 使用模板引擎渲染页面数据
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // console.log(htmlStr)
        // 通过layui重新渲染表单区域的UI结构
        // 这是为什么呢，因为我们的选项是动态添加的
        // 但是渲染页面的时候，因为选项不存在，所以layui.all.js文件并没有渲染这部分内容
        // 所以，需要我们主动渲染一下这些选项，layui的render方法可以实现
        form.render()
      },
    })
  }

  // 为筛选表单绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    // 获取表单选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 为查询参数q赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件，重新渲染数据
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    console.log(total)
    laypage.render({
      elem: 'pageBox',
      count: total,
      limit: q.pagesize, //每页显示几条数据
      curr: q.pagenum, //设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 分页发生切换时,触发jump回调

      // 触发jump回调的方式有两种
      // 1.点击页面切换会触发jump循环
      // 2.只要调用laypage.render方法就会触发jump回调

      jump: function (obj, first) {
        // 第一种方法first为false
        // 第二种方法first为true
        // 只有first为false的时候才initTable

        // 把最新的页码赋值给q查询参数对象
        q.pagenum = obj.curr
        // 把最新的条目赋值给q的查询参数
        q.pagesize = obj.limit
        // 根据最新的页数查询数据列表,并渲染表格
        // 只有first为false的时候才initTable
        // 第一种方法first为false
        // 第二种方法first为true
        if (!first) {
          initTable()
        }
      },
    })
  }

  // 删除功能
  $('tbody').on('click', '.btn-delete', function () {
    var len = $('.btn-delete').length
    layer.confirm('确认删除？', {
      // type属性为弹出层的性质，比如提示框等等
      icon: 3,

      title: '提示',
    })
    // 获取按钮id
    var id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: '/my/article/delete/' + id,
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg('删除文字失败')
        }
        layer.msg('删除文章成功')
        layer.close(index)
        // 当数据删除完成后,需要判断这一页,是否还有剩余数据
        // 如果没有剩余数据,则让页码值-1
        //此时页码为4,但调用init后,请求第4页,数据为空
        if (len === 1) {
          // 如果len值为1,删除完毕后,页面上就没有任何数据了
          // 页码值最小必须是1
          q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
        }
        initTable()
      },
    })
  })
})
