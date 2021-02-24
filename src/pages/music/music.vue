<template>
  <view class="root">
     <u-navbar title="推荐"
     is-back="false"
     is-fixed
     >
        <view slot="right">
          <u-icon name="more-dot-fill" size="48" style="margin-right: 10px"></u-icon>
        </view>
      </u-navbar>
    <view class="search">
      <u-search shape="round" bg-color="#fff"></u-search>
    </view>
    <view class="text">
      <view class="textleft">网友精选歌单</view>
      <view class="textright">更多&nbsp;></view>
    </view>
    <view class="songsheet">
      <!-- 歌单列表 -->
      <scroll-view
        scroll-x="true"
        show-scrollbar="true"
        class="scroll-view_H"
        style="width: auto; overflow: hidden"
        :scroll-left="scrollleft"
        @scroll="scroll"
      >
        <view>
          <view
            class="item-list scroll-view-item_H"
            v-for="(item, index) in songsheets"
            :key="item.id"
          >
            <view
              v-if="index < 5"
              class="item-image-list"
              @click="gotosongs(item.id)"
            >
              <image :src="item.coverImgUrl" mode="aspectFit" />
              <view class="title" v-for="item1 in item.name" :key="item1">
                {{ item1 }}
              </view>
            </view>
          </view>
        </view>

        <view>
          <view
            class="item-list"
            v-for="(item, index) in songsheets"
            :key="item.id"
          >
            <view
              v-if="index >= 5 && index < 10"
              class="item-image-list"
              @click="gotosongs(item.id)"
            >
              <image :src="item.coverImgUrl" mode="aspectFit" />
              <view class="title" v-for="item1 in item.name" :key="item1">
                {{ item1 }}
              </view>
            </view>
          </view>
        </view>

        <view>
          <view
            class="item-list"
            v-for="(item, index) in songsheets"
            :key="item.id"
          >
            <view
              v-if="index >= 10 && index < 15"
              class="item-image-list"
              :class="{ imgpadding: index === 14 }"
              @click="gotosongs(item.id)"
            >
              <image :src="item.coverImgUrl" mode="aspectFit" />
              <view class="title" v-for="item1 in item.name" :key="item1">
                {{ item1 }}
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.root {
  width: 100%;
  margin-top: 40upx;
  background-color: rgb(235, 244, 253);
}
.search {
  background-color: #fff;
  width: 80%;
  border-radius: 15px;
  margin: 20upx auto;
}
.text {
  display: flex;
  padding: 20upx 30upx 0 30upx;
  justify-content: space-between;
  background: rgb(235, 244, 253);
}
.songsheet {
  width: 100%;
  padding-top: 30upx;
  overflow: hidden;
  background: rgb(235, 244, 253);
  white-space: nowrap;
  .item-list {
    display: inline-block;
    margin: auto;
    padding: auto;
    padding-top: 25upx;
    .item-image-list {
      margin: auto;
      padding-left: 35upx;
      border-radius: 15px;
      image {
        width: 200upx;
        height: 200upx;
        border-radius: 15px;
      }
      .title {
        width: 200upx;
        font-size: 14px;
      }
    }
  }
}
.imgpadding {
  padding-right: 30upx;
}
</style>
<script>
import slider from "../../components/slider/slider.vue";
var that = null;
const innerAudioContext = uni.getBackgroundAudioManager();
export default {
  data() {
    return {
      id: "", //数据请求id
      paused: false,
      recycled: false,
      playing: 0,
      playList: [],
      songsheets: [],
      scrollleft: 0,
      textlist: [],
      search: "",
    };
  },

  components: {
    slider,
  },

  watch: {
    // 监听播放列表的变化
    playing(val, odlVal) {
      let userInfo = uni.getStorageSync("userInfo");
      console.log("playing:", val);
      console.log("odlVal:", odlVal);
    },
  },

  onLoad(options) {
    this.login();
    this.request();
    this.getSongsheet();
  },

  methods: {
    async request() {
      let result = await uni.request({
        url: "http://musicapi.leanapp.cn/search?keywords=海阔天空",
      });
      let [error, res] = result;
      if (res.statusCode === 200) {
        console.log(res);
      }
    },
    
    async login() {
      try {
        let result = await uni.request({
          url: "http://musicapi.leanapp.cn/login/cellphone?phone=17374337269&password=wxb,2806358726",
        });
        console.log(result)
        } catch (e) {
          console.log(e)
        }
    },

    async getSongsheet() {
      let result = await uni.request({
        url: "http://musicapi.leanapp.cn/top/playlist?limit=15&order=hot",
      });
      let [error, res] = result;
      if (res.statusCode === 200) {
        console.log(res);
        const list = [];
        if (res.data && res.data.playlists) {
          res.data.playlists.map((item) => {
            this.setText(item.name);
            list.push({ ...item, name: [...this.textlist] });
          });
        }
        this.songsheets = [...list];
      }
    },

    scroll: function (e) {
      this.scrollleft = e.detail.scrollLeft;
    },

    setText(text) {
      this.textlist = [];
      if (text.length > 9) {
        var str = text.slice(9, text.length);
        if (str.length > 7) {
          this.textlist.push(text.slice(0, 9));
          this.textlist.push(str.slice(0, 7) + "...");
        } else {
          this.textlist.push(text.slice(0, 9));
          this.textlist.push(str);
        }
        return;
      }
      this.textlist.push(text);
      this.textlist.push("...");
      return;
    },

    gotosongs (id) {
      uni.navigateTo({ url: 'songsheet/songsheet?id=' + id })
    },
  },
};
</script>


