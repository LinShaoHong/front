<template>
  <view class="card-container">
    <view :class="rotated && canRotate ? 'card-inner card-rotate' : 'card-inner'" @click="rotate">
      <view class="wrapper card-front">
        <view class="middle">
          <view class="front">
            <view class="poster">
              <image :src="frontUrl"></image>
            </view>
            <view class="title"><span>{{ word }}</span></view>
          </view>
        </view>
      </view>
      <view class="wrapper card-back">
        <view class="middle">
          <view class="front">
            <view class="trans">
              <span v-for="item in transText" :key="item">{{ item }}<br /></span>
            </view>
            <view class="title"><span>{{ word }}</span></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "word-card",
  props: {
    frontUrl: {
      default: '',
      type: String
    },
    word: {
      default: '',
      type: String
    },
    canRotate: {
      default: false,
      type: Boolean
    }
  },
  watch: {
    canRotate(o, n) {
      if (!o && n) {
        this.rotated = false;
      }
    }
  },
  data() {
    return {
      rotated: false,
      transText: null
    }
  },
  methods: {
    rotate() {
      if (this.canRotate) {
        this.rotated = !this.rotated;
        if (this.rotated) {
          const that = this;
          let httpDefaultOpts = {
            url: "https://dict-mobile.iciba.com/interface/index.php?c=word&m=getsuggest&nums=5&is_need_mean=1&word=" + this.word,
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
            if (data.means) {
              data.means.forEach(v => {
                that.transText.push(v.part + " " + v.means.join(","));
              })
            } else {
              that.transText.push(means);
            }
          }).catch(
            (response) => { }
          )
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  perspective: 300px;

  .wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 1;
    border-radius: 20px;
    background-color: #FFEDD5;
    box-shadow: 0 1px 1px 0 #FFD7A0;
  }

  .card-inner {
    width: 100%;
    height: 100%;
    position: absolute;
    transition: .3s linear;
    transform-style: preserve-3d;
  }

  .card-rotate {
    transform: rotateY(180deg);
  }

  .card-front {
    backface-visibility: hidden;
  }

  .card-back {
    transform: rotateY(180deg);
    backface-visibility: hidden;
  }

  .middle {
    position: relative;
    top: 0;
    width: 100%;
    height: 98.5%;
    z-index: 2;
    border-radius: 20px;
    background-color: #FFEDD5;
    box-shadow: 0 1px 1px 0 #FFD7A0;
  }

  .front {
    position: relative;
    top: 0;
    width: 100%;
    height: 98.5%;
    z-index: 2;
    border-radius: 20px;
    background-color: #FFEDD5;
    box-shadow: 0 1px 1px 0 #FFD7A0;
  }

  .poster {
    position: relative;
    top: 3%;
    height: 75%;
    width: 90%;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    border-radius: 15px;
    background-color: white;
    box-shadow: #FFD7A0 0px 0px 0px 2px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    image {
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      margin: auto;
      width: 90%;
      height: 90%;
      position: absolute;
    }
  }

  .trans {
    position: relative;
    box-sizing: border-box;
    padding: 8px;
    top: 3%;
    height: 75%;
    width: 90%;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    overflow: scroll;
    scroll-behavior: smooth;
    border-radius: 15px;
    background-color: #F6F3EE;
    box-shadow: #FFD7A0 0px 0px 0px 2px;

    span {
      display: block;
      line-height: 1rem;
      font-size: .8rem;
      word-break: normal;
      width: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }

  .title {
    position: relative;
    width: 100%;
    height: 25%;
    top: 1%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    span {
      display: block;
      font-size: 1.3rem;
      font-weight: 600;
      color: #926124;
    }
  }
}
</style>