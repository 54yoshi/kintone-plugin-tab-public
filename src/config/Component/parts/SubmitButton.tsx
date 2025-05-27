import React from "react";
import './SubmitButton.css';

type Props = {
  onClick: () => void;
  text: string;
  color?: string;
  borderColor?: string;
}

const SubmitButton = ({ onClick, text, color, borderColor }: Props) => {
  return (
    <div 
      style={{
        backgroundColor: color ?? '#3498db',
        border: `1px solid ${borderColor ?? '#3498db'}`,
      }} 
      className="saveButton" 
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default SubmitButton;