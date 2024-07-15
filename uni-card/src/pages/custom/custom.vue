<script setup lang="ts">
import apiUser from '@/api/apiUser';
import CustomCard from "@/components/CustomCard.vue";
import { message, modal } from "@/utils/unis";
import { networkError } from "@/utils/request";
import { isEmpty } from "@/utils/is";
import { useShare } from "@/hooks/useShare";
import env from '@/config/env'
import { forward } from "@/utils/router";
import { delay } from "@/utils/calls";

const { onShareAppMessage, onShareTimeline, shareTitle, shareFunc } = useShare();

const user = useStore('user');
const config = useStore('config');
const imgUri = inject('$imgUri');
const canPopup = ref(false);
const showEdit = ref(false);

const hks = ref(true);
const hksCardType = ref(config.data.value.hksCards.filter(s => s?.open)[0]?.type);
const hksCover = computed(() => {
  if (!hks.value) {
    return false;
  }
  const arr = config.data.value.hksCards.filter(s => s.type === hksCardType.value);
  return arr.length === 0? false : arr[0]['cover'];
});
const hksNoAdd = computed(() => {
  if (!hks.value) {
    return false;
  }
  const arr = config.data.value.hksCards.filter(s => s.type === hksCardType.value);
  return arr.length === 0? false : arr[0]['noAdd'];
});
const loverCardType = ref(config.data.value.loverCards.filter(s => s?.open)[0]?.type);
const loverCardTypeName = computed(() => {
  const arr = config.data.value.loverCards.filter(s => s?.type === loverCardType.value);
  return arr.length === 0 ? '' : arr[0]['name'];
});
const loverCardVisible = computed(() => {
  if(hks.value) {
    return true;
  }
  const arr = config.data.value.loverCards.filter(s => s?.type === loverCardType.value);
  return (arr.length === 0 ? true : arr[0]['visible']) || user.data.value.vip > 0;
});
const cardType = computed(() => {
  return hks.value ? hksCardType.value : loverCardType.value;
});
const cardItems = computed(() => {
  const arr = user.data.value.defs.filter(s => s['name'] === cardType.value);
  if (arr.length > 0) {
    return arr[0]['items'];
  } else {
    return [];
  }
});

const ready = ref(false);
onLoad((option) => {
  if (option !== undefined) {
    hks.value = option['hks'] === 'true';
  }
  ready.value = true;
  delay(500).then(() => canPopup.value = true);
});
shareFunc.value = () => {
  shareTitle.value = hks.value ? config.data.value.shareTitle : config.data.value.loverShareTitle;
};

const curr = ref(null);
const title = ref('');
const content = ref('');
const picPath = ref('');
const loading = ref(false);

const editContent = ref(true);

const showPay = ref(false);

const onAdd = () => {
  showEdit.value = true;
  title.value = '';
  content.value = '';
  picPath.value = '';
  editContent.value = true;
  picLoading.value = false;
  curr.value = null;
};

const picLoading = ref(false);
const picError = () => {
  picLoading.value = false;
};
const picLoaded = () => {
  picLoading.value = false;
};
const uploadPic = () => {
  if ((curr.value === null || !curr.value['defaulted']) && !picLoading.value) {
    user.getUserInfo().then(() => {
      const len = cardItems.value.filter(v => !v['defaulted']).length;
      if ((curr.value == null && len >= 1) && user.data.value.vip < 1) {
        config.getConfigInfo().then(() => {
          showPay.value = true;
        }).catch(() => networkError());
      } else {
        uni.chooseImage({
          success: (chooseImageRes) => {
            const tempFilePaths = chooseImageRes.tempFilePaths;
            picPath.value = 'NONE';
            picLoading.value = true;
            uni.uploadFile({
              url: `${ env.apiBaseUrl }/store/put`,
              filePath: tempFilePaths[0],
              name: 'file',
              success: (uploadFileRes) => {
                picPath.value = JSON.parse(uploadFileRes.data)['value'];
              }
            });
          }
        });
      }
    }).catch(() => networkError());
  }
};

const onEdit = () => {
  const len = cardItems.value.filter(v => !v['defaulted']).length;
  user.getUserInfo().then(() => {
    let can = true;
    if (user.data.value.vip < 1) {
      if (curr.value == null) {
        can = len < 1;
      } else {
        can = !curr.value['defaulted'];
      }
    }
    if (!can) {
      config.getConfigInfo().then(() => {
        showPay.value = true;
      }).catch(() => networkError());
    } else {
      if ((!hks.value || isEmpty(picPath.value)) && isEmpty(title.value)) {
        return message('请输入标题', 3);
      }
      if (title.value.length > 10) {
        return message('标题不能超过10个字', 3);
      }
      if ((!hks.value || isEmpty(picPath.value)) && isEmpty(content.value)) {
        return message('请输入内容', 3);
      }
      if (content.value.length > 50) {
        return message('内容不能超过50个字', 3);
      }
      if (curr.value == null) {
        if (len >= 50) {
          return message('最多添加50张', 3);
        }
      }
      if (curr.value == null) {
        loading.value = true;
        apiUser.addDef(user.data.value.id, title.value, content.value, picPath.value, cardType.value).then(() => {
          user.getDefs();
          loading.value = false;
          showEdit.value = false;
          picLoading.value = false;
        });
      } else {
        loading.value = true;
        apiUser.editDef(user.data.value.id, curr.value['id'], title.value, content.value, picPath.value, cardType.value).then(() => {
          user.getDefs();
          loading.value = false;
          showEdit.value = false;
          picLoading.value = false;
        });
      }
    }
  }).catch(() => networkError());
};

const onEnable = (item) => {
  apiUser.enableDef(user.data.value.id, item['id'], !item['enable'], cardType.value)
      .then(() => {
        user.getDefs();
        if (item['enable']) {
          message('已停用', 3);
        }
      }).catch(() => networkError());
}

const onDelete = (item) => {
  modal('删除后不可恢复，确定要删除？', '', true).then(() => {
    apiUser.deleteDef(user.data.value.id, item['id'], cardType.value).then(() => {
      user.getDefs();
    }).catch(() => networkError());
  });
}

</script>

<template>
  <Background v-if="ready" :hks="hks"/>
  <view v-if="ready" class="h-screen w-screen relative pt-50 pl-20 pr-20 flex flex-col items-center">

    <view v-if="hks" class="flex gap-20 w-full ml-10">
      <view
          class="pl-15 pr-15 pt-10 pb-10 flex justify-center items-center"
          v-for="_cardType in config.data.value.hksCards.filter(s => s?.open)"
          :style="{'border-radius': '20rpx', 'background-color': hksCardType===_cardType.type? '#8606DD':'#5C0498'}"
          @click="hksCardType=_cardType.type"
          :key="_cardType.name">
        <text class="text-white">{{ _cardType.name }}</text>
      </view>
    </view>

    <view v-if="!hks" class="flex gap-20 w-full ml-10">
      <view
          class="pl-15 pr-15 pt-10 pb-10 flex justify-center items-center"
          v-for="_cardType in config.data.value.loverCards.filter(s => s?.open)"
          :style="{'border-radius': '20rpx', 'background-color': loverCardType===_cardType.type? '#FF6110':'#982F06'}"
          @click="loverCardType=_cardType.type"
          :key="_cardType.name">
        <text class="text-white">{{ _cardType.name }}</text>
      </view>
    </view>
    <view v-if="!loverCardVisible"
          class="relative right-0 pl-10 pr-10 pt-5 pb-5 flex justify-center items-center mt-10"
          style="background-image: linear-gradient(to right, #FF6110, transparent); border-radius: 30rpx 0 0 30rpx; align-self: flex-end"
    >
      <text class="text-white">私密卡牌需解锁后查看</text>
    </view>

    <scroll-view scroll-y>
      <view class="flex flex-wrap justify-between items-center pb-50 p-l-10 p-r-10">
        <view v-if="!hks || !hksNoAdd"
            :class="['w-45vw h-73vw flex flex-col justify-center items-center mt-30 p-t-6', hks? 'card_box':'lover_card_box']"
            @click="onAdd">
          <text class="text-white" style="font-size: 160rpx;">+</text>
        </view>

        <view v-for="(item,index) in cardItems"
              :class="['w-45vw flex flex-col justify-center items-center mt-30', hks? 'card_box p-t-6':'lover_card_box']"
              :key="item.id">

          <CustomCard :hks="hks"
                      :count="index+1"
                      :defaulted="item?.defaulted"
                      :width="hks? (isEmpty(item.src) ? '45vw' : 45 * 0.96 + 'vw'):'45vw'"
                      :height="'65vw'"
                      :custom="isEmpty(item.src)"
                      :hks-card-type="hksCardType"
                      :lover-card-type="loverCardType"
                      :title="item.title"
                      :content="item.content"
                      :src="isEmpty(item.src) ? '/static/card.png' : imgUri + item.src"
          />

          <view class="w-45vw h-8vw flex justify-around items-center p-10">

            <view class="h-40 flex justify-center"
                  style="width: 33%"
                  @click="() => {showEdit=true; title=item.title; content=item.content; picPath=item.src; curr=item;}">
              <image class="h-full" src="/static/edit.png" mode="heightFix"/>
            </view>

            <view class="flex justify-center" style="width: 34%">
              <switch v-if="item.enable" checked :color="hks? '#BB72EE':'#FCAD06'" style="transform:scale(0.6);"
                      @change="onEnable(item)"/>
              <switch v-if="!item.enable" :color="hks? '#BB72EE':'#FCAD06'" style="transform:scale(0.6);"
                      @change="onEnable(item)"/>
            </view>

            <view class="h-40 flex justify-center" style="width: 33%" @click="onDelete(item)">
              <image class="h-full" src="/static/delete.png" mode="heightFix"/>
            </view>

          </view>
        </view>

      </view>
    </scroll-view>

    <Popup position="center" :show="showEdit" @clickMask="() => {showEdit=false; editContent=true; picLoading=false;}">
      <view v-if="canPopup" class="relative w-80vw h-65vh pb-20 rd-30 flex flex-col justify-between gap-20" style="background: white;">
        <view class="flex h-62">
          <view class="flex justify-center items-center"
                :style="{width: '50%', 'background-color': editContent? (hks? '#482380':'#FF6110') : '', 'border-radius': '30rpx 0 5rpx 0'}"
                @click="editContent=true">
            <view
                :style="{'display': 'inline-block', 'font-weight': 'bold', 'font-size': '30rpx', color: editContent? 'white' : 'black'}"
            >
              内容
            </view>
          </view>
          <view class="w-180 flex justify-center items-center"
                :style="{width: '50%', 'background-color': !editContent? (hks? '#482380':'#FF6110') : '', 'border-radius': '0 30rpx 0 5rpx'}"
                @click="editContent=false">
            <view
                :style="{'display': 'inline-block', 'font-weight': 'bold', 'font-size': '30rpx', color: !editContent? 'white' : 'black'}"
            >
              图片
            </view>
          </view>
        </view>

        <view v-if="editContent" class="w-full" style="height: calc(61vh - 122rpx);">
          <view class="w-full" style="height: 10%">
            <view class="w-full pl-10" style="font-size: 24rpx; color:#999;">卡牌标题（10字以内）</view>
            <view class="w-full pl-10" style="border-bottom: 1px solid rgb(235, 237, 240);">
              <input class="text-left" style="font-size: 30rpx;" v-model="title"/>
            </view>
          </view>

          <view class="w-full mt-20" style="height: 90%">
            <view class="w-full pl-10 mt-10" style="font-size: 24rpx; color:#999;">惩罚内容（50字以内）</view>
            <view class="w-full pl-10" style="border-bottom: 1px solid rgb(235, 237, 240);  height: 90%;">
              <textarea class="text-left w-70vw" :style="{'font-size': '30rpx', filter: loverCardVisible? '':'blur(7rpx)'}" v-model="content"/>
            </view>
          </view>
        </view>

        <view v-if="!editContent"
              class="w-full flex justify-center items-center"
              style="height: calc(61vh - 122rpx)" @click="uploadPic">

          <image v-if="(curr === null || !curr.defaulted) && !picLoading"
                 class="absolute h-80 w-80 z-10"
                 :src="hks? '/static/upload.png':'/static/lover_upload.png'"/>

          <image v-if="hks && isEmpty(picPath)"
                 class="absolute h-80 w-80"
                 style="top: 25%; height: 25%"
                 mode="heightFix"
                 :src="`${imgUri}/ct.png`"/>

          <image v-if="hks" class="rd-20"
                 :src="isEmpty(picPath) ? '/static/card.png' : imgUri + picPath"
                 style="height: calc((61vh - 122rpx) * 0.98); width: calc((61vh - 122rpx) * 0.98 * 45 / 65);"
                 @error="picError"
                 @load="picLoaded"/>

          <view v-if="!hks"
                class="relative rd-20"
                style="height: calc((61vh - 122rpx) * 0.98); width: calc((61vh - 122rpx) * 0.98 * 45 / 65); background-color: white; box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;">
            <view class="absolute w-full flex items-center justify-between pl-30"
                  style="height: 12%; background-color: #FF6110; border-radius: 20rpx 20rpx 0 0">
              <view class="flex gap-10">
                <image src="/static/dot.png" class="w-20 h-20"></image>
                <image src="/static/dot.png" class="w-20 h-20"></image>
                <image src="/static/dot.png" class="w-20 h-20"></image>
              </view>
              <text style="color: white; font-size: 30rpx; font-weight: bold; letter-spacing: 2rpx;">{{
                  loverCardTypeName
                }}
              </text>
              <text style="color: white; font-size: 34rpx; font-weight: bold; margin-right: 30rpx;">{{ '# 1' }}</text>
            </view>
            <view class="absolute w-full flex items-center justify-center" style="height: 45%; top:55%;">
              <view class="lover_divider" style="left: 0"></view>
              <image :src="isEmpty(picPath)? '/static/lover_ct.png':imgUri + picPath"
                     :class="isEmpty(picPath) || (curr != null && curr.defaulted)? '':'rd-20'"
                     :style="{width: '54%', 'max-height': '94%',filter: loverCardVisible? '':'blur(14rpx)'}"
                     mode="widthFix"
                     @error="picError"
                     @load="picLoaded"/>
              <view class="lover_divider" style="right: 0"></view>
            </view>
          </view>
          <image v-if="picLoading" class="absolute w-60 h-60" src="/static/loading.gif"/>
        </view>

        <button
            :class="['w-200 h-4vh flex items-center justify-center', hks? 'btn':'lover_btn']"
            :disabled="loading"
            :loading="loading"
            @tap.stop="onEdit"
            :style="{'background-color': hks? '#482380':'#FF6110', color: 'white', 'font-size': '26rpx'}">
          {{ loading ? '' : '保存' }}
        </button>
      </view>
    </Popup>

    <PayDialog v-if="canPopup" :show="showPay"
               :hks="hks"
               :html="config.data.value.payText"
               :vip="1"
               @close="showPay=false"/>
  </view>

</template>

<style scoped lang="scss">
.title_line {
  height: 1px;
  background: linear-gradient(to right, red, #eee, #BB72EE);
}

.card_box {
  border: 1px solid #8D71A0;
  border-radius: 30rpx;
}

.lover_card_box {
  border: 1px solid #9C3006;
  border-radius: 30rpx;
}

.lover_divider {
  position: absolute;
  height: 6rpx;
  background-color: #FF6110;
  width: 23%;
}

.btn[disabled] {
  color: #ffffff;
  background-color: #482380;
  overflow: scroll;
}

.lover_btn[disabled] {
  color: #ffffff;
  background-color: #FF6110;
  overflow: scroll;
}
</style>