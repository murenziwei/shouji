// pages/components/Shopkeeper/Shopkeeper.js
var UerUrl = getApp().data.UerUrl;
var icom = getApp().data.icom;
var network = require("../../../utils/network.js"); //接口封装
var shop = getApp().data.shop;
var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fail:{},
    region: [],
    customItem: '全部',
    countries: [],
    countryIndex: 0,
    cardlen: 0,
    files: [],
    files1: [],
    xiaoshi: 0,
    xingming: '',
    phone: '',
    dianpu: '',
    weizhi: '',
    neir:[],
    kefudh:'',
    latitude:'',
    longitude:'',
    zhuying:'',
    yeas: 0,
    shop_name:'',
    sheng:'',
    shi:'',
    qu:'',
    is_back:0,
    ishadden:false
    // district: '选择省、市、区/县'
  },

  go_status() {
    var that = this;
    wx.getStorage({
      key: 'login',
      success: function (stor) {
        console.log(stor, '我靠');
        var data = {};
        data.openid = stor.data.openid;
        data.token = stor.data.token;
        data.info = JSON.stringify({});
        console.log(data, "data");

        network.Post({
          url: UerUrl + 'api/User/ApplyShop',
          data: data,
          success: function (res) {
            var r = JSON.parse(res.data);
            if (res.statusCode == 200) {

              console.log(r, '状态2323');
              var s = r.status;
              if (s==100||s==1000||s==10000) {that.setData({ishadden:true}) }
              if (s == 100) {
                wx.reLaunch({
                  url:'/pages/audit/audit?tar=0'
                });
              }else if(s==1000){
                wx.reLaunch({
                  url: '/pages/audit/audit?tar=1'
                });
              }else if(s==10000){
                wx.reLaunch({
                  url: '/pages/audit/audit?tar=2'
                });
              }
              
            } else {
              app.ShowError('店长注册失败', 4000);
            }
          }
        });
      },
    })

  },
  tioaji: function(res) {

    
    var xingming = this.data.xingming //姓名
    var phone = (/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/); //手机号码正则
    var shouji = this.data.phone; //手机号码
    var dianpu = this.data.dianpu; //店铺名字
    var countries = this.data.countries; //主营产品数组
    var countryIndex = this.data.countryIndex; //主营产品下标
    var weizhi = this.data.weizhi //详细地址
    var files = this.data.files; //店铺照片
    var that = this;
    var kefudh = this.data.kefudh;
    var region = this.data.region;
    // var district = this.data.district
    var longitude = this.data.longitude;
    var latitude = this.data.latitude;
    var zhuying = this.data.shop_name
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
            
          wx.showLoading({
            title: '加载中···',
          })
          var xx = []
          for (var i = 0; i < files.length; i++) {
            xx = xx.concat(files[i])
          };
          wx.getStorage({ //从本地拿到储存了的用户信息
            key: 'user',
            success: function (res) {
              var user = res.data;
              network.Post({
                url: UerUrl + 'api/User/ApplyShop',
                data: {
                  token: user.token,
                  openid: user.openid,
                  info: JSON.stringify({
                    shop_type: zhuying,
                    shop_name: dianpu,
                    shop_images: xx,
                    shop_avatar:xx[0]||'',
                    contact_name: xingming,
                    contact_mobile: shouji,
                    addr_sheng: that.data.sheng,
                    addr_shi: that.data.shi,
                    addr_qu: that.data.qu,
                    service_mobile:"13825000114",
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
                success: function (res) {
                  var r = JSON.parse(res.data);
                  console.log(r, '反生');
                  if (r.status == 0) {

                    wx.showToast({
                      title: '申请成功',
                      icon: 'success',
                      duration: 4000,
                      success: function (res) {
                        wx.reLaunch({
                          url: '/pages/audit/audit?tar=0'
                        });
                      }
                    })
                  }
                },
                complete() {
                  wx.hideLoading();
                }
              })
            },
            complete() {
              wx.hideLoading();
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
  kefu:function(res){
    this.setData({
      kefudh:res.detail.value
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
          latitude:res.latitude,
          longitude:res.longitude
        })
      },
    })
  },
  chooseImage: function (e) {
    
    var files = this.data.files;
    var index = e.currentTarget.dataset.index;
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        if (res.tempFilePaths.length >= 4) {
          wx.showToast({
            title: '只能上传三张图片',
            count: 4,
            icon: 'none'
          })
        } else {
          
          console.log(icom + 'api/Image/upload_file');
          
          for (var i = 0; i < res.tempFilePaths.length; i++) {
            wx.showLoading({title:'加载中'});
            wx.uploadFile({
              url: icom + 'api/Image/upload_file',
              filePath: res.tempFilePaths[i],
              formData: {
                file_token:getApp().data.file_token
              },
              name: 'comment_images',
              header: {
                "Content-Type": "multipart/form-data"
              },
              success: function (res) {
                console.log(res,"有？");
                if (res.statusCode===200){

                  var xx = [];
                  var found = JSON.parse(res.data).url;
                  xx = xx.concat(found)
                  that.setData({
                    files: xx
                  })
                }else{
                  wx.showToast({ title: res.data, icon: 'none' });
                }
              },
              fail: function (res) {
                console.log(res,"啥");
                wx.showToast({title:res.errMsg,icon:'none'});
              },
              complete(){
                wx.hideLoading();
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
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  chooseImage1: function(e) {
    var files1 = this.data.files1;
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
    console.log(options,"options");
    var that = this;
    network.Post({
      url: shop + 'api/Area/AllArea',
      success: function (res) {
        var shop = JSON.parse(res.data).data;
        that.setData({
          choice: shop,
          eciohc: shop[0].child_city,
          iceohc: shop[0].child_city[0].child_city,
        })
      }
    })
    network.Post({
      url: shop + 'api/Shop/AllType',
      success: function (res) {
        var shop = JSON.parse(res.data).data;
        console.log(shop)
        that.setData({
          countries:shop,
          shop_name: shop[0].id,

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
  siteFn: function(e) {
    this.setData({
      region: e.detail.value
    })
  },
  bindCountryChange: function (e) {
    var countries = this.data.countries;
    console.log(countries[e.detail.value].type_name)
    this.setData({
      kais: 0,
      countryIndex: e.detail.value,
      countries: countries,
      shop_name: countries[e.detail.value].id
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
    this.go_status();
  },

  //选择省市区
  bindRegionChange: function (e) {

    var that = this
    that.setData({
      province: e.detail.value[0],
      city: e.detail.value[1],
      zone: e.detail.value[2],
      district: e.detail.value[0] + ' ' + e.detail.value[1] + ' ' + e.detail.value[2]
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
  
  dianji: function (res) {
    this.setData({
      yeas: 1
    })
  },
  zhedan: function (res) {
    this.setData({
      yeas: 0
    })
  }
})