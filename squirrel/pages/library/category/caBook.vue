<template>
  <view>
    <back></back>
    <background :url="'../../../static/desktop-back.jpg'"></background>
    <video v-show="!videoHidden" id="bookVideo" :src="videoUrl" :poster="videoPoster"
           object-fit="fill"
           :autoplay="autoplay"
           controls
           @error="videoErrorCallback"
           style="position: fixed; left: 50%; bottom: 15%; width: 39%; height: 50%;"
    >
    </video>
    <view class="fixed top-4 w-full flex flex-row justify-center">
      <book-flip :poster="'../../../static/oxford.jpg'">
        <template #page-left>
          <view class="ca-top"
                style="background-image: url('../../../static/oxford-unit1-catop.png'); border-radius: 8px 0;"
          ></view>
          <view class="ca-bottom"
                style="background-image: url('../../../static/oxford-unit1-ca-bottom.png'); border-radius: 0 0 0 8px;"
          ></view>
          <view>
            <view class="ca">
              <view v-for="item in 10" :key="item">
                <view>
                  <view>
                    <image src="../../../static/oxford-unit1-ca.jpg" style="width: 12vw; height: 8vh;"></image>
                  </view>
                  <view class="un-cards">
                    <view class="un-card" hover-class="ani_scale"
                          style="background-image: url('../../../static/apple.png')"
                    ></view>
                    <view class="un-card" hover-class="ani_scale"
                          style="background-image: url('../../../static/bear.png')"
                    ></view>
                    <view class="un-card" hover-class="ani_scale"
                          style="background-image: url('../../../static/cat.png')"
                    ></view>
                    <view class="un-card" hover-class="ani_scale"
                          style="background-image: url('../../../static/story.png'); background-size: 1.8rem 2rem;"
                    ></view>
                    <view class="un-card" hover-class="ani_scale"
                          style="background-image: url('../../../static/cat.png')"
                    ></view>
                    <view class="un-card" hover-class="ani_scale"
                          style="background-image: url('../../../static/story.png'); background-size: 1.8rem 2rem;"
                    ></view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>
        <template #page-right>
          <view class="ca-top"
                style="background-image: url('../../../static/oxford-unit1-catop-right.png'); border-radius: 0 8px 0;"
          ></view>
          <view class="ca-bottom"
                style="background-image: url('../../../static/oxford-unit1-ca-bottom.png'); border-radius: 0 0 8px 0;"
          ></view>
          <view class="ca-right">
            <view class="un-cards">
              <view class="un-card" hover-class="ani_scale"
                    style="background-image: url('../../../static/apple.png'); z-index: 10;"
                    @click="toVideo($media('A/index.m3u8'))"
              ></view>
              <view class="un-card" hover-class="ani_scale"
                    style="background-image: url('../../../static/bear.png'); z-index: 10;"
                    @click="toVideo($media('B/index.m3u8'))"
              ></view>
              <view class="un-card" hover-class="ani_scale"
                    style="background-image: url('../../../static/cat.png'); z-index: 10;"
                    @click="toVideo($media('C/index.m3u8'))"
              ></view>
            </view>
          </view>
        </template>
      </book-flip>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      autoplay: 'false',
      videoUrl: '',
      videoPoster: '',
      videoHidden: true
    }
  },
  onShow() {
    this.videoUrl = this.$media('A/index.m3u8');
    this.videoPoster = this.$media('apple.png');
    let timout = setTimeout(() => {
      this.videoHidden = false;
      clearTimeout(timout);
    }, 1000);
  },
  onReady: function (res) {
    this.videoContext = uni.createVideoContext('bookVideo', this);
  },
  methods: {
    videoErrorCallback() {
    },
    toVideo(url) {
      this.autoplay = true;
      this.videoContext.stop();
      this.videoUrl = url;
      this.videoHidden = false;
      this.videoContext.play();

    }
  }
}
</script>

<style lang="scss" scoped>
.ca-top {
  position: absolute;
  top: 0;
  width: 100%;
  height: 20vh;
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-size: 100% 20vh;
}

.ca-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2.5rem;
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-size: 100% 2.5rem;
}

.ca {
  position: absolute;
  top: 1vh;
  padding-top: 13vh;
  padding-bottom: 5vh;
  height: 85vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  overflow-y: scroll;
  scroll-behavior: smooth;
}

.ca-right {
  position: absolute;
  top: 1vh;
  padding-top: 13vh;
  padding-bottom: 5vh;
  height: 85vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

.un-cards {
  width: 14rem;
  padding-left: 1rem;
  padding-bottom: 1rem;
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(4, 2.6rem);
  grid-gap: 0.5rem 0.5rem;
}

.un-card {
  width: 2.7rem;
  height: 2.5rem;
  background-position: center;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  border-radius: 5px;
  background-repeat: no-repeat;
  background-size: 2.5rem 2rem;

  transition: all 0.4s ease-in-out;
  transform: scale(1);
}

.ani_scale {
  transform: scale(1.1);
}
</style>