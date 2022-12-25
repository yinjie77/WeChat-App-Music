// pages/login/login.js
import req from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        email: '',
        password: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    handleInput(event) {
        let type = event.currentTarget.id
        this.setData({
            [type]: event.detail.value
        })
    },
    async login() {
        let { email, password } = this.data
        if (!email) {
            wx.showToast({
                title: '邮箱不能为空',
                icon: 'none'
            })
            return
        }
        let emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (!emailReg.test(email)) {
            wx.showToast({
                title: '邮箱格式错误',
                icon: 'none'
            })
            return
        }
        if (!password) {
            wx.showToast({
                title: '密码不能为空',
                icon: 'none'
            })
            return
        }
        let res = await req('/login', { email, password, isLogin: true })
        if (res.code == 200) {
            wx.showToast({
                title: '登陆成功',
                icon: 'none'
            })
            wx.setStorageSync('userInfo', JSON.stringify(res.profile))
            wx.reLaunch({
                url: '/pages/personal/personal',
            })
        } else {
            wx.showToast({
                title: '邮箱或密码错误',
                icon: 'none'
            })
        }
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