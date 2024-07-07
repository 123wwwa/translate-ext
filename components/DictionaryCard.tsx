import React, { useState, useRef, useEffect } from 'react';
import * as wanakana from 'wanakana';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faPlus } from '@fortawesome/free-solid-svg-icons';
import { saveWord, getAllWordBookNames } from '~shared/indexDB/dictionary';
import type { JishoResult } from '~shared/types/jishoTypes';
import Tooltip from 'react-tooltip-lite';
import { useForm, Controller } from 'react-hook-form';

const DictionaryCard = ({ data }: { data: JishoResult }) => {
    const { control, handleSubmit, reset } = useForm();
    const [showFullMeaning, setShowFullMeaning] = useState(false);
    const [wordBooks, setWordBooks] = useState<string[]>([]);
    const [selectedWordBook, setSelectedWordBook] = useState<string>('Default word');
    const [newWordBook, setNewWordBook] = useState<string>('');
    const meaningRef = useRef<HTMLParagraphElement>(null);
    const [isClamped, setIsClamped] = useState(false);

    useEffect(() => {
        const fetchWordBooks = async () => {
            const wordBooks = await getAllWordBookNames();
            setWordBooks(wordBooks);
        };
        fetchWordBooks();
    }, []);

    useEffect(() => {
        if (meaningRef.current) {
            setIsClamped(meaningRef.current.scrollHeight > meaningRef.current.clientHeight);
        }
    }, [meaningRef, data.meanings]);

    const saveData = async (data: JishoResult, wordbook: string) => {
        await saveWord(data, wordbook);
    };

    const toggleShowFullMeaning = () => {
        setShowFullMeaning(!showFullMeaning);
    };

    const onSubmit = async (formData: any) => {
        const wordbook = formData.wordbook === 'new' ? newWordBook : formData.wordbook;
        await saveData(data, wordbook);
        reset();
    };

    const renderMeaning = (meanings: string[]) => {
        const joinedMeanings = meanings.join(", ");
        return (
            <div>
                <p ref={meaningRef} className={`overflow-hidden text-ellipsis ${showFullMeaning ? '' : 'line-clamp-3'}`} style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: showFullMeaning ? 'none' : '3' }}>
                    {joinedMeanings}
                </p>
                {isClamped && !showFullMeaning && (
                    <span className="text-blue-500 cursor-pointer" onClick={toggleShowFullMeaning}>
                        {' '}
                        더보기
                    </span>
                )}
                {showFullMeaning && (
                    <span className="text-blue-500 cursor-pointer" onClick={toggleShowFullMeaning}>
                        {' '}
                        간략히 보기
                    </span>
                )}
            </div>
        );
    };

    const dataCard = (data: JishoResult) => {
        switch (data.type) {
            case "kanji":
                return (
                    <>
                        <div className="flex-none text-6xl font-bold text-center w-1/3">{data.text}</div>
                        <div className="flex-1">
                            <p className="text-xl mb-2">{data.meanings?.join(", ")}</p>
                            <div className="text-sm text-gray-400 space-y-1">
                                <p><strong>On:</strong> {data.onyomi?.join(", ")} ({wanakana.toRomaji(data.onyomi?.join(", "))})</p>
                                <p><strong>Kun:</strong> {data.kunyomi?.join(", ")} ({wanakana.toRomaji(data.kunyomi?.join(", "))})</p>
                                {data.jlpt && <p><strong>JLPT:</strong> {data.jlpt}</p>}
                            </div>
                        </div>
                    </>
                );
            case "phrase":
                return (
                    <>
                        <div className="flex-none text-2xl font-bold text-center w-1/3">{data.text}</div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-400 mb-2">{data.reading} ({wanakana.toRomaji(data.reading)})</p>
                            <ol className="list-decimal list-inside space-y-1">
                                {data.meanings.map((sense: any, senseIndex: number) => (
                                    <li key={senseIndex}>{renderMeaning(sense.english_definitions)}</li>
                                ))}
                            </ol>
                        </div>
                    </>
                );
            case "gpt-explain":
                return (
                    <>
                        <div className="flex-none text-2xl font-bold text-center w-1/3">{data.text}</div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-400 mb-2">{data.reading} ({wanakana.toRomaji(data.reading)})</p>
                            {renderMeaning(data.meanings)}
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="snap-center p-4 bg-gray-800 rounded-lg shadow-md flex items-center space-x-4 h-150">
            {dataCard(data)}
            <div className="ml-auto relative">
                <Tooltip
                    content={
                        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-2 rounded shadow-lg">
                            <div className="mb-2">
                                <label className="block text-gray-700">단어장 선택</label>
                                {wordBooks.map((wordbook, index) => (
                                    <div key={index} className="flex items-center">
                                        <Controller
                                            name="wordbook"
                                            control={control}
                                            defaultValue="Default word"
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="radio"
                                                    value={wordbook}
                                                    checked={field.value === wordbook}
                                                    onChange={(e) => setSelectedWordBook(e.target.value)}
                                                />
                                            )}
                                        />
                                        <label className="ml-2">{wordbook}</label>
                                    </div>
                                ))}
                                <div className="flex items-center">
                                    <Controller
                                        name="wordbook"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="radio"
                                                value="new"
                                                checked={field.value === 'new'}
                                                onChange={(e) => setSelectedWordBook(e.target.value)}
                                            />
                                        )}
                                    />
                                    <label className="ml-2">새 단어장</label>
                                    {selectedWordBook === 'new' && (
                                        <input
                                            type="text"
                                            value={newWordBook}
                                            onChange={(e) => setNewWordBook(e.target.value)}
                                            className="ml-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
                                        />
                                    )}
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-blue-500 text-white py-1 rounded">
                                저장하기
                            </button>
                        </form>
                    }
                    direction="down"
                    tagName="span"
                    className="relative z-50"
                    eventOn="click"
                    eventOff="click"
                    tipContentClassName=""
                >
                    <FontAwesomeIcon icon={faSave} className="text-white cursor-pointer" style={{ width: 24, height: 24 }} />
                </Tooltip>
            </div>
        </div>
    );
};

export default DictionaryCard;
