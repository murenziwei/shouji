var Order = getApp().data.Order;
var pay = getApp().data.pay;
var network = require("../../../utils/network.js"); //接口封装
var g_againLogin = require("../../../utils/AgainLogin.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yhk: 0,
    userInputCardNo2: '',
    userInputCardNo:'',
    //长度中转站
    cardlen: 0,
    jinge: '',
    fs: 1,
    limit_money:3000
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var that = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function(res) {
        var user = res.data;
        network.Post({
          url: Order + 'api/Receipt/UserReceipt',
          data: {
            token: user.token,
            openid: user.openid
          },
          success: function(res) {
            
            var shuju = JSON.parse(res.data);
           
            that.setData({
              userInputCardNo: shuju.data.bank_code,
              wechat_code: shuju.data.bank_code,
              total_numble: options.total_numble,
              limit_money: shuju.withDraw.postal_limit
            })
            console.log(that.data.total_numble)
          }
        })
      }
    })
  },
  //用户输入的金额
  tixian: function(res) {
    this.setData({
      jinge: res.detail.value
    })
  },
  //用户输入微信账号
  wechat:function(e){

    this.setData({
      wechat_code: e.detail.value
    })
  },
  tijiao: function(res) {
    var that = this;
    var fs = this.data.fs;
    var jinge = this.data.jinge;
    var pay_status = this.data.yhk?2:1;
    console.log(this.data.yhk,"????");
    var userInputCardNo = this.data.yhk ?this.data.userInputCardNo:this.data.wechat_code;
    var limit_money = this.data.limit_money
    var total_n = this.data.total_numble
    console.log(userInputCardNo)
    if (userInputCardNo == ''){
      wx.showToast({
        title: '请填写账号信息',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (jinge > total_n) {
      wx.showToast({
        title: '金额不能大于' + total_n +'元',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.getStorage({ //从本地拿到储存了的用户信息
        key: 'user',
        success: function(res) {
          var user = res.data;
          network.Post({
            url: Order + 'api/User/ApplyWith',
            data: {
              token: user.token,
              openid: user.openid,
              number: userInputCardNo,
              money: jinge,
              pay_status
            },
            success: function(res) {
              // if (1101 != JSON.parse(res.data).status) {//修改token
              //   var token = JSON.parse(res.data).token;
              //   var userInfo = wx.getStorageSync('user');
              //   userInfo.token = token;
              //   wx.setStorageSync('user', userInfo);
              // }
              if(JSON.parse(res.data).status == 1){
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function(){
                  wx.navigateTo({
                    url:'/pages/components/historymoney/historymoney'
                  })
                },2000)
              } else if (JSON.parse(res.data).status == 0){

                wx.showToast({
                  title: JSON.parse(res.data).msg,
                  icon: 'none',
                  duration: 2000
                })
              }else{
                wx.showToast({
                  title: JSON.parse(res.data).error,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }
      })
    }
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
  
  gaib: function(res) {
    this.setData({
      yhk: 1,
      fs: res.currentTarget.dataset.id
    })
  },
  gaib1: function(res) {
    this.setData({
      yhk: 0,
      fs: res.currentTarget.dataset.id
    })
  },
  bacnag: function(e) {
    var card = e.detail.value;
    var len = card.length
    //判断用户是输入还是回删
    if (len > this.data.cardlen) {
      //用户输入
      if ((len + 1) % 5 == 0) {
        card = card + ' '
      }
    } else {
      //用户回删
      card = card.replace(/(^\s*)|(\s*$)/g, "")
    }
    //将处理后的值赋予到输入框
    this.setData({
      userInputCardNo: card
    })
    //将每次用户输入的卡号长度赋予到长度中转站
    this.setData({
      cardlen: len
    })
  }
})