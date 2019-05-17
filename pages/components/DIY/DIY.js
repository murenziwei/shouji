var icom = getApp().data.icom;
var location = getApp().data.location;
var g_font = getApp().data.font;
var detail = getApp().data.detail;
var phone = getApp().data.phone;
var network = require("../../../utils/network.js"); //接口封装
var g_autoLogin = require("../../../utils/AutoLogin.js");
var g_app = getApp();
var list = [];
var that = this;
const date = new Date()
const years = []
const months = [];
var startMove = 0;

Page({
  data: {
    yeas: 0,
    is_into: 1,
    brand: '',
    ChoisIndex: [],
    value: [9999, 1],
    choice: '',
    index: '0',
    fontFamily: 'AliHYAiHei', //字体
    name: '', //商品名字
    phone: '', //手机型号
    wz: 0,
    image: "",
    shupai: 1, //文字竖排
    p_font: [
      {
        name: "AliHYAiHei",
        title: "ABC",
        file: "AliHYAiHei.ttf",
      },
      {
        name: "TrebuchetMS-Bold",
        title: "ABC",
        file: "BlankSpots.ttf",
      },
      {
        name: "TimesNewRomanPS-ItalicMT",
        title: "ABC",
        file: "EllymonyBlueMSMM.ttf",
      },
      {
        name: "AppleGothic",
        title: "ABC",
        file: "TribeFont.ttf",
      },
    ],
    p_touch: {
      canOnePointMove: false,
      onePoint: {
        x: 0,
        y: 0
      },
      twoPoint: {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0
      }
    },
    p_window: {
      height: 0,
      width: 0,
      ratio: 0,
      canvas: 800,
      show: 700,
      header: 80
    },
    wenzhi: 1,
    text: '',
    xingxing: 5,
    mxingxing: '',
    p_tabClick: false,
    p_test: {
      a: 0
    },
    p_back: {
      left: 0,
      top: 0,
      width: 0,
      height: 60,
      url: ''
    },
    p_over: {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      url: ''
    },
    p_camera: {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      url: ''
    },
    p_curIndex: 0,
    p_medias: [],
    format_price: '',
    format_id: '',
    format_stock: '',
    p_userInfo: null,
    format_code: '',
    value_show: '',
    is_format: '',
    model_name: '',
    model_id: '',
    brand_id: '',
    brand_name: '',
    timeStamp: ''
  },
  bindMultiPickerChange: function(e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function(e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },
  shupai: function(res) { //文字竖排触发事件
    var shupai = this.data.shupai;
    var writing = this.data.p_medias[this.data.p_curIndex].writing;
    var s = "p_medias[" + this.data.p_curIndex + "].writing";
    if (shupai == 1) {
      this.setData({
        shupai: 0,
        [s]: 'tb-rl'
      })
    } else {
      this.setData({
        shupai: 1,
        [s]: 'lr-tb'
      })
    }
  },
  tuan: function(res) {
    this.setData({
      wenzhi: 1
    })
  },
  wen: function(res) {
    if (this.data.p_medias[this.data.p_curIndex].type == 1) {
      this.setData({
        wz: 1
      })
    } else {
      this.setData({
        wz: 0
      })
    }
    this.setData({
      wenzhi: 2
    })
  },
  guige: function(res) {
    this.setData({
      wenzhi: 0
    })
  },
  shanchu: function(res) {
    var index = res.currentTarget.dataset.index;
    var medias = this.data.p_medias;
    var curIndex = this.data.p_curIndex;
    medias.splice(index, 1);
    this.setData({
      p_medias: medias
    })
    if (medias.length == 0) {
      this.setData({
        xingxing: '',
        mxingxing: 5
      })
    }
    if (curIndex > medias.length - 1) {
      curIndex = medias.length - 1;
      this.setData({
        p_curIndex: curIndex
      })
    }
  },
  onTabClick: function(res) { //响应图片文字事件
    var index = res.currentTarget.dataset.index;
    this.setData({
      p_curIndex: index,
      p_tabClick: true,
    })
    this.panduan()
  },
  panduan: function(res) {
    if (this.data.p_medias[this.data.p_curIndex].scale <= 1) {
      this.setData({
        xingxing: 5,
        mxingxing: ''
      })
    } else if (this.data.p_medias[this.data.p_curIndex].scale > 1 && this.data.p_medias[this.data.p_curIndex].scale < 2) {
      this.setData({
        xingxing: 4,
        mxingxing: 1
      })
    } else if (this.data.p_medias[this.data.p_curIndex].scale > 2 && this.data.p_medias[this.data.p_curIndex].scale < 3) {
      this.setData({
        xingxing: 3,
        mxingxing: 2
      })
    } else if (this.data.p_medias[this.data.p_curIndex].scale > 3 && this.data.p_medias[this.data.p_curIndex].scale < 4) {
      this.setData({
        xingxing: 2,
        mxingxing: 3
      })
    } else if (this.data.p_medias[this.data.p_curIndex].scale > 4 && this.data.p_medias[this.data.p_curIndex].scale < 5) {
      this.setData({
        xingxing: 1,
        mxingxing: 4
      })
    } else if (this.data.p_medias[this.data.p_curIndex].scale > 5) {
      this.setData({
        xingxing: 1,
        mxingxing: 4
      })
    }
  },
  bindChange: function(e) {
    var i = e.detail.value
    var choice = this.data.choice;
    var that = this;
    network.Post({
      url: phone + 'api/Phone/AllPhone',
      success: function(res) {
        var sj = JSON.parse(res.data).data;
        if (sj[e.detail.value[0]].brand_model[e.detail.value[1]] == undefined) {
          that.setData({
            is_into: 0,
            shebei: '请选择机型'
          })
        } else {
          that.setData({
            shebei: sj[i[0]].brand_name + sj[i[0]].brand_model[i[1]].model_name,
            brand_name: sj[i[0]].brand_name,
            brand_id: sj[i[0]].id,
            model_id: sj[i[0]].brand_model[i[1]].id,
            model_name: sj[i[0]].brand_model[i[1]].model_code,
            is_into: 1
          })
          network.Post({
            url: phone + 'api/Phone/ModelPhone',
            data: {
              code: choice[e.detail.value[0]].brand_model[e.detail.value[1]].model_code
            },
            success: function(res) {
              var phone = JSON.parse(res.data).data;
              that.setData({
                ['p_back.url']: phone.model_bottom,
                ['p_over.url']: phone.model_border,
                ['p_camera.url']: phone.model_top,
                shebei: phone.brand_name + '　' + phone.model_name
              })
            },
            fail: function(res) {
              console.log(1)
            }
          })
        }
      }
    })
    this.setData({
      index: e.detail.value[0]
    })
  },
  onLoad: function(res) {
    var login = wx.getStorageSync('login'); //判断登录
    if (login == "") {
      var login = null;
    }
    var that = this;
    var choice = this.data.choice;
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
        network.Post({
          url: phone + 'api/Phone/ModelPhone',
          data: {
            code: shebei
          },
          success: function(res) {
            var shouji = JSON.parse(res.data).data;
            if (JSON.parse(res.data).status == 0) {
              that.setData({
                brand_name: shouji.brand_name,
                brand_id: shouji.brand_id,
                model_id: shouji.id,
                model_name: shouji.model_name,
                shebei: shouji.brand_name + '　' + shouji.model_name,
                ['p_back.url']: shouji.model_bottom,
                ['p_over.url']: shouji.model_border,
                ['p_camera.url']: shouji.model_top
              })
            } else if (JSON.parse(res.data).status == 101 || JSON.parse(res.data).status == 102) {
              that.setData({
                shebei: '请选择机型',
                is_into: 0
              })
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
    var medias = this.data.p_medias;
    var that = this;
    var multiArray = this.data.multiArray;
    network.Post({ //获取商品信息
      url: detail + 'api/Goods/GoodsInfo',
      data: {
        id: 1
      },
      success: function(res) {
        var xinxi = JSON.parse(res.data).data;
        that.setData({
          xinxi: xinxi,
          name: xinxi.goods_name,
          is_format: xinxi.is_format
        })
        network.Post({ //获取规格
          url: detail + 'api/Format/GoodsFormat',
          data: {
            id: 1
          },
          success: function(res) {
            var guige = JSON.parse(res.data).data;
            if (guige !== '') {
              that.setData({
                guige: guige,
                format_price: guige[0].format_value[0].format_price, //写
                format_id: guige[0].format_value[0].id,
                format_code: guige[0].format_value[0].format_code,
                format_stock: guige[0].format_value[0].format_stock,
                jiage: guige[0].format_value[0].format_price,
                value_show: guige[0].format_value[0].value_show,
                key: 0
              })
            } else {
              that.setData({
                format_price: xinxi.price_sale, //写
                format_id: 0,
                format_code: '',
                format_show: '',
                format_stock: xinxi.goods_stock,
                jiage: xinxi.price_sale,
                value_show: 0,
                key: 0
              })
            }
            if (xinxi.is_format == 0) {
              that.setData({
                jiage: xinxi.price_sale
              })
            }
          }
        });
      }
    })
    network.Post({
      url: phone + 'api/Phone/AllPhone',
      data: {},
      success: function(res) {
        var phone = JSON.parse(res.data).data;
        that.setData({
          choice: phone
        })
      }
    })
    var newImg = {
      'type': 2,
      position: {
        x: 0,
        y: 0
      },
      width: 0,
      height: 0,
      scale: 1,
      rotate: 0,
      url: res.url
    }
    medias = medias.concat(newImg);
    that.setData({
      p_medias: medias,
      p_curIndex: medias.length - 1
    })
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          ["p_window.ratio"]: 750 / res.windowWidth,
          ["p_window.width"]: res.windowWidth * (750 / res.windowWidth),
          ["p_window.height"]: res.windowHeight * (750 / res.windowHeight)
        })
      },
    })
    this.setData({
      // ['p_back.url']: '../../../img/2.png',
      // ['p_over.url']: '../../../img/1.png',
      // ['p_camera.url']: '../../../img/3.png',
      p_userInfo: login
    })
  },
  onlogin: function(res) {
    var that = this;
    if (null == that.data.p_userInfo) {
      g_autoLogin.AutoLogin({
        success: res1 => that.onAutoSuccess(res1),
        fail: function(res2) {
          g_app.ShowError(res2, 5000);
        }
      });
    } else {

    }
  },
  onAutoSuccess: function(res) {
    var that = this;

    that.InitPage(res);
  },
  InitPage: function(userInfo) {
    getApp().globalData.member = userInfo.member;
    getApp().globalData.role = userInfo.role;
    var that = this;
    wx.setStorage({
      key: 'login',
      data: userInfo,
      success: function(res) {}
    })
    that.setData({
      p_userInfo: userInfo
    });
  },
  ontap: function(res) {
    this.setData({
      yeas: 1
    })
  },
  zhedan: function(res) {
    this.setData({
      yeas: 0
    })
  },
  onCode: function(res) { //选择规格
    this.setData({
      key: res.currentTarget.dataset.index,
      format_id: res.currentTarget.dataset.id,
      format_price: res.currentTarget.dataset.price,
      jiage: res.currentTarget.dataset.price,
      value_show: res.currentTarget.dataset.show,
      format_code: res.currentTarget.dataset.code
    })
  },
  onBackLoad: function(res) {
    var window = this.data.p_window;
    var width = res.detail.width * window.ratio;
    var height = res.detail.height * window.ratio;
    var ratio = height / width;
    if (height > window.show) {
      height = window.show;
      width = height / ratio;
    }
    var x = (window.width - width) / 2;
    var y = (window.canvas - height) / 2;

    this.setData({
      ["p_back.width"]: width,
      ["p_back.left"]: x,
      ["p_back.top"]: y,
      ["p_back.height"]: height,
      ["p_over.width"]: width,
      ["p_over.left"]: x,
      ["p_over.top"]: y,
      ["p_over.height"]: height,
      ["p_camera.width"]: width,
      ["p_camera.left"]: x,
      ["p_camera.top"]: y,
      ["p_camera.height"]: height
    })
  },
  onImageLoad: function(res) {
    var index = res.currentTarget.dataset.index;
    var window = this.data.p_window;
    var width = res.detail.width * window.ratio;
    var height = res.detail.height * window.ratio;
    var ratio = height / width;
    var imgWidth = "p_medias[" + index + "].width";
    var imgHeight = "p_medias[" + index + "].height"
    var imgX = "p_medias[" + index + "].position.x";
    var imgY = "p_medias[" + index + "].position.y";
    if (width < this.data.p_back.width) {
      width = this.data.p_back.width;
      height = ratio * width
    }
    if (height < this.data.p_back.height) {
      height = this.data.p_back.height;
      width = height / ratio;
    }

    var x = 0 - ((width - this.data.p_back.width) / 2)
    var y = 0 - ((height - this.data.p_back.height) / 2)
    this.setData({
      [imgWidth]: width, //修改图片默认图片宽
      [imgHeight]: height, //修改图片默认图片高
      [imgX]: x,
      [imgY]: y
    })
  },
  tianjia: function(res) { //实时添加文字
    this.setData({
      text: res.detail.value
    })
  },
  //添加文本
  onText: function(res) {
    var window = this.data.p_window
    var that = this;
    var text = this.data.text;
    var newText = {
      'type': 1,
      position: {
        x: 100,
        y: 200,
      },
      width: 0,
      height: 0,
      scale: 1,
      rotate: 0,
      input: text,
      color: '000000',
      size: 20,
      font: "",
      writing: ''
    }
    var medias = this.data.p_medias;
    medias = medias.concat(newText);
    this.setData({
      p_medias: medias,
      p_curIndex: medias.length - 1,
      wz: 1,
      xingxing: 5,
      mxingxing: ''
    })

    var textWidth = "p_medias[" + (medias.length - 1) + "].width";
    var textHeight = "p_medias[" + (medias.length - 1) + "].height"

    //获取文本宽高
    var tabId = '#id' + (medias.length - 1);
    var query = wx.createSelectorQuery();
    query.select(tabId).boundingClientRect(function(rect) {

      that.setData({
        [textWidth]: rect.width * window.ratio,
        [textHeight]: rect.height * window.ratio
      })
    }).exec();
  },
  yanse: function(res) { //选择颜色
    var text = this.data.p_medias[this.data.p_curIndex].color;
    var s = "p_medias[" + this.data.p_curIndex + "].color"
    this.setData({
      [s]: res.currentTarget.dataset.ys
    })
  },
  onFont: function(res) { //选择字体
    var index = res.currentTarget.dataset.index;
    var font = "p_medias[" + this.data.p_curIndex + "].font"
    this.setData({
      [font]: this.data.p_font[index].name
    })
  },
  //添加图片
  onImg: function(res) {
    var medias = this.data.p_medias;
    var that = this;
    wx.chooseImage({
      success: function(res) {
        const uploadTask = wx.uploadFile({
          url: icom + 'api/Image/upload_file',
          filePath: res.tempFilePaths[0],
          name: 'comment_images',
          formData: {
            file_token: getApp().data.file_token
          },
          success: function(e) {
            var url = JSON.parse(e.data).url;
            var newImg = {
              'type': 2,
              position: {
                x: 0,
                y: 0
              },
              width: 0,
              height: 0,
              scale: 1,
              rotate: 1,
              url: url
            }
            medias = medias.concat(newImg);
            that.setData({
              p_medias: medias,
              p_curIndex: medias.length - 1,
              xingxing: 5,
              mxingxing: ''
            })
          }
        })
      },
    })
  },
  onScale: function(res) {
    var index = "p_medias[" + this.data.p_curIndex + "].scale";
    this.setData({
      [index]: 5
    })
  },
  onReady: function(res) {},
  onRotate: function(res) {
    var index = "p_medias[" + this.data.p_curIndex + "].rotate"
    this.setData({
      [index]: 500
    })
  },
  touchstart: function(e) {
    this.panduan();
    if (e.touches.length < 2) //单指点击
    {
      this.setData({
        "p_touch.canOnePointMove": true,
        "p_touch.onePoint.x": e.touches[0].pageX * this.data.p_window.ratio,
        "p_touch.onePoint.y": e.touches[0].pageY * this.data.p_window.ratio
      })

      //选择点击层
      var header = this.data.p_window.header; //头部高度
      var x = this.data.p_touch.onePoint.x - this.data.p_over.left;
      var y = this.data.p_touch.onePoint.y - (this.data.p_over.top + header);
      var tabClick = this.data.p_tabClick;
      if (!tabClick) {
        var medias = this.data.p_medias;
        for (var i = 0; i < medias.length; i++) {
          var left = medias[i].position.x;
          var right = medias[i].position.x + medias[i].width;
          var top = medias[i].position.y;
          var bottom = medias[i].position.y + medias[i].height;
          if (x >= left && x <= right && y >= top && y <= bottom) {
            this.setData({
              p_curIndex: i
            })
            if (medias[this.data.p_curIndex].type == 1)
              break;
          }
        }
        if (this.data.p_medias[this.data.p_curIndex].type == 1) {
          this.setData({
            wz: 1
          })
        } else {
          this.setData({
            wz: 0
          })
        }
      }
      this.setData({
        p_tabClick: false
      })
    } else //多指点击
    {
      this.setData({
        "p_touch.twoPoint.x1": e.touches[0].pageX * this.data.p_window.ratio,
        "p_touch.twoPoint.x2": e.touches[1].pageX * this.data.p_window.ratio,
        "p_touch.twoPoint.y1": e.touches[0].pageY * this.data.p_window.ratio,
        "p_touch.twoPoint.y2": e.touches[1].pageY * this.data.p_window.ratio
      })
    }
  },
  touchmove: function(e) {
    console.log(e)
    if (e.timeStamp - startMove > 50){
      startMove = e.timeStamp;
      this.panduan()
      var window = this.data.p_window;
      var curIndex = this.data.p_curIndex;
      var medias = this.data.p_medias;
      var that = this;
      var x = "p_medias[" + curIndex + "].position.x";
      var y = "p_medias[" + curIndex + "].position.y";
      if (e.touches.length < 2 && this.data.p_touch.canOnePointMove) { //单指移动
        var onePointDiffX = e.touches[0].pageX * window.ratio - this.data.p_touch.onePoint.x;
        var onePointDiffY = e.touches[0].pageY * window.ratio - this.data.p_touch.onePoint.y;
        onePointDiffX = medias[curIndex].position.x + onePointDiffX;
        onePointDiffY = medias[curIndex].position.y + onePointDiffY;
        that.setData({
          [x]: onePointDiffX,
          [y]: onePointDiffY,
          "p_touch.onePoint.x": e.touches[0].pageX * window.ratio,
          "p_touch.onePoint.y": e.touches[0].pageY * window.ratio
        })
      } else if (e.touches.length > 1) { //多指移动
        var preTwoPoint = JSON.parse(JSON.stringify(this.data.p_touch.twoPoint));
        that.setData({
          "p_touch.twoPoint.x1": e.touches[0].pageX * window.ratio,
          "p_touch.twoPoint.y1": e.touches[0].pageY * window.ratio,
          "p_touch.twoPoint.x2": e.touches[1].pageX * window.ratio,
          "p_touch.twoPoint.y2": e.touches[1].pageY * window.ratio
        })
        var rotate = "p_medias[" + curIndex + "].rotate";
        // 计算角度，旋转(优先)
        var perAngle = Math.atan((preTwoPoint.y1 - preTwoPoint.y2) / (preTwoPoint.x1 - preTwoPoint.x2)) * 360 / Math.PI;
        var curAngle = Math.atan((this.data.p_touch.twoPoint.y1 - this.data.p_touch.twoPoint.y2) / (this.data.p_touch.twoPoint.x1 - this.data.p_touch.twoPoint.x2)) * 360 / Math.PI;
        if (Math.abs(perAngle - curAngle) > 1) {
          that.setData({
            [rotate]: that.data.p_medias[curIndex].rotate + (curAngle - perAngle)
          })
        } else {
          var scale = "p_medias[" + curIndex + "].scale";
          //计算距离，缩放;
          var preDistance = Math.sqrt(Math.pow((preTwoPoint.x1 - preTwoPoint.x2), 2) + Math.pow((preTwoPoint.y1 - preTwoPoint.y2), 2))
          var curDistance = Math.sqrt(Math.pow((this.data.p_touch.twoPoint.x1 - this.data.p_touch.twoPoint.x2), 2) + Math.pow((this.data.p_touch.twoPoint.y1 - this.data.p_touch.twoPoint.y2), 2))
          var ratio = 0;
          if (that.data.p_medias[curIndex].type == 1)
            ratio = 0.03;
          else
            ratio = 0.0025;
          var curScale = that.data.p_medias[curIndex].scale + (curDistance - preDistance) * ratio;
          if ((that.data.p_medias[curIndex].width * curScale) >= 50) {
            that.setData({
              [scale]: curScale
            })
          }
        }
      }
    }else{
      console.log("太快了")
    }
  },
  
  touchend: function(e) {
    this.setData({
      "p_touch.canOnePointMove": false
    })
  },
  onCanvas: function(res) {
    var that = this;
    var param = {
      touch: this.data.p_touch,
      back: this.data.p_back,
      window: this.data.p_window,
      over: this.data.p_over,
      camera: this.data.p_camera,
      curIndex: this.data.p_curIndex,
      medias: this.data.p_medias,
      goods_name: this.data.name,
      sheb: this.data.phone,
      format_price: this.data.jiage,
      format_id: this.data.format_id,
      phone: this.data.phone,
      xiangou: this.data.format_stock,
      brand: this.data.brand,
      format_code: this.data.format_code,
      value_show: this.data.value_show,
      is_format: this.data.is_format,
      brand_id: this.data.brand_id,
      brand_name: this.data.brand_name,
      model_code: this.data.model_name,
      model_id: this.data.model_id
    };

    param = JSON.stringify(param);
    network.Post({
      url: location + 'api/Cache/WriteCache',
      data: {
        data: param
      },
      success: function(res) {
        var data = JSON.parse(res.data).data;
        var show = 1;
        if (that.data.is_into == 1) {
          wx.navigateTo({
            url: '../h5/h5?data=' + data + '&show=' + show
          })
        } else {
          wx.showToast({
            title: '请选择机型',
            icon: "none"
          })
        }
      }
    })
  },
  // onShareAppMessage: function() {
  //   return {
  //     title: '转发获取金币',
  //     desc: '分享给好友',
  //     path: 'pages/index/index?share=' + wx.getStorageSync('user').openid,
  //     success: function(res) {},
  //     fail: function(res) {},
  //   }
  // }
})