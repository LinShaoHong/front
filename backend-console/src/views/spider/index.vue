<template>
  <div class="app-container">
    <el-row
      type="flex"
      justify="center"
      :gutter="10"
    >
      <el-col
        :xs="24"
        :sm="24"
        :lg="18"
      >
        <el-card
          class="box-card"
        >
          <div
            class="component-item"
            style="height:550px;"
          >
            <div class="filter-container">
              <el-select
                v-model="listQuery.group"
                class="filter-item"
                :placeholder="$t('spider.group')"
                clearable
                style="width: 150px;"
                @change="choseGroup()"
              >
                <el-option
                  v-for="item in groups"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
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
              v-loading="listLoading"
              :data="list"
              border
              fit
              highlight-current-row
              tooltip-effect="dark"
              style="cursor: pointer; box-shadow: 2px 2px 8px #888888;"
              @row-click="handleDetails"
            >
              <el-table-column
                :label="$t('spider.id')"
                prop="id"
                sortable="custom"
                align="center"
                min-width="159px;"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('spider.startTime')"
                min-width="180px"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.startTime | parseTime }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('spider.rate')"
                align="center"
                width="90px"
              >
                <template slot-scope="{row}">
                  <span>{{ row.rate | rateFilter }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('spider.publish')"
                align="center"
                width="90px"
              >
                <template slot-scope="{row}">
                  <el-tag :type="row.publish | publishFilter">
                    {{ row.publish? '已起用' : '已停用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('table.actions')"
                align="center"
                min-width="300"
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
                    v-if="!row.publish"
                    size="mini"
                    type="success"
                    @click="handlePublish(row.id)"
                  >
                    {{ $t('table.publish') }}
                  </el-button>
                  <el-button
                    v-if="row.publish"
                    size="mini"
                    @click="handleUnPublish(row.id)"
                  >
                    {{ $t('table.unPublish') }}
                  </el-button>
                  <el-button
                    size="mini"
                    type="success"
                    @click="handleTest(row)"
                  >
                    {{ $t('table.test') }}
                  </el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(row.id)"
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
          </div>
        </el-card>
      </el-col>
    </el-row>
    <job-test ref="jobTest" />
    <job-details ref="jobDetails" />
    <spider-job-dialog-form
      ref="dialogForm"
      :groups="groups"
      @getList="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getJobs, getGroups, create, update, deleteJob, publish, unPublish } from '@/api/spiderApi'
import { ISpiderJob } from '@/api/types'
import { reformatRate } from '@/utils/spider-job'
import { Guid } from 'guid-typescript'
import Pagination from '@/components/Pagination/index.vue'
import SpiderJobDialogForm from './components/DialogForm.vue'
import JobDetails from './components/JobDetails.vue'
import JobTest from './components/JobTest.vue'

@Component({
  name: 'ComplexTable',
  components: {
    JobTest,
    Pagination,
    JobDetails,
    SpiderJobDialogForm
  },
  filters: {
    rateFilter: (rate: string) => {
      return reformatRate(rate)
    },
    publishFilter: (publish: boolean) => {
      return publish ? 'success' : 'info'
    }
  }
})
export default class extends Vue {
  private list: ISpiderJob[] = []
  private total = 0
  private listLoading = true
  public groups: { id: string, label: string, value: string }[] = []
  private listQuery = {
    page: 1,
    limit: 20,
    group: null
  }

  created() {
    this.initGroups()
    this.getList()
  }

  private async initGroups() {
    let data = await getGroups()
    data.values.forEach((v: any) => {
      this.groups.push({ id: v.value, label: v.label, value: v.value })
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
    (this.$refs.dialogForm as SpiderJobDialogForm).handleCreate()
  }

  private handleUpdate(row: any) {
    (this.$refs.dialogForm as SpiderJobDialogForm).handleUpdate(row)
  }

  private handleDelete(id: string) {
    this.$confirm('确认删除？')
      .then(async _ => {
        await deleteJob(id)
        this.getList()
      })
      .catch(_ => {})
  }

  private handlePublish(id: string) {
    this.$confirm('确认起用？')
      .then(async _ => {
        await publish(id)
        this.getList()
      })
      .catch(_ => {})
  }

  private handleUnPublish(id: string) {
    this.$confirm('确认停用？')
      .then(async _ => {
        await unPublish(id)
        this.getList()
      })
      .catch(_ => {})
  }

  private handleTest(row: any) {
    let guid = Guid.create().toString();
    (this.$refs.jobTest as JobTest).handleTest(row, guid)
  }

  private handleDetails(row: any, cell: any) {
    if (cell.label !== '操作') {
      (this.$refs.jobDetails as JobDetails).handleDetails(this.groups.find(g => g.value === row.group)!.label.toString(), row)
    }
  }
}
</script>
