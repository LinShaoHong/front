<script setup lang="ts">
import apiUser from '@/api/apiUser';
import CustomCard from "@/components/CustomCard.vue";
import { message, modal } from "@/utils/unis";
import { networkError } from "@/utils/request";
import { isEmpty } from "@/utils/is";
import { useShare } from "@/hooks/useShare";

const { onShareAppMessage, onShareTimeline } = useShare();

const user = useStore('user');
const config = useStore('config');
const imgUri = inject('$imgUri');
const showEdit = ref(false);

const curr = ref({});
const title = ref('');
const content = ref('');
const loading = ref(false);

const onEdit = () => {
  if (isEmpty(title.value)) {
    return message('请输入标题', 3);
  }
  if (title.value.length > 10) {
    return message('标题不能超过10个字', 3);
  }
  if (isEmpty(content.value)) {
    return message('请输入内容', 3);
  }
  if (content.value.length > 50) {
    return message('内容不能超过50个字', 3);
  }
  if (curr.value == null) {
    const len = user.data.value.defs[0]['items'].filter(v => !v['defaulted']).length;
    if (len >= 50) {
      return message('最多添加50张', 3);
    }
    loading.value = true;
    apiUser.addDef(user.data.value.id, title.value, content.value).then(() => {
      user.getDefs();
      loading.value = false;
      showEdit.value = false;
    });
  } else {
    loading.value = true;
    apiUser.editDef(user.data.value.id, curr.value['id'], title.value, content.value).then(() => {
      user.getDefs();
      loading.value = false;
      showEdit.value = false;
    });
  }
};

const onEnable = (item) => {
  apiUser.enableDef(user.data.value.id, item['id'], !item['enable'])
      .then(() => {
        user.getDefs();
        if (item['enable']) {
          message('已停用', 3);
        }
      }).catch(() => networkError());
}

const onDelete = (item) => {
  modal('删除后不可恢复，确定要删除？', '', true).then(() => {
    apiUser.deleteDef(user.data.value.id, item['id']).then(() => {
      user.getDefs();
    }).catch(() => networkError());
  });
}

</script>

<template>
  <image class="h-screen w-screen fixed" src="/static/back.png" mode="scaleToFill"></image>
  <view class="h-screen w-screen relative pt-50 pl-20 pr-20 flex flex-col items-center">
    <view class="flex gap-20 p-b-30 items-center">
      <view class="title_line w-20vw"></view>
      <text class="text-white" style="font-size: 34rpx">海克斯卡牌</text>
      <view class="title_line w-20vw"></view>
    </view>

    <scroll-view scroll-y>
      <view class="flex flex-wrap justify-between items-center pb-50 p-l-10 p-r-10">
        <view class="card_box w-45vw h-73vw flex flex-col justify-center items-center mt-30 p-t-6"
              @click="() => {showEdit=true; title=null; content=null; curr=null;}">
          <text class="text-white" style="font-size: 160rpx;">+</text>
        </view>

        <view v-for="item in user.data.value.defs[0].items"
              class="card_box w-45vw flex flex-col justify-center items-center mt-30 p-t-6" :key="item.id">

          <image v-if="item.defaulted" class="w-45vw h-65vw" :src="`${imgUri}${item.src}`" mode="scaleToFill"></image>

          <CustomCard v-if="!item.defaulted"
                      :width="'45vw'"
                      :height="'65vw'"
                      :type="'云顶之奕'"
                      :title="item.title"
                      :content="item.content"/>

          <view class="w-45vw h-8vw flex justify-around items-center p-10">

            <view v-if="!item.defaulted" class="h-40"
                  @click="() => {showEdit=true; title=item.title; content=item.content; curr=item;}">
              <image class="h-full" src="/static/edit.png" mode="heightFix"/>
            </view>

            <switch v-if="item.enable" checked color="#BB72EE" style="transform:scale(0.6);" @change="onEnable(item)"/>
            <switch v-if="!item.enable" color="#BB72EE" style="transform:scale(0.6);" @change="onEnable(item)"/>

            <view v-if="!item.defaulted" class="h-40" @click="onDelete(item)">
              <image class="h-full" src="/static/delete.png" mode="heightFix"/>
            </view>

          </view>
        </view>

      </view>
    </scroll-view>

    <Popup position="center" :show="showEdit" @clickMask="showEdit=false">
      <view class="relative w-80vw h-450 p-20 rd-30 flex flex-col items-center gap-20" style="background: white;">
        <view class="w-full pl-10" style="font-size: 24rpx; color:#999;">请输入标题（10字以内）</view>
        <view class="w-full pl-10" style="border-bottom: 1px solid rgb(235, 237, 240);">
          <input class="text-left" style="color: #907BE0; font-size: 30rpx;" v-model="title"/>
        </view>

        <view class="w-full pl-10 mt-10" style="font-size: 24rpx; color:#999;">请输入内容（50字以内）</view>
        <view class="w-full pl-10" style="border-bottom: 1px solid rgb(235, 237, 240);">
          <textarea class="text-left h-150 w-70vw" style="color: #907BE0; font-size: 30rpx;" v-model="content"/>
        </view>

        <button
            class="btn w-200 h-65 flex items-center justify-center"
            :disabled="loading"
            :loading="loading"
            @tap.stop="onEdit"
            style="background-color: #482380; color: white; font-size: 26rpx;">
          {{ loading ? '' : '保存' }}
        </button>
      </view>
    </Popup>
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

.btn[disabled] {
  color: #ffffff;
  background-color: #482380;
  overflow: scroll;
}
</style>