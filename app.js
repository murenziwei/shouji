//app.js
App({
  data: {
    // UerUrl: "https://api.shop.edinmed.cn/",//用户信息

    // address: 'https://api.shop.edinmed.cn/',//收货地址
    // Order: 'https://api.shop.edinmed.cn/', //用户订单
    // commodity: 'https://api.shop.edinmed.cn/',//分享
    // detail: 'https://api.shop.edinmed.cn/',//详情接口
    // lunbo: 'https://api.shop.edinmed.cn/',//轮播接口

    // icom: 'https://goods.shop.edinmed.cn/index.php/',//上传图片服务器

    // // icom: 'http://localgoods.goods.com/index.php/',

    // pay: 'https://api.shop.edinmed.cn/',//支付接口
    // phone: 'https://api.shop.edinmed.cn/', // 手机模块根地址

    // font: 'https://dv-igoods.mb.cms.chuangsiboai.com/index.php/',//字体

    // location: 'https://api.shop.edinmed.cn/', //存数据，h5页面拿
    // shop: 'https://api.shop.edinmed.cn/',
    // file_token: '123456',
    // tempUrl: 'https://api.shop.edinmed.cn/',
    // user: '',//用户信息

    UerUrl: "https://dv-sapi.chuangsiboai.com/",//用户信息

    address: 'https://dv-sapi.chuangsiboai.com/',//收货地址
    Order: 'https://dv-sapi.chuangsiboai.com/', //用户订单
    commodity: 'https://dv-sapi.chuangsiboai.com/',//分享
    detail: 'https://dv-sapi.chuangsiboai.com/',//详情接口
    lunbo: 'https://dv-sapi.chuangsiboai.com/',//轮播接口

    icom: 'https://dv-igoods.chuangsiboai.com/',//上传图片服务器

    // icom: 'http://localgoods.goods.com/index.php/',

    pay: 'https://dv-sapi.chuangsiboai.com/',//支付接口
    phone: 'https://dv-sapi.chuangsiboai.com/', // 手机模块根地址

    font: 'https://dv-igoods.mb.cms.chuangsiboai.com/index.php/',//字体

    location: 'https://dv-sapi.chuangsiboai.com/', //存数据，h5页面拿
    shop: 'https://dv-sapi.chuangsiboai.com/',
    file_token: '123456',
    tempUrl: 'https://dv-sapi.chuangsiboai.com/',
    user: '',//用户信息


  },
  //显示错误信息
  ShowError: function (title, time) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: time
    });
  },

  onLaunch: function () {
    var httpUrl = this.data.httpUrl;
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //登录
    wx.login({
      success: res => {
        wx.setStorage({//将code储存在本地缓存里
          key: "code",
          data: res.code
        });
      }
    })
  },
  globalData: {
    userInfo: null,
    shuliang: [],
    clarity: '',
    role: '',
    wxappName: ''
  }
})
//多张图片上传
function uploadimg(data) {
  var that = this,
    i = data.i ? data.i : 0,//当前上传的哪张图片
    success = data.success ? data.success : 0,//上传成功的个数
    fail = data.fail ? data.fail : 0;//上传失败的个数
  wx.uploadFile({
    url: data.url,
    filePath: data.path[i],
    name: 'file',//这里根据自己的实际情况改
    formData: null,//这里是上传图片时一起上传的数据
    success: (resp) => {
      success++;//图片上传成功，图片上传成功的变量+1
      console.log(resp)
      console.log(i);
      //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
    },
    fail: (res) => {
      fail++;//图片上传失败，图片上传失败的变量+1
      console.log('fail:' + i + "fail:" + fail);
    },
    complete: () => {
      console.log(i);
      i++;//这个图片执行完上传后，开始上传下一张
      if (i == data.path.length) {   //当图片传完时，停止调用          
        console.log('执行完毕');
        console.log('成功：' + success + " 失败：" + fail);
      } else {//若图片还没有传完，则继续调用函数
        console.log(i);
        data.i = i;
        data.success = success;
        data.fail = fail;
        that.uploadimg(data);
      }
    }
  });
}