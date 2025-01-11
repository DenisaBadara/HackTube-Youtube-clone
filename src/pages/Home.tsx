import React from "react";
import styles from "../styles/Home.module.css";

interface HomeProps {
  setPage: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ setPage }) => {
  return (
    <div className={styles.homeContainer}>
      <h1>Bine ai venit la Hacktube!</h1>
      <p>Conectează-te pentru a începe să explorezi videoclipurile noastre.</p>
      <div className={styles.buttons}>
        <button onClick={() => setPage("login")} className={styles.button}>
          Sign In
        </button>
        <button onClick={() => setPage("register")} className={styles.button}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Home; 
