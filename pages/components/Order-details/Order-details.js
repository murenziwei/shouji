var Order = getApp().data.Order;
var network = require("../../../utils/network.js");//接口封装
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中···',
    })
    this.setData({
      zhuangtai:options.type1,
      code:options.id,
      express_total: options.express_total,
      gold_pay: options.gold_pay
    })
    var _this = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function (res) {
        var user = res.data;
        network.Post({
          url: Order + 'api/Order/OrderDetail',
          data:{
            token: user.token,
            openid: user.openid,
            code:options.id,
            'type':options.type1
          },
          success:function(res){
            if (1101 != JSON.parse(res.data).status) {//修改token
              var token = JSON.parse(res.data).token;
              var userInfo = wx.getStorageSync('user');
              userInfo.token = token;
              wx.setStorageSync('user', userInfo);
            }
            var shuliang = JSON.parse(res.data).data;
            console.log(shuliang)
            var spshuliang = JSON.parse(shuliang.goods_info);
            var dizhi = JSON.parse(shuliang.addr_info);
            var order_code = shuliang.order_code
            _this.setData({
              jiage:shuliang.goods_total,
              shijian:shuliang.add_time,
              spshuliang:spshuliang,
              tup: spshuliang[0].goods_thumb,
              cash_pay: shuliang.cash_pay,
              dizhi:dizhi,
              order_code: order_code,
              tui_status: shuliang.tui_status,
              tui_content:shuliang.tui_content
            })
          }
        })
      }
    })
  },
  queren: function (opo) {
    var id = opo.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '确认已完成订单？',
      success: function (res) {
        if (res.confirm) {
          wx.getStorage({ //从本地拿到储存了的用户信息
            key: 'user',
            success: function (res) {
              var user = res.data
              network.Post({
                url: Order + 'api/Order/CompleteOrder',
                data: {
                  token: user.token,
                  openid: user.openid,
                  code: opo.currentTarget.dataset.id
                },
                success: function (res) {
                  network.Post({
                    url: Order + 'api/Order/AllOrder',
                    data: {
                      token: user.token,
                      openid: user.openid,
                      'type': 6,
                      page: 1,
                      numble: 10
                    },
                    success: function (res) {
                      wx.redirectTo({
                        url: '../my-order/my-order?id=' + 4,
                      })
                    }
                  })
                }
              })
            }
          })
        } else {

        }
      }
    })

  },
  qush: function (opo) {
    var _this = this;
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '确认已收货？',
      success: function (res) {
        if (res.confirm) {
          wx.getStorage({ //从本地拿到储存了的用户信息
            key: 'user',
            success: function (res) {
              var user = res.data
              network.Post({
                url: Order + 'api/Order/ReceiveOrder',
                data: {
                  token: user.token,
                  openid: user.openid,
                  code: opo.currentTarget.dataset.id
                },
                success: function (res) {
                  network.Post({
                    url: Order + 'api/Order/StatusOrder',
                    data: {
                      token: user.token,
                      openid: user.openid,
                      'type': 4,
                      page: 1,
                      numble: 10
                    },
                    success: function (res) {
                      wx.redirectTo({
                        url: '../my-order/my-order?id=' + 3,
                      })
                    }
                  })
                  spshuliang3.splice(opo.currentTarget.dataset.id, 1);
                  that.setData({
                    activeIndex: 3,
                    weiz: 25,
                    spshuliang3: spshuliang3
                  })
                }
              })
            }
          })
        } else {

        }
      }
    })
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
  
  ljzf:function(opo){
    var that = this;
    wx.showModal({
      title: '支付',
      content: '确认支付该订单',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.getStorage({ //从本地拿到储存了的用户信息
            key: 'user',
            success: function (res) {
              var user = res.data
              network.Post({
                url: Order + 'api/Order/PayOrder',
                data: {
                  token: user.token,
                  openid: user.openid,
                  code: opo.currentTarget.dataset.id
                },
                success: function (res) {
     
                  var zf = JSON.parse(res.data).data;
                  var zhuangtai = JSON.parse(res.data)
                  if (zhuangtai.status == 0) {
                    wx.requestPayment({
                      'timeStamp': zf.timeStamp,
                      'nonceStr': zf.nonceStr,
                      'package': zf.package,
                      'signType': 'MD5',
                      'paySign': zf.paySign,
                      success: function (res) {
                        wx.showToast({
                          title: '支付成功',
                          icon: 'success',
                          duration: 2000,
                          success: function (e) {
                            wx.navigateBack({
                              delta: 1
                            })
                          }
                        });
                      },
                      fail: function (res) {
                      }
                    })
                  } else if (zhuangtai.status == 1 || zhuangtai.status == 2 || zhuangtai.status == 3 || zhuangtai.status == 102 || (zhuangtai.status >= 302 && zhuangtai.status <= 304) || (zhuangtai.status >= 402 && zhuangtai.status <= 404) || zhuangtai.status == 501 || (zhuangtai.status >= 701 && zhuangtai.status <= 703) || zhuangtai.status == 1101) {
                    wx.showToast({
                      title: zhuangtai.status,
                      icon: 'none',
                      duration: 2000
                    });
                  } else if (zhuangtai.status == 31 || zhuangtai.status == 32) {
                    wx.showToast({
                      title: zhuangtai.error,
                      icon: 'none',
                      duration: 2000
                    });
                  }
                }
              })
            }
          })
        } else { }
      }
    });
  }
})