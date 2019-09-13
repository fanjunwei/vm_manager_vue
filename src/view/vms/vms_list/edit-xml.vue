<style lang="less">
  @import './index.less';
</style>
<template>
  <div>
    <Form ref="formItem" :model="formItem" :label-width="80">
      <FormItem label="XML">
            <Input v-model="formItem.xml" type="textarea" :autosize="{minRows: 10,maxRows: 20}"></Input>
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
import { vmXml, updateVmXml } from '@/api/data'
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
        xml: ''
      }
    }
  },
  mounted () {
    vmXml(this.token, this.selectedItem.uuid).then(res => {
      this.formItem.xml = res.data.xml
    })
  },
  methods: {
    handleSubmit () {
      // this.$refs['formItem'].validate((valid) => {
      //   if (valid) {
      this.loading = true
      updateVmXml(this.token, this.selectedItem.uuid, this.formItem).then(res => {
        this.loading = false
        this.$emit('close')
      }, err => {
        this.loading = false
        this.$Message.error(err.response.data.message)
      })
      //   }
      // })
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
