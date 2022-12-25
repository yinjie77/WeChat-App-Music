// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import moment from 'moment'
import req from '../../utils/request'
const appInstance = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false,
        musicDetail: {},
        songId: '',
        musicLink: '',
        currentTime: '00:00',
        durationTime: '00:00',
        currentWidth: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let songId = options.songid
        this.setData({
            songId
        }
        )
        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId == songId) {
            this.setData({
                isPlay: true
            })
        }
        this.getMusicDetail(songId)
        this.backgroundAudioManager = wx.getBackgroundAudioManager()

        //与小程序播放器同步
        this.backgroundAudioManager.onPlay(() => {
            this.changePlayState(true)
            appInstance.globalData.musicId = songId
        })
        this.backgroundAudioManager.onPause(() => {
            this.changePlayState(false)
        })
        this.backgroundAudioManager.onStop(() => {
            this.changePlayState(false)
        }
        )
        // this.backgroundAudioManager.onEnded(() => {
        //     PubSub.publish('switchType', 'next')
        //     this.setData({
        //         currentWidth: 0,
        //         currentTime: '00:00'
        //     })
        // })
        //进度条与时间更新
        this.backgroundAudioManager.onTimeUpdate(() => {
            let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
            let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450
            this.setData({
                currentTime,
                currentWidth
            })
        })
    },
    //改变播放状态
    changePlayState(isPlay) {
        this.setData({
            isPlay
        })
        appInstance.globalData.isMusicPlay = true
    },
    handleMusicPlay() {
        let isPlay = !this.data.isPlay
        let { songId, musicLink } = this.data
        this.musicControl(isPlay, songId, musicLink)
    },
    //暂停播放控制
    async musicControl(isPlay, musicId, musicLink) {
        if (isPlay) {
            if (!musicLink) {
                let musicLinkData = await req('/song/url', { id: musicId })
                musicLink = musicLinkData.data[0].url
                this.setData({
                    musicLink
                })
            }
            this.backgroundAudioManager.src = musicLink
            this.backgroundAudioManager.title = this.data.musicDetail.name
        } else {
            this.backgroundAudioManager.pause()
        }
    },
    //获取音乐详情
    async getMusicDetail(songId) {
        let musicDetail = (await req('/song/detail', { ids: songId })).songs[0]
        let durationTime = moment(musicDetail.dt).format('mm:ss')
        this.setData({
            musicDetail,
            durationTime
        })
        wx.setNavigationBarTitle({
            title: this.data.musicDetail.name
        })
    },
    //切换歌曲操作
    async handleSwitch(event) {
        let type = event.currentTarget.id
        this.backgroundAudioManager.stop()
        PubSub.subscribe('musicId', (msg, musicId) => {
            this.getMusicDetail(musicId)
            this.musicControl(true, musicId)
            PubSub.unsubscribe('musicId')
        })
        PubSub.publish('switchType', type)
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