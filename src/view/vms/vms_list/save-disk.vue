<style lang="less">
  @import './index.less';
</style>
<template>
  <div>
    <Form ref="formItem" :model="formItem" :label-width="80">
      <FormItem label="名称" prop="name" :rules="[
            {required: true},
          ]">
        <Input v-model="formItem.name">
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
import { saveDisk } from '@/api/data'
import { mapState } from 'vuex'

export default {
  props: {
    selectedItem: Object,
    selectedDisk: Object
  },
  data () {
    return {
      loading: false,
      formItem: {
        name: ''
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs['formItem'].validate((valid) => {
        if (valid) {
          this.loading = true
          saveDisk(this.token, this.selectedItem.id, this.selectedDisk.id, this.formItem.name).then(res => {
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
