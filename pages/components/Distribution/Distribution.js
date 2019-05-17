// pages/components/Distribution/Distribution.js
var pay = getApp().data.pay;
var icom = getApp().data.icom;
var UerUrl = getApp().data.UerUrl
var network = require("../../../utils/network.js"); //接口封装
var g_againLogin = require("../../../utils/AgainLogin.js");
var g_app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grade:'店长',
    status: '',
    xiaoshi: 0,
    erweim: '',
    pay_past: '',
    pay_wait: '',
    total_numble: '',
    animation: '',
    userinfo: wx.getStorageSync('user'),
    istuan:false,
    user_nick:'',
    user_avatar:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    wx.showLoading({
      title: '加载中',
    })
    console.log(options)
    if(options.type){
      console.log(options.type,"type");
      if (options.type =='团队店长'){
        this.setData({ istuan:true });
      }
      this.setData({grade:options.type});
    }
    //动画效果
    this.create_ani();

  },
  allorder(){

    wx.navigateTo({
      url: '/pages/components/all_order/all_order',
    })
  },
  shoukuan: function (res) {
    wx.navigateTo({
      url: '../shoukuan/shoukuan',
    })
  },
  tuandui: function (res) {
    wx.navigateTo({
      url: '../My_team/My_team',
    })
  },
  create_ani() {
    this.animation = wx.createAnimation({
      duration: 500,
      timingFunctionL: 'ease',
      delay: 100

    })
    this.animation.top(0).step();
    this.setData({
      // 输出动画
      animation: this.animation.export()
    })
  },
  shengq: function (res) {
    wx.navigateTo({
      url: '../Shopkeeper/Shopkeeper',
    })
  },
  shoukuan: function (res) {
    wx.navigateTo({
      url: '../shoukuan/shoukuan',
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

    var that = this
    var userInfo = wx.getStorageSync('user');

    //获取用户币袋
    network.Post({
      url: UerUrl + 'api/User/my_shop',
      data: {
        openid: userInfo.openid,
        token: userInfo.token
      },
      success: function (res) {

        var ret = JSON.parse(res.data);
        console.log(ret,"ok");
        
          that.setData({
            p_userCoin:ret.commission,
            total_numble: ret.all_commission,
            pay_past: ret.already_commission,
            pay_wait: ret.no_commission,
            peopleNum: ret.peopleNum,
            orderNum: ret.orderNum,
            user_avatar:ret.user_avatar,
            user_nick:ret.user_nick
            // dianNum: ret.dianNum
          });
          if (ret.bmfStatus == 1) {
            that.setData({
              bmf: ret.bmf,
              bmfStatus: ret.bmfStatus
            })
          }
        
      },
      fail: function (res2) {
        g_app.ShowError(res2, 5000);
      }
    });
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
  onShareAppMessage: function (res) {

    var openid = wx.getStorageSync('user').openid;
    return {
      title: '成为分享的一员',
      desc: '分享给好友',
      path: '/pages/otherphone/otherphone?share=' + openid
    }

  },
  tixian: function (res) {
    wx.navigateTo({
      // url: '/pages/myshop/Put_forward/Put_forward?total_numble=' + this.data.p_userCoin
      url: '../Put_forward/Put_forward?total_numble=' + this.data.p_userCoin,
    })

  },
  tiao: function (res) {
    wx.navigateTo({
      url: '../Distribution_order/Distribution_order',
    })
  },
  tudandui: function (res) {
    wx.navigateTo({
      url: '../My_team/My_team',
    })
  },
  shezhia: function (res) {
    var status = this.data.status;
    console.log(status)
    wx.navigateTo({
      url: '../xiugai/xiugai?status=' + status,
    })
  },
  yongjin: function (res) {
    var p_userCoin = this.data.p_userCoin;
    var pay_past = this.data.pay_past;
    var pay_wait = this.data.pay_wait
    wx.navigateTo({
      url: '../Commission/Commission?pay_past=' + pay_past + '&pay_wait=' + pay_wait + '&total_numble=' + p_userCoin,
    })
  },
  erweima: function (res) {
    var that = this;
    that.setData({ xiaoshi: 1});
    if (that.data.erweim==''){
      wx.getStorage({ //从本地拿到储存了的用户信息
        key: 'user',
        success: function (res) {
          var user = res.data;
          network.Post({
            url: pay + 'api/Wechat/MakeQrcode',
            data: {
              token: user.token,
              openid: user.openid
            },
            success: function (res) {

              var r = JSON.parse(res.data);
              if (1101 != JSON.parse(res.data).status) {//修改token
                var token = JSON.parse(res.data).token;
                var userInfo = wx.getStorageSync('user');
                userInfo.token = token;
                wx.setStorageSync('user', userInfo);
              }
              if (JSON.parse(res.data).status) {
                g_againLogin.AutoLogin({
                  url: pay + 'api/Wechat/MakeQrcode',
                  data: {
                    openid: wx.getStorageSync('user').openid,
                    token: wx.getStorageSync('user').token
                  },
                  success: function (res) {
                    //返回数据处理
                    var erweim = JSON.parse(res.data).data
                    console.log(erweim, "这是？");
                    network.Post({
                      url: icom + 'api/Image/upload',
                      data: {
                        data: erweim,
                        file_token: r.token || getApp().data.file_token
                      },
                      success: function (res) {
                        if (JSON.parse(res.data).status == 0) {
                          var erweima = JSON.parse(res.data).url;
                          that.setData({
                            erweim: erweima
                          })
                        }
                      }
                    })
                  },
                  fail: function (res) {
                    g_app.ShowError(res, 3000);
                  },
                });
              }
              var erweim = JSON.parse(res.data).data
              console.log(getApp().data.file_token, "file_token");
              network.Post({
                url: icom + 'api/Image/upload',
                data: {
                  data: erweim,
                  file_token: getApp().data.file_token
                },
                success: function (res) {
                  if (JSON.parse(res.data).status == 0) {
                    var erweima = JSON.parse(res.data).url;
                    that.setData({
                      erweim: erweima,
                      xiaoshi: 1
                    })
                  }
                }
              })
            }

          })
        },
        fail() {
          wx.hideLoading();
        }
      })
    }
  },
  baochun: function (e) {
    var erweim = this.data.erweim;
    wx.previewImage({
      current: erweim, // 当前显示图片的http链接
      urls: [erweim] // 需要预览的图片http链接列表
    })
  },
  xiaos: function (res) {
    console.log('shifou');
    this.setData({
      xiaoshi: 0
    })
  },
  goTeam: function (res) {
    wx.navigateTo({
      url: '/pages/ruzhu/index?istuan=true',
    })
  }
})