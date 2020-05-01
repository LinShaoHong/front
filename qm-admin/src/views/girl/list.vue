<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="filter-container">
        <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 160px;" placeholder="教师ID" />
        <el-select
          v-model="listQuery.type"
          class="filter-item"
          :placeholder="类型"
          clearable
          style="width: 150px;"
        >
          <el-option
            v-for="item in types"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input v-model="listQuery.city" clearable class="filter-item" style="width: 160px;" placeholder="城市" />
        <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 160px;" placeholder="名称" />
        <el-input v-model="listQuery.title" clearable class="filter-item" style="width: 160px;" placeholder="描述" />
        <el-input v-model="listQuery.contact" clearable class="filter-item" style="width: 160px;" placeholder="联系方式" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      </div>

        <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" class="table-expand">
                <el-form-item label="教师ID">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <el-form-item label="发布时间">
                  <span>{{ props.row.updateTime | parseTime  }}</span>
                </el-form-item>
                <el-form-item label="描述">
                  <span>{{ props.row.title }}</span>
                </el-form-item>
                <el-form-item label="获取值">
                  <span>{{ props.row.contact }}</span>
                </el-form-item>
                <el-form-item label="联系图">
                  <img v-for="pic in props.row.contactImages" :key="pic" :src="imageServer + pic" class="gallery">
                </el-form-item>
                <el-form-item label="详情图">
                  <img v-for="pic in props.row.detailImages" :key="pic" :src="imageServer + pic" class="gallery">
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column align="center" property="mainImage" label="主图">
            <template slot-scope="scope">
              <img :src="imageServer + scope.row.mainImage" width="100" height="60">
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="100" label="名称" prop="name" />
          <el-table-column align="center" min-width="100" label="价格" prop="price" />
          <el-table-column align="center" min-width="100" label="城市" prop="city" />
          <el-table-column align="center" min-width="100" label="类型" prop="category" />
          <el-table-column align="center" min-width="80" label="赞数" prop="likes" />
          <el-table-column align="center" min-width="80" label="浏览量" prop="visits" />
          <el-table-column align="center" min-width="80" label="收藏量" prop="collects" />
          <el-table-column align="center" label="上课状态" prop="onService">
            <template slot-scope="scope">
              <el-tag :type="scope.row.onService ? 'success' : 'danger' ">{{ scope.row.onService ? '上课' : '已下课' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="60" label="类型" prop="type">
            <template slot-scope="scope">
              {{ type(scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="110" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-link
                :underline="false"
                type="primary"
                style="font-size: 10px; margin-right: 5px;"
                @click="handleUpdate(row.id)"
              >
                编辑
              </el-link>
              <el-link v-if="row.onService"
                :underline="false"
                type="primary"
                style="font-size: 10px; margin-right: 5px;"
                @click="handleUnShelve(row.id)"
              >
                下课
              </el-link>
              <el-link v-else
                       :underline="false"
                       type="primary"
                       style="font-size: 10px; margin-right: 5px;"
                       @click="handlePublish(row.id)"
              >
                上课
              </el-link>
              <el-link
                :underline="false"
                type="primary"
                style="font-size: 10px; margin-right: 5px;"
                @click="handleDelete(row.id)"
              >
                删除
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      <pagination v-show="total>0" :total="total" :start.sync="listQuery.start" :count.sync="listQuery.count" @pagination="getList" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Pagination from '@/components/Pagination/index.vue'
import { listGirls, deleteGirl, publishGirl, unShelveGirl } from '@/api/girl'
import { imageServer } from '@/api/storage'

@Component({
  name: 'GirlList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private imageServer = imageServer
  private total = 0
  private list = []
  private listLoading = true
  private listQuery = {
    id: null,
    name: null,
    title: null,
    type: null,
    city: null,
    contact: null,
    start: 0,
    count: 10
  }
  private types = [
    { label: '会所', value: 'SN' },
    { label: '个人', value: 'QM' },
    { label: '视频', value: 'VIDEO' },
    { label: '图片', value: 'PIC' }
  ]

  private async getList() {
    listGirls(this.listQuery).then(response => {
      this.list = response.values
      this.total = response.total
      this.listLoading = false
    }).catch(() => {
      this.list = []
      this.total = 0
      this.listLoading = false
    })
  }

  private type(v: string) {
    switch (v) {
      case 'SN':
        return '会所'
      case 'QM':
        return '个人'
      case 'VIDEO':
        return '视频'
      case'PIC':
        return '图片'
    }
  }

  private handleFilter() {
    this.getList()
  }

  private handleCreate() {
    this.$router.push({ path: 'girl-create' })
  }

  private async handleUnShelve(id: string) {
    await unShelveGirl(id)
    this.getList()
  }

  private async handleDelete(id: string) {
    await deleteGirl(id)
    this.getList()
  }

  private async handlePublish(id: string) {
    await publishGirl(id)
    this.getList()
  }

  private handleUpdate(id: string) {
    this.$router.push({ path: '/girl-edit', query: { id: id } })
  }

  private created() {
    this.getList()
  }
}
</script>

<style>
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
  .gallery {
    width: 120px;
    height: 100px;
    margin-right: 10px;
  }
  .goods-detail-box img {
    width: 100%;
  }
</style>
