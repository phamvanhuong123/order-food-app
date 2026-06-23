import { authApiRequest } from "@/apiRequest/auth";
import { StatusCodes } from "http-status-codes";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  //Lấy accessToken và refreshToken
   const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value
    //clear cookie đi
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  if (!accessToken || !refreshToken) return  NextResponse.json({
    message : 'Không nhận được accessToken hoặc refreshToken'
  },{
    status : StatusCodes.OK
  })

  try{
    //Gọi api bên phía server
    const res = await authApiRequest.logOut( {accessToken,refreshToken})
    return NextResponse.json(res.payload)
  }
  catch(error){
    console.log(error)
    return NextResponse.json({
      message : 'Đã có lỗi xảy ra khi gọi đến server'
    },{
      status : StatusCodes.OK
    })

  }
}