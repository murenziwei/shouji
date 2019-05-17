// pages/pRuZhu/index.js
var UerUrl = getApp().data.UerUrl;
var icom = getApp().data.icom;
var network = require("../../utils/network.js"); //接口封装
var shop = getApp().data.shop;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:wx.getStorageSync('login')
  },
  go_save(data) {
    
    var that = this;
    wx.getStorage({
      key: 'login',
      success: function(stor) {

        data.openid = stor.data.openid;
        data.token = stor.data.token;
        console.log(data, "data");
        //获取用户币袋
        network.Post({
          url: UerUrl + 'api/User/ApplyShop2',
          data: data,
          success: res => {

            var r = JSON.parse(res.data);
            if (res.statusCode == 200) {
              switch (r.status) {
                case 1: wx.reLaunch({
                  url: '/pages/components/Distribution/Distribution?type=个人店长',
                }); break;
                default: app.ShowError(r.msg);
              }

            } else {
              app.ShowError('店长注册失败', 4000);
            }
            console.log(r, "我只去一票");
          },
          fail: function (res2) {
            app.ShowError(res2, 5000);
          }
        });
      },
      fail(){
        app.ShowError('注册失败', 5000);
      }
    })
  },
  formSubmit(e){
    console.log(this.data.user);
    console.log(e,'e');
    var sear=e.detail.value;
    var phone = (/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/); //手机号码正则
    if(!sear.nickname){
      app.ShowError("昵称不能为空",2000);
    }else if(!phone.test(sear.mobile)){
      app.ShowError("手机格式错误",2000);

    } else if (!sear.work) {
      app.ShowError("职业不能为空",2000);
    } else if (!sear.city) {
      app.ShowError("所在城市不能为空",2000);
    }else{
      this.go_save(sear);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app,'app');
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