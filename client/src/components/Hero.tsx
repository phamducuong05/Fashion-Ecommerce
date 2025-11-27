import { Button } from "./variants/button";
import { ImageWithFallback } from "./imagefallback";
import { Link } from "react-router";

const Hero = () => {
  return (
    <section className="relative h-[80vh] min-h-[590px] overflow-hidden">
      <ImageWithFallback
        src="https://im.uniqlo.com/global-cms/spa/resc8f850d955096411c3714c853492827cfr.jpg"
        alt="Fashion hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-xl text-white">
          <h1 className="text-5xl md:text-6xl mb-4">New Collection</h1>
          <p className="text-lg md:text-xl mb-8">
            Discover the latest trends in fashion. Elevate your style with our
            curated selection.
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-white text-black hover:bg-white/90">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
