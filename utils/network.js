function Post(param) {
  // wx.showLoading({
  //   title: '加载中',
  //   icon:'loading',
  //   mask:true
  // });
  wx.request({
    url: param.url,
    data: param.data,
    method: "POST",
    dataType: 'JSON',
    header: {
      "content-type": 'application/x-www-form-urlencoded'
    },
    success: function (res1) {

      var result = JSON.parse(res1.data);
      if (result.token) {
        var userInfo = wx.getStorageSync('user');
        var login = wx.getStorageSync('login');
        var token = userInfo.token
        if (result.token != token) {
          userInfo.token = result.token
          login.token = result.token
          wx.setStorageSync('user', userInfo);
          wx.setStorageSync('login', login);
        }
      }
      param.success(res1);
    },
    fail: function (res2) {
      param.fail(res2.errMsg);
    }
  })
}

module.exports = {
  Post: Post
}