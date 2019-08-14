<template>
  <div
    :class="classObj"
  >
    <div
      v-if="mobile"
      class="mobile-top-header"
    >
      <div class="mobile-hamburger">
        <hamburger
          :is-active="sidebar.opened"
          class="hamburger-container"
          @toggleClick="toggleSideBar"
        />
      </div>
      <div class="search">
        <input
          class="search-input"
          placeholder="搜索"
        >
        <button
          class="search-button"
          @click="search"
        >
          <i class="el-icon-search" />
        </button>
      </div>
      <div
        class="search-svg"
      >
        <svg-icon
          name="search"
          width="25"
          height="25"
          @click="showSearchBtn"
        />
      </div>
    </div>
    <div
      v-else
      class="desk-top-header"
    >
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
        <button
          class="search-button"
          @click="search"
        >
          <i class="el-icon-search" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { Component, Vue } from 'vue-property-decorator'
import { isExternal } from '@/utils/validate'
import { DeviceType, AppModule } from '@/store/modules/app'
import { slider } from '@/utils/mobile'
import { CategoryModule, ICategory } from '@/store/modules/category'
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
  private hideSearch = true
  private routes = constantRoutes.filter(v => !v.meta.hidden)

  get classObj() {
    return {
      navbar: true,
      hideSearch: this.hideSearch,
      openSearch: !this.hideSearch,
      mobile: AppModule.device === DeviceType.Mobile
    }
  }

  get mobile() {
    return AppModule.device === DeviceType.Mobile
  }

  get sidebar() {
    return AppModule.sidebar
  }

  private async search() {
    const el: HTMLInputElement = document.getElementsByClassName('search-input').item(0) as HTMLInputElement
    let q = el.value
    if (q !== null && q.trim().length > 0) {
      q = q.trim()
      const category: ICategory = CategoryModule.category
      if (category) {
        const name = category.type + '-' + category.subType + '-search'
        this.$router.push({ name: name, query: { q: q } })
      }
    }
  }

  private showSearchBtn() {
    this.hideSearch = false
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

  mounted() {
    slider(window.document.body, false, (x, y) => {
      if (y > 25 || y < -25) {
        this.hideSearch = true
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: $NavBarHeight !important;
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #1b1b1b;
}

.search {
  .search-input {
    width: 100%;
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
    font-size: 14px;
    height: 30px;
    border-left: 1px solid #757575;
    border-bottom: 1px solid #757575;
    border-top: 1px solid #757575;
    transition: all .5s ease;
  }

  .search-input:focus {
    outline-offset: -2px;
    transition: .1s;
    box-shadow: 0 0 0.1rem #c2c2c2;
  }

  .search-input:focus + .search-button {
    box-shadow: 0 0 0.1rem #f90;
  }

  .search-button {
    height: 30px;
    width: 100%;
    cursor: pointer;
    background: #f90;
    outline: 0;
    outline-offset: -2px;
    border: 0;
    transition: all .5s ease;

    .el-icon-search {
      margin: 0 auto;
    }
  }
}

.desk-top-header {
  width: 100%;
  display: grid;
  height: 100%;
  grid-template-columns: 150px 4fr 1fr;
  grid-column-gap: 5px;
  justify-items: center;
  align-items: center;
  margin: auto;

  .search {
    width: 40%;
    display: grid;
    grid-template-columns: 8fr 2fr;

    .search-input {
      min-width: 100px;
    }
  }
}

.mobile {
  .mobile-top-header {
    height: 100%;
    display: grid;
    grid-template-columns: 50px auto 50px;
    grid-column-gap: 10px;
    justify-items: center;
    align-items: center;
  }

  .mobile-hamburger {
    .hamburger-container {
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
    cursor: pointer;
    padding: 0 15px;
    margin-right: 2px;
    border-left: 1px solid #000;

    .svg-icon {
      vertical-align: middle;
      color: #f90;
    }
  }

  .search {
    width: 85%;
    margin: 10px auto auto;
    transition: transform .38s;
    .search-input {
      width: 80%;
    }

    .search-button {
      width: 20%;
    }
  }

  &.openSearch {
    .search {
    }
  }

  &.hideSearch {
    .search {
      pointer-events: none;
      transition-duration: 2s;
      transform: translate3d(0, -300px, 0);
    }
  }
}
</style>
