import { useState } from "react";
import image from "../assets/59AA7420-4989-4BBF-8598-C771D4F17FFC.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import type { UserData } from "../types/userData";
import { login, register } from "../services/auth";
import logo from "../assets/logoDesign.png";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import axios from "axios";
import { useTheme } from "../context/theme/useTheme";
import { FaMoon } from "react-icons/fa";
import { GoSun } from "react-icons/go";

export default function AuthPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.state?.from || "/dashboard"; // Get the intended destination after login

  const { theme, toggleTheme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    // capitalize the first letter of each word in the name input
    if (e.target.name === "name")
      setName(
        e.target.value
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      );
    if (e.target.name === "email") setEmail(e.target.value);
    if (e.target.name === "password") setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    // handle login or register
    if (isLogin) {
      try {
        await login({ email, password } as UserData);
        setEmail("");
        setPassword("");
        navigate(path); // Redirect to intended destination (dashboard or trip details page if invited)
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.msg;
          setError(message || "Something went wrong. Please try again.");
        } else {
          setError("Unexpected error. Please try again.");
        }
      }
    } else if (!isLogin) {
      try {
        await register({ name, email, password } as UserData);
        setName("");
        setEmail("");
        setPassword("");
        setIsLogin(true);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.msg;
          setError(message || "Something went wrong. Please try again.");
        } else {
          setError("Unexpected error. Please try again.");
        }
      }
    }
  };

  const visitLogin = () => {
    setIsLogin(true);
    setError(null);
  };

  const visitRegister = () => {
    setIsLogin(false);
    setError(null);
  };

  return (
    <div className="flex h-screen">
      {/* Left side: Login form */}
      <div className="hidden lg:flex items-center justify-center flex-1">
        <div className=" flex flex-col items-center">
          <img
            src={image}
            alt="Landing page image of a group of people walking on the beach at sunset"
            className="h-lvh w-lvw object-[25%_40%] object-cover"
          />
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="relative bg-secondary w-full lg:w-1/2 flex flex-col items-center justify-center">
        <div className="absolute top-5 right-5">
          <button
            onClick={toggleTheme}
            className="bg-btn-primary text-primary-txt p-2 rounded text-2xl cursor-pointer"
          >
            {theme === "dark" ? <GoSun /> : <FaMoon />}
          </button>
        </div>
        <div className="flex justify-start w-105">
          <img src={logo} alt="TravelCrew logo" className="w-37" />
        </div>
        <div className="max-w-md w-full px-6 py-2">
          <h1 className="text-3xl font-semibold mb-1 text-primary-txt">
            {isLogin ? "Welcome back" : "Create an account"}
          </h1>
          <h1 className="text-1lg mb-5 text-primary-txt">
            {isLogin
              ? "Sign in to keep planning your next adventure"
              : "Sign up to start planning your next adventure"}
          </h1>
          {error && (
            <div role="alert" className="mb-4 text-sm text-red-600">
              {error}
            </div>
          )}
          <form
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-primary-txt"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  className="placeholder-neutral-400 text-primary-txt mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                  value={name}
                  onChange={handleChange}
                  required
                  pattern=".{3,}"
                  title="Name must contain at least 3 characters"
                />
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary-txt"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="this@example.com"
                className="placeholder-neutral-400 text-primary-txt mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                value={email}
                onChange={handleChange}
                required
                pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                title="Please enter a valid email address"
                autoComplete="email"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-primary-txt"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="••••••••"
                className="placeholder-neutral-400 text-primary-txt mt-1 p-2 pr-10 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                value={password}
                onChange={handleChange}
                required
                pattern={
                  isLogin ? undefined : "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                }
                title={
                  isLogin
                    ? undefined
                    : "Must contain at least 8 characters with uppercase, lowercase, and a number."
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-11 -translate-y-1/2 text-xl cursor-pointer text-primary-txt"
              >
                {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </button>
            </div>
            <div>
              <button
                type="submit"
                className="cursor-pointer w-full bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 focus:outline-none focus:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </form>
          <div className="mt-4 text-sm text-secondary-txt text-center">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button
                  onClick={visitRegister}
                  className="text-primary-txt hover:underline cursor-pointer"
                >
                  Sign up here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={visitLogin}
                  className="text-primary-txt hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
