import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function MyHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <Card className="overflow-hidden">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6">
            {/* Image Section */}
            <div className="shrink-0">
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-lg overflow-hidden">
                <Image
                  src="/profile.jpg"
                  alt="Profile Picture"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            
            {/* Text Content Section */}
            <div className="flex-1 space-y-4">
              <CardHeader className="p-0">
                <CardTitle className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  Stefan Dorosh
                </CardTitle>
                <CardDescription className="text-lg md:text-xl mt-2">
                  Full Stack Web Developer
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-0">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Welcome to my portfolio! Im a passionate developer with expertise in 
                  building modern web applications. I love creating innovative solutions 
                  and bringing ideas to life through code.
                </p>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}