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

  },
  go_data(data) {
    var that = this;
    console.log(data, "ok");
    wx.getStorage({
      key: '',
      success: function(stor) {
        console.log(stor,"stor");
        network.Post({
          url: UerUrl + 'api/User/show_shop6',
          data:{openid:stor.openid,token:stor.token},
          success: res => {
            var r = JSON.parse(res.data);
            if (res.statusCode == 200) {

            } else {
              app.ShowError('获取店长数据失败', 4000);
            }
            console.log(r, "未支付");
          },
          fail: function (res2) {
            app.ShowError(res2, 5000);
          }
        });
      },
    })
  },
  go_pay(data) {
    var that = this;
    console.log(data, "ok");
    network.Post({
      url: UerUrl + 'api/User/shop_pay',
      data: data,
      success: res => {
        var r = JSON.parse(res.data);
        if (res.statusCode == 200) {
          console.log(res.data, "你好");
          var payd = r.data;
          console.log(payd);
          if (payd) {

            payd.success = function (res) {
              console.log(res, "支付澈哥哥");
              wx.reLaunch({
                url: '/pages/myshop/index/index',
              })
            };
            payd.fail = function (err) {
              app.ShowError('支付失败', 4000);

            }
            wx.requestPayment(payd);
          } else {
            app.ShowError('支付失败', 4000);
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
  go_save(data) {
    var that = this;
    wx.getStorage({
      key: 'login',
      success: function (stor) {
        console.log(stor, '我靠');

        data.openid = stor.data.openid;
        data.token = stor.data.token;
        console.log(data, "data");
        network.Post({
          url: UerUrl + 'api/User/ApplyShop3',
          data: data,
          success: res => {

            var r = JSON.parse(res.data);
            if (res.statusCode == 200) {
              switch (r.status) {
                case 1: ;
                case 4: that.go_pay({ openid: data.openid, token: data.token, order_sn: r.order_sn }); break;
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
    })

  },
  formSubmit(e) {
    console.log(this.data.user);
    console.log(e, 'e');
    var sear = e.detail.value;
    var phone = (/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/); //手机号码正则
    if (!sear.nickname) {
      app.ShowError("昵称不能为空", 2000);
    } else if (!phone.test(sear.mobile)) {
      app.ShowError("手机格式错误", 2000);
    } else if (!sear.work) {
      app.ShowError("职业不能为空", 2000);
    } else if (!sear.city) {
      app.ShowError("所在城市不能为空", 2000);
    } else if (!sear.shop_name) {
      app.ShowError("店铺名称不能为空", 2000);
    }
    else {
      this.go_save(sear);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app, 'app');
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