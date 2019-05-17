// pages/components/Welcome/Welcome.js
var UerUrl = getApp().data.UerUrl;
var network = require("../../../utils/network.js");//接口封装

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: '',
    longitude: '',
    id:'',
    share:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      share: options.share
    })
  },
  jinru: function (res) {
    var that = this;
    var share = that.data.share
    wx.login({ //登录获取code
      success: res => {
        wx.getUserInfo({ //获取用户信息
          success: function (e) {
            wx.getLocation({  //获取地理位置
              success: function (opo) {      
                if (share == undefined) {
                  network.request({ //接口发送信息
                    url: UerUrl + 'api/User/AutoLogin',
                    data: {
                      code: res.code,
                      share: 0,
                      info: JSON.stringify({
                        nick: e.userInfo.nickName,
                        avatar: e.userInfo.avatarUrl,
                        sex: e.userInfo.gender,
                        longitude: opo.longitude,
                        latitude: opo.latitude
                      }),
                    },
                    success: function (res) {
                      var roo = JSON.parse(res.data).data;
                      var fenx = JSON.parse(res.data).data.openid;
                      getApp().globalData.user = res.data;
                      getApp().globalData.role = roo.role;
                      var geren = JSON.parse(res.data);
                      wx.setStorage({//保存个人消息在本地，然后去我的页面中拿到名称和头像
                        key: 'user',
                        data: geren,
                        success:function(res){
                          console.log(res)
                        }
                      })
                      getApp().globalData.showDialog = fenx;
                      wx.switchTab({
                        url: '/pages/index/index',
                      })
                    }
                  });
                }else{
                  network.request({ //接口发送信息
                    url: UerUrl + 'api/User/AutoLogin',
                    data: {
                      code: res.code,
                      share: share,
                      info: JSON.stringify({
                        nick: e.userInfo.nickName,
                        avatar: e.userInfo.avatarUrl,
                        sex: e.userInfo.gender,
                        longitude: opo.longitude,
                        latitude: opo.latitude
                      }),
                    },
                    success: function (res) {
                      console.log(share)
                      var roo = JSON.parse(res.data).data;
                      var fenx = JSON.parse(res.data).data.openid;
                      getApp().globalData.user = res.data;
                      getApp().globalData.role = roo.role;
                      wx.setStorage({//保存个人消息在本地，然后去我的页面中拿到名称和头像
                        key: 'user',
                        data: res.data,
                      })
                      getApp().globalData.showDialog = fenx;
                      wx.switchTab({
                        url: '/pages/index/index',
                      })
                    }
                  })
                }
              },
            })
          },
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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
  onShareAppMessage: function() {

  }
})