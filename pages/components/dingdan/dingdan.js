// pages/components/dingdan/dingdan.js
var Order = getApp().data.Order;
var detail = getApp().data.detail;
var UerUrl = getApp().data.UerUrl;
var network = require("../../../utils/network.js"); //接口封装
var g_againLogin = require("../../../utils/AgainLogin.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pandaunnima: 0,
    p_buyNumble: 1, //购买数量
    p_totalMoney: 0, //商品总计
    p_freight: 0, //运费
    p_enbleGold: 0, //金币余额
    p_golgPay: 0, //金币支付金额
    p_payMoney: 0, //实付金额
    p_goldSwith: false, //是否使用金币支付,true为是,false为不是
    p_hasFreight: 0, //是否在邮寄范围内
    p_price_sale: 0,
    addr_sheng: '',
    addr_shi: '',
    spbs: '',
    format_id: '',
    name: '',
    phone: '',
    addr_attach: '',
    addr_qu: '',
    pingp: '',
    format_code: '',
    format_show: '',
    model_id: '',
    model_name:'',
    brand_id:'',
    brand_name:'',
    xiangou: '',
    made_image: [],
    made_type: 0,
    zhi: '',
    img: [],
    sheb: '',
    role: '',
    brand: '',
    value_show:'',
    is_format:'',
    master:''
  },
  //跳转地址页面
  tiao: function(res) {
    wx.navigateTo({
      url: '../dizhi/dizhi',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    wx.showLoading({
      title: '加载中···',
    })
    var that = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function(res) {
        var user = res.data;
        that.setData({
          role: user.role
        })
      }
    })
    this.setData({
      peyt: options.type,
      is_format:options.is_format
    })
    var addr_sheng = this.data.addr_sheng;
    var addr_shi = this.data.addr_shi;
    if(options.type == 0){
      that.setData({
        img: options.img, //商品图片
        goods_name: options.goods_name, //商品名称
        sheb: options.sheb, //设备名称
        gg: options.gg, //规格
        p_price_sale: options.price_sale, //单价
        spbs: options.spbs,
        format_id: options.format_id,
        format_code: options.format_code,
        format_show: options.format_show,
        model_id: options.model_id,
        model_name:options.model_name,
        brand_id:options.brand_id,
        brand_name:options.brand_name,
        xiangou: options.xiangou,
        made_type: options.made_type
      })
    }else{
      
      console.log(options);
      that.setData({
        img: JSON.parse(options.result).url,//商品图片
        goods_name: options.goods_name, // 商品名称
        p_price_sale: options.format_price, //单价
        format_id: options.format_id,
        xiangou: JSON.parse(options.data).xiangou,
        sheb: options.sheb,
        // brand: options.brand,
        value_show: options.value_show,
        model_id: options.model_id,
        model_name:options.model_name,
        brand_name:options.brand_name,
        brand_id:options.brand_id
      })
      
    }
    this.onGetFreight(); //运费函数
    var p_totalMoney = this.data.p_totalMoney;
    that.setData({
      p_totalMoney: p_totalMoney,
      zhi: options.type,
      format_id:options.format_id,
      format_code:options.format_code,
      // value_show: options.gg,
      // p_price_sale:options.
    })
    
  },
  onGetFreight: function() { //运费回调
    var spbs = this.data.spbs;
    var format_id = this.data.format_id;
    var num = this.data.p_buyNumble;
    var that = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function(res) {
        var user = res.data;
        network.Post({
          url: detail + 'api/Addr/GetDefault', //获取用户默认地址
          data: {
            token: user.token,
            openid: user.openid
          },
          success: function(opo) { 
            var dizh = JSON.parse(opo.data).status;
            if (1101 != dizh) {
              var token = JSON.parse(opo.data).token;
              var userInfo = wx.getStorageSync('user');
              userInfo.token = token;
              wx.setStorageSync('user', userInfo);
            }
            if (dizh == 0) {
              var dizhi = JSON.parse(opo.data).data; //地址信息
              that.setData({
                pandaunnima: dizh
              })
              network.Post({
                url: detail + 'api/Goods/Goodsfreight', //获取商品运费
                data: {
                  id: spbs, //商品的标识
                  format: format_id, //规格的标识
                  numble: num, //购买的数量
                  addr: JSON.stringify({
                    addr_sheng: dizhi.addr_sheng, //省
                    addr_shi: dizhi.addr_city //市
                  })
                },
                success: function(res) {
                  var freight = JSON.parse(res.data).data;
                  var zhuangtai = JSON.parse(res.data).status
                  var cuowu = JSON.parse(res.data)
                  if (zhuangtai == 0) {
                    that.setData({
                      p_freight: freight
                    })
                    // var initData=wx.getStorageSync("user"); //取值
                  } else if (zhuangtai == 32) {
                    that.setData({
                      p_freight: 0,
                      p_hasFreight: zhuangtai
                    })
                  } else if (zhuangtai == 105 || (zhuangtai >= 102 && zhuangtai <= 103)) {
                    wx.showToast({
                      title: cuowu.error,
                      icon: 'none',
                      duration: 2000
                    });
                  }
                  that.GetData()
                }
              })
            }else if(dizh == 3){
              g_againLogin.AutoLogin({
                url: detail + 'api/Addr/GetDefault',
                data: {
                  openid: wx.getStorageSync('user').openid,
                  token: ''
                },
                success: function (res) {  //返回数据处理
                  
                  var dizhi = JSON.parse(res.data).data; //地址信息
                  var dizh = JSON.parse(res.data).status;
                  that.setData({
                    pandaunnima: dizh
                  })
                  network.Post({
                    url: detail + 'api/Goods/Goodsfreight', //获取商品运费
                    data: {
                      id: spbs, //商品的标识
                      format: format_id, //规格的标识
                      numble: num, //购买的数量
                      addr: JSON.stringify({
                        addr_sheng: dizhi.addr_sheng, //省
                        addr_shi: dizhi.addr_city //市
                      })
                    },
                    success: function (res) {
                      var freight = JSON.parse(res.data).data;
                      var zhuangtai = JSON.parse(res.data).status
                      var cuowu = JSON.parse(res.data)
                      if (zhuangtai == 0) {
                        that.setData({
                          p_freight: freight
                        })
                        // var initData=wx.getStorageSync("user"); //取值
                      } else if (zhuangtai == 32) {
                        that.setData({
                          p_freight: 0,
                          p_hasFreight: zhuangtai
                        })
                      } else if (zhuangtai == 105 || (zhuangtai >= 102 && zhuangtai <= 103)) {
                        wx.showToast({
                          title: cuowu.error,
                          icon: 'none',
                          duration: 2000
                        });
                      }
                      that.GetData()
                    }
                  })
                },
                fail: function (res) {
                  g_app.ShowError(res, 3000);
                },
              });
            } else {
              that.GetData()
            }
          }
        })
      },
    })
  },
  yunfei: function(res) {
    var that = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function(res) {
        var user = res.data
        network.Post({
          url: detail + 'api/User/UserCoin', //获取用户金币
          data: {
            token: user.token,
            openid: user.openid
          },
          success: function(opo) {
            if (JSON.parse(opo.data).status == 0) {
              var jingbi = JSON.parse(opo.data).data;
              that.setData({
                p_enbleGold: (Number(jingbi.total_numble) - (Number(jingbi.pay_past) + Number(jingbi.pay_wait) + Number(jingbi.postal_past) + Number(jingbi.postal_wait))).toFixed(2), //计算可用金币
                p_golgPay: (Number(jingbi.total_numble) - (Number(jingbi.pay_past) + Number(jingbi.pay_wait) + Number(jingbi.postal_past) + Number(jingbi.postal_wait))).toFixed(2)
              })
            } else if (JSON.parse(opo.data).status == 3) {
              g_againLogin.AutoLogin({
                url: detail + 'api/User/UserCoin',
                data: {
                  openid: wx.getStorageSync('user').openid,
                  token: ''
                },
                success: function(opo) { //返回数据处理
                  if(JSON.parse(opo.data).status == 0){
                    var jingbi = JSON.parse(opo.data).data;
                    that.setData({
                      p_enbleGold: (Number(jingbi.total_numble) - (Number(jingbi.pay_past) + Number(jingbi.pay_wait) + Number(jingbi.postal_past) + Number(jingbi.postal_wait))).toFixed(2), //计算可用金币
                      p_golgPay: (Number(jingbi.total_numble) - (Number(jingbi.pay_past) + Number(jingbi.pay_wait) + Number(jingbi.postal_past) + Number(jingbi.postal_wait))).toFixed(2)
                    })
                  }
                  if (JSON.parse(opo.data).status !== 1101){
                    var token = JSON.parse(opo.data).token;
                    var userInfo = wx.getStorageSync('user');
                    userInfo.token = token;
                    wx.setStorageSync('user', userInfo);
                  }
                },
                fail: function(res) {
                  g_app.ShowError(res, 3000);
                },
              });
            } else if (1101 != JSON.parse(opo.data).status) {
              var token = JSON.parse(opo.data).token;
              var userInfo = wx.getStorageSync('user');
              userInfo.token = token;
              wx.setStorageSync('user', userInfo);
            } else {

              wx.showToast({
                title: JSON.parse(opo.data).error,
                icon: 'none',
                duration: 1500,
                mask: true
              })

            }
          }
        })
        that.GetData()
      },
    })
  },
  GetData: function() {
    var that = this;
    var price_sale = this.data.p_price_sale; //商品单价
    var buyNumble = this.data.p_buyNumble //商品数量
    var freight = this.data.p_freight //运费
    var p_totalMoney = (buyNumble * price_sale).toFixed(2) //商品单价乘商品数量 
    var totalMoney = Number(p_totalMoney) + Number(freight) //总计加运费
    var enbleGold = this.data.p_enbleGold;
    var goldSwith = this.data.p_goldSwith; //用金币的开关
    if (Number(totalMoney) >= Number(enbleGold)) { //如果总计加运费大于或等于金币余额
      that.setData({
        p_golgPay: enbleGold //把金币总额赋给金币金额
      })
    } else {
      that.setData({
        p_golgPay: totalMoney //把总价加运费赋给金币金额
      })
    }
    var golgPay = this.data.p_golgPay
    if (goldSwith == true) { //如果开关等于开
      that.setData({
        p_payMoney: (totalMoney - golgPay).toFixed(2) //总计加运费减去金币金额赋值给实付金额
      })
    } else { //没用金币支付
      that.setData({
        p_payMoney: totalMoney //把总计加运费赋值给实付金额
      })
    }
    this.setData({
      p_totalMoney: p_totalMoney
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function(res) {
        var user = res.data
        network.Post({
          url: detail + 'api/Addr/GetDefault', //获取用户默认地址
          data: {
            token: user.token,
            openid: user.openid
          },
          success: function(res) {
            var zt = JSON.parse(res.data);
            if (1101 != zt.status) {
              var token = JSON.parse(res.data).token;
              var userInfo = wx.getStorageSync('user');
              userInfo.token = token;
              wx.setStorageSync('user', userInfo);
              that.yunfei();
            }
             if (zt.status == 3) {
              g_againLogin.AutoLogin({
                url: detail + 'api/Addr/GetDefault',
                data: {
                  openid: wx.getStorageSync('user').openid,
                  token: ''
                },
                success: function(res) { //返回数据处理
                  var zt = JSON.parse(res.data);
                  var dizhi = JSON.parse(res.data).data; //地址信息
                  that.setData({
                    pandaunnima: 0, //判断地址状态
                    name: dizhi.addr_name, //名字
                    phone: dizhi.addr_mobile, //手机号码
                    zhidi: dizhi.addr_sheng + dizhi.addr_city + dizhi.addr_qu + dizhi.addr_attach, //收货地址
                    addr_sheng: dizhi.addr_sheng,
                    addr_shi: dizhi.addr_city,
                    addr_attach: dizhi.addr_attach,
                    addr_qu: dizhi.addr_qu
                  })

                },
                fail: function(res) {
                  g_app.ShowError(res, 3000);
                },
              });
            }
            if (zt.status == 0) {
              var dizhi = JSON.parse(res.data).data; //地址信息
              that.setData({
                pandaunnima: zt.status
              })
              that.setData({
                pandaunnima: zt.status, //判断地址状态
                name: dizhi.addr_name, //名字
                phone: dizhi.addr_mobile, //手机号码
                zhidi: dizhi.addr_sheng + dizhi.addr_city + dizhi.addr_qu + dizhi.addr_attach, //收货地址
                addr_sheng: dizhi.addr_sheng,
                addr_shi: dizhi.addr_city,
                addr_attach: dizhi.addr_attach,
                addr_qu: dizhi.addr_qu
              })
            } else {
              that.GetData()
            }
          }
        })
      },
    })
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
  //     },
  //     fail: function (res) {
  //     },
  //   }
  // },
  bindMinus: function() {
    var p_buyNumble = this.data.p_buyNumble;
    // 如果大于1时，才可以减  
    if (p_buyNumble > 1) {
      p_buyNumble--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = p_buyNumble <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      p_buyNumble: p_buyNumble,
      minusStatus: minusStatus
    });
    this.onGetFreight();
  },
  /* 点击加号 */
  bindPlus: function() {
    var xiangou = this.data.xiangou
    var p_buyNumble = this.data.p_buyNumble;
    // 不作过多考虑自增1
    if (p_buyNumble < xiangou) {
      p_buyNumble++;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = p_buyNumble < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      p_buyNumble: p_buyNumble,
      minusStatus: minusStatus
    });
    this.onGetFreight();

  },
  /* 
  输入框事件
   */
  bindManual: function(e) {
    var p_buyNumble = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      p_buyNumble: p_buyNumble,
    });
  },
  bain: function(res) {

  },
  tijiao: function(options) {
    var zhi = this.data.zhi;
    if (zhi == 0) {
      console.log(111111111)
      var _this = this,
        name = this.data.name,
        phone = this.data.phone,
        addr_attach = this.data.addr_attach,
        sheng = this.data.addr_sheng,
        addr_shi = this.data.addr_shi,
        qu = this.data.addr_qu,
        spbs = this.data.spbs,
        model_id = this.data.model_id,
        model_name = this.data.model_name,
        format_id = this.data.format_id,
        format_code = this.data.format_code,
        format_show = this.data.format_show,
        value_show = this.data.value_show,
        num = this.data.p_buyNumble,
        p_hasFreight = this.data.p_hasFreight,
        goldSwith = this.data.p_goldSwith ? 1 : 0;
      if (p_hasFreight == 0) {
        wx.showModal({
          title: '支付',
          content: '是否支付该订单',
          confirmText: "确定",
          cancelText: "取消",
          success: function(res) {
            if (res.confirm) {
              wx.getStorage({ //从本地拿到储存了的用户信息
                key: 'user',
                success: function(res) {
                  var addr_info = {
                    addr_name: name,
                    addr_mobile: phone,
                    addr_sheng: sheng,
                    addr_shi: addr_shi,
                    addr_qu: qu,
                    addr_details: addr_attach,
                  };
                  var goods_info = [{
                    goods_id: spbs, //商品标识
                    brand_id: _this.data.brand_id, //品牌标识
                    brand_name: _this.data.brand_name, //品牌名称
                    model_id: _this.data.model_id, //型号标识
                    model_name: _this.data.model_name, //型号名称
                    format_id: _this.data.format_id, //规格标识
                    format_code: format_code, //规格编号
                    format_show: value_show, //规格名称
                    made_type: 0,
                    made_image: [],
                    buy_numble: num
                  }]
                  var user = res.data
                  network.Post({
                    url: Order + 'api/Order/SubmitOrder',
                    method: "POST",
                    dataType: 'JSON',
                    header: {
                      "content-type": 'application/x-www-form-urlencoded'
                    },
                    data: {
                      token: user.token,
                      openid: user.openid,
                      gold: goldSwith,
                      info: JSON.stringify({
                        goods_info: goods_info,
                        addr_info: addr_info,
                        order_status: 2
                      })
                    },
                    success: function(res) {
                      var erro = JSON.parse(res.data);
                      var zf = JSON.parse(res.data).data;
                      var zhuangtai = JSON.parse(res.data)
                      if (1101 !== zhuangtai.status) { //修改token
                        var token = JSON.parse(res.data).token;
                        var userInfo = wx.getStorageSync('user');
                        userInfo.token = token;
                        wx.setStorageSync('user', userInfo);
                      }
                      if (zhuangtai.status == 0) {
                        if (zhuangtai.type == 2) { //金币支付
                          wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 3000,
                            success: function(e) {
                              var timer = setTimeout(function() {
                                wx.navigateTo({
                                  url: '../my-order/my-order?id=' + 1,
                                })
                                Countdown();
                              }, 2000);
                            }
                          });
                        } else { //微信支付
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
                              wx.showToast({
                                title: '支付失败',
                                icon: 'none',
                                duration: 2000,
                                success: function(e) {
                                  wx.navigateTo({
                                    url: '../my-order/my-order?id=' + 0,
                                  })
                                }
                              });
                            }
                          })
                          var status = JSON.parse(res.data).status;
                          var error = JSON.parse(res.data).error;
                        }
                      } else if (zhuangtai.status == 3) {
                        g_againLogin.AutoLogin({
                          url: Order + 'api/Order/SubmitOrder',
                          data: {
                            openid: wx.getStorageSync('user').openid,
                            token: '',
                            gold: goldSwith,
                            info: JSON.stringify({
                              goods_info: goods_info,
                              addr_info: addr_info,
                              order_status: 2
                            })
                          },
                          success: function(res) { //返回数据处理
                            that.Refresh(res);
                          },
                          fail: function(res) {
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
                    },
                    fail: function(res) {},
                    complete: function(res) {
                      var erro = JSON.parse(res.data);
                      var zf = JSON.parse(res.data).data;
                      var zhuangtai = JSON.parse(res.data)
                      if (zhuangtai.status == 0) {
                        if (zhuangtai.type == 2) { //金币支付
                          wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 3000,
                            success: function(e) {
                              var timer = setTimeout(function() {
                                wx.navigateTo({
                                  url: '../my-order/my-order?id=' + 1,
                                })
                                Countdown();
                              }, 2000);
                            }
                          });
                        } else { //微信支付
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
                              wx.showToast({
                                title: '支付失败',
                                icon: 'none',
                                duration: 2000,
                                success: function(e) {
                                  wx.navigateTo({
                                    url: '../my-order/my-order?id=' + 0,
                                  })
                                }
                              });
                            }
                          })
                          var status = JSON.parse(res.data).status;
                          var error = JSON.parse(res.data).error;
                        }
                      } else if (zhuangtai.status == 1 || zhuangtai.status == 2 || zhuangtai.status == 3 || zhuangtai.status == 31 || zhuangtai.status == 36 || zhuangtai.status == 38 || zhuangtai.status == 31 || (zhuangtai.status >= 104 && zhuangtai.status <= 112) || (zhuangtai.status >= 302 && zhuangtai.status <= 312) || (zhuangtai.status >= 402 && zhuangtai.status <= 412) || zhuangtai.status == 701 || zhuangtai.status == 1101) {
                        wx.showToast({
                          title: JSON.stringify(zhuangtai.status),
                          icon: 'none',
                          duration: 2500
                        });
                      } else if (zhuangtai.status == 32 || zhuangtai.status == 33 || (zhuangtai.status >= 34 && zhuangtai.status <= 35) || zhuangtai.status == 37 || (zhuangtai.status >= 102 && zhuangtai.status <= 103)) {
                        wx.showToast({
                          title: JSON.stringify(zhuangtai.error),
                          icon: 'none',
                          duration: 2500
                        });
                      }
                    }
                  })
                }
              })
            } else {}
          }
        })
      } else if (p_hasFreight == 37) {
        wx.showToast({
          title: '不在配送范围',
          icon: 'success',
          duration: 3000,
          success: function(e) {}
        })
      } else if (p_hasFreight >= 102 && p_hasFreight <= 103) {
        wx.showToast({
          title: '收货地址错误',
          icon: 'success',
          duration: 3000,
          success: function(e) {}
        })
      } else {
        wx.showToast({
          title: '错误' + p_hasFreight,
          icon: 'none',
          duration: 3000,
          success: function(e) {}
        })
      }
    } else {
      console.log(222222)
      var _this = this,
        name = this.data.name,
        img = this.data.img,
        phone = this.data.phone,
        addr_attach = this.data.addr_attach,
        sheng = this.data.addr_sheng,
        addr_shi = this.data.addr_shi,
        qu = this.data.addr_qu,
        spbs = this.data.spbs,
        pingp = this.data.pingp,
        model_id = this.data.model_id,
        model_name = this.data.model_name,
        xinh = this.data.xinh,
        num = this.data.p_buyNumble,
        p_hasFreight = this.data.p_hasFreight,
        goldSwith = this.data.p_goldSwith ? 1 : 0;
      var xuan = this.data.xuan
      
        var master = this.data.master
      
        if (_this.data.is_format == 0){
          var format_id = 0;
          var format_code = "";
          var value_show = ''
        }else{
         var format_id = this.data.format_id;
         var format_code = this.data.format_code;
          var value_show = this.data.value_show;
        }
      if (p_hasFreight == 0) {
        wx.showModal({
          title: '支付',
          content: '是否支付该订单',
          confirmText: "确定",
          cancelText: "取消",
          success: function(res) {
            if (res.confirm) {
              wx.getStorage({ //从本地拿到储存了的用户信息
                key: 'user',
                success: function(res) {
                  var addr_info = {
                    addr_name: name,
                    addr_mobile: phone,
                    addr_sheng: sheng,
                    addr_shi: addr_shi,
                    addr_qu: qu,
                    addr_details: addr_attach,
                  };
                  var goods_info = [{
                    goods_id: 1, //商品标识
                    brand_id: _this.data.brand_id, //品牌标识
                    brand_name: _this.data.brand_name, //品牌名称
                    model_id: _this.data.model_id, //型号标识
                    model_name: _this.data.model_name, //型号名称
                    format_id: format_id, //规格标识
                    format_code: format_code, //规格编号
                    format_show: value_show, //规格名称
                    made_type: 1,
                    made_image: [img],
                    buy_numble: num,
                    master_img: master
                  }]
                  console.log(goods_info);
                  var user = res.data
                  network.Post({
                    url: Order + 'api/Order/SubmitOrder',
                    method: "POST",
                    dataType: 'JSON',
                    header: {
                      "content-type": 'application/x-www-form-urlencoded'
                    },
                    data: {
                      token: user.token,
                      openid: user.openid,
                      gold: goldSwith,
                      info: JSON.stringify({
                        goods_info: goods_info,
                        addr_info: addr_info,
                        order_status: 2
                      })
                    },
                    success: function(res) {
                      var erro = JSON.parse(res.data);
                      var zf = JSON.parse(res.data).data;
                      var zhuangtai = JSON.parse(res.data)
                      if (zhuangtai.status == 0) {
                        if (zhuangtai.type == 2) { //金币支付
                          wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 3000,
                            success: function(e) {
                              var timer = setTimeout(function() {
                                wx.navigateTo({
                                  url: '../my-order/my-order?id=' + 1,
                                })
                                Countdown();
                              }, 2000);
                            }
                          });
                        } else { //微信支付
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
                              wx.showToast({
                                title: '支付失败',
                                icon: 'none',
                                duration: 2000,
                                success: function(e) {
                                  wx.navigateTo({
                                    url: '../my-order/my-order?id=' + 0,
                                  })
                                }
                              });
                            }
                          })
                          var status = JSON.parse(res.data).status;
                          var error = JSON.parse(res.data).error;
                        }
                      } else if (zhuangtai.status == 1 || zhuangtai.status == 2 || zhuangtai.status == 3 || zhuangtai.status == 31 || zhuangtai.status == 36 || zhuangtai.status == 38 || zhuangtai.status == 31 || (zhuangtai.status >= 104 && zhuangtai.status <= 112) || (zhuangtai.status >= 302 && zhuangtai.status <= 312) || (zhuangtai.status >= 402 && zhuangtai.status <= 412) || zhuangtai.status == 701 || zhuangtai.status == 1101) {
                        wx.showToast({
                          title: JSON.stringify(zhuangtai.status),
                          icon: 'none',
                          duration: 2500
                        });
                      } else if (zhuangtai.status == 32 || zhuangtai.status == 33 || (zhuangtai.status >= 34 && zhuangtai.status <= 35) || zhuangtai.status == 37 || (zhuangtai.status >= 102 && zhuangtai.status <= 103) || zhuangtai.status == 39) {
                        wx.showToast({
                          title: JSON.stringify(zhuangtai.error),
                          icon: 'none',
                          duration: 2500
                        });
                      }
                    },
                    complete: function(res) {
                      var erro = JSON.parse(res.data);
                      var zf = JSON.parse(res.data).data;
                      var zhuangtai = JSON.parse(res.data)
                      if (zhuangtai.status == 0) {
                        if (zhuangtai.type == 2) { //金币支付
                          wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 3000,
                            success: function(e) {
                              var timer = setTimeout(function() {
                                wx.navigateTo({
                                  url: '../my-order/my-order?id=' + 1,
                                })
                                Countdown();
                              }, 2000);
                            }
                          });
                        } else { //微信支付
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
                              wx.showToast({
                                title: '支付失败',
                                icon: 'none',
                                duration: 2000,
                                success: function(e) {
                                  wx.navigateTo({
                                    url: '../my-order/my-order?id=' + 0,
                                  })
                                }
                              });
                            }
                          })
                          var status = JSON.parse(res.data).status;
                          var error = JSON.parse(res.data).error;
                        }
                      } else if (zhuangtai.status == 1 || zhuangtai.status == 2 || zhuangtai.status == 3 || zhuangtai.status == 31 || zhuangtai.status == 36 || zhuangtai.status == 38 || zhuangtai.status == 31 || (zhuangtai.status >= 104 && zhuangtai.status <= 112) || (zhuangtai.status >= 302 && zhuangtai.status <= 312) || (zhuangtai.status >= 402 && zhuangtai.status <= 412) || zhuangtai.status == 701 || zhuangtai.status == 1101) {
                        wx.showToast({
                          title: JSON.stringify(zhuangtai.status),
                          icon: 'none',
                          duration: 2500
                        });
                      } else if (zhuangtai.status == 32 || zhuangtai.status == 33 || (zhuangtai.status >= 34 && zhuangtai.status <= 35) || zhuangtai.status == 37 || (zhuangtai.status >= 102 && zhuangtai.status <= 103)) {
                        wx.showToast({
                          title: JSON.stringify(zhuangtai.error),
                          icon: 'none',
                          duration: 2500
                        });
                      }
                    }
                  })
                }
              })
            } else {}
          }
        })
      } else if (p_hasFreight == 37) {
        wx.showToast({
          title: '不在配送范围',
          icon: 'success',
          duration: 3000,
          success: function(e) {}
        })
      } else if (p_hasFreight >= 102 && p_hasFreight <= 103) {
        wx.showToast({
          title: '收货地址错误',
          icon: 'success',
          duration: 3000,
          success: function(e) {}
        })
      } else {
        wx.showToast({
          title: '错误' + p_hasFreight,
          icon: 'none',
          duration: 3000,
          success: function(e) {}
        })
      }
    }
  },
  kaiguan: function(res) {
    var role = getApp().globalData.member;
  
    if (role == 1) {
      this.setData({
        p_goldSwith: res.detail.value
      })
    } else {
      this.setData({
        p_goldSwith: false
      })
    }
    this.GetData();
  }
})