interface HeroProps {}

export const Hero = ({}: HeroProps) => {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-8 max-w-screen-xl">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Hero Text */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Welcome to Ainia Quest Cards
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Start your learning adventure with voice or text
            </p>
          </div>
          
          {/* Hero Image */}
          <div className="w-full max-w-4xl">
            <img
              src="/hero-banner.jpg"
              alt="Kids exploring space and forest"
              className="w-full h-auto aspect-video object-cover rounded-xl shadow-soft"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
};