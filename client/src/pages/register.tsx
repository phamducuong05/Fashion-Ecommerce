import { Link } from "react-router"; // Fixed import
import { API_URL } from "../config";
import { useState } from "react";
import { useNavigate } from "react-router";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Success: Save token and redirect
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      alert("Registration successful!");
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.type === "email" ? "email" : e.target.placeholder === "Full Name" ? "fullName" : e.target.placeholder === "Password" ? "password" : "confirmPassword"]: e.target.value });
  };
  // Simplify change handler for clarity in future, but for now specific binding via props
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-8 bg-white shadow-lg sm:rounded-lg flex justify-center flex-1">
        {/* Phần form đăng ký */}
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-8 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold text-gray-900">
              Sign up
            </h1>
            <div className="w-full flex-1 mt-8">
              
              {/* Google Button Omitted for Brevity - Keeping layout same but focusing on Email auth */}
              
              <div className="my-10 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Sign up with Email
                </div>
              </div>

              {error && <div className="text-red-500 text-center mb-4">{error}</div>}

              <form className="mx-auto max-w-xs" onSubmit={handleSubmit}>
                <input
                  className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white"
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required
                />
                <input
                  className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white mt-5"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <input
                  className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
                <input
                  className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none disabled:opacity-50">
                  <svg
                    className="w-6 h-6 -ml-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6m2.5-3h-5" />
                  </svg>
                  <span className="ml-3">{loading ? "Signing up..." : "Sign up"}</span>
                </button>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  Already exist account ?{" "}
                  <Link
                    className="text-indigo-500 hover:text-indigo-700 font-semibold"
                    to="/signin"
                  >
                    Log in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
