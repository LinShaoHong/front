<template>
  <div
    :class="classObj"
  >
    <div
      class="sidebar-container"
    >
      <div
        id="menuContainer"
        class="menu-container"
      >
        <div v-if="user !== null"
             class="menu-item"
             style="border-bottom: solid 1px #2F2F2F; padding-bottom: 3px;"
        >
          <div class="route-content">
            <span style="display:block; font-size: 13px; color: white; height: 18px;">
              {{ user.name }}
              <svg-icon
                v-if="user.vip"
                name="vip"
                style="font-size: 12px; margin-left: 3px;"
              />
            </span>
            <span style="display:block; font-size: 13px; color: white; height: 18px;">
                    <svg-icon
                      name="bi"
                      style="font-size: 15px; margin-right: 3px;"
                    />
                    {{ (user.amount === null? 0 : user.amount) }}
            </span>
          </div>
        </div>
        <div
          v-for="(v, i) in menus"
          :id="'item:'+ i"
          :key="v.label"
          class="menu-item"
          @click="jump(v.path, i)"
          :style="i === menus.length - 1? 'border-top: solid 1px #2F2F2F;' : ''"
        >
          <div class="route-content"
               @mouseover="onHover(i)"
          >
            <span :class="actives[i] ? 'category-label active' : 'category-label'">{{ v.label }}</span>
          </div>
        </div>
      </div>
      <div
        v-show="!classObj.mobile"
        class="backtop"
        @click="backtop"
      >
        <i class="el-icon-arrow-up" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import ErrorLog from '@/components/ErrorLog/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'
import { DeviceType, AppModule } from '@/store/modules/app'
import { MenuModule, MenuItem } from '@/store/modules/menu'
import { UserModule } from '@/store/modules/user'
import { logout } from '@/api/session'
import Cookies from 'js-cookie'

@Component({
  name: 'Sidebar',
  components: {
    ErrorLog,
    LangSelect
  }
})
export default class extends Vue {
  private actives: boolean[] = []

  private backtop() {
    const el = document.documentElement
    let step = 0
    let interval = setInterval(() => {
      if (el.scrollTop <= 0) {
        clearInterval(interval)
        return
      }
      step += 10
      el.scrollTop -= step
    }, 20)
  }

  get classObj() {
    return {
      sidebar: true,
      mobile: AppModule.device === DeviceType.Mobile
    }
  }

  get user() {
    return UserModule.user
  }

  get menus() {
    let ms: MenuItem[] = []
    if (UserModule.user === null) {
      ms = [
        { label: '登錄註冊', path: '/user/login', type: null }
      ]
    } else {
      ms = [
        { label: '退出', path: '/logout', type: null }
      ]
    }
    ms.unshift(...MenuModule.menus)
    return ms;
  }

  private onHover(hoverIndex: number) {
    MenuModule.SetIndex(hoverIndex)
  }

  private async logout() {
    await logout()
    UserModule.Clear()
    Cookies.remove('QM-TOKEN')
  }

  private jump(path: string, index: number) {
    if (path === '/logout') {
      this.logout()
      Cookies.remove('QM-TOKEN')
    } else {
      this.resetIndex(index)
      if (name === null) {
        this.$router.push({ path: '/' })
      } else {
        this.$router.push({ path: path })
      }
    }
  }

  private resetIndex(index: number) {
    MenuModule.SetIndex(index)
    for (let i = 0; i < this.menus.length; i++) {
      if (i !== index) {
        this.$set(this.actives, i, false)
      } else {
        this.$set(this.actives, i, true)
      }
    }
  }

  get index() {
    return MenuModule.index
  }

  @Watch('index')
  scrollToPreview(index: number) {
    if (index >= 0) {
      const step = 50
      const _containerDoc = document.getElementById('menuContainer')
      const item: HTMLElement = document.getElementById('item:' + index)
      const viewHeight = _containerDoc.clientHeight
      const rectTop = item.getBoundingClientRect().top - _containerDoc.getBoundingClientRect().top
      if (rectTop <= 0) {
        _containerDoc.scrollTop -= step
      } else if (rectTop >= viewHeight - step) {
        _containerDoc.scrollTop += step
      }
    }
    this.resetIndex(index)
  }

  created() {
    for (let i = 0; i < this.menus.length; i++) {
      if (this.menus[i].path === this.$route.path) {
        this.actives[i] = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: $sideBarWidth !important;
  border-radius: 10px;
  z-index: 1001;
}

.sidebar-container {
  background: #101010;
  border: 1px solid #2F2F2F;
  border-radius: 10px;

  .menu-container {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    max-height: $sideBarHeight !important;
    padding-top: 3px;
    padding-bottom: 5px;

    span {
      font-size: 15px;
      color: #A3A2A2;
    }

    .menu-item {
      cursor: pointer;
      padding-top: 2px;
    }

    .route-content {
      text-align: center;
      position: relative;

      .active {
        color: #f90;
      }

      .category-label {
        font-size: 16px;
        font-family: "Songti SC",serif;
        text-indent: 0;
        line-height: 30px;
      }
    }
  }
}

.route-content:hover .category-label {
  color: #f90;
}

.route-content:hover .category-num {
  color: #f90;
}

.sidebar-container:hover {
  box-shadow: 0 0 6px #f90;
  transition: all .5s ease;
}

.menu-container::-webkit-scrollbar {
  display: none;
}

.backtop {
  width: 100%;
  height: 30px;
  display: inline-flex;
  justify-items: center;
  border-radius: 10px;
  cursor: pointer;

  .el-icon-arrow-up {
    color: #f90;
    margin: auto;
  }
}

.mobile {
  &.sidebar {
    width: $mobileSideBarWidth !important;
  }
}
</style>
