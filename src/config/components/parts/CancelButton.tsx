import React from "react";
import styles from './Cancelbutton.module.css';

type Props = {
  onClick: () => void;
  text: string;
}

const CancelButton = ({ onClick, text }: Props) => {
  return (
    <div 
    className={`${styles.cancelButton} ${styles.cancelButtonStyled}`} 
    onClick={onClick}
    >
      {text}
    </div>
  );
};

export default CancelButton;