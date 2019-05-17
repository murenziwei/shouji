var UerUrl = getApp().data.UerUrl;
var shop = getApp().data.shop;
var icom = getApp().data.icom;
var app = getApp();
var network = require("../../../utils/network.js"); //接口封装
var g_againLogin = require("../../../utils/AgainLogin.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    countries: [],
    countryIndex: 0,
    // userInputCardNo: '',
    cardlen: 0,
    files: [],
    files1: [],
    xiaoshi: 0,
    // sfz: '',
    xingming: '',
    phone: '',
    // weixin: '',
    dianpu: '',
    weizhi: '',
    neir: [],
    kefudh: '',
    latitude: '000',
    longitude: '000',
    zhuying: '',
    role: '',
    shop_type:'',
    kais:1,
    yeas:0,
    sheng:'',
    shi:'',
    qu:''
  },
  tioaji: function(res) {
    var that = this;
    var xingming = this.data.xingming //姓名
    var phone = (/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/); //手机号码正则
    var shouji = this.data.phone; //手机号码
    var dianpu = this.data.dianpu; //店铺名字
    console.log(this.data.countries)
    console.log(this.data.countryIndex)
    var countryIndex = this.data.countries[this.data.countryIndex].id; //主营产品ID
    var weizhi = this.data.weizhi //详细地址
    var files = this.data.files; //店铺照片
    var files1 = this.data.files1; //店铺头像
    var that = this;
    var kefudh = this.data.kefudh;
    var region = this.data.region;
    var longitude = this.data.longitude;
    var latitude = this.data.latitude;
    var zhuying = this.data.zhuying
    if (xingming == "") {
      wx.showToast({
        title: '姓名不能为空',
        duration: 2000,
        icon: 'none'
      });
    } else {
      if (!phone.test(shouji)) {
        wx.showToast({
          title: '手机号码错误',
          duration: 2000,
          icon: 'none'
        });
      } else {
        if (dianpu == "") {
          wx.showToast({
            title: '请输入店铺名称',
            duration: 2000,
            icon: 'none'
          });
        } else {
          wx.uploadFile({
            url: icom + 'api/Image/upload_file',
            filePath: files1[0],
            name: 'comment_images',
            formData: {
            file_token:getApp().data.file_token
          },
            success: function(opo) {
              var tou = JSON.parse(opo.data).url;
              var xx = []
              for (var i = 0; i < files.length; i++) {
                xx = xx.concat(files[i])
              };
              wx.getStorage({ //从本地拿到储存了的用户信息
                key: 'user',
                success: function(res) {
                  var user = res.data;
                  network.Post({
                    url: UerUrl + 'api/User/ModifyShop',
                    data: {
                      token: user.token,
                      openid: user.openid,
                      info: JSON.stringify({
                        shop_type: countryIndex,
                        shop_name: dianpu,
                        shop_avatar: tou,
                        shop_images: xx,
                        contact_name: xingming,
                        contact_mobile: shouji,
                        service_mobile: kefudh,
                        addr_sheng:that.data.sheng,
                        addr_shi:that.data.shi,
                        addr_qu:that.data.qu,
                        addr_info: {
                          addr_sheng: region[0],
                          addr_shi: region[1],
                          addr_qu: region[2],
                          addr_attach: weizhi,
                        },
                        shop_longitude: longitude,
                        shop_latitude: latitude
                      })
                    },
                    success: function(res) {
                      if (1101 != JSON.parse(res.data).status) {//修改token
                        var token = JSON.parse(res.data).token;
                        var userInfo = wx.getStorageSync('user');
                        userInfo.token = token;
                        wx.setStorageSync('user', userInfo);
                      }
                      if (JSON.parse(res.data).status == 0){
                        wx.showToast({
                          title: '提交成功',
                          icon: 'succes',
                          duration: 1000,
                          mask: true
                        })
                      }else{
                        wx.showToast({
                          title: JSON.parse(res.data).erro,
                          icon: 'none',
                          duration: 1000,
                          mask: true
                        })
                      }
                    }
                  })
                }
              })
            },
            fail: function(opp) {
              wx.getStorage({ //从本地拿到储存了的用户信息
                key: 'user',
                success: function(res) {
                  var user = res.data;
                  network.Post({
                    url: UerUrl + 'api/User/ModifyShop',
                    data: {
                      token: user.token,
                      openid: user.openid,
                      info: JSON.stringify({
                        shop_type: countryIndex,
                        shop_name: dianpu,
                        shop_avatar: files1,
                        shop_images: files,
                        contact_name: xingming,
                        contact_mobile: shouji,
                        service_mobile: kefudh,
                        addr_sheng:that.data.sheng,
                        addr_shi:that.data.shi,
                        addr_qu:that.data.qu,
                        addr_info: {
                          addr_sheng: region[0],
                          addr_shi: region[1],
                          addr_qu: region[2],
                          addr_attach: weizhi,
                        },
                        shop_longitude: longitude,
                        shop_latitude: latitude
                      })
                    },
                    success: function(res) {
                      if (JSON.parse(res.data).status !== 1101){
                        var userInfo = wx.getStorageSync('user');
                        userInfo.token = JSON.parse(res.data).token;
                        wx.setStorageSync('user', userInfo);
                      }
                      if(JSON.parse(res.data).status == 0){
                        wx.showToast({
                          title: '提交成功',
                          icon: 'succes',
                          duration: 1000,
                          mask: true
                        })
                      } else if (JSON.parse(res.data).status == 3){
                        g_againLogin.AutoLogin({
                          url: UerUrl + 'api/User/ModifyShop',
                          data: {
                            openid: wx.getStorageSync('user').openid,
                            token: '',
                            info: JSON.stringify({
                              shop_type: countryIndex,
                              shop_name: dianpu,
                              shop_avatar: files1,
                              shop_images: files,
                              contact_name: xingming,
                              contact_mobile: shouji,
                              service_mobile: kefudh,
                              addr_sheng: that.data.sheng,
                              addr_shi: that.data.shi,
                              addr_qu: that.data.qu,
                              addr_info: {
                                addr_sheng: region[0],
                                addr_shi: region[1],
                                addr_qu: region[2],
                                addr_attach: weizhi,
                              },
                              shop_longitude: longitude,
                              shop_latitude: latitude
                            })
                          },
                          success: function (res) {  //返回数据处理
                            wx.showToast({
                              title: '提交成功',
                              icon: 'succes',
                              duration: 1000,
                              mask: true
                            })
                          },
                          fail: function (res) {
                            g_app.ShowError(res, 3000);
                          },
                        });
                      }
                    }
                  })
                }
              })
            }
          })
        }
      }
    }
  },
  
  weixin: function(res) {
    this.setData({
      weixin: res.detail.value
    })
  },
  dianpu: function(res) {
    this.setData({
      dianpu: res.detail.value
    })
  },
  yhk: function(res) {
    var card = res.detail.value;
    var len = card.length;
    if (len > this.data.cardlen) {
      if ((len + 1) % 5 == 0) {
        card = card + " "
      } else {
        card = card.replace(/(^\s*)|(\s*$)/g, "")
      };
    }
    this.setData({
      userInputCardNo: card
    })
    //将每次用户输入的卡号长度赋予到长度中转站
    this.setData({
      cardlen: len
    })
  },
  xingming: function(res) {
    this.setData({
      xingming: res.detail.value
    })
  },
  kefu: function(res) {
    this.setData({
      kefudh: res.detail.value
    })
  },
  phone: function(res) {
    this.setData({
      phone: res.detail.value
    })
  },
  sfz: function(res) {
    this.setData({
      sfz: res.detail.value
    })
  },
  map: function() {
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        that.setData({
          weizhi: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
    })
  },
  chooseImage: function(e) {
    var files = this.data.files;
    var index = e.currentTarget.dataset.index;
    var that = this;
    wx.chooseImage({
      sizeType:['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType:['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        if (res.tempFilePaths.length >= 4) {
          wx.showToast({
            title: '只能上传三张图片',
            count: 4,
            icon: 'none'
          })
        } else {
          for (var i = 0; i < res.tempFilePaths.length;i++){
            wx.uploadFile({
              url: icom + 'api/Image/upload_file',
              filePath: res.tempFilePaths[i],
              name: 'comment_images',
              header: {
                "Content-Type": "multipart/form-data"
              },
              formData: {
                file_token:getApp().data.file_token
               },
              success: function (res) {
                var xx = [];
                var found = JSON.parse(res.data).url;
                xx = xx.concat(found)
                that.setData({
                  files: xx
                })
              },
              fail: function (res) {
              }
            })
          }
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          // that.setData({
          //   files: that.data.files.splice(index, 1),
          //   files: that.data.files.concat(res.tempFilePaths)
          // });
        }
      }
    })
  },
  chooseImage1: function(e) {
    var files1 = [this.data.files1];
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        if (files1.length >= 2) {
          wx.showToast({
            title: '只能上传1张图片',
            count: 2,
            icon: 'none'
          })
        } else {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
            files1: res.tempFilePaths,
            xiaoshi: 1
          });
        }
      }
    })
  },
  previewImage1: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files1 // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var role = getApp().globalData.role;
    this.setData({
      role: role,
      status:options.status
    })
    var that = this;
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function(res) {
        var user = res.data;
        network.Post({
          url: UerUrl + 'api/User/UserShop',
          data: {
            token: user.token,
            openid: user.openid,
          },
          success: function(res) {
            if (1101 != JSON.parse(res.data).status) {//修改token
              var token = JSON.parse(res.data).token;
              var userInfo = wx.getStorageSync('user');
              userInfo.token = token;
              wx.setStorageSync('user', userInfo);
            }
            var zhuan = JSON.parse(res.data).data;
            var diqu = JSON.parse(zhuan.addr_info);
            that.setData({
              xingming: zhuan.contact_name,
              phone: zhuan.contact_mobile,
              dianpu: zhuan.shop_name,
              region: [diqu.addr_sheng, diqu.addr_shi, diqu.addr_qu],
              weizhi: diqu.addr_attach,
              // countryIndex: zhuan.shop_type,
              kefudh: zhuan.service_mobile,
              files1: zhuan.shop_avatar,
              files: JSON.parse(zhuan.shop_images),
              shop_type: zhuan.shop_type
            })
            network.Post({
              url: shop + 'api/Shop/AllType',
              data: {},
              success: function (res) {
                var shop = JSON.parse(res.data).data;
                for(var i=0;i<shop.length;i++){
                  if (shop[i].id == zhuan.shop_type){
                    that.setData({
                      moren: shop[i]
                    })
                  }
                }
                that.setData({
                  countries: shop
                })
              }
            })
          }
        })
      }
    })
    network.Post({
      url: shop + 'api/Area/AllArea',
      data: {},
      success: function (res) {
        var shop = JSON.parse(res.data).data;
        that.setData({
          choice: shop,
          eciohc: shop[0].child_city,
          iceohc: shop[0].child_city[0].child_city,
          sheng:shop[0].id,
          shi:shop[0].child_city[0].id,
          qu:shop[0].child_city[0].child_city.id
        })
      }
    })
  },
  bindCountryChange: function(e) {
    var countries = this.data.countries
    this.setData({
      kais:0,
      countryIndex: e.detail.value,
      countries: countries
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
  bindChange: function (e) {
    var that = this;
    var choice = this.data.choice;
    network.Post({
      url: shop + 'api/Area/AllArea',
      data: {},
      success: function (res) {
        var shop = JSON.parse(res.data).data;
        if (shop[e.detail.value[0]].child_city[e.detail.value[1]].child_city.length !== 0){
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
        }else{
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
  dianji:function(res){
    this.setData({
      yeas:1
    })
  },
  zhedan:function(res){
    this.setData({
      yeas:0
    })
  }
})