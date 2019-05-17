var Order = getApp().data.Order;
var pay = getApp().data.pay;
var network = require("../../../utils/network.js"); //接口封装
var g_againLogin = require("../../../utils/AgainLogin.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total_numble:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中···',
    });
    console.log(options)
    var that = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function(res) {
        var user = res.data;
        network.Post({
          url: Order + 'api/Receipt/UserReceipt',
          data: {
            token: user.token,
            openid: user.openid
          },
          success: function(res) {
            
            var shuju = JSON.parse(res.data);
           
            that.setData({
              userInputCardNo: shuju.data.bank_code,
              wechat_code: shuju.data.bank_code,
              total_numble: options.total_numble,
              limit_money: shuju.withDraw.postal_limit
            })
            console.log(that.data.total_numble)
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

  },

  /**
   * 用户点击右上角分享
   */
})