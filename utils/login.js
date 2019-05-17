var network = require("network.js");
var UerUrl = getApp().data.UerUrl;
function login(req){
  wx.getStorage({
    key: 'code',
    success: function(res) {
      wx.getUserInfo({
        success:function(user){
          wx.getLocation({
            success: function(opo) {
              var id = 0;
              network.request({
                url: UerUrl + 'api/User/AutoLogin',
                data: {
                  code: res.data,
                  share: id,
                  info: JSON.stringify({
                    nick: user.userInfo.nickName,
                    avatar: user.userInfo.avatarUrl,
                    sex: user.userInfo.gender,
                    longitude: opo.longitude,
                    latitude: opo.latitude
                  }),
                },
                success:function(res){
                  console.log(res)
                  var fenx = JSON.parse(res.data).data.openid;
                  getApp().globalData.user = res.data
                  wx.setStorage({//保存个人消息在本地，然后去我的页面中拿到名称和头像
                    key: 'user',
                    data: res.data,
                  })
                }
              })
            },
          })
        }
      })
    },
  })
}
module.exports = {
  login:login
}