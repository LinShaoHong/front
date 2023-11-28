<template>
  <view>
    <back></back>
    <view class="_back"></view>
    <view class="box" @touchstart="touchStart" @touchend="touchEnd">
      <view class="middle">
        <word-card v-for="item in left" :key="item" class="card left" :frontUrl="$media(item)" :word="item.split('.')[0]"
          @click.native="swipToRight"></word-card>
        <word-card class="card" :key="curr" :frontUrl="$media(curr)" :canRotate="true" style="z-index: 100000;"
          :word="curr.split('.')[0]"></word-card>
        <word-card v-for="(item, i) in right" :key="item" class="card right"
          :style="'z-index:' + (dataList.length - i) + ';'" :frontUrl="$media(item)" :word="item.split('.')[0]"
          @click.native="swipToLeft"></word-card>
      </view>
      <view class="recorder" @click="record">
        <image v-if="!recording" src="../../../static/microphone.png" mode="aspectFit"></image>
        <image v-if="recording" src="../../../static/voice-wave.gif" style="width: 2rem; height: 5rem;"></image>
        <u-circle-progress v-if="recording" class="progress" active-color="#fff" width="40" border-width="3"
          inactive-color="#FEA70F" bg-color="#FEA70F" :percent="100" duration="8500">
        </u-circle-progress>
      </view>
      <view v-if="hasRecord" class="player" @click="play">
        <image :class="recorderAudioPlaying ? 'record-play-ani' : ''" src="../../../static/play.png" mode="aspectFit">
        </image>
      </view>
      <view class="page"><span>{{ (index + 1) + '/' + dataList.length }}</span></view>
    </view>
    <scroll-view class="tag-container" scroll-x="true"
      :style="'width:' + (Math.min(dataList.length, 10) * 9 + 6) + 'vh;'">
      <view v-for="(item, i) in dataList" :key="item" :class="[i === index ? 'tag-active' : '', 'tag']"></view>
    </scroll-view>
  </view>
</template>

<script>
import audio from '@/common/audio.js';
import record from '@/common/record.js';
import touch from '@/common/touch.js';
import image from '@/common/image.js';

export default {
  mixins: [audio, record, touch, image],
  data() {
    return {
      index: 0,
      dataList: ['apple.png', 'bear.png', 'cat.png', 'oxford.jpg', 'raz-a-1.jpg', 'oxford2.jpg', 'oxford3.jpg', 'oxford4.jpg'],
      progressTo: null,
      records: null
    }
  },
  computed: {
    left() {
      if (this.index > 0) {
        return this.dataList.slice(0, this.index);
      }
      return [];
    },
    curr() {
      return this.dataList[this.index];
    },
    right() {
      if (this.index < this.dataList.length - 1) {
        return this.dataList.slice(this.index + 1, this.dataList.length);
      }
      return [];
    },
    hasRecord() {
      return this.records && this.records[this.index];
    }
  },
  methods: {
    swipToLeft() {
      if (this.index < this.dataList.length - 1) {
        this.index += 1;
      }
    },
    swipToRight() {
      if (this.index > 0) {
        this.index -= 1;
      }
    },
    record() {
      if (!this.recording) {
        this.audio.pause();
        this.recorderAudio.stop();
        this.recorder.start();
        this.progressTo = setTimeout(() => {
          this.recorder.stop();
          clearTimeout(this.progressTo);
        }, 9000);
      } else {
        if (this.progressTo) {
          clearTimeout(this.progressTo);
        }
        this.recorder.stop();
      }
    },
    onRecorderStop() {
      if (this.recorderPath) {
        if (!this.records) {
          this.records = new Array(this.dataList.length);
        }
        this.$set(this.records, this.index, this.recorderPath);
      }
    },
    play() {
      this.stop();
      if (!this.recorderAudioPlaying && !this.recording && this.records[this.index]) {
        this.recorderAudio.src = this.records[this.index];
        this.recorderAudio.play();
      }
    },
    stop() {
      this.audio.stop();
      this.recorderAudio.stop();
      this.recorder.stop();
    }
  }
}
</script>

<style lang="scss" scoped>
._back {
  z-index: -10;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: #FDCA88;
  opacity: .8;
}

.box {
  position: absolute;
  width: 96vw;
  height: 94vh;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background-color: #FFF3E3;
  border-radius: 1rem;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 20px 60px -20px, rgba(0, 0, 0, 0.3) 0px 10px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;

  .middle {
    left: 0;
    right: 0;
    top: 12%;
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    height: 62%;
    position: absolute;

    .card {
      position: relative;
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
      position: absolute;
      height: 100%;
      width: 11rem;
      transition: .3s linear;
    }

    .left {
      transform: scale(.8) translate(-16rem, 2rem) rotateZ(-20deg);
    }

    .right {
      transform: scale(.8) translate(16rem, 2rem) rotateZ(20deg);
    }
  }

  .recorder {
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    bottom: 1%;
    width: 4rem;
    height: 4rem;
    background-color: #FEA70F;
    border-radius: 50%;
    box-shadow: #DC8B00 0px 50px 100px -20px, #DC8B00 0px 30px 60px -30px, #DC8B00 0px -2px 6px 0px inset;

    image {
      z-index: 10;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 3rem;
      height: 3rem;
    }

    .progress {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }

  .player {
    position: absolute;
    left: calc(50% + 3rem);
    bottom: calc(1% + 1rem);
    width: 2rem;
    height: 2rem;
    background-color: #FEBE18;
    border-radius: 50%;
    box-shadow: #E2A02F 0px 50px 100px -20px, #E2A02F 0px 30px 60px -30px, #E2A02F 0px -2px 6px 0px inset;

    image {
      z-index: 10;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 1rem;
      height: 1rem;
    }
  }

  .record-play-ani {
    animation: record-player .6s linear infinite;
  }

  @keyframes record-player {
    from {
      transform: scale(1);
    }

    50% {
      transform: scale(0.6);
    }

    to {
      transform: scale(1);
    }
  }

  .page {
    position: absolute;
    left: 3%;
    bottom: 5%;
    width: 6%;
    height: 6%;
    border-radius: 1rem;
    background-color: #FADDB5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    span {
      display: block;
      font-size: .7rem;
      color: #F48E00;
    }
  }
}

.tag-container {
  position: absolute;
  height: 12vh;
  left: 0;
  right: 0;
  top: 0;
  margin-left: auto;
  margin-right: auto;
  border-radius: 0 0 2rem 2rem;
  background-color: white;
  box-shadow: 0 .15rem #FEE3B6;
  white-space: nowrap;
  padding-left: 3vh;
  padding-right: 3vh;

  .tag {
    display: inline-block;
    width: 7vh;
    height: 7vh;
    padding: 1vh;
    margin: 1vh;
    margin-top: 2vh;
    border-radius: 50%;
    background-color: #FDCA88;
  }

  .tag-active {
    background-color: #F38A1E;
  }
}
</style>