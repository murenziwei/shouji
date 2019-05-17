var address = getApp().data.address;
var network = require("../../../utils/network.js");//接口封装
var g_againLogin = require("../../../utils/AgainLogin.js");
Page({
  data: {
    shuliang: []
  },
  handleCheckboxChange: function(e) {
    
  },
  shouhuo: function(res) {
    var id = res.currentTarget.dataset.id;
    var name = res.currentTarget.dataset.name;
    var phone = res.currentTarget.dataset.phone;
    var sheng = res.currentTarget.dataset.sheng;
    var shi = res.currentTarget.dataset.shi;
    var qu = res.currentTarget.dataset.qu;
    var xx = res.currentTarget.dataset.xx;
    var moren = res.currentTarget.dataset.moren;
    wx.navigateTo({
      url: '../shouhuoxinxi/shouhuoxinxi?id=' + id + '&name=' + name + '&phone=' + phone + '&sheng=' + sheng + '&shi=' + shi + '&qu=' + qu + '&xx=' + xx + '&moren=' + moren,
    })
  },
  tiaozhuan: function(res) {
    wx.navigateTo({
      url: '../shouhuoxinxi/shouhuoxinxi',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  tiaozhuan1: function(res) {
    var that = this;
    wx.chooseAddress({
      success: function(res) {
        console.log(res);
        var addr_mobile = res.telNumber.replace("-", "");
        var data = {
          addr_attach: res.detailInfo,
          addr_city: res.cityName,
          addr_mobile: addr_mobile,
          addr_name: res.userName,
          addr_qu: res.countyName,
          addr_sheng: res.provinceName,
          default_addr: 0
        }
        network.Post({
          url: address + 'api/Addr/AddAddr',
          method: "POST",
          dataType: 'JSON',
          header: {
            "content-type": 'application/x-www-form-urlencoded'
          },
          data: {
            token: wx.getStorageSync('user').token,
            openid: wx.getStorageSync('user').openid,
            info: JSON.stringify(data)
          },
          success: function (res) {
            var id = JSON.parse(res.data).data
            data.id=id;
            var xingzeng = data
            getApp().globalData.shuliang[0].push(xingzeng)
          }
        })
        // var _this = this;
        // wx.getStorage({ //从本地拿到储存了的用户信息
        //   key: 'user',
        //   success: function(opo) {
        //     var user = opo.data
        //     network.Post({
        //       url: address + 'api/Addr/AddAddr',
        //       method: "POST",
        //       dataType: 'JSON',
        //       header: {
        //         "content-type": 'application/x-www-form-urlencoded'
        //       },
        //       data: {
        //         token: user.token,
        //         openid: user.openid,
        //         info: JSON.stringify(data)
        //       },
        //       success: function(e) {
        //         console.log(e);
        //         if(JSON.parse(e.data).status == 3){
        //           g_againLogin.AutoLogin({
        //             url: detail + 'api/Addr/GetDefault',
        //             data: {
        //               openid: wx.getStorageSync('user').openid,
        //               token: '',
        //               info: JSON.stringify(data)
        //             },
        //             success: function (res) { //返回数据处理
        //             console.log(res);
        //               var nihao = JSON.parse(e.data);
        //               var id = JSON.parse(nihao.data)
        //               var data = {
        //                 addr_attach: res.detailInfo,
        //                 addr_city: res.cityName,
        //                 addr_mobile: addr_mobile,
        //                 addr_name: res.userName,
        //                 addr_qu: res.countyName,
        //                 addr_sheng: res.provinceName,
        //                 default_addr: 0,
        //                 id: id
        //               }
        //               getApp().globalData.shuliang[0].push(data) //存在全局变量当中 

        //               that.setData({
        //                 shuliang: getApp().globalData.shuliang[0]
        //               })
        //             },
        //             fail: function (res) {
        //               g_app.ShowError(res, 3000);
        //             },
        //           });
        //         }
        //         var nihao = JSON.parse(e.data);
        //         var id = JSON.parse(nihao.data)
        //         var data = {
        //           addr_attach: res.detailInfo,
        //           addr_city: res.cityName,
        //           addr_mobile: addr_mobile,
        //           addr_name: res.userName,
        //           addr_qu: res.countyName,
        //           addr_sheng: res.provinceName,
        //           default_addr: 0,
        //           id: id
        //         }
        //         console.log(getApp().globalData.shuliang)
        //         getApp().globalData.shuliang[0].push(data) //存在全局变量当中 
        //         console.log(getApp().globalData.shuliang[0]);
        //         that.setData({
        //           shuliang: getApp().globalData.shuliang[0]
        //         })

        //       }
        //     })
        //   },
        // })
      }
    })
  },
  shanchu: function(res) {
    
    let idx = res.currentTarget.dataset.idx;
    var id = res.currentTarget.dataset.id;
    
    var that = this;
    wx.showModal({
      title: '提示信息',
      content: '确定要删除吗',
      confirmText: "确定",
      cancelText: "取消",
      success: function(res) {
        if (res.confirm) {
          var _this = this;
          wx.getStorage({ //从本地拿到储存了的用户信息
            key: 'user',
            success: function(res) {
              var user = res.data
              network.Post({
                url: address + 'api/Addr/DeleteAddr',
                method: "POST",
                dataType: 'JSON',
                header: {
                  "content-type": 'application/x-www-form-urlencoded'
                },
                data: {
                  token: user.token,
                  openid: user.openid,
                  id: id
                },
                success: function(res) {
                  var status = JSON.parse(res.data).status
                  if (status == 0) {
                    wx.showToast({
                      title: '删除成功',
                      icon: 'loading',
                      duration: 1500,
                      success: function(e) {
                        var _this = this;
                        wx.getStorage({ //从本地拿到储存了的用户信息
                          key: 'user',
                          success: function(res) {
                            var user = res.data
                            network.Post({
                              url: address + 'api/Addr/AllAddr',
                              method: "POST",
                              dataType: 'JSON',
                              header: {
                                "content-type": 'application/x-www-form-urlencoded'
                              },
                              data: {
                                token: user.token,
                                openid: user.openid
                              },
                              success: function(res) {
                                if (1101 != JSON.parse(res.data).status) {
                                  var token = JSON.parse(res.data).token;
                                  var userInfo = wx.getStorageSync('user');
                                  userInfo.token = token;
                                  wx.setStorageSync('user', userInfo);
                                }
                                if (JSON.parse(res.data).status == 3) {
                                  g_againLogin.AutoLogin({
                                    url: address + 'api/Addr/AllAddr',
                                    data: {
                                      openid: wx.getStorageSync('user').openid,
                                      token: ''
                                    },
                                    success: function (res) {  //返回数据处理
                                      that.setData({
                                        shuliang: JSON.parse(res.data).data //拿到全局变量
                                      })
                                    },
                                    fail: function (res) {
                                      g_app.ShowError(res, 3000);
                                    },
                                  });
                                }
                                that.setData({
                                  shuliang: JSON.parse(res.data).data
                                })
                              }
                            })
                          },
                        })
                      }
                    })
                  } else {
                    wx.showToast({
                      title: '删除失败',
                      icon: 'success',
                      duration: 1000
                    })
                  }
             
                  that.setData({
                    shuliang: getApp().globalData.shuliang[0]
                  })
                }
              })
            },
          })
        } else if (res.cancel) {
      
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function(res) {
        var user = res.data
        network.Post({
          url: address + 'api/Addr/AllAddr',
          method: "POST",
          dataType: 'JSON',
          header: {
            "content-type": 'application/x-www-form-urlencoded'
          },
          data: {
            token: user.token,
            openid: user.openid
          },
          success: function(res) {
            if (1101 != JSON.parse(res.data).status) {
              var token = JSON.parse(res.data).token;
              var userInfo = wx.getStorageSync('user');
              userInfo.token = token;
              wx.setStorageSync('user', userInfo);
            }
            if (JSON.parse(res.data).status == 3){
              g_againLogin.AutoLogin({
                url: address + 'api/Addr/AllAddr',
                data: {
                  openid: wx.getStorageSync('user').openid,
                  token: ''
                },
                success: function (res) {  //返回数据处理
                  _this.setData({
                    shuliang: JSON.parse(res.data).data //拿到全局变量
                  })
                },
                fail: function (res) {
                  g_app.ShowError(res, 3000);
                },
              });
            }
            var shuliang = JSON.parse(res.data).data;
            getApp().globalData.shuliang.push(shuliang)
           
            _this.setData({
              shuliang: JSON.parse(res.data).data //拿到全局变量
            })
          }
        })
      },
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var _this = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function (res) {
        var user = res.data
        network.Post({
          url: address + 'api/Addr/AllAddr',
          method: "POST",
          dataType: 'JSON',
          header: {
            "content-type": 'application/x-www-form-urlencoded'
          },
          data: {
            token: user.token,
            openid: user.openid
          },
          success: function (res) {
            if (1101 != JSON.parse(res.data).status) {
              var token = JSON.parse(res.data).token;
              var userInfo = wx.getStorageSync('user');
              userInfo.token = token;
              wx.setStorageSync('user', userInfo);
            }
            if (JSON.parse(res.data).status == 3) {
              g_againLogin.AutoLogin({
                url: address + 'api/Addr/AllAddr',
                data: {
                  openid: wx.getStorageSync('user').openid,
                  token: ''
                },
                success: function (res) {  //返回数据处理
                  _this.setData({
                    shuliang: JSON.parse(res.data).data //拿到全局变量
                  })
                },
                fail: function (res) {
                  g_app.ShowError(res, 3000);
                },
              });
            }
            var shuliang = JSON.parse(res.data).data;
            getApp().globalData.shuliang.push(shuliang)
  
            _this.setData({
              shuliang: JSON.parse(res.data).data //拿到全局变量
            })
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
  //       console.log(res)
  //     },
  //     fail: function (res) {
  //       console.log(res)
  //     },
  //   }
  // },
  backnav(){
    wx.navigateBack({
      delay:1
    })
  },
  moren: function(e) {
    var zhuangtai = e.currentTarget.dataset.id;
    var that = this;
    var idx = e.currentTarget.dataset.idx
    var _this = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function(res) {
        var user = res.data
        network.Post({
          url: address + 'api/Addr/DefaultAddr',
          method: "POST",
          dataType: 'JSON',
          header: {
            "content-type": 'application/x-www-form-urlencoded'
          },
          data: {
            token: user.token,
            openid: user.openid,
            id: zhuangtai
          },
          success: function(res) {
            network.Post({
              url: address + 'api/Addr/AllAddr',
              method: "POST",
              dataType: 'JSON',
              header: {
                "content-type": 'application/x-www-form-urlencoded'
              },
              data: {
                token: user.token,
                openid: user.openid
              },
              success: function(res) {
                if (1101 != JSON.parse(res.data).status) {
                  var token = JSON.parse(res.data).token;
                  var userInfo = wx.getStorageSync('user');
                  userInfo.token = token;
                  wx.setStorageSync('user', userInfo);
                }
                if (JSON.parse(res.data).status == 3) {
                  g_againLogin.AutoLogin({
                    url: address + 'api/Addr/AllAddr',
                    data: {
                      openid: wx.getStorageSync('user').openid,
                      token: ''
                    },
                    success: function (res) {  //返回数据处理
                      _this.setData({
                        shuliang: JSON.parse(res.data).data //拿到全局变量
                      })
                    },
                    fail: function (res) {
                      g_app.ShowError(res, 3000);
                    },
                  });
                }
                var shuliang = JSON.parse(res.data).data;
                getApp().globalData.shuliang.push(shuliang)
             
                _this.setData({
                  shuliang: JSON.parse(res.data).data //拿到全局变量
                })
              }
            })
          }
        })
      },
    })
  }
})