var UerUrl = getApp().data.UerUrl
var network = require("../../utils/network.js"); //接口封装
var showerr=getApp().ShowError;
// pages/team/team.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isstore:true,
    page:1,
    oneAgent:[]
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

    var that = this
    var userInfo = wx.getStorageSync('user')
    that.data.page = 1
    wx.showLoading({
      title: '请稍后',
      icon: 'loading',
      mask: true
    })
    network.Post({
      url: UerUrl + 'api/User/getMyTeam',
      data: {
        openid: userInfo.openid,
        token: userInfo.token,
        page: 1
      },
      success: function (res) {
        console.log(res,"请稍后");
        var result = JSON.parse(res.data);
          wx.hideLoading();
          if(result.store.status==200){

            that.setData({
              oneAgent: result.store.data
            })
          }else{
            showerr(result.store.error);
          }

      }
    })
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

    var that = this
    var userInfo = wx.getStorageSync('user')
    var page = that.data.page + 1
    wx.showLoading({
      title: '请稍后',
      icon: 'loading',
      mask: true
    })
    network.Post({
      url: UerUrl + 'api/User/getMyTeam',
      data: {
        openid: userInfo.openid,
        token: userInfo.token,
        page: page
      },
      success: function (res) {

        var result = JSON.parse(res.data);
        wx.hideLoading();
        that.setData({
          oneAgent: result.store.data
        })

      }
    })
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
  selectbtn(event){
    let select = event.currentTarget.dataset.select;
    if (select == 1){
      this.setData({
        isstore:false
      })
    }else{
      this.setData({
        isstore: true
      })
    }
  }
})