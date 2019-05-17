// pages/ruzhu/index.js
var network = require("../../utils/network.js"); //接口封装

var g_app = getApp();
var UerUrl = getApp().data.UerUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    istuan:false,
    grade:'',
    sSta:0,
    judge:false,
    shoparr:[
      {
        name:'个人店长',
        money:'免费',
        url:'/pages/pRuZhu/index',
        isshow:true
      },
      {
        name: '线下店铺店长',
        money: '免费',
        url:'/pages/components/Shopkeeper/Shopkeeper',
        isshow:true
      },
      {
        name: '团队店长',
        money: '3000',
        url:'/pages/teamApply/index',
        isshow:true
      }
    ]
  },
  to_shop(){
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
  judge_shop() {

    var that = this;
    if (wx.getStorageSync('user')) {
      wx.showLoading({
        title: '加载中···',
        mask: true
      })
      
      wx.getStorage({ //从本地拿到储存了的用户信息
        key: 'user',
        success: function (res) {
          var user = res.data

          network.Post({
            url: UerUrl + 'api/User/check_shop_type',
            data: {
              openid: user.openid,
              token: user.token
            },
            success: res => {
              wx.hideLoading();
              var r = JSON.parse(res.data);
              if (res.statusCode == 200) {
                var s = r.status, grade,judge=false;
                switch (s) {
                  case 2: judge=true;break;
                  case 6: judge = true;break;
                  case 9: judge = true;break;
                }

                if(judge){
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
                    grade,
                    judge
                  })
                }
              } else {
                g_app.ShowError('店长状态获取失败', 4000);
              }
              console.log(r, "我只去一票");
            },
            fail: function (res2) {
              wx.hideLoading();
              g_app.ShowError(res2, 5000);
            }
          });
        },
        fail() {
          wx.hideLoading();
        }
      })
      
    } else {
      wx.showModal({
        title: '温馨提醒',
        content: '得知你未授权，是否前往我的进行授权',
        success(res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/components/user/user',
            })
          }else{
            wx.navigateBack({
              delay:1
            })
          }
        }
      })
    }
  },
  scaleImg(e){
    
    wx.previewImage({
      current:e.target.dataset.src,
      urls: this.data.haibao.map(a => { return a.banner_image;})
    })
  },
  go_haibao(){
    var that = this;
    network.Post({
      url: UerUrl + '/api/Banner/AllBanners',
      success: res => {

        var r = JSON.parse(res.data);
        console.log(r, '海报？');
        if(r.data){
          that.setData({
            haibao:r.data
          })
        }
      },
      fail: function (res2) {
        app.ShowError(res2, 5000);
      }
    });
  },
  go_save() {
    var that = this;
    wx.getStorage({
      key: 'login',
      success: function (stor) {
        console.log(stor, '我靠');
        var data={}; 
        data.openid = stor.data.openid;
        data.token = stor.data.token;
        console.log(data, "data");
        network.Post({
          url: UerUrl + 'api/User/ApplyShop3',
          data: data,
          success: res => {

            var r = JSON.parse(res.data);
            if (res.statusCode == 200) {

              console.log(r,'状态');
              var s = r.status;
              var gets = that.data.shoparr;
              if (s == 8) {
                gets[2].url = "/pages/nopayteam/nopayteam";

              } else {
                gets[2].url = "/pages/teamApply/index";
              }

              that.setData({
                shoparr: gets
              });

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
  go_shop() {
    wx.showLoading()
    var that = this;
    wx.getStorage({
      key: 'login',
      success: function(stor) {
        console.log(stor,"res");

        //获取用户币袋
        network.Post({
          url: UerUrl + 'api/User/check_shop_type',
          data: {
            openid: stor.data.openid,
            token: stor.data.token
          },
          success: res => {

            var r = JSON.parse(res.data);
            if (res.statusCode == 200) {
              var s = r.status;
              var gets = that.data.shoparr;
              if (s == 8) {
                gets[2].url = "/pages/nopayteam/nopayteam";
                
              }else{
                gets[2].url = "/pages/teamApply/index";
              }   

              that.setData({
                shoparr: gets
              });
            } else {
              g_app.ShowError('店长状态获取失败', 4000);
            }
            console.log(r, "我只去一票");
          },
          fail: function (res2) {
            g_app.ShowError(res2, 5000);
          },
          complete(){
            wx.hideLoading();
          }
        });
      },
      fail:function(){
        wx.hideLoading();
      }
    })
  },
  myevent(){

  },
  toRuZhu($ev){
    
    wx.navigateTo({
      url: '../components/Shopkeeper/Shopkeeper',

    })
  },
  toPRuZhu(){
    wx.navigateTo({
      url: '/pages/pRuZhu/index',
    })
  },
  toSRuZhu(){
    wx.navigateTo({
      url: '/pages/teamApply/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    if(options.istuan){

      var ss=this.data.shoparr;
      ss=ss.map((a, i) => { 
        var as = a;
        if (i == ss.length-1) { 
          as['url'] ='/pages/xianxia/index';
            return as; 
          } else { 
          as.isshow = false; 
          return as; } });
      this.setData({
        shoparr:ss,
        istuan:true
      })
    }

    //获取海报
    this.go_haibao();
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
    this.judge_shop();
    // this.go_shop();
    // this.go_save();
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

  }
})