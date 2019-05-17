var commodity = getApp().data.commodity;
var network = require("../../../utils/network.js");//接口封装
var g_againLogin = require("../../../utils/AgainLogin.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shuliang: [],
    page: 1,
    scrollT: true,
    loadshow: true
  },
  controlfn(e) {
    console.log(e, "click");
    var ind = e.currentTarget.dataset.index, dataobj = this.data.shuliang;
    console.log(dataobj[ind], ind);
    dataobj[ind].show = !dataobj[ind].show;
    this.setData({ shuliang: dataobj });
  },

  xiangq: function (res) {
    var id = res.currentTarget.dataset.id
    var type1 = res.currentTarget.dataset.type;
    var express_total = res.currentTarget.dataset.express_total;
    var gold_pay = res.currentTarget.dataset.gold_pay
    wx.navigateTo({
      url: "../Order-details/Order-details?id=" + id + '&type1=' + type1 + '&express_total=' + express_total + '&gold_pay=' + gold_pay,
    })
    // wx.navigateTo({
    //   url: "/pages/order/orderDetail"
    // })
  },
  go_page() {
    if (this.data.scrollT) {

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
            url: commodity + 'api/share/OwnOrder',
            data: {
              token: user.token,
              openid: user.openid,
              page: that.data.page || 1,
              numble:4
            },
            success: function (res) {
              if (res.statusCode == 200) {
                var shuliang = JSON.parse(res.data).data;

                console.log(shuliang, "shuliang");
                for(var pd=0;pd<shuliang.length;pd++){
                  var _sl = shuliang[pd]
                  var o_s = _sl.order_status;
                  switch(o_s){
                    case 0: _sl.status_name = '订单取消'; break;
                    case 1: _sl.status_name = '未支付'; break;
                    case 2:_sl.status_name='已支付待发货';break;
                    case 3: _sl.status_name = '已发货待签收'; break;
                    case 4: _sl.status_name = '已签收待完成'; break;
                    case 5: _sl.status_name = '退款申请中'; break;
                    case 6: _sl.status_name = '订单完成'; break;
                    default: _sl.status_name = '';

                  }
                }
                if (shuliang.length) {

                  that.setData({
                    shuliang: that.data.shuliang.concat(shuliang),
                    page: (that.data.page + 1)
                  })
                } else {
                  that.setData({
                    scrollT: false
                  })
                }
              }
            }
          })
        },
        fail() {
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
    setTimeout(() => {
      if (this.data.shuliang.length==0) {
        this.setData({
          loadshow: false
        })
      }
    }, 5000);
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
    this.go_page();
  },

  /**
   * 用户点击右上角分享
   */

})