<template>
  <view>
    <view v-if="logged">
      <kids></kids>
    </view>
    <view v-else>
      <view class="_back"></view>
      <view class="left_top" hover-class="ani_scale"></view>
      <logo></logo>
      <view class="login-box">
        <view class="login-input-box">
          <image src="../../static/login/phone.png"></image>
          <view class="line"></view>
          <input :class="onPhoneFc ? 'input-focus' : ''" type="number" name="phone" placeholder="请输入手机号" v-model="phone"
            @focus="onPhone(1)" @blur="onPhone(2)" />
        </view>
        <view class="login-input-box">
          <image src="../../static/login/code.png"></image>
          <view class="line"></view>
          <view class="send-code">发送短信</view>
          <input :class="onCodeFc ? 'input-focus' : ''" type="number" name="phone" placeholder="请输入验证码" v-model="code"
            @focus="onCode(1)" @blur="onCode(2)" />
        </view>
        <glass-button :text="'登 录'" @click.native="login" :fontWeight="'bold'" :width="$pad ? '220rpx' : '200rpx'"
          :height="'33rpx'" :radius="$pad ? '40rpx' : '33rpx'" :fontSize="'15rpx'"></glass-button>
      </view>
      <view class="ftb-box">
        <view class="flex flex-row items-center justify-center gap-16">
          <image class="ftb" hover-class="ani_scale" src="../../static/index_book_1.jpg"></image>
          <image class="ftb" hover-class="ani_scale" src="../../static/index_book_2.jpg"></image>
          <image class="ftb" hover-class="ani_scale" src="../../static/index_book_3.jpg"></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import kids from '../kids/index.vue'

export default {
  components: {
    kids
  },
  data() {
    return {
      logged: false,
      phone: '',
      onPhoneFc: false,
      onCodeFc: false,
      code: '',
    }
  },
  methods: {
    login() {
      this.logged = true
    },
    onPhone(flag) {
      if (flag === 1) {
        this.onPhoneFc = true;
      } else {
        this.onPhoneFc = false;
      }
    },
    onCode(flag) {
      if (flag === 1) {
        this.onCodeFc = true;
      } else {
        this.onCodeFc = false;
      }
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
  background-color: #FAEFD5;
  opacity: .8;


  @media (min-height: 500px) and (max-height: 1366px) {
    box-shadow: 0 -150rpx 2rpx 0 #FCB146 inset;
  }

  @media (min-height: 0px) and (max-height: 500px) {
    box-shadow: 0 -120rpx 2rpx 0 #FCB146 inset;
  }
}

.left_top {
  top: 2vw;
  left: 2vw;
  background: url('../../static/index_left_top.jpg') center;

  @media (min-height: 500px) and (max-height: 1366px) {
    width: 15vh;
    height: 20vh;
    background-size: 15vh 20vh;
  }

  @media (min-height: 0px) and (max-height: 500px) {
    width: 20vh;
    height: 25vh;
    background-size: 20vh 25vh;
  }

  position: fixed;

  box-shadow: 0px 2px 3px #888888;
  transition: all 0.4s ease-in-out;
  transform: scale(1);
}

.ftb-box {
  position: fixed;
  width: 100vw;
  bottom: 10rpx;

  .ftb {
    @media (min-height: 500px) and (max-height: 1366px) {
      width: 180rpx;
      height: 120rpx;
    }

    @media (min-height: 0px) and (max-height: 500px) {
      width: 150rpx;
      height: 100rpx;
    }

    box-shadow: -2px 0px 3px #888888;
    transition: all 0.4s ease-in-out;
    transform: scale(1);
  }
}

.login-box {
  position: relative;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-height: 500px) and (max-height: 1024px) {
    top: 26vh;
    row-gap: 8rpx;
  }

  @media (min-height: 0px) and (max-height: 500px) {
    top: 24vh;
    row-gap: 5rpx;
  }

  .login-input-box {
    position: relative;

    image {
      position: absolute;

      @media (min-height: 500px) and (max-height: 1366px) {
        width: 16rpx;
        height: 16rpx;
        top: 12rpx;
        left: 12rpx;
      }

      @media (min-height: 0px) and (max-height: 500px) {
        width: 15rpx;
        height: 15rpx;
        top: 9rpx;
        left: 9rpx;
      }
    }

    .line {
      background-color: #dedede;
      position: absolute;

      @media (min-height: 500px) and (max-height: 1366px) {
        width: 1rpx;
        height: 16rpx;
        top: 12rpx;
        left: 32rpx;
      }

      @media (min-height: 0px) and (max-height: 500px) {
        width: 1rpx;
        height: 13rpx;
        top: 10rpx;
        left: 30rpx;
      }
    }

    input {
      @media (min-height: 500px) and (max-height: 1366px) {
        height: 40rpx;
        width: 220rpx;
        font-size: 10rpx;
        border-radius: 40rpx;
        padding-left: 35rpx;
        padding-top: 12rpx;
        padding-bottom: 12rpx;
      }

      @media (min-height: 0px) and (max-height: 500px) {
        height: 33rpx;
        width: 200rpx;
        font-size: 12rpx;
        border-radius: 33rpx;
        padding-left: 33rpx;
        padding-top: 10rpx;
        padding-bottom: 10rpx;
        padding-right: 70rpx;
      }

      background: #f8f7fc;
      border: 1px solid #eae7e7;
      box-sizing: border-box;
    }

    .input-focus {
      border: 1px solid #FCB146;
    }

    .send-code {
      position: absolute;
      font-weight: bold;
      color: white;
      display: grid;
      letter-spacing: 1px;
      place-content: center;
      background-color: #F38A1E;
      font-size: 10rpx;

      @media (min-height: 500px) and (max-height: 1366px) {
        right: 5rpx;
        width: 60rpx;
        height: 26rpx;
        top: 7rpx;
        border-radius: 23rpx;
      }

      @media (min-height: 0px) and (max-height: 500px) {
        right: 5rpx;
        width: 60rpx;
        height: 23rpx;
        top: 5rpx;
        border-radius: 23rpx;
      }
    }
  }
}
</style>