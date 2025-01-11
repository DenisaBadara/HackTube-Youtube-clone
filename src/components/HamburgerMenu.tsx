import React from "react";
import { FaHome, FaPlusCircle, FaHistory, FaUserCircle } from "react-icons/fa";
import styles from "../styles/HamburgerMenu.module.css";

interface HamburgerMenuProps {
  isOpen: boolean;
  setPage: (page: string) => void;
  currentPage: string;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, setPage, currentPage }) => {
  return (
    <div className={`${styles.hamburgerMenu} ${isOpen ? styles.open : styles.closed}`}>
      <button
        onClick={() => setPage("home")}
        className={`${styles.menuItem} ${currentPage === "home" ? styles.active : ""}`}
      >
        <span className={styles.icon}>
            <FaHome />
        </span>
    
        {isOpen && <span className={styles.label}>Home</span>}
      </button>
      <button
        onClick={() => setPage("post")}
        className={`${styles.menuItem} ${currentPage === "post" ? styles.active : ""}`}
      >
        <span className={styles.icon}>
            <FaPlusCircle />
        </span>
       
        {isOpen && <span className={styles.label}>Post</span>}
      </button>
      <button
        onClick={() => setPage("history")}
        className={`${styles.menuItem} ${currentPage === "history" ? styles.active : ""}`}
      >
        <span className={styles.icon}>
            <FaHistory />
        </span>
      
        {isOpen && <span className={styles.label}>History</span>}
      </button>
      <button
        onClick={() => setPage("profile")}
        className={`${styles.menuItem} ${currentPage === "profile" ? styles.active : ""}`}
      >
        <span className={styles.icon} >
            <FaUserCircle />
        </span>
    
        {isOpen && <span className={styles.label}>Profile</span>}
      </button>
    </div>
  );
};

export default HamburgerMenu;