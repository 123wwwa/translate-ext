import React, { useEffect, useState, forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { jishoSearchWord } from "~features/jisho";
import * as wanakana from 'wanakana';

const cache: { [key: string]: any } = {};

interface TooltipContentProps {
    text: string;
    onClose: () => void;
    position?: { top: string; left: string; transform: string };
}

const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
    ({ text, onClose, position }, ref) => {
        const [loading, setLoading] = useState(false);
        const [dictionaryData, setDictionaryData] = useState<any[]>([]);

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
                        const results = data.map((item: any) => {
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
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xl rounded-lg w-72 max-h-[200px] overflow-y-auto shadow-lg tooltip"
            >
                <div className="sticky top-0 bg-black pb-2 flex flex-row justify-end items-center gap-x-2 p-2">
                    <h3 className="font-bold text-inherit">{text}</h3>
                    <button className="text-white" onClick={onClose} style={{ width: 18, height: 18 }}>
                        <FontAwesomeIcon icon={faCircleXmark} style={{ width: 18, height: 18 }} />
                    </button>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <FontAwesomeIcon icon={faSpinner} spin />
                    </div>
                ) : dictionaryData.length > 0 ? (
                    <div className="p-4">
                        {dictionaryData.map((data, index) => (
                            <div key={index} className="mb-4">
                                <h3 className="font-bold">{data.text}</h3>
                                {!data.isDict ? (
                                    <></>
                                ) : data.type === "kanji" ? (
                                    <div>
                                        <p><strong>Onyomi:</strong> {`${data.onyomi?.join(", ")} (${wanakana.toRomaji(data.onyomi?.join(", "))})`}</p>
                                        <p><strong>Kunyomi:</strong> {`${data.kunyomi?.join(", ")} (${wanakana.toRomaji(data.kunyomi?.join(", "))})`}</p>
                                        <p><strong>Meaning:</strong> {data.meanings?.join(", ")}</p>
                                        {data.jlpt && <p><strong>JLPT Level:</strong> {data.jlpt}</p>}
                                    </div>
                                ) : (
                                    <div>
                                        <p><strong>Reading:</strong> {`${data.reading} (${wanakana.toRomaji(data.reading)})`}</p>
                                        <p><strong>Meanings:</strong> {data.meanings ? data.meanings.map((sense: any) => sense.english_definitions.join(", ")).join("; ") : "No meanings available"}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No definition found</p>
                )}
            </div>
        );
    }
);

export default TooltipContent;
