var network = require("../../../utils/network.js"); //接口封装
var g_autoLogin = require("../../../utils/AutoLogin.js");
var g_againLogin = require("../../../utils/AgainLogin.js");
var Order = getApp().data.Order;
var g_app = getApp();
var UerUrl = getApp().data.UerUrl;
var tempUrl = getApp().data.tempUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grade: '',
    isshop: false,//是否注册
    orderNavs: [
      {
        icon: 'icon-daifukuan',
        label: '待付款',
        id: ''
      },
      {
        icon: 'icon-ziyuan',
        label: '待发货',
        id: ''
      },
      {
        icon: 'icon-daishouhuo',
        label: '待收货',
        id: ''
      },
      {
        icon: 'icon-yiwancheng',
        label: '已完成',
        id: ''
      }
    ],
    tabs: ["我的分享", "我的收藏"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 10,
    page: 1,
    yipage: 1,
    shuliang: [],
    my_shouc: '',
    status: '',
    cz: '',
    total_numble: '',
    pay_past: '',
    pay_wait: '',
    zhuangtai: '',
    p_userCoin: 0.00, //用户可用金币额度
    p_userInfo: null, //存储用户基本信息
    p_collectGoods: [], //存储用户收藏商品
    p_shareUser: [], //存储用户分享用户
    is_no: 0,
    islogin: true,
    sSta: 0
  },

  //跳往详情
  xq: function (res) {
    var id = res.currentTarget.dataset.id;
    var img = res.currentTarget.dataset.img;
    wx.navigateTo({
      url: '../xiangqing/xiangqing?id=' + id + '&img=' + img,
    })
  },
  //取消收藏
  quxiao: function (res) {
    var id = res.currentTarget.dataset.id;
    var idx = res.currentTarget.dataset.idx;
    var my_shouc = this.data.my_shouc;
    var that = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function (res) {
        var user = res.data
        network.Post({
          url: Order + 'api/Collect/DeleteGoods',
          data: {
            token: user.token,
            openid: user.openid,
            id: id
          },
          success: function (res) {
            if (JSON.parse(res.data).status == 3) {
              g_againLogin.AutoLogin({
                url: Order + 'api/Collect/DeleteGoods',
                data: {
                  openid: wx.getStorageSync('user').openid,
                  token: '',
                  id: id
                },
                success: function (res) {  //返回数据处理
                  console.log("无用？");
                  
                  my_shouc.splice(idx, 1)
                  that.setData({
                    my_shouc: my_shouc
                  })
                },
                fail: function (res) {
                  g_app.ShowError(res, 3000);
                },
              });
            }
            
            my_shouc.splice(idx, 1)
            that.setData({
              my_shouc: my_shouc
            })
            g_app.ShowError('取消收藏成功', 2000);
          },
          fail: function (res) {

          }
        })
      },
    })
  },
  //跳转订单页面
  dingdan: function (e) {
    var id = e.currentTarget.dataset.idx
    wx.navigateTo({
      url: '../my-order/my-order?id=' + id,
    })
  },
  go_shop() {
    var that = this;
    
    network.Post({
      url: UerUrl + 'api/User/check_shop_type',
      data: {
        openid: that.data.p_userInfo.openid,
        token: that.data.p_userInfo.token
      },
      success: res => {

        var r = JSON.parse(res.data);
        if (res.statusCode == 200) {
          var s = r.status, grade;
          if (s == 1) {
            grade = '普通用户';
          } else if (s == 2) { grade = '个人店长' }
          else if (s <= 6) {
            grade = '线下店长';
          } else if (s <= 9) {
            grade = '团队店长';
          }
          that.setData({
            sSta: r.status,
            grade
          })
        } else {
          g_app.ShowError('店长状态获取失败', 4000);
        }
        console.log(r, "我只去一票");
      },
      fail: function (res2) {
        g_app.ShowError(res2, 5000);
      }
    });
  },
  tabClick(e) {

    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  toAddress() {
    wx.navigateTo({
      url: '/pages/components/dizhi/dizhi',
    })
  },
  toOrder(e) {
    var id = e.currentTarget.dataset.ind
    wx.navigateTo({
      url: '/pages/components/my-order/my-order?id=' + id,
    })
  },
  toFriend() {
    wx.navigateTo({
      url: '/pages/friend/friend',
    })
  },
  toShop() {
    var that = this;
    console.log(that.data.sSta, "sSta");
    switch (that.data.sSta) {
      case 1:
        wx.navigateTo({
          url: '/pages/ruzhu/index',
        }); break;
      case 2: wx.navigateTo({
        url: '/pages/components/Distribution/Distribution?type=个人店长',
      }); break;
      case 6: wx.navigateTo({
        url: '/pages/components/Distribution/Distribution?type=线下店长',
      }); break;
      case 9: wx.navigateTo({
        url: '/pages/components/Distribution/Distribution?type=团队店长',
      }); break;
      case 8: g_app.ShowError('未支付订单 前往支付', 5000); wx.navigateTo({
        url: '/pages/ruzhu/index?status=8',
      }); break;
      default: g_app.ShowError('该店铺无法查看', 5000);;
    }
  },

  //用户授权
  getUserInfo: function (event) {


    let userinfo = event.detail;
    if (userinfo.errMsg == "getUserInfo:ok") {
      wx.setStorageSync("userlogin", userinfo);

      var that = this;

      console.log(33333333)
      g_autoLogin.AutoLogin({
        success: res1 => that.onAutoSuccess(res1),
        fail: function (res2) {
          g_app.ShowError(res2, 5000);
          console.log(res2, "ok");
          // that.setData({ islogin: true });
        }
      });


    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();//隐藏分享
  },

  onAutoSuccess: function (res) {
    var that = this;
    that.InitPage(res);
  },
  InitPage: function (userInfo) {
    getApp().globalData.role = userInfo.role;
    getApp().globalData.member = userInfo.member;
    wx.setStorage({
      key: 'login',
      data: userInfo,
      success: function (res) {
      }
    })
    var that = this;
    that.setData({
      p_userInfo: userInfo
    });
    console.log(userInfo)
    //获取用户币袋
    network.Post({
      url: UerUrl + 'api/User/my_shop',
      data: {
        openid: that.data.p_userInfo.openid,
        token: that.data.p_userInfo.token
      },
      success: res1 => that.onGetCoinSuccess(res1),
      fail: function (res2) {
        g_app.ShowError(res2, 5000);
      }
    });
    //获取店长状态
    that.go_shop();
  },

  onGetCoinSuccess: function (res) {
    console.log(res)
    var that = this;
    var ret = JSON.parse(res.data);


    
      
    that.setData({
      p_userCoin: ret.commission
      
    });
    

    //获取收藏商品
    network.Post({
      url: Order + 'api/Collect/CollectGoods',
      data: {
        openid: that.data.p_userInfo.openid,
        token: that.data.p_userInfo.token,
        page: 1,
        numble: 4
      },
      success: res1 => that.onGetCollectSuccess(res1),
      fail: function (res2) {
        g_app.ShowError(res2, 5000);
      }
    });

  },
  onGetCollectSuccess: function (res) {
    var that = this;
    var ret = JSON.parse(res.data);
    if (0 == ret.status) {
      that.setData({
        p_collectGoods: ret.data,
        my_shouc: ret.data,

      });
    } else {
      g_app.ShowError("错误码[" + ret.status + "]:" + ret.error, 5000);
    }
    if (1101 != ret.status) {
      var userInfo = wx.getStorageSync('user');
      userInfo.token = ret.token;
      that.data.p_userInfo = userInfo;
      wx.setStorageSync('user', userInfo);
    }

    //获取分享用户
    network.Post({
      url: Order + 'api/Share/ShareUser',
      data: {
        openid: that.data.p_userInfo.openid,
        token: that.data.p_userInfo.token,
        page: 1,
        numble: 5
      },
      success: res1 => that.onGetShareSuccess(res1),
      fail: function (res2) {
        g_app.ShowError(res2, 5000);
      }
    });
    network.Post({
      url: UerUrl + 'api/User/ShopStatus',
      data: {
        token: that.data.p_userInfo.token,
        openid: that.data.p_userInfo.openid,
      },
      success: function (res) {
        var status1 = JSON.parse(res.data);
        if (1101 != status1.status) { //修改token
          var token = JSON.parse(res.data).token;
          var userInfo = wx.getStorageSync('user');
          userInfo.token = token;
          wx.setStorageSync('user', userInfo);
        }
        if (status1.status == 101) {
          that.setData({
            cz: status1.status,
            status: status1.status
          })
        } else if (status1.status == 3) {
          g_againLogin.AutoLogin({
            url: UerUrl + 'api/User/ShopStatus',
            data: {
              openid: that.data.p_userInfo.openid,
              token: '',
            },
            success: function (res) {  //返回数据处理
              if (status1.status == 101) {
                that.setData({
                  cz: status1.status,
                  status: status1.status
                })
              } else {
                that.setData({
                  cz: status1.status,
                  zhuangtai: status1.data.shop_status
                })
              }
            },
            fail: function (res) {
              g_app.ShowError(res, 3000);
            },
          });
        } else {
          that.setData({
            cz: status1.status,
            zhuangtai: status1.data.shop_status
          })
        }
      }
    })
  },
  onGetShareSuccess: function (res) {
    var that = this;
    var ret = JSON.parse(res.data);
    if (0 == ret.status) {
      that.setData({
        p_shareUser: ret.data,
        shuliang: ret.data
      });
    } else {
      g_app.ShowError("错误码[" + ret.status + "]:" + ret.error, 5000);
    }
    if (1101 != ret.status) {
      var userInfo = wx.getStorageSync('user');
      userInfo.token = ret.token;
      that.data.p_userInfo = userInfo;
      wx.setStorageSync('user', userInfo);
    }

    this.setData({
      islogin: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(this.data, 'data全部数据');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that = this;
    var userInfo = wx.getStorageSync('user');
    console.log(userInfo)
    if (userInfo) { //有用户信息
      that.InitPage(userInfo);
    } else { //无用户信息
      that.data.p_userInfo = null;
      that.setData({
        islogin: false
      })
    }
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

  onShareAppMessage: function (res) {

    var openid = wx.getStorageSync('user').openid;
    console.log(openid)
    return {
      title: '成为分享的一员',
      desc: '分享给好友',
      path: '/pages/otherphone/otherphone?share=' + openid
    }

  }
 
})