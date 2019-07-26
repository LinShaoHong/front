<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.group"
        class="filter-item"
        :placeholder="$t('spider.group')"
        clearable
        style="width: 150px"
        @change="choseGroup()"
      >
        <el-option
          v-for="item in groups"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          style="font-size: 16px;"
        />
      </el-select>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t('table.add') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%; border-top-width: 1px; border-left-width: 1px;"
      tooltip-effect="dark"
    >
      <el-table-column
        :label="$t('spider.id')"
        prop="id"
        sortable="custom"
        align="center"
        width="150px;"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('spider.startTime')"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('spider.rate')"
        align="center"
        width="90px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.rate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('spider.publish')"
        align="center"
        width="90px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.publish }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('spider.setting')"
        min-width="200px"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.setting }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('spider.schema')"
        min-width="200px"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.schema }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="300"
        class-name="fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >
            {{ $t('table.edit') }}
          </el-button>
          <el-button
            size="mini"
            type="success"
          >
            {{ $t('table.publish') }}
          </el-button>
          <el-button
            size="mini"
            type="danger"
          >
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
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
            style="width: 150px"
          >
            <el-option
              v-for="item in groups"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              style="font-size: 16px;"
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
            value-format="yyyy-MM-dd hh:mm:ss"
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
            class="input-with-radio"
          />
        </el-form-item>
        <el-form-item
          :label="$t('spider.rate2.unit')"
          prop="rate.unit"
        >
          <el-radio
            v-model="spiderJobData.rate.unit"
            label="m"
          >
            毫秒
          </el-radio>
          <el-radio
            v-model="spiderJobData.rate.unit"
            label="s"
          >
            秒
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
        <el-form-item
          :label="$t('spider.setting2.parallelism')"
          prop="setting.parallelism"
        >
          <el-input-number
            v-model="spiderJobData.setting.parallelism"
            :min="1"
          />
        </el-form-item>
        <el-form-item
          :label="$t('spider.setting2.poolSize')"
          prop="setting.poolSize"
        >
          <el-input-number
            v-model="spiderJobData.setting.poolSize"
            :min="1"
          />
        </el-form-item>
        <el-form-item
          :label="$t('spider.setting2.monitorInterval')"
          prop="setting.parallelism"
        >
          <el-input-number
            v-model="spiderJobData.setting.monitorInterval"
            :min="1"
          />
        </el-form-item>
        <el-form-item
          :label="$t('spider.setting2.taskInterval')"
          prop="setting.parallelism"
        >
          <el-input-number
            v-model="spiderJobData.setting.taskInterval"
            :min="0"
          />
        </el-form-item>
        <el-form-item
          :label="$t('spider.setting2.executeTime')"
          prop="setting.parallelism"
        >
          <el-input-number
            v-model="spiderJobData.setting.executeTime"
            :min="0"
          />
        </el-form-item>
        <el-form-item
          :label="$t('spider.setting2.retryCount')"
          prop="setting.parallelism"
        >
          <el-input-number
            v-model="spiderJobData.setting.retryCount"
            :min="1"
          />
        </el-form-item>
        <el-form-item
          :label="$t('spider.setting2.retryDelays')"
          prop="setting.parallelism"
        >
          <el-input-number
            v-model="spiderJobData.setting.retryDelays"
            :min="0"
          />
        </el-form-item>
        <el-form-item
          :label="$t('spider.setting2.batchSize')"
          prop="setting.parallelism"
        >
          <el-input-number
            v-model="spiderJobData.setting.batchSize"
            :min="1"
          />
        </el-form-item>
        <el-form-item
          :label="$t('spider.setting2.batchInterval')"
          prop="setting.parallelism"
        >
          <el-input-number
            v-model="spiderJobData.setting.batchInterval"
            :min="10"
          />
        </el-form-item>
        <el-form-item
          :label="$t('spider.schema')"
          prop="schema"
        >
          <el-input
            v-model="spiderJobData.schema"
            :autosize="{minRows: 2, maxRows: 20}"
            type="textarea"
            placeholder="输入爬取规则对应的JSON"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { cloneDeep } from 'lodash'
import { getJobs, getGroups, create, update } from '@/api/spider'
import { ISpiderJob } from '@/api/types'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'ComplexTable',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private items = [{ id: 2 }, { id: 2 }, { id: 3 }, { id: 4 }]
  private tableKey = 0
  private list: ISpiderJob[] = []
  private total = 0
  private listLoading = true
  private groups: { id: string, label: string, value: string }[] = []
  private listQuery = {
    page: 1,
    limit: 20,
    group: null
  }
  private textMap = {
    update: '编辑',
    create: '新建'
  }
  private dialogStatus = ''
  private dialogFormVisible = false
  private spiderJobData = {
    group: '',
    startTime: '',
    rate: {
      num: 0,
      unit: 'h'
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
    group: [{ required: true, message: 'group is required', trigger: 'change' }],
    startTime: [{ required: true, message: 'startTime is required', trigger: 'change' }],
    setting: [{ required: true, message: 'setting is required', trigger: 'change' }],
    schema: [{ required: true, message: 'schema is required', trigger: 'change' }]
  }

  created() {
    this.initGroups()
    this.getList()
  }

  private async initGroups() {
    let data = await getGroups()
    data.values.forEach((v: string) => {
      this.groups.push({ id: v, label: v, value: v })
    })
  }

  private async choseGroup() {
    if (this.listQuery.group === '') {
      this.listQuery.group = null
    }
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    let data = await getJobs({ group: this.listQuery.group })
    this.list = data.values
    this.total = data.values.length
    setTimeout(() => {
      this.listLoading = false
    }, 0.2 * 1000)
  }

  private handleCreate() {
    this.spiderJobData = cloneDeep(this.defaultData)
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate()
    })
  }

  private handleUpdate(row: any) {
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
    this.spiderJobData.schema = JSON.stringify(tmp.schema, null, 2)
    this.dialogStatus = 'update'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate()
    })
  }

  private createData() {
    (this.$refs['dataForm'] as Form).validate(async(valid) => {
      if (valid) {
        const rate = this.spiderJobData.rate.num + this.spiderJobData.rate.unit
        const params = {
          group: this.spiderJobData.group,
          startTime: this.spiderJobData.startTime,
          rate: rate,
          setting: this.spiderJobData.setting,
          schema: JSON.parse(this.spiderJobData.schema)
        }
        let data = await create(params)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      }
    })
  }

  private updateData() {
    (this.$refs['dataForm'] as Form).validate(async(valid) => {
      if (valid) {
        let rate = this.spiderJobData.rate.num + this.spiderJobData.rate.unit
        const params = {
          group: this.spiderJobData.group,
          startTime: this.spiderJobData.startTime,
          rate: rate,
          setting: this.spiderJobData.setting,
          schema: JSON.parse(this.spiderJobData.schema)
        }
        if (this.spiderJobData.rate.num === 0) {
          delete params.rate
        }
        let data = await update('', params)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      }
    })
  }
}
</script>
