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
    isback: 0,
    "nickname": "",
    "mobile": "",
    "work": "",
    "city": "",
    "shop_name": "",
    "order_sn": "",
    "add_time": "",
    "pay_status": 0,
    "level": "0"
  },

  go_status() {
    var that = this;
    wx.getStorage({
      key: 'login',
      success: function (stor) {
        console.log(stor, '我靠');
        var data = {};
        data.openid = stor.data.openid;
        data.token = stor.data.token;
        console.log(data, "data");
        network.Post({
          url: UerUrl + 'api/User/ApplyShop4',
          data: data,
          success: res => {

            var r = JSON.parse(res.data);
            if (res.statusCode == 200) {
              var list=r.list;
              console.log(r, '状态');
              var s = r.status;

              if (s == 100) {
                // wx.showLoading();
                data.order_sn = list.order_sn;
                console.log(data, '数据');
                that.setData({
                  "nickname": list.nickname,
                  "mobile": list.mobile,
                  "work": list.work,
                  "city": list.city,
                  "shop_name": list.shop_name
                });
                if (l.pay_status == 1) {

                  wx.reLaunch({
                    url: '/pages/components/Distribution/Distribution?type=团队店长',
                  })
                } 
                //that.go_pay(data);
              }

            } else {
              app.ShowError('店长注册失败', 4000);
            }

          },
          fail: function (res2) {
            app.ShowError(res2, 5000);
          }
        });
      },
    })

  },
  go_pay(data) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    console.log(data, "ok");
    network.Post({
      url: UerUrl + 'api/User/shop_pay',
      data: data,
      success: res => {
        wx.hideLoading();
        var r = JSON.parse(res.data);
        if (res.statusCode == 200) {
          console.log(r.data, "你好");
          var payd = r.data;
          console.log(payd);
          if (payd) {
            if(r.msg){
              app.ShowError(r.msg, 4000);
            }else{

              payd.success = function (res) {
                console.log(res, "支付澈哥哥");
                setTimeout(function(){
                  wx.reLaunch({
                    url: '/pages/components/Distribution/Distribution?type=团队店长'
                  })
                },200)
              };
              payd.fail = function (err) {
                
                app.ShowError('支付失败', 4000);

              }
              wx.requestPayment(payd);
            }
          } else {
            app.ShowError('支付失败', 4000);
          }

        } else {
          app.ShowError('店长注册失败', 4000);
        }
        console.log(r, "我只去一票");
      },
      fail: function (res2) {
        wx.hideLoading();
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
          url: UerUrl + 'api/User/update_shop5',
          data: data,
          success: res => {
            
            var r = JSON.parse(res.data);
            console.log(r,"rrr");
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
    wx.showLoading({
      title: '加载中',
    })
    console.log(app, 'app');
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
    this.go_status();
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