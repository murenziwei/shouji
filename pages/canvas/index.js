// pages/canvas/index.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: {},
    canvasData: {
    },
    drawList: [],
    drawData: [],
    customData: {
      imageList: [
        
        {
          type: 'image',
          url: 'https://gw.alicdn.com/imgextra/i1/3310310137/TB1G9m4aKOSBuNjy0FdXXbDnVXa_!!0-item_pic.jpg_360x360xzQ75s100.jpg',
          top: 0,
          left: 0,
          shape: 'circle',
          width: 300,
          height: 300,
          comment: '123'
        },
        {
          type: 'image',
          url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=267256052,2192923742&fm=26&gp=0.jpg',
          // url:'/images/test/icon2.png',
          top: 2320,
          left: 140,
          width: 300,
          height: 300,
          shape:'circle',
          comment: '头像'
        },
      ],
      textList: [{
        type: 'text',
        content: '白山羊',
        top: 336,
        left: 100,
        fontSize: 40,
        lineHeight: 40,
        color: '#f00',
        textAlign: 'left',
        weight: 'bold',
        maxWidth: 287
      }]
    },
    canvasData:[
      
    ],
  },
  fillText(params) {
    const { fontSize = 16, color = '#FFFFFF', content, left = 0, top = 0, textAlign = 'center', lineHeight = 16, maxLineNum = 2, maxWidth = 300, weight = 'normal' } = params
    let arrText = content.split('')
    let line = '', _top = top, lineNum = 1, testLine = ''
    this.ctx.setFillStyle(color)
    this.ctx.setTextAlign(textAlign)
    this.ctx.font = 'normal ' + weight + ' ' + fontSize + 'px ' + 'sans-serif'
    for (let i = 0; i < arrText.length; i++) {
      testLine += [arrText[i]]
      let testWidth = this.ctx.measureText(testLine).width || 0
      if (testWidth > maxWidth) {
        // if (lineNum === maxLineNum) { 最多显示多少行，暂时去掉此限制
        //   if (i !== arrText.length) {
        //     testLine = testLine.substring(0, testLine.length - 1) + '...'
        //     this.ctx.fillText(testLine, left, _top, maxWidth)
        //     testLine = ''
        //     break
        //   }
        // }
        this.ctx.fillText(testLine, left, _top, maxWidth)
        testLine = ''
        _top += lineHeight
        // lineNum ++
      }
    }
    this.ctx.fillText(testLine, left, _top, maxWidth)
  },
  drawImgInit() {
    let that = this
    let { canvasData, drawList, customData } = that.data
    let imageList = customData.imageList;
    let textList = customData.textList;
    if (!imageList.length) {
      return
    }
    // 分离图片和文字
    if (drawList.length) {
      drawList.forEach((item, index) => {
        switch (item.type) {
          case 'image':
            imageList.push(item)
            break;
          case 'text':
            textList.push(item)
            break;
        }
      })
    }
    // canvasData.width = parseInt(canvasData.width * 2) || 750
    // canvasData.height = parseInt(canvasData.height * 2) || 1334
    // imageList.unshift(canvasData)
    // 下载图片到本地后
    for (let i in imageList) {
      imageList[i].left = parseInt(imageList[i].left / 2) || 0
      imageList[i].top = parseInt(imageList[i].top / 2) || 0
      imageList[i].width = parseInt(imageList[i].width / 2) || 100
      imageList[i].height = parseInt(imageList[i].height / 2) || 100
      that.downLoadImg(imageList[i].url, imageList[i].comment).then(res => {
        imageList[i].url = res;
        console.log(res);
        that.drawImg(imageList[i]);
      }, err => {
        // that.showModal('错误提示', err, false)
        console.log(err);
      })
    }
    for (let i in textList) {
      textList[i].left = parseInt(textList[i].left / 2) || 0
      textList[i].top = parseInt(textList[i].top / 2) || 0
      textList[i].fontSize = parseInt(textList[i].fontSize / 2) || 16
      textList[i].lineHeight = parseInt(textList[i].lineHeight / 2) || 16
      textList[i].maxWidth = parseInt(textList[i].maxWidth / 2) || 300
    }
    that.data.drawData = [...imageList, ...textList]
    // 进行绘制
    that.beginDraw()
  },
  downLoadImg(imgurl, msg) {
    return new Promise((resolve, reject) => {
      let that = this
      // util.showToast(msg + '下载中...')
      wx.showLoading({
        title: '下载中',
      });
      console.log(imgurl);
      wx.getImageInfo({
        src: imgurl,
        success: function (sres) {
          wx.hideLoading()
          resolve(sres.path);
        }, fail(err) {
          console.log(err)
        }

      })
    })
  },
  // 开始绘制
  beginDraw() {
    let that = this
    let { drawData, customData } = that.data
    let imgIndex = 0
    for (let i in drawData) {
      switch (drawData[i].type) {
        case 'image':
          that.drawImg({
            ...drawData[i]
          })
          imgIndex++
          break;
        case 'text':
          that.fillText({
            ...drawData[i]
          })
          break;
      }
    }
    that.ctx.draw();
    // setTimeout(() => {
    //   that.saveImage()
    // }, 3000)
  },
  // 裁剪圆形头像
  circleImg(params) {
    const { url, left, top, width } = params
    let r = parseInt(width / 2) 
    this.ctx.save()
    let d = 2 * r
    let cx = left + r
    let cy = top + r
    this.ctx.arc(cx, cy, r, 0, 2 * Math.PI)
    this.ctx.clip()
    this.ctx.drawImage(url, left, top, d, d)
    this.ctx.restore()
  },
  drawImg(params) {
    let that = this
    const { url = '', top = 0, left = 0, width = 50, height = 50, shape = 'square' } = params
    if (params.shape == 'circle') {
      that.circleImg(params)
    }
    else {
      that.ctx.drawImage(url, left, top, width, height)
    }
  },
  saveImage() {
    let that = this
    // util.showToast('生成中...')
    console.log(11111);
    wx.showLoading({
      title: '生成中...',
    })
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      fileType: 'jpg',
      success(res) {
        // util.hideToast()
        wx.hideLoading();
        // wx.saveImageToPhotosAlbum({
        //   filePath: res.tempFilePath,
        //   success(res) {
        //     util.showModal('保存至相册', '图片成功保存至本地相册', false)
        //   }
        // })
        that.checkPermission('writePhotosAlbum', () => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              // util.showModal('保存至相册', '图片成功保存至本地相册', false)
            }
          })
        }, '保存图片需要权限，请提供保存到相册的权限。');
      }, fail(err) {
        // util.hideToast()
        wx.hideLoading();
        console.log(123);
        // util.showModal('错误提示', err, false)
      }
    }, that)
  },

  showModal(title = '系统提示', str = '', showCancel = true, confirmText = '确定', fn, color = {
    cancelColor: '#999999',
    confirmColor: '#7D73C3'
  }, cancelText = "取消"){
    wx.showModal({
      title: title,
      content: str,
      showCancel: showCancel,
      cancelText: cancelText,
      confirmText: confirmText,
      confirmColor: color.confirmColor,
      cancelColor: color.cancelColor,
      success: res => {
        return typeof fn == 'function' && fn(res)
      }
    })
  },

  checkPermission(type, onSuccess, content){//用户授权检查
    let that = this
    type = 'scope.' + type;
    wx.getSetting({
      success(getRes) {
        const setting = getRes.authSetting;
        if (setting[type] === false) {
          that.showModal('温馨提示', '请您授权其相关权限', false, '我知道了', res => {
            if (res.confirm) {
              wx.openSetting({
                success(openRes) {
                  if (openRes.authSetting[type] === true) {
                    typeof onSuccess === 'function' && onSuccess();
                  }
                }
              });
            }
          })
        } else if (setting[type] === true) {
          //如果已有授权直接执行对应动作
          typeof onSuccess === 'function' && onSuccess();
        } else {
          //如果未授权，直接执行对应动作，会自动查询授权
          typeof onSuccess === 'function' && onSuccess();
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      dataList: {
        canvasData: {
          type: 'image',
          url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1555319457825&di=85eb4632a1d5e7cf19a5ca2c9dcca386&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180605%2Feb7df965654a4cadba0b8f2bf58fe910.jpeg',
          top: 0,
          left: 0,
          width: 750,
          height: 1334,
          comment: '背景图',
          btnText: '保存至相册'
        },
        content: [
          {
            type: 'image',
            url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1555319457825&di=85eb4632a1d5e7cf19a5ca2c9dcca386&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180605%2Feb7df965654a4cadba0b8f2bf58fe910.jpeg',
            top: 0,
            left: 0,
            shape: 'square',
            width: 750,
            height: 1334,
            comment: '背景图',
            btnText: '保存至相册'
          }, {
            type: 'image',
            url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4208397176,1156911138&fm=26&gp=0.jpg',
            top: 500,
            left: 200,
            shape: 'square',
            width: 290,
            height: 186,
            comment: '头像'

          },
          {
            type: 'image',
            url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4208397176,1156911138&fm=26&gp=0.jpg',
            top: 500,
            left: 500,
            shape: 'square',
            width: 290,
            height: 186,
            comment: '头像'
          }, {
            type: 'text',
            content: '白山羊',
            top: 336,
            left: 100,
            fontSize: 40,
            lineHeight: 40,
            color: '#f00',
            textAlign: 'left',
            weight: 'bold',
            maxWidth: 287
          }]

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.ctx = wx.createCanvasContext('canvas', this)
    this.drawImgInit();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})