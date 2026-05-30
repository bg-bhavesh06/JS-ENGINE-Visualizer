import { useState } from "react";
import { loginService, signUpService } from "../services/auth";

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLoginView) {
        // Log In
        const data = await loginService(email, password);
        onAuthSuccess(data.token, data.user);
      } else {
        // Sign Up
        const data = await signUpService(username, email, password);
        onAuthSuccess(data.token, data.user);
      }
      onClose();
      // Clear fields
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
    setError("");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        background: "rgba(3, 7, 18, 0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 1050
      }}
    >
      <div 
        className="engine-panel p-4 w-100" 
        style={{ 
          maxWidth: "420px", 
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.6)"
        }}
      >
        {/* Header tabs */}
        <div className="d-flex border-bottom pb-2 mb-4 justify-content-between align-items-center" style={{ borderColor: "rgba(255, 255, 255, 0.06) !important" }}>
          <div className="d-flex gap-3">
            <button 
              className="btn btn-link p-0 text-decoration-none transition-all"
              style={{
                fontSize: "1.1rem",
                fontWeight: "700",
                color: isLoginView ? "#38bdf8" : "#94a3b8",
                borderBottom: isLoginView ? "2px solid #38bdf8" : "none",
                borderRadius: 0
              }}
              onClick={() => !isLoginView && handleToggleView()}
            >
              Sign In
            </button>
            <button 
              className="btn btn-link p-0 text-decoration-none transition-all"
              style={{
                fontSize: "1.1rem",
                fontWeight: "700",
                color: !isLoginView ? "#c084fc" : "#94a3b8",
                borderBottom: !isLoginView ? "2px solid #c084fc" : "none",
                borderRadius: 0
              }}
              onClick={() => isLoginView && handleToggleView()}
            >
              Register
            </button>
          </div>
          <button 
            onClick={onClose} 
            className="btn btn-link p-0 text-decoration-none" 
            style={{ color: "#94a3b8", fontSize: "1.2rem", fontWeight: "600" }}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          {error && (
            <div 
              className="p-2.5 px-3 rounded-3 small"
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                color: "#f87171",
                fontFamily: "'Inter', sans-serif"
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {!isLoginView && (
            <div className="d-flex flex-column gap-1.5">
              <label className="small text-slate-400" style={{ fontSize: "0.75rem", fontWeight: "600" }}>USERNAME</label>
              <input 
                type="text" 
                className="form-control btn-sm"
                placeholder="developer_jane"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  color: "#ffffff"
                }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="d-flex flex-column gap-1.5">
            <label className="small text-slate-400" style={{ fontSize: "0.75rem", fontWeight: "600" }}>
              {isLoginView ? "USERNAME OR EMAIL" : "EMAIL ADDRESS"}
            </label>
            <input 
              type={isLoginView ? "text" : "email"}
              className="form-control btn-sm"
              placeholder={isLoginView ? "jane@dev.com or developer_jane" : "jane@dev.com"}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                color: "#ffffff"
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="d-flex flex-column gap-1.5">
            <label className="small text-slate-400" style={{ fontSize: "0.75rem", fontWeight: "600" }}>PASSWORD</label>
            <input 
              type="password" 
              className="form-control btn-sm"
              placeholder="••••••••"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                color: "#ffffff"
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-sm mt-3 py-2 text-white transition-all"
            disabled={isLoading}
            style={{
              background: isLoginView 
                ? "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)" 
                : "linear-gradient(135deg, #c084fc 0%, #7c3aed 100%)",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600"
            }}
          >
            {isLoading ? "Validating Account..." : isLoginView ? "Sign In to Engine" : "Create Developer Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
