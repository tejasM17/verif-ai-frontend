import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";
import SocialButton from "../components/auth/SocialButton";
import PasswordStrength from "../components/auth/PasswordStrength";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signupUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await signupUser(email, password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Get started"
      subtitle="Create your account and start your journey with enterprise-grade security."
      altText="Already have an account?"
      altLink="/login"
      altLabel="Sign in"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Create Account</h2>
        <p className="text-gray-400 text-sm mt-1">Join us and get started in minutes.</p>
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
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
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
          autoComplete="new-password"
        />
        <PasswordStrength password={password} />
        <AuthInput
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />
        <div className="mb-5">
          <label className="flex items-start gap-2 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded border-gray-700 bg-gray-900 text-yellow-400 focus:ring-yellow-500/30"
            />
            <span>
              I agree to the{" "}
              <span className="font-medium text-yellow-400 hover:text-yellow-300">Terms of Service</span>
              {" "}and{" "}
              <span className="font-medium text-yellow-400 hover:text-yellow-300">Privacy Policy</span>
            </span>
          </label>
        </div>
        <AuthButton loading={loading}>Create Account</AuthButton>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-950 px-3 text-xs text-gray-500">or sign up with</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <SocialButton provider="google" onClick={() => {}} />
        <SocialButton provider="github" onClick={() => {}} />
      </div>
    </AuthLayout>
  );
}
