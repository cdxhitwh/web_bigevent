// 注意：每次调用$.get $.post $.ajax时候
// 会先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // 在发起ajax请求前，统一拼接根路径
  options.url = 'http://www.liulongbin.top:3007' + options.url
  console.log(options.url)
})
