<template>
    <view class="root">
      <u-navbar back-text="返回" 
      title="歌单" 
      :background="background"
      is-fixed
      >
          <view slot="right">
            <u-icon name="more-dot-fill" size="48" style="margin-right: 10px"></u-icon>
          </view>
      </u-navbar>
      <view class="details">

        <view class="img">
          <image :src="playlist.coverImgUrl" mode="aspectFit"  />
        </view>

        <view class="text">
          <view v-for=" item in playlist.name" :key="item" class="title">
            {{ item }}
          </view>
          <view class="author" v-if="playlist.creator">
            <view >
            <image :src="playlist.creator.backgroundUrl" mode="aspectFit"  />
            </view>
            <view class="authorname">
            {{ playlist.creator.nickname }}
            </view>
          </view>
          <view v-if="playlist.description" style="padding-top: 30upx">
            简介:&nbsp;&nbsp; {{ playlist.description }}
            <u-icon name="arrow-right" ></u-icon>
          </view>
        </view>
      </view>

      <view class="details-count">
        <view class="subscrib">
          <view v-if="!playlist.subscribed"><uni-icons type="heart" size="30" /> </view>
          <view v-else-if="playlist.subscribed"><uni-icons type="heart-filled" size="30" color="red" /> </view>
          <view  style="margin: auto 10upx">{{ playlist.subscribedCount }}</view>
        </view>
        <view class="subscrib">
          <view ><uni-icons type="chat" size="30" /> </view>
          <view  style="margin: auto 10upx">{{ playlist.commentCount }}</view>
        </view>
        <view class="subscrib">
          <view ><u-icon name="share" size="30" /> </view>
          <view  style="margin: auto 10upx">{{ playlist.shareCount }}</view>
        </view>
      </view>
      <view v-if="songsurls">
         <view class="list">
            <view class="list-icon">
                  <view><u-icon name="play-right-fill" size="30" color="green" @click="playall"  /> &nbsp;&nbsp;全部播放({{ songsurls.length }})</view>
                  <view style="margin-right: 30upx"><uni-icons type="pulldown" size="30" style="margin-right: 20upx" />
                  <u-icon name="list-dot" size="50" /></view>
            </view>
            <view v-for="(item, index) in songsurls" :key="item.id" class="songlist"  >
                <view style="display: flex"  @tap="playsong(index)"  :class="index === title ? 'titlecolor':''">
                    <view>{{ index+1 }}</view>
                        <view class="song">
                            <view class="songname"> {{ item.name }}</view>
                            <view class="author">
                              {{ item.str }}
                        </view>
                      </view>
                </view>
                <view style="margin-right: 20upx;"><image src='../../../static/icons/more.png' mode="aspectFit" /></view>
            </view>
          </view>
      </view>
        <view v-if="songsurls[title]" class="footer">
          <view class="img" @click="gotosongs()">
            <image :src="songsurls[title].al.picUrl" mode="aspectFit"  />
          </view>
          <view class="author" @click="gotosongs()">
            {{ songsurls[title].name + '----' + songsurls[title].ar[0].name }}
          </view>
          <view class="footericon">
            <view class="playicon" @click="last_song">
              <u-icon name="rewind-left-fill" size="30" />
            </view>
            <view class="playicon" @click="pause">
              <u-icon :name="paused ? 'play-right-fill' : 'pause'" size="30" />
            </view>
            <view class="playicon" @click="next_song">
              <u-icon name="rewind-right-fill" size="30" />
            </view>
          </view>
        </view>
    </view>
</template>
<style lang="scss" scoped>
.root {
  width: 100%;
}
.details{
  background-color: rgb(150, 150, 150);
  color: rgb(231, 231, 231);
  margin: 0;
  padding: 0;
  padding-top: 30upx;
  display: flex;
  .img{
    margin-left: 40upx;
    image{
      width: 250upx;
      height: 250upx;
      border-radius: 10px;
    }
  }
  .text{
    margin: 0 auto;
    .title{
      font-size: 20px;
      margin: auto;
    }
    .author{
      display: flex;
      image{
        margin: auto;
        width: 40upx;
        height: 40upx;
        border-radius: 40upx;
      }
      .authorname{
        margin: auto;
        margin-left: 10upx;
      }
    }
  }
}
.details-count{
    background-color: rgb(150, 150, 150);
    padding-left: 45upx;
    display: flex;
    .subscrib{
      display: flex;
      color: rgb(231, 231, 231);
      margin: auto;
    }
  }
  .list{
    margin: auto 0;
    margin-left: 30upx;
    .list-icon{
      margin: auto 0;
      display: flex;
      justify-content: space-between;
      view{
        margin: auto 0;
      }
    }
}
.titlecolor{
  color: coral;
}
.songlist{
  display: flex;
  justify-content: space-between;
  padding: 10upx 0;
  .song{
    padding-left: 30upx;
    .songname{
      font-size: 17px;
    }
    .author{
      padding-left: 30upx;
      font-size: 12px;
    }
  }
  image{
    width: 81upx;
    height: 81upx;
  }
}   
.footer{
  position:fixed;
  bottom:0;
  display: flex;
  width: 90%;
  height: 100upx;
  margin: auto 5%;
  margin-bottom: 10upx;
  background-color: rgb(183, 184, 202);
  border-radius: 15px;
  .img{
    border-radius: 15px;
    image{
      margin: auto;
      border-radius: 15px;
      width: 100upx;
      height: 100upx;
    }
  }
  .author{
    color: rgb(231, 231, 231);
    margin: auto 30upx;
  }
  .footericon{
    display: flex;
    margin: auto 30upx;
    .playicon{
      padding: 20upx;
    }
  }
}
</style>
<script>
import uniIcons from '../../../components/uni-icons/uni-icons.vue';
var that = null;
const innerAudioContext = uni.getBackgroundAudioManager();
export default {
    data () {
      return {
        id: '',
        background:{
          backgroundColor: "rgb(150, 150, 150)",
        },
        playlist: {},
        trackIds: '',
        textlist: [],
        songids: '',
        songsurls: [],
        paused: true,
			  recycled: false,
        now: '00:00',
        duration: '00:00',
        progress_max: 0,
        songsdetail: [],
        title: -1,
        titlecss: 'titlecolor',
      }
    },
    components: { uniIcons },
    onLoad: function (option) {
        this.request(option.id);
        that = this;
        that.id = option.id;
        innerAudioContext.autoplay = false;
        innerAudioContext.onPlay(() => {
          uni.hideLoading();
        });
        innerAudioContext.onWaiting(function() {
          uni.showLoading({
            title: '正在加载'
          });
        });
        innerAudioContext.onCanplay(function() {
          uni.hideLoading();
        });
        innerAudioContext.onPrev(() => {
          that.last_song();
        });
        innerAudioContext.onNext(() => {
          that.next_song();
        });
        innerAudioContext.onError(res => {
          console.log(res.errMsg);
          console.log(res.errCode);
        });
        innerAudioContext.onTimeUpdate(() => {
          that.now = that.time_format(innerAudioContext.currentTime);
          that.duration = that.time_format(innerAudioContext.duration);
          that.progress_max = parseInt(100 * (innerAudioContext.currentTime / innerAudioContext.duration));
          // 在此可做试听限制，比如试听15s
          // if (parseInt(innerAudioContext.currentTime) > 15) {
          // 	innerAudioContext.pause();
          // 	innerAudioContext.destroy();
          // 	// 自定义提示
          // }
          // console.log(that.time_format(innerAudioContext.currentTime))
          // console.log(that.time_format(innerAudioContext.duration))
        });
        //  innerAudioContext.onSeeked(function() {
        //    innerAudioContext.play();
        //  });
        innerAudioContext.onPause(function() {
          that.paused = true;
        });
        innerAudioContext.onPlay(function() {
          that.paused = false;
        });
        innerAudioContext.onEnded(() => {
           if (!that.recycled && that.title < that.songsurls.length - 1) {
                that.title++;
                that.play();
              } else if (that.recycled) {
                innerAudioContext.seek(0);
                that.play();
              } else if (!that.recycled && that.title == that.songsurls.length - 1) {
                that.title = 0;
                that.play();
              }
        });
    },
    methods: {
      // 获取歌单详情
      async request(id) {
        let result = await uni.request({
          url: "http://musicapi.leanapp.cn/playlist/detail?id=" + id,
        });
        let [error, res] = result;
        if (res.statusCode === 200) {
          console.log( res)
          if (res.data && res.data.playlist.name) {
            that.setText(res.data.playlist.name)
          }
          if (res.data.playlist.description) {
            if (res.data.playlist.description.length > 12) {
              res.data.playlist.description = res.data.playlist.description.slice(0, 12) + '...'
            }
          }
          if (res.data.playlist.trackIds) {
            that.getsongsid(res.data.playlist.trackIds);
          }
          that.playlist = { ...res.data.playlist, name: [...that.textlist]};
          that.geturl();
        }
      },
      // 获取歌曲详情
      async geturl() {
        let result = await uni.request({
          url: "https://autumnfish.cn/song/detail?ids=" + that.songids,
        });
        let [error, res] = result;
        console.log(res);
        that.songsurls = [...res.data.songs]
         let str = ''
        for (var i = 0 ; i < that.songsurls.length; i++) {
            that.songsurls[i].ar.map(item => {
            str = str + item.name + '/';
            return str;
          });
          str = str.slice(0, str.length-1);
          str = str + "--" + that.songsurls[i].al.name;
          that.songsurls[i].str = str;
          str = '';
        }
        that.getsongurl();
      },
      setText(text) {
        that.textlist = [];
        if (text.length > 11) {
          var str = text.slice(11, text.length);
          if (str.length > 7) {
            that.textlist.push(text.slice(0, 11));
            that.textlist.push(str.slice(0, 9) + "...");
          } else {
            that.textlist.push(text.slice(0, 11));
            that.textlist.push(str);
          }
          return;
        }
        that.textlist.push(text);
        that.textlist.push("...");
        return;
      },

      getsongsid (arr) {
        let str = '';
        for (var i = 0; i < arr.length-1; i++) {
          str = str + arr[i].id + ',';
        }
        str = str + arr[arr.length - 1].id;
        that.songids = str;
      },
       // 获取歌曲播放地址
      async getsongurl () {
            let result = await uni.request({
            url:'https://autumnfish.cn/song/url?id=' + that.songids,
          });
            let [error, res] = result;
          if (res.statusCode === 200) {
              that.songsdetail =[...res.data.data];
            }
        },

        time_format(second) {
          let m = Math.floor((second / 60) % 60) < 10 ? '0' + Math.floor((second / 60) % 60) : Math.floor((second / 60) % 60);
          let s = Math.floor(second % 60) < 10 ? '0' + Math.floor(second % 60) : Math.floor(second % 60);
          return `${m}:${s}`;
        },

      playsong (index) {
        this.setindex(index);
        setTimeout(() => {
          this.play()
        }, 100)
      },

      setindex (index) {
        if (index !== this.title) {
        this.title = index;
        }
      },

      play () { 
        innerAudioContext.src = this.songsfind(this.songsdetail, this.songsurls[this.title].id);
        innerAudioContext.title = this.songsurls[this.title].name;
      },

      songsfind (arr, id) {
       const url = arr.find(item => {
          if (item.id === id) {
            return item.url;
          }
        })
        return url.url;
      },

      last_song () {
        if (that.playing != 0) {
        this.title--;
        this.play();
        }
      },

      next_song () {
        if (that.title < that.songsurls.length - 1) {
        this.title++;
        this.play();
        } else if (that.title === that.songsurls.length - 1) {
          this.title = 0;
          this.play();
          uni.pageScrollTo({
					  scrollTop: 0
				  });
        } else {
          console.log('do nothing ');
        }
      },

      pause () {
        if (innerAudioContext.paused) {
            innerAudioContext.play();
          } else {
            innerAudioContext.pause();
          }
      },

      playall () {
        innerAudioContext.src = that.songsfind(that.songsdetail, that.songsurls[that.title].id);
        innerAudioContext.title = that.songsurls[that.title].name;
        innerAudioContext.play();
      },

      gotosongs () {
        let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
        let curRoute = routes[routes.length - 1].route //获取当前页面路由
        console.log(curRoute)
        uni.navigateTo({ 
          url:`songdetail?title=${this.title}&songs=${JSON.stringify(this.songsurls)}&songurl=${JSON.stringify(this.songsdetail)}`,
          animationType: 'slide-in-bottom',
          animationDuration: 200,
          fail: e => { console.log(e)}
          });
      },
    },
}
</script>