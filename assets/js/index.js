$(function () {
  // 获取用户基本信息
  getUserInfo()
  var layer = layui.layer
  $('#btnLogout').on('click', function () {
    // 提示用户是否退出
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
      //do something
      // 清空token
      localStorage.removeItem('token')
      // 重新跳转到登陆页面
      location.href = '/login.html'
      // 关闭confirm询问框
      layer.close(index)
    })
  })
})
// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    url: '/my/userinfo',
    method: 'GET',
    // headers就是请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token') || '',
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败')
      }
      // 调用renderAvatar渲染用户头像
      renderAvatar(res.data)
    },
    // complete: function (res) {
    //   // console.log(res);
    //   // 在complete回调函数中，可以使用res.respnseJSON拿到服务器响应回来的数据
    //   if ((res.responseJSON.status === 1) & (res.responseJSON.message === '身份认证失败！')) {
    //     // 这种情况是为了应对，程序员使用假token，在搜索栏直接输入index.html跳转到主界面
    //     // res.responseJSON会返回信息对象，类似于{status:1,message:'身份认证失败'}
    //     // 从而清空本地存储
    //     localStorage.removeItem('token')
    //     location.href = '/login.html'
    //   }
    // },
  })
}
// 渲染用户头像
function renderAvatar(user) {
  // 获取用户名称
  var name = user.nickname || user.username
  // 设置欢迎文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  // 按需渲染用户头像
  if (user.user_pic !== null) {
    // 渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    // 渲染文本图像
    $('.layui-nav-img').hide()
    var first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}
