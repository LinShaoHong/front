<template>
  <div
    class="app-wrapper"
  >
    <div
      v-if="classObj.mobile && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <div class="main-container">
      <div class="fixed-header">
        <navbar />
      </div>
      <div id="content-grid">
        <div id="side-wrapper">
          <sidebar/>
        </div>
        <div id="app-wrapper">
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
      mobile: this.device === DeviceType.Mobile
    }
  }

  private handleClickOutside() {
    AppModule.CloseSideBar(false)
  }
}
</script>

<style lang="scss" scoped>

#content-grid {
  margin-left: 10%;
  display: grid;
  grid-template-columns: 150px 1fr;
  grid-gap: 2%;
}

#side-wrapper {
  width: 100%;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100%);
  transition: width 0.28s;
}

.fixed-header+#content-grid {
  padding-top: 8%;
  height: 100vh;
  overflow: auto;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.mobile {
  .main-container {
    margin-left: 0px;
  }

  .fixed-header {
    width: 100%;
  }
}
</style>
