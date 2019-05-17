// pages/components/choose/choose.js
var icom = getApp().data.icom;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.hideShareMenu();
    
    // wx.chooseImage({
    //   success: function(res) {
    //     const uploadTask = wx.uploadFile({
    //       url: icom + 'api/Image/upload_file',
    //       filePath: res.tempFilePaths[0],
    //       name: 'comment_images',
    //       formData: {
    //         file_token:getApp().data.file_token
    //       },
    //       success: function(e) {
    //         var tup = JSON.parse(e.data).url;
    //         wx.navigateTo({
    //           url: '../DIY/DIY?url=' + tup,
    //         })
    //       }
    //     })
    //   },
    // })
  },

  chuantu: function(res) {
    wx.navigateTo({
      url: '../../customization/customization'
    });
    // wx.chooseImage({
    //   success: function(res) {
    //     const uploadTask = wx.uploadFile({
    //       url: icom + 'api/Image/upload_file',
    //       filePath: res.tempFilePaths[0],
    //       name: 'comment_images',
    //       formData: {
    //         file_token:getApp().data.file_token
    //       },
    //       success: function(e) {
    //         var tup = JSON.parse(e.data).url;
    //         wx.navigateTo({
    //           url: ""
    //         })
    //       }
    //     })
    //   },
    // })
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