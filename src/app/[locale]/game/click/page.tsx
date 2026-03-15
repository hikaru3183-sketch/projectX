import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ClickGameClientPage from "./ClickGameClientPage";
import { getClickerItemsAction } from "./logic/actions";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  // コインとアイテムの両方をサーバーサイドで取得
  const initialCoins = session?.user.coins ?? 0;
  const initialStock = await getClickerItemsAction();

  return (
    <ClickGameClientPage 
      initialCoins={initialCoins} 
      initialStock={initialStock} 
    />
  );
}