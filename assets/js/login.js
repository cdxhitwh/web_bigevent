$(function () {
  // 点击去注册账号的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  // 点击去登陆链接
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  // 从layui获取form对象
  // layui是js导入后就有这个对象了
  var form = layui.form
  var layer = layui.layer
  // 通过form.verify函数自定义校验规则
  form.verify({
    // 自定义了一个叫pwd的校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 校验两次密码是否一致的规则
    repwd: function (value) {
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于判断
      // 如果判断失败，return一个提示消息即可
      // 属性选择器，选择reg-box标签下所有name属性为password的元素
      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致'
      }
    },
  })

  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()
    // 发起ajax请求
    $.post(
      '/api/reguser',
      {
        // 注意选择器中间的空格符
        username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val(),
      },
      function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('注册成功,请登录')
        // 模拟点击行为
        $('#link_login').click()
      }
    )
  })

  // 监听登录事件
  $('#form_login').submit(function (e) {
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登陆失败')
        }
        layer.msg('登陆成功')
        // 将登陆成功得到的token字符串，保存到localStorage中
        localStorage.setItem('token', res.token)

        // 跳转到后台主页
        location.href = '/index.html'
      },
    })
  })
})
