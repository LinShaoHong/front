import { Component, Vue } from 'vue-property-decorator'
import { AppModule, DeviceType } from '@/store/modules/app'

@Component({
  name: 'Layout'
})
export default class extends Vue {
  get sidebar() {
    return AppModule.sidebar
  }

  get navbar() {
    return AppModule.navbar
  }

  get mobile() {
    return AppModule.device === DeviceType.Mobile
  }

  get category() {
    let category = this.$route.params.category
    if (category === undefined) {
      category = null
    }
    return category
  }

  public scrollToPosition() {
    let interval = setTimeout(() => {
      const positionY = this.$route.meta.savedPositionY | 0
      document.scrollingElement.scrollTop = positionY
      if (document.scrollingElement.scrollTop === positionY) {
        clearInterval(interval)
      }
    }, 300)
  }
}
