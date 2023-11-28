<template>
  <view>
    <back></back>
    <view class="_back"></view>
    <view class="box">
      <view class="poster">
        <image :src="$media('raz-a-3.jpg')" mode="aspectFit"></image>
      </view>
      <view class="player" @click="play('test.mp3')">
        <image :class="audioPlaying ? 'play-ani' : ''" src="../../../static/recordPlay.png" mode="aspectFit"></image>
      </view>
      <view class="content" :style="midStyle ? 'display: flex; flex-direction: row; align-items: center;' : ''">
        <span v-for="item in content.fragments" :id="item.id" :key="item.id" :style="'color:' + item.color"
          @tap="trans(item)">{{ item.lines[0] + ' ' }}</span>
      </view>
      <view class="recorder" @click="record">
        <image v-if="!recording" src="../../../static/microphone.png" mode="aspectFit"></image>
        <image v-if="recording" src="../../../static/voice-wave.gif" style="width: 3.2rem; height: 7rem;"></image>
      </view>
      <view v-if="recorderPath" class="record-player" @click="playRecord">
        <image :class="recorderAudioPlaying ? 'play-ani' : ''" src="../../../static/play.png" mode="aspectFit"></image>
      </view>
      <view class="setting" @click="setting">
        <image src="../../../static/setting.png" mode="aspectFit"></image>
      </view>
      <view v-if="hasSetted && setted" class="settings-back" @click="clickSettingBack"></view>
      <view v-if="hasSetted"
        :class="setted ? 'settings-container settings-ani-open' : 'settings-container settings-ani-close'">
        <play-rate @rateChange="changeRate"></play-rate>
        <view class="other-settings">
          <view class="auto-play">
            <my-switch :defaultSwitch="autoPlay" @isSwitch="changeAutoPlay"></my-switch>
            <span>自动播放</span>
          </view>
          <view class="auto-flip">
            <my-switch :defaultSwitch="autoFlip" @isSwitch="changeAutoFlip"></my-switch>
            <span>自动翻页</span>
          </view>
          <view class="collect">
            <view class="icon" @tap="collect">
              <image v-if="collected" src="../../../static/collect.png" mode="aspectFit"></image>
              <image v-if="!collected" src="../../../static/un-collect.png" mode="aspectFit"></image>
            </view>
            <span>加入书架</span>
          </view>
        </view>
      </view>
      <view v-if="hasTrans" class="trans-back" @click="clickTransBack"></view>
      <view v-if="hasTrans" :style="transTextStyle" class="trans-text">
        <span>{{ transWord }}</span>
        <image src="../../../static/word-player.png" @tap="playTransWord"></image>
        <span v-for="item in transText" :key="item">{{ item }}<br /></span>
      </view>
      <view class="page"><span>1/10</span></view>
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
      transAudio: null,
      hasTrans: false,
      transText: null,
      transWord: null,
      transPos: {
        "left": 0,
        "top": 0,
        "width": 0,
        "height": 0
      },
      progressTo: null,
      audioUrl: null,
      setted: false,
      hasSetted: false,
      autoPlay: false,
      autoFlip: true,
      collected: false,
      index: 0,
      content: {
        "fragments": [{
          "begin": "0.000",
          "end": "0.880",
          "id": "f000001",
          "color": "",
          "lines": [
            "A"
          ]
        },
        {
          "begin": "0.880",
          "end": "1.240",
          "id": "f000002",
          "color": "",
          "lines": [
            "is"
          ]
        },
        {
          "begin": "1.240",
          "end": "2.040",
          "id": "f000003",
          "color": "",
          "lines": [
            "for"
          ]
        },
        {
          "begin": "2.040",
          "end": "3.440",
          "id": "f000004",
          "color": "",
          "lines": [
            "apple"
          ]
        },
        {
          "begin": "3.440",
          "end": "4.360",
          "id": "f000005",
          "color": "",
          "lines": [
            "B"
          ]
        },
        {
          "begin": "4.360",
          "end": "4.720",
          "id": "f000006",
          "color": "",
          "lines": [
            "is"
          ]
        },
        {
          "begin": "4.720",
          "end": "5.560",
          "id": "f000007",
          "color": "",
          "lines": [
            "for"
          ]
        },
        {
          "begin": "5.560",
          "end": "7.160",
          "id": "f000008",
          "color": "",
          "lines": [
            "ball"
          ]
        },
        {
          "begin": "7.160",
          "end": "8.160",
          "id": "f000009",
          "color": "",
          "lines": [
            "C"
          ]
        },
        {
          "begin": "8.160",
          "end": "8.480",
          "id": "f000010",
          "color": "",
          "lines": [
            "is"
          ]
        },
        {
          "begin": "8.480",
          "end": "9.240",
          "id": "f000011",
          "color": "",
          "lines": [
            "for"
          ]
        },
        {
          "begin": "9.240",
          "end": "10.400",
          "id": "f000012",
          "color": "",
          "lines": [
            "cat"
          ]
        }
        ]
      }
    }
  },
  onShow() {
    this.transAudio = uni.createInnerAudioContext();
    if (this.autoPlay) {
      this.play('test.mp3');
    }
    this.audio.onTimeUpdate(e => {
      const time = this.audio.currentTime;
      this.content.fragments.slice(this.index).forEach((lyric, i) => {
        if (time < lyric.end && time > lyric.begin) {
          lyric.color = '#FB8103';
          this.index += i;
          if (this.index > 0) {
            this.content.fragments[this.index - 1].color = '';
          }
        }
      });
    });
  },
  computed: {
    midStyle() {
      //return this.content.fragments.length <= 100;
    },
    transTextStyle() {
      return {
        "left": 'calc(' + (this.transPos.left + this.transPos.width / 2) + 'px - 9%)',
        "top": this.transPos.top + 30 + 'px',
      }
    }
  },
  methods: {
    play(audioUrl) {
      this.recorder.stop();
      this.recorderAudio.stop();
      if (this.audio.paused || this.audioUrl !== audioUrl) {
        this.audioUrl = audioUrl;
        this.audio.src = this.$media(audioUrl)
        this.audio.play();
      } else {
        this.audio.pause();
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

    },
    playRecord() {
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
    setting() {
      this.hasSetted = true;
      this.setted = !this.setted;
    },
    clickSettingBack() {
      this.setted = false;
    },
    changeRate(rate) {
      if (this.audio) {
        this.audio.playbackRate = rate;
      }
    },
    changeAutoPlay(isSwitch) {
      this.autoPlay = isSwitch;
    },
    changeAutoFlip(isSwitch) {
      this.autoFlip = isSwitch;
    },
    collect() {
      this.collected = !this.collected;
    },
    onAudioEnded() {
      this.content.fragments[this.index].color = '';
      this.index = 0;
    },
    trans(item) {
      const that = this;
      const word = item.lines[0];
      const query = uni.createSelectorQuery().in(this);
      query.select('#' + item.id).boundingClientRect(data => {
        that.transPos.height = data.height;
        that.transPos.width = data.width;
        that.transPos.left = data.left;
        that.transPos.top = data.top;
      }).exec();

      let httpDefaultOpts = {
        url: "https://dict-mobile.iciba.com/interface/index.php?c=word&m=getsuggest&nums=5&is_need_mean=1&word=" + word,
        method: 'get',
        header: {
          "Accept": "application/json",
          "Content-Type": "application/json; charset=UTF-8"
        },
        dataType: 'json',
      }
      uni.request(httpDefaultOpts).then((res) => {
        const data = res[1].data.message[0];
        const means = data.paraphrase;
        that.transText = new Array();
        that.transWord = word;
        if (data.means) {
          data.means.forEach(v => {
            that.transText.push(v.part + " " + v.means.join(","));
          })
        } else {
          that.transText.push(means);
        }
        that.hasTrans = true;
        that.transAudio.src = "https://dict.youdao.com/dictvoice?type=1&audio=" + word;
        that.transAudio.play();
      }).catch(
        (response) => {
        }
      )
    },
    playTransWord() {
      this.transAudio.play();
    },
    clickTransBack() {
      this.hasTrans = false;
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
  position: relative;
  width: 96vw;
  height: 94vh;
  left: 2vw;
  top: 3vh;
  bottom: 0;
  background-color: #FFF3E3;
  border-radius: 1rem;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 20px 60px -20px, rgba(0, 0, 0, 0.3) 0px 10px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;

  .poster {
    position: absolute;
    left: 3%;
    top: 7%;
    height: 86%;
    width: 28%;
    border-radius: 20px; //box-shadow: #FFD7A0 0px 0px 0px 2px;
    box-shadow: #FFD7A0 0px 1px .8px 1.2px;

    image {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      height: 96%;
      width: 98%;
      margin: auto;
    }
  }

  .player {
    position: absolute;
    z-index: 10;
    left: 32%;
    bottom: 40%;
    width: 2rem;
    height: 2rem;
    background-color: #FEA70F;
    border-radius: 50%;
    box-shadow: #DC8B00 0px 50px 100px -20px, #DC8B00 0px 30px 60px -30px, #DC8B00 0px -2px 6px 0px inset;

    image {
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

  .content {
    position: absolute;
    left: 38%;
    width: 52%;
    top: 7%;
    height: 86%;
    overflow-y: scroll;
    scroll-behavior: smooth;
    line-height: 25px;
    display: flex;
    flex-direction: row;
    column-gap: 5px;

    span {
      display: block;
      color: #85613F;
      font-size: 18px;
    }
  }

  .recorder {
    position: absolute;
    z-index: 10;
    right: 1%;
    bottom: 3%;
    width: 4rem;
    height: 4rem;
    background-color: #FEA70F;
    border-radius: 50%;
    box-shadow: #DC8B00 0px 50px 100px -20px, #DC8B00 0px 30px 60px -30px, #DC8B00 0px -2px 6px 0px inset;

    image {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 3rem;
      height: 3rem;
    }
  }

  .record-player {
    position: absolute;
    right: calc(1% + 1rem);
    bottom: calc(1% + 5rem);
    width: 2rem;
    height: 2rem;
    background-color: #FFB636;
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

  .play-ani {
    animation: play-ani-name .4s linear infinite;
  }

  @keyframes play-ani-name {
    from {
      transform: scale(1);
    }

    50% {
      transform: scale(.9);
    }

    to {
      transform: scale(1);
    }
  }

  .setting {
    position: absolute;
    z-index: 10;
    right: -1%;
    top: 1%;
    width: 2.5rem;
    height: 2.5rem;
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 .1rem #FFD99B;

    image {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  .settings-container {
    z-index: 12;
    position: absolute;
    right: -1%;
    top: calc(1% + 3rem);
    width: 15rem;
    height: 7rem;
    border-radius: 10px;
    background-color: white;
    box-shadow: 0 .15rem #FFD99B, .15rem 0 #FFD99B, 0 1px 20px -15px #FFD99B inset;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: .6rem;
    padding-left: .5rem;
    padding-right: .5rem;

    .other-settings {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      width: 90%;

      .auto-play {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        row-gap: .4rem;

        span {
          display: block;
          font-size: .7rem;
          color: #8F6637;
          font-weight: bold;
        }
      }

      .auto-flip {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        row-gap: .4rem;

        span {
          display: block;
          font-size: .7rem;
          color: #8F6637;
          font-weight: bold;
        }
      }

      .collect {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        row-gap: .4rem;

        .icon {
          width: 1.5rem;
          height: 1.5rem;
          position: relative;
          border-radius: 50%;
          box-shadow: rgba(0, 0, 0, 0.15) .5px 1px 1px;

          image {
            position: absolute;
            width: 90%;
            height: 90%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
          }
        }

        span {
          display: block;
          font-size: .7rem;
          color: #8F6637;
          font-weight: bold;
        }
      }
    }
  }

  .settings-back {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 11;
    background-color: transparent;
  }

  .settings-ani-open {
    transform-origin: right top;
    transition: .3s linear;
    transform: scale(1);
  }

  .settings-ani-close {
    transform-origin: right top;
    transform: scale(0);
    transition: .3s linear;
  }

  @keyframes settings-ani-open-name {
    from {
      transform: scale(0);
    }

    to {
      transform: scale(1);
    }
  }

  @keyframes settings-ani-close-name {
    to {
      transform: scale(0);
    }
  }

  .trans-back {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 11;
    background-color: transparent;
  }

  .trans-text {
    z-index: 12;
    position: fixed;
    width: 18%;
    height: 10rem;
    border-color: #FADDB5;
    background-color: white;
    border-radius: 5px;
    padding: 10px;
    box-sizing: border-box;
    //box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
    overflow: scroll;
    scroll-behavior: smooth;

    image {
      margin-top: .5rem;
      height: 1rem;
      width: 1rem;
    }

    span {
      line-height: .8rem;
      font-size: .8rem;
      word-break: normal;
      width: auto;
      display: block;
      white-space: pre-wrap;
      word-wrap: break-word;
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
      line-height: 10px;
      display: block;
      font-size: .7rem;
      color: #F48E00;
    }
  }
}
</style>