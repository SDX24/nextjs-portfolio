import MyHero from '@/components/MyHeroSection'
import ProjectPreviewCard from '@/components/project-preview-card'

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`, { 
    cache: "no-store" 
  });
  const { projects } = await res.json();

  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex-1">
        <MyHero />
        <ProjectPreviewCard projects={projects} count={3} />
      </main>
    </div>
  )
}