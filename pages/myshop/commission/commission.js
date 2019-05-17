var UerUrl = getApp().data.UerUrl
var network = require("../../../utils/network.js"); //接口封装
// pages/commission/commission.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function (res) {
        var user = res.data;
        network.Post({
          url: UerUrl + 'api/Distribution/brokerage',
          data: {
            token: user.token,
            openid: user.openid
          },
          success: function (res) {
            
            if (JSON.parse(res.data).status == 0) {
              var brokerage = JSON.parse(res.data).data;
              that.setData({
                brokerage: brokerage
              })
            } else {
              wx.showToast({
                title: JSON.parse(res.data).error,
                icon: 'none',
                duration: 1500,
                mask: true
              })
            }
          }
        })
      }
    })
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showinfobtn(){
    wx.navigateTo({
      url: '../depositlist/depositlist'
    })
  },

  morepagebtn(){

    wx.navigateTo({
      url: '../notice/notice'
    })
  }
})