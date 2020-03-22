<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div class="forgetPwd-container" >
      <el-divider><span style="color: #f90; font-size: 20px;">密碼找回</span></el-divider>
      <el-form :model="forgetForm"
               status-icon
               :rules="rules"
               ref="forgetForm1"
               label-width="100px"
               class="forget-form">
        <el-form-item label-width="0" label="" prop="email" class="label-item">
          <el-input placeholder="郵箱地址" v-model.number="forgetForm.email"></el-input>
        </el-form-item>
        <el-form-item v-if="second > 0" style="height: 5px; margin-bottom: 50px;">
          <span  style="float: right; color: #f90; " href="#">{{ '登錄郵箱更改密碼  (' + second + ')' }}</span>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" style="width: 100%;" @click="send">發送</el-button>
        </el-form-item>
        <el-form-item label-width="0">
          <a style="float: right; color: #f90; cursor: pointer" @click="toLogin">已找回賬號，直接登錄</a>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Layout from '@/common/layout'
import { url } from '@/api/retrievePass'
import { Message } from 'element-ui'

@Component({
  name: 'Register'
})
export default class extends mixins(Layout) {
  private second: number = 0

  private forgetForm = {
    email: '',
  }

  private rules = {
    email: [
      { type: 'email', message: '請輸入正確的郵箱地址', trigger: ['blur', 'change'] }
    ]
  }

  private async send() {
    if (this.second === 0) {
      const data = await url(this.forgetForm)
      if (data.code === 200) {
        this.second = 120;
        let interval = setInterval(() => {
          if(this.second === 0) {
            clearInterval(interval)
          } else {
            this.second -= 1
          }
        }, 1000)
      } else {
        Message({
          message: data.message,
          type: 'warning',
          duration: 1500
        })
      }
    }
  }

  private toLogin() {
    this.$router.push({ path: '/user/login' })
  }

  created() {
  }
}
</script>

<style lang="scss">
.forgetPwd-container {
  margin-top: 5%;
  padding-left: 25%;
  padding-right: 25%;
}

.forget-form {
  margin-top: 8%;
}

.label-item .el-form-item__label {
  color: #f90;
}

.el-form-item__error {
  color: #f90;
}

.el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-input__inner:focus, .el-form-item.is-error .el-textarea__inner, .el-form-item.is-error .el-textarea__inner:focus {
  border-color: #f90;
}

.el-divider__text {
  background-color: #000;
}

.el-divider--horizontal {
  background-color: #f90;
}

.el-input__suffix {
  display: none;
}

.el-input__inner {
  background-color: whitesmoke;
}

.mobile {
  .forgetPwd-container {
    margin-top: 5%;
    padding-left: 5%;
    padding-right: 5%;
  }
}
</style>
