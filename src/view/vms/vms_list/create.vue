<style lang="less">
  @import './index.less';
</style>
<template>
  <div>
    <Form ref="formItem" :model="formItem" :label-width="80">
      <FormItem label="名称" prop="name" :rules="[
            {required: true, message: '名称必填', trigger: 'blur'},
          ]">
        <Input v-model="formItem.name" placeholder=""/>
      </FormItem>
      <FormItem label="描述" prop="desc">
        <Input v-model="formItem.desc" placeholder=""/>
      </FormItem>
      <FormItem label="内存" prop="mem_size_gb" :rules="[
            {required: true,type: 'number', message: '内存必填,并且为数字,最大64GB,最小1GB', trigger: 'blur', max:64, min:1},
          ]">
        <Input number v-model="formItem.mem_size_gb">
          <span slot="append">GB</span>
        </Input>
      </FormItem>
      <FormItem label="CPU" prop="cpu_core" :rules="[
            {required: true,type: 'integer', message: 'CPU必填,并且为整数,最大10,最小1', trigger: 'blur', max:64, min:1},
          ]">
        <Input number v-model="formItem.cpu_core">
          <span slot="append">核</span>
        </Input>
      </FormItem>
      <FormItem label="网络" prop="network_names" :rules="[
            {required: true,type:'array', message: '必填'},
          ]">
        <Select multiple v-model="formItem.network_names">
          <Option v-for="item in networkNames" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </FormItem>
      <FormItem label="创建方式">
        <RadioGroup v-model="formItem.is_from_iso" type="button">
          <Radio :label="false">硬盘镜像</Radio>
          <Radio :label="true">ISO镜像</Radio>
        </RadioGroup>
      </FormItem>

      <div v-if="formItem.is_from_iso">
        <FormItem label="ISO镜像" prop="iso_names" :rules="[
            {required: true,type:'array', message: '必填'},
          ]">
          <Select multiple v-model="formItem.iso_names">
            <Option v-for="item in isoNames" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem label="磁盘大小" prop="init_disk_size_gb" :rules="[
            {required: true,type: 'number', message: '磁盘大小必填,并且为数字,最大1000GB,最小1GB', trigger: 'blur', max:1000, min:1},
          ]">
          <Input number v-model="formItem.init_disk_size_gb">
            <span slot="append">GB</span>
          </Input>
        </FormItem>
      </div>
      <div v-else>
        <FormItem label="硬盘镜像" prop="base_disk_name" :rules="[
            {required: true, message: '必填'},
          ]">
          <Select v-model="formItem.base_disk_name">
            <Option v-for="item in diskNames" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </FormItem>
      </div>

      <FormItem>
        <Button @click="handleSubmit" :loading="loading" type="primary">
          <span v-if="loading">提交...</span>
          <span v-else>提交</span>
        </Button>
        <Button @click="handleCancel" style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>

  </div>
</template>

<script>
import { getBaseDisks, getIos, createVm, getNetworkNames } from '@/api/data'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      loading: false,
      diskNames: [],
      isoNames: [],
      networkNames: [],
      formItem: {
        name: '',
        is_from_iso: false,
        mem_size_gb: null
      }
    }
  },
  mounted () {
    getBaseDisks(this.token).then(res => {
      this.diskNames = res.data.files
    })
    getIos(this.token).then(res => {
      this.isoNames = res.data.files
    })
    getNetworkNames(this.token).then(res => {
      this.networkNames = res.data
    })
  },
  methods: {
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
