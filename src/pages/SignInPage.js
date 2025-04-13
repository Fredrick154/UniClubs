import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignInPage() {
    const [registration_no, setAdmissionNo] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                registration_no,
                password
            });

            const { user, message } = response.data;

            if (message === "Login successful") {
                localStorage.setItem("user", JSON.stringify(user));
                setMessage("✅ Login successful!");
                setMessageType("success");

                setTimeout(() => {
                    if (user.role === "student") {
                        navigate("/student-dashboard");
                    } else if (user.role === "admin") {
                        navigate("/admin-dashboard");
                    } else if (user.role === "club_admin") {
                        navigate("/club-admin");
                    } else {
                        navigate("/");
                    }
                }, 1500);
            } else {
                setMessage("❌ Invalid admission number or password.");
                setMessageType("error");
            }
        } catch (err) {
            console.error("Login error:", err);
            setMessage("❌ Error logging in. Please try again.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f4f6f8",
            }}
        >
            <div
                style={{
                    backgroundColor: "#ffffff",
                    padding: "2rem",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    width: "400px",
                }}
            >
                <h2 style={{ textAlign: "center", color: "#007bff", marginBottom: "1.5rem" }}>
                    Login
                </h2>

                {message && (
                    <div
                        style={{
                            padding: "1rem",
                            marginBottom: "1rem",
                            borderRadius: "8px",
                            backgroundColor: messageType === "success" ? "#d1e7dd" : "#f8d7da",
                            color: messageType === "success" ? "#0f5132" : "#842029",
                            fontWeight: "500",
                            textAlign: "center",
                        }}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: ".5rem" }}>Admission Number</label>
                        <input
                            type="text"
                            value={registration_no}
                            onChange={(e) => setAdmissionNo(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: ".5rem" }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            padding: "0.75rem",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1rem",
};

export default SignInPage;
