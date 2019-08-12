<template>
  <div
    :class="mobile ? 'img-details mobile' : 'img-details'"
  >
    <image-gallery
      v-if="isShow"
      ref="imgSlider"
      :image="image"
      :title="title"
      :on-close="closeViewer"
      :urls="urls"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { DeviceType, AppModule } from '@/store/modules/app'
import { getDetails } from '@/api/imageApi'
import { ImageResp } from '@/api/imageType'
import ImageGallery from './ImageGallery.vue'

@Component({
  name: 'ImageDetails',
  components: {
    ImageGallery
  }
})
export default class extends Vue {
  @Prop({ default: {} }) private image: ImageResp

  private isShow = false
  private urls = []

  private closeViewer() {
    setTimeout(() => {
      this.isShow = false
    }, 500)
  }

  public async showViewer(imgId: string) {
    let data = await getDetails(imgId)
    this.isShow = true
    this.urls = data.values.map(v => 'http://172.20.10.2/images' + v)
  }

  get mobile() {
    return AppModule.device === DeviceType.Mobile
  }
}
</script>
