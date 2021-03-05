<template>
    <view class="body">
        <view class="nav">
            <u-navbar
              back-icon-name="arrow-down"
              title="歌曲" 
              :background="background"
              is-fixed
              >
                  <view slot="right">
                      <u-icon name="more-dot-fill" size="48" style="margin-right: 10px"></u-icon>
                  </view>
            </u-navbar>
        </view>
        <view v-if="title >= 0" class="song">
            <view v-if="songsurls[title]" class="songimg"><image :src="songsurls[title].al.picUrl"  /></view>
            <view class="songname">{{ songsurls[title].name }}</view>
            <view class="author">{{ songsurls[title].ar[0].name }}</view>
            
            <view class="iconslist">
              <view  class="img"><image src="../../../static/icons/mcf.png" mode="aspectFit" /></view>
              <view  class="img"><image src="../../../static/icons/pinglun.png" mode="aspectFit" /></view>
              <view  class="img"><image src="../../../static/icons/down.png" mode="aspectFit" /></view>
              <view  class="img"><image src="../../../static/icons/more1.png" mode="aspectFit" /></view>
            </view>
            <view class="wrap">
                <div>{{ now }}</div>
                <u-slider v-model="progress_max" 
                :use-slot="true"
                @start="progress_touch_start"
                @end="progress_touch_end"
                min='0'
                >
                  <!-- 这里外面需要多一层view，否则".badge-button"样式可能不生效 -->
                  <view class="">
                    <view class="badge-button">
                      {{value}}
                    </view>
                  </view>
                </u-slider>
                <text>{{ duration }}</text>
            </view>
        </view>
    </view>
</template>
<style lang="scss" scoped>
.body {
  width: 100%;
  background-color: rgb(70, 119, 108);
}
.song{
  margin: 40upx 10%;
  width: 80%;
  border-radius: 15px;
  color: rgb(231, 231, 231);
  .songimg{
    image{
      border-radius: 15px;
      width: 100%;
      height: 500upx;
    }
  }
  .songname{
    width: 100%;
    margin: 20upx 0;
    font-size: 22px;
  }
  .author{
    color: rgb(155, 192, 200);
  }
  .iconslist{
    display: flex;
    width: 100%;
    margin-top: 100upx;
    .img{
      margin: auto;
      padding: 0 10%;
      image{
        margin: auto;
        width: 40upx;
        height: 40upx;
      }
    }
  }
}
.wrap {
		padding: 30rpx;
	}
	
	.badge-button {
		padding: 4rpx 6rpx;
		background-color: $u-type-error;
		color: #fff;
		border-radius: 10rpx;
		font-size: 22rpx;
		line-height: 1;
	}
</style>
<script>
import uniIcons from '../../../components/uni-icons/uni-icons.vue';
var that = null;
const innerAudioContext = uni.getBackgroundAudioManager();
export default {
    data () {
      return {
        value: 0,
        background:{
          backgroundColor: "rgb(70, 119, 108)",
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
      }
    },
    components: { uniIcons },
    onLoad: function (option) {
        this.title = option.title;
        this.songsurls =JSON.parse(decodeURIComponent(option.songs));
        this.songsdetail = JSON.parse(decodeURIComponent(option.songurl))
        console.log(this.songsurls);
        that = this;
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
          console.log(that.now,  that.progress_max)
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
      progress_touch_start() {
			innerAudioContext.pause();
      },
      progress_touch_end(percent) {
        console.log('num :>> ', progress_max);
        let s = (progress_max / 100) * innerAudioContext.duration;
        innerAudioContext.seek(parseInt(s));
        innerAudioContext.play();
      },
    },
}
</script>
