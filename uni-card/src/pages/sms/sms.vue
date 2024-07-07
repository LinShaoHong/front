<script setup lang="ts">
import { delay } from "@/utils/calls";
import { useShare } from "@/hooks/useShare";
import { message } from "@/utils/unis";
import apiUser from "@/api/apiUser";
import { networkError } from "@/utils/request";
import { isEmpty } from "@/utils/is";
import { useWxPay } from "@/hooks/useWxPay";

const { wxPay } = useWxPay();
const { onShareAppMessage, onShareTimeline, sharePath, shareTitle, shareHks, shareFunc } = useShare();
shareFunc.value = () => {
  sharePath.value = 'pages/sms/sms';
  shareHks.value = hks.value;
  shareTitle.value = '请接收一封你的匿名信'
};

const user = useStore('user');
const hks = ref(false);
const imgUri = inject('$imgUri');
const canPopup = ref(false);
onLoad(() => {
  delay(500).then(() => canPopup.value = true);
  listenKeyboard();
});

const write = ref(true);
const content = ref('');
watch(content, (n, o) => {
  if (n.length > 500) {
    content.value = n.substring(0, 500);
  }
});
const sendTab = ref(true);
const showTemplate = ref(false);
const showMessages = ref(false);
const phone = ref('');
const phoneFocus = ref(false);
const recPhones = ref(['18772323232', '18672323232', '18672323232']);
const tempMsgs = ref(['亲爱']);
const copyTemplate = (txt) => {
  uni.setClipboardData({
    data: txt,
    success: () => {
      message('复制成功', 3);
    }
  })
};
const onGetPhoneNumber = (e) => {
  const { detail: { code } } = e;
  if (isEmpty(code)) {
    return;
  }
  apiUser.getPhoneNumber(user.data.value.id, code,)
      .then(data => {
        user.setUserInfo(data.value);
        onSend();
      }).catch(() => networkError());
};
const onSend = () => {
  wxPay('1.5').then(async (prepayId) => {

  });
};

//----------------- chats ---------------
const chats = ref([{
  id: '1',
  time: '2020-12-12 23:32:04',
  userId: user.data.value.id,
  message: '我真的是个沙嗲呢，padding 值为高度的一半padding 值为高度的一半padding 值为高度的一半'
}, {
  id: '2',
  time: '2020-12-12 23:32:04',
  userId: user.data.value.id + '123',
  message: '我真的是个沙嗲呢，既然把你丢了呢'
}] as any);
const replyMsg = ref('');
watch(replyMsg, (n, o) => {
  if (n.length > 500) {
    replyMsg.value = n.substring(0, 500);
  }
});
const replyBottomId = ref('');
const replyInputHeight = ref(0)
const inputQuery = wx.createSelectorQuery();
inputQuery.select('#replyInputId').boundingClientRect();
inputQuery.exec((res) => {
  replyInputHeight.value = res[0].height;
});
const replyInput = (e) => {
  inputQuery.exec((res) => {
    replyInputHeight.value = res[0].height;
  });
  msgQuery.exec((res) => {
    replyMessageHeight.value = res[0].height;
  });
};
const replyFocus = () => {
  toReplyBottom();
};
watch(replyInputHeight, () => {
  toReplyBottom();
});

const toReplyBottom = () => {
  if (chats.value.length > 0) {
    replyBottomId.value = 'replyId:none';
    delay(50).then(() => {
      if (chats.value.length > 0) {
        replyBottomId.value = 'replyId:' + chats.value[chats.value.length - 1].id;
      }
    });
  }
}

const replyKeyboardHeight = ref(0);
const listenKeyboard = () => {
  uni.onKeyboardHeightChange((res) => {
    replyKeyboardHeight.value = res.height;
    inputQuery.exec((res) => {
      replyInputHeight.value = res[0].height;
    });
    msgQuery.exec((res) => {
      replyMessageHeight.value = res[0].height;
    });
  })
};

const msgQuery = wx.createSelectorQuery();
msgQuery.select('#replyMessageId').boundingClientRect();
const replyMessageHeight = ref(0);
msgQuery.exec((res) => {
  replyMessageHeight.value = res[0].height;
});
const replyScrollTop = ref(0);
const replyScrollHeight = ref(0);
const replyScroll = (event) => {
  replyScrollTop.value = event.detail.scrollTop;
  replyScrollHeight.value = event.detail.scrollHeight;
};
</script>

<template>
  <view class="fixed w-screen h-screen"
        :style="{background: write? 'linear-gradient(to bottom, #FFAAC9, #C6F8ED)':''}"></view>
  <view class="relative w-screen h-screen">
    <view v-if="write"
          class="w-full flex items-center justify-center" style="height: calc(100vh - 50px)">
      <view class="absolute w-90vw flex flex-col items-center justify-end gap-10 pl-20 pr-20">

        <view class="w-full h-full rd-30 absolute z-10 bxs"
              style="background-color: rgba(255, 255, 255, 0.7);"/>

        <view
            class="absolute min-h-80 top-20 rd-20 w-full flex flex-col items-center justify-center p-15 z-12 bxs"
            style="background-color: white; width: calc(100% - 40rpx);">
          <input class="w-full pl-10" type="number" placeholder="请输入对方手机号" v-model="phone"
                 style="font-size: 32rpx;"
                 @focus="phoneFocus=true"
                 @blur="() => {delay(120).then(() => phoneFocus=false);}"/>
          <view v-if="phoneFocus && recPhones.length>0" class="w-full h-10"></view>
          <view v-if="phoneFocus && recPhones.length>0"
                v-for="p in recPhones"
                :key="p"
                :style="{'font-weight': phone === p? 'bold':'', 'font-size':'32rpx'}"
                class="w-full p-10" @click="phone=p">
            <text>{{ p.indexOf(phone) > 0 ? p.substring(0, p.indexOf(phone)) : '' }}</text>
            <text class="font-bold">{{ p.indexOf(phone) >= 0 ? phone : '' }}</text>
            <text>{{ p.indexOf(phone) >= 0 ? p.substring(p.indexOf(phone) + phone.length) : p }}</text>
          </view>
        </view>

        <view class="z-11 w-full flex justify-between mt-120" style="align-items: flex-end;">
          <view class="flex flex-col">
            <text class="text-black" style="font-size: 32rpx">编辑短信</text>
            <text style="font-size: 24rpx;">(短信发送价格：0.75元/条)</text>
          </view>
          <view class="h-48 pl-30 pr-30 rd-20 mr-20 flex items-center justify-center bxs"
                style="background-color: #F87FA8;" @click="showTemplate=true">
            <text class="text-white" style="font-size: 24rpx;">参考模板</text>
          </view>
        </view>

        <view class="z-11 w-full rd-20 bxs p-10" style="background-color: white">
          <scroll-view scroll-y class="h-500" :show-scrollbar="false"
                       style="background-color: white; display: inline-block;overflow: hidden;">
            <textarea class="w-full h-full rd-20 pl-20 pr-20 pt-20 pb-10"
                      placeholder="点击输入短信内容(挽回、表白、早晚安、道歉、祝福...)"
                      placeholder-style="font-size: 28rpx"
                      :maxlength="500"
                      cursor-spacing="10"
                      v-model="content"
                      style="background-color: white; font-size: 32rpx; line-height: 32rpx; resize: none;"/>
          </scroll-view>
          <view class="flex flex-col">
            <text style="font-size: 24rpx;">{{ content.length + '/500' }}</text>
            <text style="font-size: 24rpx; color: #F87FA8">按照60个字1条计算，共0元</text>
          </view>
        </view>

        <view class="w-full mb-20 mt-10 h-80 rd-50 flex items-center justify-center z-11 bxs"
              style="background-color: #F87FA8;">
          <button :open-type="isEmpty(user.data.value.phone)? 'getPhoneNumber':''"
                  class="w-full h-full flex items-center justify-center"
                  @click="onSend"
                  @getphonenumber="onGetPhoneNumber"
                  style="color:white; font-size: 32rpx; font-weight: bold; background-color: transparent">
            发送
          </button>
        </view>
      </view>
    </view>
    <view v-if="!write"
          class="w-full" style="height: calc(100vh - 50px)">
      <view class="w-full h-full flex justify-around pb-15 mb-15"
            style="height: 45px; box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0; align-items: flex-end;">
        <view class="h-full w-200 flex flex-col items-center justify-end gap-10" @click="sendTab=true">
          <text :style="{color: sendTab? '#F87FA8':'', 'font-weight': sendTab?'bold':'', 'font-size':'32rpx'}">
            短信聊天记录
          </text>
          <!--          <view class="w-50 rd-5 h-8" :style="{'background-color': sendTab? '#F87FA8':'transparent'}"></view>-->
        </view>
        <!--        <view class="h-full w-200 flex flex-col items-center justify-end gap-10" @click="sendTab=false">-->
        <!--          <text :style="{color: !sendTab? '#F87FA8':'', 'font-weight': !sendTab?'bold':'', 'font-size':'32rpx'}">-->
        <!--            我收到的-->
        <!--          </text>-->
        <!--          <view class="w-50 rd-5 h-8" :style="{'background-color': !sendTab? '#F87FA8':'transparent'}"></view>-->
        <!--        </view>-->
      </view>
      <scroll-view scroll-y :show-scrollbar="false" style="height: calc(100% - 45px - 15rpx)">
        <view class="w-full flex flex-col items-center">
          <view v-for="i in 1"
                :key="i"
                @click="showMessages=true"
                class="w-90vw rd-20 mb-10 mt-10 p-20 flex items-center"
                style="border: 1px solid #E4D6DB">
            <view class="h-60 w-60 flex items-center justify-center"
                  style="border: 1px solid #F87FA8; border-radius: 10rpx;">
              <image :src="`${imgUri}/send.png`" class="h-40" mode="heightFix"/>
            </view>
            <view class="h-80 flex flex-col gap-10 ml-30">
              <text style="font-size: 32rpx; color: black;">187****9729</text>
              <text style="font-size: 28rpx; color: #858585;">点击查看详细内容>></text>
            </view>
            <view class="h-80 flex justify-end" style="flex: 1;">
              <text style="color: #858585; font-size: 26rpx;">2022-20-20 10:10:03</text>
            </view>
          </view>
        </view>
        <view class="w-full h-50 flex items-center justify-center">
          <text style="font-size: 24rpx; color: #858585">我也是有底线的~</text>
        </view>
      </scroll-view>
    </view>
    <view class="w-full flex justify-around items-center pt-5 z-100"
          style="height: 50px; box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;">
      <view class="h-full w-200 flex flex-col items-center justify-end gap-5" @click="write=true">
        <image :src="write? `${imgUri}/write_color.png` : `${imgUri}/write.png`" style="height: 28px;"
               mode="heightFix"></image>
        <text :style="{color: write? '#F87FA8':'#515151','font-size':'24rpx', 'font-weight': write? 'bold':''}">写信
        </text>
      </view>
      <view class="h-full w-200 flex flex-col items-center justify-around gap-5" @click="write=false">
        <image :src="!write? `${imgUri}/env_color.png` : `${imgUri}/env.png`" style="height: 28px;"
               mode="heightFix"></image>
        <text :style="{color: !write? '#F87FA8':'#515151','font-size':'24rpx', 'font-weight': !write? 'bold':''}">信箱
        </text>
      </view>
    </view>
  </view>

  <Popup :show="showTemplate" position="bottom" @clickMask="showTemplate=false" z-index="1000">
    <view :class="[canPopup? '':'h-0']">
      <view class="w-screen flex justify-center items-center h-100"
            @click="showTemplate=false">
        <uni-icons type="down" size="24" color="#EDEDED"/>
      </view>

      <view class="w-full h-80vh"
            style="background-color: #EDEDED; border-radius: 20rpx 20rpx 0 0">
        <scroll-view scroll-x :show-scrollbar="false"
                     style="height: 45px; box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;">
          <view class="w-100vw h-full flex gap-30 pl-30 pr-30 pb-10" style="align-items: flex-end;">
            <view v-for="i in 7" class="flex flex-col items-center gap-10" :key="i" @click="sendTab=true">
              <view style="white-space: nowrap;">
                <text>挽回</text>
              </view>
              <view class="w-50 rd-5 h-8" :style="{'background-color': sendTab? '#F87FA8':'transparent'}"></view>
            </view>
          </view>
        </scroll-view>
        <scroll-view scroll-y :show-scrollbar="false">
          <view class="w-100vw" style="height: calc(80vh - 45px)">
            <view class="w-full h-100 flex items-center justify-center">
              <text style="color: #858585; font-size: 24rpx;">长按复制</text>
            </view>
            <view v-for="msg in tempMsgs" :key="msg" class="w-full flex items-center justify-center mb-30"
                  @longpress="copyTemplate(msg)">
              <view class="p-20 rd-15"
                    style="border: 1px solid #E4D6DB; width: 90%; background-color: #F4CFDC">
                <text style="font-size: 32rpx;">
                  {{ msg }}
                </text>
              </view>
            </view>
            <view class="w-full h-50 flex items-center justify-center">
              <text style="font-size: 24rpx; color: #858585">我也是有底线的~</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </Popup>

  <Popup :show="showMessages" position="bottom" @clickMask="showMessages=false">
    <view :class="[canPopup? '':'h-0']">
      <view class="w-screen h-100 flex justify-center items-center"
            @click="showMessages=false">
        <uni-icons type="down" size="24" color="#EDEDED"/>
      </view>
      <scroll-view id="replyMessageId"
                   :scroll-into-view="replyBottomId"
                   :style="{height: replyInputHeight===0? '60vh':('min(60vh, calc(99vh - 80rpx - '+replyKeyboardHeight+'px - '+replyInputHeight+'px))'),'background-color': '#EDEDED', 'border-radius': '20rpx 20rpx 0 0'}"
                   @scroll="replyScroll"
                   scroll-y>
        <view class="w-full p-20 flex flex-col"
              v-for="chat in chats"
              :id="'replyId:'+chat.id"
              :key="chat.id">
          <view class="w-full h-60 flex items-center justify-center">{{ chat.time }}</view>
          <view class="w-full flex" :style="{'flex-direction': chat.userId===user.data.value.id? 'row-reverse':''}">
            <view class="max-w-70vw min-h-10vw flex items-center p-20 rd-20"
                  :style="{'background-color': chat.userId!==user.data.value.id? 'white':'#F4CFDC',
                         'font-size':'32rpx'
                        }">
              <text>
                {{ decodeURIComponent(chat.message) }}
              </text>
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="w-screen h-80 pt-10 pb-10 pl-50 pr-50 flex justify-between items-center"
            style="background-color: #F7F7F7; border-top: 1rpx #D5D5D5 solid;">
        <view class="flex flex-col">
          <text style="font-size: 24rpx;">{{ replyMsg.length + '/500' }}</text>
          <text style="font-size: 24rpx; color: #F87FA8">按照60个字1条计算，共0元</text>
        </view>
        <view class="h-48 pl-30 pr-30 rd-10 flex items-center justify-center bxs"
              style="background-color: #F87FA8;" @click="showTemplate=true">
          <text class="text-white" style="font-size: 24rpx;">参考模板</text>
        </view>
      </view>
      <view class="w-screen pb-20 pt-20 pl-50 pr-50 flex justify-center" id="replyInputId"
            style="background-color: #F7F7F7; align-items: flex-end">
        <view class="p-20 flex items-center"
              style="background-color: white; border-radius: 10rpx; flex: 1;">
          <scroll-view scroll-y class="max-h-280"
                       style="background-color: white; display: inline-block;overflow: hidden">
            <textarea class="w-full"
                      placeholder="点击输入短信内容"
                      placeholder-style="font-size: 32rpx"
                      auto-height
                      :maxlength="500"
                      :adjust-position="false"
                      v-model="replyMsg"
                      @focus="replyFocus"
                      @input="replyInput"
                      style="background-color: white; font-size: 32rpx; line-height: 32rpx; resize: none;"/>
          </scroll-view>
        </view>
        <view v-if="!isEmpty(replyMsg)"
              class="text-white h-60 mb-10 flex items-center justify-center w-15vw"
              style="background-color: #F87FA8; border-radius: 10rpx; transition: width 2s ease; margin-left: 3vw">
          <button :open-type="isEmpty(user.data.value.phone)? 'getPhoneNumber':''"
                  class="w-full h-full flex items-center justify-center"
                  @click="onSend"
                  @getphonenumber="onGetPhoneNumber"
                  style="color:white; font-size: 28rpx; background-color: transparent">
            发送
          </button>
        </view>
      </view>
      <view class="w-screen" :style="{height: replyKeyboardHeight+'px', 'background-color':'#F7F7F7'}"></view>
    </view>
  </Popup>
</template>

<style scoped lang="scss">
button:after {
  border: 0;
}

.bxs {
  box-shadow: rgba(100, 100, 111, 0.2) 0 7px 29px 0;
}
</style>