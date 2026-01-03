import { Button } from "./variants/button";
import { ImageWithFallback } from "./imagefallback";
import { Link } from "react-router";

const Hero = () => {
  return (
    <section className="relative h-[70vh] md:h-[70vh] min-h-[600px] overflow-hidden font-sans">
      {/* Ảnh nền */}
      <ImageWithFallback
        src="https://im.uniqlo.com/global-cms/spa/resc8f850d955096411c3714c853492827cfr.jpg"
        alt="Fashion hero new collection"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="relative container mx-auto px-4 md:px-8 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase mb-6 leading-tight animate-fade-in-up">
            New <span className="text-indigo-300">Collection</span>
            <br />
            Arrivals.
          </h1>

          <p className="text-lg md:text-2xl text-gray-100 mb-10 leading-relaxed max-w-xl animate-fade-in-up animation-delay-200">
            Discover the latest trends in fashion. Elevate your style with our
            curated selection of premium essentials.
          </p>

          <div className="animate-fade-in-up animation-delay-400">
            <Link to="/products">
              <Button
                size="lg"
                className="bg-white text-black font-bold px-10 py-6 rounded-full text-lg hover:bg-gray-100 hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
