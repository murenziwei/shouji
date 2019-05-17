var sliderWidth = 35;
var detail = getApp().data.detail;
var network = require("../../../utils/network.js"); //接口封装
var WxParse = require('../../../wxParse/wxParse.js'); //富文本解析;
var g_autoLogin = require("../../../utils/AutoLogin.js");
var g_againLogin = require("../../../utils/AgainLogin.js");
var UerUrl = getApp().data.UerUrl;
var g_app = getApp();
var phone = getApp().data.phone
Page({
  data: {
    shouchang: 101,
    video: 0,
    yeas: 0,
    tabs: ["详情", "评论"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    biaoshi: '',
    id: '',
    levl: '0',
    xians: 1,
    page: 1,
    pinglu: '',
    level: '0',
    index: 0,
    'if': 1,
    key: 0,
    key1: 0,
    key2: 0,
    img: '',
    goods_name: '',
    guige: 1,
    xx: '',
    dzx1: '',
    zuiz: '',
    price_sale: '',
    shebei: '',
    multiArray: '',
    multiIndex: '',
    p_userInfo: null,
    format_code:'',
    format_image:'',
    format_price:'',
    format_sale:'',
    value_show:'',
    ggid:'',
    price:'',
    is_format:'',
    goods_images:'',
    spprice:'',
    brand_id:'',
    brand_name:'',
    model_code:'',
    model_id:'',
    is_into:1,

    islogin: true
  },
  xiugaijx: function(res) {
    this.setData({
      yeas: 1
    })
  },
  zhedan: function(res) {
    this.setData({
      yeas: 0
    })
  },
  bindChange: function(e) {
    var i = e.detail.value
    console.log(i,"怎么搞");
    var that = this;

    this.setData({
      index: e.detail.value[0]
    })
    network.Post({
      url: phone + 'api/Phone/AllPhone',
      success: function(res) {
        var phone = JSON.parse(res.data).data;
        if (phone[e.detail.value[0]].brand_model[e.detail.value[1]] == undefined) {
          that.setData({
            shebei: "请选择机型",
            is_into: 0
          })
        }else{
          that.setData({
            shebei: phone[i[0]].brand_name + '　' + phone[i[0]].brand_model[i[1]].model_code,
            brand_name: phone[i[0]].brand_name,
            brand_id: phone[i[0]].id,
            model_id: phone[i[0]].brand_model[i[1]].id,
            model_name: phone[i[0]].brand_model[i[1]].model_code,
            is_into: 1
          })
        }
      }
    })
  },
  lq: function(res) {
    this.setData({
      video: 1
    })
    var xians = this.data.xians;
    if (xians == 1) {
      this.setData({
        xians: 0
      })
    }
  },
  onlogin:function(res){
    var that = this;
    if (null == that.data.p_userInfo) {
      g_autoLogin.AutoLogin({
        success: res1 => that.onAutoSuccess(res1),
        fail: function (res2) {
          g_app.ShowError(res2, 5000);
        }
      });
    } else {
      
     }
  },
  //登录成功回调
  onAutoSuccess: function (res) {
    var that = this;
    that.InitPage(res);
  },
  InitPage: function (userInfo) {
    getApp().globalData.member = userInfo.member;
    getApp().globalData.role = userInfo.role;
    this.setData({
      role: getApp().globalData.role
    })
    var that = this;
    wx.setStorage({
      key: 'login',
      data: userInfo,
      success: function (res) {
      }
    })
    that.setData({
      p_userInfo: userInfo
    });    
  },
  dianyix: function(res) {
    this.setData({
      video: 0
    })
    var xians = this.data.xians;
    if (xians == 0) {
      this.setData({
        xians: 1
      })
    }
  },
  shouchang: function() {
    var shouchang = this.data.shouchang;
    if (shouchang == 101) {
      this.setData({
        shouchang: 0
      })
    } else {
      this.setData({
        shouchang: 101
      })
    }
  },
  fanhui: function(res) {
    wx.switchTab({
      url: '../../index/index',
    })
  },
  onLoad: function(options) {
    wx.showLoading({title:'加载中···'});
    var role = getApp().globalData.role;
    var login = wx.getStorageSync('login');
    if (login == ""){
      var login = null;
    }
    this.setData({
      role: role,
      p_userInfo: login
    })
    var id = options.id;
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          broaHeight: res.windowWidth * (750 / res.windowWidth),
          brand:res.brand
        })

        
      },
      complete: function(res) {}
    })
    network.Post({
      url: phone + 'api/Phone/AllPhone',
      success: function (res) {
        var phone = JSON.parse(res.data).data;
        console.log(phone,"phone");
        that.setData({
          choice: phone
        })
      }
    })
    this.setData({
      img: options.img,
      spbs: options.id,
      format_image:options.img
    })
    wx.getStorage({ //从本地拿到储存了的用户信息
      key: 'user',
      success: function(res) {
        var user = res.data;
        network.Post({
          url: detail + 'api/Collect/HasGoods',
          data: {
            token: user.token,
            openid: user.openid,
            id: id
          },
          success: function(res) {
            var shouchang = JSON.parse(res.data).status;
            if (shouchang == 0) {
              var biaoshi = JSON.parse(res.data).data;
              var token = JSON.parse(res.data).token;
              that.setData({
                shouchang: shouchang,
                biaoshi: biaoshi,
                id: id
              })
            } else if (shouchang == 101) {
              that.setData({
                id: id,
                shouchang: shouchang
              })
            } else if (shouchang == 3){
              g_againLogin.AutoLogin({
                url: detail + 'api/Collect/HasGoods',
                data: {
                  openid: wx.getStorageSync('user').openid,
                  token: '',
                  id: id
                },
                success: function (res) {  //返回数据处理
                  var biaoshi = JSON.parse(res.data).data;
                  var token = JSON.parse(res.data).token;
                  that.setData({
                    shouchang: shouchang,
                    biaoshi: biaoshi,
                    id: id
                  })
                },
                fail: function (res) {
                  g_app.ShowError(res, 3000);
                },
              });
            } else {
              wx.showToast({
                title: JSON.parse(res.data).error,
                icon: 'none',
                duration: 1500,
                mask: true
              })
            }
            if (1101 != shouchang) {
              var userInfo = wx.getStorageSync('user');
              userInfo.token = token;
              wx.setStorageSync('user', userInfo);
            }
          }
        })
      }
    })
    network.Post({
      url: detail + 'api/Goods/GoodsInfo',
      data: {
        id: id
      },
      success: function(res) {
        var xiangq = JSON.parse(res.data).data;
        var goods_service = xiangq.goods_service;
        var ss = goods_service.split(",");
        var goods_images = JSON.parse(xiangq.goods_images)
        var sale_numble = xiangq.sale_numble;
        that.setData({
          goods_name: xiangq.goods_name,
          spprice: xiangq.price_sale,
          goods_stock: xiangq.goods_stock,
          goods_service: ss,
          sale_virtual: xiangq.sale_virtual + sale_numble,
          goods_images: goods_images, 
          goods_video: xiangq.goods_video,
          price_cost: xiangq.price_cost,
          is_format: xiangq.is_format
        })
        var article = xiangq.goods_details
        WxParse.wxParse('article', 'html', article, that, 5);
        if (xiangq.is_format == 1){
          //获取商品的规格
          network.Post({
            url: detail + 'api/Format/GoodsFormat',
            data: {
              id: options.id
            },
            success: function (res) {
              var xx = JSON.parse(res.data).data;
              if (xx.length == 1) {
                that.setData({ //只有一个规格的时候选取的默认规格
                  format_code: xx[0].format_value[0].format_code,
                  format_image: xx[0].format_value[0].format_image,
                  format_price: xx[0].format_value[0].format_price,
                  price: xx[0].format_value[0].format_price,
                  format_sale: xx[0].format_value[0].format_sale,
                  ggid: xx[0].format_value[0].id,
                  value_show: xx[0].format_value[0].value_show,
                  xiangou: xx[0].format_value[0].format_stock,
                })
              } else if (xx.length == 2) {
                var dzx = [];
                for (var i = 0; i < xx[1].format_value.length; i++) { //找到默认的第二行规格的显示的数据
                  if (xx[0].format_value[0].id == xx[1].format_value[i].parent_id) {
                    dzx = dzx.concat(xx[1].format_value[i])
                  }
                }
                that.setData({
                  dzx: dzx, //第二行默认的规格数据
                  format_code: xx[1].format_value[0].format_code,
                  format_image: xx[1].format_value[0].format_image,
                  format_price: xx[1].format_value[0].format_price,
                  price: xx[1].format_value[0].format_price,
                  format_sale: xx[1].format_value[0].format_sale,
                  ggid: xx[1].format_value[0].id,
                  value_show: xx[1].format_value[0].value_show,
                  xiangou: xx[1].format_value[0].format_stock
                })
              } else if (xx.length == 3) {
                var dzx = [];
                var dzx1 = [];
                for (var i = 0; i < xx[1].format_value.length; i++) {
                  if (xx[0].format_value[0].id == xx[1].format_value[i].parent_id) {
                    dzx = dzx.concat(xx[1].format_value[i])
                  }
                }
                for (var e = 0; e < xx[2].format_value.length; e++) {
                  if (xx[1].format_value[0].id == xx[2].format_value[e].parent_id)
                    dzx1 = dzx1.concat(xx[2].format_value[e])
                }
                that.setData({
                  dzx: dzx,
                  dzx1: dzx1,
                  format_image: dzx1[0].format_image,
                  format_code: dzx1[0].format_code,
                  format_price: dzx1[0].format_price,
                  price: dzx1[0].format_price,
                  format_sale: dzx1[0].format_sale,
                  ggid: dzx1[0].id,
                  value_show: dzx1[0].value_show,
                  xiangou: dzx1[0].format_stock
                })
              }
              that.setData({ //只有一个规格的时候选取的默认规格
                xx: xx
              })
            }
          })
        }else{

        }
      }
    })
    network.Post({
      url: detail + 'api/Comment/GoodsComment',
      data: {
        id: id,
        page: 1,
        numble: 5,
        level: 0
      },
      success: function(res) {
        var pinglu = JSON.parse(res.data).data;
        var shul = JSON.parse(res.data);
        
        for (var i = 0; i < pinglu.length; i++) {
          pinglu[i].comment_images = JSON.parse(pinglu[i].comment_images)
        }
        that.setData({
          pinglu: pinglu,
          quanbu: shul.total,
          hp: shul.good,
          zp: shul.mid,
          cp: shul.bad
        })
      }
    })
    wx.getSystemInfo({
      success: function(res) {
        var model = res.model;
        var brand = res.brand;
        for (var i = 0; i < model.length; i++) {
          if ((model.indexOf("<") != -1) == true) {
            if ((model.indexOf("(") != -1) == true) {
              that.setData({
                shebei: model.substring(0, model.indexOf('('))
              })
              var shebei = model.substring(0, model.indexOf('('))
            } else {
              that.setData({
                shebei: model.substring(0, model.indexOf('<'))
              })
              var shebei = model.substring(0, model.indexOf('<'))
            }
          } else if ((model.indexOf("(") != -1) == true) {
            that.setData({
              shebei: model.substring(0, model.indexOf('('))
            })
            var shebei = model.substring(0, model.indexOf('('))
          } else {
            that.setData({
              shebei: model
            })
            var shebei = model
          }

        }
        console.log(shebei)
        network.Post({
          url: phone + 'api/Phone/ModelPhone',
          data:{
            code: shebei
          },
          success:function(res){
            var shouji = JSON.parse(res.data).data;
            if(JSON.parse(res.data).status == 0){
              that.setData({
                brand_name: shouji.brand_name,
                brand_id: shouji.brand_id,
                model_id: shouji.id,
                model_name: shouji.model_name,
                shebei: shouji.brand_name +'　'+ shouji.model_name
              })
            } else if (JSON.parse(res.data).status == 101 || JSON.parse(res.data).status == 102){
              that.setData({
                shebei:'请选择机型',
                is_into:0
              })
            }
          }
        })
        
        // network.Post({
        //   url: phone + 'api/Phone/ModelPhone',

        // })
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
        });
      }
    });
  },
  yans:function(res){ //规格第一组点击
    var that = this;
    var xx = this.data.xx //规格数组
    var dataset = res.currentTarget.dataset; //标签上data传来的值
    if(xx.length == 1){ //当它规格数组长度为1时
      that.setData({
        format_code: dataset.code,
        format_image: dataset.image,
        format_price:dataset.price,
        price: dataset.price,
        format_sale:dataset.sale,
        ggid:dataset.id,
        value_show:dataset.show,
        xiangou:dataset.stock
      })
    }else if(xx.length == 2){
      var dzx = [];
      for (var i = 0; i < xx[1].format_value.length; i++) { //找到默认的第二行规格的显示的数据
        if (dataset.id == xx[1].format_value[i].parent_id) {
          dzx = dzx.concat(xx[1].format_value[i])
        }
      }
      that.setData({
        dzx: dzx,
        format_code: dzx[0].format_code,
        format_image: dzx[0].format_image,
        format_price: dzx[0].format_price,
        price: dzx[0].format_price,
        format_sale: dzx[0].format_sale,
        ggid: dzx[0].id,
        value_show: dzx[0].value_show,
        xiangou: dzx[0].format_stock,
        key1: 0
      })
    }else if(xx.length == 3){
      var dzx = [];
      var dzx1 = [];
      for(var i=0;i<xx[1].format_value.length;i++){
        if (res.currentTarget.dataset.duibi == xx[1].format_value[i].parent_id) { //当一行的ID与第二行的parent_id判断
          dzx = dzx.concat(xx[1].format_value[i])
        }
      }
      for (var e = 0; e < xx[2].format_value.length; e++) {
        if (dzx[0].id == xx[2].format_value[e].parent_id) { //当二行的ID与第三行的parent_id判断
          dzx1 = dzx1.concat(xx[2].format_value[e])
        }
      }
      that.setData({
        dzx: dzx,
        dzx1: dzx1,
        format_code: dzx1[0].format_code,
        format_image: dzx1[0].format_image,
        format_price: dzx1[0].format_price,
        price: dzx1[0].format_price,
        format_sale: dzx1[0].format_sale,
        ggid: dzx1[0].id,
        value_show: dzx1[0].value_show,
        xiangou: dzx1[0].format_stock,
        key1:0
      })
    }
    that.setData({
      key:res.currentTarget.dataset.index,
      key2:0
    })
  },
  yans1:function(res){ //规格第二组点击触发
    var that = this;
    var xx = this.data.xx;
    if(xx.length == 2){
      that.setData({
        key1: res.currentTarget.dataset.index,
        format_code: res.currentTarget.dataset.code,
        format_image: res.currentTarget.dataset.image,
        format_price: res.currentTarget.dataset.price,
        price: res.currentTarget.dataset.price,
        format_sale: res.currentTarget.dataset.sale,
        ggid: res.currentTarget.dataset.id,
        value_show: res.currentTarget.dataset.show,
        xiangou: res.currentTarget.dataset.stock
      })
    }else if(xx.length == 3){
      var dzx1 = [];
      for(var i=0;i<xx[2].format_value.length;i++){
        if (res.currentTarget.dataset.id == xx[2].format_value[i].parent_id){
          dzx1 = dzx1.concat(xx[2].format_value[i])
        }
      }
      that.setData({
        key1:res.currentTarget.dataset.index,
        dzx1: dzx1,
        format_code: dzx1[0].format_code,
        format_image: dzx1[0].format_image,
        format_price: dzx1[0].format_price,
        price: dzx1[0].format_price,
        format_sale: dzx1[0].format_sale,
        ggid: dzx1[0].id,
        value_show: dzx1[0].value_show,
        xiangou: dzx1[0].format_stock,
        key2:0
      })
    }
  },
  yans2:function(res){ //规格第三组点击触发
    this.setData({
      key2:res.currentTarget.dataset.index,
      format_code: res.currentTarget.dataset.code,
      format_image: res.currentTarget.dataset.image,
      format_price: res.currentTarget.dataset.price,
      price: res.currentTarget.dataset.price,
      format_sale: res.currentTarget.dataset.sale,
      ggid: res.currentTarget.dataset.id,
      value_show: res.currentTarget.dataset.show,
      xiangou: res.currentTarget.dataset.stock
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.hideLoading();
    var shouchang = this.data.shouchang;
    if (shouchang == 101) {
      this.setData({
        shouchang: 101
      })
    } else if (shouchang == 0) {
      this.setData({
        shouchang: 0
      })
    }
  },
  //切换评论类型
  qieh: function(res) {
    var id = this.data.id;
    var that = this;
    that.setData({
      levl: res.currentTarget.dataset.level
    })
    network.Post({
      url: detail + 'api/Comment/GoodsComment',
      data: {
        id: id,
        page: 1,
        numble: 5,
        level: res.currentTarget.dataset.level
      },
      success: function(res) {
        var pinglu = JSON.parse(res.data).data;
        var shul = JSON.parse(res.data);
        for (var i = 0; i < pinglu.length; i++) {
          pinglu[i].comment_images = JSON.parse(pinglu[i].comment_images)
        };
        that.setData({
          pinglu: pinglu,
          quanbu: shul.total,
          hp: shul.good,
          zp: shul.mid,
          cp: shul.bad,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var userInfo = wx.getStorageSync('user');
    console.log(userInfo)
    if (userInfo) { //有用户信息
      that.InitPage(userInfo);
    } else { //无用户信息
      that.data.p_userInfo = null;
      that.setData({
        islogin: false
      })
    }
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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
    var page = this.data.page + 1;
    var level = this.data.level;
    var pinglu = this.data.pinglu;
    var id = this.data.id;
    var that = this;
    this.setData({
      page: page
    })
    network.Post({
      url: detail + 'api/Comment/GoodsComment',
      data: {
        id: id,
        page: page,
        numble: 5,
        level: level
      },
      success: function(res) {
        var pinglu1 = JSON.parse(res.data).data;
        if (pinglu1 == '') {
          wx.showToast({
            title: '暂无更多数据',
            icon: 'loading',
            duration: 1500
          })
        } else {
          var pinglu1 = JSON.parse(res.data).data;
          var shul = JSON.parse(res.data);
          for (var i = 0; i < pinglu.length; i++) {
            pinglu1[i].comment_images = JSON.parse(pinglu1[i].comment_images)
          }
          pinglu = pinglu.concat(pinglu1);
          that.setData({
            pinglu: pinglu,
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  tiao: function(res) {
    var xx = this.data.xx;
    var that = this;  
    if (xx.length == 0) {
      var xiangou = this.data.goods_stock
    }  else {
      var xiangou = this.data.xiangou
    }
    if (this.data.is_format == 1){
      var format_image = that.data.format_image,
          value_show = that.data.value_show,
          price_sale = that.data.format_price, 
          ggid = that.data.ggid,
          format_code = that.data.format_code,
          format_show = that.data.format_show
    }else{
      var format_image = that.data.format_image,
        value_show = '',
        price_sale = this.data.spprice,
        ggid = 0,
        format_code = ''
    }
    var model_name = this.data.model_name;
    var fi = this.data.if;
    var goods_name = this.data.goods_name;
    var spbs = this.data.spbs;
    var brand_id = this.data.brand_id;
    var is_format = this.data.is_format
    if (fi == 1) {
      var sheb = this.data.shebei;
    } else {
      var sheb = multiArray[1][multiIndex[1]];
    }
    if (that.data.is_into == 1){
      wx.navigateTo({
        url: '../dingdan/dingdan?img=' + format_image + "&gg=" + value_show + "&price_sale=" + price_sale + "&sheb=" + sheb + "&goods_name=" + goods_name + "&spbs=" + spbs + "&brand_name=" + that.data.brand_name + "&model_name=" + model_name + "&brand_id=" + brand_id + "&format_id=" + ggid + "&format_code=" + format_code + "&format_show=" + format_show + "&xiangou=" + xiangou + '&made_type=' + 0 + '&made_image=' + [] + '&type=' + 0 + '&is_format=' + is_format + '&model_id=' + that.data.model_id,
      })
    }else{
      wx.showToast({
        title: '请选择机型',
        icon: "none"
      })
    }
  },
  quxiao: function(res) {
    this.setData({
      video: 0
    })
    var shouchang = this.data.shouchang;
    var that = this;
    var biaoshi = this.data.biaoshi;
    var id = this.data.id
    if (shouchang == 0) {
      wx.getStorage({ //从本地拿到储存了的用户信息
        key: 'user',
        success: function(res) {
          var user = res.data;
          network.Post({
            url: detail + 'api/Collect/DeleteGoods',
            data: {
              token: user.token,
              openid: user.openid,
              id: biaoshi.id
            },
            success: function(res) {
              if (JSON.parse(res.data).status == 3) {
                g_againLogin.AutoLogin({
                  url: detail + 'api/Collect/DeleteGoods',
                  data: {
                    openid: wx.getStorageSync('user').openid,
                    token: '',
                    id: biaoshi.id
                  },
                  success: function (res) {  //返回数据处理

                  },
                  fail: function (res) {
                    g_app.ShowError(res, 3000);
                  },
                });
              } else if (JSON.parse(res.data).status == 0) {

              } else {
                wx.showToast({
                  title: JSON.parse(res.data).status,
                  icon: 'none',
                  duration: 1000,
                  mask: true
                })
              }
            }
          })
        }
      })
    } else if (shouchang == 101) {
      wx.getStorage({ //从本地拿到储存了的用户信息
        key: 'user',
        success: function(res) {
          var user = res.data;
          network.Post({
            url: detail + 'api/Collect/AddGoods',
            data: {
              token: user.token,
              openid: user.openid,
              id: id
            },
            success: function(res) {
              if(JSON.parse(res.data).status == 3){
                g_againLogin.AutoLogin({
                  url: detail + 'api/Collect/AddGoods',
                  data: {
                    openid: wx.getStorageSync('user').openid,
                    token: '',
                    id: id
                  },
                  success: function (res) {  //返回数据处理
                    
                  },
                  fail: function (res) {
                    g_app.ShowError(res, 3000);
                  },
                });
              } else if (JSON.parse(res.data).status == 0){

              } else{
                wx.showToast({
                  title: JSON.parse(res.data).status,
                  icon: 'none',
                  duration: 1000,
                  mask: true
                })
              }
            }
          })
        }
      })
    }
  },
  cuowu: function(res) {
    this.setData({
      xians: 1,
      video: 0
    })
  },

  //用户授权
  getUserInfo: function (event) {


    let userinfo = event.detail;
    if (userinfo.errMsg == "getUserInfo:ok") {
      wx.setStorageSync("userlogin", userinfo);

      var that = this;
      that.setData({islogin:true});
      console.log(33333333)
      g_autoLogin.AutoLogin({
        success: res1 => that.onAutoSuccess(res1),
        fail: function (res2) {
          g_app.ShowError(res2, 5000);
          console.log(res2, "ok");
          // that.setData({ islogin: true });
        }
      });


    }
  }
})