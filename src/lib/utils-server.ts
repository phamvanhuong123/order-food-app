import { cookies } from "next/headers";
export const setAccesTokenToCookie = async ({
  accessToken,
  exp,
}: {
  accessToken: string;
  exp: number;
}) => {
  const cookiesStore = await cookies();
  console.log(accessToken, exp)
  cookiesStore.set("accessToken", accessToken, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: exp * 1000,
  });
};
export const setRefreshTokenToCookie = async ({
  refreshToken,
  exp,
}: {
  refreshToken: string;
  exp: number;
}) => {
  const cookiesStore = await cookies();
  cookiesStore.set("refreshToken", refreshToken, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: exp * 1000,
  });
};
