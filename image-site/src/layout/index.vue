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
        v-if="classObj.mobile && sidebar.opened"
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
      <div
        v-else
        class="desk-content-grid"
      >
        <div class="desk-sidebar-wrapper">
          <sidebar />
        </div>
        <div class="desk-app-wrapper">
          <app-main />
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
      mobile: this.device === DeviceType.Mobile
    }
  }

  get mobile() {
    return this.device === DeviceType.Mobile
  }

  private handleClickOutside() {
    AppModule.CloseSideBar(false)
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}

.main-container {
  min-height: 100%;
  position: relative;
}

.desk-content-grid {
  margin-top: 1%;
  margin-left: 2%;
  display: grid;
  grid-template-columns: 12rem 1fr;
  grid-gap: 2%;
}

.desk-sidebar-wrapper {
  width: 100%;
}

.desk-app-wrapper {
  margin-right: 5%;
}

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

.mobile-sidebar-wrapper {
  position: fixed;
  z-index: 1001;
}

.mobile-app-wrapper {
  padding-left: 2%;
  padding-right: 2%;
}

.mobile {
  .main-container {
    margin-left: 0;
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
