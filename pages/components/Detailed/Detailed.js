var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var pay = getApp().data.pay;
var network = require("../../../utils/network.js"); //接口封装
Page({
  data: {
    tabs: ["无效","审核中","已打款"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function () {
    var that = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function (res) {
        var user = res.data;
        network.Post({
          url: pay + 'api/Postal/UserPostal',
          data: {
            token: user.token,
            openid: user.openid,
            page: 1,
            numble: 5,
            'type':1
          },
          success: function (res) {
            if (1101 != JSON.parse(res.data).status) {//修改token
              var token = JSON.parse(res.data).token;
              var userInfo = wx.getStorageSync('user');
              userInfo.token = token;
              wx.setStorageSync('user', userInfo);
            }
            var shuliang = JSON.parse(res.data).data;
            that.setData({
              shuliang:shuliang
            })
          }
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    var activeIndex = e.currentTarget.id;
    var that = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function (res) {
        var user = res.data;
        network.Post({
          url: pay + 'api/Postal/UserPostal',
          data: {
            token: user.token,
            openid: user.openid,
            page: 1,
            numble: 5,
            'type': activeIndex
          },
          success: function (res) {
            if (1101 != JSON.parse(res.data).status) {//修改token
              var token = JSON.parse(res.data).token;
              var userInfo = wx.getStorageSync('user');
              userInfo.token = token;
              wx.setStorageSync('user', userInfo);
            }
            var shuliang = JSON.parse(res.data).data;
            that.setData({
              shuliang: shuliang
            })
          }
        })
      }
    })
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  // onShareAppMessage: function () {
  //   return {
  //     title: '转发获取金币',
  //     desc: '分享给好友',
  //     path: 'pages/index/index?share=' + wx.getStorageSync('user').openid,
  //     success: function (res) {
  //       console.log(res)
  //     },
  //     fail: function (res) {
  //       console.log(res)
  //     },
  //   }
  // }
});