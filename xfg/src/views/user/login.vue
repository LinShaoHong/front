<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div v-if="user == null" class="login-container" >
      <el-divider><span style="color: #f90; font-size: 20px;">登录</span></el-divider>
      <el-form :model="loginForm"
               status-icon
               :rules="rules"
               ref="loginForm"
               label-width="100px"
               class="login-form">
        <el-form-item label-width="0" prop="username" class="label-item">
          <el-input placeholder="用户名" v-model="loginForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label-width="0" label="" prop="password" class="label-item">
          <el-input placeholder="密码" type="password" v-model="loginForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" @click="login" style="width: 100%;">登录</el-button>
        </el-form-item>
        <el-form-item label-width="0">
          <a style="float: left; color: #f90; cursor: pointer" @click="toRegister">还没有账号？立即注册</a>
          <a style="float: right; color: #f90; cursor: pointer" @click="toForgetPwd">忘记密码？</a>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Layout from '@/common/layout'
import { login, checkName } from '@/api/session'
import { info } from '@/api/user'
import { UserModule } from '@/store/modules/user'
import { MenuModule } from '@/store/modules/menu'
import { MessageModule } from '@/store/modules/message'
import Cookies from 'js-cookie'

@Component({
  name: 'Register'
})
export default class extends mixins(Layout) {
  private code: number[] = [200]

  get user() {
    if (UserModule.user != null) {
      this.$router.push({ path: '/user/detail' })
    }
    return UserModule.user
  }

  private checkUsername = async(rule, value, callback) => {
    if (!value) {
      callback(new Error('请告诉我你的昵称'))
    } else {
      const data = await checkName({ name: value })
      if (!data.value || this.code[0] === 1000) {
        callback(new Error('您输入的用户不存在'))
      } else {
        callback()
      }
    }
  }

  private validatePass = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入密码'))
    } else if(this.code[0] === 1002) {
      callback(new Error('密码错误'))
    } else {
      callback()
    }
  };

  private loginForm = {
    username: '',
    password: ''
  }

  private rules = {
    username: [
      { validator: this.checkUsername, trigger: ['blur', 'change'] }
    ],
    password: [
      { validator: this.validatePass, trigger: ['blur', 'change'] }
    ]
  }

  private login() {
    this.$refs['loginForm'].validate(async(valid) => {
      if (valid) {
        const data = await login(this.loginForm)
        this.$set(this.code, 0, data.code)
        if (this.code[0] === 200) {
          Cookies.set('XFG-TOKEN', data.value, { expires: 7, path: '/' })
          const user = await info()
          UserModule.Set(user.value)
          MessageModule.GetMessages({ start:0, count: 10 })
          this.$router.push({ path: '/' })
          MenuModule.SetIndex(0)
        } else {
          this.$refs['loginForm'].validate()
        }
      }
      this.$set(this.code, 0, 200)
    });
  }

  private toRegister() {
    this.$router.push({ path: '/user/register' })
  }

  private toForgetPwd() {
    this.$router.push({ path: '/user/forgetPwd' })
  }

  created() {
  }
}
</script>

<style lang="scss">
.login-container {
  margin-top: 5%;
  padding-left: 25%;
  padding-right: 25%;
}

.login-form {
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
