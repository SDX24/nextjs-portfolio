import MyHero from '@/components/MyHeroSection';
import ProjectPreviewCard from '@/components/project-preview-card';
import { fetchProjects } from '@/lib/db';

// Force dynamic rendering
export const revalidate = 0;

export default async function Home() {
  const projects = await fetchProjects();
  
  console.log("Projects on homepage:", projects); // Debug log

  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex-1">
        <MyHero />
        <ProjectPreviewCard projects={projects} count={3} />
      </main>
    </div>
  );
}