<template>
  <div id="header-wrapper">
    <div id="header-container">
      <div class="top-header">
        <div>
          <a itemprop="url" href="/" onclick="ga('send', 'event', 'Header', 'click', 'Logo');">
            <img width="150" height="32" src="https://ci.phncdn.com/www-static/images/pornhub_logo_straight.png?cache=2019073102">
          </a>
        </div>
        <div class="search">
          <input class="search-input" placeholder="aa"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { Component, Vue } from 'vue-property-decorator'
import { isExternal } from '@/utils/validate'
import ErrorLog from '@/components/ErrorLog/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'
import { constantRoutes } from '@/router'

@Component({
  name: 'Navbar',
  components: {
    ErrorLog,
    LangSelect
  }
})
export default class extends Vue {
  private routes = constantRoutes.filter(v => !v.meta.hidden)

  private resolvePath(basePath: string, routePath: string) {
    if (isExternal(routePath)) {
      return routePath
    }
    if (isExternal(basePath)) {
      return basePath
    }
    return path.resolve(basePath, routePath)
  }
}
</script>

<style lang="scss" scoped>
  #header-wrapper {
    width: 100%;
    min-height: 110px;
    background-color: #000;
  }

  #header-container {
    width: 100%;
    min-height: 90px;
    background-color: #1b1b1b;

    .top-header {
      width: 100%;
      min-height: 80px;
      padding-left: 10%;
      padding-right: 50%;
      display: grid;
      grid-template-columns: 150px 1fr;
      grid-gap: 10px;
      justify-items: center;
      align-items: center;
    }

    .bottom-header {
      border-top: 1px solid #f90;
    }
  }

  .search {
    .search-input {
      margin-left: 0;
      width: 520px;
      color: white;
      background: #363636;
      border-radius: 3px;
      outline: none;
    }
  }
</style>
