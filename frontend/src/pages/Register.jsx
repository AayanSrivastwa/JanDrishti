
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
    Eye,
    EyeOff,
    Moon,
    Sun,
    ShieldCheck,
} from "lucide-react";

import { registerUser } from "../Services/authService";
import AnimatedBackground from "../components/AnimatedBackground";
import "../styles/auth.css";
import { useTheme } from "../context/ThemeContext";

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Light / Dark Theme State (shared via ThemeContext)
    const { theme, toggleTheme } = useTheme();
    const darkMode = theme === "dark";

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setMessage("");

        if (password.length < 8) {
            setError("Your password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("The passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const { data, error: registerError } = await registerUser(
                name.trim(),
                email.trim(),
                password
            );

            if (registerError) {
                setError(registerError.message);
                return;
            }

            if (data?.session) {
                navigate("/dashboard");
            } else {
                setMessage(
                    "Your account was created. You can now sign in if email confirmation is disabled, or follow the confirmation instructions sent to your email."
                );
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`auth-page ${darkMode ? "dark-mode" : ""}`}>
            <AnimatedBackground />

            <header className="auth-header">
                <Link to="/" className="auth-brand">
                    <span className="auth-brand-mark">JD</span>
                    <span>
                        <strong>JanDrishti</strong>
                        <small>Civic Issue Platform</small>
                    </span>
                </Link>

                <button
                    type="button"
                    className="auth-theme-button"
                    onClick={toggleTheme}
                    aria-label="Toggle light and dark theme"
                >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </header>

            <main className="auth-main">
                <section className="auth-card">
                    <div className="auth-intro">
                        <div className="auth-intro-icon">
                            <ShieldCheck size={25} />
                        </div>

                        <span className="auth-eyebrow">BE PART OF THE CHANGE</span>

                        <h1>Your city. Your voice.</h1>

                        <p>
                            Create an account to report civic problems and help
                            your community track real progress.
                        </p>

                        <div className="auth-promise">
                            <span>01</span> Raise concerns
                            <span>02</span> Follow updates
                            <span>03</span> Verify outcomes
                        </div>
                    </div>

                    <div className="auth-form-section">
                        <span className="auth-form-label">JOIN JAN DRISHTI</span>
                        <h2>Create your account</h2>
                        <p className="auth-form-description">
                            Enter your details to get started.
                        </p>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <label htmlFor="register-name">Full name</label>
                            <input
                                id="register-name"
                                type="text"
                                autoComplete="name"
                                placeholder="Your full name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />

                            <label htmlFor="register-email">Email address</label>
                            <input
                                id="register-email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />

                            <label htmlFor="register-password">Password</label>
                            <div className="auth-password-field">
                                <input
                                    id="register-password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="At least 8 characters"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    minLength={8}
                                    required
                                />

                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <label htmlFor="register-confirm-password">
                                Confirm password
                            </label>
                            <input
                                id="register-confirm-password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                required
                            />

                            {error && (
                                <p className="auth-error" role="alert">
                                    {error}
                                </p>
                            )}

                            {message && (
                                <p className="auth-success" role="status">
                                    {message} <Link to="/login">Go to sign in</Link>
                                </p>
                            )}

                            <button
                                className="auth-submit"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Creating account..." : "Create account"}
                            </button>
                        </form>

                        <p className="auth-register">
                            Already registered? <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </section>
            </main>

            <footer className="auth-footer">
                <span>JanDrishti · Report. Resolve. Verify.</span>
                <span>Supporting SDG 11 — Sustainable Cities and Communities</span>
            </footer>
        </div>
    );
}
