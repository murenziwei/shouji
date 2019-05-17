// pages/index/index.js
var canOnePointMove = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 单指滑动数据
    onePoint:{
      x:  0,
      y:  0
    },

    // 双指滑动数据
    twoPoint:{
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    },

   
    list: [ // 数据
      {
        scale: 1,
        rotate: 16,
        left: 0,
        top: 0,
        image:"http://pic.58pic.com/58pic/14/61/75/90458PICFDU_1024.jpg",

      }
    ],
    // 选择图片
    imglist: [
      'http://pic.58pic.com/58pic/14/61/75/90458PICFDU_1024.jpg',
      'http://pic.58pic.com/58pic/14/61/75/90458PICFDU_1024.jpg',
      'http://pic.58pic.com/58pic/14/61/75/90458PICFDU_1024.jpg',
      'http://pic.58pic.com/58pic/14/61/75/90458PICFDU_1024.jpg',
      'http://pic.58pic.com/58pic/14/61/75/90458PICFDU_1024.jpg'
      
    ], //图像

    index:0,//当前默认选择下标
  
    phonetype: "", // 当前手机类型
    selectmodel: [["a", "!11"], ["c", "d"]],
    present:0, //当前选择
    isMovePoint:false,  //移动状态
    addfont:false //是否第一次添加
  },

  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function(options) {

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

    let phonetype = wx.getSystemInfoSync(); //自动识别系统信息

    this.data.phonetype = phonetype.model;
    this.setData({
      phonetype: this.data.phonetype
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
  onShareAppMessage: function() {

  },


  // 滑动开始
  touchstart: function(e) {

    let onePoint = this.data.onePoint;
    let twoPoint = this.data.twoPoint;

    if (!this.data.isMovePoint){
      
      this.setData({
        isMovePoint:true
      });

    }


    // 单指滑动
    if (e.touches.length < 2) {
      onePoint.x = e.touches[0].pageX * 2;
      onePoint.y = e.touches[0].pageY * 2;
      canOnePointMove = true;
      // 双指滑动
    } else {
      twoPoint.x1 = e.touches[0].pageX * 2;
      twoPoint.y1 = e.touches[0].pageY * 2;
      twoPoint.x2 = e.touches[1].pageX * 2;
      twoPoint.y2 = e.touches[1].pageY * 2;
    }

    this.data.onePoint = onePoint;
    this.data.twoPoint = twoPoint;

  },

  // 手指移动数据
  touchmove: function(e) {
    // console.log(e);
    let onePoint = this.data.onePoint;
    let twoPoint = this.data.twoPoint;
 
    var that = this
    if (e.touches.length < 2 && canOnePointMove) {
      let onePointDiffX = e.touches[0].pageX * 2 - onePoint.x
      let onePointDiffY = e.touches[0].pageY * 2 - onePoint.y
      // msg: '单点移动',

      that.data.list[that.data.index].left = that.data.list[that.data.index].left + onePointDiffX
      that.data.list[that.data.index].top = that.data.list[that.data.index].top + onePointDiffY

      that.setData({
        list: this.data.list
      });

      onePoint.x = e.touches[0].pageX * 2
      onePoint.y = e.touches[0].pageY * 2

    } else if (e.touches.length > 1) {

      console.log(e.touches.length);
      var preTwoPoint = JSON.parse(JSON.stringify(twoPoint));

      // console.log(e);

        twoPoint.x1 = e.touches[0].pageX * 2
        twoPoint.y1 = e.touches[0].pageY * 2
        twoPoint.x2 = e.touches[1].pageX * 2
        twoPoint.y2 = e.touches[1].pageY * 2

        let Pointx_perAngle = preTwoPoint.x1 - preTwoPoint.x2;
        let Pointy_perAngle = preTwoPoint.y1 - preTwoPoint.y2;
        
        let Pointx_curAngle = twoPoint.x1 - twoPoint.x2;
        let Pointy_curAngle = twoPoint.y1 - twoPoint.y2;

      
      // 计算角度，旋转(优先)
      var perAngle = Math.atan2(Pointy_perAngle, Pointx_perAngle) / Math.PI * 180;
      var curAngle = Math.atan2(Pointy_curAngle, Pointx_curAngle) / Math.PI * 180;
   
      // var perAngle = Math.atan((preTwoPoint.y1 - preTwoPoint.y2) / (preTwoPoint.x1 - preTwoPoint.x2)) * 180 / Math.PI;
      // var curAngle = Math.atan((twoPoint.y1 - twoPoint.y2) / (twoPoint.x1 - twoPoint.x2)) * 180 / Math.PI

      // console.log(Math.abs(perAngle - curAngle));      

      if (Math.abs(perAngle - curAngle) > 1) {
        // msg: '旋转',
        let rotate = that.data.list[that.data.index].rotate + (curAngle - perAngle);
        that.data.list[that.data.index].rotate = rotate;
        that.setData({
          list: that.data.list 
        })
        
      } else {
        // 计算距离，缩放
        var preDistance = Math.sqrt(Math.pow((preTwoPoint.x1 - preTwoPoint.x2), 2) + Math.pow((preTwoPoint.y1 - preTwoPoint.y2), 2))
        var curDistance = Math.sqrt(Math.pow((twoPoint.x1 - twoPoint.x2), 2) + Math.pow((twoPoint.y1 - twoPoint.y2), 2))
        // msg: '缩放',

        let scale = that.data.list[that.data.index].scale + (curDistance - preDistance) * 0.005;
        console.log(scale);
        if (scale>=0.2){

          that.data.list[that.data.index].scale = scale;

          that.setData({
            list: that.data.list
          });

          console.log(that.data.list);

        }
       


      }
    }

  },

  // 结束
  touchend: function (e) {
    canOnePointMove = false;
    // this.setData({
    //   isMovePoint: false
    // });

  },

  // 选择项
  selectbtn(event) {
    this.data.present = event.currentTarget.dataset.selectitem;
    this.setData({
      present: this.data.present
    })
  },

  ismovebtn(event){
    console.log(event);
  },


  // 点击左边或右边
  isclickment(event){
    let status = event.currentTarget.dataset.clickstatus;
    console.log(status);
  },

  selectimages(event){

    // 更改目标
    let  select = event.target.dataset.select;
    this.data.index = select

  },

  catchtouchstart(){

  },

  catchtouchmove(){

  },

  // 更改字体方向

  changefont(){

  }

})