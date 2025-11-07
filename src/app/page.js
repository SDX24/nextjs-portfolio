import MyNavBar from '@/components/MyNavBar'
import MyHero from '@/components/MyHeroSection'

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <MyNavBar />
      <main className="flex-1">
        <MyHero />
      </main>
    </div>
  )
}