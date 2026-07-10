import { authApiRequest } from "@/apiRequest/auth";
import { setAccesTokenToCookie, setRefreshTokenToCookie } from "@/lib/utils-server";
import { StatusCodes } from "http-status-codes";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value as string
  if(!refreshToken){
     return Response.json({
      message : 'Không tìm thấy refreshToken'
     }, {
      status : StatusCodes.UNAUTHORIZED
     })
  }
  try {
    const {payload} = await authApiRequest.refreshToken({refreshToken : refreshToken})
    
    const decodeAccessToken = decode(payload.data.accessToken) as {exp : number}
    const decodeRefreshToken = decode(payload.data.refreshToken) as {exp : number}
    //set cookie mới

    await setAccesTokenToCookie({accessToken : payload.data.accessToken,exp :  decodeAccessToken.exp})
    await  setRefreshTokenToCookie({refreshToken : payload.data.refreshToken,exp :decodeRefreshToken.exp})
    //  cookieStore.set("accessToken", payload.data.accessToken, {
    //   path: "/",
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "lax",
    //   expires: decodeAccessToken.exp * 1000,
    // });

    // cookieStore.set("refreshToken", payload.data.refreshToken, {
    //   path: "/",
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "lax",
    //   expires: decodeRefreshToken.exp * 1000,
    // });
    return Response.json(payload);
    
  } catch (error) {
    console.log(error)
    return Response.json({
      message : `Đã có lỗi xảy ra${error}`
     }, {
      status : StatusCodes.UNAUTHORIZED
     })
  
  }

}