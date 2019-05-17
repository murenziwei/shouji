// pages/components/historymoney/historymoney.js
var Order = getApp().data.Order;
var network = require("../../../utils/network.js"); //接口封装
var g_app=getApp();
var SE=getApp().ShowError;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listdata:[]
  },
  go_list(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function (res) {
        var user = res.data;
        network.Post({
          url: Order + 'api/User/with_list',
          data: {
            token: user.token,
            openid: user.openid,
            status:3
          },
          success: function (res) {
            wx.hideLoading();
            if (res.statusCode===200){
              var shuju = JSON.parse(res.data);
              that.setData({listdata:shuju.list});
            }else{
              SE(res.errMsg,3000);
            }
            
            console.log(shuju,"shuju");
            that.setData({})
          },
          fail(){
            wx.hideLoading();
          }
        })
        
      },
      fail(){
        wx.hideLoading();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

    var openid = wx.getStorageSync('user').openid;
    return {
      title: '成为分享的一员',
      desc: '分享给好友',
      path: '/pages/otherphone/otherphone?share=' + openid
    }

  }
})