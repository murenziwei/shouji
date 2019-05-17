const util = require('../../utils/util.js');
const userL = getApp().data.UerUrl;
var g_autoLogin = require("../../utils/AutoLogin.js");
var network = require("../../utils/network.js"); //接口封装



Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shareVal: {
      type: Boolean,
      value: true
    },
    homeVal: {
      type: Boolean,
      value: true
    }
  },
  ready() {
    console.log(this.data.shareVal, "shareVal");
    this.setData({
      ctx: wx.createCanvasContext('canvas' + 0, this)
    })

    // this.drawImgInit();
  },
  attached() {
    
  },
  /**
   * 组件的初始数据
   */
  data: {
    showCover: false,
    xindex: 0,
    img: [],
    canvasData: {
    },
    drawList: [],
    drawData: [],
    brr: [],
    mytx: '',
    myerweima: '',
    ctx: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    shareFn(e){
      console.log(e,"分享");
    },
    lianj(e) {

      wx.previewImage({
        current: e.target.dataset.src,
        urls: this.data.img.map(a => { return a.banner_image; })
      })
    },
    toSaveImage() {
      this.saveImage()

    },
    detailencode(e){
      var sr=e.target.dataset.src;
      wx.previewImage({
        current:sr,
        urls: [sr]
      })
    },
    showShare() {
      
      var that = this;
      if (wx.getStorageSync('user')) {
        wx.showLoading({
          title: '加载中···',
          mask:true
        })
        if(wx.getStorageSync('img')){
          wx.hideLoading();
          that.setData({
            img: wx.getStorageSync('img')
          })

          wx.hideTabBar({

          });
          that.setData({
            showCover: true,
            xindex: 0
          })
          that.triggerEvent("myevent");
        }else{
          wx.getStorage({ //从本地拿到储存了的用户信息
            key: 'user',
            success: function (res) {
              var user = res.data
              network.Post({
                url: userL + 'api/wechat/MakeQrcodeNew',
                data: {
                  token: user.token,
                  openid: user.openid
                },
                success: function (res) {
                  wx.hideLoading();

                  wx.hideTabBar({

                  });
                  that.setData({
                    showCover: true,
                    xindex: 0
                  })
                  that.triggerEvent("myevent");
                  console.log(res, "res分类");
                  var d = JSON.parse(res.data), imgData = [];
                  console.log(d);
                  for (var i in d.data) {
                    console.log(i);
                    imgData.push({ banner_image: d.data[i][0] });
                  }
                  console.log(imgData);
                  that.setData({
                    img: imgData
                  })
                  wx.setStorageSync('img', imgData)
                },
                fail: function (res) {
                  wx.hideLoading();
                }
              })
            },
            fail(){
              wx.hideLoading();
            }
          })
        }

        if (wx.getStorageSync('encode')) {
          that.setData({
            encode: wx.getStorageSync('encode')
          })
        } else {
          wx.getStorage({ //从本地拿到储存了的用户信息
            key: 'user',
            success: function (res) {
              var user = res.data
              network.Post({
                url: userL + 'api/Wechat/MakeQrcode',
                data: {
                  token: user.token,
                  openid: user.openid
                },
                success: function (res) {
                 
                  console.log(res, "res分类二维码");
                  var d = JSON.parse(res.data).data;
                  that.setData({
                    encode: d
                  })
                  wx.setStorageSync('encode', d)
                },
                fail: function (res) {
                }
              })
            },
            fail() {
            }
          })
        }
      } else {
        wx.showModal({
          title: '温馨提醒',
          content: '得知你未授权，是否前往我的进行授权',
          success(res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/components/user/user',
              })
            }
          }
        })
      }
    },
    onChange(e) {
      var current = e.detail.current;
      this.setData({
        xindex: current
      });
      
    },
    
    clicks(e) {
      console.log("e", e);

      this.setData({
        showCover: false,
        xindex: 0,
        brr: [],
        mytx: '',
        myerweima: '',
        ctx: null
      });
      wx.showTabBar({

      })
      this.triggerEvent("myevent");
    },
    saveImage() {
      let that = this
      let base64 = that.data.img[that.data.xindex].banner_image;
      // this.setData({
      // img: base64
      // })
      // this.sharePosteCanvas(base64)
      const fs = wx.getFileSystemManager();
      console.log(wx.env.USER_DATA_PATH)
      var times = new Date().getTime();
      fs.writeFile({
        filePath: wx.env.USER_DATA_PATH + '/'+times+'.png',
        data: base64.slice(22),
        encoding: 'base64',
        success: res => {
          wx.saveImageToPhotosAlbum({
            filePath: wx.env.USER_DATA_PATH + '/' + times+'.png',
            success: function (res) {
              wx.showToast({
                title: '保存成功',
              })
            },
            fail: function (err) {
              console.log(err);
              if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                console.log("当初用户拒绝，再次发起授权")
                wx.showModal({
                  title: '是否授权相册',
                  content: '需要获取您的相册授权，请确认授权，否则图片无法保存',
                  success: function (tip) {
                    if (tip.confirm) {
                      wx.openSetting({
                        success: function (data) {
                          if (data.authSetting["scope.writePhotosAlbum"] === true) {
                            wx.showToast({
                              title: '授权成功',
                              icon: 'success',
                              duration: 1000
                            })
                            
                          } else {
                            wx.showToast({
                              title: '授权失败',
                              icon: 'success',
                              duration: 1000
                            })
                          }
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }
      });

      // wx.getImageInfo({
      //   src: that.data.img[that.data.xindex].banner_image,
      //   success: function (sres) {
      //     console.log(sres,"你好");
      //     //图片保存到本地
      //     wx.saveImageToPhotosAlbum({
      //       filePath: that.data.img[that.data.xindex].banner_image,
      //       success: function (data) {
      //         wx.showToast({
      //           title: '保存成功',
      //           icon: 'success',
      //           duration: 2000
      //         })
      //       },
      //       fail: function (err) {
      //         console.log(err);
      //         if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
      //           console.log("当初用户拒绝，再次发起授权")
      //           wx.openSetting({
      //             success(settingdata) {
      //               console.log(settingdata)
      //               if (settingdata.authSetting['scope.writePhotosAlbum']) {
      //                 console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
      //               } else {
      //                 console.log('获取权限失败，给出不给权限就无法正常使用的提示')
      //               }
      //             }
      //           })
      //         }
      //       },
      //       complete(res) {
      //         console.log(res);
      //       }
      //     })
      //   }, fail(err) {
      //     console.log(err)
      //   }

      // })
    },

    showModal(obj) {
      wx.showModal({
        title: obj.title,
        content: obj.content,
        // showCancel: showCancel,
        // cancelText: cancelText,
        confirmText: confirmText,
        // confirmColor: color.confirmColor,
        // cancelColor: color.cancelColor,
        success: res => {
          return typeof fn == 'function' && fn(res)
        }
      })
    },

    checkPermission(type, onSuccess, content) {//用户授权检查
      let that = this
      type = 'scope.' + type;

      wx.getSetting({
        success(getRes) {
          const setting = getRes.authSetting;
          console.log(setting, "你好", setting[type]);
          if (setting[type] === false) {

            wx.openSetting({
              success(openRes) {
                if (openRes.authSetting[type] === true) {
                  typeof onSuccess === 'function' && onSuccess();
                }
              }
            });
          } else if (setting[type] === true) {
            //如果已有授权直接执行对应动作
            typeof onSuccess === 'function' && onSuccess();
          } else {
            //如果未授权，直接执行对应动作，会自动查询授权
            typeof onSuccess === 'function' && onSuccess();
          }
        }
      })
    }
  },
  onShareAppMessage: function (res) {
    
    var openid = wx.getStorageSync('user').openid;
    console.log(openid)
    return {
      title: '分享获取',
      desc: '分享给好友',
      path: '/pages/otherphone/otherphone?share=' + openid
    }

  },
})
