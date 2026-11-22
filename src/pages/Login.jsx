
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
    Eye,
    EyeOff,
    Moon,
    Sun,
    ShieldCheck,
} from "lucide-react";

import { loginUser } from "../Services/authService";
import AnimatedBackground from "../components/AnimatedBackground";
import "../styles/auth.css";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem("jandrishti-theme") === "dark"
    );

    function toggleTheme() {
        const nextTheme = !darkMode;

        setDarkMode(nextTheme);

        localStorage.setItem(
            "jandrishti-theme",
            nextTheme ? "dark" : "light"
        );
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const { data, error: loginError } = await loginUser(
                email.trim(),
                password
            );

            if (loginError) {
                setError(loginError.message);
                return;
            }

            if (data?.session) {
                navigate("/dashboard");
            } else {
                setError(
                    "Login completed, but no active session was returned."
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

            {/* HEADER */}
            <header className="auth-header">

                <Link to="/" className="auth-brand">

                    <span className="auth-brand-mark">JD</span>

                    <span className="auth-brand-info">
                        <strong>JanDrishti</strong>
                        <small>Civic Issue Platform</small>
                    </span>

                </Link>

                <button
                    type="button"
                    className="auth-theme-button"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

            </header>

            {/* MAIN */}
            <main className="auth-main">

                <section className="auth-card">

                    {/* LEFT INTRO SECTION */}
                    <div className="auth-intro">

                        <div className="auth-intro-icon">
                            <ShieldCheck size={25} />
                        </div>

                        <span className="auth-eyebrow">
                            YOUR COMMUNITY, YOUR VOICE
                        </span>

                        <h1>Welcome back.</h1>

                        <p>
                            Sign in to report local problems, follow their
                            progress, and help make your community better.
                        </p>

                        <div className="auth-promise">

                            <div>
                                <span>01</span>
                                <p>Report issues</p>
                            </div>

                            <div>
                                <span>02</span>
                                <p>Track progress</p>
                            </div>

                            <div>
                                <span>03</span>
                                <p>Verify resolution</p>
                            </div>

                        </div>

                    </div>

                    {/* RIGHT LOGIN FORM */}
                    <div className="auth-form-section">

                        <span className="auth-form-label">
                            CITIZEN PORTAL
                        </span>

                        <div className="auth-form-heading">
                            <h2>Sign in to your account</h2>

                            <p>
                                Enter your account details below.
                            </p>
                        </div>

                        <form
                            className="auth-form"
                            onSubmit={handleSubmit}
                        >

                            {/* EMAIL */}
                            <div className="auth-field">

                                <label htmlFor="login-email">
                                    Email address
                                </label>

                                <input
                                    id="login-email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    required
                                />

                            </div>

                            {/* PASSWORD */}
                            <div className="auth-field">

                                <label htmlFor="login-password">
                                    Password
                                </label>

                                <div className="auth-password-field">

                                    <input
                                        id="login-password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="auth-password-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        aria-label={
                                            showPassword ? "Hide password" : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* ERROR MESSAGE */}
                            {error && (
                                <p className="auth-error" role="alert">
                                    {error}
                                </p>
                            )}

                            {/* LOGIN BUTTON */}
                            <button
                                className="auth-submit"
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Signing in..."
                                    : "Sign in to JanDrishti"}
                            </button>

                        </form>

                        {/* REGISTER LINK */}
                        <p className="auth-register">
                            Don't have an account?
                            <Link to="/register">
                                Create account
                            </Link>
                        </p>

                    </div>

                </section>

            </main>

            {/* FOOTER */}
            <footer className="auth-footer">

                <span>
                    JanDrishti · Report. Resolve. Verify.
                </span>

                <span>
                    Supporting SDG 11 — Sustainable Cities and Communities
                </span>

            </footer>

        </div>
    );
}
