// pages/components/shouhuoxinxi/shouhuoxinxi.js
// var address = getApp().data.address;
// var network = require("../../../utils/network.js");//接口封装
// var shop = getApp().data.shop;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部',
    name: '',
    phone: '',
    xiangxi: '',
    id:'',
    yeas:0,

    region:["广东省",'广州市','天河区'],
    place:''
  },


  bindRegionChange(e){
    console.log(e.detail.value)
    this.setData({
      place:e.detail.value.join('-')
    })
  },


  dianji: function (res) {
    this.setData({
      yeas: 1
    })
  },
  zhedan: function (res) {
    this.setData({
      yeas: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  bindChange: function (e) {
    
  },
  
  name: function(e) {
    
  },
  phone: function(e) {
    
  },
  xiangx: function(e) {
    
  },
  baochun: function() {
    
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
  // }
})