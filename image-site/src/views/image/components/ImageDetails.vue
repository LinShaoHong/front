<template>
  <div
    :class="mobile ? 'img-details mobile' : 'img-details'"
  >
    <image-slider
      v-if="isShow"
      ref="imgSlider"
      :on-close="closeViewer"
      :url-list="srcList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DeviceType, AppModule } from '@/store/modules/app'
import ImageSlider from './ImageSlider.vue'

@Component({
  name: 'ImageDetails',
  components: {
    ImageSlider
  }
})
export default class extends Vue {
  private isShow = false
  private srcList = []

  private closeViewer() {
    setTimeout(() => {
      this.isShow = false
    }, 500)
  }

  public showViewer() {
    this.isShow = true
    this.srcList = [
      'http://172.20.10.2/images/158514725/1637791670/details/200228125.jpg',
      'http://172.20.10.2/images/158514725/1856011515/details/91420632.jpg',
      'http://172.20.10.2/images/158514725/1856011515/details/1540541095.jpg',
      'http://172.20.10.2/images/158514725/1856011515/details/1099784100.jpg',
      'http://172.20.10.2/images/158514725/1856011515/details/864560260.jpg']
  }

  get mobile() {
    return AppModule.device === DeviceType.Mobile
  }
}
</script>
