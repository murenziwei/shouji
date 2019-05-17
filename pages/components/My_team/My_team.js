var commodity = getApp().data.commodity;
var network = require("../../../utils/network.js");//接口封装
var g_againLogin = require("../../../utils/AgainLogin.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shuliang:[],
    page:1,
    scrollT:true,
    loadshow:true
  },
  controlfn(e){
    console.log(e,"click");
    var ind = e.currentTarget.dataset.index,dataobj=this.data.shuliang;
    console.log(dataobj[ind],ind);
    dataobj[ind].show=!dataobj[ind].show;
    this.setData({shuliang:dataobj});
  },
  go_page(){
    if(this.data.scrollT){

      wx.showLoading({
        title: '加载中···'
      })
      var that = this;
      wx.getStorage({ //从本地拿到储存了的用户信息
        key: 'user',
        success: function (res) {
          wx.hideLoading();
          var user = res.data;
          network.Post({
            url: commodity + 'api/share/new_owner',
            data: {
              token: user.token,
              openid: user.openid,
              page: that.data.page || 1
            },
            success: function (res) {
              if (res.statusCode == 200) {
                var shuliang = JSON.parse(res.data);
                
                console.log(shuliang, "shuliang");
                if(shuliang.length){

                  that.setData({
                    shuliang: that.data.shuliang.concat(shuliang),
                    page: (that.data.page + 1)
                  })
                }else{
                  that.setData({
                    scrollT:false
                  })
                }
              }
            }
          })
        },
        fail(){
          wx.hideLoading();
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.go_page();
    setTimeout(()=>{
      if(this.data.shuliang.length==0){
        this.setData({
          loadshow:false
        })
      }
    },5000);
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

    var page = this
    page.data.page = 1
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
  
})