import React from "react";
import './CancelButton.css';

type Props = {
  onClick: () => void;
  text: string;
}

const CancelButton = ({ onClick, text }: Props) => {
  return (
    <div 
    className="cancelButton" 
    onClick={onClick}
    style={{
      width: 'max-content',
      height: 'max-content',
    }}
    >
      {text}
    </div>
  );
};

export default CancelButton;