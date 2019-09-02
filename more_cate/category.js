// pages/goods_class/goods_class.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title_info: '亲，左滑可删除和排序哦~',
    showIndex: 0,
    showIndex_thr: 0,
    height: 0,
    cate_list: [], //分类列表
    startX: 0, //开始坐标
    startY: 0, //开始坐标
  },

  //点击展示隐藏下级
  showSelect(e){
    var click_pid = e.currentTarget.dataset.pId
    var click_id = e.currentTarget.dataset.id
    if ((click_pid == 0 && click_id == this.data.showIndex) || (click_pid != 0 && click_id == this.data.showIndex_thr)){
      click_id = 0 
    }
    this.setData({
      showIndex: click_pid == 0?click_id:click_pid,
      showIndex_thr: click_id,
    })
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    this.setData({
      startX: e.changedTouches[0].clientX,//开始X坐标
      startY: e.changedTouches[0].clientY,//开始Y坐标
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引（多级）
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      indexs = new Array(), //当前索引数组
      isTouchMove_status = false; //删除按钮显示状态 true显示 false隐藏

    //索引字符串分割索引数组
    if (index.toString().indexOf('-') === -1) {
      indexs.push(index)
    } else {
      indexs = index.split("-");
    }

    //判断是否显示按钮
    if (touchMoveX <= startX) {
      isTouchMove_status = true;
    } else {
      isTouchMove_status = false;
    }

    //更改当前索引显示状态
    if (indexs.length === 3) {
      that.data.cate_list[indexs[0]]['sub'][indexs[1]]['sub'][indexs[2]].isTouchMove = isTouchMove_status
    } else if (indexs.length === 2) {
      that.data.cate_list[indexs[0]]['sub'][indexs[1]].isTouchMove = isTouchMove_status
    } else {
      that.data.cate_list[indexs[0]].isTouchMove = isTouchMove_status
    }

    //更新数据
    that.setData({
      cate_list: that.data.cate_list
    })
  },
  //恢复当前移动
  renewCurMove: function (e) {
    if (e.length === 3) {
      this.data.cate_list[e[0]]['sub'][e[1]]['sub'][e[2]]['isTouchMove'] = false
    } else if (e.length === 2) {
      this.data.cate_list[e[0]]['sub'][e[1]]['isTouchMove'] = false
    } else {
      this.data.cate_list[e[0]]['isTouchMove'] = false
    }
    
    this.setData({
      cate_list: this.data.cate_list
    })
  },
  //  左滑删除事件
  del: function (e) {
    var indexs = new Array, index = e.currentTarget.dataset.index
    if (index.toString().indexOf('-') === -1) {
      indexs.push(index)
    } else {
      indexs = index.split("-");
    }

    if (indexs.length === 3) {
      this.data.cate_list[indexs[0]]['sub'][indexs[1]]['sub'].splice(indexs[2], 1)
    } else if (indexs.length === 2) {
      this.data.cate_list[indexs[0]]['sub'].splice(indexs[1], 1)
    } else {
      this.data.cate_list.splice(index, 1)
    }

    this.setData({
      cate_list: this.data.cate_list
    })
  },
  
  //左滑移动事件
  handleSort(e) {
    var that = this,
      indexs = new Array,
      index = e.currentTarget.dataset.index,
      change_index = 0,
      type = e.currentTarget.dataset.type,
      change_arr = [];

    if (index.toString().indexOf('-') === -1) {
      indexs = [index]
    } else {
      indexs = index.split("-");
    }

    if (type == "up") {
      change_index = parseInt(indexs[(indexs.length - 1)]) - 1
    } else {
      change_index = parseInt(indexs[(indexs.length - 1)]) + 1
    }

    if (indexs.length === 3) {
      change_arr = this.data.cate_list[indexs[0]]['sub'][indexs[1]]['sub'][change_index]
    } else if (indexs.length === 2) {
      change_arr = this.data.cate_list[indexs[0]]['sub'][change_index]
    } else {
      change_arr = that.data.cate_list[change_index]
    }

    if (change_arr == undefined || change_arr == null) {
      wx.showToast({
        title: "当前已经是最" + (type == "up" ? "上" : "下")+"面了",
        icon: 'none'
      })
    } else {
      if (indexs.length === 3) {
        that.data.cate_list[indexs[0]]['sub'][indexs[1]]['sub'] = that.swapArray(that.data.cate_list[indexs[0]]['sub'][indexs[1]]['sub'], indexs[2], change_index)
      } else if (indexs.length === 2) {
        that.data.cate_list[indexs[0]]['sub'] = that.swapArray(that.data.cate_list[indexs[0]]['sub'], indexs[1], change_index)
      } else {
        that.data.cate_list = that.swapArray(that.data.cate_list, indexs[0], change_index)
      }
      
      indexs[(indexs.length - 1)] = change_index
      that.setData({
        cate_list: that.data.cate_list
      })
    } 
    that.renewCurMove(indexs)
  },

  //数组元素调换
  swapArray(arr, num1, num2) {
    var arr_one = arr[num1]
    var arr_two = arr[num2]
    if (arr_two != undefined || arr_two != null){
      arr[num1] = arr_two
      arr[num2] = arr_one
    }
    return arr;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight;
        let clientWidth = res.windowWidth;
        let ratio = 750 / clientWidth;
        let height = clientHeight * ratio;
        that.setData({
          height: height
        });
      }
    });
    //初始化渲染数据
    for (var i = 0; i < 10; i++) {
      var sub = []
      for (var j = 0; j < 3; j++) {
        var subs = []
        for (var k = 0; k < 3; k++) {
          subs.push({
            "id": (200 + k),
            "p_id": (100 + j),
            "project_id": 1,
            "name": "一级" + (i + 1) + "-二级" + (j + 1)+"-三级"+(k+1),
            "logo": " ",
            "depth": 3,
            "order_num": null,
            "is_del": 0,
          })
        }
        sub.push({
          "id": (100 + j),
          "p_id": 0,
          "project_id": 1,
          "name": "一级" + (i + 1)+"-二级"+ (j+1),
          "logo": "baidu.com",
          "depth": 2,
          "order_num": null,
          "is_del": 0,
          "sub": subs
        })
      }
      this.data.cate_list.push({
        "id": (i + 1),
        "p_id": 0,
        "project_id": 1,
        "name": "一级" + (i + 1),
        "logo": " ",
        "depth": 1,
        "order_num": null,
        "is_del": 0,
        "sub":sub
      })
    }
    this.setData({
      cate_list: this.data.cate_list
    })
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