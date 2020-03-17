<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div v-show="valid" class="changePwd-container" >
      <el-divider><span style="color: #f90; font-size: 20px;">更改密码</span></el-divider>
      <el-form :model="changeForm"
               status-icon
               :rules="rules"
               ref="changeForm"
               label-width="100px"
               class="forget-form">
        <el-form-item label-width="0" label="" prop="password" class="label-item">
          <el-input placeholder="新密码" type="password" v-model="changeForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label-width="0" label="" prop="checkPass" class="label-item">
          <el-input placeholder="确认新密码" type="password" v-model="changeForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" style="width: 100%;" @click="change">更改</el-button>
        </el-form-item>
        <el-form-item label-width="0">
          <a style="float: right; color: #f90; cursor: pointer" @click="toLogin">找回账号，直接登录</a>
        </el-form-item>
      </el-form>
    </div>
    <div v-show="!valid" class="valid-message">
      <span>{{ validMessage }}</span>
      <span style="color: #f90; cursor: pointer" @click="toForgetPwd">&nbsp;重新找回</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Layout from '@/common/layout'
import { check, change } from '@/api/retrievePass'
import { Message } from 'element-ui'

@Component({
  name: 'Register'
})
export default class extends mixins(Layout) {
  private valid: boolean = false
  private validMessage: string = ''

  private id: string = ''
  private sign: string = ''
  private timestamp: number = 0

  private changeForm = {
    password: '',
    checkPass: ''
  }

  private validatePass = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入密码'))
    } else {
      if (this.changeForm.checkPass !== '') {
        this.$refs.changeForm.validateField('checkPass');
      }
      callback()
    }
  }

  private validatePass2 = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请再次输入密码'));
    } else if (value !== this.changeForm.password) {
      callback(new Error('两次输入密码不一致!'))
    } else {
      callback()
    }
  }

  private rules = {
    password: [
      { validator: this.validatePass, trigger: ['blur', 'change'] }
    ],
    checkPass: [
      { validator: this.validatePass2, trigger: ['blur', 'change'] }
    ]
  }

  private toForgetPwd() {
    this.$router.push({ path: '/user/forgetPwd' })
  }

  private toLogin() {
    this.$router.push({ path: '/user/login' })
  }

  private async change() {
    const data = await change({ id: this.id, password: this.changeForm.password })
    if (data.code === 200) {
      Message({
        message: "更改成功",
        type: 'success',
        duration: 1500
      })
      this.toLogin()
    } else {
      Message({
        message: data.message,
        type: 'warning',
        duration: 1500
      })
    }
  }

  private async check() {
    const data = await check({
      id: this.id,
      sign: this.sign,
      timestamp: this.timestamp
    })
    if (data.code === 200) {
      this.valid = true
    } else {
      this.valid = false
      this.validMessage = data.message
    }
  }

  created() {
    this.id = this.$route.query.id as string
    this.sign = this.$route.query.sign as string
    this.timestamp = Number(this.$route.query.timestamp)
    this.check()
  }
}
</script>

<style lang="scss">
.changePwd-container {
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

.valid-message {
  width: 80%;
  height: 200px;
  margin: 4% auto auto;
  border: 2px solid #2F2F2F;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    font-size: 20px;
    color: #A3A2A2;
  }
}
</style>
