<template>
  <div class="sql-query-container">
    <el-row :gutter="20">
      <el-col :span="8"
              :lg="10">
        <el-card class="box-card">
          <div
            slot="header"
            class="clearfix">
            <span>SQL查询</span>
          </div>
          <div class="component-item"
               style="height:500px;">
            <el-select
              v-model="model.database"
              @change="choseSchema()"
              :placeholder="$t('sql.schema')"
              clearable
              style="width: 150px"
              class="filter-item">
              <el-option
                v-for="item in schemas"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-model="model.table"
              :placeholder="$t('sql.table')"
              clearable
              style="width: 180px; margin-left: 10px;"
              class="filter-item">
              <el-option
                v-for="item in tables"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input
              v-model="model.sql"
              :autosize="{minRows: 2, maxRows: 18}"
              type="textarea"
              style="margin-top: 20px;"
              placeholder="Enter SQL"
            />
            <div style="display: flex; justify-content: center; margin-top: 10px;">
              <el-button
                style="text-align: center"
                type="primary"
                @click="getQueryResult()">
                {{ $t('sql.query') }}
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24"
              :sm="24"
              :lg="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ $t('sql.queryResult') }}</span>
          </div>
          <div class="component-item"
               style="height:500px;">
            <el-input
              v-model="result"
              :autosize="{minRows: 2, maxRows: 27}"
              type="textarea"
              style="overflow-x: scroll; margin-bottom: 10px;"
              :readonly="true"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getResult, getTables } from '../../api/sqlApi'

@Component({
  name: 'SqlQuery'
})

export default class extends Vue {
  private schemas = [
    { id: 'sun', value: 'sun', label: 'sun' }
  ]
  private tables: { id: string, label: string, value: string }[] = []
  private result = ''
  private model = {
    database: 'sun',
    sql: undefined,
    table: ''
  }

  created() {
    this.choseSchema()
  }

  private async choseSchema() {
    this.tables = []
    this.model.table = ''
    if (this.model.database !== undefined && this.model.database !== '') {
      let data = await getTables({ database: this.model.database })
      data.values.forEach((v: string) => this.tables.push({ id: v, value: v, label: v }))

      if (this.tables.length > 0) {
        this.model.table = this.tables[0].id
      }
    }
  }

  private async getQueryResult() {
    let data = await getResult({ database: this.model.database, sql: this.model.sql })
    this.result = JSON.stringify(data.values, null, 2)
  }
}

</script>

<style>

.sql-query-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}

</style>
