import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      toast.success(res.data.message);

      localStorage.setItem("email", email);

      setTimeout(() => {
        navigate("/verify");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <ToastContainer />

      <div className="w-[420px] backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-10">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          {/* Email */}
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-lg pl-10 pr-10 py-3 outline-none focus:ring-2 focus:ring-white/50"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-gray-700 font-semibold py-3 rounded-lg hover:bg-white/80 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
