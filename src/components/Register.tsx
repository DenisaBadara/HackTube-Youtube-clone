import React, { useState } from "react";
import styles from "../styles/Register.module.css";

interface RegisterProps {
  setPage: (page: string) => void;
}

const Register: React.FC<RegisterProps> = ({ setPage }) => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Registration successful!");
        setPage("login");
      } else {
        setError(data.error || "Failed to register.");
      }
    } catch (error) {
      setError("Error during registration.");
      console.error(error);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Register</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.registerForm} onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button
          type="button"
          onClick={handleRegister}
          className={styles.button}
        >
          Register
        </button>
        <button
          type="button"
          onClick={() => setPage("login")}
          className={styles.button}
        >
          Go to Login
        </button>
      </form>
    </div>
  );
};

export default Register;
