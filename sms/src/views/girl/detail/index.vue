<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div
      :class="mobile ? 'img-details mobile' : 'img-details'"
    >
      <girl-gallery
        v-if="isShow"
        ref="imgSlider"
        :image="image"
        :liked="liked"
        :commentId="commentId"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { DeviceType, AppModule } from '@/store/modules/app'
import { GirlDetailResp } from '@/api/girlType'
import GirlGallery from '../components/GirlGallery.vue'
import { detail } from '@/api/girls'
import { Message } from 'element-ui'

@Component({
  name: 'GirlDetails',
  components: {
    GirlGallery
  }
})
export default class extends Vue {
  private image: GirlDetailResp = null
  private isShow = false
  private liked: boolean =  false
  private commentId: string = ''

  private async showViewer() {
    let data = await detail(this.$route.query.id)
    if (data.code === 200) {
      this.image = data.value
      this.isShow = true
    } else if (data.code === 2000) {
      Message({
        message: '该教师已下课！',
        type: 'warning',
        duration: 1500
      })
    }
  }

  get mobile() {
    return AppModule.device === DeviceType.Mobile
  }

  created() {
    this.liked = this.$route.query.liked !== 'false'
    this.commentId = this.$route.query.commentId? (this.$route.query.commentId as string) : ''
    this.showViewer()
  }
}
</script>
