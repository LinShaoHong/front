<template>
  <el-dialog
    :title="textMap[dialogStatus]"
    :visible.sync="dialogFormVisible"
  >
    <el-tabs
      v-model="choseDataTab"
    >
      <el-tab-pane
        label="基础参数"
        name="first"
      >
        <el-form
          ref="dataForm1"
          :rules="rules"
          :model="spiderJobData"
          label-position="right"
          label-width="160px"
          style="width: 580px; margin-left:50px;"
        >
          <el-form-item
            :label="$t('spider.group')"
            prop="group"
          >
            <el-select
              v-model="spiderJobData.group"
              class="filter-item"
              clearable
              style="width: 220px"
            >
              <el-option
                v-for="item in groups"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('spider.startTime')"
            prop="startTime"
          >
            <el-date-picker
              v-model="spiderJobData.startTime"
              type="datetime"
              value-format="timestamp"
              placeholder="选择启动时间"
            />
          </el-form-item>
          <el-form-item
            :label="$t('spider.rate2.num')"
            prop="rate.num"
          >
            <el-input-number
              v-model="spiderJobData.rate.num"
              :min="0"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item
            :label="$t('spider.rate2.unit')"
            prop="rate.unit"
          >
            <el-radio
              v-model="spiderJobData.rate.unit"
              label="s"
            >
              秒
            </el-radio>
            <el-radio
              v-model="spiderJobData.rate.unit"
              label="m"
            >
              分
            </el-radio>
            <el-radio
              v-model="spiderJobData.rate.unit"
              label="h"
            >
              时
            </el-radio>
            <el-radio
              v-model="spiderJobData.rate.unit"
              label="d"
            >
              天
            </el-radio>
            <el-radio
              v-model="spiderJobData.rate.unit"
              label="M"
            >
              月
            </el-radio>
            <el-radio
              v-model="spiderJobData.rate.unit"
              label="y"
            >
              年
            </el-radio>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        label="运行参数"
        name="second"
      >
        <el-form
          ref="dataForm2"
          :model="spiderJobData"
          label-position="right"
          label-width="160px"
          style="width: 580px; margin-left:50px;"
        >
          <el-form-item
            :label="$t('spider.setting2.parallelism')"
            prop="setting.parallelism"
          >
            <el-input-number
              v-model="spiderJobData.setting.parallelism"
              :min="1"
              style="width: 150px"
            />
          </el-form-item>
          <el-form-item
            :label="$t('spider.setting2.poolSize')"
            prop="setting.poolSize"
          >
            <el-input-number
              v-model="spiderJobData.setting.poolSize"
              :min="1"
              style="width: 150px"
            />
          </el-form-item>
          <el-form-item
            :label="$t('spider.setting2.monitorInterval')"
            prop="setting.parallelism"
          >
            <el-input-number
              v-model="spiderJobData.setting.monitorInterval"
              :min="1"
              style="width: 150px"
            />
            &nbsp;ms
          </el-form-item>
          <el-form-item
            :label="$t('spider.setting2.taskInterval')"
            prop="setting.parallelism"
          >
            <el-input-number
              v-model="spiderJobData.setting.taskInterval"
              :min="0"
              style="width: 150px"
            />
            &nbsp;ms
          </el-form-item>
          <el-form-item
            :label="$t('spider.setting2.executeTime')"
            prop="setting.parallelism"
          >
            <el-input-number
              v-model="spiderJobData.setting.executeTime"
              :min="0"
              style="width: 150px"
            />
            &nbsp;ms
          </el-form-item>
          <el-form-item
            :label="$t('spider.setting2.retryCount')"
            prop="setting.parallelism"
          >
            <el-input-number
              v-model="spiderJobData.setting.retryCount"
              :min="1"
              style="width: 150px"
            />
          </el-form-item>
          <el-form-item
            :label="$t('spider.setting2.retryDelays')"
            prop="setting.parallelism"
          >
            <el-input-number
              v-model="spiderJobData.setting.retryDelays"
              :min="0"
              style="width: 150px"
            />
            &nbsp;ms
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        label="爬取规则"
        name="third"
      >
        <el-form
          ref="dataForm3"
          :rules="rules"
          :model="spiderJobData"
          label-position="right"
          label-width="160px"
          style="width: 580px; margin-left:50px;"
        >
          <el-form-item
            :label="$t('spider.schema')"
            prop="schema"
            style="margin-top: 10px;"
          >
            <el-input
              v-model="spiderJobData.schema"
              :autosize="{minRows: 2, maxRows: 18}"
              type="textarea"
              placeholder="输入爬取规则对应的JSON"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        label="快照"
        name="fourth"
      >
        <el-form
          ref="dataForm4"
          :rules="rules"
          :model="spiderJobData"
          label-position="right"
          label-width="160px"
          style="width: 580px; margin-left:50px;"
        >
          <el-form-item
            :label="$t('spider.checkpointCategory')"
            prop="checkpoint.categoryUrl"
          >
            <el-input
              v-model="spiderJobData.checkpoint.categoryUrl"
              style="width: 220px;"
            />
          </el-form-item>
          <el-form-item
            :label="$t('spider.checkpointPage')"
            prop="checkpoint.pageNum"
          >
            <el-input
              v-model="spiderJobData.checkpoint.pageNum"
              style="width: 220px;"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="dialogFormVisible = false">
        {{ $t('table.cancel') }}
      </el-button>
      <el-button
        type="primary"
        @click="dialogStatus==='create'? createData() : updateData()"
      >
        {{ $t('table.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import { Form } from 'element-ui'
import { ISpiderJob } from '@/api/types'
import { create, update } from '@/api/spiderApi'

@Component({
  name: 'JobForm'
})
export default class extends Vue {
  @Prop({ default: { } }) private groups!: { id: string, label: string, value: string }[]

  private getList() {
    this.$emit('getList')
  }

  private textMap = {
    update: '编辑',
    create: '新建'
  }
  private choseDataTab = 'first'
  private dialogStatus = ''
  private dialogFormVisible = false
  private spiderJobData = {
    group: '',
    startTime: 0,
    rate: {
      num: 0,
      unit: 'h'
    },
    checkpoint: {
      categoryUrl: null,
      pageNum: ''
    },
    setting: {
      parallelism: 1,
      poolSize: 10,
      monitorInterval: 60 * 1000,
      taskInterval: 10,
      executeTime: 0,
      retryCount: 10,
      retryDelays: 5000,
      batchSize: 1000,
      fetchSize: 10000,
      batchInterval: 200
    },
    schema: ''
  }
  private defaultData = cloneDeep(this.spiderJobData)
  private rules = {
    group: [{ required: true, message: '', trigger: 'change' }],
    startTime: [{ required: true, message: '', trigger: 'change' }],
    setting: [{ required: true, message: '', trigger: 'change' }],
    schema: [{ required: true, message: '', trigger: 'change' }]
  }

  public handleCreate() {
    this.choseDataTab = 'first'
    this.spiderJobData = cloneDeep(this.defaultData)
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs['dataForm1'] as Form).clearValidate()
    })
    this.$nextTick(() => {
      (this.$refs['dataForm3'] as Form).clearValidate()
    })
  }

  public handleUpdate(row: any) {
    this.choseDataTab = 'first'
    const tmp: ISpiderJob = Object.assign({}, row)
    const rate: string = tmp.rate
    const len = rate.length
    const num = Number(rate.substr(0, len - 1))
    let unit = rate.substr(len - 1, len)
    if (unit.toLowerCase() !== 'm') {
      unit = unit.toLowerCase()
    }
    this.spiderJobData.group = tmp.group
    this.spiderJobData.startTime = tmp.startTime
    this.spiderJobData.rate.num = num
    this.spiderJobData.rate.unit = unit
    this.spiderJobData.setting = tmp.setting
    if (tmp.checkpoint !== null) {
      this.spiderJobData.checkpoint = tmp.checkpoint
    } else {
      this.spiderJobData.checkpoint.categoryUrl = null
      this.spiderJobData.checkpoint.pageNum = ''
    }
    this.spiderJobData.schema = JSON.stringify(tmp.schema, null, 2)
    this.dialogStatus = 'update'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs['dataForm1'] as Form).clearValidate()
    })
    this.$nextTick(() => {
      (this.$refs['dataForm3'] as Form).clearValidate()
    })
  }

  private createData() {
    (this.$refs['dataForm1'] as Form).validate(async(valid) => {
      if (valid) {
        const rate = this.spiderJobData.rate.num + this.spiderJobData.rate.unit
        const params = {
          group: this.spiderJobData.group,
          startTime: this.spiderJobData.startTime,
          rate: rate,
          checkpoint: {
            categoryUrl: null,
            pageNum: 0
          },
          setting: this.spiderJobData.setting,
          schema: JSON.parse(this.spiderJobData.schema)
        }
        if (this.spiderJobData.checkpoint.pageNum !== null) {
          params.checkpoint.pageNum = parseInt(this.spiderJobData.checkpoint.pageNum)
        }
        params.checkpoint.categoryUrl = this.spiderJobData.checkpoint.categoryUrl
        if ((params.checkpoint.categoryUrl === null || String(params.checkpoint.categoryUrl).trim().length === 0) &&
          (params.checkpoint.pageNum === null || isNaN(params.checkpoint.pageNum))) {
          delete this.spiderJobData.checkpoint.pageNum
          delete params.checkpoint
        }
        if (this.spiderJobData.rate.num === 0) {
          delete params.rate
        }
        await create(params)
        this.dialogFormVisible = false
        this.getList()
      }
    })
  }

  private updateData() {
    (this.$refs['dataForm1'] as Form).validate(async(valid) => {
      if (valid) {
        let rate = this.spiderJobData.rate.num + this.spiderJobData.rate.unit
        const params = {
          group: this.spiderJobData.group,
          startTime: this.spiderJobData.startTime,
          rate: rate,
          checkpoint: {
            categoryUrl: null,
            pageNum: 0
          },
          setting: this.spiderJobData.setting,
          schema: JSON.parse(this.spiderJobData.schema)
        }
        if (this.spiderJobData.checkpoint.pageNum !== null) {
          params.checkpoint.pageNum = parseInt(this.spiderJobData.checkpoint.pageNum)
        }
        params.checkpoint.categoryUrl = this.spiderJobData.checkpoint.categoryUrl
        if ((params.checkpoint.categoryUrl === null || String(params.checkpoint.categoryUrl).trim().length === 0) &&
          (params.checkpoint.pageNum === null || isNaN(params.checkpoint.pageNum))) {
          delete this.spiderJobData.checkpoint.pageNum
          delete params.checkpoint
        }
        if (this.spiderJobData.rate.num === 0) {
          delete params.rate
        }
        let id = params.schema.source
        await update(id, params)
        this.dialogFormVisible = false
        this.getList()
      }
    })
  }
}

</script>
