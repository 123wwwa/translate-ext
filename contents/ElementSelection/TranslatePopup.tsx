import React from "react";
import '../../styles/global.css';
const TranslatePopup = ({ text }) => {
  return (
    <div className="bg-black text-white border border-gray-300 p-2 rounded-lg shadow-lg">
      <p className="text-sm">{text}</p>
    </div>
  );
};

export default TranslatePopup;