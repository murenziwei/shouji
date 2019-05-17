// pages/components/Distribution_order/Distribution_order.js
var commodity = getApp().data.detail;
var network = require("../../../utils/network.js"); //接口封装
var g_againLogin = require("../../../utils/AgainLogin.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xianshi: 0,
    page:1,
    shuliang:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function (res) {
        var user = res.data;
        network.Post({
          url: commodity + 'api/Share/OwnOrder',
          data: {
            token: user.token,
            openid: user.openid,
            page:1,
            numble:7
          },
          success: function (res) {
            if (1101 != JSON.parse(res.data).status) {//修改token
              var token = JSON.parse(res.data).token;
              var userInfo = wx.getStorageSync('user');
              userInfo.token = token;
              wx.setStorageSync('user', userInfo);
            }else if(JSON.parse(res.data).status == 3){
              g_againLogin.AutoLogin({
                url: commodity + 'api/Share/OwnOrder',
                data: {
                  openid: wx.getStorageSync('user').openid,
                  token: '',
                  page: 1,
                  numble: 6
                },
                success: function (res) {  //返回数据处理
                  var shuliang = JSON.parse(res.data).data;
                  for (var i = 0; i < shuliang.length; i++) {
                    shuliang[i].goods_info = JSON.parse(shuliang[i].goods_info)
                  }
                  that.setData({
                    shuliang: shuliang
                  })
                },
                fail: function (res) {
                  g_app.ShowError(res, 3000);
                },
              });
            }
            var shuliang = JSON.parse(res.data).data;
            for(var i = 0;i < shuliang.length; i++){
              shuliang[i].goods_info = JSON.parse(shuliang[i].goods_info)
            }
            that.setData({
              shuliang:shuliang
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    var page = this.data.page +1;
    this.setData({
      page:page
    })
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function (res) {
        var user = res.data;
        network.Post({
          url: commodity + 'api/Share/OwnOrder',
          data: {
            token: user.token,
            openid: user.openid,
            page: that.data.page,
            numble: 5
          },
          success: function (res) {
            if (1101 != JSON.parse(res.data).status) {//修改token
              var token = JSON.parse(res.data).token;
              var userInfo = wx.getStorageSync('user');
              userInfo.token = token;
              wx.setStorageSync('user', userInfo);
            }
            if (JSON.parse(res.data).status == 3) {
              g_againLogin.AutoLogin({
                url: commodity + 'api/Share/OwnOrder',
                data: {
                  openid: wx.getStorageSync('user').openid,
                  token: '',
                  page: 1,
                  numble: 6
                },
                success: function (res) {  //返回数据处理
                  var shuliang = JSON.parse(res.data).data;
                  for (var i = 0; i < shuliang.length; i++) {
                    shuliang[i].goods_info = JSON.parse(shuliang[i].goods_info)
                  }
                  that.setData({
                    shuliang: shuliang
                  })
                },
                fail: function (res) {
                  g_app.ShowError(res, 3000);
                },
              });
            } else if (JSON.parse(res.data).status == 0){
              var shuliang = JSON.parse(res.data).data;
              for (var i = 0; i < shuliang.length; i++) {
                shuliang[i].goods_info = JSON.parse(shuliang[i].goods_info)
              }
              that.data.shuliang = that.data.shuliang.concat(shuliang)
              that.setData({
                shuliang: that.data.shuliang
              })
            }
          }
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {
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
  // },
  kaiguan: function(res) {
    var index = res.currentTarget.dataset.index;
    this.setData({
      key: index
    })
  }
})