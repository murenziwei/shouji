var network = require("../../utils/network.js"); //接口封装
var g_autoLogin = require("../../utils/AutoLogin.js");
var g_againLogin = require("../../utils/AgainLogin.js");
var Order = getApp().data.Order;
var g_app = getApp();
var UerUrl = getApp().data.UerUrl;
var tempUrl = getApp().data.tempUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grade:'',
    isshop:false,//是否注册
    orderNavs:[
      {
        icon:'/images/icon/daifukuan.png',
        label:'待付款',
        id:''
      },
      {
        icon: '/images/icon/fahuo.png',
        label: '待发货',
        id: ''
      },
      {
        icon: '/images/icon/shouhuo.png',
        label: '待收货',
        id: ''
      },
      {
        icon: '/images/icon/tuikuan.png',
        label: '待完成',
        id: ''
      },
      {
        icon: '/images/icon/tuikuan.png',
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
    shuliang: '',
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
    sSta:0
  },

  //跳转订单页面
  dingdan: function (e) {
    var id = e.currentTarget.dataset.idx
    wx.navigateTo({
      url: '../my-order/my-order?id=' + id,
    })
  },
  go_shop(){
    var that=this;
    //获取用户币袋
    network.Post({
      url: UerUrl + 'api/User/check_shop_type',
      data: {
        openid: that.data.p_userInfo.openid,
        token: that.data.p_userInfo.token
      },
      success: res => {
        
        var r=JSON.parse(res.data);
        if (res.statusCode==200){
          var s=r.status,grade;
          if(s==1){
            grade='普通用户';
          }else if(s==2){grade='个人店长'}
          else if(s<=6){
            grade='线下店长';
          }else if(s<=9){
            grade='团队店长';
          }
          that.setData({
            sSta:r.status,
            grade
          })
        }else{
          g_app.ShowError('店长状态获取失败',4000);
        }
        console.log(r,"我只去一票");
      },
      fail: function (res2) {
        g_app.ShowError(res2, 5000);
      }
    });
  },
  tabClick(e){

    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  toAddress(){
    wx.navigateTo({
      url: '/pages/address/addressManage',
    })
  },
  toOrder(e){
    var id = e.currentTarget.dataset.ind
    wx.navigateTo({
      url: '/pages/order/order?id=' + id,
    })
  },
  toFriend(){
      wx.navigateTo({
        url: '/pages/friend/friend',
      })
  },
  toShop(){
    var that=this;
    console.log(that.data.sSta,"sSta");
    switch(that.data.sSta){
      case 1:
        wx.navigateTo({
          url: '/pages/ruzhu/index',
        });break;
      case 2: ; 
      case 6: ;
      case 9:wx.navigateTo({
        url: '/pages/myshop/index/index',
      });break;
      case 8: g_app.ShowError('未支付订单 前往支付', 5000); wx.navigateTo({
        url: '/pages/ruzhu/index?status=8',
      });break;
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
          that.setData({ islogin: true });
        }
      });


    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      url: UerUrl + 'api/User/UserCoin',
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
    if (0 == ret.status) {
      var coin = Number(ret.data.total_numble) - (Number(ret.data.pay_past) + Number(ret.data.pay_wait) + Number(ret.data.postal_past) + Number(ret.data.postal_wait));
      that.setData({
        p_userCoin: coin.toFixed(2),
        total_numble: ret.data.total_numble,
        pay_past: ret.data.pay_past,
        pay_wait: ret.data.pay_wait,
      });
    } else {
      g_app.ShowError("错误码[" + ret.status + "]:" + ret.error, 5000);
    }

    // //更新新token
    // if (1101 != ret.status) {
    //   var userInfo = wx.getStorageSync('user');
    //   userInfo.token = ret.token;
    //   that.data.p_userInfo = userInfo;
    //   wx.setStorageSync('user', userInfo);
    // }
    if (ret.status == 3) {

    }
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
    console.log(this.data,'data全部数据');
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})