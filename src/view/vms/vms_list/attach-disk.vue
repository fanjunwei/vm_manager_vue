<style lang="less">
  @import './index.less';
</style>
<template>
  <div>
    <Form ref="formItem" :model="formItem" :label-width="80">
      <FormItem label="容量" prop="size" :rules="[
            {required: true,type: 'number', message: '容量必填,并且为数字,最大1000GB,最小1GB', trigger: 'blur', max:1000, min:1},
          ]">
        <Input number v-model="formItem.size">
          <span slot="append">GB</span>
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
import { getBaseDisks, attachDisk } from '@/api/data'
import { mapState } from 'vuex'

export default {
  props: {
    selectedItem: Object
  },
  data () {
    return {
      loading: false,
      diskNames: [],
      formItem: {
        size: ''
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
          attachDisk(this.token, this.selectedItem.uuid, this.formItem).then(res => {
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
