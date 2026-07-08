import http from "@/lib/http";

export const revalidateApiRequest = (tag  : string)=> http.get(`/api/revalidate?tag=${tag}`,{baseUrl : ''})