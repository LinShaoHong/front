<script setup lang="ts">
import {delay} from "@/utils/calls";
import {useShare} from "@/hooks/useShare";
import {message} from "@/utils/unis";
import apiUser from "@/api/apiUser";
import {networkError} from "@/utils/request";
import {isEmpty} from "@/utils/is";
import {useWxPay} from "@/hooks/useWxPay";
import apiSms from "@/api/apiSms";
import {valiPhone} from "@/utils/validator";

const {wxPay} = useWxPay();
const {onShareAppMessage, onShareTimeline, sharePath, shareTitle, shareHks, shareFunc} = useShare();
shareFunc.value = () => {
  sharePath.value = 'pages/sms/sms';
  shareHks.value = hks.value;
  shareTitle.value = config.data.value.smsShareTitle;
};

const user = useStore('user');
const config = useStore('config');

const hks = ref(false);
const imgUri = inject('$imgUri');
const canPopup = ref(false);
onLoad(async () => {
  await delay(500).then(() => canPopup.value = true);
  apiSms.recPhones(user.data.value.id).then((data) => {
    recPhones.value = data.values;
  }).catch(() => networkError());
  fetchTemps();
  listenKeyboard();
});

const write = ref(true);
const content = ref('');
watch(content, (n, o) => {
  if (n.length > 500) {
    content.value = n.substring(0, 500);
  }
});
const boxTab = ref('send');
const showTemplate = ref(false);
const showMessages = ref(false);
const phone = ref('');
const phoneFocus = ref(false);
const recPhones = ref([] as any);

const tempType = ref(config.data.value.smsTemps[0]?.type);
const tempMsgs = ref([] as any);
const copyTemplate = (txt) => {
  uni.setClipboardData({
    data: txt,
    success: () => {
      message('复制成功', 3);
    }
  })
};
const fetchTemps = () => {
  config.getConfigInfo().then(() => {
    apiSms.getSpecsByType(tempType.value).then((data) => {
      tempMsgs.value = data.values;
    }).catch(() => networkError());
  });
};
watch(tempType, () => {
  fetchTemps();
});

const onGetPhoneNumber = (e) => {
  const {detail: {code}} = e;
  if (isEmpty(code)) {
    return;
  }
  return new Promise((resolve, reject) => {
    apiUser.getPhoneNumber(user.data.value.id, code,)
        .then(data => {
          user.setUserInfo(data.value);
          resolve(data.value);
        }).catch(() => networkError());
  });
};
const onGetPhoneNumberAndSend = (e) => {
  onGetPhoneNumber(e)?.then(() => {
    onSend(phone.value, content.value);
  });
};

const onSend = (p, m) => {
  if (isEmpty(user.data.value.phone)) {
    return;
  }
  if (isEmpty(p)) {
    return message('请输入手机号', 3);
  }
  if (!valiPhone(p)) {
    return message('请输入正确的手机号', 3);
  }
  if (isEmpty(m)) {
    return message('请输入短信内容', 3);
  }

  const total = Math.ceil(m.length / config.data.value.smsUnit) * config.data.value.smsPrice + '';
  if (user.data.value.smsCount <= 0) {
    return new Promise((resolve, reject) => {
      wxPay(total).then(async () => {
        apiSms.send({
          userId: user.data.value.id,
          fromPhone: user.data.value.phone,
          toPhone: p,
          message: m
        }).then((data) => {
          message('发送成功', 3);
          user.getUserInfo();
          resolve(data);
        }).catch(() => networkError());
      }).catch(() => networkError());
    });
  } else {
    return new Promise((resolve, reject) => {
      apiSms.send({
        userId: user.data.value.id,
        fromPhone: user.data.value.phone,
        toPhone: p,
        message: m
      }).then((data) => {
        message('发送成功', 3);
        user.getUserInfo();
        resolve(data);
      }).catch(() => networkError());
    });
  }
};

//----------------- records ---------------
const records = ref([] as any);
watch(write, (n, o) => {
  if (!n) {
    apiSms.records(user.data.value.id)
        .then((data) => records.value = data.values)
        .catch(() => networkError());
  }
});
watch(boxTab, (n, o) => {
  apiSms.records(user.data.value.id)
      .then((data) => records.value = data.values)
      .catch(() => networkError());
});

const recordPhone = ref('');
const onRecord = (phone) => {
  apiSms.chats(user.data.value.id, phone)
      .then((data) => {
        chats.value = data.values;
        recordPhone.value = phone;
        showMessages.value = true;
        toReplyBottom();
      })
      .catch(() => networkError());
};

//----------------- chats ---------------
const chats = ref([] as any);
const replyMsg = ref('');
const onReplySend = () => {
  onSend(recordPhone.value, replyMsg.value)?.then(() => {
    replyMsg.value = '';
    onRecord(recordPhone.value);
  })
};

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
            <text style="font-size: 24rpx;">{{ '(短信发送价格：' + config.data.value.smsPrice + '元/条)' }}</text>
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
                      :placeholder="config.data.value.smsPlaceholder"
                      placeholder-style="font-size: 28rpx"
                      :maxlength="500"
                      cursor-spacing="10"
                      v-model="content"
                      style="background-color: white; font-size: 32rpx; line-height: 32rpx; resize: none;"/>
          </scroll-view>
          <view class="flex flex-col">
            <text style="font-size: 24rpx;">{{ content.length + '/500' }}</text>
            <text style="font-size: 24rpx; color: #F87FA8">{{
                user.data.value.smsCount > 0 ? '你还有' + user.data.value.smsCount + '条短信可使用' :
                    '按照' + config.data.value.smsUnit + '个字1条计算，共' + (Math.ceil(content.length / config.data.value.smsUnit) * config.data.value.smsPrice) + '元'
              }}
            </text>
          </view>
        </view>

        <view class="w-full mb-20 mt-10 h-80 rd-50 flex items-center justify-center z-11 bxs"
              style="background-color: #F87FA8;">
          <button :open-type="isEmpty(user.data.value.phone)? 'getPhoneNumber':''"
                  class="w-full h-full flex items-center justify-center"
                  @click="onSend(phone,content)"
                  @getphonenumber="onGetPhoneNumberAndSend"
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
        <view class="h-full w-200 flex flex-col items-center justify-end gap-10" @click="boxTab='send'">
          <text
              :style="{color: boxTab==='send'? '#F87FA8':'', 'font-weight': boxTab==='send'? 'bold':'', 'font-size':'32rpx'}">
            我发出的
          </text>
          <view class="w-50 rd-5 h-8" :style="{'background-color': boxTab==='send'? '#F87FA8':'transparent'}"></view>
        </view>
        <view class="h-full w-200 flex flex-col items-center justify-end gap-10" @click="boxTab='receive'">
          <text
              :style="{color: boxTab==='receive'? '#F87FA8':'', 'font-weight': boxTab==='receive'?'bold':'', 'font-size':'32rpx'}">
            我收到的
          </text>
          <view class="w-50 rd-5 h-8" :style="{'background-color': boxTab==='receive'? '#F87FA8':'transparent'}"></view>
        </view>
      </view>
      <scroll-view scroll-y :show-scrollbar="false" style="height: calc(100% - 45px - 15rpx)">
        <view class="w-full flex flex-col items-center">
          <view v-if="!isEmpty(user.data.value.phone)"
                v-for="record in records.filter(v => v.type===boxTab)"
                :key="record.phone"
                @click="onRecord(record.phone)"
                class="w-90vw rd-20 mb-10 mt-10 p-20 flex items-center"
                style="border: 1px solid #E4D6DB">
            <view class="h-60 w-60 flex items-center justify-center"
                  style="border: 1px solid #F87FA8; border-radius: 10rpx;">
              <image :src="`${imgUri}/${boxTab}.png`" class="h-40" mode="heightFix"/>
            </view>
            <view class="h-80 flex flex-col gap-10 ml-30">
              <text style="font-size: 32rpx; color: black;">
                {{ record.phone.substring(0, 3) + '****' + record.phone.substring(7, 11) }}
              </text>
              <text style="font-size: 28rpx; color: #858585;">点击查看详细内容>></text>
            </view>
            <view class="h-80 flex justify-end" style="flex: 1;">
              <text style="color: #858585; font-size: 28rpx;">{{ record.time }}</text>
            </view>
          </view>
        </view>
        <view v-if="!isEmpty(user.data.value.phone)" class="w-full h-50 flex items-center justify-center">
          <text style="font-size: 24rpx; color: #858585">我也是有底线的~</text>
        </view>
        <view v-if="isEmpty(user.data.value.phone) && boxTab==='receive'"
              class="w-full h-100 flex items-center justify-center">
          <view class="p-10 h-60 rd-10 flex items-center justify-center" style="background-color: #F87FA8;">
            <button open-type="getPhoneNumber"
                    @getphonenumber="onGetPhoneNumber"
                    class="w-full h-full text-white font-bold flex items-center justify-center"
                    style="background-color: transparent;font-size: 28rpx;"
            >点击获取
            </button>
          </view>
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
            <view v-for="temp in config.data.value.smsTemps"
                  class="flex flex-col items-center gap-10"
                  :style="{color: tempType===temp.type? '#F87FA8':'', 'font-weight': tempType===temp.type? 'bold':''}"
                  :key="temp.type"
                  @click="tempType=temp.type">
              <view style="white-space: nowrap;">
                <text>{{ temp.name }}</text>
              </view>
              <view class="w-50 rd-5 h-8"
                    :style="{'background-color': tempType===temp.type? '#F87FA8':'transparent'}"></view>
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
      <view class="w-screen flex justify-center items-center"
            @click="showMessages=false">
        <text class="text-white" style="font-size: 40rpx;">{{ recordPhone }}</text>
      </view>
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
          <view class="w-full h-60 flex items-center justify-center"
                style="font-size: 28rpx; color: #858585">{{ chat.time }}
          </view>
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
          <text style="font-size: 24rpx; color: #F87FA8">{{
              user.data.value.smsCount > 0 ? '你还有' + user.data.value.smsCount + '条短信可使用' :
                  '按照' + config.data.value.smsUnit + '个字1条计算，共' + (Math.ceil(replyMsg.length / config.data.value.smsUnit) * config.data.value.smsPrice) + '元'
            }}
          </text>
        </view>
        <view class="h-48 pl-30 pr-30 rd-10 flex items-center justify-center bxs"
              style="background-color: #F87FA8;" @click="showTemplate=true">
          <text class="text-white" style="font-size: 28rpx;">参考模板</text>
        </view>
      </view>
      <view class="w-screen pb-20 pt-20 pl-50 pr-50 flex justify-center" id="replyInputId"
            style="background-color: #F7F7F7; align-items: flex-end">
        <view class="p-20 flex items-center"
              style="background-color: white; border-radius: 10rpx; flex: 1;">
          <scroll-view scroll-y class="max-h-280"
                       style="background-color: white; display: inline-block;overflow: hidden">
            <textarea class="w-full"
                      placeholder="点击回复"
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
                  @click="onReplySend"
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