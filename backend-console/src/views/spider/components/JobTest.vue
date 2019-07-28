<template>
  <el-drawer
    title="测试结果"
    size="40%"
    :visible.sync="drawer"
    :before-close="handleClose"
    :direction="rtl">
    <div class="icon-item" v-show="showLoading">
      <div>
        <i class="el-icon-loading"></i>
      </div>
      <span style="font-size: 13px;">正在获取爬取结果....</span>
    </div>
    <div
      v-show="showTab"
    >
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
            :autosize="{minRows: 2, maxRows: 31}"
            type="textarea"
            :readonly="true"
          />
        </el-tab-pane>
        <el-tab-pane
          label="错误信息"
          name="second"
        >
          <el-input
            v-model="errors"
            :autosize="{minRows: 2, maxRows: 31}"
            type="textarea"
            :readonly="true"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { testJob, deleteTest } from '@/api/spiderApi'

@Component({
  name: 'JobTest'
})
export default class extends Vue {
  private choseDataTab = 'first'
  private drawer = false
  private result = ''
  private showTab = false
  private showLoading = false
  private values = ''
  private errors = ''
  private requestId = ''

  public handleTest(row: any, guid: string) {
    this.handle(row, guid, false)
  }

  private async handle(row: any, guid: string, retry: boolean) {
    if (!this.drawer && !retry) {
      this.values = ''
      this.errors = ''
      this.showTab = false
      this.showLoading = true
      this.drawer = true
      this.requestId = guid
      this.choseDataTab = 'first'
    }
    this.result = ''
    let params = { requestId: this.requestId, setting: row.setting, schema: row.schema }
    let data = await testJob(params)
    if (data.value.code !== 200) {
      await setTimeout(() => {
        if(this.drawer) {
          this.handle(row, this.requestId, true)
        }
      }, 5000)
    } else {
      this.showTab = true
      this.showLoading = false
      if (data.value.values.length === 0) {
        this.values = '无结果'
      } else {
        this.values = JSON.stringify(data.value.values, null, 2)
      }
      if (data.value.errors.length === 0) {
        this.errors = '无错误'
      } else {
        this.errors = JSON.stringify(data.value.errors, null, 2)
      }
    }
  }

  private async delete() {
    await deleteTest(this.requestId)
    this.requestId = ''
    this.values = ''
    this.errors = ''
    this.showTab = false
    this.showLoading = false
  }

  handleClose(done: any) {
    if (this.showLoading) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          this.delete()
        })
        .catch(_ => {
        })
    } else {
      done()
      this.delete()
    }
  }
}

</script>

<style>
  .icon-item {
    margin-left: 220px;
    margin-top: 220px;
    height: 85px;
    text-align: center;
    width: 150px;
    font-size: 50px;
    color: #1EB7CD;
  }
</style>
