import React, { useState } from "react";
import styles from "../styles/Profile.module.css";

interface ProfileProps {
  userId: number;
  setPage: (page: string) => void;
  setLoggedInUser: (user: { id: number; name: string; profilePicture: string }) => void;
}

const Profile: React.FC<ProfileProps> = ({ userId, setPage, setLoggedInUser }) => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    if (!userId) {
      setError("User ID is missing.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/profile/${userId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userId}`
        },
        body: JSON.stringify({ name, password, profilePicture }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");
        setError(null);
        setLoggedInUser(data.user); 
      } else {
        setError(data.error || "Failed to update profile.");
      }
    } catch (error) {
      setError("Error updating profile.");
      console.error(error);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2>Edit Profile</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.profileForm} onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="New Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Profile Picture URL"
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
          className={styles.input}
        />
        <button
          type="button"
          onClick={handleUpdate}
          className={styles.button}
        >
          Update Profile
        </button>
        <button
          type="button"
          onClick={() => setPage("home")}
          className={styles.button}
        >
          Back to Home
        </button>
      </form>
    </div>
  );
};

export default Profile;
