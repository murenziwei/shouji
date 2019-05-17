//index.js
//获取应用实例
var detail = getApp().data.detail;
var lunbo = getApp().data.lunbo;
var login = require("../../utils/login.js") //登录接口
var network = require("../../utils/network.js"); //接口封装
const app = getApp()
Page({
  data: {
    v_src:'',
    oneclass:[],
    cCur: 0,
    wWidth: wx.getSystemInfoSync().windowWidth,
    vsstatus: true,
    vsta: true,
    fal: false,
    swiperCurrent: 0,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ddd: false,
    img: [
    ],
    shul: [
      {
        id: '',
        category_image: '/images/icon/remen.png',
        category_name: '热门定制'
      },
      {
        id: '',
        category_image: '/images/icon/yundong.png',
        category_name: '体育运动'
      },
      {
        id: '',
        category_image: '/images/icon/qinglv.png',
        category_name: '情侣专区'
      },
      {
        id: '',
        category_image: '/images/icon/keai.png',
        category_name: '清新可爱'
      }
    ]
  },
  dingzhi(){
    wx.navigateTo({
      url: '/pages/customization/customization'
    });
  },
  xiangq: function (res) {
    var id = res.currentTarget.dataset.id
    wx.navigateTo({
      url: '../components/xiangqing/xiangqing?id=' + id + '&img=' + res.currentTarget.dataset.img,
    })
  },
  cCurfn: function ($e) {
    console.log($e, "e");
    this.setData({
      cCur: $e.detail.current
    });
  },
  nextFn: function ($e) {
    var maxle = this.data.shul.length - 1, cur = this.data.cCur;
    console.log(cur, "cur");
    if (cur < maxle) {
      this.setData({
        cCur: ++cur
      })
    } else {

      this.setData({
        cCur: maxle
      })
    }
  },
  prevFn: function ($e) {
    var minle = 0, cur = this.data.cCur;
    if (cur > minle) {
      this.setData({
        cCur: --cur
      })
    } else {
      this.setData({
        cCur: 0
      })
    }
  },
  controlvideo: function (e) {
    var mv = wx.createVideoContext('myVideo', this);
    console.log(mv, e);
    if (this.data.vsta) {
      mv.play();
    } else {
      mv.pause();
    }

  },
  swiperChange(ev) {
    this.setData({
      swiperCurrent: ev.detail.current
    });
  },
  videopause() {
    this.setData({
      vsta: true
    })
  },
  videoWait(ev) {
    // wx.showLoading({
    //   title: '视频缓冲期',
    // })
    console.log(ev, "ev");
  },
  errimg(ev) {
    var that = this;
    var ind = ev.currentTarget.dataset.idx;
    var rarr = that.data.img;
    rarr[ind].banner_image = "https://dv-igoods.mb.cms.chuangsiboai.com/2019/04/30/3EA7044678106EAA0505C294F69721FD.png";
    that.setData({
      img: rarr
    });

  },
  go_banner() {

    var that = this;
    network.Post({
      url: lunbo + 'api/Banner/AllBanner',
      success: function (res) {
        console.log(res, "res");
        var img = JSON.parse(res.data).data
        that.setData({
          img: img
        })
      }
    })
  },
  go_shul() {
    var that = this;

    network.Post({
      url: detail + 'api/Category/ChildCategory',
      data: {
        parent: 1
      },
      success: function (res) {

        var shangp = JSON.parse(res.data).data;
        console.log(shangp);
        var newarr = [];
        for (var i in shangp) {
          newarr[Math.floor(i / 4)] = newarr[Math.floor(i / 4)] || [];
          newarr[Math.floor(i / 4)].push(shangp[i]);
        }
        console.log(newarr, "newarr");
        that.setData({
          shul: newarr,
          oneclass: shangp
        })
        // that.huan();
      }
    })
  },
  go_video() {
    var that = this;

    network.Post({
      url: detail + 'api/shop/img',
      success: function (res) {
        
        
        if (res.statusCode==200){
          var shangp = JSON.parse(res.data);
          that.setData({
            v_src:shangp
          });
        }
      }
    })
  },
  myevent() {
    
    // this.onLoad();
    this.setData({vsta:!this.data.vsta});
  },
  videoPlay: function (ev) {
    
    this.setData({
      vsta: false
    })
  },
  vodeoEnd: function (ev) {
    
    this.setData({
      vsta: true
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log(this.data.wWidth);
    wx.showLoading({
      title: '加载中···',
    })

    // wx.hideTabBar();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    //轮播
    this.go_banner();
    //菜单
    this.go_shul();

    this.go_video();
  },
  onShow: function () {
  },
  onReady: function () {
    wx.hideLoading();
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
