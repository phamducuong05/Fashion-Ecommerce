import { Button } from "./variants/button";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-80 mb-8">
            <div>
              <h4 className="mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-black">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Women
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Men
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Sale
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Help</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-black">
                    Customer Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Shipping
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Size Guide
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#about" className="hover:text-black">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Sustainability
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-black">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; 2025 Adam de Adam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
