<style lang="less">
  @import './index.less';
</style>
<template>
  <div>
    <div class="helper-item">配额将在下次启动后生效</div>
    <Form ref="formItem" :model="formItem" :label-width="80">
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
import { editVm } from '@/api/data'
import { mapState } from 'vuex'

export default {
  props: {
    selectedItem: Object
  },
  data () {
    return {
      loading: false,
      diskNames: [],
      isoNames: [],
      formItem: {
        mem_size_gb: '',
        cpu_core: ''
      }
    }
  },
  mounted () {
    this.formItem.mem_size_gb = this.selectedItem.mem_size_kb / 1024.0 / 1024.0
    this.formItem.cpu_core = this.selectedItem.cpu_core
  },
  methods: {
    handleSubmit () {
      this.$refs['formItem'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.formItem.mem_size_kb = this.formItem.mem_size_gb * 1024 * 1024
          editVm(this.token, this.selectedItem.id, this.formItem).then(res => {
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
