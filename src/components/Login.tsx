import React, { useState } from "react";
import styles from "../styles/Login.module.css";

interface LoginProps {
  setPage: (page: string) => void;
  setLoggedInUser: (user: { id: number; name: string; profilePicture: string } | null) => void;
}

const Login: React.FC<LoginProps> = ({ setPage, setLoggedInUser }) => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      const data = await response.json();

      if (response.ok) {
        console.log("User logged in:", data); // Debugging
        // Stochează user.id ca "token" în localStorage
        localStorage.setItem('token', data.user.id.toString());
        setLoggedInUser(data.user); // Salvează utilizatorul în state
        setPage("home");
      } else {
        setError(data.error || "Login failed.");
      }
    } catch (error) {
      setError("Error during login.");
      console.error(error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
      <button
        type="button"
        onClick={() => setPage("register")}
        className={styles.button}
      >
        Go to Register
      </button>
    </div>
  );
};

export default Login;
