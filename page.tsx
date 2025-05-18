import { Suspense } from "react"
import HomeScreen from "@/components/home-screen"
import LoadingScreen from "@/components/loading-screen"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#FFF5F5] to-white">
      <Suspense fallback={<LoadingScreen />}>
        <HomeScreen />
      </Suspense>
    </main>
  )
}
