import React, { useState, useRef, useEffect } from 'react';
import * as wanakana from 'wanakana';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { saveWord, getAllWordBookNames } from '~shared/indexDB/dictionary';
import type { JishoResult } from '~shared/types/jishoTypes';
import { useForm, Controller } from 'react-hook-form';
const DictionaryCard = ({ data }: { data: JishoResult }) => {
    const { control, handleSubmit, reset } = useForm();
    const [showFullMeaning, setShowFullMeaning] = useState(false);
    const [wordBooks, setWordBooks] = useState<string[]>([]);
    const [selectedWordBook, setSelectedWordBook] = useState<string>('Default word');
    const [newWordBook, setNewWordBook] = useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const meaningRef = useRef<HTMLDivElement>(null);
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
        setIsDropdownOpen(false); // Close dropdown after saving
    };

    const renderMeaning = (meanings: string[]) => {
        const joinedMeanings = meanings.join(", ");
        return (
            <div>
                <div ref={meaningRef} className={`overflow-hidden ${showFullMeaning ? 'max-h-full overflow-y-auto' : 'max-h-[4.5em] overflow-hidden'}`}>
                    <p className="text-ellipsis" style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: showFullMeaning ? 'none' : '3', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {joinedMeanings}
                    </p>
                </div>
                {isClamped && (
                    <span className="text-blue-500 cursor-pointer" onClick={toggleShowFullMeaning}>
                        {' '}
                        {showFullMeaning ? '간략히 보기' : '더보기'}
                    </span>
                )}
            </div>
        );
    };
    const SaveButton = () => {
        return (
            <span
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`inline-flex items-center justify-center cursor-pointer px-2 py-1 rounded ${isDropdownOpen ? 'bg-gray-200' : 'bg-white'} hover:bg-gray-300`}
            >
                <span className="text-sm text-blue-500">Save</span>
                <FontAwesomeIcon icon={faPlus} className="ml-1 text-blue-500" style={{ width: 16, height: 16 }} />
            </span>
        )
    }
    const dataCard = (data: JishoResult) => {
        switch (data.type) {
            case "kanji":
                return (
                    <>
                        <div className="flex-none text-6xl font-bold text-center w-1/3 h-full flex flex-col justify-between">
                            <div className="flex-grow flex items-center justify-center">{data.text}</div>
                            <SaveButton />
                        </div>
                        <div className="flex-1">
                            {renderMeaning(data.meanings)}
                            <div className="text-sm text-gray-400 space-y-1">
                                <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><strong>On:</strong> {data.onyomi?.join(", ")} ({wanakana.toRomaji(data.onyomi?.join(", "))})</p>
                                <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><strong>Kun:</strong> {data.kunyomi?.join(", ")} ({wanakana.toRomaji(data.kunyomi?.join(", "))})</p>
                                {data.jlpt && <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><strong>JLPT:</strong> {data.jlpt}</p>}
                            </div>
                        </div>
                    </>
                );
            case "phrase":
                return (
                    <>
                        <div className="flex-none text-2xl font-bold text-center w-1/3 h-full flex flex-col justify-between">
                            <div className="flex-grow flex items-center justify-center">{data.text}</div>
                            <SaveButton />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-400 mb-2" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{data.reading} ({wanakana.toRomaji(data.reading)})</p>
                            {renderMeaning(data.meanings.map((sense: any) => sense.english_definitions.join(", ")))}
                        </div>
                    </>
                );
            case "gpt-explain":
                return (
                    <>
                        <div className="flex-none text-2xl font-bold text-center w-1/3 h-full flex flex-col justify-between">
                            <div className="flex-grow flex items-center justify-center">{data.text}</div>
                            <SaveButton />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-400 mb-2" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{data.reading} ({wanakana.toRomaji(data.reading)})</p>
                            {renderMeaning(data.meanings)}
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="snap-center p-4 bg-gray-800 rounded-lg shadow-md flex items-center space-x-4 h-[150px]">
            {dataCard(data)}
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <div className="flex justify-between p-2 border-b border-gray-200">
                        <h3 className="text-gray-700">단어장 선택</h3>
                        <button onClick={() => setIsDropdownOpen(false)}>
                            <FontAwesomeIcon icon={faTimes} className="text-gray-700" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-2">
                        <div className="mb-2">
                            {wordBooks.map((wordbook, index) => (
                                <div key={index} className="flex items-center mb-1">
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
                                    <label className="ml-2 text-gray-700">{wordbook}</label>
                                </div>
                            ))}
                            <div className="flex items-center mb-1">
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
                                <label className="ml-2 text-gray-700">새 단어장</label>
                                {selectedWordBook === 'new' && (
                                    <input
                                        type="text"
                                        value={newWordBook}
                                        onChange={(e) => setNewWordBook(e.target.value)}
                                        className="ml-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-black"
                                    />
                                )}
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white py-1 rounded">
                            저장하기
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default DictionaryCard;
