// pages/otherphone/otherphone.js
var g_autoLogin = require("../../utils/AutoLogin.js");
var network = require("../../utils/network.js"); //接口封装
var Order = getApp().data.Order;
var g_app = getApp();
var UerUrl = getApp().data.UerUrl;
var shopUrl = getApp().data.shop;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classlist: null,
    list: null,
    seletindex: 0,
    page: 1,
    // islogin:true
    islogin: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.share) {
      wx.setStorageSync('share', options.share);
    }
    if (!wx.getStorageSync('user')) {

      // wx.hideTabBar({
      //   animation: true
      // })
      this.setData({
        islogin: false
      })
    }
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

    if (!wx.getStorageSync('user')) {

      // wx.hideTabBar({
      //   animation: true
      // })
      this.setData({
        islogin: false
      })
    }
    // if (!wx.getStorageSync('userlogin')) {
    //   this.setData({
    //     islogin: false
    //   })
    // }
    // if (!wx.getStorageSync('user')) {

    //   wx.showModal({
    //     title: '定制管家提示',
    //     content: '登录后才能定制哦，动动手指吧',
    //     showCancel: false,
    //     confirmColor: "#ff6122",
    //     confirmText: "去登陆",
    //     success() {
    //       wx.switchTab({
    //         url: '../components/user/user'
    //       })
    //     }
    //   });


    // }



    let self = this;
    wx.request({
      url: shopUrl + 'Api/Categroy/getAllType',
      data: {
        "openid": "111111111",
        "page": self.data.page
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'post',
      success: function (res) {
        console.log(res.data);
        let data = res.data;
        self.setData({
          classlist: data.AllBrand.data,
          list: data.OneList.data
        });
      }
    })

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

    wx.showLoading({
      title: '加载中..',
    })
    // 上拉加载数据
    this.data.page++;
    let self = this;
    let classlist = this.data.classlist[self.data.seletindex].id
    wx.request({
      url: shopUrl + 'Api/Categroy/getOneType',
      data: {
        "openid": "111111111",
        "cate_id": classlist,
        "page": self.data.page
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'post',
      success: function (res) {

        let list = self.data.list;
        let newlist = list.concat(res.data.AllList.data);
        console.log(newlist);
        self.setData({
          list: newlist,
        });
        wx.hideLoading();
      }
    })


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
  },
  onGetCoinSuccess: function (res) {
    console.log(res)
    var that = this;
    var ret = JSON.parse(res.data);
    if (0 == ret.status) {
      var coin = Number(ret.data.total_numble) - (Number(ret.data.pay_past) + Number(ret.data.pay_wait) + Number(ret.data.postal_past) + Number(ret.data.postal_wait));
      that.setData({
        p_userCoin: coin.toFixed(4),
        total_numble: ret.data.total_numble,
        pay_past: ret.data.pay_past,
        pay_wait: ret.data.pay_wait,
      });
    } else {
      g_app.ShowError("错误码[" + ret.status + "]:" + ret.error, 5000);
    }

    //更新新token
    if (1101 != ret.status) {
      var userInfo = wx.getStorageSync('user');
      userInfo.token = ret.token;
      that.data.p_userInfo = userInfo;
      wx.setStorageSync('user', userInfo);
    }
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
    wx.showTabBar({
      animation: true,
    })
  },




  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    var openid = wx.getStorageSync('user').openid;
    console.log(openid)
    return {
      title: '分享获得会员币',
      desc: '分享给好友',
      path: '/pages/otherphone/otherphone?share=' + openid
    }

  },

  // 选择图片时操作
  imagesbtn1: function (event) {

    let image = event.currentTarget.dataset.images;
    let pages = getCurrentPages();

    if (pages.length == 1) {

      wx.showLoading({
        title: '加载中...',
      })
      wx.navigateTo({
        url: '/pages/dingzhi/dingzhi?image=' + image,
        success() {
          wx.hideLoading();
        }
      })

    } else {

      let self = pages[1];
      let list = self.data.list;
      let pageself = this;

      wx.getImageInfo({
        src: image,
        success(res) {
          //处理图片比例高度
          let height = Number.parseFloat((res.height / res.width) * 300).toFixed(0);

          pageself.definition(res.width);

          if (list.length == 0) {

            let option = {
              scale: 1.4,
              rotate: 0,
              left: 222,
              top: 154,
              image: image,
              imageheight: height,
              types: "img"
            }

            list.push(option);

          } else {
            let count = false; //是否存在图片
            for (let i = 0; i < list.length; i++) { //查看有没有存在一个图片
              if (list[i].types == "img") { //存在一张
                count = true;
                list[i].image = image;
                list[i].imageheight = height;
              }
            }

            if (!count) {
              let option = {
                scale: 1.4,
                rotate: 0,
                left: 222,
                top: 154,
                image: image,
                imageheight: height,
                types: "img"
              }
              list.push(option);
            }

          }

          self.setData({
            list: list,

          });

          wx.showLoading({
            title: '加载中..',
          })

          setTimeout(res => {
            wx.hideLoading();
            wx.navigateBack({
              delta: 1,
            })
          }, 2000)

        }

      });


    }






  },
  // 选择图片时操作
  imagesbtn: function (event) {

    let image = event.currentTarget.dataset.images;
    let pages = getCurrentPages();

    if (pages.length == 1) {

      wx.showLoading({
        title: '加载中...',
      })
      wx.navigateTo({
        url: '../customization/customization?image=' + image,
        success() {
          wx.hideLoading();
        }
      })

    } else {

      let self = pages[1];
      let list = self.data.list;
      let pageself = this;

      wx.getImageInfo({
        src: image,
        success(res) {
          //处理图片比例高度
          let height = Number.parseFloat((res.height / res.width) * 300).toFixed(0);

          pageself.definition(res.width);

          if (list.length == 0) {

            let option = {
              scale: 1.4,
              rotate: 0,
              left: 222,
              top: 154,
              image: image,
              imageheight: height,
              types: "img"
            }

            list.push(option);

          } else {
            let count = false; //是否存在图片
            for (let i = 0; i < list.length; i++) { //查看有没有存在一个图片
              if (list[i].types == "img") { //存在一张
                count = true;
                list[i].image = image;
                list[i].imageheight = height;
              }
            }

            if (!count) {
              let option = {
                scale: 1.4,
                rotate: 0,
                left: 222,
                top: 154,
                image: image,
                imageheight: height,
                types: "img"
              }
              list.push(option);
            }

          }

          self.setData({
            list: list,

          });

          wx.showLoading({
            title: '加载中..',
          })

          setTimeout(res => {
            wx.hideLoading();
            wx.navigateBack({
              delta: 1,
            })
          }, 2000)

        }

      });


    }






  },
  //更新列表 
  selctbtn: function (event) {
    let id = event.currentTarget.dataset.classid;
    let index = event.currentTarget.dataset.index;
    let self = this;
    wx.showLoading({
      title: '加载中',
    })
    this.data.page = 1;
    console.log(11);
    wx.request({
      url: shopUrl + 'Api/Categroy/getOneType',
      data: {
        "openid": "111111111",
        "cate_id": id,
        "page": 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'post',
      success: function (res) {
        console.log(res.data.AllList.data);
        self.setData({
          list: res.data.AllList.data,
          seletindex: index
        });
        wx.hideLoading();
      }
    })
  },

  definition(width) {

    let pages = getCurrentPages();
    let self = pages[1];
    let star = 1;
    if (width > 375) {
      star = 5;
    } else if (width <= 375 && width > 187) {
      star = 4;
    } else if (width <= 187 && width > 94) {
      star = 3;
    } else {
      star = 2;
    }

    let array = new Array();

    for (let i = 0; i < star; i++) {
      array.push(1);
    }

    self.setData({
      star: array
    })
  },


  // getUserInfo(event){

  //   console.log(event);
  //   let userinfo = event.detail;
  //   if (userinfo.errMsg == "getUserInfo:ok"){

  //     wx.setStorageSync("userlogin", userinfo);
  //     console.log(userinfo);
  //     this.setData({
  //       islogin: true
  //     })
  //   }

  // }
  // 


})


