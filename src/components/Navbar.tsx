import React, { useState } from "react";
import { LuYoutube } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import styles from "../styles/Navbar.module.css";

interface NavbarProps {
  setMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setPage: (page: string) => void;
  loggedInUser: { id: number; name: string; profilePicture: string } | null;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setMenuOpen, setPage, loggedInUser, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <button
          className={styles.hamburgerButton}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
        <div className={styles.logo} onClick={() => setPage("home")}>
          <span className={styles.logoIcon}>
            <LuYoutube />
          </span>
          <span className={styles.logoText}>Hacktube</span>
        </div>
      </div>
      
      <div className={styles.searchContainer}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search"
            className={styles.searchBar}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>
            <CiSearch />
          </button>
        </form>
      </div>
      
      {loggedInUser ? (
        <div
          className={styles.userInfo}
          onClick={() => setPage("profile")}
        >
          <img
            src={
              /^https?:\/\//.test(loggedInUser.profilePicture)
                ? loggedInUser.profilePicture
                : `http://localhost:5000/public/${loggedInUser.profilePicture}`
            }
            alt={`${loggedInUser.name}'s profile`}
            className={styles.profilePicture}
          />
          <div className={styles.userName}>{loggedInUser.name}</div>
        </div>
      ) : (
        <button
          className={styles.loginButton}
          onClick={() => setPage("login")}
        >
          <span className={styles.userIcon}>
            <FaRegCircleUser />
          </span>
          <span className={styles.loginText}>Sign in</span>
        </button>
      )}
    </nav>
  );
};

export default Navbar;
