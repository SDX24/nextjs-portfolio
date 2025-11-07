import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const projects = [
  {
    title: "Project One",
    desc: "Short description of project one showcasing key features and technologies used.",
    img: "https://placehold.co/300.png",
    link: "#"
  },
  {
    title: "Project Two",
    desc: "Short description of project two showcasing key features and technologies used.",
    img: "https://placehold.co/300.png",
    link: "#"
  },
  {
    title: "Project Three",
    desc: "Short description of project three showcasing key features and technologies used.",
    img: "https://placehold.co/300.png",
    link: "#"
  }
]

export default function ProjectPreviewCard({ count = 3 }) {
  const displayedProjects = projects.slice(0, count)

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Featured Projects
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl">
            Check out some of my recent work
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {displayedProjects.map((project, index) => (
            <Card key={index} className="flex flex-col h-full">
              <CardHeader className="p-0">
                <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
                  <Skeleton className="absolute inset-0" />
                  <Image
                    src={project.img}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 p-6">
                <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                <CardDescription className="text-base">{project.desc}</CardDescription>
              </CardContent>
              
              <CardFooter className="p-6 pt-0">
                <Button asChild className="w-full">
                  <a href={project.link}>View Project</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}