<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`"
             style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie v-if="vmRunningCount" style="height: 300px;" :value="pieData" text="虚机运行数"></chart-pie>
        </Card>
      </i-col>
      <!--      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">-->
      <!--        <Card shadow>-->
      <!--          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>-->
      <!--        </Card>-->
      <!--      </i-col>-->
    </Row>
    <Row>
      <!--      <Card shadow>-->
      <!--        <example style="height: 310px;"/>-->
      <!--      </Card>-->
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
import { mapActions } from 'vuex'

export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      vmCount: 0,
      totalMem: 0,
      totalCpu: 0,
      vmRunningCount: 0
    }
  },
  mounted () {
    this.getOverview().then(data => {
      this.vmCount = data.vm_count
      this.totalMem = data.total_mem / 1024 / 1024
      this.totalCpu = data.total_cpu
      this.vmRunningCount = data.vm_running_count
    })
  },
  methods: {
    ...mapActions([
      'getOverview'
    ])
  },
  computed: {
    inforCardData: function () {
      return [
        { title: '虚拟机数量', icon: 'ios-desktop', count: this.vmCount, color: '#2d8cf0' },
        { title: '已分配内存(GB)', icon: 'ios-paper-outline', count: this.totalMem, color: '#19be6b' },
        { title: '已分配CPU', icon: 'ios-nuclear-outline', count: this.totalCpu, color: '#ff9900' }
      ]
    },
    pieData: function () {
      return [
        { value: this.vmRunningCount, name: '运行' },
        { value: this.vmCount - this.vmRunningCount, name: '关机' }
      ]
    }

  }
}
</script>

<style lang="less">
  .count-style {
    font-size: 50px;
  }
</style>
