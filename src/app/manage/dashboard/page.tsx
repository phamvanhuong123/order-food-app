import { accountApiRequest } from "@/apiRequest/account";
import { isNextRedirect } from "@/lib/utils";
import { cookies } from "next/headers";

const  Dashboard = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  let name = null
  try{
  const res = await accountApiRequest.sMe(accessToken)
  name = res.payload.data.name
  }
  catch(error : unknown){
    if(isNextRedirect(error)) throw error
  }
  return <>Dashboard Page :  {name}</>;
};
export default Dashboard;
