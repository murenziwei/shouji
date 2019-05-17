var sliderWidth = 41; // 需要设置slider的宽度，用于计算中间位置
var Order = getApp().data.Order;
var network = require("../../utils/network.js"); //接口封装
var g_againLogin = require("../../utils/AgainLogin.js");
Page({
  data: {
    tabs: ["待付款", "待发货", "待收货", "待完成", "已完成"], //"退货售后"
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    spshuliang: '',
    shuax: 1,
    weiz: 5,
    spshuliang2: '',
    spshuliang3: '',
    spshuliang4: '',
    spshuliang6: ''
  },
  onLoad: function(e) {
    var that = this;
    if (e.id !== "") {
      that.setData({
        activeIndex: e.id
      })
    } else {
      that.setData({
        activeIndex: 0
      })
    }
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    //获取订单列表
    var _this = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function(res) {
        var user = res.data
        network.Post({
          url: Order + 'api/Order/StatusOrder',
          data: {
            token: user.token,
            openid: user.openid,
            'type': 1,
            page: 1,
            numble: 10
          },
          success: function(res) {
            if(JSON.parse(res.data).status == 0){
              var data = JSON.parse(res.data).data;
              if (1101 != JSON.parse(res.data).status) {//修改token
                var token = JSON.parse(res.data).token;
                var userInfo = wx.getStorageSync('user');
                userInfo.token = token;
                wx.setStorageSync('user', userInfo);
              }
              for (var i = 0; i < data.length; i++) {
                data[i].goods_info = JSON.parse(data[i].goods_info)
              }
              _this.setData({
                spshuliang: data
              })
            }else if(JSON.parse(res.data).status == 3){
              g_againLogin.AutoLogin({
                url: Order + 'api/Order/StatusOrder',
                data: {
                  openid: wx.getStorageSync('user').openid,
                  token: '',
                  'type': 1,
                  page: 1,
                  numble: 10
                },
                success: function (res) {  //返回数据处理
                  var data = JSON.parse(res.data).data;
                  if (1101 != JSON.parse(res.data).status) {//修改token
                    var token = JSON.parse(res.data).token;
                    var userInfo = wx.getStorageSync('user');
                    userInfo.token = token;
                    wx.setStorageSync('user', userInfo);
                  }
                  for (var i = 0; i < data.length; i++) {
                    data[i].goods_info = JSON.parse(data[i].goods_info)
                  }
                  _this.setData({
                    spshuliang: data
                  })
                },
                fail: function (res) {
                  g_app.ShowError(res, 3000);
                },
              });
            }else{
              wx.showToast({
                title: JSON.parse(res.data).error,
                icon: 'none',
                duration: 1500,
                mask: true
              })
            }
            if(JSON.parse(res.data).status !== 1101){
              var token = JSON.parse(res.data).token;
              var userInfo = wx.getStorageSync('user');
              userInfo.token = token;
              wx.setStorageSync('user', userInfo);
            }
          },
        })
        network.Post({
          url: Order + 'api/Order/StatusOrder',

          data: {
            token: user.token,
            openid: user.openid,
            'type': 2,
            page: 1,
            numble: 10
          },
          success: function(res) {
            var data = JSON.parse(res.data).data;
            console.log(data)
            if (1101 != JSON.parse(res.data).status) {//修改token
              var token = JSON.parse(res.data).token;
              var userInfo = wx.getStorageSync('user');
              userInfo.token = token;
              wx.setStorageSync('user', userInfo);
            }
            for (var i = 0; i < data.length; i++) {
              data[i].goods_info = JSON.parse(data[i].goods_info)
            }
            _this.setData({
              spshuliang2: data
            })
          }
        })
        network.Post({
          url: Order + 'api/Order/StatusOrder',
          method: "POST",
          dataType: 'JSON',
          header: {
            "content-type": 'application/x-www-form-urlencoded'
          },
          data: {
            token: user.token,
            openid: user.openid,
            'type': 3,
            page: 1,
            numble: 10
          },
          success: function(res) {
            if (1101 != JSON.parse(res.data).status) {//修改token
              var token = JSON.parse(res.data).token;
              var userInfo = wx.getStorageSync('user');
              userInfo.token = token;
              wx.setStorageSync('user', userInfo);
            }
            var data = JSON.parse(res.data).data;
            for (var i = 0; i < data.length; i++) {
              data[i].goods_info = JSON.parse(data[i].goods_info)
            }

            _this.setData({
              spshuliang3: data
            })
          }
        })
        network.Post({
          url: Order + 'api/Order/StatusOrder',
          data: {
            token: user.token,
            openid: user.openid,
            'type': 4,
            page: 1,
            numble: 10
          },
          success: function(res) {
            if (1101 != JSON.parse(res.data).status) {//修改token
              var token = JSON.parse(res.data).token;
              var userInfo = wx.getStorageSync('user');
              userInfo.token = token;
              wx.setStorageSync('user', userInfo);
            }
            var data = JSON.parse(res.data).data;
            for (var i = 0; i < data.length; i++) {
              data[i].goods_info = JSON.parse(data[i].goods_info)
            }

            _this.setData({
              spshuliang4: data
            })
          }
        })
        network.Post({
          url: Order + 'api/Order/StatusOrder',
          data: {
            token: user.token,
            openid: user.openid,
            'type': 5,
            page: 1,
            numble: 10
          },
          success: function(res) {
            if (1101 != JSON.parse(res.data).status) {//修改token
              var token = JSON.parse(res.data).token;
              var userInfo = wx.getStorageSync('user');
              userInfo.token = token;
              wx.setStorageSync('user', userInfo);
            }
            var data = JSON.parse(res.data).data;
            for (var i = 0; i < data.length; i++) {
              data[i].goods_info = JSON.parse(data[i].goods_info)
            }

            _this.setData({
              spshuliang5: data
            })
          }
        })
        network.Post({
          url: Order + 'api/Order/StatusOrder',
          data: {
            token: user.token,
            openid: user.openid,
            'type': 6,
            page: 1,
            numble: 10
          },
          success: function(res) {
            if (1101 != JSON.parse(res.data).status) {//修改token
              var token = JSON.parse(res.data).token;
              var userInfo = wx.getStorageSync('user');
              userInfo.token = token;
              wx.setStorageSync('user', userInfo);
            }
            var data = JSON.parse(res.data).data;
            for (var i = 0; i < data.length; i++) {
              data[i].goods_info = JSON.parse(data[i].goods_info)
            }

            _this.setData({
              spshuliang6: data
            })
          }
        })
      }
    })
  },

  //申请退款
  tuikuan: function (e) {

      console.log(e)
    var _this = this
    if(e.currentTarget.dataset.id){

      var code = e.currentTarget.dataset.id
      wx.showModal({
        title: '确认申请退款？',
        success: function (res) {
          if (res.confirm){
            wx.getStorage({ //从本地拿到储存了的用户信息
              key: 'user',
              success: function (res) {
                var user = res.data
                network.Post({
                  url: Order + 'api/Order/tuikuan',
                  data: {
                    token: user.token,
                    openid: user.openid,
                    code: code
                  },
                  success: function (res) {

                    var info = JSON.parse(res.data);
                    console.log(info)
                    if(info.status == 0){

                        wx.showToast({
                          title: '你已成功提交申请',
                          icon:'success',
                          mask:true,
                          duration: 2000
                        })
                        setTimeout(function(){
                          network.Post({
                            url: Order + 'api/Order/StatusOrder',

                            data: {
                              token: user.token,
                              openid: user.openid,
                              'type': 2,
                              page: 1,
                              numble: 10
                            },
                            success: function (res) {
                              var data = JSON.parse(res.data).data;
                              console.log(data)
                              for (var i = 0; i < data.length; i++) {
                                data[i].goods_info = JSON.parse(data[i].goods_info)
                              }
                              _this.setData({
                                spshuliang2: data
                              })
                            }
                          })
                        },2000)
                    }
                    
                  }
                })
              }
            })
          }
        }
      })
    }
  },


  tabClick: function(e) {

    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      id: e.currentTarget.id,
      weiz: 5
    });
  },
  xiangq: function(res) {
    var id = res.currentTarget.dataset.id
    var type1 = res.currentTarget.dataset.type;
    var express_total = res.currentTarget.dataset.express_total;
    var gold_pay = res.currentTarget.dataset.gold_pay
    wx.navigateTo({
      url: "../Order-details/Order-details?id=" + id + '&type1=' + type1 + '&express_total=' + express_total + '&gold_pay=' + gold_pay,
    })
  },
  pinghjia: function(res) {
    wx.navigateTo({
      url: '../evaluate/evaluate',
    })
  },
  queren: function(opo) {
    var id = opo.currentTarget.dataset.id;
    var that = this;
    var spshuliang4 = this.data.spshuliang4
    wx.showModal({
      title: '确认已完成订单？',
      success: function(res) {
        if (res.confirm) {
          wx.getStorage({ //从本地拿到储存了的用户信息
            key: 'user',
            success: function(res) {
              var user = res.data
              network.Post({
                url: Order + 'api/Order/CompleteOrder',
                data: {
                  token: user.token,
                  openid: user.openid,
                  code: opo.currentTarget.dataset.id
                },
                success: function(res) {
                  network.Post({
                    url: Order + 'api/Order/AllOrder',
                    data: {
                      token: user.token,
                      openid: user.openid,
                      'type': 6,
                      page: 1,
                      numble: 10
                    },
                    success: function(res) {
                      var data = JSON.parse(res.data).data;
                      for (var i = 0; i < data.length; i++) {
                        data[i].goods_info = JSON.parse(data[i].goods_info)
                      }
                      that.setData({
                        spshuliang6: data
                      })
                      spshuliang4.splice(opo.currentTarget.dataset.id, 1);
                      that.setData({
                        activeIndex: 4,
                        weiz: 25,
                        spshuliang4: spshuliang4
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
  qush: function(opo) {
    var _this = this;
    var that = this;
    var spshuliang3 = this.data.spshuliang3
    wx.showModal({
      title: '温馨提示',
      content: '确认已收货？',
      success: function(res) {
        if (res.confirm) {
          wx.getStorage({ //从本地拿到储存了的用户信息
            key: 'user',
            success: function(res) {
              var user = res.data
              network.Post({
                url: Order + 'api/Order/ReceiveOrder',
                data: {
                  token: user.token,
                  openid: user.openid,
                  code: opo.currentTarget.dataset.id
                },
                success: function(res) {
                  network.Post({
                    url: Order + 'api/Order/AllOrder',
                    data: {
                      token: user.token,
                      openid: user.openid,
                      'type': 4,
                      page: 1,
                      numble: 10
                    },
                    success: function(res) {
                      var data = JSON.parse(res.data).data;
                      for (var i = 0; i < data.length; i++) {
                        data[i].goods_info = JSON.parse(data[i].goods_info)
                      }
                      _this.setData({
                        spshuliang4: data
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
  ljzhifu: function(opo) {
    var _this = this;
    var shuliang = this.data.spshuliang
    var spshuliang2 = this.data.spshuliang2
    wx.showModal({
      title: '支付',
      content: '确认支付该订单',
      confirmText: "确定",
      cancelText: "取消",
      success: function(res) {
        if (res.confirm) {
          wx.getStorage({ //从本地拿到储存了的用户信息
            key: 'user',
            success: function(res) {
              var user = res.data
              network.Post({
                url: Order + 'api/Order/PayOrder',
                data: {
                  token: user.token,
                  openid: user.openid,
                  code: opo.currentTarget.dataset.id
                },
                success: function(res) {
                  console.log(res)
                  if (1101 != JSON.parse(res.data).status) {//修改token
                    var token = JSON.parse(res.data).token;
                    var userInfo = wx.getStorageSync('user');
                    userInfo.token = token;
                    wx.setStorageSync('user', userInfo);
                  }
                  var zf = JSON.parse(res.data).data;
                  var zhuangtai = JSON.parse(res.data)
                  if (zhuangtai.status == 0) {
                    wx.requestPayment({
                      'timeStamp': zf.timeStamp,
                      'nonceStr': zf.nonceStr,
                      'package': zf.package,
                      'signType': 'MD5',
                      'paySign': zf.paySign,
                      success: function(res) {
                        wx.showToast({
                          title: '支付成功',
                          icon: 'success',
                          duration: 2000,
                          success: function(e) {
                            wx.navigateTo({
                              url: '../my-order/my-order?id=' + 1,
                            })
                          }
                        });
                      },
                      fail: function(res) {

                      }
                    })
                  } else if(JSON.parse(res.data).status == 3) {
                    g_againLogin.AutoLogin({
                      url: Order + 'api/Order/PayOrder',
                      data: {
                        openid: wx.getStorageSync('user').openid,
                        token: '',
                        code: opo.currentTarget.dataset.id
                      },
                      success: function (res) {  //返回数据处理
                        var zf = JSON.parse(res.data).data;
                        var zhuangtai = JSON.parse(res.data)
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
                                wx.navigateTo({
                                  url: '../my-order/my-order?id=' + 1,
                                })
                              }
                            });
                          },
                          fail: function (res) {

                          }
                        })
                      },
                      fail: function (res) {
                        g_app.ShowError(res, 3000);
                      },
                    });
                  }else{
                    wx.showToast({
                      title: JSON.parse(res.data).status,
                      icon: none,
                      duration: 2000,
                      success: function (e) {
                      }
                    });
                  }
                }
              })
            }
          })
        } else {}
      }
    });
  },
  shanchu: function(e) {
    var that = this;
    var shuliang = this.data.spshuliang;
    wx.showModal({
      title: '温馨提示',
      content: '确认删除该订单？',
      confirmText: "确定",
      cancelText: "取消",
      success: function(options) {
        if (options.confirm) {
          wx.getStorage({ //从本地拿到储存了的用户信息
            key: 'user',
            success: function(res) {
              var user = res.data
              network.Post({
                url: Order + 'api/Order/DeleteOrder',
                data: {
                  token: user.token,
                  openid: user.openid,
                  code: e.currentTarget.dataset.id,
                  'type': 1
                },
                success: function(res) {
                  if(JSON.parse(res.data).status == 0){
                    shuliang.splice(e.currentTarget.dataset.id, 1);
                    that.setData({
                      spshuliang: shuliang
                    })
                  } else if (JSON.parse(res.data).status == 3){
                    g_againLogin.AutoLogin({
                      url: Order + 'api/Order/DeleteOrder',
                      data: {
                        openid: wx.getStorageSync('user').openid,
                        token: '',
                        code: e.currentTarget.dataset.id,
                        'type': 1
                      },
                      success: function (res) {  //返回数据处理
                        wx.showToast({
                          title: '删除成功',
                          icon: 'success',
                          duration: 2000,
                          success: function (e) {
                          }
                        });
                      },
                      fail: function (res) {
                        g_app.ShowError(res, 3000);
                      },
                    });
                  }else {
                    wx.showToast({
                      title: JSON.parse(res.data).status,
                      icon: none,
                      duration: 2000,
                      success: function (e) {
                      }
                    });
                  }
                }
              })
            }
          })
        } else {}
      }
    })
  },
  pinglun: function(res) {
    var id = res.currentTarget.dataset.id;
    var sq = res.currentTarget.dataset.sq;
    wx.navigateTo({
      url: '../evaluate/evaluate?id=' + id + '&sq=' + sq,
    })
  }
});