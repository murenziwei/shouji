//存储应用对象
var g_app = getApp();
var UerUrl = getApp().data.UerUrl;
//用户自动登录接口
function AutoLogin(param) {
  //显示运行动画
  wx.showLoading({
    title: '正在登录',
  });

  //微信用户登录
  wx.login({
    success: res1 => {
      console.log(res1);
      console.log(param);
      
      onLoginSuccess(param.success, param.fail, res1)
    },
    fail: function (res2) {
      wx.hideLoading();
      param.fail(res2.errMsg);
    }
  });
}

//微信登录成功回调
function onLoginSuccess(success, fail, res) {
  // console.log(success, fail, res);
  //获取用户信息
  

  console.log(res.code);
  let info = wx.getStorageSync('userlogin');
  onInfoSuccess(res.code, success, fail, info);

}

//获取信息成功回调
function onInfoSuccess(code, success, fail, res) {
  //获取用户位置
  console.log(code, res);
  // wx.getLocation({
  //   success: res1 => onLocationSuccess(code, res.userInfo, success, fail, res1),
  //   fail: function(res2) {
  //     console.log(res2)
  //     wx.hideLoading();
  //     console.log(1111111111)
  //     fail(res2.errMsg);
  //   }
  // });
  onLocationSuccess(code, res.userInfo, success, fail)
}

//获取位置成功回调
function onLocationSuccess(code, info, success, fail) {
  //获取分享者openid
  var share = wx.getStorageSync('share');
  console.log(code, info, success, fail)
  //用户自动登录
  wx.request({
    url: UerUrl + 'api/User/AutoLogin',
    data: {
      code: code,
      share: share,
      info: JSON.stringify({
        nick: info.nickName,
        avatar: info.avatarUrl,
        sex: info.gender
      }),
    },
    method: "POST",
    dataType: 'JSON',
    header: {
      "content-type": 'application/x-www-form-urlencoded'
    },
    success: res1 => onAutoSuccess(success, fail, res1),
    fail: function (res2) {
      wx.hideLoading();
      fail(res2.errMsg);
    }
  });
}

//自动登录成功回调
function onAutoSuccess(success, fail, res) {
  var ret = JSON.parse(res.data);
  if (0 == ret.status) {
    wx.setStorageSync('user', ret.data);
    wx.hideLoading();
    success(ret.data);
    console.log(success);
    console.log(ret.data.member)
    getApp().globalData.member = ret.data.member
  }
  else {
    wx.hideLoading();
    fail("错误码[" + ret.status + "]:" + ret.error);
  }
}

module.exports = {
  AutoLogin: AutoLogin
}