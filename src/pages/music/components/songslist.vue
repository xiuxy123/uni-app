<template>
    <view class="list">
       <view class="list-icon">
            <view><u-icon name="play-right-fill" size="30" color="green" @click="pause"  /> &nbsp;&nbsp;全部播放({{ songs.length }})</view>
            <view style="margin-right: 30upx"><uni-icons type="pulldown" size="30" style="margin-right: 20upx" />
            <u-icon name="list-dot" size="50" /></view>
      </view>
      <view v-for="(item, index) in songs" :key="item.id" class="songlist"  @click="setindex(index)">
          <view style="display: flex" :class="{ 'title': index === value }">
              <view class="index">{{ index+1 }}</view>
                  <view class="song">
                      <view class="songname"> {{ item.name }}</view>
                      <view class="author">
                        {{ item.str }}
                      </view>
                </view>
          </view>
          <view style="margin-right: 20upx;"><image src='../../../static/icons/more.png' mode="aspectFit" /></view>
      </view>
      <view></view>
    </view>
</template>
<style lang="scss" scoped>
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
.title{
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
</style>

<script>
import uniIcons from '../../../components/uni-icons/uni-icons.vue'
export default {
  components: { uniIcons },
    name: 'songsList',
    props: {
        songs: Array,
        pause: Function,
        value: Number,
    },
    data () {
        return {
          songindex: this.value,
        }
    },
    watch: {
        songindex: function (newVal) {
          console.log(newVal)
          this.$emit("update:title", newVal);
        }
      },
    methods: {
      setindex (index) {
        console.log(this.value)
        this.songindex = index;
        console.log(this.songindex)
      }
    },
}
</script>