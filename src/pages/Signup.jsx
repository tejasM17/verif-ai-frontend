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
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const { signupUser, googleLoginUser, githubLoginUser } = useAuth();
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
      await signupUser(email, password, role);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGithub = async () => {
    setError("");
    setGithubLoading(true);
    try {
      const userData = await githubLoginUser();
      navigate(userData.role === "recruiter" ? "/recruiter" : "/student");
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") return;
      if (err.code === "auth/popup-blocked") {
        setError("Popup blocked. Please allow popups for this site.");
        return;
      }
      if (err.code === "auth/account-exists-with-different-credential") {
        setError("An account with this email already exists. Sign in with email and password.");
        return;
      }
      setError(err.response?.data?.detail || "GitHub sign-in failed");
    } finally {
      setGithubLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const userData = await googleLoginUser();
      navigate(userData.role === "recruiter" ? "/recruiter" : "/student");
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") return;
      if (err.code === "auth/popup-blocked") {
        setError("Popup blocked. Please allow popups for this site.");
        return;
      }
      if (err.code === "auth/account-exists-with-different-credential") {
        setError("An account with this email already exists. Sign in with email and password.");
        return;
      }
      setError(err.response?.data?.detail || "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
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
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-white">Create Account</h2>
        <p className="text-gray-400 text-xs mt-0.5">Join us and get started in minutes.</p>
      </div>

      {error && (
        <div className="mb-3 p-2 rounded-lg bg-red-950/50 border border-red-800 text-red-400 text-xs flex items-center gap-2 animate-shake">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
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

        {/* Role Selection */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-300 mb-1.5">I am a</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`relative flex flex-col items-center p-2.5 rounded-lg border transition-all duration-300 ${
                role === "student"
                  ? "border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20"
                  : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all duration-300 ${
                role === "student" ? "bg-yellow-400 text-black" : "bg-gray-800 text-gray-400"
              }`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <span className={`text-xs font-medium transition-colors duration-300 ${
                role === "student" ? "text-yellow-400" : "text-gray-400"
              }`}>Student</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("recruiter")}
              className={`relative flex flex-col items-center p-2.5 rounded-lg border transition-all duration-300 ${
                role === "recruiter"
                  ? "border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20"
                  : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all duration-300 ${
                role === "recruiter" ? "bg-yellow-400 text-black" : "bg-gray-800 text-gray-400"
              }`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <span className={`text-xs font-medium transition-colors duration-300 ${
                role === "recruiter" ? "text-yellow-400" : "text-gray-400"
              }`}>Recruiter</span>
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="flex items-start gap-2 text-xs text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 w-3.5 h-3.5 rounded border-gray-700 bg-gray-900 text-yellow-400 focus:ring-yellow-500/30"
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

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-950 px-2 text-[10px] text-gray-500">or sign up with</span>
        </div>
      </div>

      <div className="space-y-2">
        <SocialButton provider="google" onClick={handleGoogle} loading={googleLoading} />
        <SocialButton provider="github" onClick={handleGithub} loading={githubLoading} />
      </div>
    </AuthLayout>
  );
}
