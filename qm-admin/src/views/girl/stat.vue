<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-select v-model="timeType"
                 size="mini"
                 style="margin-bottom: 10px; width: 100px; margin-right: 30px;"
                 @change="onChange"
      >
        <el-option label="近1周" value="1"></el-option>
        <el-option label="近1月" value="2"></el-option>
        <el-option label="近3月" value="3"></el-option>
        <el-option label="近半年" value="4"></el-option>
        <el-option label="近1年" value="5"></el-option>
      </el-select>

      <el-select v-model="type"
                 size="mini"
                 style="margin-bottom: 10px; width: 100px;"
                 @change="onChange"
      >
        <el-option label="QM" value="QM"></el-option>
        <el-option label="SN" value="SN"></el-option>
        <el-option label="VIDEO" value="VIDEO"></el-option>
        <el-option label="PIC" value="PIC"></el-option>
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
import { Component, Vue } from 'vue-property-decorator'
import { stat } from '@/api/girl'

@Component({
  name: 'LineChart'
})
export default class extends Vue {
  private chart!: ECharts | null

  private timeType: string = '1'
  private type: string = 'QM'

  private stat: [{ city: string, times: string[], visits: number[] }] = []

  private async fetchStat() {
    const el = document.getElementById('chart') as HTMLDivElement
    el.removeAttribute('_echarts_instance_')
    const data = await stat({ timeType: this.timeType, type: this.type })
    this.stat = data.values
    this.initChart()
  }

  private onChange() {
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
      backgroundColor: '#394056',
      title: {
        top: 20,
        text: '教师访问趋势',
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
        data: this.stat.map(v => v.city === 'TOTAL' ? '总量' : v.city),
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
        data: this.stat[this.stat.length - 1].times
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
          show: true,
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
      series: this.stat.map((v, i) => {
        return {
          name: v.city === 'TOTAL' ? '总量' : v.city,
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
            color: this.randomBG(this.stat.length, i),
            borderColor: 'rgba(0, 136, 212, 0.2)',
            borderWidth: 12
          },
          data: v.visits
        }
      })
    } as EChartOption<EChartOption.SeriesLine>)
  }

  private randomBG(len: number, i: number) {
    const step = 255 / len
    const j = i + 1
    const r = Math.floor(Math.random() * j * step + step)
    const g = Math.floor(Math.random() * j * step + step)
    const b = Math.floor(Math.random() * j * step + step)
    return 'rgb(' + r + ',' + g + ',' + b + ')'
  }
}
</script>
