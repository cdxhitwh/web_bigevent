$(function () {
  var form = layui.form
  var layer = layui.layer
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在1-6个字符'
      }
    },
  })
  initUserInfo()
  // 初始化用户基本信息
  function initUserInfo() {
    $.ajax({
      url: '/my/userinfo',
      method: 'get',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败')
        }
        // console.log(res)
        // 调用form.val()快速为表单复制
        form.val('formUserInfo', res.data)
      },
    })
  }

  // 实现重置功能能
  $('#btnReset').on('click', function (e) {
    // 组织表单默认重置行为
    e.preventDefault()
    initUserInfo()
  })

  // 监听表单的提交事件
  $('.layui-form').on('submit', function (e) {
    // 组织表单的默认提交行为
    e.preventDefault()
    // 发起ajax数据请求
    $.ajax({
      url: '/my/userinfo',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('修改用户信息失败')
        }
        layer.msg('修改用户信息成功')
        // 调用父页面中的方法，渲染用户信息
        // window相当于iframe，parent就相当于父页面
        window.parent.getUserInfo()
      },
    })
  })
})
