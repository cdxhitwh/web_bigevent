$(function () {
  var layer = layui.layer

  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview',
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 为上传按钮绑定点击事件
  $('#btnChooseImage').on('click', function () {
    $('#file').click()
  })
  // 为文件选择框绑定 change 事件
  $('#file').on('change', function (e) {
    var filelist = e.target.files
    if (filelist.length === 0) {
      return layer.msg('请选择照片')
    }
    // 拿到用户选择的文件
    var file = e.target.files[0]
    // 根据选择的文件，创建一个对应的URL地址
    var newImgUrl = URL.createObjectURL(file)
    // 先销毁旧的裁剪区域
    // 再设置图片路径
    // 重新初始化裁剪区域
    $image.cropper('destroy').attr('src', newImgUrl).cropper(options)
  })

  $('#btnUpload').on('click', function () {
    // 1. 要拿到用户裁剪之后的头像
    var dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    // 调用接口，上传到服务器
    $.ajax({
      method: 'post',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL,
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('修改头像失败')
        }
        layer.msg('更新头像成功')
        window.parent.getUserInfo()
      },
    })
  })
})
