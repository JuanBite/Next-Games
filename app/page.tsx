import { stackServerApp } from "@/stack/server"
import { redirect } from "next/navigation"
import HomeInfo from "@/components/HomeInfo"

export default async function Home() {
  const user = await stackServerApp.getUser()
  if(user)
  {
    redirect('dashboard')
  }
  return (
    <HomeInfo />
  )
}


