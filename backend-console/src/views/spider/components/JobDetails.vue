<template>
  <el-drawer
    title="任务详情"
    size="40%"
    :show-close="false"
    :visible.sync="drawer"
    :direction="rtl">
    <el-tabs
      v-model="choseDataTab"
      style="margin-left: 9px; margin-right: 5px;"
    >
      <el-tab-pane
        label="基础信息"
        name="first"
      >
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ISpiderJob } from '@/api/types'
import { create, update } from '@/api/spiderApi'

@Component({
  name: 'JobDetails'
})
export default class extends Vue {
  private choseDataTab = 'first'
  private drawer = false

  public handleDetails(row: any) {
    this.drawer = true
  }
}
</script>
