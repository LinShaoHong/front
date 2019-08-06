<template>
  <div v-show="viewDetails" :class="mobile ? 'img-details mobile-details' : 'img-details'">
    <image-viewer z-index=100 ref="imgViewer" :on-close="closeViewer" :url-list="previewSrcList"></image-viewer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import ImageViewer from 'element-ui/packages/image/src/image-viewer'
import { DeviceType, AppModule } from '@/store/modules/app'

@Component({
  name: 'ImageDetails',
  components: {
    ImageViewer
  }
})
export default class extends Vue {
  private viewDetails = false

  private closeViewer() {
    this.viewDetails = false
    AppModule.ToggleNavBar(false)
  }

  public showViewer() {
    (this.$refs.imgViewer as ImageViewer).next()
    this.viewDetails = true
    AppModule.ToggleNavBar(false)
  }

  private previewSrcList = [
    'http://172.20.10.2/images/158514725/1637791670/details/200228125.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/91420632.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/1540541095.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/1099784100.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/864560260.jpg'
  ]

  get mobile() {
    return AppModule.device === DeviceType.Mobile
  }
}
</script>

<style lang="scss">
.img-details {
  .el-image-viewer__wrapper {
    background: #1b1b1b;
  }

  .el-icon-circle-close {
    color: #f90;
  }

  .el-image-viewer__btn {
    font-size: 50px;
  }

  .el-image-viewer__prev, .el-image-viewer__next {
    font-size: 80px;
    background: #000;
    width: 60px;
    height: 60px;
    margin-left: 10%;
    margin-right: 10%;
    color: #f90;
  }

  .el-image-viewer__actions {
    opacity: 0.3;
  }

  .el-icon-arrow-right, .el-icon-arrow-left {
    font-size: 60px;
  }
}

.mobile-details {
  .el-icon-circle-close {
    padding: 2px;
    font-size: 40px;
    color: wheat;
    opacity: 0.5;
  }

  .el-image-viewer__btn {
    margin-bottom: 1%;
  }

  .el-image-viewer__prev, .el-image-viewer__next {
    margin-left: 0;
    margin-right: 0;
    opacity: 0.1;
  }

  .el-icon-arrow-right, .el-icon-arrow-left {
    font-size: 30px;
    color: wheat;
    opacity: 0.4;
  }
}
</style>
