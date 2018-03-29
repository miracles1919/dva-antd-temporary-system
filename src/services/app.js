import { config } from 'utils'
import { fetchUpload } from 'utils/request'

const { api } = config
const { upload } = api

export function imgUpload (formData) {
  console.log(upload)
  return fetchUpload({
    url: upload,
    data: formData,
  })
}
