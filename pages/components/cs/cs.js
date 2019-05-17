var UerUrl = getApp().data.UerUrl;
var shop = getApp().data.shop;
var icom = getApp().data.icom;
var app = getApp();
var network = require("../../../utils/network.js"); //接口封装
Page({
  /**
   * 页面的初始数据
   */
  data: {
    choice:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    network.Post({
      url: shop + 'api/Area/AllArea',
      data: {},
      success: function (res) {
        var shop = JSON.parse(res.data).data;
        that.setData({
          choice:shop
        })
      }
    })
  },
  bindChange: function (e) {
    var that = this;
    var choice = this.data.choice;
    network.Post({
      url: shop + 'api/Area/AllArea',
      data: {
        
      },
      success: function (res) {
        var shop = JSON.parse(res.data).data;
        that.setData({
          eciohc: shop[e.detail.value[0]].child_city,
          iceohc: shop[e.detail.value[0]].child_city[e.detail.value[1]].child_city
        })
      }
    })
    this.setData({
      index: e.detail.value[0]
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

  }
})