// pages/video/video.js
import req from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoGroupList: [],
        navId: '',
        videoList: [],
        videoId: '',
        videoUpdateTime: [],
        isTriggered: false,
        index: 0,
        page: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getVideoGroupListData()
    },
    toSearch() {
        wx.navigateTo({
            url: '/pages/search/search',
        })
    },
    //获取视频标签
    async getVideoGroupListData() {
        let videoGroupListData = await req('/video/group/list')
        this.setData({
            videoGroupList: videoGroupListData.data.slice(0, 14),
            navId: videoGroupListData.data[0].id
        })
        this.getVideoList(this.data.navId)
    },
    //获取视频相关信息
    async getVideoList(navId) {
        let { index, videoList, page } = this.data
        let videoListData = await req('/video/group', { id: navId, offset: page })

        let v = videoListData.datas.map(item => {
            item.id = index++
            return item
        })

        for (let i = 0; i < v.length; i++) {
            let videoUrlData = await req('/video/url', { id: v[i].data.vid })
            v[i].data.urlInfo = videoUrlData.urls[0]
        }
        videoList.push(...v)
        page++
        wx.hideLoading()
        this.setData({
            videoList,
            isTriggered: false,
            index,
            page
        })

    },
    //更换视频标签
    changeNav(event) {
        let navId = event.currentTarget.id
        this.setData({
            navId,
            videoList: []
        })
        wx.showLoading({
            title: '正在加载',
        })
        this.getVideoList(this.data.navId)

    },
    //播放逻辑控制
    handlePlay(event) {
        let vid = event.currentTarget.id
        this.vid !== vid && this.videoContext && this.videoContext.stop()
        this.vid = vid
        this.setData({
            videoId: vid
        })
        this.videoContext = wx.createVideoContext(vid)
        let { videoUpdateTime } = this.data
        let videoItem = videoUpdateTime.find(item => item.vid === vid)
        if (videoItem) {
            this.videoContext.seek(videoItem.currentTime)
        } else {
            this.videoContext.play()
        }

    },
    //播放历史记录
    handleTimeUpdate(event) {
        let videoTimeObj = { vid: event.currentTarget.id, currentTime: event.detail.currentTime }
        let { videoUpdateTime } = this.data
        let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
        if (videoItem) {
            videoItem.currentTime = event.detail.currentTime
        } else {
            videoUpdateTime.push(videoTimeObj)
        }
        this.setData({
            videoUpdateTime
        })
    },
    //视频结束
    handleEnd(event) {
        let { videoUpdateTime } = this.data
        videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id), 1)
        this.setData({
            videoUpdateTime
        })
    },
    //下拉刷新
    handleRefresher() {
        this.getVideoList(this.data.navId)
    },
    //拉到底部刷新
    handleToLower() {
        this.getVideoList(this.data.navId)
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