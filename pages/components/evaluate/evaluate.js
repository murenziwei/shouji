// pages/components/evaluate/evaluate.js
var UerUrl = getApp().data.UerUrl;
var icom = getApp().data.icom;
var network = require("../../../utils/network.js"); //接口封装
var g_againLogin = require("../../../utils/AgainLogin.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: [],
    pandun: 1,
    id: '',
    files: [],
    sq: '',
    value: '',
    dengji: '',
    img: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    var sq = options.sq
    this.setData({
      id: id,
      dengji:1,
      sq: sq
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
  paiz: function(res) {
    var that = this;
    wx.chooseImage({
      count: "5",
      success: function(res) {
        that.setData({
          page: res.tempFilePaths
        })
      },
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
  // onShareAppMessage: function() {
  //   return {
  //     title: '转发获取金币',
  //     desc: '分享给好友',
  //     path: 'pages/index/index?share=' + wx.getStorageSync('user').openid,
  //     success: function (res) {
  //       console.log(res)
  //     },
  //     fail: function (res) {
  //       console.log(res)
  //     },
  //   }
  // },
  haoping: function(res) {
    this.setData({
      dengji: res.currentTarget.dataset.id,
      pandun: res.currentTarget.dataset.id
    })
  },
  neir: function(res) {
    this.setData({
      value: res.detail.value
    })
  },
  tijiao: function(res) {

    var id = this.data.id
    var sq = this.data.sq;
    var value = this.data.value;
    var that = this;
    var dengji = this.data.dengji;
    var files = this.data.files;

    var sq = this.data.sq
    console.log(id,sq,value,dengji,files);
    wx.showLoading({
      title: '提交中',
    })
    const uploadTask = wx.uploadFile({
      url: icom + 'api/Image/upload_file',
      filePath: files[0],
      name: 'comment_images',
      formData: {
        file_token:getApp().data.file_token
      },
      success: function(e) {
        console.log(e,"尼玛，美哦定金");
        wx.getStorage({ //从本地拿到储存了的用户信息
          key: 'user',
          success: function(res) {
            
            var user = res.data;
            var data = {
              order_id: id,
              goods_id: sq,
              format_code: '1',
              comment_level: dengji,
              comment_content: value,
              comment_images: [JSON.parse(e.data).url]
            }
            network.Post({
              url: UerUrl + 'api/Comment/SubmitComment',
              data: {
                token: user.token,
                openid: user.openid,
                info: JSON.stringify(data)
              },
              success: function(res) {
                
                wx.hideLoading();
                if(JSON.parse(res.data).status == 0){
                  wx.showToast({
                    title: '提交成功',
                    icon: 'succes',
                    duration: 1000,
                    mask: true
                  })
                }else if(JSON.parse(res.data).status == 3){
                  g_againLogin.AutoLogin({
                    url: UerUrl + 'api/Comment/SubmitComment',
                    data: {
                      token: user.token,
                      openid: user.openid,
                      info: JSON.stringify(data)
                    },
                    success: function (res) {  //返回数据处理
                      if (JSON.parse(res.data).status == 0) {
                        wx.showToast({
                          title: '提交成功',
                          icon: 'success',
                          duration: 2000
                        })
                      } else {
                        wx.showToast({
                          title: JSON.parse(res.data).error,
                          icon: 'none',
                          duration: 2000
                        })
                      }
                    },
                    fail: function (res) {
                      g_app.ShowError(res, 3000);
                    },
                  });
                }
                if(JSON.parse(res.data).status !== 1101){
                  var token = JSON.parse(res.data).token;
                  var userInfo = wx.getStorageSync('user');
                  userInfo.token = token;
                  wx.setStorageSync('user', userInfo);
                }
              },
              fail(){
                wx.hideLoading();
              }
            })
          },
          fail(){
            wx.hideLoading();
          }
        })
      },
      fail(err){
        console.log(err,"我靠");
        wx.hideLoading();
      }
    })
  },
  //上传图片
  chooseImage: function(e) {
    var files = this.data.files
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        if (files.length >= 1) {
          wx.showToast({
            title: '只能上传一张图片',
            count: 1,
            icon: 'none'
          })
        } else {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
            files: that.data.files.concat(res.tempFilePaths)
          });
        }

      },

    })

  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  }
})