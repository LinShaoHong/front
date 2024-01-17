<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-select v-model="timeType"
                 size="mini"
                 style="margin-bottom: 10px; width: 100px;"
                 @change="onTimeChange"
      >
        <el-option :label="groupType === 'day'? '近1周' : '近1月'" value="1"></el-option>
        <el-option :label="groupType === 'day'? '近1月' : '近3月'" value="2"></el-option>
        <el-option :label="groupType === 'day'? '近3月' : '近半年'" value="3"></el-option>
        <el-option :label="groupType === 'day'? '近半年' : '近1年'" value="4"></el-option>
        <el-option :label="groupType === 'day'? '近1年' : '近3年'" value="5"></el-option>
      </el-select>
      <el-select v-model="groupType"
                 size="mini"
                 style="margin-bottom: 10px; width: 70px; margin-left: 20px;"
                 @change="onTimeChange"
      >
        <el-option label="按天" value="day"></el-option>
        <el-option label="按月" value="month"></el-option>
      </el-select>
      <div
        id="chart"
        style="height: 500px; width: 100%"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import echarts, { EChartOption, ECharts } from 'echarts'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { stat } from '@/api/charge'

@Component({
  name: 'LineChart'
})
export default class extends Vue {
  private chart!: ECharts | null
  private sidebarElm?: Element

  private groupType: string = 'day'
  private timeType: string = '1'

  private stat: { times: string[], totals: number[], nums: number[] } = {
    times: [],
    totals: [],
    nums: []
  }

  private async fetchStat() {
    const data = await stat({ groupType: this.groupType, timeType: this.timeType })
    this.stat = data.value
    this.initChart()
  }

  private onTimeChange() {
    this.fetchStat()
  }

  mounted() {
    this.fetchStat()
  }

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }

  private initChart() {
    this.chart = echarts.init(document.getElementById('chart') as HTMLDivElement)
    this.chart.setOption({
      // dataZoom: [
      //   {
      //     type: 'slider',
      //     xAxisIndex: 0,
      //     filterMode: 'filter',
      //     startValue:0,
      //     endValue:4000
      //   }
      // ],
      backgroundColor: '#394056',
      title: {
        top: 20,
        text: '充值金额统计',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 16,
          color: '#F1F1F3'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        top: 20,
        icon: 'rect',
        itemWidth: 14,
        itemHeight: 5,
        itemGap: 13,
        data: ['增量', '总量'],
        right: '4%',
        textStyle: {
          fontSize: 12,
          color: '#F1F1F3'
        }
      },
      grid: {
        top: 100,
        left: '2%',
        right: '2%',
        bottom: '2%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        scale: true,
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#57617B'
          }
        },
        data: this.stat.times
      }],
      yAxis: [{
        type: 'value',
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#57617B'
          }
        },
        axisLabel: {
          show:true,
          interval: 0,
          margin: 10,
          fontSize: 14
        },
        splitLine: {
          lineStyle: {
            color: '#57617B'
          }
        }
      }],
      series: [{
        name: '总量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          width: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(0, 136, 212, 0.3)'
          }, {
            offset: 0.8,
            color: 'rgba(0, 136, 212, 0)'
          }], false) as any,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 10
        },
        itemStyle: {
          color: 'rgb(0,136,212)',
          borderColor: 'rgba(0,136,212,0.2)',
          borderWidth: 12
        },
        data: this.stat.totals
      },{
        name: '增量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          width: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(137, 189, 27, 0.3)'
          }, {
            offset: 0.8,
            color: 'rgba(137, 189, 27, 0)'
          }], false) as any,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 10
        },
        itemStyle: {
          color: 'rgb(137,189,27)',
          borderColor: 'rgba(137,189,2,0.27)',
          borderWidth: 12
        },
        data: this.stat.nums
      }]
    } as EChartOption<EChartOption.SeriesLine>)
  }
}
</script>
