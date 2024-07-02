import React, { useEffect, useState } from "react";
import '../../styles/global.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import HoverTooltip from "./HoverTooltip";

interface Translations {
  [key: string]: string;
}

const TranslatePopup = ({ translations, onClose }: { translations: Translations; onClose: any }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Object.keys(translations).length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [translations]);

  const translationElements = Object.entries(translations).map(([translation, original], index) => {
    return (
      <HoverTooltip key={index} tooltipText={original}>
        {translation}
      </HoverTooltip>
    );
  });

  return (
    <div className={`bg-white text-black border border-gray-300 rounded-lg shadow-lg relative font-sans`}>
      <div className="flex justify-end items-center p-0.5">
        <button
          className="text-black bg-transparent hover:text-gray-700"
          onClick={onClose}
          style={{ width: 18, height: 18 }}
        >
          <FontAwesomeIcon icon={faCircleXmark} style={{ width: 18, height: 18 }} />
        </button>
      </div>
      <article className="px-2">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <FontAwesomeIcon icon={faSpinner} spin />
          </div>
        ) : (
          translationElements
        )}
      </article>
    </div>
  );
};

export default TranslatePopup;
