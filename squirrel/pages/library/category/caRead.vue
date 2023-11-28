<template>
  <view>
    <back></back>
    <background :url="'../../../static/read-back-1.jpg'"></background>
    <image v-if="microAni" src="../../../static/microphone.png" class="micro"></image>
    <view class="ig" @touchstart="touchStart" @touchend="touchEnd">
      <view class="page"><span>{{ (currentIndex + 1) + '/' + dataList.length }}</span></view>
      <image v-if="!imageError"
             :class="touchToLeft? 'read-img-go-left' : (touchToRight? 'read-img-go-right' : 'read-img-in')"
             :src="$media(data.img)" mode="heightFix" @error="onImageError" @load="onImageLoaded">
        <view v-for="pt in data.points" :key="pt" :class="op==='point' && pointAt===pt ? 'point' : ''"
              style="z-index: 1; position: absolute; left: 38%; bottom: 9%; width:18%; height: 6%;"
              @click="readPoint(pt)"></view>
      </image>
      <image v-if="imageError" class="read-img-in" src="../../../static/image-404.gif" mode="heightFix"></image>
      <image v-if="!imageError && !imageLoaded" src="../../../static/image-loading.gif"
             style="width: 2rem; height: 2rem;" mode="heightFix"></image>
    </view>
    <view class="bs">
      <view class="op-circle" style="top: 0;">
        <view class="op"
              :style="op==='continue'? 'background-color: #F7B52C;box-shadow: 3px 3px 3px 2px #FFAC00 inset,-3px -3px 3px 2px #FFAC00 inset;' : ''"
              @click="read(false)">
          <span v-if="op!=='continue' || !audioPlaying">连读</span>
          <image v-if="op==='continue' && audioPlaying" src="../../../static/voice-wave.gif"
                 style="width: 40px; height: 80px;"></image>
        </view>
      </view>

      <view class="op-circle" style="top: 2.8rem;">
        <view class="op"
              :style="op.startsWith('point') ? 'background-color: #F7B52C;box-shadow: 3px 3px 3px 2px #FFAC00 inset,-3px -3px 3px 2px #FFAC00 inset;' : ''"
              @click="read(true)">
          <span v-if="!op.startsWith('point') || !audioPlaying">点读</span>
          <image v-if="op.startsWith('point') && audioPlaying" src="../../../static/voice-wave.gif"
                 style="width: 40px; height: 80px;"></image>
        </view>
      </view>

      <view class="op-circle" style="bottom: 2.8rem;">
        <view v-if="!recording" class="op"
              :style="op==='record'? 'bottom: 0; background-color: #F7B52C;box-shadow: 3px 3px 3px 2px #FFAC00 inset,-3px -3px 3px 2px #FFAC00 inset;' : 'bottom: 0;'"
              @click="pressRecord">
          <image src="../../../static/microphone.png" style="width: 30px; height: 30px;"></image>
        </view>
        <view v-if="recording" class="op"
              :style="op==='record'? 'bottom: 0; background-color: #F7B52C;box-shadow: 3px 3px 3px 2px #FFAC00 inset,-3px -3px 3px 2px #FFAC00 inset;' : 'bottom: 0;'"
              @click="pressRecord">
          <image src="../../../static/voice-wave.gif" style="width: 40px; height: 80px;"></image>
        </view>
      </view>
      <view class="op-circle" style="bottom: 0;">
        <view class="op"
              :style="op==='playRecord'? 'background-color: #F7B52C;box-shadow: 3px 3px 3px 2px #FFAC00 inset,-3px -3px 3px 2px #FFAC00 inset;' : ''"
              @click="playRecord">
          <image :class="recorderAudioPlaying? 'record-play-ani' : ''" src="../../../static/recordPlay.png"
                 style="width: 20px; height: 20px;"></image>
        </view>
      </view>
    </view>
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
      currentIndex: 0,
      dataList: [{
        "img": "raz-a-post.jpg",
        "audio": "raz-a-1.mp3",
        "points": ["a.mp3"]
      },
        {
          "img": "raz-a-int.jpg",
          "audio": "raz-a-2.mp3",
          "points": ["b.mp3"]
        },
        {
          "img": "raz-a-1.jpg",
          "audio": "raz-a-3.mp3",
          "points": ["c.mp3"]
        },
        {
          "img": "raz-a-2.jpg",
          "audio": "a.mp3",
          "points": ["d.mp3"]
        },
        {
          "img": "read.jpg",
          "audio": "b.mp3",
          "points": ["a.mp3"]
        }
      ],

      audioUrl: '',
      nextStart: false,
      op: 'continue',
      pointAt: '',
      microAni: false
    }
  },
  computed: {
    data() {
      return this.dataList[this.currentIndex];
    }
  },
  methods: {
    onAudioEnded() {
      if (this.op === 'continue') {
        this.swipToLeft();
      }
    },
    loadImage() {
      const to = setTimeout(() => {
        this.stop();
        if (this.op === 'point') {
          this.op = 'point-ready';
          this.pointAt = '';
        }

        if (this.touchToLeft) {
          this.currentIndex += 1;
        } else {
          this.currentIndex -= 1;
        }

        this.imageError = false;
        this.imageLoaded = false;
        const iv = setInterval(() => {
          if (this.imageLoaded || this.imageError) {
            this.touchToLeft = false;
            this.touchToRight = false;
            clearInterval(iv);
            clearTimeout(to);
            if (this.imageLoaded) {
              if (this.op === 'continue') {
                this.play(this.data.audio);
              } else if (this.op === 'point-ready') {
                this.op = 'point';
              }
            }
          }
        }, 50);
      }, 200);
    },
    swipToLeft() {
      if (this.currentIndex < this.dataList.length - 1) {
        this.touchToLeft = true;
        this.loadImage();
      }
    },
    swipToRight() {
      if (this.currentIndex > 0) {
        this.touchToRight = true;
        this.loadImage();
      }
    },
    readPoint(audioUrl) {
      this.recorder.stop();
      this.recorderAudio.stop();
      if (this.op === 'point') {
        this.pointAt = audioUrl;
        this.play(audioUrl);
      }
    },
    play(audioUrl) {
      if (this.audio.paused || this.audioUrl !== audioUrl) {
        this.nextStart = true;
        this.audioUrl = audioUrl;
        this.audio.src = this.$media(audioUrl)
        this.audio.play();
      } else {
        this.audio.pause();
      }
    },
    read(pRead) {
      this.recorder.stop();
      this.recorderAudio.stop();
      if (!pRead) {
        this.op = 'continue';
        this.play(this.data.audio);
      } else {
        this.op = 'point';
        this.audio.stop();
      }
    },
    pressRecord() {
      this.op = 'record';
      if (!this.recording) {
        this.audio.pause();
        this.recorderAudio.stop();
        this.microAni = true;
        const to = setTimeout(() => {
          this.microAni = false;
          clearTimeout(to);
        }, 2000);
        this.recorder.start();
      } else {
        this.recorder.stop();
      }
    },
    playRecord() {
      this.op = 'playRecord';
      this.stop();
      if (!this.recorderAudioPlaying && !this.recording && this.recorderPath) {
        this.recorderAudio.src = this.recorderPath;
        this.recorderAudio.play();
      }
    },
    stop() {
      this.audio.stop();
      this.recorderAudio.stop();
      this.recorder.stop();
    },
  }
}
</script>

<style lang="scss" scoped>
.ig {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('../../../static/read-back-1.jpg');
  background-size: 100vw 100vh;

  .page {
    position: absolute;
    left: 11%;
    bottom: 8%;
    width: 40px;
    height: 20px;
    border-radius: 10px;
    background-color: #FADDB5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    span {
      display: block;
      font-size: 10px;
      color: #F48E00;
    }
  }

  image {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 80%;
    position: absolute;
  }

  .point {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.45) inset;
  }
}

.read-img-go-left {
  animation: read-img-to-left .2s linear forwards;
}

.read-img-go-right {
  animation: read-img-to-right .2s linear forwards;
}

.read-img-in {
  opacity: 0;
  transform: scale(.5);
  animation: read-img-into .1s linear forwards;
}

@keyframes read-img-to-left {
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes read-img-to-right {
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes read-img-into {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.bs {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 3rem;
  height: 86vh;
  margin: auto;
  padding-top: 10px;
  padding-bottom: 10px;
}

.op-circle {
  left: 0;
  right: 0;
  margin: auto;
  position: absolute;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50% 55% 40% 45%;
  background-color: white;
}

.op {
  z-index: 2;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  position: absolute;
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 55% 50% 45% 40%;
  text-align: center;
  vertical-align: middle;
  background-color: #F38A1E;
  box-shadow: 3px 3px 3px 2px #F7820A inset, -3px -3px 3px 2px #F7820A inset;

  image {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    position: absolute;
  }

  span {
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    color: white;
    font-size: 13px;
    letter-spacing: .8px;
  }
}

.op:active {
  animation: op-ani 1s ease;
}

@keyframes op-ani {
  from {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  to {
    transform: scale(1);
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

.micro {
  bottom: 3rem;
  right: 3.5rem;
  margin: auto;
  position: fixed;
  z-index: 5;
  width: 25%;
  height: 50%;
  animation: micro-ani-name .8s linear forwards;
}

@keyframes micro-ani-name {
  from {
    transform: scale(.5);
  }
  70% {
    opacity: 1;
    transform: scale(.7);
  }
  to {
    opacity: 0;
    transform: scale(1);
  }
}
</style>