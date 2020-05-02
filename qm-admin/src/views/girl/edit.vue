<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>编辑教师</h3>
      <el-form ref="goods" :rules="rules" :model="goods" label-width="150px">
        <el-form-item label="ID" prop="id">
          <el-input v-model="girl.id" disabled="true"/>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="girl.name" />
        </el-form-item>
        <el-form-item label="描述" prop="title">
          <el-input v-model="girl.title" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="girl.type">
            <el-radio label="SN">会所</el-radio>
            <el-radio label="QM">个人</el-radio>
            <el-radio label="VIDEO">视频</el-radio>
            <el-radio label="PIC">图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="girl.price" placeholder="0.00" :min="0">
            <template slot="append">元</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="获取方式" prop="contact">
          <el-input v-model="girl.contact" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="girl.city" />
        </el-form-item>
        <el-form-item label="类型" prop="category">
          <el-input v-model="girl.category" />
        </el-form-item>
        <el-form-item label="人气" prop="price">
          <el-input-number v-model="girl.visits" placeholder="0.00" :min="0">
          </el-input-number>
        </el-form-item>
        <el-form-item label="赞数" prop="price">
          <el-input-number v-model="girl.likes" placeholder="0.00" :min="0">
          </el-input-number>
        </el-form-item>
        <el-form-item label="收藏" prop="price">
          <el-input-number v-model="girl.collects" placeholder="0.00" :min="0">
          </el-input-number>
        </el-form-item>
        <el-form-item label="开课" prop="onService">
          <el-radio-group v-model="girl.onService">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="主图">
          <el-upload
            :action="uploadPath"
            :show-file-list="false"
            :headers="headers"
            :on-success="uploadMainImage"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img v-if="girl.mainImage" :src="imageServer + girl.mainImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item label="联系图">
          <el-upload
            :action="uploadPath"
            :headers="headers"
            :limit="100"
            :file-list="contactImages"
            :on-exceed="uploadOverrun"
            :on-success="uploadContactImage"
            :on-remove="handleContactRemove"
            multiple
            accept=".jpg,.jpeg,.png,.gif"
            list-type="picture-card"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>

        <el-form-item label="详情图">
          <el-upload
            :action="uploadPath"
            :headers="headers"
            :limit="100"
            :file-list="detailImages"
            :on-exceed="uploadOverrun"
            :on-success="uploadDetailImage"
            :on-remove="handleDetailRemove"
            multiple
            accept=".jpg,.jpeg,.png,.gif"
            list-type="picture-card"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>

        <el-form-item label="视频">
          <el-upload
            :action="uploadPath"
            :show-file-list="false"
            :headers="headers"
            :on-success="uploadVideo"
            class="avatar-uploader"
            accept=".mp4"
          >
            <video v-if="girl.video" class="video-js">
              <source
                :src="imageServer + girl.video"
                type="video/mp4"
              >
            </video>
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

      </el-form>
    </el-card>
    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handlePublish">确定</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { uploadPath, imageServer, deleteImage } from '@/api/storage'
import { updateGirl, getGirl } from '@/api/girl'

@Component({
  name: 'GirlCreate'
})
export default class extends Vue {
  private uploadPath = uploadPath
  private imageServer = imageServer
  private girl = {}
  private detailImages = []
  private contactImages = []

  private uploadMainImage(resp: any) {
    deleteImage({ path: this.girl.mainImage })
    this.girl.mainImage = resp.value
  }

  private uploadContactImage(resp: any) {
    const path = resp.value
    if (!this.girl.contactImages) {
      this.girl.contactImages = []
    }
    this.girl.contactImages.push(path)
  }

  private uploadDetailImage(resp: any) {
    const path = resp.value
    this.girl.detailImages.push(path)
  }

  private uploadVideo(resp: any) {
    if (this.girl.video !== null && this.girl.video !== '' && this.girl.video !== undefined) {
      deleteImage({ path: this.girl.video })
    }
    this.girl.video = resp.value
  }

  private async handleContactRemove(resp: any) {
    const path = resp.response === undefined? resp.url.substring(this.imageServer.length, resp.url.length) : resp.response.value
    for (let i = 0; i < this.girl.contactImages.length; i++) {
      if (this.girl.contactImages[i] === path) {
        this.girl.contactImages.splice(i, 1)
      }
    }
    await deleteImage({ path: path })
  }

  private async handleDetailRemove(resp: any) {
    const path = resp.response === undefined? resp.url.substring(this.imageServer.length, resp.url.length) : resp.response.value
    for (let i = 0; i < this.girl.detailImages.length; i++) {
      if (this.girl.detailImages[i] === path) {
        this.girl.detailImages.splice(i, 1)
      }
    }
    await deleteImage({ path: path })
  }

  private uploadOverrun(resp: any) {
    this.$message({
      type: 'error',
      message: '上传文件个数超出限制!最多上100张图片!'
    })
  }

  private async handlePublish() {
    const data = await updateGirl(this.$route.query.id, this.girl)
    if (data.code == 200) {
      this.$notify.success({
        title: '成功',
        message: '修改成功'
      })
      this.$router.push({ path: '/girl-list' })
    }
  }

  private handleCancel() {
    this.$router.push({ path: '/girl-list' })
  }

  private created() {
    getGirl(this.$route.query.id).then(resp => {
      this.girl = resp.value
      if (this.girl.contactImages !== null) {
        this.contactImages = this.girl.contactImages.map(v => {
          return { url: imageServer + v }
        })
      }
      this.detailImages = this.girl.detailImages.map(v => {
        return { url: imageServer + v }
      })
    })
  }
}
</script>

<style lang="scss">
.el-card {
  margin-bottom: 10px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.input-new-keyword {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.avatar-uploader .el-upload {
  width: 145px;
  height: 145px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 145px;
  height: 145px;
  display: block;
}

.op-container {
  text-align: center;
}
</style>
