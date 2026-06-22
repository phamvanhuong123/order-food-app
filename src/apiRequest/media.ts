import http from "@/lib/http"
import { UploadImageResType } from "@/modelValidation/media.schema"


const uploadImage = (formData : FormData)=> {
  return http.post<UploadImageResType>('media/upload', formData)
}

export const mediaApiRequest = {
  uploadImage
}