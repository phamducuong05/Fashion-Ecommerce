import { Button } from "./variants/button";
import { ShoppingCart, User, Menu } from "lucide-react";
import { Link } from "react-router";

interface HeaderProps {
  cartItemCount: number;
  isLoggedIn: boolean;
}

const Header = ({ cartItemCount, isLoggedIn }: HeaderProps) => {
  // Tạo một biến chứa các class chung cho link điều hướng để dễ quản lý và nhất quán
  const navLinkClasses =
    "text-sm font-medium text-gray-600 transition-colors hover:text-gray-900";

  return (
    // 1. Thêm font-sans để áp dụng font chữ mặc định của dự án (ví dụ: Poppins)
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur font-sans">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Nút menu cho mobile */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>

          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight text-gray-900"
            >
              Adam de Adam
            </Link>
          </div>

          {/* Điều hướng trên Desktop */}
          <nav className="hidden items-center space-x-8 md:flex">
            {/* 3. Áp dụng styling nhất quán cho tất cả các link điều hướng */}
            <Link to="/" className={navLinkClasses}>
              Home
            </Link>
            <Link to="/products" className={navLinkClasses}>
              Products
            </Link>
            <Link to="/about" className={navLinkClasses}>
              About
            </Link>
            {!isLoggedIn && (
              <Link to="/register" className={navLinkClasses}>
                Sign up
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to={isLoggedIn ? "/profile" : "/signin"} className="text-gray-600 hover:text-gray-900">
                <User className="h-5 w-5" />
                <span className="sr-only">{isLoggedIn ? "My Profile" : "Sign In"}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/cart" className="text-gray-600 hover:text-gray-900">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">View Cart</span>
                {cartItemCount > 0 && (
                  // 4. Style cho huy hiệu thông báo số lượng giỏ hàng
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
