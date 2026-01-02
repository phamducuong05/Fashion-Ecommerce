import { useState, useEffect } from "react";
import type { ProductSummary } from "./components/ProductCard";
import { Routes, Route, useNavigate } from "react-router";
import HomePage from "./pages/home";
import AboutPage from "./pages/about";
import Header from "./components/Header";
import SignInPage from "./pages/signin";
import RegisterPage from "./pages/register";
import ProductsPage from "./pages/products";
import CartPage from "./pages/cart";
import ProductDetail from "./components/ProductDetails";
import ContactPage from "./pages/contact";
import ProfilePage from "./pages/profile";

export interface CartItemType {
  id: string;
  productId: string;
  variantId: string;
  stock: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
  size: string;
}

export interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

// export const products: ProductSummary[] = [
//   {
//     id: "1",
//     name: "Classic Leather Jacket",
//     price: 299,
//     originalPrice: 399,
//     image:
//       "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwamFja2V0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NjI5MzUyNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
//     category: "Outerwear",
//     color: "Black",
//     size: "L", // Bổ sung
//     isSale: true,
//     section: "sale",
//   },
//   {
//     id: "2",
//     name: "Premium Sneakers",
//     price: 129,
//     image:
//       "https://images.unsplash.com/photo-1650320079970-b4ee8f0dae33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjI5NzYxNDN8MA&ixlib-rb-4.1.0&q=80&w=1080",
//     category: "Footwear",
//     color: "White",
//     size: "US 8", // Bổ sung
//     isNew: true,
//     section: "new",
//   },
//   {
//     id: "3",
//     name: "Designer Handbag",
//     price: 450,
//     image:
//       "https://images.unsplash.com/photo-1613896640137-bb5b31496315?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBiYWd8ZW58MXx8fHwxNzYzMDIyNjIyfDA&ixlib-rb-4.1.0&q=80&w=1080",
//     category: "Accessories",
//     color: "Beige",
//     size: "One Size", // Bổ sung
//     isNew: true,
//     section: "bestseller",
//   },
//   {
//     id: "4",
//     name: "Summer Floral Dress",
//     price: 89,
//     originalPrice: 129,
//     image:
//       "https://images.unsplash.com/photo-1602303894456-398ce544d90b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBkcmVzcyUyMGZhc2hpb258ZW58MXx8fHwxNzYzMDQxNTIyfDA&ixlib-rb-4.1.0&q=80&w=1080",
//     category: "Dresses",
//     color: "Multi-color",
//     size: "M", // Bổ sung
//     isSale: true,
//     section: "sale",
//   },
//   {
//     id: "5",
//     name: "Minimalist Clothing Set",
//     price: 179,
//     image:
//       "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBhcHBhcmVsfGVufDF8fHx8MTc2MjkyOTI4NXww&ixlib-rb-4.1.0&q=80&w=1080",
//     category: "Sets",
//     color: "Gray",
//     size: "S", // Bổ sung
//     isNew: true,
//     section: "new",
//   },
//   {
//     id: "6",
//     name: "Statement Coat",
//     price: 350,
//     originalPrice: 450,
//     image:
//       "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBhcHBhcmVsfGVufDF8fHx8MTc2MjkyOTI4NXww&ixlib-rb-4.1.0&q=80&w=1080",
//     category: "Outerwear",
//     color: "Red",
//     size: "M", // Bổ sung
//     isSale: true,
//     section: "bestseller",
//   },
//   {
//     id: "7",
//     name: "Kids Casual Wear",
//     price: 59,
//     image:
//       "https://i.pinimg.com/1200x/2e/d8/00/2ed800e6f40957dcc74e3824c65288c0.jpg",
//     category: "Kids",
//     color: "Blue",
//     size: "4Y", // Bổ sung
//     isNew: true,
//     section: "new",
//   },
//   {
//     id: "8",
//     name: "Polo T-shirt",
//     price: 95,
//     image:
//       "https://i.pinimg.com/736x/42/74/84/427484293db52dd2f7611fe2672c0e4b.jpg",
//     category: "Footwear",
//     color: "Green",
//     size: "US 10", // Bổ sung
//     section: "bestseller",
//   },
//   {
//     id: "9",
//     name: "Sweater",
//     price: 179,
//     image:
//       "https://i.pinimg.com/736x/56/30/9d/56309d58d771fa6a42e5c76ef9049fad.jpg",
//     category: "Sets",
//     color: "Black",
//     size: "XL", // Bổ sung
//     isNew: true,
//     section: "sales",
//   },
// ];

function App() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeCart = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        // A. TRƯỜNG HỢP CÓ TOKEN (USER): Lấy từ API
        try {
          const res = await fetch("http://localhost:3000/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setCartItems(data);
          }
        } catch (error) {
          console.error("Lỗi tải giỏ hàng từ server:", error);
        }
      } else {
        // B. TRƯỜNG HỢP KHÔNG TOKEN (GUEST): Lấy từ LocalStorage
        const localCart = localStorage.getItem("cart");
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        }
      }
    };

    initializeCart();
  }, []); // Chạy 1 lần khi load trang

  const handleAddToCart = async (
    product: any,
    variant: any,
    quantity: number
  ) => {
    const token = localStorage.getItem("token");

    // === TRƯỜNG HỢP 1: KHÁCH VÃNG LAI (Lưu Local) ===
    if (!token) {
      setCartItems((prev) => {
        const variantIdStr = variant.id.toString();

        const isExist = prev.find((item) => item.variantId === variantIdStr);

        if (isExist) {
          // Cộng dồn số lượng
          return prev.map((item) => {
            if (item.variantId === variantIdStr) {
              const newQty = item.quantity + quantity;
              // Check stock client-side
              if (newQty > item.stock) {
                alert(`Kho chỉ còn ${item.stock} sản phẩm!`);
                return item;
              }
              return { ...item, quantity: newQty };
            }
            return item;
          });
        }

        // Tạo item mới
        const newItem: CartItemType = {
          id: `guest_${Date.now()}`,
          productId: product.id.toString(),
          variantId: variantIdStr,
          name: product.name,
          price: Number(product.price),
          image: variant.image || product.thumbnail || "",
          quantity: quantity,
          color: variant.color,
          size: variant.size,
          stock: variant.stock,
        };

        return [...prev, newItem];
      });

      alert("Đã thêm vào giỏ hàng (Guest Mode)!");
      return;
    }

    // === TRƯỜNG HỢP 2: ĐÃ ĐĂNG NHẬP (Lưu Database) ===
    try {
      const res = await fetch("http://localhost:3000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          variantId: variant.id,
          quantity: quantity,
        }),
      });

      if (!res.ok) throw new Error("Lỗi thêm giỏ hàng");

      // Đồng bộ lại state từ Server để đảm bảo ID và dữ liệu chuẩn nhất
      const resCart = await fetch("http://localhost:3000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newCartData = await resCart.json();
      setCartItems(newCartData);

      alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối server!");
    }
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Header cartItemCount={cartItemCount} />
      <Routes>
        <Route path="/" element={<HomePage cartItemCount={cartItemCount} />} />

        <Route path="/products" element={<ProductsPage />} />

        {/* Truyền cartItems và setCartItems xuống CartPage để nó hiển thị */}
        <Route
          path="/cart"
          element={
            <CartPage cartItems={cartItems} setCartItems={setCartItems} />
          }
        />

        <Route
          path="/productdetail/:id"
          element={<ProductDetail onAddToCart={handleAddToCart} />}
        />

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;
