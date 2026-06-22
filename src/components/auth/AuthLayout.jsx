import { Link } from "react-router-dom";
import heroImg from "../../assets/hero.png";

export default function AuthLayout({ children, title, subtitle, altText, altLink, altLabel }) {
  return (
    <div className="min-h-screen flex bg-black">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={heroImg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        <div className="relative flex flex-col justify-center px-12 text-white">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center">
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">VerifAI</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-3">{title}</h1>
            <p className="text-lg text-gray-300 max-w-sm">{subtitle}</p>
          </div>
          <div className="mt-10 space-y-3 animate-slide-up">
            {[
              { icon: "🛡️", text: "Enterprise-grade security & verification" },
              { icon: "⚡", text: "Lightning-fast authentication" },
              { icon: "🎯", text: "Zero friction user experience" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-gray-400 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-start lg:items-center justify-center bg-black px-4 py-8 lg:py-4 overflow-y-auto">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
              <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">VerifAI</span>
          </div>

          <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl shadow-yellow-500/5 p-4">
            {children}
          </div>

          <p className="text-center mt-4 mb-3 text-xs text-gray-500">
            {altText}{" "}
            <Link to={altLink} className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors">
              {altLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
