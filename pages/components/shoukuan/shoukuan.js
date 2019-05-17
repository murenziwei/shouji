// pages/components/historymoney/historymoney.js
var Order = getApp().data.Order;
var network = require("../../../utils/network.js"); //接口封装
var g_app = getApp();
var SE = getApp().ShowError;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listdata: [],
    scrolltrue:true
  },
  go_list() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function (res) {
        var user = res.data;
        network.Post({
          url: Order + 'api/user/qudao',
          data: {
            token: user.token,
            openid: user.openid,
            page: 1
          },
          success: function (res) {
            wx.hideLoading();
            if (res.statusCode === 200) {
              var shuju = JSON.parse(res.data);
              that.setData({ listdata: shuju.list });
            } else {
              SE(res.errMsg, 3000);
            }

            console.log(shuju, "shuju");
            that.setData({})
          },
          fail() {
            wx.hideLoading();
          }
        })

      },
      fail() {
        wx.hideLoading();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.go_list();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  go_page() {
    var that = this, _this = this;
    if (this.data.scrolltrue) {

      wx.showLoading({
        title: '加载中'
      })
      var user = this.data.user;
      var typeI = parseInt(this.data.activeIndex) + 1;
      console.log(typeI, "分页");
     
      network.Post({
        url: Order + 'api/user/qudao',
        data: {
          token: user.token,
          openid: user.openid,
          page: (this.data.page + 1)
        },
        success: function (res) {
          
          wx.hideLoading();
          if (JSON.parse(res.data).status == 0) {
            var data = JSON.parse(res.data).data;
            console.log(data, "分页?");
            if (data.length) {
              that.setData({
                page: (++this.data.page)
              });
              _this.setData({
                listdata: that.data.listdata.concat(data)
              });
            } else {
              that.setData({
                scrolltrue: false
              });
            }
          } 
          if (JSON.parse(res.data).status !== 1101) {
            var token = JSON.parse(res.data).token;
            var userInfo = wx.getStorageSync('user');
            userInfo.token = token;
            wx.setStorageSync('user', userInfo);
          }
        },
        fail() {
          wx.hideLoading()
        }
      })
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.go_page();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})