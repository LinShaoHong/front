<template>
  <view>
    <view v-if="logged">
      <kids></kids>
    </view>
    <view v-else>
      <view class="_back"></view>
      <view class="left_top" hover-class="ani_scale"></view>
      <logo></logo>
      <view class="flex flex-col items-center justify-center mb-1 pt-16">
        <view class="flex flex-col items-center justify-center h-36 gap-2" style="margin-top: 10px;">
          <input class="in" value="123456789101" type="text" placeholder="请输入手机号" />
          <input class="in" value="12345" type="text" placeholder="请输入验证码" />
          <glass-button :text="'登录'" @click.native="login" :radius="'5px'"></glass-button>
        </view>
      </view>
      <view class="fixed w-full bottom-4">
        <view class="flex flex-row items-center justify-center gap-16">
          <view class="ftb" hover-class="ani_scale"
            style="background: url('../../static/index_book_1.jpg') center; background-size: 8rem 6rem;"></view>
          <view class="ftb" hover-class="ani_scale"
            style="background: url('../../static/index_book_2.jpg') center; background-size: 8rem 6rem;"></view>
          <view class="ftb" hover-class="ani_scale"
            style="background: url('../../static/index_book_3.jpg') center; background-size: 8rem 6rem;"></view>
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
      logged: false
    }
  },
  methods: {
    login() {
      this.logged = true
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
  box-shadow: 0 -8rem .1rem 0rem #FCB146 inset;
}

.left_top {
  top: 1rem;
  left: 1rem;
  width: 5rem;
  height: 6rem;
  position: fixed;
  background: url('../../static/index_left_top.jpg') center;
  background-size: 5rem 6rem;
  box-shadow: 0px 2px 3px #888888;
  transition: all 0.4s ease-in-out;
  transform: scale(1);
}

.ftb {
  width: 8rem;
  height: 6rem;
  box-shadow: -2px 0px 3px #888888;
  transition: all 0.4s ease-in-out;
  transform: scale(1);
}

.in {
  padding: 4px;
  box-sizing: border-box;
  height: 2rem;
  width: 10rem;
  background-color: white;
  display: inline-block;
  border-radius: 5px;
  backdrop-filter: blur(10px);
  border: .8px solid #dbd4d4;

  &:focus-within {
    border-color: #f8be6d;
  }
}

.ani_scale {
  transform: scale(1.2);
}
</style>