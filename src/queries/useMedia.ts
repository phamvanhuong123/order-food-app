import { mediaApiRequest } from "@/apiRequest/media";
import { useMutation } from "@tanstack/react-query";

export const useUploadImage = () => {
  return useMutation({
    mutationFn: mediaApiRequest.uploadImage,
  });
};
