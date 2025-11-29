import { Button } from "./variants/button";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-wider uppercase">
              Adam<span className="text-indigo-500">.</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Elevating your style with premium essentials. Crafted for the
              modern individual who values quality.
            </p>
            <div className="flex gap-4 pt-2">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-gray-400 hover:text-white hover:scale-110 transition-all"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-gray-200">
              Shop
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {["New Arrivals", "Best Sellers", "Men", "Women", "Sale"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-white hover:translate-x-1 transition-all inline-block"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-gray-200">
              Support
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                "Help Center",
                "Shipping & Returns",
                "Size Guide",
                "Contact Us",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter (Đã sửa lại dùng thẻ input thường) */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-gray-200">
              Stay in the loop
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get special offers and once-in-a-lifetime deals.
            </p>
            <form className="flex flex-col gap-3">
              {/* --- THAY ĐỔI Ở ĐÂY --- */}
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-gray-900 border border-gray-800 text-white text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 placeholder-gray-500 transition-all outline-none"
              />
              {/* ----------------------- */}

              <Button className="w-full bg-white text-black hover:bg-gray-200 font-bold tracking-wide">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; 2025 Adam de Adam. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300">
              Terms
            </a>
            <a href="#" className="hover:text-gray-300">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-300">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
