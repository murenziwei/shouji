//存储应用对象
var g_app = getApp();
var UerUrl = getApp().data.UerUrl;

//用户自动登录接口
function AutoLogin(param) {
  //显示运行动画
  wx.showLoading({
    title: '加载中',
  });

  //微信用户登录
  wx.login({
    success: res1 => onLoginSuccess(param.url,param.data,param.success, param.fail, res1),
    fail: function (res2) {
      wx.hideLoading();
      param.fail('请求失败，请重试!');
    }
  });
}

//微信登录成功回调
function onLoginSuccess(url,data,success, fail, res) {
  //获取用户信息
  wx.getUserInfo({
    success: res1 => onInfoSuccess(url,data,res.code, success, fail, res1),
    fail: function (res2) {
      wx.hideLoading();
      fail('请求失败，请重试!');
    }
  });
}

//获取信息成功回调
function onInfoSuccess(url,data,code,success, fail, res) {
  //获取用户位置
  wx.getLocation({
    success: res1 => onLocationSuccess(url, data, code, res.userInfo, success, fail, res1),
    fail: function (res2) {
      wx.hideLoading();
      fail('请求失败，请重试!');
    }
  });
}

//获取位置成功回调
function onLocationSuccess(url, data, code, info, success, fail, res) {
  //用户自动登录
  wx.request({
    url: UerUrl + 'api/User/AutoLogin',
    data: {
      code: code,
      share: '',
      info: JSON.stringify({
        nick: info.nickName,
        avatar: info.avatarUrl,
        sex: info.gender,
        longitude: res.longitude,
        latitude: res.latitude
      }),
    },
    method: "POST",
    dataType: 'JSON',
    header: {
      "content-type": 'application/x-www-form-urlencoded'
    },
    success: res1 => onAutoSuccess(url, data,success, fail, res1),
    fail: function (res2) {
      wx.hideLoading();
      fail('请求失败，请重试!');
    }
  });
}

//自动登录成功回调
function onAutoSuccess(url, data,success, fail, res) {
  var ret = JSON.parse(res.data);
  getApp().globalData.member = ret.data.member;
  if (0 == ret.status){
    data.token = ret.data.token;
    wx.request({
      url: url,
      data: data,
      method: "POST",
      dataType: 'JSON',
      header: {
        "content-type": 'application/x-www-form-urlencoded'
      },
      success: function(res1){
        var tmp = JSON.parse(res1.data);
        if (0 == JSON.parse(res1.data).status){
          success(res1);
        }else{
          fail('请求失败，请重试!');
        }
        if (1101 !== JSON.parse(res1.data).status){
          var userInfo = wx.getStorageSync('user');
          userInfo.token = JSON.parse(res1.data).token;
          wx.setStorageSync('user', userInfo);
        }
        wx.hideLoading();
      },
      fail: function (res2) {
        fail('请求失败，请重试!');
        wx.hideLoading();
      }
    });
  }else {
    wx.hideLoading();
    fail("错误码[" + ret.status + "]:" + ret.error);
  }
}

module.exports = {
  AutoLogin: AutoLogin
}