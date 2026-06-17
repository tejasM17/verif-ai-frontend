import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";
import SocialButton from "../components/auth/SocialButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue your secure experience."
      altText="Don't have an account?"
      altLink="/signup"
      altLabel="Sign up"
    >
      <div className="text-center mb-5">
        <h2 className="text-2xl font-bold text-white">Sign In</h2>
        <p className="text-gray-400 text-sm mt-1.5">Welcome back! Please enter your details.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-400 text-sm flex items-center gap-2 animate-shake">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <div className="flex items-center justify-between mb-5">
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-yellow-400 focus:ring-yellow-500/30"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            Forgot password?
          </button>
        </div>
        <AuthButton loading={loading}>Sign In</AuthButton>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-950 px-3 text-xs text-gray-500">or continue with</span>
        </div>
      </div>

      <div className="space-y-2">
        <SocialButton provider="google" onClick={() => {}} />
        <SocialButton provider="apple" onClick={() => {}} />
      </div>
    </AuthLayout>
  );
}
