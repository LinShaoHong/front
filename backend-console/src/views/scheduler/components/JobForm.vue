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
          :model="schedulerJobData"
          label-position="right"
          label-width="160px"
          style="width: 580px; margin-left:50px;"
        >
          <el-form-item
            label="任务类型"
            prop="group"
          >
            <el-select
              v-model="schedulerJobData.id"
              class="filter-item"
              clearable
              style="width: 220px"
            >
              <el-option
                v-for="item in names"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="启动时间"
            prop="startTime"
          >
            <el-date-picker
              v-model="schedulerJobData.startTime"
              type="datetime"
              value-format="timestamp"
              placeholder="选择启动时间"
            />
          </el-form-item>
          <el-form-item
            label="运行周期"
            prop="rate.num"
          >
            <el-input-number
              v-model="schedulerJobData.rate.num"
              :min="0"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item
            :label="$t('spider.rate2.unit')"
            prop="rate.unit"
          >
            <el-radio
              v-model="schedulerJobData.rate.unit"
              label="s"
            >
              秒
            </el-radio>
            <el-radio
              v-model="schedulerJobData.rate.unit"
              label="m"
            >
              分
            </el-radio>
            <el-radio
              v-model="schedulerJobData.rate.unit"
              label="h"
            >
              时
            </el-radio>
            <el-radio
              v-model="schedulerJobData.rate.unit"
              label="d"
            >
              天
            </el-radio>
            <el-radio
              v-model="schedulerJobData.rate.unit"
              label="M"
            >
              月
            </el-radio>
            <el-radio
              v-model="schedulerJobData.rate.unit"
              label="y"
            >
              年
            </el-radio>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        label="任务配置"
        name="third"
      >
        <el-form
          ref="dataForm3"
          :rules="rules"
          :model="schedulerJobData"
          label-position="right"
          label-width="160px"
          style="width: 580px; margin-left:50px;"
        >
          <el-form-item
            label="配置参数"
            prop="schema"
            style="margin-top: 10px;"
          >
            <el-input
              v-model="schedulerJobData.profiles"
              :autosize="{minRows: 2, maxRows: 18}"
              type="textarea"
              placeholder="输入任务配置"
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
import { ISchedulerJob } from '@/api/types'
import { createJob, updateJob } from '@/api/scheduler'

@Component({
  name: 'JobForm'
})
export default class extends Vue {
  @Prop({ default: { } }) private names!: { id: string, label: string, value: string }[]

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
  private schedulerJobData = {
    id: '',
    startTime: 0,
    rate: {
      num: 0,
      unit: 'h'
    },
    profiles: ''
  }
  private defaultData = cloneDeep(this.schedulerJobData)
  private rules = {
    id: [{ required: true, message: '', trigger: 'change' }],
    startTime: [{ required: true, message: '', trigger: 'change' }],
    profiles: [{ required: true, message: '', trigger: 'change' }]
  }

  public handleCreate() {
    this.choseDataTab = 'first'
    this.schedulerJobData = cloneDeep(this.defaultData)
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
    const tmp: ISchedulerJob = Object.assign({}, row)
    const rate: string = tmp.rate
    const len = rate.length
    const num = Number(rate.substr(0, len - 1))
    let unit = rate.substr(len - 1, len)
    if (unit.toLowerCase() !== 'm') {
      unit = unit.toLowerCase()
    }
    this.schedulerJobData.id = tmp.id
    this.schedulerJobData.startTime = tmp.startTime
    this.schedulerJobData.rate.num = num
    this.schedulerJobData.rate.unit = unit
    this.schedulerJobData.profiles = JSON.stringify(tmp.profiles, null, 2)
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
        const rate = this.schedulerJobData.rate.num + this.schedulerJobData.rate.unit
        const params = {
          id: this.schedulerJobData.id,
          startTime: this.schedulerJobData.startTime,
          rate: rate,
          profiles: JSON.parse(this.schedulerJobData.profiles)
        }
        if (this.schedulerJobData.rate.num === 0) {
          delete params.rate
        }
        await createJob(params)
        this.dialogFormVisible = false
        this.getList()
      }
    })
  }

  private updateData() {
    (this.$refs['dataForm1'] as Form).validate(async(valid) => {
      if (valid) {
        let rate = this.schedulerJobData.rate.num + this.schedulerJobData.rate.unit
        const params = {
          startTime: this.schedulerJobData.startTime,
          rate: rate,
          profiles: JSON.parse(this.schedulerJobData.profiles)
        }
        if (this.schedulerJobData.rate.num === 0) {
          delete params.rate
        }
        await updateJob(this.schedulerJobData.id, params)
        this.dialogFormVisible = false
        this.getList()
      }
    })
  }
}

</script>
