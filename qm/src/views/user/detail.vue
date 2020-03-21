<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div v-if="user != null" class="detail-container" >
      <el-divider><span style="color: #f90; font-size: 20px;">個人中心</span></el-divider>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="个人信息" name="1">
          <div class="user-info">
            <div class="info-label">上傳頭像:</div>
            <div class="info-value">
              <el-upload
                :action="uploadAvatarPath"
                :show-file-list="false"
                :headers="headers"
                :on-success="uploadAvatar"
                class="avatar-uploader"
                accept=".jpg,.jpeg,.png,.gif"
              >
                <img v-if="user.avatar" :src="SERVER + user.avatar" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </div>
            <div class="info-label">用戶名:</div>
            <div class="info-value">{{ user.name }}</div>
            <div class="info-label">現有金幣:</div>
            <div class="info-value">{{ user.amount === null? '0' : user.amount }}</div>
            <div class="info-label">VIP用戶:</div>
            <div class="info-value">{{ user.vip? '是' : '否' }}</div>
            <div class="info-label">VIP到期時間:</div>
            <div v-if="user.vipEndTime === null" class="info-value" style="float: left">
              您還不是VIP 點擊
              <a style="cursor: pointer; color: #f90;" @click="toRecharge">充值</a>
              成爲會員
            </div>
            <div v-else class="info-value">
              {{ user.vipEndTime }}
            </div>
            <div class="info-label">連續簽到次數:</div>
            <div v-if="user.signInCount === 0" class="info-value" style="float: left">
              您還未簽到過哦 點擊
              <a style="cursor: pointer; color: #f90;" @click="signIn">簽到</a>
            </div>
            <div v-else-if="user.canSignIn" class="info-value">
              {{ user.signInCount }}次 每日
              <a style="cursor: pointer; color: #f90;" @click="signIn">簽到</a>
              可賺取1金幣喲！
            </div>
            <div v-else class="info-value">
              {{ user.signInCount }}次 今日已簽到
            </div>
            <div class="info-label">最近簽到時間:</div>
            <div class="info-value">{{ user.signInTime === null? '无' : user.signInTime }}</div>
          </div>
        </el-collapse-item>
        <el-collapse-item :title="'我的收藏'" name="2">
          <div v-if="collectTotal > 0" class="collect-wrapper">
            <div class="collect-list">
              <div class="collect-item" v-for="item in collects">
                <div class="collect-item__img">
                  <img :src="SERVER + item.mainImage" style="width: 130px; height: 180px; cursor: pointer" @click="toDetail(item.girlId, item.onService)">
                </div>
                <div class="collect-item__name">
                  <span>{{ item.city + ' ' + item.name }}</span>
                </div>
                <div class="collect-item__time">
                  <span>收藏于 {{ item.time }}</span>
                </div>
              </div>
            </div>
            <div class="collect-pagination" style="text-align: center; margin-top: 7px;">
              <pagination v-show="collectTotal>0" :total="collectTotal" :start.sync="collectStart" :count.sync="count" @pagination="getCollects" />
            </div>
          </div>
          <div v-else class="empty">
            <span>您還沒有收藏........</span>
          </div>
        </el-collapse-item>
        <el-collapse-item :title="'最近浏覽'" name="3">
          <div v-if="footprintTotal > 0" class="collect-wrapper">
            <div class="collect-list">
              <div class="collect-item" v-for="item in footprints">
                <div class="collect-item__img">
                  <img :src="SERVER + item.mainImage" style="width: 130px; height: 180px; cursor: pointer" @click="toDetail(item.girlId, item.onService)">
                </div>
                <div class="collect-item__name">
                  <span>{{ item.city + ' ' + item.name }}</span>
                </div>
                <div class="collect-item__time">
                  <span>{{ item.time }}</span>
                </div>
              </div>
            </div>
            <div class="collect-pagination" style="text-align: center; margin-top: 7px;">
              <pagination v-show="footprintTotal>0" :total="footprintTotal" :start.sync="footprintStart" :count.sync="count" @pagination="getFootprints" />
            </div>
          </div>
          <div v-else class="empty">
            <span>趕緊去挑選吧.........</span>
          </div>
        </el-collapse-item>
        <el-collapse-item title="金幣收支" name="4">
          <div style="margin-left: 37px;">
            <el-radio-group v-model="flowsType"
                            size="mini"
                            @change="onFlowTypeChange"
            >
              <el-radio label="" style="color: whitesmoke">全部</el-radio>
              <el-radio label="PAYMENT" style="color: whitesmoke">消費</el-radio>
              <el-radio label="RECHARGE" style="color: whitesmoke">充值</el-radio>
              <el-radio label="SING_IN" style="color: whitesmoke">簽到</el-radio>
            </el-radio-group>
          </div>
          <div v-if="flowsTotal > 0" style="margin-top: 20px;">
            <el-timeline>
              <el-timeline-item
                v-for="(flow, index) in flows"
                :key="index"
                icon="el-icon-more"
                type="primary"
                :color="flow.type === 'PAYMENT'? 'rgb(238, 96, 96)' : '#0bbd87'"
                size="large"
                :timestamp="flow.time">
                <div v-if="flow.type === 'SING_IN'">
                  <span style="color: #a3a2a2">簽到</span>&nbsp;&nbsp;<span style="color: whitesmoke">+{{ flow.amount }}</span>
                </div>
                <div v-else-if="flow.chargeType !== null">
                  <div v-if="flow.chargeType.startsWith('VIP')">
                    <span style="color: #a3a2a2">{{ '充值 ' + chargeType(flow.chargeType)}}</span>&nbsp&nbsp<span style="color: whitesmoke">+{{ amount(flow.chargeType) }}</span>
                  </div>
                  <div v-else>
                    <span style="color: #a3a2a2">充值</span>&nbsp&nbsp<span style="color: whitesmoke">+{{ amount(flow.chargeType) }}</span>
                  </div>
                </div>
                <div v-else>
                  <span style="color: #a3a2a2">請教付費</span>&nbsp;&nbsp;<span style="color: whitesmoke">-{{ flow.amount }}</span>
                  <div class="flow-buy-item">
                    <div class="flow-buy-item__img">
                      <img :src="SERVER + flow.girl.mainImage" style="width: 90px; height: 130px; cursor: pointer" @click="toDetail(flow.girl.id, flow.girl.onService)">
                    </div>
                    <div class="flow-buy-item__name">
                      <span>{{ flow.girl.city + ' ' + flow.girl.name }}</span>
                    </div>
                  </div>
                </div>
              </el-timeline-item>
              <el-timeline-item v-if="!flowsEnd">
                <span style="color: whitesmoke; font-size: 10px; cursor: pointer" @click="getFlows">顯示更多.....</span>
              </el-timeline-item>
            </el-timeline>
          </div>
          <div v-else class="empty">
            <span>您還沒有金幣哦.........</span>
          </div>
        </el-collapse-item>
      </el-collapse>
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
import { UserModule } from '@/store/modules/user'
import { MenuModule } from '@/store/modules/menu'
import { signIn, info, uploadAvatarPath, deleteAvatar } from '@/api/user'
import { getCollections } from '@/api/collection'
import { yq } from '@/api/charge'
import { getFootprints } from '@/api/footprint'
import { CollectResp } from '@/api/collectType'
import { FootprintResp } from '@/api/footprintType'
import { flow, FlowResp } from '@/api/charge'
import { Message } from 'element-ui'
import Pagination from '@/components/Pagination/index.vue'
import Cookies from 'js-cookie'

@Component({
  name: 'Register',
  components: {
    Pagination
  }
})
export default class extends mixins(Layout) {
  private SERVER = process.env.VUE_APP_IMAGE_SERVER
  private activeName = '1'
  private collects: CollectResp[] = []
  private collectTotal: number = 0
  private collectStart: number = 0

  private footprints: FootprintResp[] = []
  private footprintTotal: number = 0
  private footprintStart: number = 0

  private flows: FlowResp[] = []
  private flowsTotal: number = 10
  private flowsCount: number = 6
  private flowsStart: number = 0
  private flowsEnd: boolean = false
  private flowsType: string = ''

  private count: number = 10

  private yqs: [{ type: string, url: string, amount: number }] = [{
    type: '',
    url: '',
    amount: 0
  }]

  get user() {
    return UserModule.user
  }

  get uploadAvatarPath() {
    if (this.user !== null) {
      return uploadAvatarPath
    }
    return uploadAvatarPath
  }

  private uploadAvatar(resp: any) {
    if (this.user !== null) {
      deleteAvatar({ path: this.user.avatar })
      this.user.avatar = resp.value
    }
  }

  private async signIn() {
    const data = await signIn()
    if (data.code == 200) {
      const user = await info()
      UserModule.Set(user.value)
      if (this.flowsType === '' || this.flowsType === 'SING_IN') {
        this.flows.unshift({ amount: 1, type: "SING_IN", chargeType: null, time: '剛剛', girl: null})
      }
    }
  }

  private toRecharge() {
    MenuModule.ToMenu('/user/recharge')
    this.$router.push({ path: '/user/recharge' })
  }

  private toLogin() {
    this.$router.push({ path: '/user/login' })
  }

  private toDetail(id: string, onService: boolean) {
    if (!onService) {
      Message({
        message: '該教師已下課！',
        type: 'success',
        duration: 1500
      })
    } else {
      window.open(window.location.origin + '/#/girl/detail?liked=false&id=' + id)
    }
  }

  private async getCollects() {
    const data = await getCollections({ start: this.collectStart, count: this.count })
    this.collects = data.values
    this.collectTotal = data.total
  }

  private async getFootprints() {
    const data = await getFootprints({ start: this.footprintStart, count: this.count })
    this.footprints = data.values
    this.footprintTotal = data.total
  }

  private onFlowTypeChange(val: string) {
    this.flows = []
    this.flowsStart = 0
    this.flowsTotal = 0
    this.flowsEnd = false
    this.getFlows()
  }

  private async getFlows() {
    const data = await flow({ start: this.flowsStart, count: this.flowsCount, type: this.flowsType })
    this.flows.push(...data.values);
    this.flowsTotal = data.total
    if (this.flowsStart + this.flowsCount >= this.flowsTotal) {
      this.flowsEnd = true
    } else {
      this.flowsStart += this.flowsCount
    }
  }

  private amount(type: string) {
    const v = this.yqs.find(v => v.type === type)
    if (v) {
      return v.amount
    }
    switch (type) {
      case 'TEN':
        return '10'
      case 'THIRTY':
        return '30'
      case 'FIFTY':
        return '50'
      case 'VIP_MONTH':
        return '68'
      case 'VIP_QUARTER':
        return '128'
      case 'VIP_YEAR':
        return '256'
      case 'VIP_FOREVER':
        return '398'
    }
  }

  private chargeType(type: string) {
    switch (type) {
      case 'TEN':
        return '10金幣'
      case 'THIRTY':
        return '30金幣'
      case 'FIFTY':
        return '50金幣'
      case 'VIP_MONTH':
        return '月VIP'
      case 'VIP_QUARTER':
        return '季VIP'
      case 'VIP_YEAR':
        return '年VIP'
      case 'VIP_FOREVER':
        return '永久VIP'
    }
  }

  private async getYqs() {
    const data = await yq()
    this.yqs = data.values
  }

  created() {
    if (UserModule.user !== null) {
      if (this.$route.query.name) {
        this.activeName = this.$route.query.name as string
      }
      this.getCollects()
      this.getFootprints()
      this.getFlows()
      this.getYqs()
    }
  }
}
</script>

<style lang="less" scoped>
.detail-container {
  margin-top: 5%;
  padding-left: 15%;
  padding-right: 15%;
}

/deep/ .el-collapse {
  border-top-color: #363636;
}

/deep/ .el-collapse-item__wrap {
  background-color: #1b1b1b;
  border-bottom-color: #363636;
}

/deep/ .el-collapse-item__header {
  background-color: #1b1b1b;
  border-bottom-color: #363636;
  color: whitesmoke;
  padding-left: 5px;
}

/deep/ .el-collapse-item__content {
  padding: 3px 0 3px;
}

/deep/ .el-collapse-item__header:hover {
  color: #f90;
}

/deep/ .label-item .el-form-item__label {
  color: #f90;
}

/deep/  .el-form-item__error {
  color: #f90;
}

/deep/ .el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-input__inner:focus, .el-form-item.is-error .el-textarea__inner, .el-form-item.is-error .el-textarea__inner:focus {
  border-color: #f90;
}

/deep/ .el-divider__text {
  background-color: #000;
}

/deep/ .el-divider--horizontal {
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

.user-info {
  display: grid;
  grid-template-rows: 110px repeat(6, 40px);
  grid-template-columns: 2fr 3fr;
  font-size: 15px;

  .info-label {
    text-align: right;
    color: whitesmoke;
  }

  .info-value {
    margin-left: 50px;
    text-align: left;
    color: whitesmoke;
  }
}

.collect-wrapper {
  .collect-list {
    display: grid;
    margin-top: 10px;
    grid-template-rows: repeat(2, 210px);
    grid-template-columns: repeat(5, 1fr);
    grid-row-gap: 10px;

    .collect-item {
      display: grid;
      grid-template-rows: 178px 20px 20px;

      .collect-item__img {
        grid-row: 1 / 2;
        text-align: center;
      }

      .collect-item__name {
        grid-row: 2 / 3;
        text-align: center;

        span {
          font-size: 12px;
          width: 130px;
          color: whitesmoke;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          display: inline-block;
        }
      }

      .collect-item__time {
        grid-row: 3 / 4;
        text-align: center;

        span {
          font-size: 10px;
          color: whitesmoke;
        }
      }
    }
  }
}

.flow-buy-item {
  display: grid;
  grid-template-rows: 128px 20px;

  .flow-buy-item__img {
    grid-row: 1 / 2;
    text-align: left;
  }

  .flow-buy-item__name {
    grid-row: 2 / 3;
    text-align: left;

    span {
      font-size: 12px;
      width: 100px;
      color: whitesmoke;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      display: inline-block;
    }
  }
}

.empty {
  width: 50%;
  height: 200px;
  margin: 2% auto 2%;
  border: 2px solid #2F2F2F;
  display: flex;
  justify-content: center;

  span {
    margin: auto;
    font-size: 20px;
    color: #A3A2A2;
  }
}

.avatar-uploader /deep/ .el-upload {
  width: 100px;
  height: 100px;
  border: 1px dashed #2F2F2F;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader /deep/ .el-upload:hover {
  border-color: #8c939d;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 6px;
}
</style>
