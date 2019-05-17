

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}





/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Nideshop-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        //console.log("success");

        if (res.statusCode == 200) {

          if (res.data.errno == 401) {
            //需要登录后才可以操作

            let code = null;
            return login().then((res) => {
              code = res.code;
              return getUserInfo();
            }).then((userInfo) => {
              //登录远程服务器
              request(api.AuthLoginByWeixin, { code: code, userInfo: userInfo }, 'POST').then(res => {
                if (res.errno === 0) {
                  //存储用户信息
                  wx.setStorageSync('userInfo', res.data.userInfo);
                  wx.setStorageSync('token', res.data.token);

                  resolve(res);
                } else {
                  reject(res);
                }
              }).catch((err) => {
                reject(err);
              });
            }).catch((err) => {
              reject(err);
            })
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function (err) {
        reject(err)
        console.log("failed")
      }
    })
  });
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          //登录远程服务器
          console.log(res)
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        console.log(res)
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

function redirect(url) {

  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}


/**
 * 验证数据长度有效性
 */
function checkStringLength(str, max, min) {
  if (str && str.toString().length <= max && stfr.toString().length >= min) {
    return true
  } else {
    return false
  }
}
/**
 * 首字母大写
 */
function firstLetterUpper(str) {
  let temp = ''.concat(String.fromCodePoint(str[0].toLowerCase().charCodeAt() - 32), str.substr(1))
  console.log(temp)
  return temp
}

/**
 * 检测字符串类型
 * str: 传入待验证的字符串
 * type: 检测类型
 *       string-number : 仅限字母、数字
 *       string-number-hanzi : 仅限中文、字母、汉字
 */
function validStringType(str, type) {
  switch (type) {
    case 'string-number':
      return /^[A-Za-z0-9]+$/.test(str)
    case 'string-number-hanzi':
      return /^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(str)
    case 'email':
      return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(str)
    case 'phone':
      return /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(str)
    default:
      break
  }
}
/**
 * 字符串数组排序：包含中文字符
 */
function sortStringArray(srcArr) {
  return srcArr.sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', { sensitivity: 'base' }))
}
/**
 * 输入Unix时间戳，返回指定时间格式
 */
function calcTimeHeader(time) {
  // 格式化传入时间
  let date = new Date(parseInt(time)),
    year = date.getUTCFullYear(),
    month = date.getUTCMonth(),
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getUTCMinutes()
  // 获取当前时间
  let currentDate = new Date(),
    currentYear = date.getUTCFullYear(),
    currentMonth = date.getUTCMonth(),
    currentDay = currentDate.getDate()
  // 计算是否是同一天
  if (currentYear == year && currentMonth == month && currentDay == day) {//同一天直接返回
    if (hour > 12) {
      return `下午 ${hour}:${minute < 10 ? '0' + minute : minute}`
    } else {
      return `上午 ${hour}:${minute < 10 ? '0' + minute : minute}`
    }
  }
  // 计算是否是昨天
  let yesterday = new Date(currentDate - 24 * 3600 * 1000)
  if (year == yesterday.getUTCFullYear() && month == yesterday.getUTCMonth && day == yesterday.getDate()) {//昨天
    return `昨天 ${hour}:${minute < 10 ? '0' + minute : minute}`
  } else {
    return `${year}-${month + 1}-${day} ${hour}:${minute < 10 ? '0' + minute : minute}`
  }
}
/**
 * post 方法，接受params参数对象
 */
function post(params) {
  let url = params.url,
    header = params.header || {},
    data = params.data;

  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      header: header,
      method: 'POST',
      success: function (data, statusCode, header) {
        resolve({ data, statusCode, header })
      },
      fail: function () {
        reject('请求失败，请重试！')
      }
    })
  })
}


/**
   * 深度克隆friendCata
   */
function deepClone(data) {
  let des = {}
  for (let cataKey in data) {
    let desArr = data[cataKey]

    des[cataKey] = []
    desArr.map(item => {
      let temp = {}
      for (let key in item) {
        temp[key] = item[key]
      }
      des[cataKey].push(temp)
    })
  }
  return des
}


// add in 20190413


const showToast = (title = '加载中...', icon = 'loading', duration = 60000) => {
  wx.showToast({
    title: title,
    mask: true,
    icon: icon,
    duration: duration
  })
}

const hideToast = () => {
  wx.hideToast()
}

const showModal=(obj)=>{
  wx.showModal({
    title: obj.title,
    content: obj.content,
    // showCancel: showCancel,
    // cancelText: cancelText,
    confirmText: obj.confirmText,
    // confirmColor: color.confirmColor,
    // cancelColor: color.cancelColor,
    success: res => {
      return typeof fn == 'function' && obj.fn(res)
    }
  })
}

// const showModal = (title = '系统提示', str = '', showCancel = true, confirmText = '确定', fn, color = {
//   cancelColor: '#999999',
//   confirmColor: '#7D73C3'
// }, cancelText = "取消") => {
//   wx.showModal({
//     title: title,
//     content: str,
//     showCancel: showCancel,
//     cancelText: cancelText,
//     confirmText: confirmText,
//     confirmColor: color.confirmColor,
//     cancelColor: color.cancelColor,
//     success: res => {
//       return typeof fn == 'function' && fn(res)
//     }
//   })
// }

// 用户授权检查
const checkPermission = (type, onSuccess, content) => {
  let that = this
  type = 'scope.' + type;
  wx.getSetting({
    success(getRes) {
      const setting = getRes.authSetting;
      if (setting[type] === false) {
        showModal('温馨提示', '请您授权其相关权限', false, '我知道了', res => {
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
}


module.exports = {
  formatTime,
  formatNumber,

  showModal,
  checkPermission,
  showToast,
  hideToast,

  request,
  redirect,
  showErrorToast,
  checkSession,
  login,
  getUserInfo,
  post
}
