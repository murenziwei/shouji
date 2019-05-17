// pages/audit/audit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fail: { text: '审核中', icon: 'icon-shenhezhong' },
    choose: [{ text: '审核中', icon: 'icon-shenhezhong' }, { text: '审核失败', icon: '' }, { text: '该店铺被平台关闭了', icon: '' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var tar=options.tar;
    if(tar){
      this.data.choose[tar]&&this.setData({
        fail: this.data.choose[tar]
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading();
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