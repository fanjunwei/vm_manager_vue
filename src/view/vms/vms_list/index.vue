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
          <DropdownItem name="edit" :disabled="noSelectedOne" divided>编辑</DropdownItem>
          <DropdownItem name="edit-quota" :disabled="noSelectedOne">修改配额</DropdownItem>
          <DropdownItem name="attach-disk" :disabled="noSelectedOne" divided>挂载磁盘</DropdownItem>
          <!--          <DropdownItem name="xml" :disabled="noSelectedOne">编辑XML</DropdownItem>-->
          <DropdownItem name="sync" :disabled="noSelectedOne">同步XML配置</DropdownItem>
          <DropdownItem name="delete" :disabled="noSelected" divided>删除</DropdownItem>
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
      <template slot-scope="{ row, index }" slot="quota">
        <span>{{row.cpu_core}}C/{{ formatSize(row.mem_size_kb*1024) }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="ip">
        <div v-if="row.info">
          <div v-for="ip in row.info.ipaddrs" :key="ip">{{ip}}</div>
        </div>
      </template>
      <template slot-scope="{ row, index }" slot="state">
        <span v-if="row.info && row.info.state">
           <Tag v-if="row.info.state==='running'" color="success">{{row.info.state}}</Tag>
        <Tag v-else color="default">{{row.info.state}}</Tag>
        </span>
      </template>
      <template slot-scope="{ row, index }" slot="disk_dev">
        <span v-for="disk in row.disks" :key="disk.dev">
          <Poptip>
          <template>
            <span style="padding: 2px">
                  <Button size="small" v-if="disk.device==='disk'" type="primary" :title="disk.file">{{disk.dev}}</Button>
              <Button size="small" v-else type="info">{{disk.dev}}</Button>
            </span>

          </template>
          <div class="api" slot="content">
            <ButtonGroup>
                <Button size="small">保存为基础镜像</Button>
                <Button size="small" v-if="disk.dev!=='vda'" @click="handleDetachDisk(row,disk)">解除挂载</Button>
            </ButtonGroup>
        </div>
    </Poptip>

        </span>
      </template>
      <template slot-scope="{ row, index }" slot="task">
        <div v-if="row.last_task">
          <div :class="{'error-message':row.last_task.state==='FAILURE'}">
            {{row.last_task.name}}
            <span v-if="row.last_task.state==='FAILURE'">{{row.last_task.result}}</span>
            <span v-else>...</span>
          </div>
        </div>
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
      <attach-disk :selectedItem="selectedItem" @close="attachDiskModalClose" v-if="showAttachDisk"></attach-disk>
    </Modal>
    <Modal
      :scrollable="true"
      v-model="showEdit"
      title="编辑虚拟机">
      <template slot="footer">
        <span></span>
      </template>
      <edit :selectedItem="selectedItem" @close="editModalClose" v-if="showEdit"></edit>
    </Modal>
    <Modal
      :scrollable="true"
      v-model="showEditQuota"
      :title="'修改'+(selectedItem&&selectedItem.name)+'配额'">
      <template slot="footer">
        <span></span>
      </template>
      <edit-quota :selectedItem="selectedItem" @close="editQuotaModalClose" v-if="showEditQuota"></edit-quota>
    </Modal>
    <Modal
      :scrollable="true"
      v-model="showEditXml"
      :width="800"
      title="修改XML">
      <template slot="footer">
        <span></span>
      </template>
      <edit-xml :selectedItem="selectedItem" @close="editXmlModalClose" v-if="showEditXml"></edit-xml>
    </Modal>
  </div>
</template>

<script>
import TreeSelect from '_c/tree-select'
import { getVmsList, vmAction, deleteVm, detachDisk } from '@/api/data'
import { mapState } from 'vuex'
import Create from './create'
import Edit from './edit'
import EditQuota from './edit-quota'
import AttachDisk from './attach-disk'
import EditXml from './edit-xml'

export default {
  name: 'tree_select_page',
  components: {
    TreeSelect,
    Create,
    Edit,
    EditQuota,
    AttachDisk,
    EditXml
  },
  data () {
    return {
      data: [],
      loading: true,
      showCheckModel: false,
      showXmlModel: false,
      showCreateModal: false,
      showAttachDisk: false,
      showEditXml: false,
      showEdit: false,
      showEditQuota: false,
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
          title: '描述',
          key: 'desc',
          sortable: true
        },
        {
          title: '状态',
          slot: 'state',
          key: 'state',
          sortable: true
        },
        {
          title: '配额',
          slot: 'quota'
        },
        {
          title: 'IP',
          slot: 'ip'
        },
        {
          title: '存储',
          slot: 'disk_dev'
        },
        {
          title: 'VNC',
          key: 'vnc_port',
          width: 100,
          sortable: true
        },
        {
          title: '任务',
          slot: 'task'
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
      if (this.lastAction === 'delete') {
        this.tableSelection.forEach(item => {
          p.push(deleteVm(this.token, item.id).then(res => {
          }, err => {
            this.$Message.error(err.response.data.message)
          }))
        })
      } else {
        this.tableSelection.forEach(item => {
          p.push(vmAction(this.token, item.id, this.lastAction).then(res => {
          }, err => {
            this.$Message.error(err.response.data.message)
          }))
        })
      }

      Promise.all(p).then(() => {
        this.loadData()
      })
    },
    batchVmActionModel (action) {
      if (action === 'xml') {
        if (this.tableSelection.length === 1) {
          this.selectedItem = this.tableSelection[0]
          if (this.selectedItem.state === 'shut off') {
            this.showEditXml = true
          } else {
            this.$Message.error('只能修改关机状态的虚拟机')
          }
        }
      } else if (action === 'edit') {
        if (this.tableSelection.length === 1) {
          this.selectedItem = this.tableSelection[0]
          this.showEdit = true
        }
      } else if (action === 'edit-quota') {
        if (this.tableSelection.length === 1) {
          this.selectedItem = this.tableSelection[0]
          this.showEditQuota = true
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
          'delete': '删除',
          'sync': '同步XML配置'
        }
        this.CheckModelTitle = '是否确认要对以下虚拟机执行 "' + actionNameMap[action] + '" 操作'
        this.showCheckModel = true
      }
    },
    itemInfo (item) {
      this.selectedItem = item
      this.showXmlModel = true
      this.xml = item.xml
      // vmXml(this.token, item.uuid).then(res => {
      //   this.xml = res.data.xml
      // }, err => {
      //   this.$Message.error(err.response.data.message)
      // })
    },
    tableSelected (selection) {
      this.tableSelection = selection
    },
    createModalClose () {
      this.showCreateModal = false
      this.loadData()
    },
    editModalClose () {
      this.showEdit = false
      this.loadData()
    },
    editQuotaModalClose () {
      this.showEditQuota = false
      this.loadData()
    },
    attachDiskModalClose () {
      this.showAttachDisk = false
      this.loadData()
    },
    editXmlModalClose () {
      this.showEditXml = false
      this.loadData()
    },
    handleDetachDisk (item, disk) {
      this.$Modal.confirm({
        title: '卸载存储',
        content: '<p>是否确认卸载"' + disk.dev + '?"</p>',
        onOk: () => {
          detachDisk(this.token, item.id, disk.id).then(res => {
            this.loadData()
          }, err => {
            this.$Message.error(err.response.data.message)
          })
        }

      })
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
