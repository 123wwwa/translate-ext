import React, { useEffect, useState, forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { jishoSearchWord } from "~features/jisho";
import DictionaryCard from "~components/DictionaryCard";
import type { JishoResult } from "~shared/types/jishoTypes";

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

        return (
            <div
                ref={ref}
                style={position}
                className="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-sm rounded-lg w-80 max-h-[300px] overflow-y-auto snap-y snap-mandatory shadow-lg tooltip"
            >
                <div className="sticky top-0 bg-black pb-2 flex flex-row justify-end items-center gap-x-2 p-2">
                    <h3 className="font-bold text-inherit">{text}</h3>
                    <button className="text-white" onClick={onClose} style={{ width: 18, height: 18 }}>
                        <FontAwesomeIcon icon={faCircleXmark} style={{ width: 18, height: 18 }} />
                    </button>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <FontAwesomeIcon icon={faSpinner} spin style={{ width: 22, height: 22 }}/>
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
