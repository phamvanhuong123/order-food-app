import { guestApiRequest } from "@/apiRequest/guest";
import { HttpError } from "@/lib/http";
import { setAccesTokenToCookie, setRefreshTokenToCookie } from "@/lib/utils-server";
import { GuestLoginBodyType } from "@/modelValidation/guest.schema";
import { TokenPayload } from "@/types/jwt.types";
import { StatusCodes } from "http-status-codes";
import { decode } from "jsonwebtoken";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as GuestLoginBodyType;
  try {
    const { payload } = await guestApiRequest.login(body);
    const {
      data: { accessToken, refreshToken },
    } = payload;
    //decode Token
    const decodeAccessToken = decode(accessToken) as TokenPayload
    const decodeRefreshToken = decode(refreshToken) as TokenPayload

    //Set cookie
    await setAccesTokenToCookie({accessToken,exp :  decodeAccessToken.exp})
    await setRefreshTokenToCookie({refreshToken,exp :decodeRefreshToken.exp})
    // cookiesStore.set("accessToken", accessToken, {
    //   path: "/",
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "lax",
    //   expires: decodeAccessToken.exp * 1000,
    // });

    // cookiesStore.set("refreshToken", refreshToken, {
    //   path: "/",
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "lax",
    //   expires: decodeRefreshToken.exp * 1000,
    // });
   
    return Response.json(payload);
  } catch (error) {
    console.error(error)
    if (error instanceof HttpError) {
  
      return Response.json({
        message: error.payload.message,
        errors : error.payload.errors
      }, {
        status : error.status
      });
    }
    return Response.json(
      {
        message: "Đã có lỗi xảy ra",
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
