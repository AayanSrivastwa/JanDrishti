import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadProfile(currentUser) {
        if (!currentUser) {
            setProfile(null);
            return;
        }

        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", currentUser.id)
                .single();

            if (!error && data) {
                setProfile(data);
                return;
            }
        } catch {
            // silent fallback
        }

        // Fallback default profile from user metadata
        setProfile({
            id: currentUser.id,
            name: currentUser.user_metadata?.name || currentUser.email?.split("@")[0] || "Citizen",
            role: "Verified Citizen",
            ward: "Ward 42 - Connaught Place",
            trustScore: 88,
            badges: ["Active Verifier", "SDG-11 Contributor"]
        });
    }

    useEffect(() => {
        let mounted = true;

        async function initAuth() {
            // Check Supabase session
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (session?.user && mounted) {
                    setUser(session.user);
                    await loadProfile(session.user);
                    setLoading(false);
                    return;
                }
            } catch {
                // Supabase not reachable or offline
            }

            // Check Local Mock Session
            const localUserRaw = localStorage.getItem("jandrishti_mock_user");
            if (localUserRaw && mounted) {
                try {
                    const localUser = JSON.parse(localUserRaw);
                    setUser(localUser);
                    await loadProfile(localUser);
                    setLoading(false);
                    return;
                } catch {
                    // silent
                }
            }

            if (mounted) {
                setUser(null);
                setProfile(null);
                setLoading(false);
            }
        }

        initAuth();

        // Listen for Supabase auth state change
        let subscription = null;
        try {
            const authListener = supabase.auth.onAuthStateChange(async (_event, session) => {
                if (!mounted) return;
                if (session?.user) {
                    setUser(session.user);
                    await loadProfile(session.user);
                } else {
                    const localUserRaw = localStorage.getItem("jandrishti_mock_user");
                    if (localUserRaw) {
                        try {
                            const localUser = JSON.parse(localUserRaw);
                            setUser(localUser);
                            await loadProfile(localUser);
                        } catch {
                            setUser(null);
                            setProfile(null);
                        }
                    } else {
                        setUser(null);
                        setProfile(null);
                    }
                }
                setLoading(false);
            });
            subscription = authListener.data.subscription;
        } catch {
            // silent
        }

        // Custom window event listener for local login/logout
        function handleLocalAuth() {
            if (!mounted) return;
            const localUserRaw = localStorage.getItem("jandrishti_mock_user");
            if (localUserRaw) {
                try {
                    const localUser = JSON.parse(localUserRaw);
                    setUser(localUser);
                    loadProfile(localUser);
                } catch {
                    setUser(null);
                    setProfile(null);
                }
            } else {
                setUser(null);
                setProfile(null);
            }
        }

        window.addEventListener("jandrishti_auth_change", handleLocalAuth);

        return () => {
            mounted = false;
            if (subscription) subscription.unsubscribe();
            window.removeEventListener("jandrishti_auth_change", handleLocalAuth);
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
