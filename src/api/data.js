import axios from '@/libs/api.request'

export const getOverview = (token) => {
  return axios.request({
    url: 'libvirt/overview/',
    params: {
      token
    },
    method: 'get'
  })
}

export const getBaseDisks = (token) => {
  return axios.request({
    url: 'libvirt/base_disks/',
    params: {
      token
    },
    method: 'get'
  })
}

export const getVmsList = (token) => {
  return axios.request({
    url: 'libvirt/domains/',
    params: {
      token
    },
    method: 'get'
  })
}

export const createVm = (token, data) => {
  return axios.request({
    url: 'libvirt/domains/',
    params: {
      token
    },
    data: data,
    method: 'post'
  })
}

export const vmAction = (token, uuid, action) => {
  return axios.request({
    url: 'libvirt/domains/' + uuid + '/action/',
    params: {
      token
    },
    data: {
      action: action
    },
    method: 'post'
  })
}

export const vmXml = (token, uuid) => {
  return axios.request({
    url: 'libvirt/domains/' + uuid + '/xml/',
    params: {
      token
    },
    method: 'get'
  })
}

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}

export const getOrgData = () => {
  return axios.request({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: 'get_tree_select_data',
    method: 'get'
  })
}
