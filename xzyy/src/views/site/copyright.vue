<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div style="padding-left: 20%; padding-right: 20%;">
      <p style="color: #f90; font-size: 20px; text-align: center">免責聲明</p>
      <span style="color: whitesmoke; line-height: 30px;">
        非常感謝您訪問我們的網站。在您使用本來網站之前，請您仔細閱讀本聲明的所有條款。<br/>
      1. 本站部分內容來源自網絡，圖片版權屬於原作者，本站轉載僅供大家學習和交流，切勿用於任何商業活動。&nbsp;<br/>
      2. 本站不承擔用戶因使用這些資源對自己和他人造成任何形式的損失或傷害。&nbsp;<br/>
      3. 本聲明未涉及的問題參見國家有關法律法規，當本聲明與國家法律法規衝突時，以國家法律法規為準。&nbsp;<br/>
      如果侵害了您的合法權益，請您及時與我們聯繫，我們會在第一時間刪除相關內容！&nbsp;<br/>
      聯繫方式：shaohonglin@gmail.com</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Layout from '@/common/layout'
import { recharge } from '@/api/charge'
import { info, signIn } from '@/api/user'
import { UserModule } from '@/store/modules/user'
import { Message } from 'element-ui'

@Component({
  name: 'Copyright'
})
export default class extends mixins(Layout) {
  private cardNo: string = ''
  private type: string = 'THIRTY'

  get amount() {
    switch (this.type) {
      case 'TEN':
        return '10 人民幣'
      case 'THIRTY':
        return '30 人民幣'
      case 'FIFTY':
        return '50 人民幣'
      case 'VIP_MONTH':
        return '68 人民幣'
      case 'VIP_QUARTER':
        return '128 人民幣'
      case 'VIP_YEAR':
        return '256 人民幣'
      case 'VIP_FOREVER':
        return '398 人民幣'
    }
  }

  get user() {
    return UserModule.user
  }

  private async recharge() {
    this.$confirm('確定充值？')
      .then(async _ => {
        if (this.cardNo === '') {
          Message({
            message: '請輸入卡號',
            type: 'info',
            duration: 1500
          })
        } else {
          const data = await recharge({ cardNo: this.cardNo, type: this.type })
          if(data.code == 200) {
            Message({
              message: '充值成功！',
              type: 'success',
              duration: 1500
            })
            const user = await info()
            UserModule.Set(user.value)
          } else {
            Message({
              message: data.message,
              type: 'warning',
              duration: 1500
            })
          }
        }
      })
      .catch(_ => {})
  }

  private async signIn() {
    const data = await signIn()
  }

  private toLogin() {
    this.$router.push({ path: '/user/login' })
  }

  created() {
  }
}
</script>

<style lang="less">
.recharge-container {
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

.noLogin {
  width: 80%;
  height: 200px;
  margin: 4% auto auto;
  border: 2px solid #2F2F2F;
  display: flex;
  justify-content: center;

  span {
    margin: auto;
    font-size: 20px;
    color: #A3A2A2;
  }
}

.recharge-form {
  display: grid;
  grid-template-rows: repeat(4, 40px);
  grid-template-columns: 1fr 3fr;

  .charge-info-label {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: whitesmoke;
  }

  .charge-info-value {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-left: 30px;
    color: whitesmoke;
  }
}

.product-select {
  color: #000;
  background-color: #000;

  .el-select {
    width: 120px;
  }

  .el-select--medium {
    border: solid 1px #000;
  }

  .el-input__inner {
    background-color: #000;
    border: none;
    color: whitesmoke;
    font-size: 16px;
  }

  .el-input__suffix {
    display: block;
  }
}

.el-select-dropdown {
  background-color: #1b1b1b;
  border: solid 1px #f90;
}

.el-select-dropdown__item {
  color: whitesmoke;

  &.hover {
    background-color: #757575;
  }
}

.el-popper[x-placement^=bottom] .popper__arrow {
  display: none;
}

.card-input {
  width: 60%;
  margin-left: 0;
  display: inline-block;
  color: #cacaca;
  background: #363636;
  border-radius: 3px;
  outline: 0;
  padding: 2px 5px;
  vertical-align: top;
  cursor: text;
  font-size: 14px;
  height: 30px;
  border: 1px solid #757575;
  transition: all .5s ease;
}
</style>
