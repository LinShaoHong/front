<template>
  <el-drawer
    title="任务详情"
    size="50%"
    :show-close="false"
    :visible.sync="drawer"
    :modal="false"
    :before-close="handleClose"
    :direction="rtl"
  >
    <el-tabs
      v-model="choseDataTab"
      style="margin-left: 9px; margin-right: 5px;"
    >
      <el-tab-pane
        label="基础信息"
        name="first"
      >
        <el-row
          :gutter="20"
        >
          <el-col
            :offset="4"
            :lg="{span: 8}"
          >
            <div
              class="detail-table"
            >
              <div
                class="detail-header"
                style="text-align: center; line-height: 10px;"
              >
                <p style="color: black; font-family: 'Songti SC',serif;">
                  基础参数
                </p>
              </div>
              <div
                class="detail-content"
                style="padding: 1px;"
              >
                <p
                  v-for="n in baseList"
                  :key="n.name"
                  class="p-base"
                  style="line-height: 32px;"
                >
                  {{ n.name }}
                </p>
              </div>
            </div>
          </el-col>
          <el-col
            :lg="{span: 12}"
          >
            <div
              class="detail-table"
            >
              <div
                class="detail-header"
                style="text-align: center; line-height: 10px;"
              >
                <p style="color: black; font-family: 'Songti SC',serif;">
                  运行参数
                </p>
              </div>
              <div class="detail-content">
                <p
                  v-for="n in paramList"
                  :key="n.name"
                  class="p-base"
                >
                  {{ n.name }}
                </p>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane
        label="爬取规则"
        name="second"
      >
        <div class="schema">
          <el-input
            v-model="schema"
            :autosize="{minRows: 2, maxRows: 31}"
            type="textarea"
            :readonly="true"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="运行状态"
        name="third"
      >
        <el-row
          :gutter="8"
        >
          <el-col
            :lg="{span: 8}"
            :xl="{span: 10}"
          >
            <div
              class="detail-table"
              @click="showErrors(0)"
            >
              <div
                class="detail-header"
                :style="(curr.errors.length > 0 && curr.running) ? 'background: indianred' : '' "
              >
                <i
                  v-if="curr.running"
                  class="el-icon-loading"
                  style="font-size: 30px; color: #13ce66;;"
                />
                <i
                  v-if="!curr.running"
                  class="el-icon-video-pause"
                  style="font-size: 30px; color: indianred;"
                />
              </div>
              <div v-if="!publish">
                <p style="margin-left: 55px; margin-top: 20px; font-family: 'Songti SC',serif;">
                  任务已停用
                </p>
              </div>
              <div v-else-if="!curr.running">
                <p
                  v-if="curr.remainTime === null"
                  style="margin-left: 55px; margin-top: 10px; font-family: 'Songti SC',serif;"
                >
                  任务已暂停
                </p>
                <p
                  v-else
                  style="margin-left: 10px; margin-top: 30px; font-family: 'Songti SC',serif;"
                >
                  剩余时间：{{ curr.remainTime }}
                </p>
              </div>
              <div v-else>
                <p class="p-cur">
                  并行量：{{ curr.parallelism }}
                </p>
                <p class="p-cur">
                  实体总数：{{ curr.total }}
                </p>
                <p class="p-cur">
                  已完成量：{{ curr.finished }}
                </p>
                <p class="p-cur">
                  开始时间：{{ curr.startTime }}
                </p>
                <p class="p-cur">
                  结束时间：{{ curr.endTime }}
                </p>
                <p class="p-cur">
                  总耗时：{{ curr.usedTime }}
                </p>
              </div>
            </div>
          </el-col>
          <el-col
            :lg="{span: 16}"
            :xl="{span: 14}"
          >
            <div
              :class="(errorsFlag[0] && curr.running && curr.errors.length > 0) ? 'detail-errors-after' : 'detail-errors-before'"
            >
              <el-input
                v-show="errorsFlag[0] && curr.running && curr.errors.length > 0"
                v-model="curr.errors"
                :autosize="{minRows: 2, maxRows: 9}"
                type="textarea"
                :readonly="true"
                style="margin-top: 2px; margin-left: 2px;"
              />
            </div>
          </el-col>
        </el-row>
        <div>
          <div v-show="showLatest">
            <el-divider content-position="left">
              最近
            </el-divider>
          </div>
          <div class="latest-list">
            <el-collapse accordion>
              <el-collapse-item
                v-for="(item, index) in latest"
                :key="index"
                :title="item.startTime"
                :name="item.startTime"
              >
                <el-row
                  :gutter="8"
                >
                  <el-col
                    :lg="{span: 8}"
                    :xl="{span: 8}"
                  >
                    <div
                      class="detail-table"
                      @click="showErrors(index + 1)"
                    >
                      <div
                        class="detail-header"
                        :style="item.errors.length > 0 ? 'height: 20px; background: indianred' : 'height: 20px; background: #13ce66;' "
                      />
                      <div class="detail-content">
                        <p class="p-latest">
                          实体总数：{{ item.total }}
                        </p>
                        <p class="p-latest">
                          已完成量：{{ item.finished }}
                        </p>
                        <p class="p-latest">
                          结束时间：{{ item.endTime }}
                        </p>
                        <p class="p-latest">
                          总耗时：{{ item.usedTime }}
                        </p>
                      </div>
                    </div>
                  </el-col>
                  <el-col
                    :lg="{span: 16}"
                    :xl="{span: 14}"
                  >
                    <div
                      :class="(errorsFlag[index + 1] && item.errors.length > 0) ? 'detail-latest-errors-after' : 'detail-latest-errors-before'"
                    >
                      <el-input
                        v-show="errorsFlag[index + 1] && item.errors.length > 0"
                        v-model="item.errors"
                        :autosize="{minRows: 2, maxRows: 6}"
                        type="textarea"
                        :readonly="true"
                        style="margin-bottom: 10px;"
                      />
                    </div>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import { reformatRate } from '@/utils/spider-job'
import { parseTime } from '@/utils'
import { ISpiderProgress } from '@/api/types'
import { getProgress, getLatestProgresses } from '@/api/spiderApi'

@Component({
  name: 'JobDetails'
})
export default class extends Vue {
  private choseDataTab = 'third'
  private drawer = false
  private showLatest = false
  private publish = false
  private prevRun = false
  private schema = ''
  private errorsFlag:boolean [] = []
  private baseList: { name: string } [] = []
  private paramList: { name: string } [] = []
  private curr: ISpiderProgress = {
    parallelism: 0,
    total: 0,
    running: false,
    finished: 0,
    remainTime: '',
    startTime: '',
    endTime: '',
    usedTime: '',
    errors: []
  }
  private defaultData = cloneDeep(this.curr)
  private latest: ISpiderProgress [] = []
  private currIntervalHandler: any = null

  private showErrors(num: number) {
    this.$nextTick(() => {
      if (num === 0 && this.curr.running && this.curr.errors.length > 0) {
        this.errorsFlag[num] = !this.errorsFlag[num]
      } else if (num > 0) {
        this.errorsFlag[num] = !this.errorsFlag[num]
      }
    })
  }

  public handleDetails(gp: string, row: any) {
    this.drawer = true
    this.errorsFlag = []
    this.publish = row.publish
    this.schema = JSON.stringify(row.schema, null, 2)
    this.handleBase(gp, row)
    this.handleParam(row)
    this.handleRunState(row.id)
  }

  private handleBase(gp: string, row: any) {
    this.baseList = []
    this.baseList.push({ name: '爬取类型：' + gp })
    this.baseList.push({ name: '爬取时间：' + parseTime(row.startTime) })
    this.baseList.push({ name: '爬取周期：' + (row.rate === null ? '执行一次' : reformatRate(row.rate)) })
    this.baseList.push({ name: '是否起用：' + (row.publish ? '已起用' : '已停用') })
  }

  private handleParam(row: any) {
    this.paramList = []
    this.paramList.push({ name: '并行量：' + row.setting.parallelism + ' 个消费线程' })
    this.paramList.push({ name: '线程池容量：' + row.setting.poolSize })
    this.paramList.push({ name: '监控线程睡眠量：' + row.setting.monitorInterval / 1000 + ' 秒' })
    this.paramList.push({ name: '线程单次消费睡眠量：' + row.setting.taskInterval / 1000 + ' 秒' })
    let executeTime = row.setting.executeTime
    this.paramList.push({ name: '执行时间：' + (executeTime === 0 ? '不限时' : executeTime / 1000 + ' 秒') })
    this.paramList.push({ name: 'http调用重试次数：' + row.setting.retryCount + ' 次' })
    this.paramList.push({ name: 'http调用重试睡眠量：' + row.setting.retryDelays / 1000 + ' 秒' })
  }

  private handleRunState(id: string) {
    this.curr = cloneDeep(this.defaultData)
    this.latest = []
    this.handleLatest(id)
    this.setCurr(id)
    this.prevRun = this.curr.running
    this.currIntervalHandler = setInterval(() => this.setCurr(id), 2000)
  }

  private async setCurr(id: string) {
    let data = await getProgress(id)
    this.curr = data.value
    if (this.prevRun !== this.curr.running) {
      this.prevRun = this.curr.running
      this.handleLatest(id)
    }
  }

  private async handleLatest(id: string) {
    this.showLatest = false
    let data = await getLatestProgresses(id)
    this.latest = data.values
    if (this.latest.length > 0) {
      this.showLatest = true
    }
  }

  handleClose(done: any) {
    done()
    clearInterval(this.currIntervalHandler)
  }
}
</script>

<style lang="scss">
  .schema {
    border: 1px solid #ebebeb;
    padding: 2px;
    border-radius: 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }

  .schema:hover {
    box-shadow: 0 4px 4px rgba(10,16,20,.24), 0 0 4px rgba(10,16,20,.12);
    background: #1EB7CD;
    border-color: #1EB7CD;
  }

  .schema textarea {
    border-style: hidden;
    border-radius: 0;
  }

  .p-base {
    font-size: 13px;
    font-family: 'Songti SC',serif;
    margin-left: 4px;
    line-height: 13px;
  }

  .p-cur {
    font-size: 13px;
    margin-left: 10px;
    margin-top: 8px;
    margin-bottom: 8px;
    font-family: 'Songti SC',serif;
  }

  .p-latest {
    font-size: 13px;
    margin-left: 10px;
    margin-top: 2px;
    margin-bottom: 2px;
    font-family: 'Songti SC',serif;
  }

  .detail-table:hover {
    box-shadow: 0 4px 4px rgba(10,16,20,.24), 0 0 4px rgba(10,16,20,.12);
  }

  .detail-table {
    width: 220px;
    min-height: 120px;
    max-height: 240px;
    height: auto;
    overflow: hidden;
    border-radius: 3px;
    border: 1px solid #ebebeb;
    margin-bottom: 10px;
    cursor: pointer;
    box-shadow: 0 2px 2px rgba(10,16,20,.24), 0 0 2px rgba(10,16,20,.12);
    transition: box-shadow .5s;

    .detail-header {
      height: 40px;
      line-height: 50px;
      overflow: hidden;
      padding: 0 20px;
      text-align: left;
      background: #F4F4F4;
      color: #fff;
      border-radius: 3px 3px 0 0;
    }
  }

  .detail-errors-before {
    min-width: 0;
    max-width: 0;
    height: 180px;
    border: 1px #ebebeb;
    transition: 1s;
  }

  .detail-errors-after {
    min-width: 120px;
    max-width: 465px;
    height: 183px;
    border: 1px solid indianred;
    padding: 2px 6px 2px 2px;
    background: indianred;
    transition: .5s;
  }

  .detail-errors-after textarea {
    border-style: hidden;
    border-radius: 0;
  }

  .detail-latest-errors-before {
    min-width: 0;
    max-width: 0;
    height: 122px;
    border: 1px #ebebeb;
    transition: .5s;
  }
  .detail-latest-errors-after {
    max-width: 465px;
    height: 126px;
    border: 1px solid indianred;
    padding: 2px;
    background: indianred;
    transition: .5s;
  }

  .detail-latest-errors-after textarea {
    border-style: hidden;
    border-radius: 0;
  }

  .latest-list {
    overflow-y: scroll;
    max-height: 340px;
  }
</style>
