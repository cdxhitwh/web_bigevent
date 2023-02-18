// 注意：每次调用$.get $.post $.ajax时候
// 会先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // 在发起ajax请求前，统一拼接根路径
  options.url = 'http://www.liulongbin.top:3007' + options.url
  // console.log(options.url)
  // 统一为有权限的接口，设置headers请求头
  // 有权限的，url中有/my/字段，如果有才添加！

  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || '',
    }
  }

  // 全局统一挂在complete回调函数
  options.complete = function (res) {
    // console.log(res);
    // 在complete回调函数中，可以使用res.respnseJSON拿到服务器响应回来的数据
    if ((res.responseJSON.status === 1) & (res.responseJSON.message === '身份认证失败！')) {
      // 这种情况是为了应对，程序员使用假token，在搜索栏直接输入index.html跳转到主界面
      // res.responseJSON会返回信息对象，类似于{status:1,message:'身份认证失败'}
      // 从而清空本地存储
      localStorage.removeItem('token')
      location.href = '/login.html'
    }
  }
})
