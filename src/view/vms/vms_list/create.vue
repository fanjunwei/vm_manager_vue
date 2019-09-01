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
      <FormItem label="内存" prop="memory" :rules="[
            {required: true,type: 'number', message: '内存必填,并且为数字,最大64GB,最小1GB', trigger: 'blur', max:64, min:1},
          ]">
        <Input number v-model="formItem.memory">
          <span slot="append">GB</span>
        </Input>
      </FormItem>
      <FormItem label="CPU" prop="cpu" :rules="[
            {required: true,type: 'integer', message: 'CPU必填,并且为整数,最大10,最小1', trigger: 'blur', max:64, min:1},
          ]">
        <Input number v-model="formItem.cpu">
          <span slot="append">核</span>
        </Input>
      </FormItem>
      <FormItem label="基础镜像" prop="disk_name" :rules="[
            {required: true, message: '必填'},
          ]">
        <Select v-model="formItem.disk_name" >
          <Option v-for="item in diskNames" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </FormItem>
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
import { getBaseDisks, createVm } from '@/api/data'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      loading: false,
      diskNames: [],
      formItem: {
        name: ''
      }
    }
  },
  mounted () {
    getBaseDisks(this.token).then(res => {
      this.diskNames = res.data.files
    })
  },
  methods: {
    handleSubmit () {
      this.$refs['formItem'].validate((valid) => {
        if (valid) {
          this.loading = true
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
