import axios from '@/libs/api.request'

export const getOverview = (token) => {
  return axios.request({
    url: 'host/overview/',
    params: {
      token
    },
    method: 'get'
  })
}

export const getBaseDisks = (token) => {
  return axios.request({
    url: 'host/base_disks/',
    params: {
      token
    },
    method: 'get'
  })
}

export const getIos = (token) => {
  return axios.request({
    url: 'host/iso/',
    params: {
      token
    },
    method: 'get'
  })
}

export const getVmsList = (token) => {
  return axios.request({
    url: 'host/host/',
    params: {
      token
    },
    method: 'get'
  })
}

export const createVm = (token, data) => {
  return axios.request({
    url: 'host/host/',
    params: {
      token
    },
    data: data,
    method: 'post'
  })
}
export const editVm = (token, pk, data) => {
  return axios.request({
    url: 'host/host/' + pk + '/',
    params: {
      token
    },
    data: data,
    method: 'put'
  })
}

export const deleteVm = (token, id) => {
  return axios.request({
    url: 'host/host/' + id + '/',
    params: {
      token
    },
    method: 'delete'
  })
}

export const attachDisk = (token, pk, data) => {
  return axios.request({
    url: 'host/host/' + pk + '/attach_disk/',
    params: {
      token
    },
    data: data,
    method: 'post'
  })
}

export const vmAction = (token, uuid, action) => {
  return axios.request({
    url: 'host/host/' + uuid + '/action/',
    params: {
      token
    },
    data: {
      action: action
    },
    method: 'post'
  })
}

export const detachDisk = (token, uuid, dev) => {
  return axios.request({
    url: 'host/domains/' + uuid + '/detach_disk/',
    params: {
      token
    },
    data: {
      dev: dev
    },
    method: 'post'
  })
}

export const vmXml = (token, uuid) => {
  return axios.request({
    url: 'host/domains/' + uuid + '/xml/',
    params: {
      token
    },
    method: 'get'
  })
}

export const updateVmXml = (token, uuid, data) => {
  return axios.request({
    url: 'host/domains/' + uuid + '/xml/',
    params: {
      token
    },
    data: data,
    method: 'put'
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
