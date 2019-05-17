// pages/index/index.js
var canOnePointMove = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    istop:0,
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

   
    list: [ // 关键数据
      // {
      //   scale: 1,
      //   rotate: 0,
      //   left: 110,
      //   top: 110,
      //   image:"http://img3.3lian.com/2013/v10/45/d/5.jpg",
      //   imageheight:200,
      //   types:"img"
      // },
      // {
      //   scale: 1,
      //   rotate: 0,
      //   left: 310,
      //   top: 160,
      //   types: "text",
      //   text: "哈哈哈",
      //   width: 0,
      //   status: 0,
       
      //   color: "#00000",
      //   typeface: "",
      //   height: 33
      // }  
    ],

    // 选择图片
    imglist: [], //图像
    index: 0,//当前默认选择图片下标
    specifications:[], //规格数据
    
    phonetype: "", // 当前手机类型
    selectmodel: [,],

    present:1, //当前nav选择
    isMovePoint:false,  //移动状态
    addfont:false, //是否第一次添加
    animation:null, //动画效果
    showfont:true, //字体动画
    textconter:"", //临时地址存储
    selectstatus:[], //选择规格数据
    ishowstatus:true, //规格显示与否
    price:0, //商品价格
    mode_phone:[], //手机品牌
    phone_type:[], //手机型号
    basephonemodel:null, //手机原始数据
    basephoneid:0, //品牌记录
    basenamevale:0, //型号记录
    phonebasetype:null, //自动加载的
    // 下单、
    goods_id:1,
    brand_id:0,  //自动父级ai
    model_code:"", //手机型号值
    value_name:"", //规格值

    iswindows:true, //是否显示编辑
    fontstatus:0, //字体选择状态
    roadshowfont:true,
    roadtextconter:"", //修改临时
    star:[1,1,1,1,1], //清晰度
    defaluetype:"",
    autoSelectStatus:false,
    xuan:0
  },

  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function(options) {

    if (options.share) {
      wx.setStorageSync('share', options.share);
    }
  
    console.log(options,'options');
    let self =this;
    if (options.image){
      wx.showLoading({
        title: '加载中...',
      })
      wx.getImageInfo({
        src: options.image,
        success(res) {

          //处理图片比例高度
          let height = Number.parseFloat((res.height / res.width) * 300).toFixed(0);
          
          self.data.list.push(options);
          self.setData({
            list: self.data.list,
            uploadImg: options.image
          })
          wx.hideLoading();
        }
        });
    
     

    }


    

    // 默认规格
    wx.request({
      url: 'https://dv-sapi.chuangsiboai.com/index.php/Api/Format/GetGoodsFormat', //
      data: {
        id: 1
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {

        let list = res.data.data;
        // console.log(list);

        for (let i = 0; i < list.length; i++) {

          self.data.selectstatus.push({
            status: false,
            values: null,
            format_value: null
          })

        }


        self.setData({
          specifications: list
        });



      }
    });


    



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    let self = this;
    wx.loadFontFace({
      family: "HYLiLiangHeiJ",
      source: "url(https://dv-igoods.mb.cms.chuangsiboai.com/HYLiLiangHeiJ.ttf)",
      success: function () { }
    });




    let phonetype = wx.getSystemInfoSync(); //自动识别系统信息
    


    this.data.phonetype = phonetype.model;

    console.log(this.data.phonetype);






    let strphone = this.data.phonetype;
    // 查找位置
    if (strphone.indexOf("<") == -1) { //不存在

      if (strphone.indexOf("(") == -1) {

        this.setData({
          phonetype: this.data.phonetype
        });

      } else {

        let arrstring = strphone.split("<");
        this.setData({
          phonetype: arrstring[0]
        });
      }



    } else { //存在

 
     
       let arrstring = strphone.split("<");

      if (arrstring[0].indexOf("（") == -1) {
        
        let arrstrings = arrstring[0].split("(");
   
        this.setData({
          phonetype: arrstrings[0]
        });

      }else{
   
        this.setData({
          phonetype: arrstring[0]
        });

      }
      
      
      if (this.data.phonetype == "iPhone X ") {

        this.setData({
          istop: 14
        })
        console.log(this.data.phonetype,11);
        console.log(this.data.istop, 11);
      }


     
      // console.log(arrstring[0]);
    }

 


    // 自动识别手机
    let model = this.data.phonetype;
    let brand = phonetype.brand;
    console.log(model);
    wx.request({
      url: 'https://dv-sapi.chuangsiboai.com/index.php/Api/Image/getOneModelCode', //
      data: {
        model_code: model,
        brand:brand
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        
        if (res.data.modelStatus == 0){
          self.setData({
              phonetype:"自动识别失败，手动选择",
             
          })
        }else{

          self.data.autoSelectStatus=true;
          self.setData({
            phonetype: res.data.ModelList.data.model_name,

          })


        }
        // self.data.autoSelectStatus = true;
        console.log(res);
        self.data.brand_id = res.data.ModelList.data.brand_id;
        self.data.model_code = res.data.ModelList.data.id;
        self.data.defaluetype = res.data.ModelList.data.model_name; //存假的
        self.data.phonebasetype = res.data.ModelList.data;

        self.setData({
          phonebasetype: self.data.phonebasetype
        });

        

      }
    });

 




  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    // if (!wx.getStorageSync('user')){

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

    var openid = wx.getStorageSync('user').openid;
    return {
      title: '分享获得会员币',
      desc: '分享给好友',
      path: '/pages/otherphone/otherphone?share=' + openid
    }
  },


  // 滑动开始
  touchstart: function(e) {

 

    if (!this.data.isMovePoint){ //是否滑动
      
      this.setData({
        isMovePoint:true
      });

    }

    if (this.data.list.length > 0){

      let onePoint = this.data.onePoint;
      let twoPoint = this.data.twoPoint;

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
    }
   

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
          that.changescale(scale);
        }
       


      }
    }

  },

  // 结束
  touchend: function (e) {
    canOnePointMove = false;
  

  },

  // 选择项
  // selectbtn(event) {
  //   this.data.present = event.currentTarget.dataset.selectitem;
  //   this.setData({
  //     present: this.data.present
  //   })
  // },

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
    let  select = event.target.dataset;
    this.data.index = select.select;

    console.log(select.types =="img");
    if (select.types == "img"){  //点击显示效果
      this.animationshow();
      this.setData({
        iswindows: true,
        roadshowfont:true
      })
    } if (select.types == "text"){
      this.setData({
        iswindows:false
      });
      this.animationshow(2);
    }
 
  },

  catchtouchstart(){
    this.setData({
      isMovePoint: false
    });
  },

  catchtouchmove(){

  },

  // 更改字体方向

  changefont(){

  },


  // 保存按钮
  savebtn(){
    // addtext
    this.setData({
      addfont:true
    });
  },

  // 文字输入
  textinput(event){
    this.data.addtext = event.detail.value;
  },

  // 上传图片
  btnsavbtn(event){
    
    
    // 选择类型
    let selecttype = event.currentTarget.dataset.selecttype;
  
    // 获取图片信息
    let slef = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths[0]);
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success(res) {

            //处理图片比例高度


            let height = Number.parseFloat((res.height / res.width) * 300).toFixed(0);
            slef.definition(res.width);
            slef.phonequery(res.width);
            // slef.data.list[slef.data.index].imageheight = height;
            // 获取上传图片的远程地址

              wx.showLoading({
                title: '加载中',
              })

                wx.uploadFile({
                  url: 'https://dv-sapi.chuangsiboai.com/index.php/Api/Image/uploadFile', 
                  filePath: tempFilePaths[0],
                  name: 'img',
                  success(res) {
                    // 获取上传后的地址
                    const data = res.data
                    let img = JSON.parse(data).path;
            
                    console.log(selecttype);  //1为第一次，0为重新上传
                    slef.setData({
                      uploadImg: img
                    })
                  
                    if (selecttype == 1){
                      
                        if (slef.data.list.length >= 1){ //添加了字体或者更改图片
                          let count = false; //是否存在图片
                          let list = slef.data.list;

                          for (let i = 0; i < list.length; i++) { //查看有没有存在一个图片
                            if (list[i].types == "img"){ //存在一张
                              count = true;
                              slef.data.list[i].image = img;
                              slef.data.list[i].imageheight = height;
                            }
                          }


                          if (!count){
                            let option = {
                              scale: 1.4,
                              rotate: 0,
                              left: 222,
                              top: 154,
                              image: img,
                              imageheight: height,
                              types: "img"
                            }
                            slef.data.list.push(option);
                          }

                      
                        } else if (slef.data.list.length == 0){
                          console.log("长度为0");
                          let option = {
                            scale: 1.4,
                            rotate: 0,
                            left: 222,
                            top: 154,
                            image: img,
                            imageheight: height,
                            types: "img"
                          }
                          slef.data.list.push(option);
                        }
                        
                      // 对重复上传和是否第一次处理
                    } else if (selecttype == 0){
                      // 因为只能存在一张图片，所以查找赋值
                      for (let i = 0; i < slef.data.list.length; i++){
                          if (slef.data.list[i].types == "img"){
                            slef.data.list[i].image = img;
                            slef.data.list[i].imageheight = height;
                          }
                      }
                    }
                      slef.setData({
                        list: slef.data.list
                      });
                      slef.animationshow();
                      wx.hideLoading();
                      
                  }
                });


  
        
          }
        })

      }
    })

  },

  // 添加文字
  addtext(str, screenWidth){

    let slef = this;
    let option = {

          scale: 1,
          rotate: 0,
          left: 310,
          top: 160,
          types:"text",
          text: str,
          width: 0,
          status:0,
          window_w: screenWidth, //屏幕宽度
          color:"#000000",
          typeface:"HYLiLiangHeiJ.ttf",
          height: 33,
          fefontname:"HYLiLiangHeiJ"
    }

    slef.data.list.push(option);
   
   
   // 处理节点宽度
    slef.setData({
      list: slef.data.list
    });

    // 统计字体总数
    let fonslistcount = 0; 
    for (let i = 0; i < slef.data.list.length; i++) {
      if (slef.data.list[i].types == "text"){
        fonslistcount ++;
      }
    }
    console.log(fonslistcount);
    // 处理图片和文字之间的关系
    let index = fonslistcount-1;
    let listlength = slef.data.list.length-1;
    let query = wx.createSelectorQuery().selectAll('.image-font-box').boundingClientRect(function (res) {
      let font = res;
      console.log(res);
      console.log(index);
      for (let i = 0; i < font.length;i++){
        if (index == i){
          slef.data.list[listlength].width = res[index].width;
        }
        slef.setData({
          list: slef.data.list
        });
      }
        
    }).exec();




  },


  //提交订单 
  saveorderphone(){
    

    console.log(111);
    this.setData({
      ishowstatus:false
    })
    // console.log(this.data.list);

  






  },
  //更改选择 
  selectaddphtone(event){
    // console.log(event.currentTarget.dataset.selectphome);
    // console.log(event.currentTarget.dataset.index);
    let selectData = event.currentTarget.dataset.selectphome;
    let index = event.currentTarget.dataset.index;
    let self = this;
    for (let i = 0; i < self.data.imglist.length;i++){
      if (i == index){
        self.data.list[self.data.index].image = selectData.img;
        self.data.list[self.data.index].imageheight = selectData.height;
        self.setData({
          list: self.data.list
        })
    
      }
    }

  },

  // 预览
  

  //删除list图片
  // deleteimagebtn(event){
    
  //   let indexs = event.currentTarget.dataset.delectindex;
  //   console.log(event);
  //   for (let i = 0; i < this.data.imglist.length; i++){
  //     if (indexs == i){       
  //       //删除图片列表
  //       let carList = this.data.imglist;
  //       carList.splice(indexs, 1);
  //       // console.log();
  //       this.setData({
  //         imglist: carList
  //       });
        

  //     }
  //   }


  // },


  // 选取机型
  rloadphonetype(event){
    console.log('你的气');
    console.log(event);
    
    let select =  event.detail;
    let selectlist = this.data.basephonemodel.AllBrand.data;
    let model_code = this.data.basephonemodel.OneList.data;
    let self = this;
    if (select.column == 0){
      this.data.selcetpid = selectlist[select.value].id; //父级id
      wx.request({
        url: 'https://dv-sapi.chuangsiboai.com/index.php/Api/Image/getOneModelType', //
        data: {
          brand_id: self.data.selcetpid
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(res) {

          console.log(res);
          // 取出每项数据
          let list = res.data.ModelList.data;
          let mep = [];
          for (let item of list) {
            mep.push(item.model_name);
          }
        
          self.data.selectmodel[1] = mep; //存入显示
            self.setData({
              selectmodel: self.data.selectmodel,
              phonetype: mep[0],
              'basephonemodel.OneList.data': list
            
          });

            console.log(self.data.selectmodel);

            wx.request({
              url: 'https://dv-sapi.chuangsiboai.com/index.php/Api/Image/getOneModelCodeId', //
              data: {
                model_code: list[0].id
              },
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success(res) {
                console.log(res);
                self.data.phonebasetype = res.data.ModelList.data;
                self.setData({
                  phonebasetype: self.data.phonebasetype,
                  phonetype: mep[0],
                  defaluetype: mep[0],
                
                })

              }
            });



          }
         

        
      });


    }
    if (select.column == 1) {

      console.log(select);
    
      let list = this.data.basephonemodel.OneList.data;
      console.log(list[select.value].id);
      let subvaleuname = this.data.selectmodel[1][select.value] //二级的名字
      this.data.subvaleu = list[select.value].id //二级id
      // console.log(self.data.phonebasetype);
      console.log(this.data.subvaleu);
      console.log(subvaleuname);
      console.log(this.data.selectmodel[1]);
          wx.request({
            url: 'https://dv-sapi.chuangsiboai.com/index.php/Api/Image/getOneModelCodeId', //
            data: {
              model_code: self.data.subvaleu
            },
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success(res) {
              console.log(res);
              self.data.phonebasetype = res.data.ModelList.data;
              self.setData({
                phonebasetype:self.data.phonebasetype,
                phonetype: subvaleuname,
                defaluetype: subvaleuname
              })
            
            }
          });





        

    }

   

    if (this.data.selcetpid){
      this.data.brand_id = this.data.selcetpid;
    }else{
      this.data.selcetpid = selectlist[0].id;
    }
  
    this.data.model_code = this.data.subvaleu;
    // console.log(this.data.brand_id);
    // console.log(this.data.brand_id, this.data.phonetype);
    //更改手机模型
   


  },

  // 显示图片上传,传2隐藏
  animationshow(status=1){

    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease-in',
    });

    // this.animation = animation;
    if (status == 1){
      animation.translateY(-80).step()
    }else{
      animation.translateY(80).step()
    }
    

    this.setData({
      animation: animation.export()
    })


  },

  // 确定图片选择
  saveclickbtn(){

    // this.setData({
    //   isMovePoint: false
    // });
    
    this.animationshow(2);
  },

  // 删除图片
  deletephonebtn(event){
    
    let select = event.currentTarget.dataset;
    let types = select.types;
    let carList = this.data.list;
    carList.splice(select.select, 1);
    this.setData({
      list:this.data.list,
      star:[]
    });
    if (types == "img"){
      this.saveclickbtn(2);
     
    }
    if (types == "text"){
      this.setData({
        iswindows:true,
        roadshowfont:true
      })
    }
   
  },

  // 显示字体添加
  addinputbox(){
   
    this.setData({
      showfont:false
    });
  },
  // 关闭字体添加
  hiddenbtn(){


    if (this.data.textconter == "" || this.data.textconter == null){

      wx.showLoading({
        title: '未输入任何字呢',
      });

      setInterval(res=>{
        wx.hideLoading();
      },2000)

      this.setData({
        showfont: true
      });

    }else{
      

      let ststem = wx.getSystemInfoSync();
      this.addtext(this.data.textconter, ststem.screenWidth);
      this.setData({
        showfont: true
      });
    }

 

  },

  // 用户输入值
  bindinput(event){
    this.data.textconter = event.detail.value;
    this.setData({
      textconter: this.data.textconter
    })
  },

  catchtouchmoveselect(){

  },
  // 选择素材
  selectotherphone(){
    wx.switchTab({
      url: '../otherphone/otherphone'
    })
  
    console.log(1);
  },



  // 处理清晰度问题
  phonequery(width){

    let basewidth = 375;
  },



  // 选择保存选择的数据
  selectsavebtn(){

    let self = this;    
    let list = this.data.selectstatus;
    let status = true;
    for (let i = 0; i < list.length; i++){
      if (list[i].status == false || list[i].status == "false" ){
          wx.showLoading({
            title: '未选好规格',
          });
          status = false;
          setTimeout(res => {
            wx.hideLoading();
          }, 1000);
      }
    }
    // 都选择了执行代码
    if (status){
      
      this.setData({
        ishowstatus: true
      });

      let str = "";
      console.log(this.data.selectstatus);
      let selec = this.data.selectstatus;
      for (let item of selec){
        str += item.values+","
      }
      let newstr = str.substring(0, str.length - 1);  
      self.data.value_name = newstr;
      wx.showLoading({
        title: '计算价格中',
      })
      wx.request({
        url: 'https://dv-sapi.chuangsiboai.com/index.php/Api/Format/getFormatPrice',
        data: {
          "goods_id":1,
          "value_name": newstr
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        method: 'post',
        success: function(res) {
          self.data.price = res.data.data.format_price;
          self.setData({
            price: self.data.price
          })
          wx.hideLoading();
        }
      })

      console.log(newstr);

    }







  },
  // 选择数据
  selctitenbtn(event){
 
    let item = event.currentTarget.dataset;
    this.data.selectstatus[item.index].status = true; //选择状态
    this.data.selectstatus[item.index].values = item.value_name;
    this.data.selectstatus[item.index].format_value = item.format_value;
    console.log(item);
    this.setData({
      selectstatus: this.data.selectstatus
    })


  },

  // 获取图片，立即定制
  savephonebtn(){
    
    let self = this;
    // wx.showLoading({
    //   title: '生成中',
    // });


    // console.log(self.data.defaluetype);
    // console.log(wx.getSystemInfoSync().model);
    // console.log(JSON.stringify(self.data.list));
    if (this.data.autoSelectStatus == true && this.data.model_code != "未识别"){

  
      if (this.data.value_name == '') {
        wx.showLoading({
          title: '未选择规格',
        });

        setTimeout(res => {
          wx.hideLoading();
        }, 2000)
      } else {

        if (this.data.list.length > 0) {


          // console.log(self.data.defaluetype);
          // console.log(wx.getSystemInfoSync().model);
          // console.log(JSON.stringify(self.data.list));

          wx.showLoading({
            title: '加载中',
          });
          let self = this;

          console.log(self.data.model_code);
          console.log(JSON.stringify(self.data.list))
          wx.request({
            url: 'https://dv-sapi.chuangsiboai.com/index.php/Api/Image/getPictrue',
            data: {
              model: wx.getSystemInfoSync().model,
              brand: wx.getSystemInfoSync().brand
            },
            method: "post",
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success(res) {
              // console.log(res.data.info)
              let info = res.data;
              let str = info.info.bottom; //图片信息
              // let str = self.data.uploadImg
              let top = info.info.no_border;
              console.log(self.data.goods_id);
              console.log(self.data.brand_id);
              console.log(self.data.model_code);
              console.log(self.data.value_name);

              wx.request({
                url: 'https://dv-sapi.chuangsiboai.com/index.php/api/Image/booking_string',
                data: {
                  goods_id: 1,
                  brand_id: self.data.brand_id,
                  model_code: self.data.model_code,
                  value_name: self.data.value_name
                },
                method: "post",
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                success(res) {
                  wx.hideLoading();
                  // 调转
                  console.log(res);
                  let list = res.data.AllBrand;

                  // console.log(this.data.list);
                  wx.navigateTo({
                    url: '../components/dingdan/dingdan?img=' + str + "&value_show=" + list.format_show + "&format_price=" + self.data.price + "&sheb=" + list.sheb + "&goods_name=" + list.goods_name + "&spbs=" + 1 + "&brand_name=" + list.brand_name + "&model_name=" + list.model_name + "&brand_id=" + list.brand_id + "&format_id=" + list.format_id + "&format_code=" + list.format_code + "&format_show=" + list.format_show + "&xiangou=" + list.xiangou + '&made_type=' + list.made_type + '&made_image=' + [] + '&type=' + 1 + '&is_format=' + list.is_format + '&model_id=' + list.model_id,
                  })

                }
              });


              // img = https://dv-sapi.chuangsiboai.com/result/460775.jpg&gg=绿,小&price_sale=123.00&sheb=iPhone  iPhone 6&goods_name=手机壳定制&spbs=1&brand_name=iPhone&model_name=5s&brand_id=1&format_id=95&format_code=123&format_show=绿,小&xiangou=12321321&made_type=1&made_image=&type=0&is_format=1&model_id=1

            }
          });

        } else {
          wx.showLoading({
            title: '尚未添加图片或文字',
          });

          setTimeout(res => {
            wx.hideLoading();
          }, 2000)
        }

      }



    }else{
      wx.showLoading({
        title: '请选择机型',
      });

      setTimeout(res=>{
        wx.hideLoading()
      },2000)
    }



  

  

  
  },

  // 修改
  rloadingtext(){
    
    console.log(this.data.iswindows);
    this.setData({
      iswindows:true
    })
  },

  setColorbtn(event){

    let color = event.target.dataset.color;
    let indexs = this.data.index;
    let list = this.data.list;

    for (let i = 0 ;i<list.length ;i++){
      if (i == indexs ){

        list[i].color = color;
        this.setData({
          list:this.data.list
        });

      }
    }
    // console.log(color, indexs);

    // color: "#00000",
    //   typeface: ""

  },
  // 选择字体
  selectbtn(event){
    
  
    let color = event.target.dataset.color;
    let indexs = this.data.index;
    let selectfont = event.currentTarget.dataset.select;
    let list = this.data.list;
    let self = this;
    // 字体
  
    let fonttype = "";
    let fontname = "";
    let fefontname = "";
    if (selectfont == 0){ //默认
      fefontname = "HYLiLiangHeiJ"
      fontname = "HYLiLiangHeiJ.ttf";
      fonttype ="https://dv-igoods.mb.cms.chuangsiboai.com/HYLiLiangHeiJ.ttf";
    }
    if (selectfont == 1){ 
      fefontname = "benmo"
      fonttype = "https://dv-igoods.mb.cms.chuangsiboai.com/benmo.ttf";
      fontname = "benmo.ttf";
    }
    if (selectfont == 2){
      fefontname = "yinbi"
      fonttype ="https://dv-igoods.mb.cms.chuangsiboai.com/yinbi.ttf";
      fontname = "yinbi.ttf"
    }

    if (selectfont == 3) {
      fonttype = "https://dv-igoods.mb.cms.chuangsiboai.com/tianxiang.ttf";
      fontname = "tianxiang.ttf"
      fefontname = "tianxiang"
    }

    if (selectfont == 4) {
      fonttype = "https://dv-igoods.mb.cms.chuangsiboai.com/jiesi.ttf";
      fontname = "jiesi.ttf"
      fefontname = "jiesi"
    }
    if (selectfont == 5) {
      fonttype = "https://dv-igoods.mb.cms.chuangsiboai.com/guiti.ttf";
      fontname = "guiti.ttf"
      fefontname = "guiti"
    }
  
    // if (selectfont != 0){
      
      wx.showLoading({
        title: '加载字体..',
      })

      wx.loadFontFace({
        family: fefontname,
        source: "url(" + fonttype + ")",
        success: function () {


          for (let i = 0; i < list.length; i++) {
            if (i == indexs) {

              list[i].fefontname = fefontname;
              list[i].typeface = fontname;
              self.setData({
                list: self.data.list,
                fontstatus: selectfont
              });
              wx.hideLoading();

            }
          }


        }


      });

    // }

    // console.log(111);

    // console.log("url(" + fonttype + ")");

    

  },

  // 修改字体
  reloadfont(){
    
    let indexs = this.data.index;
    let list = this.data.list;

    for (let i = 0; i < list.length; i++) {
      if (i == indexs) {

        let text = list[i].text;
        this.setData({
          roadtextconter: text
        });

      }
    }

    // roadtextconter

    this.setData({
      iswindows:true,
      roadshowfont:false
    });

   

  },

  // 输入数据
  roadbindinput(event){
    this.data.roadtextconter = event.detail.value;
  },

  // 修改确认
  roadhiddenbtn(){

    let indexs = this.data.index;
    let text = this.data.roadtextconter;
    let list = this.data.list;
    let self = this;
    let fontindex = 0;
    let scale = 1;
    let rotate = 0;

    wx.showLoading({
      title: '修改中...',
    });

    for (let i = 0; i < list.length; i++) {
      if (i == indexs) {
        list[i].text = text;
        fontindex = i;
        scale = list[i].scale;
        rotate = list[i].rotate;

        self.data.list[i].scale = 1;
        self.data.list[i].rotate = 0;
        
        this.setData({
          list: list,
          roadshowfont:true
        });

      }
    }


    
    let query = wx.createSelectorQuery().selectAll('.set-images-fix').boundingClientRect(function (res) {
      let font = res;
      console.log(font);
      console.log(fontindex);
      // console.log(scale);
      let width = res[fontindex].width;
      let height = res[fontindex].height;
      list[fontindex].width = width;
      list[fontindex].height = height;

      self.setData({
        list:list
      });

      setTimeout(res=>{

        list[fontindex].scale = scale;
        list[fontindex].rotate = rotate; 
        self.setData({
          list: list
        });
        wx.hideLoading();
      },1000);

        // self.data.list[fontindex].scale = scale;
   

    }).exec();
  },

  // changetext(event){

  //   // wx.showLoading({
  //   //   title: '修改中...',
  //   // });
  //   let indexs = event.currentTarget.dataset.select;
  //   console.log(indexs);
  //   let list = this.data.list;
  //   let self = this;
  //   let scale = 1;
  //   let rotate = 0;

  //   for (let i = 0; i < list.length; i++) {
  //     if (i == indexs) {

  //       list[i].scale = 1;
  //       list[i].rotate = 0;

  //       if (list[i].status == 0){
  //         list[i].status = 1;
  //       }else{
  //         list[i].status = 0;
  //       }

  //       this.setData({
  //         list: list
  //       });

  //       let query = wx.createSelectorQuery().selectAll('.image-font-box').boundingClientRect(function (res) {
  //         let font = res;
  //         let width = font[indexs].width;
  //         let height = font[indexs].height;

  //         self.data.list[indexs].height = Number.parseInt(height) ;
  //         self.data.list[indexs].width = Number.parseInt(width);
  //         self.setData({
  //           list: self.data.list
  //         });

  //         setTimeout(res => {
  //           wx.hideLoading();
  //         }, 1000)
        


  //       }).exec();
        
  
  //     }
  //   }

  // },

  definition(width){

    let star = 1;
    if (width > 375){
      star = 5;
    } else if (width<=375 && width>187){
      star = 4;
    }else if(width <=187 && width>94){
      star = 3;
    }else{
      star = 2;
    }

    let array = new Array();

    for (let i = 0; i < star; i++){
      array.push(1);
    }

    this.setData({
      star: array
    })
  },
  
  changescale(scale) {

    let array = new Array();
  
    if (scale <= 1 ){

      for (let i = 0; i < 5; i++) {
        array.push(1);
      }
  
    } else if (scale > 1 && scale<=2){

      for (let i = 0; i < 4; i++) {
        array.push(1);
      }
 
    } else if (scale > 2 && scale <= 3){
      for (let i = 0; i < 3; i++) {
        array.push(1);
      }
    } else if (scale > 3 && scale <= 4){

      for (let i = 0; i < 2; i++) {
        array.push(1);
      }
    } else if (scale > 4 && scale <= 5) {
      for (let i = 0; i < 1; i++) {
        array.push(1);
      }
    }else{
      
      for (let i = 0; i < 1; i++) {
        array.push(1);
      }

    }

    this.setData({
      star: array
    });










    console.log(scale);
    // if (scale => 5){
     
    // }
    // if (scale == 4) {
    
    // }
    // if (scale == 3) {
      
    // }
    // if (scale == 2) {
      
    // }
    // if (scale == 1) {
     
    // }

  



  },


  // 确定时处理信息
  bindchangebtn(event){
    console.log(event.detail.value);
    console.log(this.data.basephonemodel)
    let number = event.detail.value;
    let phone = this.data.basephonemodel.AllBrand.data[number[0]].brand_name
    let brand_id = this.data.basephonemodel.AllBrand.data[number[0]].id
    // let phone = this.data.basephonemodel.AllBrand.data[number[0]].brand_name,
    let type = this.data.basephonemodel.OneList.data[number[1]].model_name
    let typeid = this.data.basephonemodel.OneList.data[number[1]].id



    this.data.phonebasetype.brand_id = brand_id;
    console.log(brand_id);
    console.log(phone, type);
    let listtype = this.data.basephonemodel.OneList.data;
    console.log(listtype);

    let self = this;
    wx.request({
      url: 'https://dv-sapi.chuangsiboai.com/index.php/Api/Image/getOneModelCodeId', //
      data: {
        model_code: typeid
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        console.log(res.data.ModelList.data);
        self.data.phonebasetype = res.data.ModelList.data;
        self.setData({
          phonetype: type,
          model_code: typeid,
          defaluetype: type,
          autoSelectStatus: true,
          phonebasetype: self.data.phonebasetype,
          brand_id: brand_id
        })
      }
    });


 

  }



})