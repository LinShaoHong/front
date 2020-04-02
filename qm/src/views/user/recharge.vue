<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div v-if="user != null" class="recharge-container" >
      <el-divider><span style="color: #f90; font-size: 20px;">充值中心</span></el-divider>
      <div class="recharge-form">
        <div class="charge-info-label">用戶名:</div>
        <div class="charge-info-value">{{ user.name }}</div>
        <div class="charge-info-label">購買産品:</div>
        <div class="product-select charge-info-value" style="margin-left: 15px;">
          <el-select v-model="type"
                     size="medium">
            <el-option label="10 金幣" value="TEN">
              10 金幣
            </el-option>
            <el-option label="30 金幣" value="THIRTY">
              30 金幣
            </el-option>
            <el-option label="50 金幣" value="FIFTY">
              50 金幣
            </el-option>
            <el-option label="月VIP" value="VIP_MONTH">
              月 VIP
            </el-option>
            <el-option label="季VIP" value="VIP_QUARTER">
              季 VIP
            </el-option>
            <el-option label="年VIP" value="VIP_YEAR">
              年 VIP
            </el-option>
            <el-option label="永久VIP" value="VIP_FOREVER">
              永久 VIP
            </el-option>
          </el-select>
          <span style="color: #f90; font-size: 18px;">會員可免費獲取本站所有資源！！</span>
        </div>
        <div class="charge-info-label">充值金額:</div>
        <div class="charge-info-value">{{ amount }}</div>
        <div class="charge-info-label">請輸入卡號:</div>
        <div class="charge-info-value">
          <input
            class="card-input"
            v-model="cardNo"
            style=""></input>
          <a style="color: #f90; font-size: 15px; margin-left: 13px; cursor: pointer" :href="yqUrl" target="_Blank">-->點擊購買官方卡號</a>
        </div>
      </div>
      <el-button type="primary"
                 @click="recharge"
                 style="width: 100%; margin-top: 12px;">充值</el-button>
    </div>
    <div v-else class="noLogin">
      <span>您還未<a style="cursor: pointer; color: #f90;" @click="toLogin">登錄</a>....</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Layout from '@/common/layout'
import { recharge, yq } from '@/api/charge'
import { info, signIn } from '@/api/user'
import { UserModule } from '@/store/modules/user'
import { MenuModule } from '@/store/modules/menu'
import { Message } from 'element-ui'

@Component({
  name: 'Register'
})
export default class extends mixins(Layout) {
  private cardNo: string = ''
  private type: string = 'TEN'
  private yqs = []

  get amount() {
    const v = this.yqs.find(v => v.type === this.type)
    if (v) {
      return v.amount + ' 人民幣'
    }
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

  get yqUrl() {
    const v = this.yqs.find(v => v.type === this.type)
    if(v) {
      return v.url
    }
    return '#'
  }

  private async recharge() {
    this.$confirm('確定充值？')
      .then(async _ => {
        if (this.cardNo === '') {
          Message({
            message: '請輸入卡號',
            type: 'warning',
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
            await UserModule.GetUserInfo()
            MenuModule.ToMenu('/user/detail')
            this.$router.push({ path: '/user/detail' })
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
    MenuModule.ToMenu('/user/login')
    this.$router.push({ path: '/user/login' })
  }

  private async getYqs() {
    if (UserModule.user !== null) {
      const data = await yq()
      this.yqs = data.values
    }
  }

  created() {
    this.getYqs()
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

.el-scrollbar {
  > .el-scrollbar__bar {
    opacity: 1 !important;
  }
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

.mobile {
  .recharge-container {
    margin-top: 5%;
    padding-left: 0;
    padding-right: 0;

    .product-select {
      .el-select {
        width: 12rem;
      }
    }
  }
}
</style>
