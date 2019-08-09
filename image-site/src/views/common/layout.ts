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
    if (category === null || category === undefined) {
      category = 'all'
    }
    return category
  }
}
