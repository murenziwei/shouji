// pages//.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
            statusBarHeight: null,
            itemList: [
              {
                id: 0,
                image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542021371152&di=aff1df5fcd72afb5e57c14294a5e39b4&imgtype=0&src=http%3A%2F%2Fimg06.tooopen.com%2Fimages%2F20171130%2Ftooopen_sy_229311329435.jpg',//图片地址           
                top: 0,//初始图片的位置             
                left: 0,
                x: 150,
                //初始圆心位置，可再downImg之后又宽高和初始的图片位置得出            
                y: 150,
                scale: 1,
                //缩放比例  1为不缩放            
                angle: 0,//旋转角度            
                active: false ,//判定点击状态   
                height:300,
                width:300,
                _lx:0,
                _ly:0,
                lx: 0,
                ly: 0,
                ty:0,
                tx:0,
                rotate:0,
                zindex:10, //层级
                types:"img"
              },
              {
                id: 1,
                image:'http://img.zcool.cn/community/0181845834f4eda8012060c8c95113.JPG@1280w_1l_2o_100sh.png',//图片地址        
                top: 100,//初始图片的位置             
                left: 100,
                x: 150,
                //初始圆心位置，可再downImg之后又宽高和初始的图片位置得出            
                y: 150,
                scale: 1,
                //缩放比例  1为不缩放            
                angle: 0,//旋转角度            
                active: false,//判定点击状态   
                height: 300,
                width: 300,
                _lx: 0,
                _ly: 0,
                lx: 0,
                ly: 0,
                ty: 0,
                tx: 0,
                rotate: 0,
                zindex: 10, //层级
                types: "img"
              },
              {
                id: 2,
                image: 'http://pic.qqtn.com/up/2017-8/201708251107583744489.png',//图片地址        
                top: 100,//初始图片的位置             
                left: 100,
                x: 150,
                //初始圆心位置，可再downImg之后又宽高和初始的图片位置得出            
                y: 150,
                scale: 1,
                //缩放比例  1为不缩放            
                angle: 0,//旋转角度            
                active: false,//判定点击状态   
                height: 300,
                width: 300,
                _lx: 0,
                _ly: 0,
                lx: 0,
                ly: 0,
                ty: 0,
                tx: 0,
                rotate: 0,
                zindex: 10, //层级
                types: "img"
              },
              {
                id: 3,
                text: '还是还是哈哈还是',//图片地址        
                top: 100,//初始图片的位置             
                left: 100,
                x: 150,
                //初始圆心位置，可再downImg之后又宽高和初始的图片位置得出            
                y: 150,
                scale: 1,
                //缩放比例  1为不缩放            
                angle: 0,//旋转角度            
                active: false,//判定点击状态   
                height: 300,
                width: 300,
                _lx: 0,
                _ly: 0,
                lx: 0,
                ly: 0,
                ty: 0,
                tx: 0,
                rotate: 0,
                zindex: 10, //层级
                types: "text",
                direction:"10" //10水平，20垂直
              }
            ],

            //商品规格与值模拟数据
              formatData:[
              //颜色规格数据
              {
                //规格ID
                id: 1,
                //父规格ID               
                parent_id: 0,
                //规格名称      
                format_name: "颜色",
                //当前选择的值的ID 
                select_value: 1,
                //规格的所有值   
                format_value: [
                  {
                    //规格的值的ID
                    id: 1,
                    //规格的值的父值的ID
                    parent_id: 0,
                    //规格的值的显示名称
                    value_name: "红色",
                    //规格的值的真实名称
                    value_show: "红色",
                    //规格的值的编码
                    format_code: "H001",
                    //规格的值的库存
                    format_stock: 0,
                    //规格的值的价格
                    format_price: 0.00,
                    //规格的值的图片
                    format_image:"https://img1.test.com/1.png"
                  },
                  {
                    //规格的值的ID
                    id: 1,
                    //规格的值的父值的ID
                    parent_id: 0,
                    //规格的值的显示名称
                    value_name: "红色",
                    //规格的值的真实名称
                    value_show: "红色",
                    //规格的值的编码
                    format_code: "H001",
                    //规格的值的库存
                    format_stock: 0,
                    //规格的值的价格
                    format_price: 0.00,
                    //规格的值的图片
                    format_image: "https://img1.test.com/1.png"
                  }
                ]
              },
              //尺寸规格数据
              {
                //规格ID
                id: 2,
                //父规格ID               
                parent_id: 1,
                //规格名称      
                format_name: "尺寸",
                //当前选择的值的ID 
                select_value: 3,
                //规格的所有值   
                format_value: [
                  {
                    //规格的值的ID
                    id: 3,
                    //规格的值的父值的ID
                    parent_id: 1,
                    //规格的值的显示名称
                    value_name: "大号",
                    //规格的值的真实名称
                    value_show: "红色,大号",
                    //规格的值的编码
                    format_code: "D001",
                    //规格的值的库存
                    format_stock: 0,
                    //规格的值的价格
                    format_price: 0.00,
                    //规格的值的图片
                    format_image:"https://img1.test.com/1.png"
                  },
                  {
                    //规格的值的ID
                    id: 4,
                    //规格的值的父值的ID
                    parent_id: 2,
                    //规格的值的显示名称
                    value_name: "大号",
                    //规格的值的真实名称
                    value_show: "蓝色,大号",
                    //规格的值的编码
                    format_code: "D002",
                    //规格的值的库存
                    format_stock: 0,
                    //规格的值的价格
                    format_price: 0.00,
                    //规格的值的图片
                    format_image:"https://img1.test.com/2.png"
                  },
                  {
                    //规格的值的ID
                    id: 5,
                    //规格的值的父值的ID
                    parent_id: 1,
                    //规格的值的显示名称
                    value_name: "小号",
                    //规格的值的真实名称
                    value_show: "红色,小号",
                    //规格的值的编码
                    format_code: "X001",
                    //规格的值的库存
                    format_stock: 0,
                    //规格的值的价格
                    format_price: 0.00,
                    //规格的值的图片
                    format_image:"https://img1.test.com/1.png"
                  },
                  {
                    //规格的值的ID
                    id: 6,
                    //规格的值的父值的ID
                    parent_id: 2,
                    //规格的值的显示名称
                    value_name: "小号",
                    //规格的值的真实名称
                    value_show: "蓝色,小号",
                    //规格的值的编码
                    format_code: "X002",
                    //规格的值的库存
                    format_stock: 0,
                    //规格的值的价格
                    format_price: 0.00,
                    //规格的值的图片
                    format_image:"https://img1.test.com/1.png"
                  },
                ]
              },
              //材质规格数据
              {
                //规格ID
                id: 2,
                //父规格ID               
                parent_id: 3,
                //规格名称      
                format_name: "材质",
                //当前选择的值的ID 
                select_value: 7,
                //规格的所有值   
                format_value: [
                  {
                    //规格的值的ID
                    id: 7,
                    //规格的值的父值的ID
                    parent_id: 3,
                    //规格的值的显示名称
                    value_name: "陶瓷",
                    //规格的值的真实名称
                    value_show: "红色,大号,陶瓷",
                    //规格的值的编码
                    format_code: "T001",
                    //规格的值的库存
                    format_stock: 0,
                    //规格的值的价格
                    format_price: 0.00,
                    //规格的值的图片
                    format_image:"https://img1.test.com/1.png"
                  },
                  {
                    //规格的值的ID
                    id: 8,
                    //规格的值的父值的ID
                    parent_id: 4,
                    //规格的值的显示名称
                    value_name: "陶瓷",
                    //规格的值的真实名称
                    value_show: "蓝色,大号,陶瓷",
                    //规格的值的编码
                    format_code: "T002",
                    //规格的值的库存
                    format_stock: 0,
                    //规格的值的价格
                    format_price: 0.00,
                    //规格的值的图片
                    format_image:"https://img1.test.com/2.png"
                  },
                  {
                    //规格的值的ID
                    id: 9,
                    //规格的值的父值的ID
                    parent_id: 5,
                    //规格的值的显示名称
                    value_name: "陶瓷",
                    //规格的值的真实名称
                    value_show: "红色,小号,陶瓷",
                    //规格的值的编码
                    format_code: "T003",
                    //规格的值的库存
                    format_stock: 0,
                    //规格的值的价格
                    format_price: 0.00,
                    //规格的值的图片
                    format_image:"https://img1.test.com/1.png"
                  },
                  {
                    //规格的值的ID
                    id: 10,
                    //规格的值的父值的ID
                    parent_id: 6,
                    //规格的值的显示名称
                    value_name: "陶瓷",
                    //规格的值的真实名称
                    value_show: "蓝色,小号,陶瓷",
                    //规格的值的编码
                    format_code: "T004",
                    //规格的值的库存
                    format_stock: 0,
                    //规格的值的价格
                    format_price: 0.00,
                    //规格的值的图片
                    format_image:"https://img1.test.com/1.png"
                  },
                  {
                    //规格的值的ID
                    id: 11,
                    //规格的值的父值的ID
                    parent_id: 3,
                    //规格的值的显示名称
                    value_name: "塑料",
                    //规格的值的真实名称
                    value_show: "红色,大号,塑料",
                    //规格的值的编码
                    format_code: "S001",
                    //规格的值的库存
                    format_stock: 0,
                    //规格的值的价格
                    format_price: 0.00,
                    //规格的值的图片
                    format_image:"https://img1.test.com/1.png"
                  },
                  {
                    //规格的值的ID
                    id: 12,
                    //规格的值的父值的ID
                    parent_id: 4,
                    //规格的值的显示名称
                    value_name: "塑料",
                    //规格的值的真实名称
                    value_show: "蓝色,大号,塑料",
                    //规格的值的编码
                    format_code: "S002",
                    //规格的值的库存
                    format_stock: 0,
                    //规格的值的价格
                    format_price: 0.00,
                    //规格的值的图片
                    format_image:"https://img1.test.com/2.png"
                  },
                  {
                    //规格的值的ID
                    id: 13,
                    //规格的值的父值的ID
                    parent_id: 5,
                    //规格的值的显示名称
                    value_name: "塑料",
                    //规格的值的真实名称
                    value_show: "红色,小号,塑料",
                    //规格的值的编码
                    format_code: "S003",
                    //规格的值的库存
                    format_stock: 0,
                    //规格的值的价格
                    format_price: 0.00,
                    //规格的值的图片
                    format_image:"https://img1.test.com/1.png"
                  },
                  {
                    //规格的值的ID
                    id: 14,
                    //规格的值的父值的ID
                    parent_id: 6,
                    //规格的值的显示名称
                    value_name: "塑料",
                    //规格的值的真实名称
                    value_show: "蓝色,小号,塑料",
                    //规格的值的编码
                    format_code: "S004",
                    //规格的值的库存
                    format_stock: 0,
                    //规格的值的价格
                    format_price: 0.00,
                    //规格的值的图片
                    format_image:"https://img1.test.com/1.png"
                  },
                ]
              }
            ],
            // 当前手机类型
            phonetype:"",
            // 二维数据
            modelData: [["a","!11"], ["c", "d"]],
            // 当前默认选择
            present:0,
            text:"",
            istext:false, //选择切换
            isdirection:true, //字体方向
            isfonstcolor:"#000000"
    },  

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      let phonetype = wx.getSystemInfoSync();
      console.log(phonetype);
      this.data.phonetype = phonetype.brand +" "+ phonetype.model;
      console.log(this.data.phonetype);
      this.setData({
        phonetype: this.data.phonetype
        })
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

    },


    WraptouchStart: function (e) {

      console.log(e.currentTarget.dataset.selctid);
      // 添加层级





      let selctid = e.currentTarget.dataset.selctid;
        var items = this.data.itemList;

      // for (let i = 0; i<items.length; i++){
      //   items[i].zindex =10;
      // }

      // items[selctid].zindex = items[selctid].zindex + 1;
   
      items[selctid].lx = e.touches[0].clientX;  // 记录点击时的坐标值
      items[selctid].ly = e.touches[0].clientY;
        
        //移动前的角度        
        // console.log(e);
        //获取图片半径
      // this.setData({
      //   itemList: items
      // });    
    },
    WraptouchMove(e) {
        var items = this.data.itemList;
        //记录移动后的位置  
        // let selctid = e.currentTarget.dataset.selctid;
        let index = e.currentTarget.dataset.selctid;
        items[index]._lx = e.touches[0].clientX;
        items[index]._ly = e.touches[0].clientY;

        items[index].left += items[index]._lx - items[index].lx;
          // x方向        
        items[index].top += items[index]._ly - items[index].ly;    
          // y方向        
        items[index].x += items[index]._lx - items[index].lx;        
        items[index].y += items[index]._ly - items[index].ly;
        items[index].lx = e.touches[0].clientX; 
        items[index].ly = e.touches[0].clientY;

         this.setData({//赋值就移动了  
             itemList: items    
        })
        // console.log(items );


    },


    touchStart:function(e){
        var items = this.data.itemList;
        // let index = 0;
        let index = e.currentTarget.dataset.selctid;

        items[index].tx = e.touches[0].clientX;
        items[index].ty = e.touches[0].clientY;
        items[index].anglePre = this.countDeg(items[index].x, items[index].y, items[index].tx, items[index].ty);
        items[index].r = this.getDistancs(items[index].x, items[index].y, items[index].left, items[index].top)
    },
  
    touchMove:function(e){

        var items = this.data.itemList;
        // let index = 0;
        let index = e.currentTarget.dataset.selctid;
        items[index]._tx = e.touches[0].clientX; items[index]._ty = e.touches[0].clientY; 
        //移动的点到圆心的距离  * 因为圆心的坐标是相对与父元素定位的 ，所有要减去父元素的OffsetLeft和OffsetTop来计算移动的点到圆心的距离       
        items[index].disPtoO = this.getDistancs(items[index].x, items[index].y, items[index]._tx - wx.getSystemInfoSync().windowWidth * 0.125, items[index]._ty - 10)

        let salenumber = items[index].disPtoO / items[index].r;
        if (salenumber<2.2){
        items[index].scale = items[index].disPtoO / items[index].r;
          //手指滑动的点到圆心的距离与半径的比值作为图片的放大比例        
          items[index].oScale = 1 / items[index].scale;
        }
       

      
        //图片放大响应的右下角按钮同比缩小         
        //移动后位置的角度        
        items[index].angleNext = this.countDeg(items[index].x, items[index].y, items[index]._tx, items[index]._ty)        //角度差        
        items[index].new_rotate = items[index].angleNext - items[index].anglePre;
        //叠加的角度差        
        items[index].rotate += items[index].new_rotate;
        items[index].angle = items[index].rotate;
        //赋值         
        //用过移动后的坐标赋值为移动前坐标        
        items[index].tx = e.touches[0].clientX;
        items[index].ty = e.touches[0].clientY;
        items[index].anglePre = this.countDeg(items[index].x, items[index].y, items[index].tx, items[index].ty)             //赋值setData渲染       
        this.setData({
            itemList: items
        })


   
    },




    /* *参数1和2为图片圆心坐标 *参数3和4为手点击的坐标  *返回值为手点击的坐标到圆心的角度 */
countDeg: function (cx, cy, pointer_x, pointer_y) {
        var ox = pointer_x - cx;
        var oy = pointer_y - cy;
        var to = Math.abs(ox / oy);
        var angle = Math.atan(to) / (2 * Math.PI) * 360;
        //鼠标相对于旋转中心的角度        
        // console.log("ox.oy:", ox, oy)
        if (ox < 0 && oy < 0)
        //相对在左上角，第四象限，js中坐标系是从左上角开始的，这里的象限是正常坐标系          
        {
            angle = -angle;
        } else if (ox <= 0 && oy >= 0)
        //左下角,3象限          
        {
            angle = -(180 - angle)
        } else if (ox > 0 && oy < 0)
        //右上角，1象限          
        {
            angle = angle;
        } else if (ox > 0 && oy > 0)
        //右下角，2象限          
        {
            angle = 180 - angle;
        }
        // console.log(angle);
        return angle;
        
    },



    getDistancs(cx, cy, pointer_x, pointer_y) {

        var ox = pointer_x - cx;
        var oy = pointer_y - cy;
        return Math.sqrt(ox * ox + oy * oy);

    },







    catchtap(){
        console.log(this.data.itemList);
    },

    rloadphonetype(){

    },


    // 选择项
    selectbtn(event){
      this.data.present = event.currentTarget.dataset.selectitem;
      this.setData({
        present:this.data.present
      })
    },


    closebtn(e){
      let index = e.currentTarget.dataset.selctid;
      console.log(index);
      let items = this.data.itemList;
    },

    bindinput(e){
      this.data.text = e.detail.value;
    },


    // 添加文字
    addtext(){
      this.setData({
        istext:true
      });
    },

    // 字体方向
    selectbtns(){
      if (this.data.isdirection){

        this.setData({ isdirection:false})
      
      }else{
      
        this.setData({ isdirection: true})
      }
    
    },
    
    changecolor(event){
      this.setData({
        isfonstcolor: event.currentTarget.dataset.ys
      })
    }

})