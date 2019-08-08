<template>
  <div class="navbar"
       :style="mobile ? '' : 'width: ' + width + 'px;'"
  >
    <div v-if="mobile">
      <div class="mobile-top-header">
        <hamburger
          id="hamburger-container"
          :is-active="sidebar.opened"
          class="hamburger-container"
          @toggleClick="toggleSideBar"
        />
      </div>
      <div class="search-svg">
        <svg-icon
          name="search"
          width="25"
          height="25"
        />
      </div>
    </div>
    <div v-else>
      <div class="desk-top-header">
        <div>
          <a
            itemprop="url"
            href="/"
            onclick="ga('send', 'event', 'Header', 'click', 'Logo');"
          >
            <img
              width="150"
              height="32"
              src="https://ci.phncdn.com/www-static/images/pornhub_logo_straight.png?cache=2019073102"
            >
          </a>
        </div>
        <div class="search">
          <input
            class="search-input"
            placeholder="搜索"
          >
          <button class="search-button">
            <i class="el-icon-search" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { Component, Vue } from 'vue-property-decorator'
import { isExternal } from '@/utils/validate'
import { DeviceType, AppModule } from '@/store/modules/app'
import Hamburger from '@/components/Hamburger/index.vue'
import ErrorLog from '@/components/ErrorLog/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'
import { constantRoutes } from '@/router'

@Component({
  name: 'Navbar',
  components: {
    ErrorLog,
    LangSelect,
    Hamburger
  }
})
export default class extends Vue {
  private width = 0
  private routes = constantRoutes.filter(v => !v.meta.hidden)

  get sidebar() {
    return AppModule.sidebar
  }

  get mobile() {
    return AppModule.device === DeviceType.Mobile
  }

  private toggleSideBar() {
    AppModule.ToggleSideBar(false)
  }

  private resolvePath(basePath: string, routePath: string) {
    if (isExternal(routePath)) {
      return routePath
    }
    if (isExternal(basePath)) {
      return basePath
    }
    return path.resolve(basePath, routePath)
  }

  private resize() {
    if(!this.mobile) {
      this.width = window.document.body.scrollWidth
    }
  }

  mounted() {
    this.resize()
    window.addEventListener('resize', (e: Event) => {
      this.resize()
    })
  }
}
</script>

<style lang="scss" scoped>
  .navbar {
    height: $NavBarHeight !important;
    overflow: hidden;
    position: relative;
    width: 100%;
    background-color: #1b1b1b;
  }

  .mobile-top-header {
    .hamburger-container {
      line-height: 46px;
      float: left;
      height: 100%;
      padding: 0 15px;
      cursor: pointer;
      transition: background .3s;
      border-right: 1px solid #000;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }
  }

  .search-svg {
    float: right;
    cursor: pointer;
    padding: 0 15px;
    margin-right: 2px;
    line-height: 46px;
    border-left: 1px solid #000;
  }

  .svg-icon {
    vertical-align: middle;
    color: #f90;
  }

  .desk-top-header {
    width: 100%;
    min-height: 80px;
    padding-left: 4%;
    display: inline-grid;
    grid-template-columns: 200px 1fr 250px;
    grid-column-gap: 10px;
    justify-items: center;
    align-items: center;
    margin: auto;

    .search-button {
      height: 28px;
      width: 60px;
      cursor: pointer;
      background: #f90;
      outline: 0;
      outline-offset: -2px;
      border: 0;
    }

    .search {
      .search-input {
        margin-left: 0;
        display: inline-block;
        color: #cacaca;
        background: #363636;
        border-radius: 3px 0 0 3px;
        outline: 0;
        border: none;
        padding: 2px 5px;
        vertical-align: top;
        cursor: text;
        width: 350px;
        font-size: 14px;
        height: 28px;
      }

      .search-input:focus {
        outline-offset: -2px;
        border-left: 1px solid #757575;
        border-bottom: 1px solid #757575;
        border-top: 1px solid #757575;
        transition: .1s;
        box-shadow: 0 0 0.1rem #c2c2c2;
      }

      .search-input:focus + .search-button {
        box-shadow: 0 0 0.1rem #f90;
      }
    }
  }
</style>
