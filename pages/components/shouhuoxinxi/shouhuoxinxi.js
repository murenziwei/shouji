// pages/components/shouhuoxinxi/shouhuoxinxi.js
var address = getApp().data.address;
var network = require("../../../utils/network.js");//接口封装
var shop = getApp().data.shop;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部',
    name: '',
    phone: '',
    xiangxi: '',
    id:'',
    yeas:0
  },
  dianji: function (res) {
    this.setData({
      yeas: 1
    })
  },
  zhedan: function (res) {
    this.setData({
      yeas: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if(options.id == undefined){
    }else{
      this.setData({
        name: options.name,
        phone: options.phone,
        region: [options.sheng, options.shi, options.qu],
        xiangxi: options.xx,
        id: options.id
      })
    }
    network.Post({
      url: shop + 'api/Area/AllArea',
      data: {},
      success: function (res) {
        var shop = JSON.parse(res.data).data;
        that.setData({
          choice: shop,
          eciohc: shop[0].child_city,
          iceohc: shop[0].child_city[0].child_city,
          sheng: shop[0].id,
          shi: shop[0].child_city[0].id,
          qu: shop[0].child_city[0].child_city.id
        })
      }
    })
  },
  bindChange: function (e) {
    var that = this;
    var choice = this.data.choice;
    network.Post({
      url: shop + 'api/Area/AllArea',
      data: {},
      success: function (res) {
        var shop = JSON.parse(res.data).data;

        if (shop[e.detail.value[0]].child_city[e.detail.value[1]].child_city.length !== 0) {
          that.setData({
            eciohc: shop[e.detail.value[0]].child_city,
            iceohc: shop[e.detail.value[0]].child_city[e.detail.value[1]].child_city,
            region: [
              shop[e.detail.value[0]].chinese_name,
              shop[e.detail.value[0]].child_city[e.detail.value[1]].chinese_name,
              shop[e.detail.value[0]].child_city[e.detail.value[1]].child_city[e.detail.value[2]].chinese_name
            ],
            sheng: shop[e.detail.value[0]].id,
            shi: shop[e.detail.value[0]].child_city[e.detail.value[1]].id,
            qu: shop[e.detail.value[0]].child_city[e.detail.value[1]].child_city[e.detail.value[2]].id
          })
        } else {
          that.setData({
            eciohc: shop[e.detail.value[0]].child_city,
            iceohc: shop[e.detail.value[0]].child_city[e.detail.value[1]].child_city,
            region: [
              shop[e.detail.value[0]].chinese_name,
              shop[e.detail.value[0]].child_city[e.detail.value[1]].chinese_name,
              ''
            ]
          })
        }
      }
    })
    this.setData({
      index: e.detail.value[0]
    })
  },
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value,
    })
  },
  name: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  phone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  xiangx: function(e) {
    this.setData({
      xiangxi: e.detail.value
    })
  },
  baochun: function() {
    var str = '' + this.data.phone;
    if (this.data.name == '') {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none',
        duration: 1500,
        mask: true
      })
      return false;
    }
    if (this.data.phone == '') {
      wx.showToast({
        title: '请输入收货人电话号码',
        icon: 'none',
        duration: 1500,
        mask: true
      })
      return false;
    }
    if (str.length != 11) {
      wx.showToast({
        title: '请输入11位手机号！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (this.data.xiangxi == '') {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 1500,
        mask: true
      })
      return false;
    }
    var name = this.data.name;
    var phone = this.data.phone;
    var addr_sheng = this.data.region[0];
    var addr_city = this.data.region[1];
    var addr_qu = this.data.region[2];
    var addr_attach = this.data.xiangxi;
    var id = this.data.id
    if(id == ''){
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 3000,
        success: function() {
          var _this = this;
          wx.getStorage({ //从本地拿到储存了的用户信息
            key: 'user',
            success: function(res) {
              var user = res.data
              network.Post({
                url: address + 'api/Addr/AddAddr',
                method: "POST",
                dataType: 'JSON',
                header: {
                  "content-type": 'application/x-www-form-urlencoded'
                },
                data: {
                  token: user.token,
                  openid: user.openid,
                  info: JSON.stringify({
                    addr_name: name,
                    addr_mobile: phone,
                    addr_sheng: addr_sheng,
                    addr_city: addr_city,
                    addr_qu: addr_qu,
                    addr_attach: addr_attach,
                    default_addr: 0
                  })
                },
                success: function(res) {
                  var id = JSON.parse(res.data).data
                  var xingzeng = {
                    id:id,
                    addr_name: name,
                    addr_mobile: phone,
                    addr_sheng: addr_sheng,
                    addr_city: addr_city,
                    addr_qu: addr_qu,
                    addr_attach: addr_attach,
                    default_addr: 0
                  }
                  getApp().globalData.shuliang[0].push(xingzeng)
                  setTimeout(function() {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1000)
                }
              })
            },
          })

        }
      })
    }else{
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 3000,
        success: function () {
          var _this = this;
          wx.getStorage({ //从本地拿到储存了的用户信息
            key: 'user',
            success: function (res) {
              var user = res.data
              network.Post({
                url: address + 'api/Addr/ModifyAddr',
                data: {
                  token: user.token,
                  openid: user.openid,
                  id:id,
                  info: JSON.stringify({
                    addr_name: name,
                    addr_mobile: phone,
                    addr_sheng: addr_sheng,
                    addr_city: addr_city,
                    addr_qu: addr_qu,
                    addr_attach: addr_attach,
                    default_addr: 0
                  })
                },
                success: function (res) {
                  if (1101 != JSON.parse(res.data).status) {
                    var token = JSON.parse(res.data).token;
                    var userInfo = wx.getStorageSync('user');
                    userInfo.token = token;
                    wx.setStorageSync('user', userInfo);
                  }
                  var id = JSON.parse(res.data).data
                  var xingzeng = {
                    id: id,
                    addr_name: name,
                    addr_mobile: phone,
                    addr_sheng: addr_sheng,
                    addr_city: addr_city,
                    addr_qu: addr_qu,
                    addr_attach: addr_attach,
                    default_addr: 0
                  }
                  var huanc = getApp().globalData.shuliang[0]
                  getApp().globalData.shuliang[0].push(xingzeng)
                  huanc.splice(id, 1);
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1000)
                }
              })
            },
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

  }

  /**
   * 用户点击右上角分享
   */
})