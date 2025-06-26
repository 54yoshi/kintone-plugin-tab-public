import React from "react";
import styles from './SubmitButton.module.css';

type Props = {
  onClick: () => void;
  text: string;
  color?: string;
  borderColor?: string;
}

const SubmitButton = ({ onClick, text, color, borderColor }: Props) => {
  return (
    <div 
      className={`${styles.saveButton} ${styles.submitButtonStyled}`} 
      style={{
        backgroundColor: color ?? '#3498db',
        border: `1px solid ${borderColor ?? '#3498db'}`,
      }}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default SubmitButton;