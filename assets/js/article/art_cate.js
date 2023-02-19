$(function () {
  var layer = layui.layer
  var form = layui.form
  initArtCateList()
  // 获取图书列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      },
    })
  }

  //
  var indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html(),
    })
  })

  // 通过代理的形式为form-add绑定submit事件
  // 因为在此之前，这个form-add不存在
  $('body').on('submit', '#form-add', function (e) {
    // console.log('ok')
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          // console.log(res)
          return layer.msg('新增分类失败')
        }
        initArtCateList()
        layer.msg('新增分类成功')
        // 根据索引关闭弹出层
        layer.close(indexAdd)
      },
    })
  })

  // 代理的形式为编辑按钮绑定事件
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    indexEdit = layer.open({
      // type属性为弹出层的性质，比如提示框等等
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html(),
    })
    // 获取按钮id
    var id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        // console.log(res);
        form.val('form-edit', res.data)
      },
    })
  })

  $('tbody').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新失败')
        }
        
        layer.msg('更新成功')
        layer.close(indexEdit)
        initArtCateList()
      },
    })
  })

  // 删除功能
  $('tbody').on('click', '.btn-delete', function () {
    layer.confirm('确认删除？', {
      // type属性为弹出层的性质，比如提示框等等
      icon: 3,

      title: '提示',
    })
    // 获取按钮id
    var id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: '/my/article/deletecate/' + id,
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg('删除分类失败')
        }
        layer.msg('删除分类成功')
        layer.close(index)
        initArtCateList()
      },
    })
  })
})
