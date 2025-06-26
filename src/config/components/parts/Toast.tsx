import React, { useState, useEffect } from 'react';
import styles from './Toast.module.css';

type ToastProps = {
  message: string;
  duration?: number; // ミリ秒（デフォルト5000）
  backgroundColor?: string;
};

const Toast: React.FC<ToastProps> = ({ message, duration = 5000, backgroundColor = '#91c36c' }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, duration);
    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      className={`${styles.toastAnimation} ${styles.toastContainer}`}
      style={{
        backgroundColor: backgroundColor,    
      }}
    >
      <span>
        {message}
      </span>
    </div>
  );
};

export default Toast;
