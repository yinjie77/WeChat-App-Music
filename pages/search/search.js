// pages/search/search.js
import req from '../../utils/request'
let flag = null
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeholderContent: '',
        hostList: [],
        searchContent: '',
        searchList: [],
        historyList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getInitData()
        this.getSearchHistory()
    },
    async getInitData() {
        let placeholderData = await req('/search/default')
        let hostListData = await req('/search/hot/detail')
        this.setData({
            placeholderContent: placeholderData.data.showKeyword,
            hostList: hostListData.data
        })
    },
    //获取搜索历史
    getSearchHistory() {
        let historyList = wx.getStorageSync('searchHistory')
        if (historyList) {
            this.setData({
                historyList
            })
        }
    },
    //输入框处理
    handleInputChange(event) {
        this.setData({
            searchContent: event.detail.value.trim()
        })
        if (!this.data.searchContent) {
            this.setData({
                searchList: []
            })
            return
        }
        let { searchContent, historyList } = this.data
        if (flag !== null) {
            clearTimeout(flag)
        }
        flag = setTimeout(async () => {
            let searchListData = await req('/search', { keywords: searchContent, limit: 10 })
            this.setData({
                searchList: searchListData.result.songs
            })
            if (historyList.indexOf(searchContent) !== -1) {
                historyList.splice(historyList.indexOf(searchContent), 1)
            }
            historyList.unshift(searchContent)
            this.setData({
                historyList
            })
            wx.setStorageSync('searchHistory', historyList)
            flag = null
        }, 300);

    },
    //清空搜索框
    clearSearchContent() {
        this.setData({
            searchContent: '',
            searchList: []
        })
    },
    //删除历史记录
    deleteSearchHistory() {
        wx.showModal({
            content: '确认删除吗',
            complete: (res) => {
                if (res.confirm) {
                    this.setData({
                        historyList: []
                    })
                    wx.removeStorageSync('searchHistory')
                }
            }
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