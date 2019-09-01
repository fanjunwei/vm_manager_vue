<template>
  <div>
    <Table :columns="columns" :data="data">
      <template slot-scope="{ row, index }" slot="mem">
        <span>{{ formatSize(row.mem_kb*1024) }}</span>
      </template>
    </Table>
  </div>
</template>

<script>
import TreeSelect from '_c/tree-select'
import { getVmsList } from '@/api/data'
import { mapState } from 'vuex'

export default {
  name: 'tree_select_page',
  components: {
    TreeSelect
  },
  data () {
    return {
      data: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'UUID',
          key: 'uuid'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '状态',
          key: 'state'
        },
        {
          title: '分配内存',
          slot: 'mem'
        },
        {
          title: '分配CPU',
          key: 'cpu'
        },
        {
          title: 'VNV端口',
          key: 'vnc_port'
        }
      ]
    }
  },
  mounted () {
    console.log(this.token)
    getVmsList(this.token).then(res => {
      const { data } = res
      this.data = data
    })
  },
  methods: {
    formatSize (size) {
      const rate = 1024
      if (size === '' || size === undefined) {
        return ''
      }
      const us = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
      let index = 0
      while (size >= rate) {
        size = parseFloat(size) / parseFloat(rate)
        index += 1
      }
      return Math.floor(size * 100) / 100 + us[index] + 'B'
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token
    })
  }
}
</script>

<style>

</style>
