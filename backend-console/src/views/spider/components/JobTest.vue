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
        type="card"
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
    </div>
  </el-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { testJob } from '@/api/spider'

@Component({
  name: 'JobTest'
})
export default class extends Vue {
 private choseDataTab = 'first'
 private drawer = false
 private result = ''
 private showTab = false
 private showLoading = true
 private values = ''
 private errors = ''

 public async handleTest(row: any, guid: string, newTry: boolean) {
   if (newTry && !this.drawer) {
     this.values = ''
     this.errors = ''
     this.showTab = false
     this.showLoading = true
     this.drawer = true
   }
   this.result = ''
   let params = { newTry: newTry, requestId: guid, setting: row.setting, schema: row.schema }
   let data = await testJob(params)
   if (data.value.code !== 200 && this.drawer) {
     await setTimeout(() => {
       this.handleTest(row, guid, false)
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
       this.values = JSON.stringify(data.value.values, null, 2)
     }
   }
 }

 handleClose(done: any) {
   if (this.showLoading) {
     this.$confirm('确认关闭？')
       .then(_ => {
         done()
       })
       .catch(_ => {})
   } else {
     done()
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
