import React, { useEffect, useState, useRef, forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { jishoSearchWord } from "~features/jisho";
import type { JishoResult } from "~shared/types/jishoTypes";
import { gptExplain } from "~features/chatgpt";
import HighLighter from "~components/common/HighLighter";
import { useTranslations } from "~shared/contexts/TranslationContext";
import DictionaryCard from "~components/DictionaryCard";

const cache: { [key: string]: any } = {};

interface TooltipContentProps {
  text: string;
  onClose: () => void;
  position?: { top: string; left: string; transform: string };
}

const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ text, onClose, position }, ref) => {
    const [loading, setLoading] = useState(false);
    const [dictionaryData, setDictionaryData] = useState<JishoResult[]>([]);
    const [explainedData, setExplainedData] = useState<any[]>([]);
    const { translations } = useTranslations();
    const originalText = Object.values(translations).join('');
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (cache[text]) {
        setDictionaryData(cache[text]);
        return;
      }

      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await jishoSearchWord(text);
          if (data.length > 0) {
            const results = data.map((item: JishoResult) => {
              const { isDict, type, text, reading, meanings, onyomi, kunyomi, jlpt } = item;
              return {
                isDict,
                type,
                text,
                reading,
                meanings,
                onyomi,
                kunyomi,
                jlpt
              };
            });
            cache[text] = results;
            setDictionaryData(results);
          } else {
            cache[text] = [];
            setDictionaryData([]);
          }
        } catch (error) {
          console.error("Failed to fetch data:", error);
          cache[text] = [];
          setDictionaryData([]);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [text]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
          onClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [tooltipRef, onClose]);

    const handleTextSelection = async (text: string, e: any) => {
      // check if the selection is already explained
      const isExplained = explainedData.some((item) => item.selection === e.selection);
      if (isExplained) return;
      const gptExplained: any = await gptExplain(originalText, e.selection);
      const newExplainedData = [
        {
          isDict: true,
          type: "gpt-explain",
          text: e.selection,
          meanings: [gptExplained.meaning],
          reading: gptExplained.reading
        },
        ...dictionaryData
      ];
      setExplainedData(prev => [...prev, { selection: e.selection, ...gptExplained }]);
      setDictionaryData(newExplainedData);
      cache[text] = newExplainedData; // Update cache with the new explained data
    };

    return (
      <div
        ref={tooltipRef}
        style={position}
        onClick={(event) => event.stopPropagation()}
        className="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-sm rounded-lg w-[400px] max-h-[300px] overflow-y-auto snap-y snap-mandatory shadow-lg tooltip"
        onMouseDown={(event) => event.stopPropagation()} // 이벤트 전파 중지
      >
        <div className="sticky top-0 bg-black pb-2 flex flex-row justify-end items-center gap-x-2 p-2">
          <HighLighter text={text} selectionHandler={(e) => handleTextSelection(text, e)} className="hover:underline font-bold text-xl border-b-2 border-white rounded" />
          <button className="text-white" onClick={onClose} style={{ width: 18, height: 18 }}>
            <FontAwesomeIcon icon={faCircleXmark} style={{ width: 18, height: 18 }} />
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <FontAwesomeIcon icon={faSpinner} spin style={{ width: 22, height: 22 }} />
          </div>
        ) : dictionaryData.length > 0 ? (
          <div className="p-4 space-y-4">
            {dictionaryData.map((data, index) => (
              <DictionaryCard key={index} data={data} />
            ))}
          </div>
        ) : (
          <p className="p-4">No definition found</p>
        )}
      </div>
    );
  }
);

export default TooltipContent;
