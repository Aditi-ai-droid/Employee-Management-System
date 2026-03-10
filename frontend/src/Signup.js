import React, { useState } from "react";
import axios from "axios";
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/signup";

      const res = await axios.post(url, formData);

      toast.success(res.data.message || "Success!", {
        position: "top-center",
        autoClose: 2000,
      });

      if (isLogin) {
        if (res.data && res.data.user) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        setTimeout(() => navigate("/"), 1500);
      } else {
        setTimeout(() => setIsLogin(true), 1500);
      }

      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ ✅ ✅ RETURN MUST BE INSIDE FUNCTION
  return (
    <div className="auth-wrapper">
      <ToastContainer />

      <div className="auth-panel">
        {/* LEFT */}
        <div className="auth-left-block">
          <img
            src="image/3d illustration.png"
            alt="illustration"
            className="auth-img"
          />

          <h2 className="auth-left-title">
            {isLogin
              ? "Welcome back! Log in to manage employees effortlessly."
              : "Create your account to start managing your workforce."}
          </h2>
        </div>

        {/* RIGHT */}
        <div className="auth-right-block glassy">
          <h2 className="auth-title">{isLogin ? "Login" : "Sign Up"}</h2>

          {/* Social Buttons */}
          <div className="auth-socials">
            <button className="social google">
              <i className="fa-brands fa-google"></i> Google
            </button>
            <button className="social fb">
              <i className="fa-brands fa-facebook-f"></i> Facebook
            </button>
          </div>

          <div className="divider">
            <span>or continue with email</span>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="field">
                <i className="fa-solid fa-user icon"></i>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="field">
              <i className="fa-solid fa-envelope icon"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <i className="fa-solid fa-lock icon"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading
                ? isLogin
                  ? "Logging in..."
                  : "Creating Account..."
                : isLogin
                ? "Login"
                : "Sign Up"}
            </button>
          </form>

          <p className="toggle-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span onClick={toggleMode}>
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
