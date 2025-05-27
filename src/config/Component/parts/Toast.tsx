import React, { useState, useEffect } from 'react';
import './Toast.css';

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
      className='toastAnimation'
      style={{
        position: 'fixed',
        top: '100px',
        left: '50%',
        backgroundColor: backgroundColor,    
        color: '#ffffff',
        padding: '16px 24px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        zIndex: 10000,
        fontSize: '16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: '700px',
      }}
    >
      <span
      >
        {message}
      </span>
    </div>
  );
};

export default Toast;
