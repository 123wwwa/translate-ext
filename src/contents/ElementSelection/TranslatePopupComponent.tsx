import React from 'react';
import '../../styles/global.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import HoverTooltip from "./HoverTooltip";
import { useTranslations } from '~shared/contexts/TranslationContext';
const TranslatePopupComponent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { translations, loading } = useTranslations();

  const translationElements = Object.entries(translations).map(([translated,original], index) => {
    return (
      <HoverTooltip key={index} tooltipText={original}>
        {translated}
      </HoverTooltip>
    );
  });

  return (
    <div className="bg-white text-black border border-gray-300 rounded-lg shadow-lg relative font-sans">
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
            <FontAwesomeIcon icon={faSpinner} spin style={{ width: 22, height: 22 }} />
          </div>
        ) : (
          translationElements
        )}
      </article>
    </div>
  );
};

export default TranslatePopupComponent;
