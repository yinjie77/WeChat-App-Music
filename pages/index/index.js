// pages/index/index.js
import req from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bannerList: [],//轮播图
        recommendList: [],//推荐歌单
        topList: [],//排行榜
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        this.getBannerList()
        this.getRecommendList()
        this.getTopList()
    },
    //获取轮播图数据
    async getBannerList() {
        let bannerListData = await req('/banner', { type: 2 });
        this.setData({
            bannerList: bannerListData.banners
        })
    },
    //获取推荐清单
    async getRecommendList() {
        let recommendListData = await req('/personalized', { limit: 10 })
        this.setData({
            recommendList: recommendListData.result
        })
    },
    //获取排行榜
    async getTopList() {
        let index = 0
        let res = []
        let IdData = await req('/topList')
        while (index < 5) {
            let topListData = await req('/playlist/detail', { id: IdData.list[index++].id })
            let topListItem = { name: topListData.playlist.name, tracks: topListData.playlist.tracks.slice(0, 3) }
            res.push(topListItem)
            this.setData({
                topList: res
            })
        }
    },
    toRecommendSong() {
        wx.navigateTo({
            url: '/pages/recommendSong/recommendSong',
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