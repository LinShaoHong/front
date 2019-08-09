<template>
  <div
    :class="classObj"
    class="app-wrapper"
  >
    <div class="main-container">
      <div class="fixed-header">
        <navbar />
      </div>
      <div
        v-if="sidebar.opened"
        class="drawer-bg"
        @click="handleClickOutside"
      />
      <div
        v-if="mobile"
      >
        <div class="mobile-sidebar-wrapper">
          <sidebar />
        </div>
        <div class="mobile-app-wrapper">
          <app-main />
        </div>
      </div>
      <div v-else>
        <div class="desk-content-grid"
        >
          <div class="desk-sidebar-wrapper">
            <div class="sidebar-sticky">
              <sidebar/>
            </div>
          </div>
          <div class="desk-app-wrapper">
            <app-main />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { DeviceType, AppModule } from '@/store/modules/app'
import { AppMain, Navbar, Sidebar } from './components'
import ResizeMixin from './mixin/resize'

@Component({
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar
  }
})
export default class extends mixins(ResizeMixin) {
  get classObj() {
    return {
      hideNavbar: !this.navbar.opened,
      openNavbar: this.navbar.opened,
      hideSidebar: !this.sidebar.opened,
      openSidebar: this.sidebar.opened,
      withoutAnimation: this.sidebar.withoutAnimation,
      mobile: this.device === DeviceType.Mobile,
      desktop: this.device !== DeviceType.Mobile
    }
  }

  get mobile() {
    return this.device === DeviceType.Mobile
  }

  private toggelSidebar() {
    AppModule.ToggleSideBar(false)
  }

  private handleClickOutside() {
    AppModule.CloseSideBar(false)
  }

  mounted() {
    window.addEventListener('resize', (e: Event) => {
    })
  }
}
</script>

<style lang="scss" scoped>
.fixed-header {
  position: sticky;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100%);
  transition: width 0.28s;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
  margin-left: 0 !important;
}

.desktop {
  .desk-content-grid {
    margin-top: 1%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;

    .desk-sidebar-wrapper {
      grid-column: 1 / 2;
      .sidebar-sticky {
        position: sticky;
        top: $NavBarHeight;
        margin-top: 100%;
        padding-top: 3px;
        padding-left: 3px;
      }
    }

    .desk-app-wrapper {
      margin-left: 0;
      grid-column: 2 / 3;
      width: 100%;
    }
  }
}

.mobile {
  .main-container {
    margin-left: 0;
  }

  .mobile-sidebar-wrapper {
    position: fixed;
    z-index: 1001;
  }

  .mobile-app-wrapper {
    padding-left: 2%;
    padding-right: 2%;
  }

  .mobile-sidebar-wrapper {
    transition: transform .28s;
    width: $sideBarWidth !important;
    z-index: 1001;
  }

  &.openNavbar {
    position: static;
    top: 0;
  }

  &.hideNavbar {
    .fixed-header {
      pointer-events: none;
      transition-duration: 0.6s;
      transform: translate3d(0, -$MobileNavBarHeight, 0);
    }
  }

  &.openSidebar {
    position: static;
    top: 0;
  }

  &.hideSidebar {
    .mobile-sidebar-wrapper {
      pointer-events: none;
      transition-duration: 0.6s;
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }

  .fixed-header {
    width: 100%;
  }

  .navbar {
    height: $MobileNavBarHeight !important;
  }
}

.withoutAnimation {
  .main-container,
  .mobile-sidebar-wrapper {
    transition: none;
  }
}
</style>
