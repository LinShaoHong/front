<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div v-if="user !== null" class="promotion-container" >
      <el-divider><span style="color: #f90; font-size: 20px;">推廣</span></el-divider>
      <div class="promotion-info">
        <div class="info-label">推廣說明</div>
        <div class="info-value">
          復制以下文案推廣到QQ群（或其他軟件的喝茶修車群），將推廣聊天記錄截圖上傳，註意圖片需包含
          <span style="color: #f90;">群名稱</span>和<span  style="color: #f90;">文案發送時間</span>，
          審批通過後，可獲取<span style="color: #f90;">5金幣</span>作為獎勵！
        </div>
        <div class="info-label">推廣文案</div>
        <div class="info-value">
          <span>{{ treatment }}</span>
          <a style="cursor: pointer; margin-left: 5px; color: #f90;"
             v-clipboard="treatment"
             v-clipboard:success="onCopy"
          >复制</a>
        </div>
        <div class="info-label">上传推广凭证</div>
        <div class="info-value">
          <el-upload
            :action="uploadPath"
            :headers="headers"
            :limit="100"
            :file-list="detailImages"
            :on-exceed="uploadOverrun"
            :on-success="uploadDetailImage"
            :on-remove="handleDetailRemove"
            multiple
            accept=".jpg,.jpeg,.png,.gif"
            list-type="picture-card"
            class="promotion-uploader"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </div>
      </div>
      <el-button type="primary" @click="apply" style="width: 100%;">提交</el-button>
<!--      <a style="float: left; color: #f90; cursor: pointer; margin-top: 10px;">我的推廣記錄</a>-->
    </div>
    <div v-else class="noLogin">
      <span>您還未<a style="cursor: pointer; color: #f90;" @click="toLogin">登錄</a>....</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Layout from '@/common/layout'
import { UserModule } from '@/store/modules/user'
import { deleteFile, uploadPath } from '@/api/storage'
import { createPromotion, getTreatment } from '@/api/promotion'
import { Message } from 'element-ui'
import Pagination from '@/components/Pagination/index.vue'
import { deviceResizeSupporter } from '@/utils/mixin'
import Ripple from '@/components/Loading/Ripple.vue'
import da from "element-ui/src/locale/lang/da";

@Component({
  name: 'Promotion',
  components: {
    Pagination,
    Ripple
  }
})
export default class extends mixins(Layout) {
  private SERVER = process.env.VUE_APP_IMAGE_SERVER
  private uploadPath = uploadPath
  private mobileImagesWidth: number = 0

  private detailImages = []
  private treatment: string = ''

  private uploadDetailImage(resp: any) {
    const path = resp.value
    this.detailImages.push(path)
  }

  private async handleDetailRemove(resp: any) {
    const path = resp.response === undefined? resp.url.substring(this.SERVER.length, resp.url.length) : resp.response.value
    for (let i = 0; i < this.detailImages.length; i++) {
      if (this.detailImages[i] === path) {
        this.detailImages.splice(i, 1)
      }
    }
    await deleteFile({ path: path })
  }

  get user() {
    return UserModule.user
  }

  private async apply() {
    const data = await createPromotion({ images: this.detailImages })
    if (data.code === 200) {
      Message({
        message: '提交成功',
        type: 'success',
        duration: 1000
      })
    }
  }

  private onCopy() {
    Message({
      message: '復制成功',
      type: 'success',
      duration: 1000
    })
  }

  private toLogin() {
    this.$router.push({ path: '/user/login' })
  }

  private resize() {
    if (this.mobile) {
      const c = Math.floor(window.outerWidth * 0.98 / 165)
      this.mobileImagesWidth = c * 155
    }
  }

  private async getTreatment() {
    const data = await getTreatment()
    this.treatment = data.value
  }

  created() {
    if (UserModule.user !== null) {
      deviceResizeSupporter(this.resize)
    }
    this.getTreatment()
  }
}
</script>

<style lang="less" scoped>
.promotion-container {
  margin-top: 5%;
  padding-left: 25%;
  padding-right: 25%;
}

.promotion-info {
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 2fr 5fr;
  font-size: 15px;
  margin-bottom: 10px;
  row-gap: 10px;

  .info-label {
    text-align: right;
    color: whitesmoke;
  }

  .info-value {
    margin-left: 20px;
    text-align: left;
    color: whitesmoke;
  }
}

.el-divider__text {
  background-color: #000;
}

.el-divider--horizontal {
  background-color: #f90;
}

.promotion-uploader /deep/ .el-upload--picture-card {
  background-color: #000;
}

.promotion-uploader /deep/ .el-upload:hover {
  border-color: #8c939d;
}

.promotion-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.noLogin {
  width: 80%;
  height: 200px;
  margin: 4% auto auto;
  border: 2px solid #2F2F2F;
  display: flex;
  justify-content: center;

  span {
    margin: auto;
    font-size: 20px;
    color: #A3A2A2;
  }
}

.mobile {
  .promotion-container {
    margin-top: 5%;
    padding-left: 2%;
    padding-right: 2%;
  }
}
</style>
