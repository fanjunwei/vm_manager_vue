<style lang="less">
  @import './index.less';
</style>
<template>
  <div>
    <div class="table_top">
      <Button @click="createVm" type="primary">创建虚拟机
        <Icon type="md-add"/>
      </Button>
      <Dropdown @on-click="batchVmActionModel" style="margin-left: 10px">
        <Button type="primary">
          操作
          <Icon type="ios-arrow-down"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="start" :disabled="noSelected">开机</DropdownItem>
          <DropdownItem name="shutdown" :disabled="noSelected">关机</DropdownItem>
          <DropdownItem name="reboot" :disabled="noSelected">重启</DropdownItem>
          <DropdownItem name="destroy" :disabled="noSelected">强制关机</DropdownItem>
          <DropdownItem name="attach-disk" :disabled="noSelectedOne">挂载磁盘</DropdownItem>
          <DropdownItem name="xml" :disabled="noSelectedOne">查看XML</DropdownItem>
          <DropdownItem name="delete" :disabled="noSelected">删除</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Button @click="loadData" type="primary" style="margin-left: 10px">
        <Icon type="md-refresh"/>
      </Button>
    </div>
    <Table :columns="columns" :data="data" :loading="loading" @on-selection-change="tableSelected">
      <template slot-scope="{ row, index }" slot="name">
        <a @click="itemInfo(row)" href="javascirpt:void(0)">{{row.name}}</a>
      </template>
      <template slot-scope="{ row, index }" slot="mem_kb">
        <span>{{ formatSize(row.mem_kb*1024) }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="state">
        <Tag v-if="row.state==='running'" color="success">{{row.state}}</Tag>
        <Tag v-else color="default">{{row.state}}</Tag>
      </template>
      <template slot-scope="{ row, index }" slot="disk_dev">
        <span v-for="disk in row.disks" :key="disk.dev">
           <Tag v-if="disk.device==='disk'" color="primary" :title="disk.file">{{disk.dev}}</Tag>
           <Tag v-else color="cyan" :title="disk.file">{{disk.dev}}</Tag>
        </span>

      </template>
    </Table>
    <Modal
      v-model="showCheckModel"
      :title="CheckModelTitle"
      @on-ok="batchVmAction">
      <Tag v-for="item in tableSelection" :key="item.uuid" color="primary">{{item.name}}</Tag>
    </Modal>
    <Modal
      :scrollable="true"
      v-model="showXmlModel"
      :title="selectedOneTitle">
      <template slot="footer">
        <span></span>
      </template>
      <template>
        <p class="pre-line">{{xml}}</p>
      </template>
    </Modal>
    <Modal
      :scrollable="true"
      v-model="showCreateModal"
      title="创建虚拟机">
      <template slot="footer">
        <span></span>
      </template>
      <create @close="createModalClose" v-if="showCreateModal"></create>
    </Modal>
    <Modal
      :scrollable="true"
      v-model="showAttachDisk"
      title="挂载磁盘">
      <template slot="footer">
        <span></span>
      </template>
      <attach-disk :selectedItem="selectedItem" @close="attachModalModalClose" v-if="showAttachDisk"></attach-disk>
    </Modal>
  </div>
</template>

<script>
import TreeSelect from '_c/tree-select'
import { getVmsList, vmAction, vmXml } from '@/api/data'
import { mapState } from 'vuex'
import Create from './create'
import AttachDisk from './attach-disk'

export default {
  name: 'tree_select_page',
  components: {
    TreeSelect,
    Create,
    AttachDisk
  },
  data () {
    return {
      data: [],
      loading: true,
      showCheckModel: false,
      showXmlModel: false,
      showCreateModal: false,
      showAttachDisk: false,
      CheckModelTitle: '',
      lastAction: '',
      tableSelection: [],
      selectedItem: null,
      xml: '',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        // {
        //   title: 'UUID',
        //   key: 'uuid'
        // },
        {
          title: '名称',
          slot: 'name',
          key: 'name',
          sortable: true
        },
        {
          title: '状态',
          slot: 'state',
          key: 'state',
          sortable: true
        },
        {
          title: '分配内存',
          slot: 'mem_kb',
          key: 'mem_kb',
          sortable: true
        },
        {
          title: '分配CPU(核)',
          key: 'cpu',
          sortable: true
        },
        {
          title: '存储',
          slot: 'disk_dev'
        },
        {
          title: 'VNC端口',
          key: 'vnc_port',
          sortable: true
        }
      ]
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    createVm () {
      this.showCreateModal = true
    },
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
    },
    loadData () {
      this.loading = true
      getVmsList(this.token).then(res => {
        this.data = res.data
        this.loading = false
      })
    },
    batchVmAction () {
      let p = []
      this.tableSelection.forEach(item => {
        p.push(vmAction(this.token, item.uuid, this.lastAction).then(res => {
        }, err => {
          this.$Message.error(err.response.data.message)
        }))
      })
      Promise.all(p).then(() => {
        this.loadData()
      })
    },
    batchVmActionModel (action) {
      console.log('batchVmActionModel')
      if (action === 'xml') {
        if (this.tableSelection.length === 1) {
          this.showXmlModel = true
          this.selectedItem = this.tableSelection[0]
          this.xml = ''
          vmXml(this.token, this.tableSelection[0].uuid).then(res => {
            this.xml = res.data.xml
          }, err => {
            this.$Message.error(err.response.data.message)
          })
        }
      } else if (action === 'attach-disk') {
        if (this.tableSelection.length === 1) {
          this.selectedItem = this.tableSelection[0]
          this.showAttachDisk = true
        }
      } else {
        this.lastAction = action
        const actionNameMap = {
          'start': '开机',
          'shutdown': '关机',
          'reboot': '重启',
          'destroy': '强制关机',
          'delete': '删除'
        }
        this.CheckModelTitle = '是否确认要对以下虚拟机执行 "' + actionNameMap[action] + '" 操作'
        this.showCheckModel = true
      }
    },
    itemInfo (item) {
      this.selectedItem = item
      this.showXmlModel = true
      this.xml = ''
      vmXml(this.token, item.uuid).then(res => {
        this.xml = res.data.xml
      }, err => {
        this.$Message.error(err.response.data.message)
      })
    },
    tableSelected (selection) {
      this.tableSelection = selection
    },
    createModalClose () {
      this.showCreateModal = false
      this.loadData()
    },
    attachModalModalClose () {
      this.showAttachDisk = false
      this.loadData()
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token
    }),
    noSelected () {
      console.log(this.tableSelection.length)
      return this.tableSelection.length === 0
    },
    noSelectedOne () {
      return this.tableSelection.length !== 1
    },
    selectedOneTitle () {
      if (this.selectedItem) {
        return '虚拟机:' + this.selectedItem.name
      } else {
        return ''
      }
    }
  }
}
</script>
