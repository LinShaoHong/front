<template>
  <div>
    <el-drawer
      title="任务详情"
      size="40%"
      :show-close="false"
      :visible.sync="drawer"
      :direction="rtl">
      <el-tabs
        v-model="choseDataTab"
        style="margin-left: 7px; margin-right: 5px;"
      >
        <el-tab-pane
          label="抓取结果"
          name="first"
        >
          <el-input
            v-model="values"
            :autosize="{minRows: 2, maxRows: 30}"
            type="textarea"
            style="overflow-x: scroll; margin-bottom: 10px;"
            :readonly="true"
          />
        </el-tab-pane>
        <el-tab-pane
          label="错误信息"
          name="second"
        >
          <el-input
            v-model="errors"
            :autosize="{minRows: 2, maxRows: 30}"
            type="textarea"
            style="overflow-x: scroll; margin-bottom: 10px;"
            :readonly="true"
          />
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
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
