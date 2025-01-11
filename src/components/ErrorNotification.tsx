import React from 'react';
import styles from '../styles/ErrorNotification.module.css'; 

interface ErrorNotificationProps {
  message: string;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message }) => {
  return (
    <div className={styles.errorNotification}>
      <p>{message}</p>
    </div>
  );
};

export default ErrorNotification;
