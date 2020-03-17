<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div class="register-container" >
      <el-divider><span style="color: #f90; font-size: 20px;">注册</span></el-divider>
      <el-form :model="registerForm"
               status-icon
               :rules="rules"
               ref="registerForm"
               label-width="100px"
               class="register-form">
        <el-form-item label-width="0" prop="username" class="label-item">
          <el-input placeholder="用户名" v-model="registerForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label-width="0" label="" prop="password" class="label-item">
          <el-input placeholder="密码" type="password" v-model="registerForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label-width="0" label="" prop="checkPass" class="label-item">
          <el-input placeholder="确认密码" type="password" v-model="registerForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label-width="0" label="" prop="email" class="label-item">
          <el-input placeholder="邮箱，用以找回密码，建议填写" v-model.number="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" @click="register" style="width: 100%;">注册</el-button>
        </el-form-item>
        <el-form-item label-width="0">
          <a style="float: right; color: #f90; cursor: pointer" @click="toLogin">已有账号，直接登录</a>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Layout from '@/common/layout'
import { register, checkName } from '@/api/session'
import { info } from '@/api/user'
import { UserModule } from '@/store/modules/user'
import { MenuModule } from '@/store/modules/menu'

@Component({
  name: 'Register'
})
export default class extends mixins(Layout) {
  private checkUsername = async(rule, value, callback) => {
    if (!value) {
      callback(new Error('请告诉我你的昵称'))
    } else {
      const data = await checkName({ name: value })
      if (data.value) {
        callback(new Error('该昵已称被注册'))
      } else {
        callback()
      }
    }
  }

  private validatePass = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入密码'))
    } else {
      if (this.registerForm.checkPass !== '') {
        this.$refs.registerForm.validateField('checkPass');
      }
      callback()
    }
  };

  private validatePass2 = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请再次输入密码'));
    } else if (value !== this.registerForm.password) {
      callback(new Error('两次输入密码不一致!'))
    } else {
      callback()
    }
  }

  private registerForm = {
    username: '',
    password: '',
    checkPass: '',
    email: ''
  }

  private rules = {
    username: [
      { validator: this.checkUsername, trigger: ['blur', 'change'] }
    ],
    password: [
      { validator: this.validatePass, trigger: ['blur', 'change'] }
    ],
    checkPass: [
      { validator: this.validatePass2, trigger: ['blur', 'change'] }
    ],
    email: [
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ]
  }

  private toLogin() {
    this.$router.push({ path: '/user/login' })
  }

  private async register() {
    this.$refs['registerForm'].validate(async(valid) => {
      if (valid) {
        const data = await register(this.registerForm)
        if (data.code === 200) {
          const user = await info()
          UserModule.Set(user.value)
          this.$router.push({ path: '/' })
          MenuModule.SetIndex(0)
        }
      }
    })
  }

  created() {
  }
}
</script>

<style lang="scss">
.register-container {
  margin-top: 5%;
  padding-left: 25%;
  padding-right: 25%;
}

.register-form {
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

</style>
