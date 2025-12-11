import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getHero } from '@/lib/db';

export default async function MyHero() {
  const hero = await getHero();

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <Card className="overflow-hidden">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6">
            {/* Avatar Section */}
            <div className="shrink-0">
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-lg overflow-hidden">
                {hero?.avatar && hero.avatar.startsWith('data:') ? (
                  <img
                    src={hero.avatar}
                    alt={hero.fullName || "Profile Picture"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src="/profile.jpg"
                    alt="Profile Picture"
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </div>
            </div>
            
            {/* Text Content Section */}
            <div className="flex-1 space-y-4">
              <CardHeader className="p-0">
                <CardTitle className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  {hero?.fullName || "Stefan Dorosh"}
                </CardTitle>
                <CardDescription className="text-lg md:text-xl mt-2">
                  {hero?.shortDescription || "Full Stack Web Developer"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-0">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {hero?.longDescription || "Welcome to my portfolio! I'm a passionate developer with expertise in building modern web applications. I love creating innovative solutions and bringing ideas to life through code."}
                </p>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}