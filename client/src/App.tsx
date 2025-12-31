import { useState, useEffect } from "react";
import type { ProductSummary } from "./components/ProductCard";
import { Routes, Route, useLocation } from "react-router";
import HomePage from "./pages/home";
import AboutPage from "./pages/about";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SignInPage from "./pages/signin";
import RegisterPage from "./pages/register";
import ProductsPage from "./pages/products";
import CartPage from "./pages/cart";
import ProductDetail from "./components/ProductDetails";
import CheckoutPage from "./pages/checkout";
import OrderSuccessPage from "./pages/order-success";
import { API_URL } from "./config";
import ProfilePage from "./pages/profile";
import OrderHistoryPage from "./pages/order-history";
import ForgotPasswordPage from "./pages/forgot-password";

export interface CartItemType extends ProductSummary {
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
  const [cartItems, setCartItems] = useState<CartItemType[]>(() => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  });

  const location = useLocation();
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location]);

  // Fetch cart from DB on load if logged in
  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success" && data.data) {
            // Transform DB cart to Frontend format
            const dbItems = data.data.items.map((item: any) => ({
              id: item.variant.product.id, // Using product ID for now as per frontend logic
              name: item.variant.product.name,
              price: Number(item.variant.product.price),
              image: item.variant.image || item.variant.product.thumbnail,
              quantity: item.quantity,
              color: item.variant.color,
              size: item.variant.size,
              variantId: item.variant.id, // Keep track of variantId
            }));
            setCartItems(dbItems);
          }
        })
        .catch((err) => console.error("Failed to fetch cart:", err));
    }
  }, [token]);

  // Sync to local storage only if NOT logged in (or keep both synced? Let's keep local as backup/guest)
  useEffect(() => {
    if (!token) {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  const removeFromCart = (product: ProductSummary) => {};

  const handleAddToCart = async (product: ProductSummary) => {
    // Optimistic UI update
    setCartItems((prev) => {
      const isExist = prev.find((item) => item.id === product.id && item.color === product.color && item.size === product.size);
      if (isExist) {
        return prev.map((item) =>
          item.id === product.id && item.color === product.color && item.size === product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 } as CartItemType];
    });

    if (token) {
        // Sync to DB
        try {
            // Need variantId, but product summary might not have it if it's from ProductCard. 
            // Ideally ProductSummary should have variant info or we find it.
            // For now, let's assume we pass enough info to backend to find variant or we need to update ProductSummary.
            // Wait, ProductDetails passes a full object. 
            
            // If we don't have specific variant ID, backend `addToCart` finds it by productId + color + size.
            // That matches our backend logic! Good.

            await fetch(`${API_URL}/api/cart/add`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({
                    productId: product.id,
                    quantity: 1,
                    color: product.color,
                    size: product.size
                })
            });
        } catch (err) {
            console.error("Failed to add to cart DB:", err);
            // Revert state if needed? For now just log.
        }
    }
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Header cartItemCount={cartItemCount} isLoggedIn={!!token} />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              cartItemCount={cartItemCount}
              handleAddToCart={handleAddToCart}
            />
          }
        />

        <Route path="/about" element={<AboutPage />} />
        <Route path="/signin" element={<SignInPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/forgot-password" element={<ForgotPasswordPage />}></Route>
        <Route
          path="/products"
          element={<ProductsPage onAddToCart={handleAddToCart} />}
        ></Route>
        <Route
          path="/cart"
          element={
            <CartPage cartItems={cartItems} setCartItems={setCartItems} />
          }
        />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route
          path="/productdetail/:id"
          element={<ProductDetail onAddToCart={handleAddToCart} />}
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
