import { envConfig } from "@/config";
import {
  getAccessTokenFromLocalStorage,
  normalizePath,
  removeTokenFromLocalStorage,
  setAcessTokenToLocalStorage,
  setRefreshToLocalStorage,
} from "@/lib/utils";
import { LoginResType } from "@/modelValidation/auth.shema";
import { StatusCodes } from "http-status-codes";
import { redirect } from "next/navigation";
type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
    message = "Lỗi HTTP",
  }: {
    status: number;
    payload: EntityErrorPayload;
    message?: string;
  }) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}
export class EntityError extends HttpError {
  declare status: StatusCodes.UNPROCESSABLE_ENTITY;
  declare payload: EntityErrorPayload;
  constructor({
    status,
    payload,
    message,
  }: {
    status: StatusCodes.UNPROCESSABLE_ENTITY;
    payload: EntityErrorPayload;
    message?: string;
  }) {
    super({ status, payload, message });
  }
}

let clientLogoutRequest: null | Promise<unknown> = null;
const isEnviromentClient = typeof window !== "undefined";
const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined,
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };
  if (isEnviromentClient) {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = `${baseUrl}/${normalizePath(url)}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });
  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };
  // Interceptor  xử lý request và response trước khi trả về cho phía component
  if (!res.ok) {
    if (res.status === StatusCodes.UNPROCESSABLE_ENTITY) {
      throw new EntityError(
        data as {
          status: StatusCodes.UNPROCESSABLE_ENTITY;
          payload: EntityErrorPayload;
        },
      );
    }
    //Trường hợp hết hạn token
    if (res.status === StatusCodes.UNAUTHORIZED) {
      //Môi trường client
      if (isEnviromentClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: null,
            headers: baseHeaders,
          });
          try {
            await clientLogoutRequest;
          } catch {
          } finally {
            clientLogoutRequest = null;
            removeTokenFromLocalStorage();
            location.href = "/login";
          }
        }
      }
      //Môi trường server
      else {
        const headers = new Headers(options?.headers);
        const accessToken = headers.get("Authorization")?.split("Bearer ")[1];
        redirect(`/logout?accessToken=${accessToken}`);
      }
    }
    //Các trường hợp lỗi còn lại
    throw new HttpError(
      data as { status: number; payload: EntityErrorPayload },
    );
  }
  // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
  if (isEnviromentClient) {
    const normalizeUrl = normalizePath(url);
    if (
      ["api/auth/login", "api/guest/login"].some(
        (item) => item === normalizeUrl,
      )
    ) {
      const { accessToken, refreshToken } = (payload as LoginResType).data;
      setAcessTokenToLocalStorage(accessToken);
      setRefreshToLocalStorage(refreshToken);
    } else if (
      ["api/auth/logout", "api/guest/logout"].some(
        (item) => item === normalizeUrl,
      )
    ) {
      removeTokenFromLocalStorage();
    }
  }
  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
