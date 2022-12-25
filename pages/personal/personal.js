// pages/personal/personal.js
let startY = 0
let moveY = 0
let moveDistance = 0
import req from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        converTransform: 'translateY(0)',
        coverTransition: '',
        userInfo: {},
        recentPlayList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.setData({
                userInfo: JSON.parse(userInfo)
            })
        }
        this.getUserRecentPlayList(this.data.userInfo.userId)
    },
    //获取最近播放记录
    async getUserRecentPlayList(userId) {
        let recentPlayListData = await req('/user/record', { uid: userId, type: 0 })
        let index = 0
        let recentPlayList = recentPlayListData.allData.slice(0, 10).map((item) => {
            item.id = index++
            return item
        })
        this.setData({
            recentPlayList
        })
    },
    handleTouchStart(event) {
        //获得开始拖动位置
        startY = event.touches[0].clientY
        this.setData({
            coverTransition: ''
        })
    },
    //拖动中
    handleTouchMove(event) {
        moveY = event.touches[0].clientY
        moveDistance = moveY - startY
        if (moveDistance <= 0) {
            return
        }
        if (moveDistance >= 80) {
            moveDistance = 80
        }

        this.setData({
            converTransform: `translateY(${moveDistance}rpx)`
        })
    },
    //拖动结束
    handleTouchEnd() {
        this.setData({
            converTransform: `translateY(0)`,
            coverTransition: 'transform 1s linear'
        })
    },
    toLogin() {
        wx.navigateTo({
            url: '/pages/login/login',
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})