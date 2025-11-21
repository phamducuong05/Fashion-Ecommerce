import { Button } from "./variants/button";
import { ShoppingCart, User, Menu } from "lucide-react";
// Nên sử dụng 'react-router-dom' cho các ứng dụng React hiện đại
import { Link } from "react-router";

interface HeaderProps {
  cartItemCount: number;
  // Prop onCartClick đã được loại bỏ vì nút giờ đây là một liên kết trực tiếp đến trang giỏ hàng.
  // Nếu bạn cần một hành động khác (như mở giỏ hàng dạng pop-up), bạn nên tạo một nút riêng không chứa <Link>.
}

const Header = ({ cartItemCount }: HeaderProps) => {
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
            {/* 2. Làm cho logo đậm và tối màu hơn để khớp với phong cách "Our Products" */}
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
            <Link to="/membership" className={navLinkClasses}>
              Membership
            </Link>
            <Link to="/products" className={navLinkClasses}>
              Products
            </Link>
            <Link to="/about" className={navLinkClasses}>
              About
            </Link>
          </nav>

          {/* Các nút hành động bên phải */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                <User className="h-5 w-5" />
                <span className="sr-only">User Profile</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              asChild // Sử dụng asChild để Button hoạt động như một thẻ Link
            >
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
