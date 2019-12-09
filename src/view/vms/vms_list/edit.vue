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
        name: '',
        desc: ''
      }
    }
  },
  mounted () {
    this.formItem.name = this.selectedItem.name
    this.formItem.desc = this.selectedItem.desc
  },
  methods: {
    handleSubmit () {
      this.$refs['formItem'].validate((valid) => {
        if (valid) {
          this.loading = true
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
