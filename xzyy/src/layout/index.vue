<template>
  <div
    :class="classObj"
    class="app-wrapper"
  >
    <div
      v-if="mobile && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <div class="fixed-header">
      <navbar />
    </div>
    <div class="main-container">
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
        <div
          class="desk-content-grid"
        >
          <div class="desk-app-wrapper">
            <app-main />
          </div>
        </div>
        <div id="backtop" @click="backtop">
          <svg-icon name="backtop" style="color: #3A3A3A; font-size: 25px;"></svg-icon>
        </div>
      </div>
    </div>
    <footer>
      <div class="footer">
        <p style="color: whitesmoke; font-size: 18px;">西子夭夭</p>
        <p style="color: whitesmoke; font-size: 13px;">Copyright@ 2020-2021 Xi-Zi-YY All Rights Reserved. <a style="color: #f90; cursor: pointer" @click="toCopyright">版權聲明</a></p>
        <p style="color: whitesmoke; font-size: 13px;">Contact information: <a href="mailto:someone@example.com">shaohonglin@gmail.com</a>.</p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { DeviceType, AppModule } from '@/store/modules/app'
import { AppMain, Navbar } from './components'
import ResizeMixin from './mixin/resize'

@Component({
  name: 'Layout',
  components: {
    AppMain,
    Navbar
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

  private toCopyright() {
    window.open(window.location.origin + '/#/site/copyright')
  }

  mounted() {
    window.addEventListener('scroll', (e: Event) => {
      const el = document.getElementById('backtop')
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        el.style.display = "block";
      } else {
        el.style.display = "none";
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.fixed-header {
  position: relative;
  z-index: 9;
  min-width: 1150px;
  margin: 0;
  padding: 0;
  box-shadow: darkgrey 0 0 12px 1px;
}

.drawer-bg {
  background: #000;
  opacity: 0.5;
  width: 100%;
  top: 0;
  height: 100%;
  position: fixed;
  z-index: 999;
  margin-left: 0 !important;
}

.desktop {
  .desk-content-grid {
    margin-top: 1%;
    display: grid;
    grid-template-columns: 1fr 1150px 1fr;
    justify-items: center;

    .desk-app-wrapper {
      margin-left: 0;
      grid-column: 2 / 3;
      width: 100%;
    }
  }

  #backtop {
    display: none; /* Hidden by default */
    position: fixed; /* Fixed/sticky position */
    bottom: 20px; /* Place the button at the bottom of the page */
    right: 30px; /* Place the button 30px from the right */
    z-index: 99; /* Make sure it does not overlap */
    border: none; /* Remove borders */
    outline: none; /* Remove outline */
    cursor: pointer; /* Add a mouse pointer on hover */
    padding: 15px; /* Some padding */
    border-radius: 10px; /* Rounded corners */
    font-size: 18px; /* Increase font size */
  }
}

.mobile {
  .main-container {
    margin-left: 0;
    margin-top: $MobileNavBarHeight !important;
  }

  .mobile-sidebar-wrapper {
    margin-left: 10px;
    margin-top: 20px;
    position: fixed;
    z-index: 1001;
    transition: transform .28s;
  }

  .mobile-app-wrapper {
    padding-left: 2%;
    padding-right: 2%;
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
      transition-duration: 1s;
      transform: translate3d(-200px, 0, 0);
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

.footer {
  text-align: center;
  border-top: solid 2px #f90;
  margin-top: 30px;
  padding-top: 15px;
  padding-bottom: 25px;
  min-width: 1150px;
}
</style>
