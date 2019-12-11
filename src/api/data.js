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

export const getSnaps = (token, host_id) => {
  return axios.request({
    url: `host/host/${host_id}/snapshot/`,
    params: {
      token
    },
    method: 'get'
  })
}

export const createSnaps = (token, host_id, name) => {
  return axios.request({
    url: `host/host/${host_id}/snapshot/`,
    params: {
      token
    },
    data: {
      name: name
    },
    method: 'post'
  })
}
export const revertSnaps = (token, host_id, snap_id) => {
  return axios.request({
    url: `host/host/${host_id}/snapshot/${snap_id}/revert/`,
    params: {
      token
    },
    data: {
      name: name
    },
    method: 'post'
  })
}

export const deleteSnap = (token, host_id, snap_id) => {
  return axios.request({
    url: `host/host/${host_id}/snapshot/${snap_id}/`,
    params: {
      token
    },
    method: 'delete'
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

export const saveDisk = (token, pk, disk_id, name) => {
  return axios.request({
    url: `host/host/${pk}/disk/${disk_id}/save/`,
    params: {
      token
    },
    data: { 'name': name },
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

export const detachDisk = (token, pk, disk_id) => {
  return axios.request({
    url: 'host/host/' + pk + '/disk/' + disk_id + '/detach/',
    params: {
      token
    },
    data: {},
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
