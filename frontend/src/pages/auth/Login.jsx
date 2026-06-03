import React, { useState } from "react";
import { useAuth, ROLES } from "../../context/AuthContext";
import {
  Compass,
  Ship,
  Eye,
  EyeOff,
} from "lucide-react";

import "../../styles/login.css";

import Register from "./Register";
import ForgotPassword from "./ForgotPassword";

export default function Login({
  onLoginSuccess,
}) {
  const { login } = useAuth();

  const [mode, setMode] =
    useState("login");

  const [email, setEmail] = useState(
    "operator@oceanic-shipping.com"
  );

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [selectedRole, setSelectedRole] =
    useState(ROLES.OPERATOR);

  const [error, setError] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError(
        "Please provide your corporate email"
      );
      return;
    }

    setError("");

    try {
      const success = await login(
        email,
        password,
        selectedRole
      );

      if (success) {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setError(
          "Invalid credentials. Please verify your email and password."
        );
      }
    } catch (err) {
      setError(
        err.message ||
          "Connection to gateway failed."
      );
    }
  };

  if (mode === "register") {
    return (
      <Register
        onBack={() => setMode("login")}
      />
    );
  }

  if (mode === "forgot") {
    return (
      <ForgotPassword
        onBack={() => setMode("login")}
      />
    );
  }

  return (
    <div className="login-page">
      <div className="login-overlay" />

      <div className="login-card">
        <div className="brand-section">
          <div className="brand-icon">
            <Compass
              className="text-cyan pulse-pin"
              size={30}
            />
          </div>

          <h1 className="login-title">
            Vessel Optimization
          </h1>

          <div className="login-badge">
            Maritime Operations Platform
          </div>

          <p className="login-subtitle">
            SaaS Fleet Command Center
          </p>
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Corporate Email
            </label>

            <input
              type="email"
              placeholder="operator@oceanic-shipping.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <div
              className="password-wrapper"
              style={{
                position: "relative",
              }}
            >
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                style={{
                  paddingRight:
                    "45px",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                style={{
                  position:
                    "absolute",
                  right: "12px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  background:
                    "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#7dd3fc",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  padding: 0,
                }}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>
              Operations Role
            </label>

            <select
              value={selectedRole}
              onChange={(e) =>
                setSelectedRole(
                  e.target.value
                )
              }
            >
              <option
                value={ROLES.OPERATOR}
              >
                Fleet Operator
              </option>

              <option
                value={ROLES.MASTER}
              >
                Vessel Master
              </option>

              <option
                value={
                  ROLES.TECH_MANAGER
                }
              >
                Technical Manager
              </option>

              <option
                value={
                  ROLES.CHARTERER
                }
              >
                Commercial Charterer
              </option>

              <option
                value={ROLES.ADMIN}
              >
                System Administrator
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="login-btn"
          >
            <Ship size={18} />
            CONNECT TO GATEWAY
          </button>

          <div
            className="d-flex justify-content-between mt-3 px-1"
            style={{
              fontSize: "11px",
            }}
          >
            <button
              type="button"
              className="text-cyan border-0 bg-transparent p-0"
              style={{
                textDecoration:
                  "underline",
                cursor: "pointer",
              }}
              onClick={() =>
                setMode("forgot")
              }
            >
              Forgot Password?
            </button>

            <button
              type="button"
              className="text-cyan border-0 bg-transparent p-0"
              style={{
                textDecoration:
                  "underline",
                cursor: "pointer",
              }}
              onClick={() =>
                setMode("register")
              }
            >
              Register Account
            </button>
          </div>
        </form>

        <div className="security-note">
          Restricted access. All
          transmissions are encrypted
          and logged under IMO
          operational guidelines.
        </div>
      </div>
    </div>
  );
}