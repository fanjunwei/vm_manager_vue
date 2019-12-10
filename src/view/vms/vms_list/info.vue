<style lang="less">
  @import './index.less';
</style>
<template>
  <div>
    <Tabs @on-click="tabClick" :animated="false">
      <TabPane label="快照" name="snap">

        <div class="table_top">
          <Form ref="snapForm" :model="snapForm" label-position="right" :label-width="100">
            <FormItem label="名称" prop="name" :rules="[
            {required: true, message: '名称必填', trigger: 'none'},
              ]">
              <Input v-model="snapForm.name"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="createSnap">创建快照
                <Icon type="md-add"/>
              </Button>
            </FormItem>
          </Form>

        </div>
        <Table :columns="columns" :data="snapData" :loading="loading" @on-selection-change="tableSelected">
          <template slot-scope="{ row, index }" slot="op">
            <Button type="text" @click="handleRevertSnap(row)">恢复</Button>
            <Button type="text">删除</Button>
          </template>
        </Table>
      </TabPane>
      <TabPane label="XML" name="xml">
        <p class="pre-line">{{hostData.xml}}</p>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { getSnaps, createSnaps, revertSnaps } from '@/api/data'
import { mapState } from 'vuex'

export default {
  props: {
    hostData: Object
  },
  data () {
    return {
      snapForm: {
        name: ''
      },
      loading: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
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
          title: '父级快照',
          key: 'parent'
        },
        {
          title: '创建时间',
          key: 'create_time'
        },
        {
          title: '操作',
          slot: 'op'
        }
      ],
      snapData: [],
      tableSelection: null
    }
  },
  mounted () {
    this.loadSnapData()
  },
  methods: {
    tabClick (name) {
      if (name === 'snap') {
        this.loadSnapData()
      }
    },
    createSnap () {
      this.$refs['snapForm'].validate((valid) => {
        if (valid) {
          createSnaps(this.token, this.hostData.id, this.snapForm.name).then(res => {
            this.snapForm.name = ''
            this.loadSnapData()
          }, err => {
            this.$Message.error(err.response.data.message)
          })
        }
      })
    },
    handleRevertSnap (item) {
      revertSnaps(this.token, this.hostData.id, item.id).then(res => {
        this.$Message.info('开始恢复')
      }, err => {
        this.$Message.error(err.response.data.message)
      })
    },
    deleteSnap () {

    },
    tableSelected (selection) {
      this.tableSelection = selection
    },
    handleSubmit () {
      this.$refs['formItem'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.formItem.mem_size_kb = this.formItem.mem_size_gb * 1024 * 1024
          createVm(this.token, this.formItem).then(res => {
            this.loading = false
            this.$emit('close')
          }, err => {
            this.loading = false
            this.$Message.error(err.response.data.message)
          })
        }
      })
    },
    loadSnapData () {
      this.loading = true
      getSnaps(this.token, this.hostData.id).then(res => {
        this.loading = false
        this.snapData = res.data
      }, err => {
        this.loading = false
        this.$Message.error(err.response.data.message)
      })
    },

    handleCancel () {
      this.$emit('close')
    }
  },
  computed: {
    ...mapState({
      token: state => state.user.token
    })
  }
}
</script>
