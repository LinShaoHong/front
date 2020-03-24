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
        </el-row>
      </el-tab-pane>
      <el-tab-pane
        label="配置参数"
        name="second"
      >
        <div class="schema">
          <el-input
            v-model="profiles"
            :autosize="{minRows: 2, maxRows: 27}"
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
                :style="(curr.errors.length > 0 && curr.running) ? 'background: indianred; transition: 2s;' : '' "
              >
                <i
                  v-if="curr.running"
                  class="el-icon-loading"
                  style="font-size: 30px; color: #13ce66;"
                />
                <p
                  v-if="curr.running"
                  style="font-size: 10px; float: right; line-height: 30px; color: black; font-family: 'Songti SC',serif;"
                >
                  实时进度
                </p>
                <i
                  v-if="!curr.running"
                  class="el-icon-video-pause"
                  style="font-size: 30px; color: indianred;"
                />
                <p
                  v-if="!curr.running && publish"
                  style="font-size: 10px; float: right; line-height: 30px; color: indianred"
                >
                  剩余时间
                </p>
              </div>
              <div
                v-if="curr.running"
                class="progress-container"
              >
                <div :style="progressStyle" />
              </div>
              <div v-if="!publish">
                <p style="margin-left: 55px; margin-top: 20px; font-family: 'Songti SC',serif;">
                  任务已停用
                </p>
              </div>
              <div
                v-else-if="!curr.running"
                style="text-align: center"
              >
                <p
                  v-if="curr.remainTime === null"
                  style="margin-left: 55px; margin-top: 10px; font-family: 'Songti SC',serif;"
                >
                  任务已暂停
                </p>
                <p
                  v-else
                  style="font-size: 23px; line-height: 30px; color: indianred; font-family: 'Songti SC',serif;"
                >
                  {{ curr.remainTime }}
                </p>
              </div>
              <div
                v-else
                style="line-height: 18px; max-height: 417px;"
              >
                <p class="p-cur">
                  总数：{{ curr.total }}
                </p>
                <p class="p-cur">
                  已完成量：{{ curr.finished }}
                </p>
                <p class="p-cur">
                  开始时间：{{ curr.startTime }}
                </p>
                <p class="p-cur">
                  总耗时：{{ curr.usedTime }}
                </p>
              </div>
            </div>
          </el-col>
          <el-col
            v-show="errorsFlag[0] && curr.running && curr.errors.length > 0"
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
                          总量：{{ item.total }}
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
import { ISchedulerProgress } from '@/api/types'
import { getProgress, getLatestProgresses } from '@/api/scheduler'

@Component({
  name: 'JobDetails'
})
export default class extends Vue {
  private choseDataTab = 'third'
  private drawer = false
  private showLatest = false
  private publish = false
  private prevRun = false
  private profiles = ''
  private progressStyle = {
    height: '100%',
    width: '0%',
    backgroundColor: '#13ce66',
    transition: '1s'
  }
  private errorsFlag:boolean [] = []
  private baseList: { name: string } [] = []
  private paramList: { name: string } [] = []
  private curr: ISchedulerProgress = {
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
  private latest: ISchedulerProgress [] = []
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

  public handleDetails(id: string, row: any) {
    this.drawer = true
    this.errorsFlag = []
    this.publish = row.publish
    this.profiles = JSON.stringify(row.schema, null, 2)
    this.progressStyle.width = '0%'
    this.profiles = JSON.stringify(row.profiles, null, 2)
    this.handleBase(id, row)
    this.handleRunState(row.id)
  }

  private handleBase(id: string, row: any) {
    this.baseList = []
    this.baseList.push({ name: '类型：' + id })
    this.baseList.push({ name: '时间：' + parseTime(row.startTime) })
    this.baseList.push({ name: '周期：' + (row.rate === null ? '执行一次' : reformatRate(row.rate)) })
    this.baseList.push({ name: '起用：' + (row.publish ? '已起用' : '已停用') })
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
    const total = this.curr.total
    const finished = this.curr.finished
    if (total !== 0) {
      this.progressStyle.width = (finished / total) * 100 + '%'
    }
    if (this.prevRun !== this.curr.running) {
      this.prevRun = this.curr.running
      this.handleLatest(id)
      this.progressStyle.width = '0%'
    }
  }

  private async handleLatest(id: string) {
    this.showLatest = false
    let data = await getLatestProgresses(id)
    this.latest = data.values
    if (this.latest !== null && this.latest.length > 0) {
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
      padding: 0 10px;
      text-align: left;
      background: #F4F4F4;
      color: #fff;
    }
  }

  .divider {
    margin-top: 11px;
    height: 2px;
    line-height: 1px;
    text-align: center;
    font-size: 10px;
    background: #F4F4F4;
  }

  .progress-container {
    height: 2px;
    background: white;
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
